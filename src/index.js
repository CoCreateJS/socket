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
 *
 ********************************************************************************/

// Commercial Licensing Information:
// For commercial use of this software without the copyleft provisions of the AGPLv3,
// you must obtain a commercial license from CoCreate LLC.
// For details, visit <https://cocreate.app/licenses/> or contact us at sales@cocreate.app.

import { EventEmitter } from 'node:events';
import { WebSocketServer, WebSocket } from 'ws';
import { URL } from 'node:url';
import uid from '@cocreate/uuid';
import config from '@cocreate/config';

export class SocketServer extends EventEmitter {
    constructor(server) {
        super();
        this.server = server;
        this.serverId = uid.generate(12);
        this.organizations = new Map();
        this.clients = new Map();
        this.sockets = new Map();
        this.users = new Map();

        config({ organization_id: { prompt: "Enter your organization_id: " } });

        this.wss = new WebSocketServer({ noServer: true });

        this.wss.on("headers", (headers, request) => {
            headers.push("Access-Control-Allow-Origin: *");
        });

        this.wss.on("error", (error) => {
            console.error("[@cocreate/socket-server] WebSocketServer error:", error);
        });

        if (server.https) {
            server.https.on("upgrade", (request, socket, head) =>
                this.upgrade(request, socket, head, "wss")
            );
        }
        if (server.http) {
            server.http.on("upgrade", (request, socket, head) =>
                this.upgrade(request, socket, head, "ws")
            );
        }
    }

    static async init(server) {
        const instance = new SocketServer(server);
        server.wsManager = instance;
        return instance;
    }

    upgrade(request, socket, head, protocol) {
        const self = this;
        let organization_id = request.url.split("/");
        organization_id = organization_id[organization_id.length - 1];

        this.wss.handleUpgrade(request, socket, head, async function (socket) {
            if (organization_id) {
                let organization = self.organizations.get(organization_id);
                if (organization && organization.status === false) {
                    let errors = {};
                    errors.serverOrganization = organization.serverOrganization;
                    errors.serverStorage = organization.serverStorage;
                    errors.organizationBalance = organization.organizationBalance;
                    errors.error = organization.error;
                    return socket.send(
                        JSON.stringify({
                            method: "Access Denied",
                            error: errors
                        })
                    );
                }

                let options = {};
                try {
                    const protocolHeader = request.headers["sec-websocket-protocol"];
                    if (protocolHeader) {
                        options = JSON.parse(decodeURIComponent(protocolHeader));
                    }
                } catch (err) {
                    console.error("[@cocreate/socket-server] Error parsing socket options:", err);
                }

                socket.organization_id = organization_id;
                socket.id = options.socketId;
                socket.clientId = options.clientId;
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
                    let data = {
                        socket,
                        method: "object.read",
                        host: socket.host,
                        array: "message_log",
                        $filter: {
                            sort: [{ key: "_id", direction: "desc" }]
                        },
                        sync: true,
                        organization_id
                    };

                    if (options.lastSynced)
                        data.$filter.query = {
                            _id: { $gt: options.lastSynced }
                        };
                    else data.$filter.limit = 1;

                    self.emit("object.read", data);

                    const authService = self.server.authenticate || self.authenticate;
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
                socket.send(
                    JSON.stringify({
                        method: "Access Denied",
                        error: "An organization_id is required"
                    })
                );
            }
        });
    }

    onWebSocket(socket) {
        const self = this;
        this.add(socket);

        socket.on("message", async (message) => {
            self.onMessage(socket, message);
        });

        socket.on("close", () => {
            self.delete(socket);
        });

        socket.on("error", () => {
            self.delete(socket);
        });

        socket.send(
            JSON.stringify({ method: "connect", connectedKey: socket.pathname })
        );
    }

    add(socket) {
        let organization_id = socket.organization_id;

        let organization = this.organizations.get(organization_id);
        if (!organization) {
            organization = {
                status: true,
                clients: {}
            };

            this.organizations.set(organization_id, organization);

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

            this.emit("mesh.create", {
                url: socket.socketUrl,
                organization_id
            });
        } else clearTimeout(organization.debounce);

        if (!this.clients.has(socket.clientId)) {
            this.clients.set(socket.clientId, {});

            if (!organization.clients)
                organization.clients = { [socket.clientId]: {} };
            else organization.clients[socket.clientId] = {};
        }

        this.sockets.set(socket.id, socket);
        this.clients.get(socket.clientId)[socket.id] = socket;
        if (!organization.clients[socket.clientId])
            organization.clients[socket.clientId] = { [socket.id]: socket };
        else organization.clients[socket.clientId][socket.id] = socket;

        if (socket.user_id) {
            this.emit("userStatus", {
                socket,
                host: socket.host,
                user_id: socket.user_id,
                clientId: socket.clientId,
                userStatus: "on",
                organization_id
            });
            let user = this.users.get(socket.user_id);

            if (!user) {
                this.users.set(socket.user_id, { [socket.id]: socket });
            } else {
                clearTimeout(user);
                user[socket.id] = socket;
            }
        }
    }

    get(data) {
        let sockets = [],
            clients;
        let organization = this.organizations.get(data.organization_id);
        if (organization) clients = organization.clients;
        else return [];

        if (data.broadcast !== false) {
            for (let client of Object.keys(clients)) {
                if (data.broadcastSender === false && client === data.clientId)
                    continue;

                if (data.broadcastClient) {
                    if (
                        client === data.clientId &&
                        clients[client][data.socket.id]
                    )
                        sockets.push(clients[client][data.socket.id]);
                    else sockets.push(Object.values(clients[client])[0]);
                } else
                    sockets.push(...Array.from(Object.values(clients[client])));
            }
        } else if (data.broadcastSender !== false) {
            if (clients[data.clientId]) {
                if (clients[data.clientId][data.socket.id])
                    sockets.push(clients[data.clientId][data.socket.id]);
                else sockets.push(Object.values(clients[data.clientId])[0]);
            } else sockets.push(data.socket);
        }
        return sockets;
    }

    delete(socket) {
        let organization_id = socket.organization_id;
        if (this.organizations.has(organization_id)) {
            let clients = this.organizations.get(organization_id);
            if (clients && clients.clients) {
                clients = clients.clients;
            }
            // Check if the client exists
            if (clients && clients[socket.clientId]) {
                const client = clients[socket.clientId];
                delete client[socket.id];

                if (!Object.keys(client).length)
                    delete clients[socket.clientId];

                if (!Object.keys(clients).length) {
                    this.organizations.delete(socket.organization_id);
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

                    this.emit("mesh.update", {
                        url: socket.socketUrl,
                        organization_id
                    });
                }
            }
        }

        if (this.clients.has(socket.clientId)) {
            const client = this.clients.get(socket.clientId);
            delete client[socket.id];

            if (!Object.keys(client).length)
                this.clients.delete(socket.clientId);
        }

        if (this.clients.size === 0) {
            let organization = this.organizations.get(socket.organization_id);
            let debounceTimer;
            if (organization) debounceTimer = organization.debounce;

            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                this.organizations.delete(socket.organization_id);
            }, 10000);

            if (!organization)
                this.organizations.set(socket.organization_id, {
                    debounce: debounceTimer
                });
            else organization.debounce = debounceTimer;

            this.sockets.delete(socket.id);

            if (socket.user_id) {
                let sockets = this.users.get(socket.user_id);
                if (sockets) {
                    delete sockets[socket.id];
                    if (!Object.keys(sockets).length) {
                        let userDebounceTimer = sockets;

                        clearTimeout(userDebounceTimer);
                        userDebounceTimer = setTimeout(() => {
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

                        this.users.set(socket.user_id, userDebounceTimer);
                    }
                }
            }
        }
    }

    async onMessage(socket, message) {
        try {
            this.emit("setBandwidth", {
                type: "in",
                data: message,
                organization_id: socket.organization_id
            });

            let data = JSON.parse(message);
            if (data.method) this.Message(socket, data);
            else {
                data.error = "method is required";
                return socket.send(JSON.stringify(data));
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
                return socket.send(JSON.stringify(data));
            }

            if (
                data.method === "region.added" ||
                data.method === "region.removed"
            )
                console.log("data.method: ", data.method);

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

            const authorizeService = this.server.authorize || this.authorize;
            if (authorizeService) {
                if (!this.sockets.has(socket.id)) {
                    if (
                        organization &&
                        organization.organizationBalance == false
                    ) {
                        data.organizationBalance = false;
                        data.error = organization.error;
                        return socket.send(JSON.stringify(data));
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
                    return socket.send(JSON.stringify(data));
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
                    return socket.send(JSON.stringify(data));
                }

                if (authorized.authorized) data = authorized.authorized;

                if (data.endpoint) {
                    this.emit("endpoint", data);
                } else {
                    let moduleName = data.method.split(".")[0];
                    if (
                        [
                            "storage",
                            "database",
                            "array",
                            "index",
                            "object"
                        ].includes(moduleName)
                    ) {
                        this.emit(data.method, data);
                    } else if (
                        data.method === "crdt" ||
                        data.method === "cursor"
                    ) {
                        this.send(data);
                    } else {
                        this.emit(moduleName, data);
                    }
                }
            } else {
                // Pass directly to emitters if authorizer is not registered
                let moduleName = data.method.split(".")[0];
                this.emit(moduleName, data);
            }
        } catch (e) {
            console.log(e);
        }
    }

    async send(data) {
        // Extract socket and safeguard circular references
        const socket = data.socket;
        delete data.wsManager;

        const authorizeService = this.server.authorize || this.authorize;

        if (data.sync) {
            if (!data.object || !data.object.length) return;

            for (let i = 0; i < data.object.length; i++) {
                if (data.object[i].data) {
                    data.object[i].data._id = data.object[i]._id;
                    data.object[i].data.sync = true;

                    if (authorizeService) {
                        const authorized = await authorizeService.check(
                            data.object[i].data,
                            socket.user_id
                        );
                        if (authorized && authorized.authorized)
                            socket.send(JSON.stringify(authorized.authorized));
                        else socket.send(JSON.stringify(data.object[i].data));
                    } else {
                        socket.send(JSON.stringify(data.object[i].data));
                    }
                } else console.log("server sync missing data");
            }
        } else {
            const sent = [];

            if (authorizeService && socket) {
                const authorized = await authorizeService.check(data, socket.user_id);
                if (authorized && authorized.authorized)
                    data = authorized.authorized;
            }

            if (
                socket &&
                data.log !== false &&
                data.log !== "false" &&
                !data.method.endsWith(".read") &&
                data.method !== "updateUserStatus" &&
                data.method !== "userStatus" &&
                data.method !== "signIn" &&
                data.method !== "signUp"
            ) {
                let moduleName = data.method.split(".");
                if (
                    [
                        "storage",
                        "database",
                        "array",
                        "index",
                        "object"
                    ].includes(moduleName[0]) &&
                    ["delete"].includes(moduleName[1])
                ) {
                    let object = { url: socket.socketUrl, data: { ...data } };
                    delete object.data.socket;

                    this.emit("object.create", {
                        method: "object.create",
                        host: data.host,
                        array: "message_log",
                        object,
                        organization_id: data.organization_id
                    });
                }
            }

            let sockets = this.get(data);

            for (let i = 0; i < sockets.length; i++) {
                if (!sockets[i]) continue;

                let Data;
                if (authorizeService) {
                    const authorized = await authorizeService.check(
                        data,
                        sockets[i].user_id
                    );
                    if (authorized && authorized.authorized) {
                        Data = { ...authorized.authorized };
                    } else {
                        Data = { ...data };
                    }
                } else {
                    Data = { ...data };
                }

                if (
                    Data.$filter &&
                    Data.$filter.query &&
                    Data.$filter.query._id &&
                    Data.$filter.query._id.$eq === "$user_id"
                )
                    delete Data.$filter.query._id;

                delete Data.socket;
                sockets[i].send(JSON.stringify(Data));

                if (socket) {
                    sent.push(socket.clientId);
                }
                
                this.emit("setBandwidth", {
                    type: "out",
                    data: Data,
                    organization_id: sockets[i].organization_id
                });
            }

            this.emit("notification", { sent });
        }
    }

    getConfigFromUrl(pathname) {
        const path = pathname.split("/");
        if (path[2]) {
            path[2] = decodeURIComponent(path[2]);
            path[2] = JSON.parse(path[2]) || {};
        }

        const config = {
            organization_id: path[1],
            ...path[2]
        };
        return config;
    }
}

export default SocketServer;