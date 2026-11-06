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
    assert.deepEqual(await f.send({ socket: origin, broadcast: true }), ['client', 'other-client']);
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
        assert.deepEqual(await f.send({ socket: origin }), ['client']);
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
    assert.deepEqual(await f.send({ socket: origin, subscriptionKeys: ['updates'] }), ['other-client', 'client']);
    assert.deepEqual(f.attempts, ['subscriber', 'origin', 'fallback']);
});

test('subscription ordering cannot select an older tab before the origin', async () => {
    const f = fixture();
    f.socket('older');
    const origin = f.socket('origin');
    f.subscriptions.get('updates').add('older');
    f.subscriptions.get('updates').add('origin');
    await f.send({ socket: origin, subscriptionKeys: ['updates'] });
    assert.deepEqual(f.attempts, ['origin']);
});

test('failed writes are not counted as delivery', async () => {
    const f = fixture();
    const origin = f.socket('origin', 'client', 'callback');
    f.socket('fallback', 'client', 'callback');
    assert.deepEqual(await f.send({ socket: origin }), []);
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
        const data = { socket: origin, subscriptionKeys: ['missing'] };
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
