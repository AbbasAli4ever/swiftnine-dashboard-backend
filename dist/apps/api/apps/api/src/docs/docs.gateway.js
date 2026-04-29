"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var DocsGateway_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocsGateway = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const websockets_1 = require("@nestjs/websockets");
const auth_constants_1 = require("../auth/auth.constants");
const auth_service_1 = require("../auth/auth.service");
const doc_locks_service_1 = require("./doc-locks.service");
const doc_presence_service_1 = require("./doc-presence.service");
const docs_service_1 = require("./docs.service");
let DocsGateway = DocsGateway_1 = class DocsGateway {
    docs;
    presence;
    locks;
    jwt;
    auth;
    server;
    logger = new common_1.Logger(DocsGateway_1.name);
    constructor(docs, presence, locks, jwt, auth, config) {
        this.docs = docs;
        this.presence = presence;
        this.locks = locks;
        this.jwt = jwt;
        this.auth = auth;
        if (Number(config.get('INSTANCE_COUNT') ?? '1') > 1) {
            this.logger.warn('Docs realtime uses in-memory presence and locks; configure Redis before scaling instances');
        }
    }
    async handleConnection(client) {
        try {
            client.data.user = await this.authenticate(client);
            this.logger.log(`Docs socket connected: ${client.id} user=${client.data.user.id}`);
        }
        catch (error) {
            const message = error instanceof Error ? error.message : auth_constants_1.INVALID_ACCESS_TOKEN_MESSAGE;
            client.emit('doc:error', { reason: message });
            client.disconnect(true);
        }
    }
    handleDisconnect(client) {
        this.logger.log(`Docs socket disconnected: ${client.id}`);
        this.leaveAllRooms(client);
    }
    async handleJoin(client, payload) {
        const user = this.requireUser(client);
        const docId = this.requireString(payload.docId, 'docId');
        await this.docs.findOne(user.id, docId);
        await client.join(this.roomName(docId));
        this.presence.join(docId, client.id, user);
        client.emit('doc:presence-snapshot', { users: this.presenceSnapshot(docId) });
        client.emit('doc:lock-snapshot', { locks: this.locks.getSnapshot(docId) });
        client.to(this.roomName(docId)).emit('doc:presence-snapshot', {
            users: this.presenceSnapshot(docId),
        });
    }
    async handleLeave(client, payload) {
        const docId = this.requireString(payload.docId, 'docId');
        await client.leave(this.roomName(docId));
        this.leaveRoom(client, docId);
    }
    async handleLockBlock(client, payload) {
        const user = this.requireUser(client);
        const docId = this.requireString(payload.docId, 'docId');
        const blockId = this.requireString(payload.blockId, 'blockId');
        await this.docs.assertCanEditDoc(user.id, docId);
        const result = this.locks.acquire(docId, blockId, user.id, client.id);
        if (!result.acquired) {
            client.emit('doc:lock-rejected', {
                blockId,
                ownerUserId: result.lock.userId,
                expiresAt: result.lock.expiresAt,
            });
            return;
        }
        this.emitLockSnapshot(docId);
    }
    async handleLockHeartbeat(client, payload) {
        const user = this.requireUser(client);
        const docId = this.requireString(payload.docId, 'docId');
        const blockId = this.requireString(payload.blockId, 'blockId');
        const lock = this.locks.heartbeat(docId, blockId, user.id, client.id);
        if (!lock) {
            client.emit('doc:lock-rejected', { blockId, reason: 'Lock is not held by this socket' });
            return;
        }
        this.emitLockSnapshot(docId);
    }
    async handleUnlockBlock(client, payload) {
        const user = this.requireUser(client);
        const docId = this.requireString(payload.docId, 'docId');
        const blockId = this.requireString(payload.blockId, 'blockId');
        this.locks.releaseBlock(docId, blockId, user.id, client.id);
        this.emitLockSnapshot(docId);
    }
    async handleAutosave(client, payload) {
        const user = this.requireUser(client);
        const docId = this.requireString(payload.docId, 'docId');
        const baseVersion = payload.baseVersion;
        if (typeof baseVersion !== 'number' || !Number.isInteger(baseVersion)) {
            throw new websockets_1.WsException('baseVersion must be an integer');
        }
        try {
            const result = await this.docs.autosave(user.id, {
                docId,
                contentJson: payload.contentJson,
                baseVersion,
                lockedBlockIds: this.locks.getOwnedBlockIds(docId, user.id),
            });
            const event = {
                docId,
                doc: result.doc,
                changedBlockIds: result.changedBlockIds,
                orphanedThreadCount: result.orphanedThreadCount,
            };
            client.emit('doc:saved', event);
            client.to(this.roomName(docId)).emit('doc:saved', event);
        }
        catch (error) {
            if (error instanceof docs_service_1.DocSaveConflictException) {
                client.emit('doc:save-conflict', {
                    conflictBlockIds: error.conflictBlockIds,
                    reason: error.reason,
                });
                return;
            }
            throw error;
        }
    }
    async authenticate(client) {
        const auth = client.handshake.auth;
        if (typeof auth?.['shareToken'] === 'string' && !auth['token']) {
            throw new common_1.UnauthorizedException('Public share links are not supported yet');
        }
        const token = typeof auth?.['token'] === 'string' ? auth['token'].trim() : '';
        if (!token)
            throw new common_1.UnauthorizedException('Authentication token is required');
        const payload = await this.jwt.verifyAsync(token);
        const parsedPayload = auth_constants_1.ACCESS_TOKEN_PAYLOAD_SCHEMA.safeParse(payload);
        if (!parsedPayload.success) {
            throw new common_1.UnauthorizedException(auth_constants_1.INVALID_ACCESS_TOKEN_MESSAGE);
        }
        const user = await this.auth.findActiveAuthUser(parsedPayload.data.sub, parsedPayload.data.email);
        if (!user)
            throw new common_1.UnauthorizedException(auth_constants_1.INVALID_ACCESS_TOKEN_MESSAGE);
        return user;
    }
    requireUser(client) {
        if (!client.data.user)
            throw new websockets_1.WsException('Authentication required');
        return client.data.user;
    }
    requireString(value, field) {
        if (typeof value !== 'string' || !value.trim()) {
            throw new websockets_1.WsException(`${field} is required`);
        }
        return value.trim();
    }
    leaveAllRooms(client) {
        const docIds = new Set([
            ...this.presence.getJoinedDocIds(client.id),
            ...this.locks.releaseForSocket(client.id).map((lock) => lock.docId),
        ]);
        for (const docId of docIds) {
            this.presence.leave(client.id, docId);
            this.emitRoomState(docId);
        }
    }
    leaveRoom(client, docId) {
        this.presence.leave(client.id, docId);
        this.locks.releaseForSocket(client.id, docId);
        this.emitRoomState(docId);
    }
    emitRoomState(docId) {
        this.server.to(this.roomName(docId)).emit('doc:presence-snapshot', {
            users: this.presenceSnapshot(docId),
        });
        this.emitLockSnapshot(docId);
    }
    emitLockSnapshot(docId) {
        this.server.to(this.roomName(docId)).emit('doc:lock-snapshot', {
            locks: this.locks.getSnapshot(docId),
        });
    }
    presenceSnapshot(docId) {
        const locksByUser = new Map();
        for (const lock of this.locks.getSnapshot(docId)) {
            const blockIds = locksByUser.get(lock.userId) ?? [];
            blockIds.push(lock.blockId);
            locksByUser.set(lock.userId, blockIds);
        }
        return this.presence.snapshot(docId, locksByUser);
    }
    roomName(docId) {
        return `doc:${docId}`;
    }
};
exports.DocsGateway = DocsGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", Function)
], DocsGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('doc:join'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], DocsGateway.prototype, "handleJoin", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('doc:leave'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], DocsGateway.prototype, "handleLeave", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('doc:lock-block'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], DocsGateway.prototype, "handleLockBlock", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('doc:lock-heartbeat'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], DocsGateway.prototype, "handleLockHeartbeat", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('doc:unlock-block'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], DocsGateway.prototype, "handleUnlockBlock", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('doc:autosave'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], DocsGateway.prototype, "handleAutosave", null);
exports.DocsGateway = DocsGateway = DocsGateway_1 = __decorate([
    (0, websockets_1.WebSocketGateway)({
        namespace: '/docs',
        cors: { origin: true, credentials: true },
    }),
    __metadata("design:paramtypes", [docs_service_1.DocsService,
        doc_presence_service_1.DocPresenceService,
        doc_locks_service_1.DocLocksService,
        jwt_1.JwtService,
        auth_service_1.AuthService,
        config_1.ConfigService])
], DocsGateway);
//# sourceMappingURL=docs.gateway.js.map