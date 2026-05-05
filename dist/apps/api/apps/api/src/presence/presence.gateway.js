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
var PresenceGateway_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PresenceGateway = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const websockets_1 = require("@nestjs/websockets");
const auth_constants_1 = require("../auth/auth.constants");
const cors_config_1 = require("../config/cors.config");
const auth_service_1 = require("../auth/auth.service");
const realtime_metrics_service_1 = require("../realtime/realtime-metrics.service");
const presence_service_1 = require("./presence.service");
let PresenceGateway = PresenceGateway_1 = class PresenceGateway {
    presence;
    jwt;
    auth;
    metrics;
    server;
    logger = new common_1.Logger(PresenceGateway_1.name);
    constructor(presence, jwt, auth, metrics, config) {
        this.presence = presence;
        this.jwt = jwt;
        this.auth = auth;
        this.metrics = metrics;
        if (Number(config.get('INSTANCE_COUNT') ?? '1') > 1) {
            this.logger.warn('Presence realtime uses an in-memory socket registry; configure Redis before scaling instances');
        }
    }
    afterInit(server) {
        this.presence.bindServer(server);
    }
    async handleConnection(client) {
        try {
            client.data.user = await this.authenticate(client);
            this.metrics.trackSocketConnected('presence', client.id);
            this.logger.log(`Presence socket connected: ${client.id} user=${client.data.user.id}`);
        }
        catch (error) {
            const message = error instanceof Error
                ? error.message
                : auth_constants_1.INVALID_ACCESS_TOKEN_MESSAGE;
            client.emit('presence:error', { reason: message });
            client.disconnect(true);
        }
    }
    handleDisconnect(client) {
        this.metrics.trackSocketDisconnected('presence', client.id);
        this.logger.log(`Presence socket disconnected: ${client.id}`);
    }
    async handleSubscribe(client, _payload) {
        const user = this.requireUser(client);
        const workspaceIds = await this.presence.listWorkspaceIdsForUser(user.id);
        await Promise.all(workspaceIds.map((workspaceId) => client.join(this.roomName(workspaceId))));
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
    roomName(workspaceId) {
        return `workspace:${workspaceId}`;
    }
};
exports.PresenceGateway = PresenceGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", Function)
], PresenceGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('presence:subscribe'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PresenceGateway.prototype, "handleSubscribe", null);
exports.PresenceGateway = PresenceGateway = PresenceGateway_1 = __decorate([
    (0, websockets_1.WebSocketGateway)({
        namespace: '/presence',
        cors: (0, cors_config_1.buildWebsocketCorsOptions)(process.env),
    }),
    __metadata("design:paramtypes", [presence_service_1.PresenceService,
        jwt_1.JwtService,
        auth_service_1.AuthService,
        realtime_metrics_service_1.RealtimeMetricsService,
        config_1.ConfigService])
], PresenceGateway);
//# sourceMappingURL=presence.gateway.js.map