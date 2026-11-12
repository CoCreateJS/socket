import assert from 'node:assert/strict';
import { EventEmitter } from 'node:events';
import { mkdtemp, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import test from 'node:test';
import Config from '@cocreate/config';
import { initializeServerDB } from '../../../db/src/server.js';
import { SocketServer } from '../../src/server/index.js';

const organization_id = '000000000000000000000001';
const scope = { organization_id, storage: 'production', database: 'app', array: 'items' };
async function fixture(t) {
    t.mock.method(Config, 'prompt', async () => ({}));
    const previous = new Map(['socket.destroyAll', 'socket.destroyOrgs', 'organization.balance'].map(event => [event, process.listeners(event)]));
    const directory = await mkdtemp(join(tmpdir(), 'socket-distribution-'));
    const server = Object.assign(new EventEmitter(), { id: 'node', workerId: 1, isPrimary: true, workers: new Map(),
        cluster: Object.assign(new EventEmitter(), { send() {} }), usage: { send() {} } });
    const controls = [];
    server.send = async payload => { controls.push(payload); return payload; };
    const db = initializeServerDB(server, { directory, writeBehind: false });
    const socket = new SocketServer(server);
    server.socket = socket;
    const messages = new Map();
    const clients = new Map();
    socket.organizations.set(organization_id, { clients });
    function client(id) {
        const connection = { id: `${id}-socket`, clientId: id, organization_id, host: 'localhost', readyState: 1,
            send(payload, callback) { messages.get(id).push(JSON.parse(payload)); callback?.(); } };
        messages.set(id, []);
        clients.set(id, new Map([[connection.id, connection]]));
        socket.sockets.set(connection.id, connection);
        return connection;
    }
    server.crud = { send: async request => {
        assert.equal(request.subscription, undefined);
        const result = await db.send({ ...scope, ...request });
        await socket.send({ ...result, log: false, serverId: server.id, workerId: server.workerId });
    } };
    t.after(async () => {
        socket.close();
        await db.close();
        for (const [event, listeners] of previous)
            for (const listener of process.listeners(event)) if (!listeners.includes(listener)) process.removeListener(event, listener);
        await rm(directory, { recursive: true, force: true });
    });
    return { server, db, socket, client, messages, controls, clear() { for (const values of messages.values()) values.length = 0; } };
}

test('DB sets worker and socket distribution from ordinary CRUD; only matching clients receive changes', async t => {
    const f = await fixture(t);
    const created = await f.db.send({ ...scope, method: 'object.create', object: [{ value: 1 }, { value: 2 }] });
    const [first, second] = created.object;
    const a = f.client('a'), b = f.client('b'), c = f.client('c');
    f.client('unused');
    await f.socket.Message(a, { method: 'object.read', object: { _id: first._id } });
    const reference = f.messages.get('a')[0].distribution[0];
    assert.deepEqual([...f.socket.distribution.get(reference)], ['a']);
    assert.deepEqual([...f.server.workers.distribution.get(reference)], [1]);
    await f.socket.Message(b, { method: 'object.read', object: { _id: first._id } });
    await f.socket.Message(c, { method: 'object.read', object: { _id: second._id } });
    assert.deepEqual([...f.socket.distribution.get(reference)], ['a', 'b']);
    assert.equal(f.messages.get('a').length, 1, 'another read returns only to its requester');
    f.clear();
    await f.socket.Message(a, { method: 'object.update', object: { _id: first._id, $inc: { value: 2 } } });
    assert.equal(f.messages.get('a').length, 1);
    assert.equal(f.messages.get('b').length, 1);
    assert.equal(f.messages.get('c').length, 0);
    assert.equal(f.messages.get('unused').length, 0);
    assert.equal(f.messages.get('b')[0].method, 'object.update');
    assert.equal(f.messages.get('b')[0].object[0].$set.value, 3);
    assert.ok([...f.messages.values()].flat().every(message => message.method !== 'db.distribution.set'));
})

test('empty list reads receive future creates and recipient authorization still applies', async t => {
    const f = await fixture(t);
    await f.db.send({ ...scope, method: 'array.create' });
    const a = f.client('a'), b = f.client('b'), c = f.client('c');
    await f.socket.Message(b, { method: 'object.read', filter: { query: { value: 5 } } });
    await f.socket.Message(c, { method: 'object.read', filter: { query: { value: 5 } } });
    b.user_id = 'allowed'; c.user_id = 'denied';
    f.socket.authorize = { check: async (_, user) => user === 'denied' ? false : true };
    f.clear();
    await f.socket.Message(a, { method: 'object.create', object: { value: 5 } });
    assert.equal(f.messages.get('a').length, 1);
    assert.equal(f.messages.get('b').length, 1);
    assert.equal(f.messages.get('c').length, 0);
});

test('clients cannot inject distribution control messages or select their worker', async t => {
    const f = await fixture(t);
    const a = f.client('a');
    await f.socket.Message(a, { method: 'db.distribution.set', serverId: f.server.id,
        data: { organization_id, clientId: 'a', distribution: ['forged'] } });
    assert.equal(f.socket.distribution.has('forged'), false);
    await f.socket.Message(a, { method: 'object.create', worker: 99, workerId: 99, server: 'another-node',
        distribution: ['forged'], distributionKeys: ['forged'], object: { value: 1 } });
    assert.equal(f.messages.get('a')[0].success, true);
    assert.ok([...f.server.workers.distribution.values()].every(workers => !workers.has(99)));
});

test('Socket exposes distribution without legacy subscription methods', async t => {
    const f = await fixture(t);
    assert.ok(f.socket.distribution instanceof Map);
    for (const method of ['subscribe', 'unsubscribe', 'removeSubscriptions', 'getSubscribers']) {
        assert.equal(method in f.socket, false);
    }
});
