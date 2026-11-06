import { test } from 'node:test';
import assert from 'node:assert/strict';
import { EventEmitter } from 'node:events';
import { SocketServer } from '../../src/server/index.js';
import Sockets from '../../src/server/sockets.js';

function fixture(t) {
    t.mock.timers.enable({ apis: ['setTimeout'] });
    const manager = new EventEmitter();
    Object.setPrototypeOf(manager, SocketServer.prototype);
    Object.assign(manager, {
        server: {}, workerId: 1, organizations: new Map(), organizationBalances: new Map(),
        clients: new Map(), sockets: new Map(), users: new Map()
    });
    const sockets = new Sockets(manager);
    function socket(id, clientId = 'client', organization_id = 'org') {
        const socket = new EventEmitter();
        Object.assign(socket, {
            id, clientId, organization_id, readyState: 1,
            send() {}, close(code) { this.closeCode = code; this.emit('close'); },
            terminate() { this.emit('close'); }
        });
        return socket;
    }
    return { manager, sockets, socket };
}

test('socket collection shares indexes, protects identity, and preserves metadata references', t => {
    const f = fixture(t);
    const socket = f.socket('one');
    assert.equal(f.sockets.add(socket), socket);
    assert.equal(f.sockets.add(socket), socket);
    assert.equal(f.sockets.size, 1);
    f.sockets.set('one', { label: 'first', id: 'wrong', clientId: 'wrong', user_id: 'wrong', subscriptionKeys: new Set(), close: null });
    f.sockets.set('one', { label: 'second' });
    assert.equal(socket.label, 'second');
    assert.equal(socket.id, 'one');
    assert.equal(socket.clientId, 'client');
    assert.equal(socket.user_id, undefined);
    assert.equal(socket.subscriptionKeys, undefined);
    assert.equal(typeof socket.close, 'function');
    assert.equal(f.manager.sockets.get('one'), socket);
    assert.deepEqual([...f.sockets], [['one', socket]]);
    assert.equal(f.sockets.clients.get('client').get('one'), socket);
    assert.equal(f.sockets.organizations.get('org').clients.get('client').get('one'), socket);
    assert.throws(() => f.sockets.add(f.socket('one')), /already exists/);
    assert.equal(f.sockets.size, 1);
});

test('nested client deletion cleans subscriptions without affecting another organization', t => {
    const f = fixture(t);
    const first = f.socket('one');
    const other = f.socket('two', 'client', 'other');
    f.sockets.clients.add(first);
    const org = f.sockets.organizations.add(other);
    f.manager.subscribe(first, 'updates');
    assert.equal(org, f.sockets.organizations.get('other'));
    const clients = f.sockets.organizations.get('org').clients;
    assert.throws(() => clients.add(f.socket('wrong', 'client', 'other')), /does not belong/);
    clients.delete('client');
    assert.equal(first.closeCode, 1000);
    assert.equal(f.sockets.get('one'), undefined);
    assert.equal(f.sockets.get('two'), other);
    assert.equal(f.sockets.clients.get('client').size, 1);
    assert.equal(f.sockets.organizations.get('org').subscriptions.size, 0);
    t.mock.timers.tick(60000);
    assert.equal(f.sockets.organizations.has('org'), false);
    assert.equal(f.sockets.organizations.has('other'), true);
});

test('organization deletion closes all its sockets and emits one disconnect', t => {
    const f = fixture(t);
    const events = [];
    const listener = id => events.push(id);
    process.on('orgDisconnected', listener);
    t.after(() => process.off('orgDisconnected', listener));
    f.sockets.add(f.socket('one'));
    f.sockets.add(f.socket('two', 'other-client'));
    f.sockets.organizations.delete('org');
    assert.equal(f.sockets.size, 0);
    assert.equal(f.sockets.clients.size, 0);
    assert.equal(f.sockets.organizations.size, 0);
    f.sockets.organizations.delete('org');
    t.mock.timers.tick(60000);
    assert.deepEqual(events, ['org']);
});

test('send delegates to the existing delivery implementation', t => {
    const f = fixture(t);
    const payload = { organization_id: 'org', method: 'object.read' };
    const result = Promise.resolve('sent');
    t.mock.method(f.manager, 'send', data => { assert.equal(data, payload); return result; });
    assert.equal(f.sockets.send(payload), result);
});

test('natural close and reconnect retain one presence transition through the grace period', t => {
    const f = fixture(t);
    const events = [];
    const listener = id => events.push(id);
    process.on('orgConnected', listener);
    t.after(() => process.off('orgConnected', listener));
    const first = f.socket('one');
    f.sockets.add(first);
    first.emit('close');
    assert.equal(f.sockets.size, 0);
    f.sockets.add(f.socket('two'));
    t.mock.timers.tick(60000);
    assert.deepEqual(events, ['org']);
    assert.equal(f.sockets.organizations.size, 1);
    assert.equal(f.sockets.organizations.get('org').clients.get('client').size, 1);
});
