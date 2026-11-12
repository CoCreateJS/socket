# CoCreate Socket

Client and server WebSocket interfaces for CoCreate. Send JSON envelopes from browsers or Node.js, route them through application handlers and the server mesh, and relay responses across browser contexts.

---

## Documentation

For complete API references, protocol event schemas, configuration guides, and examples, visit the **[CoCreate Socket Documentation](https://cocreatejs.com/docs/socket)**.

## Table of Contents

- [Documentation](#documentation)
- [Client and server exports](#client-and-server-exports)
- [Client usage](#client-usage)
- [Client routing controls](#client-routing-controls)
- [Browser-context delivery](#browser-context-delivery)
- [Connection](#connection)
- [Socket collection](#socket-collection)
- [Message routing](#message-routing)
- [Client and socket selection](#client-and-socket-selection)
- [Authorization](#authorization)
- [Server mesh](#server-mesh)
- [Heartbeat and disconnection](#heartbeat-and-disconnection)
- [Installation](#installation)
- [Announcements and roadmap](#announcements-and-roadmap)
- [About](#about)
- [Tests](#tests)
- [How to Contribute](#how-to-contribute)
- [License](#license)

---

## Client and server exports

This package now contains both implementations under `src/client/` and `src/server/`. Both roles share one package and retain their own transport lifecycle.

```js
import { SocketServer, SocketClient } from "@cocreate/socket";

// Separate entry points:
import Server from "@cocreate/socket/server";
import Client from "@cocreate/socket/client";
```

The Node entry exports both roles. Browser builds resolve the client entry without loading Node server dependencies. The root default export is SocketClient for compatibility with generated CoCreate dependency loaders. The client retains its existing initialization on import. Use the server entry point to import only the server.

## Client usage

Messages use one envelope. The `method` selects the event or operation and the remaining properties contain its payload.

```js
import { SocketClient } from "@cocreate/socket";

const response = await SocketClient.send({
    method: "notification",
    message: "The workspace was updated",
    broadcast: false,
    broadcastClient: true
});
```

The socket client automatically supplies connection metadata including `clientId`, `frameId`, `socketId`, `organization_id`, `uuid`, and `timeStamp`.

## Client routing controls

-   `clientId` identifies the browser and is shared by its tabs, windows, and same-origin frames.
-   `frameId` identifies one client runtime, such as a tab, window, or iframe.
-   `socketId` identifies an individual WebSocket instance. It is generated for each socket and is not shared through session storage.
-   `broadcast` controls server delivery. `false` targets the originating or selected client; `true` targets eligible clients in the organization.
-   `broadcastClient` controls whether a received server message is relayed to the browser's other same-origin contexts.
-   `broadcastSender: false` prevents the originating frame from firing normal method listeners for the response. The response still returns and resolves its UUID promise.

The socket server sends to one connected socket for each selected `clientId`. If one socket cannot be reached, it can try another socket belonging to that client. Browser-context distribution is then handled by the client when `broadcastClient` is enabled.

## Browser-context delivery

Outgoing messages waiting for a socket connection are kept in the client's in-memory `messageQueue` Map and are sent after the server confirms the connection. They are not persisted, so a page reload discards them. Incoming messages relayed to other browser contexts are stored separately in the `localSocketMessages` array of the shared `system` IndexedDB database. The client writes the relay record ID and organization ID to the `localSocketMessage` local-storage key, allowing other contexts to retrieve the payload without being constrained by local-storage value limits.

The native `storage` event fires in the other same-origin contexts, not in the context that performed the write. The receiving contexts read the IndexedDB record and fire their local listeners. Each new relay also removes records older than five seconds.

## Connection

Initialize the socket class with a CoCreate server instance. The server supplies its HTTP and/or HTTPS upgrade source along with optional authentication, authorization, usage, and mesh services.

```js
import { SocketServer } from "@cocreate/socket";

server.socket = await SocketServer.init(server);
server.socket.on('api', server.api.send);
server.socket.on('workflow', server.workflow.run);
```

The first WebSocket URL path segment is the `organization_id`. Connection options can be supplied as query parameters or as an encoded JSON WebSocket protocol value. Socket-client supplies `socketId`, `clientId`, client information, user information, and an authentication token.

The server groups each connection as:

```text
organization_id -> clientId -> socketId -> WebSocket
```

- `clientId` identifies a browser client and may have multiple connected sockets.
- `socketId` identifies one WebSocket connection.
- `frameId` identifies the originating client runtime, but is message metadata rather than a server-side delivery selector.

## Socket collection

CoCreate Server exposes the `SocketServer` instance as `server.socket`. It owns the live indexes and delivery implementation.

```js
server.socket.get(socketId);             // Original WebSocket object.
server.socket.clients.get(clientId);     // Map of that client's sockets.
server.socket.organizations.get(organizationId);
server.socket.send(envelope);
server.socket.on('api', server.api.send);
```

`server.socket.get(socketId)` returns a raw WebSocket. The socket instance owns the `sockets`, `clients`, `organizations`, and `users` indexes; for example, `server.socket.clients.get(clientId)` returns that client's socket map. The socket instance also exposes event-emitter methods and `send()`.

Client deletion closes its sockets using the normal organization disconnect grace period. Organization deletion immediately evicts its sockets and presence. Operations preserve the existing `orgConnected` and `orgDisconnected` event flow.

## Message routing

Messages are JSON objects and must contain `method`. The same envelope is passed through application handlers and returned to clients.

```js
{
    method: "notification",
    message: "The workspace was updated",
    organization_id: "ORGANIZATION_ID",
    clientId: "CLIENT_ID",
    broadcast: false
}
```

Incoming envelopes are dispatched as follows:

- `api` envelopes emit the `api` event.
- CRUD methods beginning with `storage`, `database`, `array`, `index`, or `object` emit their complete method name.
- `crdt` and `cursor` messages enter `server.send()`.
- Other messages emit the top-level portion of `method`.

## Client and socket selection

`send(data)` resolves recipients by organization and client:

- `broadcast: true` selects every client in the organization.
- `socketId` identifies the originating socket and its client.
- A server-originated direct message can provide `clientId` as one string or an array of strings.

For each selected client, the server attempts its connected sockets in order and stops after the first successful write. The originating socket is tried first for its client, including distribution delivery. Distribution references select clients, with other sockets for those clients available as fallbacks. A write succeeds only when the WebSocket send callback reports no error. This provides socket failover without sending duplicate copies to every socket belonging to the same browser client.

`broadcastClient` and `broadcastSender` are forwarded to socket-client. Browser-context relaying and originating-frame listener suppression are handled on the client; they do not change socket selection on the server.

## Authorization

When authentication is configured, the connection token is decoded and a successfully authenticated socket receives `socket.user_id`. When authorization is configured, incoming messages are checked before dispatch and outgoing messages are checked once per selected client before a socket write is attempted.

Incoming messages receive trusted `user_id`, `socketId`, `clientId`, `organization_id`, and `host` values from the connection. A `socket` payload field has no transport meaning and is preserved as ordinary application data. Authorization receives the authenticated user separately. `replyOrganizationId` is also stamped by the server so CRUD can restore the connection's reply scope when authorization redirects an operation to platform storage; it is removed from outgoing socket messages.

Activity writes use `log: false`, and records in `activities` do not generate further activity records.

Authorization may reject a message or return an authorized envelope. The authorized envelope becomes the payload delivered to that client.

## Server mesh

Components send responses through `server.send(envelope)`. The coordinator starts
local `server.socket.send()` delivery, IPC delivery to the organization's workers,
and primary-owned `server.cluster.send()` forwarding without waiting for the
local socket loop first. Receiving workers call their local socket transport.
Socket send does not call server send, so no socket forwarding flag is needed.
`workerId` and `serverId` identify the origin to prevent duplicate delivery.

Direct `server.socket.send()` delivers only to this process's clients. Its Promise
resolves to `undefined` after local authorization and write attempts; awaiting it
does not wait for a client application response. Use `server.send()` for normal
component responses and cross-worker or peer delivery.

## Heartbeat and disconnection

The server sends WebSocket ping frames every 30 seconds. Connections that do not answer with a pong before the next heartbeat are terminated and removed from the organization, client, socket, and user maps. Reconnection and queued client messages are managed by socket-client rather than buffered by the server.

---

## Installation

### npm

```bash
npm install @cocreate/socket
```

### Yarn

```bash
yarn add @cocreate/socket
```

---

## Announcements and roadmap

Updates are recorded in [CHANGELOG.md](./CHANGELOG.md) and [GitHub releases](https://github.com/CoCreateJS/socket/releases). Follow [issues](https://github.com/CoCreateJS/socket/issues) and [pull requests](https://github.com/CoCreateJS/socket/pulls) for planned work and feedback.

## About

CoCreate Socket is maintained and funded by CoCreate and supported by the CoCreate Developer Experience Team. Contact [develop@CoCreateJS.com](mailto:develop@CoCreateJS.com) with questions. CoCreate names and logos are trademarks of CoCreate, LLC.

## Tests

Tests are grouped by transport role under `test/server/` and `test/client/`.

```bash
npm test                # Both roles.
npm run test:server     # Server collections and delivery.
npm run test:client     # Client indexes and transport round trips.
```

## How to Contribute

We encourage contributions to all CoCreate libraries. Please see our
[CONTRIBUTING.md](https://github.com/CoCreateJS/socket/blob/master/CONTRIBUTING.md)
guide for development workflows and contribution guidelines.

If you discover a bug or would like to request a feature, please open an issue on our
[GitHub Issues](https://github.com/CoCreateJS/socket/issues)
tracker.

For complete documentation, examples, and integration guides, visit:

https://cocreatejs.com/docs/socket

---

## License

This software is dual-licensed under the GNU Affero General Public License version 3 (AGPLv3) and a commercial license.

- **Open Source Use:** For open-source projects and non-commercial use, this software is available under the AGPLv3. See the LICENSE file for the complete license text.
- **Commercial Use:** Commercial users must obtain a commercial license. Commercial licenses are available when signing up for an API key through the CoCreate platform.
