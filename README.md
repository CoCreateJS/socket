# CoCreate Socket Server

A multi-tenant WebSocket server that routes CoCreate JSON envelopes between browser clients, application handlers, and the server mesh.

---

## Documentation

For complete API references, protocol event schemas, configuration guides, and examples, visit the **[CoCreate Socket Server Documentation](https://cocreatejs.com/docs/socket-server)**.

## Table of Contents

- [Documentation](#documentation)
- [Connection](#connection)
- [Message routing](#message-routing)
- [Client and socket selection](#client-and-socket-selection)
- [Authorization](#authorization)
- [Server mesh](#server-mesh)
- [Heartbeat and disconnection](#heartbeat-and-disconnection)
- [Installation](#installation)
- [How to Contribute](#how-to-contribute)
- [License](#license)

---

## Connection

Initialize the socket manager with a CoCreate server instance. The server supplies its HTTP and/or HTTPS upgrade source along with optional authentication, authorization, usage, and mesh services.

```js
import SocketServer from "@cocreate/socket-server";

const wsManager = await SocketServer.init(server);
server.wsManager = wsManager;
```

The first WebSocket URL path segment is the `organization_id`. Connection options can be supplied as query parameters or as an encoded JSON WebSocket protocol value. Socket-client supplies `socketId`, `clientId`, client information, user information, and an authentication token.

The server groups each connection as:

```text
organization_id -> clientId -> socketId -> WebSocket
```

- `clientId` identifies a browser client and may have multiple connected sockets.
- `socketId` identifies one WebSocket connection.
- `frameId` identifies the originating client runtime, but is message metadata rather than a server-side delivery selector.

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
- `crdt` and `cursor` messages are sent directly through the socket manager.
- Other messages emit the top-level portion of `method`.

## Client and socket selection

`send(data)` resolves recipients by organization and client:

- `broadcast !== false` selects every client in the organization.
- `broadcast === false` with an originating `data.socket` selects that socket's client.
- A server-originated direct message can provide `clientId` as one string or an array of strings.

For each selected client, the server attempts its connected sockets in order and stops after the first successful write. The originating socket is tried first for its client, including subscription delivery. Subscription matches select clients, with other sockets for those clients available as fallbacks. A write succeeds only when the WebSocket send callback reports no error. This provides socket failover without sending duplicate copies to every socket belonging to the same browser client.

`broadcastClient` and `broadcastSender` are forwarded to socket-client. Browser-context relaying and originating-frame listener suppression are handled on the client; they do not change socket selection on the server.

## Authorization

When authentication is configured, the connection token is decoded and a successfully authenticated socket receives `socket.user_id`. When authorization is configured, incoming messages are checked before dispatch and outgoing messages are checked once per selected client before a socket write is attempted.

Authorization may reject a message or return an authorized envelope. The authorized envelope becomes the payload delivered to that client.

## Server mesh

After local socket delivery, messages containing `organization_id` are forwarded
unchanged through `server.send()`. IPC routes the original envelope to other local
workers serving that organization and asks the mesh to forward it only to remote
servers serving the same organization. `workerId` and `serverId` identify the
origin so it is not delivered twice.

## Heartbeat and disconnection

The server sends WebSocket ping frames every 30 seconds. Connections that do not answer with a pong before the next heartbeat are terminated and removed from the organization, client, socket, and user maps. Reconnection and queued client messages are managed by socket-client rather than buffered by socket-server.

---

## Installation

### npm

```bash
npm install @cocreate/socket-server
```

### Yarn

```bash
yarn add @cocreate/socket-server
```

---

## How to Contribute

We encourage contributions to all CoCreate libraries. Please see our
[CONTRIBUTING.md](https://github.com/CoCreateJS/CoCreate-socket-server/blob/master/CONTRIBUTING.md)
guide for development workflows and contribution guidelines.

If you discover a bug or would like to request a feature, please open an issue on our
[GitHub Issues](https://github.com/CoCreateJS/CoCreate-socket-server/issues)
tracker.

For complete documentation, examples, and integration guides, visit:

https://cocreatejs.com/docs/socket-server

---

## License

This software is dual-licensed under the GNU Affero General Public License version 3 (AGPLv3) and a commercial license.

- **Open Source Use:** For open-source projects and non-commercial use, this software is available under the AGPLv3. See the LICENSE file for the complete license text.
- **Commercial Use:** Commercial users must obtain a commercial license. Commercial licenses are available when signing up for an API key through the CoCreate platform.
