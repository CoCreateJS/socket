/** Map-like views over the Socket Server's existing lifecycle and indexes. */
class Collection {
    #source;
    #value;

    constructor(source, value = value => value) {
        this.#source = source;
        this.#value = value;
    }

    get size() { return this.#source()?.size || 0; }
    has(id) { return this.#source()?.has(id) || false; }
    get(id) {
        const value = this.#source()?.get(id);
        return value === undefined ? undefined : this.#value(value, id);
    }
    *keys() { yield* this.#source()?.keys() || []; }
    *values() { for (const id of this.keys()) yield this.get(id); }
    *entries() { for (const id of this.keys()) yield [id, this.get(id)]; }
    [Symbol.iterator]() { return this.entries(); }
    forEach(callback, thisArg) {
        for (const [id, value] of this) callback.call(thisArg, value, id, this);
    }
    clear() { for (const id of [...this.keys()]) this.delete(id); }
}

// Metadata updates preserve references and cannot replace transport or index fields.
const metadataFields = new WeakMap();
function update(record, updates, mutable = [], protectedFields = []) {
    if (!record || !updates || typeof updates !== 'object') return;
    if (!metadataFields.has(record)) metadataFields.set(record, new Set(mutable));
    const allowed = metadataFields.get(record);
    for (const [key, value] of Object.entries(updates)) {
        if (key.startsWith('_') || key in Object.prototype || protectedFields.includes(key)) continue;
        if (key in record && !allowed.has(key)) continue;
        allowed.add(key);
        Object.defineProperty(record, key, { value, writable: true, enumerable: true, configurable: true });
    }
}

class ClientSockets extends Collection {
    constructor(root, clientId, organizationId) {
        super(() => organizationId === undefined
            ? root.manager.clients.get(clientId)
            : root.manager.organizations.get(organizationId)?.clients.get(clientId));
        Object.defineProperties(this, {
            root: { value: root },
            clientId: { value: clientId },
            organizationId: { value: organizationId }
        });
    }
    add(socket) {
        if (socket.clientId !== this.clientId ||
            (this.organizationId !== undefined && socket.organization_id !== this.organizationId)) {
            throw new Error('Socket does not belong to this client');
        }
        return this.root.add(socket);
    }
    set(id, updates) { if (this.has(id)) this.root.set(id, updates); }
    delete(id) { if (this.has(id)) this.root.delete(id); }
}

class Clients extends Collection {
    constructor(root, organizationId) {
        const views = new WeakMap();
        super(() => organizationId === undefined ? root.manager.clients
            : root.manager.organizations.get(organizationId)?.clients,
        (sockets, id) => {
            if (!views.has(sockets)) views.set(sockets, new ClientSockets(root, id, organizationId));
            return views.get(sockets);
        });
        Object.defineProperties(this, {
            root: { value: root },
            organizationId: { value: organizationId }
        });
    }
    add(socket) {
        if (this.organizationId !== undefined && socket.organization_id !== this.organizationId) {
            throw new Error('Socket does not belong to this organization');
        }
        this.root.add(socket);
        return this.get(socket.clientId);
    }
    delete(id) { this.get(id)?.clear(); }
}

class Organizations extends Collection {
    constructor(root) {
        const views = new WeakMap();
        super(() => root.manager.organizations, (organization, id) => {
            if (!views.has(organization)) {
                const clients = new Clients(root, id);
                views.set(organization, new Proxy(organization, {
                    get(target, key, receiver) {
                        return key === 'clients' ? clients : Reflect.get(target, key, receiver);
                    }
                }));
            }
            return views.get(organization);
        });
        Object.defineProperty(this, 'root', { value: root });
    }
    add(socket) {
        this.root.add(socket);
        return this.get(socket.organization_id);
    }
    set(id, updates) { update(this.root.manager.organizations.get(id), updates, ['status', 'organizationBalance']); }
    delete(id) { this.root.manager.destroyOrganizations(id); }
}

/**
 * Public socket collection. Add accepts an authenticated socket with id,
 * clientId and organization_id; delete closes its transport and cleans indexes.
 * Client and organization add methods accept the same socket and return their record.
 */
export default class Sockets extends Collection {
    constructor(manager) {
        super(() => manager.sockets);
        Object.defineProperty(this, 'manager', { value: manager });
        this.clients = new Clients(this);
        this.organizations = new Organizations(this);
    }
    add(socket) {
        if (!socket?.id || !socket.clientId || !socket.organization_id) {
            throw new TypeError('Socket requires id, clientId and organization_id');
        }
        const existing = this.get(socket.id);
        if (existing === socket) return socket;
        if (existing) throw new Error(`Socket ${socket.id} already exists`);
        this.manager.onWebSocket(socket);
        return socket;
    }
    set(id, updates) {
        update(this.get(id), updates, ['clientInfo'], [
            'id', 'clientId', 'organization_id', 'user_id', 'subscriptionKeys',
            'bypassDeleteCascade', 'expires', 'isAlive', 'readyState',
            'host', 'origin', 'pathname', 'socketUrl'
        ]);
    }
    delete(id) {
        const socket = this.get(id);
        if (!socket) return;
        try { socket.close(1000); }
        finally {
            if (this.get(id) === socket) this.manager.delete(socket);
        }
    }
    send(data) { return this.manager.send(data); }
}
