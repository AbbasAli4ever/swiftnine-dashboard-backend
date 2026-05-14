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
var ChatGateway_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatGateway = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const database_1 = require("../../../../libs/database/src");
const auth_service_1 = require("../auth/auth.service");
const cors_config_1 = require("../config/cors.config");
const presence_service_1 = require("../presence/presence.service");
const auth_constants_1 = require("../auth/auth.constants");
const websockets_1 = require("@nestjs/websockets");
const chat_rate_limit_service_1 = require("./chat-rate-limit.service");
const realtime_metrics_service_1 = require("../realtime/realtime-metrics.service");
const project_realtime_lock_service_1 = require("../project-security/project-realtime-lock.service");
const project_security_service_1 = require("../project-security/project-security.service");
let ChatGateway = ChatGateway_1 = class ChatGateway {
    prisma;
    jwt;
    auth;
    presence;
    rateLimits;
    metrics;
    projectSecurity;
    projectRealtimeLocks;
    server;
    logger = new common_1.Logger(ChatGateway_1.name);
    constructor(prisma, jwt, auth, presence, rateLimits, metrics, projectSecurity, projectRealtimeLocks, config) {
        this.prisma = prisma;
        this.jwt = jwt;
        this.auth = auth;
        this.presence = presence;
        this.rateLimits = rateLimits;
        this.metrics = metrics;
        this.projectSecurity = projectSecurity;
        this.projectRealtimeLocks = projectRealtimeLocks;
        if (Number(config.get('INSTANCE_COUNT') ?? '1') > 1) {
            this.logger.warn('Chat realtime uses in-memory room fanout; configure Redis before scaling instances');
        }
        this.projectRealtimeLocks.lockChanged$.subscribe((event) => {
            void this.evictProjectChannels(event.projectId, event.reason);
        });
    }
    async handleConnection(client) {
        try {
            client.data.user = await this.authenticate(client);
            await this.presence.connect(client.id, client.data.user);
            await this.joinMemberChannelRooms(client, client.data.user.id);
            this.metrics.trackSocketConnected('chat', client.id);
            this.logger.log(`Chat socket connected: ${client.id} user=${client.data.user.id}`);
        }
        catch (error) {
            const message = error instanceof Error
                ? error.message
                : auth_constants_1.INVALID_ACCESS_TOKEN_MESSAGE;
            client.emit('chat:error', { reason: message });
            client.disconnect(true);
        }
    }
    async handleDisconnect(client) {
        await this.presence.disconnect(client.id);
        this.metrics.trackSocketDisconnected('chat', client.id);
        this.logger.log(`Chat socket disconnected: ${client.id}`);
    }
    async handleJoin(client, payload) {
        const user = this.requireUser(client);
        const channelId = this.requireString(payload.channelId, 'channelId');
        await this.assertChannelMember(channelId, user.id);
        await client.join(this.roomName(channelId));
    }
    async handleLeave(client, payload) {
        this.requireUser(client);
        const channelId = this.requireString(payload.channelId, 'channelId');
        await client.leave(this.roomName(channelId));
    }
    async handleTypingStart(client, payload) {
        const user = this.requireUser(client);
        const channelId = this.requireJoinedChannel(client, payload);
        this.rateLimits.assertTypingEvent(user.id, channelId);
        client.to(this.roomName(channelId)).emit('typing:user-started', {
            channelId,
            userId: user.id,
        });
    }
    async handleTypingStop(client, payload) {
        const user = this.requireUser(client);
        const channelId = this.requireJoinedChannel(client, payload);
        this.rateLimits.assertTypingEvent(user.id, channelId);
        client.to(this.roomName(channelId)).emit('typing:user-stopped', {
            channelId,
            userId: user.id,
        });
    }
    emitMessageCreated(message) {
        this.emitToChannel(message.channelId, 'message:new', message);
        if (message.kind === 'SYSTEM') {
            this.emitToChannel(message.channelId, 'system:event', message);
        }
    }
    emitMessageEdited(message) {
        this.emitToChannel(message.channelId, 'message:edited', message);
    }
    emitMessageDeleted(channelId, messageId, deletedAt) {
        this.emitToChannel(channelId, 'message:deleted', {
            messageId,
            deletedAt: deletedAt ?? null,
        });
    }
    emitMessagePinned(message) {
        this.emitToChannel(message.channelId, 'message:pinned', {
            message,
            pinnedById: message.pinnedById ?? null,
            pinnedAt: message.pinnedAt ?? null,
        });
    }
    emitMessageUnpinned(channelId, messageId) {
        this.emitToChannel(channelId, 'message:unpinned', { messageId });
    }
    emitReaction(channelId, payload) {
        this.emitToChannel(channelId, payload.action === 'added' ? 'reaction:added' : 'reaction:removed', {
            messageId: payload.messageId,
            userId: payload.userId,
            emoji: payload.emoji,
        });
    }
    emitMemberRead(payload) {
        this.emitToChannel(payload.channelId, 'member:read', payload);
    }
    emitToChannel(channelId, event, payload) {
        if (!this.server)
            return;
        this.server.to(this.roomName(channelId)).emit(event, payload);
    }
    async authenticate(client) {
        const auth = client.handshake.auth;
        const token = typeof auth?.['token'] === 'string' ? auth['token'].trim() : '';
        if (!token) {
            throw new common_1.UnauthorizedException('Authentication token is required');
        }
        const payload = await this.jwt.verifyAsync(token);
        const parsedPayload = auth_constants_1.ACCESS_TOKEN_PAYLOAD_SCHEMA.safeParse(payload);
        if (!parsedPayload.success) {
            throw new common_1.UnauthorizedException(auth_constants_1.INVALID_ACCESS_TOKEN_MESSAGE);
        }
        const user = await this.auth.findActiveAuthUser(parsedPayload.data.sub, parsedPayload.data.email);
        if (!user) {
            throw new common_1.UnauthorizedException(auth_constants_1.INVALID_ACCESS_TOKEN_MESSAGE);
        }
        return user;
    }
    requireUser(client) {
        if (!client.data.user) {
            throw new websockets_1.WsException('Authentication required');
        }
        return client.data.user;
    }
    requireString(value, field) {
        if (typeof value !== 'string' || !value.trim()) {
            throw new websockets_1.WsException(`${field} is required`);
        }
        return value.trim();
    }
    requireJoinedChannel(client, payload) {
        const channelId = this.requireString(payload.channelId, 'channelId');
        if (!client.rooms.has(this.roomName(channelId))) {
            throw new websockets_1.WsException('Join the channel before sending typing events');
        }
        return channelId;
    }
    async assertChannelMember(channelId, userId) {
        const membership = await this.prisma.channelMember.findFirst({
            where: { channelId, userId },
            select: {
                id: true,
                channel: {
                    select: {
                        workspaceId: true,
                        projectId: true,
                    },
                },
            },
        });
        if (!membership) {
            throw new websockets_1.WsException('Channel membership required');
        }
        if (membership.channel.projectId) {
            await this.assertProjectUnlockedForWs(membership.channel.workspaceId, membership.channel.projectId, userId);
        }
    }
    roomName(channelId) {
        return `channel:${channelId}`;
    }
    async joinMemberChannelRooms(client, userId) {
        const memberships = await this.prisma.channelMember.findMany({
            where: { userId },
            select: {
                channelId: true,
                channel: {
                    select: {
                        workspaceId: true,
                        projectId: true,
                        project: { select: { passwordHash: true } },
                    },
                },
            },
        });
        const lockedProjectIds = memberships
            .map((membership) => membership.channel.project?.passwordHash ? membership.channel.projectId : null)
            .filter((projectId) => Boolean(projectId));
        const unlockedProjectIds = await this.projectSecurity.activeUnlockedProjectIds(lockedProjectIds, userId);
        await Promise.all(memberships
            .filter((membership) => {
            const projectId = membership.channel.projectId;
            if (!projectId)
                return true;
            if (!membership.channel.project?.passwordHash)
                return true;
            return unlockedProjectIds.has(projectId);
        })
            .map((membership) => client.join(this.roomName(membership.channelId))));
    }
    async assertProjectUnlockedForWs(workspaceId, projectId, userId) {
        try {
            await this.projectSecurity.assertUnlocked(workspaceId, projectId, userId);
        }
        catch {
            throw new websockets_1.WsException({
                code: 'PROJECT_LOCKED',
                message: 'Project is locked',
            });
        }
    }
    async evictProjectChannels(projectId, reason) {
        if (!this.server)
            return;
        const channels = await this.prisma.channel.findMany({
            where: { projectId },
            select: { id: true },
        });
        await Promise.all(channels.map(async (channel) => {
            const room = this.roomName(channel.id);
            this.server.to(room).emit('project:lock-changed', {
                projectId,
                channelId: channel.id,
                reason,
            });
            await this.server.in(room).socketsLeave(room);
        }));
    }
};
exports.ChatGateway = ChatGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", Function)
], ChatGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('chat:join'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleJoin", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('chat:leave'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleLeave", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('chat:typing-start'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleTypingStart", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('chat:typing-stop'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleTypingStop", null);
exports.ChatGateway = ChatGateway = ChatGateway_1 = __decorate([
    (0, websockets_1.WebSocketGateway)({
        namespace: '/chat',
        cors: (0, cors_config_1.buildWebsocketCorsOptions)(process.env),
    }),
    __metadata("design:paramtypes", [database_1.PrismaService,
        jwt_1.JwtService,
        auth_service_1.AuthService,
        presence_service_1.PresenceService,
        chat_rate_limit_service_1.ChatRateLimitService,
        realtime_metrics_service_1.RealtimeMetricsService,
        project_security_service_1.ProjectSecurityService,
        project_realtime_lock_service_1.ProjectRealtimeLockService,
        config_1.ConfigService])
], ChatGateway);
//# sourceMappingURL=chat.gateway.js.map