"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var SseService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SseService = void 0;
const common_1 = require("@nestjs/common");
const TOKEN_EXPIRY_WARNING_MS = 30_000;
let SseService = SseService_1 = class SseService {
    logger = new common_1.Logger(SseService_1.name);
    clients = new Map();
    registerClient(taskId, res, tokenExp) {
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        res.setHeader('X-Accel-Buffering', 'no');
        res.flushHeaders?.();
        const heartbeat = setInterval(() => {
            try {
                res.write(':heartbeat\n\n');
            }
            catch {
                this.logger.debug('Error writing heartbeat, removing client');
                this.unregisterClient(taskId, res);
            }
        }, 15000);
        let expiryTimer;
        if (tokenExp) {
            const delay = tokenExp * 1000 - Date.now() - TOKEN_EXPIRY_WARNING_MS;
            const warn = () => {
                try {
                    res.write('event: token-expiring\n');
                    res.write(`data: ${JSON.stringify({ expiresAt: tokenExp })}\n\n`);
                }
                catch {
                }
            };
            if (delay > 0) {
                expiryTimer = setTimeout(warn, delay);
            }
            else {
                warn();
            }
        }
        const entry = { res, heartbeat, expiryTimer };
        const set = this.clients.get(taskId) ?? new Set();
        set.add(entry);
        this.clients.set(taskId, set);
        res.on('close', () => {
            this.unregisterClient(taskId, res);
        });
    }
    unregisterClient(taskId, res) {
        const set = this.clients.get(taskId);
        if (!set)
            return;
        for (const e of Array.from(set)) {
            if (e.res === res) {
                clearInterval(e.heartbeat);
                if (e.expiryTimer)
                    clearTimeout(e.expiryTimer);
                try {
                    e.res.end();
                }
                catch { }
                set.delete(e);
            }
        }
        if (set.size === 0)
            this.clients.delete(taskId);
    }
    broadcast(taskId, event, payload) {
        const set = this.clients.get(taskId);
        if (!set || set.size === 0)
            return;
        const data = JSON.stringify(payload);
        for (const entry of Array.from(set)) {
            try {
                entry.res.write(`event: ${event}\n`);
                entry.res.write(`data: ${data}\n\n`);
            }
            catch {
                this.logger.debug('Error broadcasting to client, removing');
                this.unregisterClient(taskId, entry.res);
            }
        }
    }
    sendToClient(res, event, payload) {
        try {
            res.write(`event: ${event}\n`);
            res.write(`data: ${JSON.stringify(payload)}\n\n`);
        }
        catch {
            this.logger.debug('Error sending to single client');
        }
    }
    onModuleDestroy() {
        for (const [taskId, set] of this.clients.entries()) {
            for (const e of set) {
                clearInterval(e.heartbeat);
                if (e.expiryTimer)
                    clearTimeout(e.expiryTimer);
                try {
                    e.res.end();
                }
                catch { }
            }
            set.clear();
        }
        this.clients.clear();
    }
};
exports.SseService = SseService;
exports.SseService = SseService = SseService_1 = __decorate([
    (0, common_1.Injectable)()
], SseService);
//# sourceMappingURL=sse.service.js.map