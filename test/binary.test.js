import { test } from 'node:test';
import assert from 'node:assert/strict';
import Config from '@cocreate/config';
import { BinaryReceiver, createFrames, deserialize, getChunkSize, serialize } from '../src/binary.js';
import { SocketServer } from '../src/server/index.js';

test('binary serialization preserves nested application values and binary types', () => {
    const value = {
        string: 'hello', number: 12.5, boolean: true, nil: null, missing: undefined,
        nan: NaN, infinity: Infinity, bigint: 2n ** 80n, date: new Date(1234),
        bytes: new Uint8Array([1, 2, 3]), buffer: new Uint16Array([4, 5]),
        nested: [{ value: 'ok' }]
    };
    const bytes = serialize(value);
    assert.ok(bytes instanceof Uint8Array);
    const result = deserialize(bytes);
    assert.equal(result.string, value.string);
    assert.equal(result.number, value.number);
    assert.equal(result.boolean, value.boolean);
    assert.equal(result.nil, null);
    assert.equal(result.missing, undefined);
    assert.ok(Number.isNaN(result.nan));
    assert.equal(result.infinity, Infinity);
    assert.equal(result.bigint, value.bigint);
    assert.equal(result.date.getTime(), value.date.getTime());
    assert.deepEqual(result.bytes, value.bytes);
    assert.deepEqual(result.buffer, value.buffer);
    assert.deepEqual(result.nested, value.nested);
});

test('socket payloads fitting the configured limit use one binary frame', () => {
    const frames = [...createFrames(serialize({ method: 'object.read' }), 16 * 1024)];
    assert.equal(frames.length, 1);
    assert.equal(frames[0][4], 0);
});

test('socket chunk size uses the shared config in KiB and rejects invalid values', t => {
    let value = '128';
    t.mock.method(Config, 'get', key => key === 'socket.chunkSize' ? value : null);
    assert.equal(getChunkSize(), 128 * 1024);
    value = 15;
    assert.throws(() => getChunkSize(), /socket.chunkSize/);
});

test('socket chunk frames reassemble multiple interleaved transfers', () => {
    const receiver = new BinaryReceiver();
    const firstValue = { data: 'a'.repeat(20_000) };
    const secondValue = { data: 'b'.repeat(20_000) };
    const firstFrames = [...createFrames(serialize(firstValue), 1024)];
    const secondFrames = [...createFrames(serialize(secondValue), 1024)];
    assert.ok(firstFrames.length > 1);
    const completed = [];
    for (let i = 0; i < firstFrames.length; i++) {
        const first = receiver.push(firstFrames[i]);
        const second = receiver.push(secondFrames[i]);
        if (first) {
            completed.push(deserialize(first));
            receiver.release(first);
        }
        if (second) {
            completed.push(deserialize(second));
            receiver.release(second);
        }
    }
    assert.equal(receiver.transfers.size, 0);
    assert.equal(receiver.bufferedBytes, 0);
    assert.deepEqual(completed, [firstValue, secondValue]);
});

test('socket receiver rejects malformed and incomplete chunk sequences', () => {
    const receiver = new BinaryReceiver();
    const [first] = createFrames(serialize({ data: 'x'.repeat(20_000) }), 1024);
    receiver.push(first);
    assert.throws(() => receiver.push(first), /invalid|duplicated|incomplete/i);
    assert.equal(receiver.transfers.size, 0);
    receiver.clear();
});

test('Socket Server reassembles and deserializes incoming application payloads', async () => {
    const manager = Object.create(SocketServer.prototype);
    manager.server = { usage: { send() {} } };
    const received = [];
    manager.Message = async (_socket, data) => received.push(data);
    const socket = { binaryReceiver: new BinaryReceiver(), organization_id: 'org' };
    const value = { method: 'object.create', object: { value: 'x'.repeat(20_000) } };
    for (const frame of createFrames(serialize(value), 1024)) {
        await manager.onMessage(socket, frame, true);
    }
    assert.deepEqual(received, [value]);
    socket.binaryReceiver.clear();
});
