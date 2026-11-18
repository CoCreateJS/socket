import { performance } from 'node:perf_hooks';
import { encode as cborEncode, decode as cborDecode } from 'cbor-x';
import { encode as cosonEncode, decode as cosonDecode } from '@cocreate/coson';
import { BinaryReceiver, createFrames } from '../src/binary.js';

const runs = Number(process.env.BENCH_RUNS || 300);
const small = {
    method: 'object.update',
    organization_id: 'org-123',
    text: 'Unicode payload: Καλημέρα 世界 🌍',
    timestamp: new Date(1730000000000),
    values: Array.from({ length: 32 }, (_, index) => ({ index, enabled: index % 2 === 0 }))
};
const large = { ...small, data: new Uint8Array(1024 * 1024).map((_, index) => index & 255) };

function measure(name, operation, iterations = runs) {
    for (let i = 0; i < Math.min(iterations, 20); i++) operation();
    globalThis.gc?.();
    const before = process.memoryUsage();
    let peakHeapUsed = before.heapUsed;
    let peakArrayBuffers = before.arrayBuffers;
    const start = performance.now();
    for (let i = 0; i < iterations; i++) {
        operation();
        if (i % 10 === 0) {
            const memory = process.memoryUsage();
            peakHeapUsed = Math.max(peakHeapUsed, memory.heapUsed);
            peakArrayBuffers = Math.max(peakArrayBuffers, memory.arrayBuffers);
        }
    }
    const ms = performance.now() - start;
    return {
        name, iterations, totalMs: +ms.toFixed(2),
        usEach: +(ms * 1000 / iterations).toFixed(2),
        opsPerSecond: Math.round(iterations * 1000 / ms),
        peakHeapDeltaBytes: peakHeapUsed - before.heapUsed,
        peakArrayBufferDeltaBytes: peakArrayBuffers - before.arrayBuffers
    };
}

function forwardCoSON(value) {
    const prepared = cosonDecode(cosonEncode(value, { operators: true }), { operators: false });
    return cosonDecode(cosonEncode(prepared, { operators: false }), { operators: false });
}

function transport(value, encode, decode) {
    const wire = encode(value);
    const receiver = new BinaryReceiver();
    let complete;
    for (const chunk of createFrames(wire, 64 * 1024)) complete = receiver.push(chunk) || complete;
    if (!complete) throw new Error('transport did not reassemble');
    const result = decode(complete);
    receiver.release(complete);
    return result;
}

function chunkAndReassemble(bytes) {
    const receiver = new BinaryReceiver();
    let complete;
    for (const chunk of createFrames(bytes, 64 * 1024)) complete = receiver.push(chunk) || complete;
    if (!complete) throw new Error('chunking did not reassemble');
    receiver.release(complete);
}

const smallCbor = cborEncode(small);
const smallCoson = cosonEncode(small, { operators: true });
const largeCbor = cborEncode(large);
const largeCoson = cosonEncode(large, { operators: true });
const prepared = cosonDecode(smallCoson, { operators: false });
const cborForward = () => cborEncode(cborDecode(smallCbor));

const results = [
    measure('CBOR-X encode small', () => cborEncode(small)),
    measure('CoSON encode small native', () => cosonEncode(small, { operators: true })),
    measure('CBOR-X decode small', () => cborDecode(smallCbor)),
    measure('CoSON decode small native', () => cosonDecode(smallCoson, { operators: true })),
    measure('CBOR-X forwarding small decode+encode', cborForward),
    measure('CoSON forwarding small operators:false', () => cosonDecode(cosonEncode(prepared, { operators: false }), { operators: false })),
    measure('CBOR-X encode 1 MiB binary', () => cborEncode(large), 30),
    measure('CoSON encode 1 MiB binary', () => cosonEncode(large, { operators: true }), 30),
    measure('CBOR-X decode 1 MiB binary', () => cborDecode(largeCbor), 30),
    measure('CoSON decode 1 MiB binary', () => cosonDecode(largeCoson, { operators: true }), 30),
    measure('CBOR-X chunk+reassembly overhead 1 MiB', () => chunkAndReassemble(largeCbor), 30),
    measure('CoSON chunk+reassembly overhead 1 MiB', () => chunkAndReassemble(largeCoson), 30),
    measure('CBOR-X socket transport 1 MiB, chunk+reassemble+decode', () => transport(large, cborEncode, cborDecode), 10),
    measure('CoSON socket transport 1 MiB, chunk+reassemble+decode', () => transport(
        large,
        value => cosonEncode(value, { operators: true }),
        bytes => cosonDecode(bytes, { operators: true })
    ), 10)
];

console.log(JSON.stringify({
    node: process.version,
    runs,
    bytes: {
        cborSmall: smallCbor.byteLength,
        cosonSmall: smallCoson.byteLength,
        cborLarge: largeCbor.byteLength,
        cosonLarge: largeCoson.byteLength,
        cosonChunkedMessagesAt64KiB: [...createFrames(largeCoson, 64 * 1024)].length
    },
    memoryBefore: process.memoryUsage(),
    results,
    memoryAfter: process.memoryUsage(),
    note: 'Single-process microbenchmark. Transportation latency simulates frame encoding, socket chunking/reassembly and decode without network I/O. Memory peaks are sampled every ten operations and are approximate, not isolated per-operation allocations.'
}, null, 2));
