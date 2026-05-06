"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var RealtimeMetricsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RealtimeMetricsService = void 0;
const common_1 = require("@nestjs/common");
let RealtimeMetricsService = RealtimeMetricsService_1 = class RealtimeMetricsService {
    logger = new common_1.Logger(RealtimeMetricsService_1.name);
    socketsByNamespace = new Map();
    messagesSent = 0;
    trackSocketConnected(namespace, socketId) {
        const sockets = this.socketsByNamespace.get(namespace) ?? new Set();
        sockets.add(socketId);
        this.socketsByNamespace.set(namespace, sockets);
        this.logger.debug(`socket_connected namespace=${namespace} active=${sockets.size}`);
    }
    trackSocketDisconnected(namespace, socketId) {
        const sockets = this.socketsByNamespace.get(namespace);
        if (!sockets) {
            return;
        }
        sockets.delete(socketId);
        if (sockets.size === 0) {
            this.socketsByNamespace.delete(namespace);
        }
        this.logger.debug(`socket_disconnected namespace=${namespace} active=${sockets.size}`);
    }
    recordMessageSent(channelId, userId) {
        this.messagesSent += 1;
        this.logger.debug(`message_sent total=${this.messagesSent} channel=${channelId} user=${userId}`);
    }
    snapshot() {
        return {
            messagesSent: this.messagesSent,
            activeSockets: Object.fromEntries(Array.from(this.socketsByNamespace.entries()).map(([namespace, sockets]) => [namespace, sockets.size])),
        };
    }
};
exports.RealtimeMetricsService = RealtimeMetricsService;
exports.RealtimeMetricsService = RealtimeMetricsService = RealtimeMetricsService_1 = __decorate([
    (0, common_1.Injectable)()
], RealtimeMetricsService);
//# sourceMappingURL=realtime-metrics.service.js.map