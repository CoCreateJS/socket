# CoCreate Socket Server

A high-performance, multi-tenant WebSocket orchestration layer engineered for real-time collaboration, instant data synchronization, and ultra-low latency event streaming. This module serves as the primary gateway for end-user web applications interacting with the CoCreate clustered network.

---

## Documentation

For complete API references, protocol event schemas, configuration guides, and examples, visit the **[CoCreate Socket Server Documentation](https://cocreatejs.com/docs/socket-server)**.

## Table of Contents

- [Documentation](#documentation)
- [The Real-Time Multiplexing Core](#the-real-time-multiplexing-core)
- [Why CoCreate Socket Server?](#why-cocreate-socket-server)
- [Multi-Tenant Rooms & Subscriptions](#multi-tenant-rooms--subscriptions)
- [The Connection Degradation Vector](#the-connection-degradation-vector)
- [Graceful Reconnection & State Recovery](#graceful-reconnection--state-recovery)
- [Configuration](#configuration)
- [Installation](#installation)
- [How to Contribute](#how-to-contribute)
- [License](#license)

---

## The Real-Time Multiplexing Core

`@cocreate/socket-server` manages hundreds of thousands of concurrent persistent client connections with a zero-allocation, stream-oriented architecture.

### Native Binary Transport

To minimize serialization overhead and avoid high CPU usage, all real-time payloads can be encoded natively as binary streams using protocol buffers or compact JSON-in-MsgPack formats. This reduces network payload size by up to 60% compared to raw stringified JSON payloads.

### Organization & Room Isolation

Sockets are automatically classified upon connection based on authenticated organization context. Client connections can only subscribe to channels matching their tenant scopes, keeping data partitions strict and secure at the gateway edge.

$$
\text{Client Connection Request}
\xrightarrow{\text{JWT Authentication}}
\text{Isolated Tenant Context}
\implies
\begin{cases}
\text{Room 1} & \text{(Document Sync)} \\
\text{Room 2} & \text{(Presence Engine)}
\end{cases}
$$

```text
 [Client App] ──► [WebSocket Connection] ──► [Socket Server Edge] ──► [Tenant Context Mapping]
                                                                            │
                                                                            ▼
                                                                     [Enforced Privacy]
```

---

## Why CoCreate Socket Server?

Standard real-time libraries (such as Socket.IO) introduce protocol wrapping overhead and maintain relatively heavy memory footprints per client, limiting total connection density on typical hardware.

`@cocreate/socket-server` is built on top of high-performance, low-level engine bindings, ensuring near-native socket operations. It tracks user presence, real-time collaboration, and administrative events with minimal overhead, allowing a single server instance to support tens of thousands of concurrent active connections.

---

## Multi-Tenant Rooms & Subscriptions

The socket server divides message distributions into isolated communication layers.

| Channel Scope | Delivery Mechanism | Common Use Case |
| --- | --- | --- |
| **Organization Room** | Broadcast across tenant nodes | System announcements and configuration synchronization. |
| **Document Room** | Focused cluster routing | Real-time collaboration, cursor synchronization, and document updates. |
| **User Direct Channel** | Unicast targeted messaging | Personal notifications and account-specific events. |
| **Mesh Control Tunnel** | Internal inter-server communication | Administrative coordination and node draining. |

---

## The Connection Degradation Vector

To help `@cocreate/server-telemetry` evaluate worker saturation, the socket server continuously tracks local connection density ($D_c$).

$$
D_c =
\frac{\text{Active Sockets}}
{\text{Max Node Capacity}}
\cdot
\ln(\text{Messages Per Second}+1)
$$

As connection density approaches configured limits, the socket server notifies the surrounding infrastructure so new client connections can be routed toward healthier nodes.

---

## Graceful Reconnection & State Recovery

Temporary network interruptions should not interrupt collaboration.

When a client disconnects unexpectedly, its session is placed into a short-lived recovery state. Outbound events are temporarily buffered in memory. If the client reconnects with its session identifier before the recovery window expires, pending events are replayed and synchronization continues without requiring the application to rebuild state.

---

## Configuration

Create a `socket.config.json` file in your server root directory.

```json
{
  "port": 8080,
  "maxConnections": 50000,
  "pingIntervalMs": 25000,
  "pingTimeoutMs": 5000,
  "maxPayloadBytes": 1048576,
  "compression": {
    "enabled": true,
    "thresholdBytes": 1024
  },
  "security": {
    "requireAuth": true,
    "authTimeoutMs": 5000
  }
}
```

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
[CONTRIBUTING.md](https://github.com/CoCreate-app/CoCreate-socket-server/blob/master/CONTRIBUTING.md)
guide for development workflows and contribution guidelines.

If you discover a bug or would like to request a feature, please open an issue on our
[GitHub Issues](https://github.com/CoCreate-app/CoCreate-socket-server/issues)
tracker.

For complete documentation, examples, and integration guides, visit:

https://cocreatejs.com/docs/socket-server

---

## License

This software is dual-licensed under the GNU Affero General Public License version 3 (AGPLv3) and a commercial license.

- **Open Source Use:** For open-source projects and non-commercial use, this software is available under the AGPLv3. See the LICENSE file for the complete license text.
- **Commercial Use:** Commercial users must obtain a commercial license. Commercial licenses are available when signing up for an API key through the CoCreate platform.