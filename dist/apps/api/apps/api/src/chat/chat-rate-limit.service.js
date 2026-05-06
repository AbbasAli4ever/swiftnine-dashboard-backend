"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatRateLimitService = void 0;
const common_1 = require("@nestjs/common");
const websockets_1 = require("@nestjs/websockets");
let ChatRateLimitService = class ChatRateLimitService {
    buckets = new Map();
    assertMessageSend(userId, channelId) {
        this.assertHttp(`message:${userId}:${channelId}`, 30, 60_000, 'Too many messages in this channel. Please slow down.');
    }
    assertReactionToggle(userId, channelId) {
        this.assertHttp(`reaction:${userId}:${channelId}`, 120, 60_000, 'Too many reaction changes. Please slow down.');
    }
    assertTypingEvent(userId, channelId) {
        this.assertWs(`typing:${userId}:${channelId}`, 120, 60_000, 'Too many typing events. Please slow down.');
    }
    assertHttp(key, limit, windowMs, message) {
        if (!this.consume(key, limit, windowMs)) {
            throw new common_1.HttpException(message, common_1.HttpStatus.TOO_MANY_REQUESTS);
        }
    }
    assertWs(key, limit, windowMs, message) {
        if (!this.consume(key, limit, windowMs)) {
            throw new websockets_1.WsException(message);
        }
    }
    consume(key, limit, windowMs) {
        const now = Date.now();
        const bucket = this.buckets.get(key);
        if (!bucket || bucket.resetAt <= now) {
            this.buckets.set(key, {
                count: 1,
                resetAt: now + windowMs,
            });
            return true;
        }
        if (bucket.count >= limit) {
            return false;
        }
        bucket.count += 1;
        return true;
    }
};
exports.ChatRateLimitService = ChatRateLimitService;
exports.ChatRateLimitService = ChatRateLimitService = __decorate([
    (0, common_1.Injectable)()
], ChatRateLimitService);
//# sourceMappingURL=chat-rate-limit.service.js.map