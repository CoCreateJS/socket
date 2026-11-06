import { test } from 'node:test';
import assert from 'node:assert/strict';
import { WebSocketServer } from 'ws';
import { SocketClient } from '../../src/client/index.js';

test('client indexes the same socket by URL and ID and deletes both references', () => {
    const socket = {
        id: 'indexed-socket', url: 'ws://localhost/indexed-test', readyState: 1,
        close() { this.readyState = 3; }
    };
    try {
        SocketClient.set(socket);
        assert.equal(SocketClient.get(socket.id), socket);
        assert.equal(SocketClient.get(socket.url), socket);
        SocketClient.delete(socket.id);
        assert.equal(socket.readyState, 3);
        assert.equal(SocketClient.has(socket.id), false);
        assert.equal(SocketClient.has(socket.url), false);
    } finally {
        SocketClient.delete(socket.url);
    }
});

for (const denied of [false, true]) {
    test(`client waits for the ready frame and ${denied ? 'returns the error envelope' : 'resolves its correlated response'}`, { timeout: 5000 }, async t => {
        await SocketClient.init();
        if (denied) t.mock.method(console, 'error', () => {});
        const server = new WebSocketServer({ port: 0, host: '127.0.0.1' });
        await new Promise(resolve => server.once('listening', resolve));
        const host = `ws://127.0.0.1:${server.address().port}`;
        const organization_id = `client-test-${denied}`;
        const url = `${host}/${organization_id}`;
        t.after(async () => {
            const socket = SocketClient.get(url);
            if (socket) {
                // Teardown must not start a reconnect cycle after the test.
                socket.onclose = null;
                socket.onerror = null;
                socket.terminate();
                SocketClient.delete(url);
            }
            for (const socket of server.clients) socket.terminate();
            await new Promise(resolve => server.close(resolve));
        });
        const requests = [];
        let earlyRequests = 0;
        server.on('connection', socket => {
            let ready = false;
            const timer = setTimeout(() => {
                ready = true;
                socket.send(JSON.stringify({ method: 'connect', connectedKey: `/${organization_id}` }));
            }, 30);
            socket.on('close', () => clearTimeout(timer));
            socket.on('message', message => {
                if (!ready) earlyRequests++;
                const request = JSON.parse(message);
                requests.push(request);
                socket.send(JSON.stringify({
                    ...request, broadcastSender: false,
                    ...(denied ? { error: 'read denied' } : { object: [{ _id: 'local-test' }] })
                }));
            });
        });
        const pending = SocketClient.send({
            method: 'object.read', host, organization_id,
            array: 'socket_test', broadcast: false
        });
        const response = await pending;
        if (denied) {
            assert.equal(response.error, 'read denied');
        } else {
            assert.deepEqual(response.object, [{ _id: 'local-test' }]);
        }
        assert.equal(response.uuid, requests[0].uuid);
        assert.equal(earlyRequests, 0);
        assert.equal(requests.length, 1);
        assert.equal(requests[0].organization_id, organization_id);
        assert.equal(requests[0].clientId, SocketClient.clientId);
        assert.equal(requests[0].frameId, SocketClient.frameId);
        assert.equal(typeof requests[0].uuid, 'string');
        const socket = SocketClient.get(url);
        assert.equal(SocketClient.get(socket.id), socket);
    });
}
