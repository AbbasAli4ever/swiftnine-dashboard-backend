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
exports.PresenceService = void 0;
const common_1 = require("@nestjs/common");
const database_1 = require("../../../../libs/database/src");
let PresenceService = class PresenceService {
    prisma;
    socketToUser = new Map();
    userToSockets = new Map();
    server = null;
    constructor(prisma) {
        this.prisma = prisma;
    }
    bindServer(server) {
        this.server = server;
    }
    async connect(socketId, user) {
        const existingUserId = this.socketToUser.get(socketId);
        if (existingUserId === user.id) {
            return;
        }
        if (existingUserId && existingUserId !== user.id) {
            await this.disconnect(socketId);
        }
        const sockets = this.userToSockets.get(user.id) ?? new Set();
        const wasOffline = sockets.size === 0;
        sockets.add(socketId);
        this.userToSockets.set(user.id, sockets);
        this.socketToUser.set(socketId, user.id);
        if (!wasOffline) {
            return;
        }
        const [updatedUser, workspaceIds] = await Promise.all([
            this.prisma.user.update({
                where: { id: user.id },
                data: { isOnline: true },
                select: { id: true, lastSeenAt: true },
            }),
            this.listWorkspaceIdsForUser(user.id),
        ]);
        this.broadcast(workspaceIds, {
            userId: updatedUser.id,
            isOnline: true,
            lastSeenAt: updatedUser.lastSeenAt,
        });
    }
    async disconnect(socketId) {
        const userId = this.socketToUser.get(socketId);
        if (!userId) {
            return;
        }
        this.socketToUser.delete(socketId);
        const sockets = this.userToSockets.get(userId);
        if (!sockets) {
            return;
        }
        sockets.delete(socketId);
        if (sockets.size > 0) {
            return;
        }
        this.userToSockets.delete(userId);
        const lastSeenAt = new Date();
        const [updatedUser, workspaceIds] = await Promise.all([
            this.prisma.user.update({
                where: { id: userId },
                data: {
                    isOnline: false,
                    lastSeenAt,
                },
                select: { id: true, lastSeenAt: true },
            }),
            this.listWorkspaceIdsForUser(userId),
        ]);
        this.broadcast(workspaceIds, {
            userId: updatedUser.id,
            isOnline: false,
            lastSeenAt: updatedUser.lastSeenAt,
        });
    }
    async listWorkspaceIdsForUser(userId) {
        const memberships = await this.prisma.workspaceMember.findMany({
            where: {
                userId,
                deletedAt: null,
                workspace: { deletedAt: null },
            },
            select: { workspaceId: true },
        });
        return memberships.map((membership) => membership.workspaceId);
    }
    broadcast(workspaceIds, payload) {
        if (!this.server || workspaceIds.length === 0) {
            return;
        }
        for (const workspaceId of workspaceIds) {
            this.server.to(this.roomName(workspaceId)).emit('presence:changed', payload);
        }
    }
    roomName(workspaceId) {
        return `workspace:${workspaceId}`;
    }
};
exports.PresenceService = PresenceService;
exports.PresenceService = PresenceService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_1.PrismaService])
], PresenceService);
//# sourceMappingURL=presence.service.js.map