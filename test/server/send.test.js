import { test } from 'node:test';
import assert from 'node:assert/strict';
import { EventEmitter } from 'node:events';
import { SocketServer } from '../../src/server/index.js';

function fixture() {
    const manager = new EventEmitter();
    Object.setPrototypeOf(manager, SocketServer.prototype);
    const attempts = [];
    const usage = [];
    const clients = new Map();
    const subscriptions = new Map([['updates', new Set()]]);
    manager.organizations = new Map([['org', { clients, subscriptions }]]);
    manager.sockets = new Map();
    manager.server = { usage: { send: (data) => usage.push(data) }, send() {} };
    function socket(id, clientId = 'client', failure) {
        const socket = {
            id, clientId, organization_id: 'org', readyState: 1,
            send(payload, callback) {
                attempts.push(id);
                assert.equal(JSON.parse(payload).socket, undefined);
                if (failure === 'throw') throw new Error('write failed');
                setImmediate(() => callback(failure ? new Error('write failed') : undefined));
            }
        };
        if (!clients.has(clientId)) clients.set(clientId, new Map());
        clients.get(clientId).set(id, socket);
        manager.sockets.set(id, socket);
        return socket;
    }
    async function send(extra = {}) {
        let notification;
        manager.once('notification', (data) => { notification = data; });
        await manager.send({ method: 'object.read', organization_id: 'org', ...extra });
        return notification.sent;
    }
    return { manager, attempts, usage, clients, subscriptions, socket, send };
}

test('requesting socket wins over older tabs, with one write per client', async () => {
    const f = fixture();
    f.socket('older');
    const origin = f.socket('origin');
    f.socket('other', 'other-client');
    assert.deepEqual(await f.send({ socketId: origin.id, broadcast: true }), ['client', 'other-client']);
    assert.deepEqual(f.attempts, ['origin', 'other']);
    assert.equal(f.usage.length, 2);
});

for (const failure of ['closed', 'callback', 'throw']) {
    test(`falls back after ${failure} failure and stops after success`, async (t) => {
        t.mock.method(console, 'error', () => {});
        const f = fixture();
        f.socket('fallback');
        f.socket('unused');
        const origin = f.socket('origin', 'client', failure);
        if (failure === 'closed') origin.readyState = 3;
        assert.deepEqual(await f.send({ socketId: origin.id }), ['client']);
        assert.deepEqual(f.attempts, failure === 'closed' ? ['fallback'] : ['origin', 'fallback']);
        assert.equal(f.usage.length, 1);
    });
}

test('subscription delivery includes the origin and uses other tabs as fallback', async () => {
    const f = fixture();
    f.socket('fallback');
    const origin = f.socket('origin', 'client', 'callback');
    f.socket('subscriber', 'other-client');
    f.socket('unrelated', 'unrelated-client');
    f.subscriptions.get('updates').add('subscriber');
    assert.deepEqual(await f.send({ socketId: origin.id, subscriptionKeys: ['updates'] }), ['other-client', 'client']);
    assert.deepEqual(f.attempts, ['subscriber', 'origin', 'fallback']);
});

test('subscription ordering cannot select an older tab before the origin', async () => {
    const f = fixture();
    f.socket('older');
    const origin = f.socket('origin');
    f.subscriptions.get('updates').add('older');
    f.subscriptions.get('updates').add('origin');
    await f.send({ socketId: origin.id, subscriptionKeys: ['updates'] });
    assert.deepEqual(f.attempts, ['origin']);
});

test('failed writes are not counted as delivery', async () => {
    const f = fixture();
    const origin = f.socket('origin', 'client', 'callback');
    f.socket('fallback', 'client', 'callback');
    assert.deepEqual(await f.send({ socketId: origin.id }), []);
    assert.equal(f.usage.length, 0);
});

test('direct client ID delivery also stops after the first success', async () => {
    const f = fixture();
    f.socket('first');
    f.socket('unused');
    assert.deepEqual(await f.send({ clientId: 'client' }), ['client']);
    assert.deepEqual(f.attempts, ['first']);
});

for (const lookup of ['no matches', 'no subscriptions', 'no organization', 'unregistered broadcast']) {
    test(`requester remains a recipient with ${lookup}`, async () => {
        const f = fixture();
        const origin = f.socket('origin');
        const data = { socketId: origin.id, subscriptionKeys: ['missing'] };
        if (lookup === 'no subscriptions') {
            delete f.manager.organizations.get('org').subscriptions;
        } else if (lookup === 'no organization') {
            f.manager.organizations.clear();
        } else if (lookup === 'unregistered broadcast') {
            f.clients.clear();
            delete data.subscriptionKeys;
            data.broadcast = true;
        }
        assert.deepEqual(await f.send(data), ['client']);
        assert.deepEqual(f.attempts, ['origin']);
    });
}

test('socket send is local-only, resolves undefined, and preserves the routing envelope', async () => {
    const f = fixture();
    const socket = f.socket('one');
    Object.assign(f.manager.server, { id: 'node', workerId: 1, cluster_id: 'local-cluster' });
    const write = socket.send;
    socket.send = (payload, callback) => {
        const message = JSON.parse(payload);
        for (const field of ['serverId', 'workerId', 'clusterId']) assert.equal(field in message, false);
        write(payload, callback);
    };
    f.manager.server.send = () => assert.fail('Socket transport must never call server.send');
    const data = { method: 'object.read', organization_id: 'org', clientId: 'client',
        filter: { query: { _id: { $eq: '$user_id' } } } };
    assert.equal(await f.manager.send(data), undefined);
    assert.deepEqual(data.filter.query, { _id: { $eq: '$user_id' } });
    assert.deepEqual(f.attempts, ['one']);
});

test('incoming cursor dispatch enters server.send instead of raw socket delivery', async () => {
    const f = fixture();
    const socket = f.socket('one');
    const routed = [];
    f.manager.server.send = data => routed.push(data);
    f.manager.send = () => assert.fail('Incoming component messages must enter server.send');
    const data = { method: 'cursor', organization_id: 'org' };
    await f.manager.Message(socket, data);
    assert.deepEqual(routed, [data]);
});

test('incoming messages replace client-supplied identity with accepted socket values', async () => {
    const f = fixture();
    const socket = f.socket('trusted-socket', 'trusted-client');
    Object.assign(socket, { user_id: 'trusted-user', host: 'trusted.example' });
    const received = [];
    f.manager.authorize = {
        check: async (data, userId) => {
            received.push({ data, userId });
            return true;
        }
    };
    f.manager.on('api', data => received.push({ routed: data }));
    const data = {
        api: 'example',
        user_id: 'forged-user',
        socketId: 'forged-socket',
        clientId: 'forged-client',
        organization_id: 'forged-org',
        host: 'forged.example',
        socket: { user_id: 'forged-socket-user', id: 'forged-socket' },
        replyOrganizationId: 'forged-org'
    };

    await f.manager.Message(socket, data);

    assert.equal(received[0].userId, 'trusted-user');
    assert.equal(received[0].data.user_id, 'trusted-user');
    assert.equal(received[0].data.socketId, 'trusted-socket');
    assert.equal(received[0].data.clientId, 'trusted-client');
    assert.equal(received[0].data.organization_id, 'org');
    assert.equal(received[0].data.replyOrganizationId, 'org');
    assert.equal(received[0].data.host, 'trusted.example');
    assert.equal(received[0].data.socket, undefined, 'Socket objects are not attached to messages');
    assert.equal(received[1].routed, data);
    assert.equal(received[1].routed.socket, undefined);
});

test('incoming unauthenticated messages cannot retain a supplied user ID', async () => {
    const f = fixture();
    const socket = f.socket('anonymous-socket', 'anonymous-client');
    const received = [];
    f.manager.authorize = {
        check: async (data, userId) => {
            received.push({ data, userId });
            return true;
        }
    };
    f.manager.on('api', data => received.push({ routed: data }));
    const data = { api: 'example', user_id: 'forged-user' };

    await f.manager.Message(socket, data);

    assert.equal(received[0].userId, undefined);
    assert.equal('user_id' in received[0].data, false);
    assert.equal(received[0].data.socketId, 'anonymous-socket');
    assert.equal(received[0].data.clientId, 'anonymous-client');
    assert.equal(received[0].data.organization_id, 'org');
});

test('activity records terminate their own logging flow', async () => {
    const f = fixture();
    const activities = [];
    const pending = [];
    f.manager.on('object.create', request => {
        activities.push(request);
        // Bound a regression instead of allowing it to recurse indefinitely.
        if (activities.length < 3) pending.push(f.manager.send({ ...request, object: [{ _id: 'activity' }] }));
    });
    await f.manager.send({ method: 'object.create', array: 'users', organization_id: 'org', object: [{ _id: 'user' }] });
    await Promise.all(pending);
    assert.equal(activities.length, 1);
    assert.equal(activities[0].log, false);
    await f.manager.send({ method: 'object.create', array: 'activities', organization_id: 'org', object: [{ _id: 'manual-activity' }] });
    assert.equal(activities.length, 1, 'Activity writes do not generate more activity writes');
});

test('storage authorization fallback preserves the trusted tenant reply scope', async () => {
    const f = fixture();
    const socket = f.socket('socket');
    f.manager.authorize = { check: async data => data.organization_id === 'org' ? { serverStorage: false } : true };
    let received;
    f.manager.on('object.read', data => { received = data; });
    const previous = process.env.organization_id;
    process.env.organization_id = 'platform';
    try {
        await f.manager.Message(socket, {
            method: 'object.read', array: 'files', replyOrganizationId: 'forged-org'
        });
        assert.equal(received.organization_id, 'platform');
        assert.equal(received.database, 'platform');
        assert.equal(received.replyOrganizationId, 'org');
        assert.equal(received.socketId, 'socket');
    } finally {
        if (previous === undefined) delete process.env.organization_id;
        else process.env.organization_id = previous;
    }
});
