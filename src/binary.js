import { decode, encode } from "@cocreate/coson";
import config from "@cocreate/config";

const MAGIC = new Uint8Array([0x43, 0x43, 0x53, 0x31]); // CCS1
const SINGLE = 0;
const CHUNK = 1;
const HEADER_SIZE = 25;
const MAX_TRANSFER_SIZE = 256 * 1024 * 1024;
const MAX_BUFFERED_SIZE = 512 * 1024 * 1024;
const MAX_CONCURRENT_TRANSFERS = 16;
const TRANSFER_TIMEOUT = 60_000;
let nextTransferId = 1;

export function serialize(value, options = { operators: true }) {
    return encode(value, options);
}

export function deserialize(value, options = { operators: true }) {
    return decode(toUint8Array(value), options);
}

export function getChunkSize() {
    const value = config.get("socket.chunkSize");
    const kib = value == null ? 64 : Number(value);
    if (!Number.isInteger(kib) || kib < 16 || kib > 1024) {
        throw new RangeError("socket.chunkSize must be an integer from 16 to 1024 KiB");
    }
    return kib * 1024;
}

function toUint8Array(value) {
    if (value instanceof Uint8Array) return value;
    if (value instanceof ArrayBuffer) return new Uint8Array(value);
    if (ArrayBuffer.isView(value)) {
        return new Uint8Array(value.buffer, value.byteOffset, value.byteLength);
    }
    if (typeof Blob !== "undefined" && value instanceof Blob) {
        throw new TypeError("Blob payloads must be converted asynchronously before decoding");
    }
    throw new TypeError("Socket payload must be binary");
}

function frame(payload, type, id = 0, offset = 0, total = payload.byteLength) {
    const result = new Uint8Array(HEADER_SIZE + payload.byteLength);
    result.set(MAGIC);
    result[4] = type;
    const view = new DataView(result.buffer);
    view.setUint32(5, id);
    view.setBigUint64(9, BigInt(offset));
    view.setBigUint64(17, BigInt(total));
    result.set(payload, HEADER_SIZE);
    return result;
}

export function* createFrames(payload, chunkSize = getChunkSize()) {
    payload = toUint8Array(payload);
    if (payload.byteLength > MAX_TRANSFER_SIZE) {
        throw new RangeError(`Socket transfer exceeds ${MAX_TRANSFER_SIZE} bytes`);
    }
    if (payload.byteLength <= chunkSize) {
        yield payload;
        return;
    }

    const id = nextTransferId++ >>> 0;
    if (nextTransferId > 0xffffffff) nextTransferId = 1;
    for (let offset = 0; offset < payload.byteLength; offset += chunkSize) {
        yield frame(
            payload.subarray(offset, Math.min(offset + chunkSize, payload.byteLength)),
            CHUNK,
            id,
            offset,
            payload.byteLength
        );
    }
}

export async function sendBinary(socket, value, options = { operators: true }) {
    const bytes = serialize(value, options);
    const chunkSize = getChunkSize();
    const bufferedLimit = Math.max(chunkSize * 2, 128 * 1024);
    let transmittedBytes = 0;

    for (const data of createFrames(bytes, chunkSize)) {
        while ((socket.bufferedAmount || 0) > bufferedLimit) {
            await new Promise(resolve => setTimeout(resolve, 10));
        }
        await new Promise((resolve, reject) => {
            try {
                if (socket.send.length >= 2) {
                    socket.send(data, error => error ? reject(error) : resolve());
                } else {
                    socket.send(data);
                    resolve();
                }
            } catch (error) {
                reject(error);
            }
        });
        transmittedBytes += data.byteLength;
    }
    return transmittedBytes;
}

export class BinaryReceiver {
    constructor() {
        this.transfers = new Map();
        this.leases = new WeakMap();
        this.bufferedBytes = 0;
    }

    clear() {
        for (const transfer of this.transfers.values()) clearTimeout(transfer.timeout);
        this.transfers.clear();
        this.bufferedBytes = 0;
    }

    push(value) {
        const bytes = toUint8Array(value);
        // Unchunked CoSON frames travel directly. CCS1 is only the socket's
        // chunk transport envelope and is removed after reassembly.
        if (bytes.byteLength < HEADER_SIZE || !MAGIC.every((byte, i) => bytes[i] === byte)) {
            if (!bytes.byteLength || bytes.byteLength > MAX_TRANSFER_SIZE ||
                this.bufferedBytes + bytes.byteLength > MAX_BUFFERED_SIZE) {
                throw new RangeError("Invalid or oversized CoSON socket frame");
            }
            this.bufferedBytes += bytes.byteLength;
            this.leases.set(bytes, bytes.byteLength);
            return bytes;
        }
        const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
        const type = bytes[4];
        const id = view.getUint32(5);
        const offset = Number(view.getBigUint64(9));
        const total = Number(view.getBigUint64(17));
        const data = bytes.subarray(HEADER_SIZE);

        if (!Number.isSafeInteger(total) || total > MAX_TRANSFER_SIZE ||
            !Number.isSafeInteger(offset) || offset + data.byteLength > total) {
            throw new RangeError("Invalid CoCreate socket transfer bounds");
        }
        if (type === SINGLE) {
            if (offset || total !== data.byteLength) throw new TypeError("Invalid single socket frame");
            if (this.bufferedBytes + total > MAX_BUFFERED_SIZE) {
                throw new RangeError("Socket aggregate buffer capacity exceeded");
            }
            this.bufferedBytes += total;
            this.leases.set(data, total);
            return data;
        }
        if (type !== CHUNK || total === 0) throw new TypeError("Invalid CoCreate socket frame type");

        let transfer = this.transfers.get(id);
        if (!transfer) {
            if (offset !== 0 || this.transfers.size >= MAX_CONCURRENT_TRANSFERS ||
                this.bufferedBytes + total > MAX_BUFFERED_SIZE) {
                throw new RangeError("Socket transfer capacity exceeded or first chunk missing");
            }
            transfer = { total, buffer: new Uint8Array(total), received: 0, timeout: null };
            transfer.timeout = setTimeout(() => this.delete(id), TRANSFER_TIMEOUT);
            this.transfers.set(id, transfer);
            this.bufferedBytes += total;
        }
        if (transfer.total !== total || offset !== transfer.received) {
            this.delete(id);
            throw new TypeError("Socket chunks are invalid, duplicated, or incomplete");
        }
        transfer.buffer.set(data, offset);
        transfer.received += data.byteLength;
        if (transfer.received < total) return null;

        if (transfer.received !== total) {
            this.delete(id);
            throw new TypeError("Socket transfer length mismatch");
        }
        const result = transfer.buffer;
        clearTimeout(transfer.timeout);
        this.transfers.delete(id);
        this.leases.set(result, transfer.total);
        return result;
    }

    release(payload) {
        const size = this.leases.get(payload);
        if (size === undefined) return;
        this.leases.delete(payload);
        this.bufferedBytes -= size;
    }

    delete(id) {
        const transfer = this.transfers.get(id);
        if (!transfer) return;
        clearTimeout(transfer.timeout);
        this.transfers.delete(id);
        this.bufferedBytes -= transfer.total;
    }
}
