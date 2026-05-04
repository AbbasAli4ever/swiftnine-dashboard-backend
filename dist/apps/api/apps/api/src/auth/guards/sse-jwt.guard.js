"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SseJwtGuard = void 0;
const common_1 = require("@nestjs/common");
const auth_constants_1 = require("../auth.constants");
const jwt_auth_guard_1 = require("./jwt-auth.guard");
let SseJwtGuard = class SseJwtGuard extends jwt_auth_guard_1.JwtAuthGuard {
    async canActivate(context) {
        try {
            return await super.canActivate(context);
        }
        catch (err) {
            if (err instanceof common_1.UnauthorizedException &&
                err.message === auth_constants_1.ACCESS_TOKEN_EXPIRED_MESSAGE) {
                const res = context.switchToHttp().getResponse();
                if (!res.writableEnded) {
                    res.setHeader('Content-Type', 'text/event-stream');
                    res.setHeader('Cache-Control', 'no-cache');
                    res.setHeader('Connection', 'keep-alive');
                    res.setHeader('X-Accel-Buffering', 'no');
                    res.write('retry: 86400000\n');
                    res.write('event: auth_error\n');
                    res.write(`data: ${JSON.stringify({ code: 'TOKEN_EXPIRED', message: auth_constants_1.ACCESS_TOKEN_EXPIRED_MESSAGE })}\n\n`);
                    res.end();
                }
            }
            throw err;
        }
    }
};
exports.SseJwtGuard = SseJwtGuard;
exports.SseJwtGuard = SseJwtGuard = __decorate([
    (0, common_1.Injectable)()
], SseJwtGuard);
//# sourceMappingURL=sse-jwt.guard.js.map