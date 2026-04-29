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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocLocksService = void 0;
const common_1 = require("@nestjs/common");
const doc_permissions_constants_1 = require("./doc-permissions.constants");
let DocLocksService = class DocLocksService {
    locks = new Map();
    cleanupTimer;
    constructor() {
        this.cleanupTimer = setInterval(() => this.cleanupExpiredLocks(), doc_permissions_constants_1.BLOCK_LOCK_TTL_MS);
        this.cleanupTimer.unref?.();
    }
    onModuleDestroy() {
        clearInterval(this.cleanupTimer);
    }
    acquire(docId, blockId, userId, socketId, now = Date.now()) {
        const roomLocks = this.getRoomLocks(docId);
        const existing = roomLocks.get(blockId);
        if (existing && existing.expiresAt > now && existing.userId !== userId) {
            return { acquired: false, lock: existing };
        }
        const lock = {
            docId,
            blockId,
            userId,
            socketId,
            expiresAt: now + doc_permissions_constants_1.BLOCK_LOCK_TTL_MS,
        };
        roomLocks.set(blockId, lock);
        return { acquired: true, lock };
    }
    heartbeat(docId, blockId, userId, socketId, now = Date.now()) {
        const lock = this.locks.get(docId)?.get(blockId);
        if (!lock || lock.userId !== userId || lock.socketId !== socketId || lock.expiresAt <= now) {
            return null;
        }
        lock.expiresAt = now + doc_permissions_constants_1.BLOCK_LOCK_TTL_MS;
        return lock;
    }
    releaseBlock(docId, blockId, userId, socketId) {
        const roomLocks = this.locks.get(docId);
        const lock = roomLocks?.get(blockId);
        if (!roomLocks || !lock || lock.userId !== userId || lock.socketId !== socketId) {
            return false;
        }
        roomLocks.delete(blockId);
        if (roomLocks.size === 0)
            this.locks.delete(docId);
        return true;
    }
    releaseForSocket(socketId, docId) {
        const released = [];
        const docEntries = docId
            ? Array.from(this.locks.entries()).filter(([candidateDocId]) => candidateDocId === docId)
            : Array.from(this.locks.entries());
        for (const [roomDocId, roomLocks] of docEntries) {
            for (const [blockId, lock] of Array.from(roomLocks.entries())) {
                if (lock.socketId === socketId) {
                    roomLocks.delete(blockId);
                    released.push(lock);
                }
            }
            if (roomLocks.size === 0)
                this.locks.delete(roomDocId);
        }
        return released;
    }
    getSnapshot(docId, now = Date.now()) {
        const roomLocks = this.locks.get(docId);
        if (!roomLocks)
            return [];
        return Array.from(roomLocks.values())
            .filter((lock) => lock.expiresAt > now)
            .map((lock) => ({ ...lock }));
    }
    getOwnedBlockIds(docId, userId, now = Date.now()) {
        return new Set(this.getSnapshot(docId, now)
            .filter((lock) => lock.userId === userId)
            .map((lock) => lock.blockId));
    }
    cleanupExpiredLocks(now = Date.now()) {
        const released = [];
        for (const [docId, roomLocks] of Array.from(this.locks.entries())) {
            for (const [blockId, lock] of Array.from(roomLocks.entries())) {
                if (lock.expiresAt <= now) {
                    roomLocks.delete(blockId);
                    released.push(lock);
                }
            }
            if (roomLocks.size === 0)
                this.locks.delete(docId);
        }
        return released;
    }
    getRoomLocks(docId) {
        let roomLocks = this.locks.get(docId);
        if (!roomLocks) {
            roomLocks = new Map();
            this.locks.set(docId, roomLocks);
        }
        return roomLocks;
    }
};
exports.DocLocksService = DocLocksService;
exports.DocLocksService = DocLocksService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], DocLocksService);
//# sourceMappingURL=doc-locks.service.js.map