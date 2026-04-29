"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocPresenceService = void 0;
const common_1 = require("@nestjs/common");
let DocPresenceService = class DocPresenceService {
    rooms = new Map();
    join(docId, socketId, user, now = Date.now()) {
        const room = this.getRoom(docId);
        const entry = {
            socketId,
            userId: user.id,
            name: user.fullName,
            avatarUrl: user.avatarUrl,
            joinedAt: now,
        };
        room.set(socketId, entry);
        return entry;
    }
    leave(socketId, docId) {
        const leftDocIds = [];
        const rooms = docId
            ? Array.from(this.rooms.entries()).filter(([candidateDocId]) => candidateDocId === docId)
            : Array.from(this.rooms.entries());
        for (const [roomDocId, room] of rooms) {
            if (room.delete(socketId))
                leftDocIds.push(roomDocId);
            if (room.size === 0)
                this.rooms.delete(roomDocId);
        }
        return leftDocIds;
    }
    getJoinedDocIds(socketId) {
        return Array.from(this.rooms.entries())
            .filter(([, room]) => room.has(socketId))
            .map(([docId]) => docId);
    }
    snapshot(docId, locksByUser = new Map()) {
        const users = new Map();
        for (const entry of this.rooms.get(docId)?.values() ?? []) {
            const existing = users.get(entry.userId);
            if (existing) {
                existing.socketIds.push(entry.socketId);
                continue;
            }
            users.set(entry.userId, {
                userId: entry.userId,
                name: entry.name,
                avatarUrl: entry.avatarUrl,
                socketIds: [entry.socketId],
                locks: locksByUser.get(entry.userId) ?? [],
            });
        }
        return Array.from(users.values());
    }
    getRoom(docId) {
        let room = this.rooms.get(docId);
        if (!room) {
            room = new Map();
            this.rooms.set(docId, room);
        }
        return room;
    }
};
exports.DocPresenceService = DocPresenceService;
exports.DocPresenceService = DocPresenceService = __decorate([
    (0, common_1.Injectable)()
], DocPresenceService);
//# sourceMappingURL=doc-presence.service.js.map