/********************************************************************************
 * Copyright (C) 2023 CoCreate and Contributors.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/>.
 ********************************************************************************/

// Commercial Licensing Information:
// For commercial use of this software without the copyleft provisions of the AGPLv3,
// you must obtain a commercial license from CoCreate LLC.
// For details, visit <https://cocreate.app/licenses/> or contact us at sales@cocreate.app.

import { EventEmitter } from 'node:events';
import { WebSocket, WebSocketServer } from 'ws';
import { URL } from 'node:url';
import { uuid } from '@cocreate/utils';
import Config from '@cocreate/config';

export class SocketServer extends EventEmitter {
    constructor(server) {
        super();

        // Cache reference to primary server process manager - Must be defined
        this.server = server;
        this.serverId = uuid(12);

        // Dynamic reference tracking context bound to our cluster process topology
        this.workerId = server.workerId;

        // Use ES6 Maps for O(1) lookups and zero-allocation updates
        this.organizations = new Map();
        this.clients = new Map();
        this.sockets = new Map();
        this.users = new Map();

        // Extract isolated helper properties directly from the server instance
        this.authenticate = server.authenticate;
        this.authorize = server.authorize;

        Config.prompt({ organization_id: { prompt: "Enter your organization_id: " } });

        this.wss = new WebSocketServer({ noServer: true });

        // We use bound prototype methods instead of inline closures to prevent scope leakage
        this.wss.on("headers", this._handleHeaders.bind(this));
        this.wss.on("error", this._handleWssError.bind(this));

        if (server.https) {
            server.https.on("upgrade", this._upgradeWss.bind(this));
        }
        if (server.http) {
            server.http.on("upgrade", this._upgradeWs.bind(this));
        }

        // Hook up process-level events to allow other modules (Telemetry, CoCreateServer) to invoke evictions
        process.on('socket.destroyAll', () => {
            this.destroyAll();
        });

        process.on('socket.destroyOrgs', (orgIds) => {
            this.destroyOrganizations(orgIds);
        });

        this.heartbeatInterval = setInterval(() => {
            this.sockets.forEach((socket) => {
                if (socket.isAlive === false) {
                    socket.terminate();
                    return;
                }
                socket.isAlive = false;
                try {
                    if (socket.readyState === WebSocket.OPEN) {
                        socket.ping();
                    } else {
                        socket.terminate();
                    }
                } catch (err) {
                    console.error("[@cocreate/socket-server] Error pinging socket:", err);
                    socket.terminate();
                }
            });
        }, 30000);
    }

    close() {
        clearInterval(this.heartbeatInterval);
        this.wss.close();
    }

    _handleHeaders(headers, request) {
        headers.push("Access-Control-Allow-Origin: *");
    }

    _handleWssError(error) {
        console.error("[@cocreate/socket-server] WebSocketServer error:", error);
    }

    _upgradeWss(request, socket, head) {
        this.upgrade(request, socket, head, "wss");
    }

    _upgradeWs(request, socket, head) {
        this.upgrade(request, socket, head, "ws");
    }

    static async init(server) {
        return new SocketServer(server);
    }

    upgrade(request, socket, head, protocol) {
        const self = this;

        const host = request.headers.host || "localhost";
        const parsedUrl = new URL(request.url, `http://${host}`);

        // .filter(Boolean) removes empty strings, protecting against trailing slashes!
        const paths = parsedUrl.pathname.split("/").filter(Boolean);
        // Grab the FIRST segment as the organization_id (e.g., /org_123/namespace/room -> org_123)
        const organization_id = paths[0];

        this.wss.handleUpgrade(request, socket, head, async function (socket) {
            if (organization_id) {
                let organization = self.organizations.get(organization_id);
                if (organization && organization.status === false) {
                    let errors = {};
                    errors.serverOrganization = organization.serverOrganization;
                    errors.serverStorage = organization.serverStorage;
                    errors.organizationBalance = organization.organizationBalance;
                    errors.error = organization.error;
                    return self._safeSend(socket, {
                        method: "Access Denied",
                        error: errors
                    });
                }

                // 1. Extract Query Parameters as the baseline options
                let options = Object.fromEntries(parsedUrl.searchParams.entries());

                // 2. Safely merge and override with secure protocol headers if they exist
                try {
                    const protocolHeader = request.headers["sec-websocket-protocol"];
                    if (protocolHeader) {
                        const headerOptions = JSON.parse(decodeURIComponent(protocolHeader));
                        options = { ...options, ...headerOptions };
                    }
                } catch (err) {
                    console.error("[@cocreate/socket-server] Error parsing socket options:", err);
                }

                socket.organization_id = organization_id;
                socket.id = options.socketId;
                socket.clientId = options.clientId;
                socket.clientInfo = options.clientInfo;
                socket.pathname = request.url;
                socket.origin = request.headers.origin;
                socket.host = request.headers.host;

                if (!socket.host && socket.origin && socket.origin !== "null") {
                    if (socket.origin.includes("://"))
                        socket.host = new URL(socket.origin).host;
                    else socket.host = socket.origin;
                }

                socket.socketUrl =
                    protocol + "://" + socket.host + socket.pathname;

                if (
                    !organization ||
                    (organization && organization.status !== false)
                ) {
                    const authService = self.authenticate;
                    if (authService) {
                        const { user_id, expires } =
                            await authService.decodeToken(
                                options.token,
                                organization_id,
                                options.clientId
                            );
                        const userStatus = {
                            socket,
                            method: "userStatus",
                            host: socket.host,
                            user_id: options.user_id,
                            clientId: options.clientId,
                            userStatus: "off",
                            organization_id
                        };
                        if (user_id) {
                            options.user_id = user_id;
                            socket.user_id = user_id;
                            socket.expires = expires;
                            userStatus.userStatus = "on";
                            self.emit("notification.user", socket);
                        }

                        self.emit("userStatus", userStatus);

                        self.onWebSocket(socket);
                    } else self.onWebSocket(socket);
                }
            } else {
                self._safeSend(socket, {
                    method: "Access Denied",
                    error: "An organization_id is required"
                });
            }
        });
    }

    onWebSocket(socket) {
        const self = this;

        socket.isAlive = true;
        socket.on("pong", () => {
            socket.isAlive = true;
        });

        this.add(socket);

        socket.on("message", async (message) => {
            self.onMessage(socket, message);
        });

        socket.on("close", () => {
            // Guard: If we are intentionally tearing down, bypass redundant delete cycles
            if (socket.bypassDeleteCascade) {
                socket.removeAllListeners();
                return;
            }
            self.delete(socket);
        });

        socket.on("error", () => {
            if (socket.bypassDeleteCascade) {
                socket.removeAllListeners();
                return;
            }
            self.delete(socket);
        });

        this._safeSend(socket, { method: "connect", connectedKey: socket.pathname });
    }

    add(socket) {
        let organization_id = socket.organization_id;

        let organization = this.organizations.get(organization_id);
        if (!organization) {
            organization = {
                status: true,
                clients: new Map(),
                subscriptions: new Map(),
                debounce: null
            };

            this.organizations.set(organization_id, organization);

            // Fail-Fast: Directly call send on upstream process. If invalid, crash instantly.
            this.server.send({
                method: 'registerOrg',
                organization_id,
                workerId: this.workerId
            });

            this.emit("object.update", {
                method: "object.update",
                host: socket.host,
                array: "organizations",
                object: {
                    _id: organization_id,
                    ["$addToSet.activeHost"]: socket.socketUrl
                },
                organization_id
            });

        } else {
            clearTimeout(organization.debounce);
        }

        if (!this.clients.has(socket.clientId)) {
            this.clients.set(socket.clientId, new Map());
        }

        if (!organization.clients.has(socket.clientId)) {
            organization.clients.set(socket.clientId, new Map());
        }

        this.sockets.set(socket.id, socket);
        this.clients.get(socket.clientId).set(socket.id, socket);
        organization.clients.get(socket.clientId).set(socket.id, socket);

        if (socket.user_id) {
            this.emit("userStatus", {
                socket,
                host: socket.host,
                user_id: socket.user_id,
                clientId: socket.clientId,
                userStatus: "on",
                organization_id
            });

            let userSession = this.users.get(socket.user_id);

            if (!userSession) {
                userSession = { sockets: new Map(), debounce: null };
                this.users.set(socket.user_id, userSession);
            } else {
                clearTimeout(userSession.debounce);
            }
            userSession.sockets.set(socket.id, socket);
        }
    }

    subscribe(socket, subscriptionKeys) {
        const organization = this.organizations.get(socket.organization_id);
        if (!organization) return;
        if (!organization.subscriptions)
            organization.subscriptions = new Map();
        if (!socket.subscriptionKeys) socket.subscriptionKeys = new Set();

        const keys = Array.isArray(subscriptionKeys)
            ? subscriptionKeys
            : subscriptionKeys
                ? [subscriptionKeys]
                : [];

        for (const key of keys) {
            if (typeof key !== "string" || !key) continue;

            let socketIds = organization.subscriptions.get(key);
            if (!socketIds) {
                socketIds = new Set();
                organization.subscriptions.set(key, socketIds);
            }

            socketIds.add(socket.id);
            socket.subscriptionKeys.add(key);
        }
    }

    unsubscribe(socket, subscriptionKeys) {
        const organization = this.organizations.get(socket.organization_id);
        if (!organization?.subscriptions) return;

        const keys = Array.isArray(subscriptionKeys)
            ? subscriptionKeys
            : subscriptionKeys
                ? [subscriptionKeys]
                : [];

        for (const key of keys) {
            const socketIds = organization.subscriptions.get(key);
            if (!socketIds) continue;

            socketIds.delete(socket.id);
            if (!socketIds.size) organization.subscriptions.delete(key);
            socket.subscriptionKeys?.delete(key);
        }
    }

    removeSubscriptions(socket) {
        if (!socket.subscriptionKeys?.size) return;
        this.unsubscribe(socket, [...socket.subscriptionKeys]);
        socket.subscriptionKeys.clear();
    }

    getSubscribers(data) {
        const clients = new Map();
        const organization = this.organizations.get(data.organization_id);
        if (!organization?.subscriptions) return clients;

        const socketIds = new Set();
        for (const key of data.subscriptionKeys) {
            const subscribedIds = organization.subscriptions.get(key);
            if (!subscribedIds) continue;
            for (const socketId of subscribedIds) socketIds.add(socketId);
        }

        for (const socketId of socketIds) {
            const socket = this.sockets.get(socketId);
            if (!socket || socket.organization_id !== data.organization_id)
                continue;

            let sockets = clients.get(socket.clientId);
            if (!sockets) {
                sockets = [];
                clients.set(socket.clientId, sockets);
            }
            sockets.push(socket);
        }

        return clients;
    }

    get(data) {
        try {
            if (data.broadcast === "false") data.broadcast = false;

            if (
                Array.isArray(data.subscriptionKeys) &&
                data.subscriptionKeys.length
            ) {
                return this.getSubscribers(data);
            }

            const clients = new Map();
            const organization = this.organizations.get(data.organization_id);
            if (!organization || !organization.clients) return clients;

            const clientsMap = organization.clients;
            const clientIds = Array.isArray(data.clientId)
                ? data.clientId
                : data.clientId
                    ? [data.clientId]
                    : [];
            const addClient = (clientId, clientSocketsMap, originatingSocket) => {
                const sockets = clientSocketsMap
                    ? [...clientSocketsMap.values()]
                    : [];
                if (originatingSocket) {
                    const index = sockets.indexOf(originatingSocket);
                    if (index !== -1) sockets.splice(index, 1);
                    sockets.unshift(originatingSocket);
                }
                if (sockets.length) clients.set(clientId, sockets);
            };

            if (data.broadcast) {
                for (const [clientId, clientSocketsMap] of clientsMap.entries()) {
                    addClient(
                        clientId,
                        clientSocketsMap,
                        data.socket?.clientId === clientId ? data.socket : undefined
                    );
                }
            } else if (data.socket) {
                addClient(
                    data.socket.clientId,
                    clientsMap.get(data.socket.clientId),
                    data.socket
                );
            } else {
                for (const clientId of clientIds) {
                    addClient(clientId, clientsMap.get(clientId));
                }
            }
            return clients;
        } catch (error) {
            console.error("[SocketServer] Error in get method:", error);
            return new Map();
        }
    }

    delete(socket) {
        const organization_id = socket.organization_id;
        const clientId = socket.clientId;
        const socketId = socket.id;

        const organization = this.organizations.get(organization_id);
        this.removeSubscriptions(socket);
        if (organization && organization.clients) {
            const clientSocketsMap = organization.clients.get(clientId);

            if (clientSocketsMap) {
                clientSocketsMap.delete(socketId);

                if (clientSocketsMap.size === 0) {
                    organization.clients.delete(clientId);
                }

                if (organization.clients.size === 0) {
                    this.emit("object.update", {
                        method: "object.update",
                        host: socket.host,
                        array: "organizations",
                        object: {
                            _id: organization_id,
                            ["$pull.activeHost"]: socket.socketUrl
                        },
                        organization_id
                    });

                    // We implement a resilient 60-second grace period (instead of 10 seconds)
                    // to gracefully handle page refreshes, cellular/Wi-Fi toggles, or fast disconnect-reconnect tunnels.
                    clearTimeout(organization.debounce);

                    // Guard: Prevent primary platform organization from being evicted when all clients disconnect
                    if (this.server && this.server.organization_id && organization_id === this.server.organization_id) {
                        return;
                    }

                    organization.debounce = setTimeout(() => {
                        const currentOrg = this.organizations.get(organization_id);
                        if (currentOrg && currentOrg.clients.size === 0) {
                            this.organizations.delete(organization_id);

                            // Fail-Fast: Notify Master via upstream process send directly.
                            this.server.send({
                                method: 'deregisterOrg',
                                organization_id,
                                workerId: this.workerId
                            });

                            // Dispatched locally: Cascades a teardown across databases, schedulers, and metrics
                            process.emit('orgDeleted', organization_id);
                        }
                    }, 60000); // 60 seconds resilience guard
                }
            }
        }

        const globalClientMap = this.clients.get(clientId);
        if (globalClientMap) {
            globalClientMap.delete(socketId);
            if (globalClientMap.size === 0) {
                this.clients.delete(clientId);
            }
        }

        this.sockets.delete(socketId);

        if (socket.user_id) {
            const userSession = this.users.get(socket.user_id);
            if (userSession) {
                userSession.sockets.delete(socketId);

                if (userSession.sockets.size === 0) {
                    clearTimeout(userSession.debounce);
                    userSession.debounce = setTimeout(() => {
                        this.users.delete(socket.user_id);
                        this.emit("userStatus", {
                            socket,
                            user_id: socket.user_id,
                            host: socket.host,
                            clientId: socket.clientId,
                            userStatus: "off",
                            organization_id
                        });
                    }, 10000);
                }
            }
        }

        // Explicit cleanup of listeners to protect V8 GC memory allocation bounds
        socket.removeAllListeners();
    }

    /**
     * Instantly evicts one or more organizations from this worker node,
     * closing all active sockets, freeing maps, and emitting the unified orgDeleted event.
     * Bypasses the 60-second grace period and deregisters each organization from IPC.
     * Platform organization ID is explicitly excluded from eviction.
     * @param {string|string[]} orgIds - Array of organization IDs to shed
     */
    destroyOrganizations(orgIds) {
        const ids = Array.isArray(orgIds) ? orgIds : [orgIds];

        for (const orgId of ids) {
            // Guard: Prevent platform organization ID from being evicted or triggering orgDeleted
            if (this.server && this.server.organization_id && orgId === this.server.organization_id) {
                continue;
            }

            const org = this.organizations.get(orgId);
            if (!org) continue;

            console.log(`[@cocreate/socket-server] Evicting organization instantly (Shedding/Drain): ${orgId}`);

            // 1. Clear any active inactivity timeouts to prevent double-processing
            if (org.debounce) {
                clearTimeout(org.debounce);
            }

            // 2. Identify all sockets associated with this organization
            const orgSockets = [];
            if (org.clients) {
                for (const clientSocketsMap of org.clients.values()) {
                    for (const socket of clientSocketsMap.values()) {
                        orgSockets.push(socket);
                    }
                }
            }

            // 3. Terminate all client connections cleanly
            for (const socket of orgSockets) {
                this.removeSubscriptions(socket);
                try {
                    // Send a clean departure frame if open
                    this._safeSend(socket, { method: "disconnect", reason: "Shedding / Draining Process" });
                    socket.bypassDeleteCascade = true; // Mark socket so its 'close' event ignores redundant cascades
                    socket.terminate(); // Force terminate the underlying TCP/TLS connection
                } catch (err) {
                    console.error(`[@cocreate/socket-server] Error closing socket during eviction of Org ${orgId}:`, err);
                }

                // Clear from global tracking maps
                this.sockets.delete(socket.id);
                const globalClientMap = this.clients.get(socket.clientId);
                if (globalClientMap) {
                    globalClientMap.delete(socket.id);
                    if (globalClientMap.size === 0) {
                        this.clients.delete(socket.clientId);
                    }
                }

                // Clean up user sessions
                if (socket.user_id) {
                    const userSession = this.users.get(socket.user_id);
                    if (userSession) {
                        userSession.sockets.delete(socket.id);
                        if (userSession.sockets.size === 0) {
                            clearTimeout(userSession.debounce);
                            this.users.delete(socket.user_id);
                        }
                    }
                }
            }

            // 4. Remove the organization completely from the registry
            this.organizations.delete(orgId);

            this.server.send({
                method: 'deregisterOrg',
                organization_id: orgId,
                workerId: this.workerId
            });

            // 5. Emit the global process event cascade (MongoDB pools close, Schedulers cancel, Usage flushes)
            process.emit('orgDeleted', orgId);
        }
    }

    /**
     * Purges all organizations and active connections on this worker instantly.
     */
    destroyAll() {
        console.log(`[@cocreate/socket-server] Instantly purging all organization registries...`);
        const allOrgIds = Array.from(this.organizations.keys());
        this.destroyOrganizations(allOrgIds);
    }

    async onMessage(socket, message) {
        try {
            this.server.usage.send({
                organization_id: socket.organization_id,
                type: "ingress",
                payload: message
            });

            let data;
            try {
                data = JSON.parse(message);
            } catch (err) {
                return this._safeSend(socket, { error: "Invalid JSON payload" });
            }

            if (data.method) {
                this.Message(socket, data);
            } else {
                data.error = "method is required";
                return this._safeSend(socket, data);
            }
        } catch (e) {
            console.log(e);
        }
    }

    async Message(socket, data) {
        try {
            const organization_id = socket.organization_id;

            const organization = this.organizations.get(organization_id);
            if (organization && organization.organizationBalance == false) {
                data.organizationBalance = false;
                data.error = organization.error;
                return this._safeSend(socket, data);
            }

            if (
                socket.user_id &&
                socket.expires &&
                new Date(new Date().toISOString()).getTime() >= socket.expires
            ) {
                await this.send({
                    socket,
                    method: "updateUserStatus",
                    user_id: socket.user_id,
                    host: socket.host,
                    clientId: data.clientId,
                    userStatus: "off",
                    socketId: data.socketId,
                    organization_id
                });
                socket.user_id = socket.expires = null;
                return;
            }

            const authorizeService = this.authorize;
            if (authorizeService) {
                if (!this.sockets.has(socket.id)) {
                    if (
                        organization &&
                        organization.organizationBalance == false
                    ) {
                        data.organizationBalance = false;
                        data.error = organization.error;
                        return this._safeSend(socket, data);
                    }
                }

                data.socket = socket;
                data.host = socket.host;

                const authorized = await authorizeService.check(
                    data,
                    socket.user_id
                );
                let errors = {};
                if (authorized === false) {
                    delete data.socket;
                    data.error = "authorization failed";
                    return this._safeSend(socket, data);
                } else if (authorized.serverOrganization === false) {
                    organization.status = errors.status = false;
                    organization.serverOrganization = false;
                    organization.error = authorized.error;
                } else if (authorized.serverStorage === false) {
                    data.database = process.env.organization_id;
                    data.organization_id = process.env.organization_id;

                    const authorized2 = await authorizeService.check(
                        data,
                        socket.user_id
                    );
                    if (!authorized2 || authorized2.error) {
                        organization.status = errors.status = false;
                        organization.error = errors.error = authorized.error;
                        if (authorized2.serverOrganization === false) {
                            organization.serverOrganization = false;
                        }
                        if (authorized2.serverStorage === false) {
                            organization.serverStorage = false;
                        }
                    }
                } else if (authorized.error) {
                    organization.status = false;
                    organization.error = authorized.error;
                }

                if (organization && organization.status === false) {
                    data.serverOrganization = organization.serverOrganization;
                    data.serverStorage = organization.serverStorage;
                    data.organizationBalance = organization.organizationBalance;
                    data.error = organization.error;
                    delete data.socket;
                    return this._safeSend(socket, data);
                }

                if (authorized.authorized) data = authorized.authorized;
            } // End of Authorization Block

            const moduleName = data.method?.split(".")[0];
            if (
                ["storage", "database", "array", "index", "object"].includes(
                    moduleName
                ) &&
                data.subscription
            ) {
                this.subscribe(socket, data.subscription);
            }

            // --- ROUTE TO API / CRUD OPERATIONS ---
            if (data.api) {
                this.emit("api", data);
            } else if (data.method === "unsubscribe") {
                this.unsubscribe(socket, data.subscription);
                delete data.socket;
                this._safeSend(socket, data);
            } else if (data.method === "crdt" || data.method === "cursor") {
                this.send(data);
            } else {
                if (["storage", "database", "array", "index", "object"].includes(moduleName)) {
                    this.emit(data.method, data);
                } else {
                    this.emit(moduleName, data);
                }
            }

        } catch (e) {
            console.log(e);
        }
    }

    async send(data) {
        const socket = data.socket;
        const serverSent = data.serverSent === true;
        const subscriptionDelivery =
            Array.isArray(data.subscriptionKeys) &&
            data.subscriptionKeys.length > 0;
        delete data.serverSent;
        delete data.wsManager;

        for (const property of [
            "broadcast",
            "broadcastClient",
            "broadcastSender"
        ]) {
            if (data[property] === "false") data[property] = false;
        }

        const sent = [];

        // --- POST-EXECUTION METADATA LOGGING ---
        if (
            !data.error && // Only log successful operations
            data.log !== false &&
            data.log !== "false" &&
            !data.method.endsWith(".read") &&
            data.method !== "updateUserStatus" &&
            data.method !== "userStatus" &&
            data.method !== "crdt" &&
            data.method !== "cursor"
        ) {
            let logPayload = {
                method: data.method,
                organization_id: data.organization_id,
                user_id: (socket && socket.user_id) || data.user_id,
                timestamp: new Date().toISOString()
            };

            if (data.endpoint) logPayload.endpoint = data.endpoint;
            if (data.array) logPayload.array = data.array;

            if (data.object) {
                if (Array.isArray(data.object)) {
                    const skeletonArray = [];
                    for (const item of data.object) {
                        if (item && item._id) skeletonArray.push({ _id: item._id });
                    }
                    if (skeletonArray.length > 0) logPayload.object = skeletonArray;
                } else if (data.object._id) {
                    logPayload.object = { _id: data.object._id };
                }
            }

            this.emit("object.create", {
                method: "object.create",
                host: data.host || (socket && socket.host),
                array: "activities",
                object: logPayload,
                organization_id: data.organization_id
            });
        }

        const clients = this.get(socket ? { ...data, socket } : data);
        let cleanData = { ...data };
        delete cleanData.socket;
        if (subscriptionDelivery) cleanData.broadcastClient = false;

        if (
            cleanData.filter &&
            cleanData.filter.query &&
            cleanData.filter.query._id &&
            cleanData.filter.query._id.$eq === "$user_id"
        ) {
            delete cleanData.filter.query._id;
        }

        const defaultPayloadStr = JSON.stringify(cleanData);

        for (const [clientId, sockets] of clients) {
            const sessionSocket = sockets[0];
            if (!sessionSocket) continue;

            let payloadStr = defaultPayloadStr;
            let finalDataObj = cleanData;

            if (this.authorize) {
                const authResult = await this.authorize.check(
                    cleanData,
                    sessionSocket.user_id
                );

                if (authResult === false) {
                    continue;
                }

                if (authResult !== true && authResult && authResult.authorized) {
                    finalDataObj = { ...authResult.authorized };
                    delete finalDataObj.socket;

                    if (
                        finalDataObj.filter &&
                        finalDataObj.filter.query &&
                        finalDataObj.filter.query._id &&
                        finalDataObj.filter.query._id.$eq === "$user_id"
                    ) {
                        delete finalDataObj.filter.query._id;
                    }

                    payloadStr = JSON.stringify(finalDataObj);
                }
            }

            for (const recipientSocket of sockets) {
                if (!this._safeSend(recipientSocket, payloadStr)) continue;

                sent.push(clientId);
                this.server.usage.send({
                    organization_id: recipientSocket.organization_id,
                    type: "egress",
                    payload: payloadStr
                });
                if (!subscriptionDelivery) break;
            }
        }

        if (cleanData.organization_id && !serverSent)
            this.server.send(cleanData);

        this.emit("notification", { sent });
    }

    // Helper to send payloads safely on valid connections without throwing frame failures
    _safeSend(socket, payload) {
        try {
            if (socket && socket.readyState === WebSocket.OPEN) {
                const message = typeof payload === "string" ? payload : JSON.stringify(payload);
                socket.send(message);
                return true;
            }
        } catch (err) {
            console.error("[@cocreate/socket-server] Error safely writing to socket:", err);
        }
        return false;
    }
}

export default SocketServer;
