"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtAuthGuard = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const auth_constants_1 = require("../auth.constants");
let JwtAuthGuard = class JwtAuthGuard extends (0, passport_1.AuthGuard)('jwt') {
    handleRequest(err, user, info) {
        if (user) {
            return user;
        }
        if (err instanceof common_1.UnauthorizedException) {
            throw err;
        }
        const failure = this.getFailureInfo(err, info);
        if (this.isMissingTokenError(failure)) {
            throw new common_1.UnauthorizedException(auth_constants_1.AUTHENTICATION_REQUIRED_MESSAGE);
        }
        if (failure?.name === 'TokenExpiredError') {
            throw new common_1.UnauthorizedException(auth_constants_1.ACCESS_TOKEN_EXPIRED_MESSAGE);
        }
        throw new common_1.UnauthorizedException(auth_constants_1.INVALID_ACCESS_TOKEN_MESSAGE);
    }
    isMissingTokenError(info) {
        return Boolean(info?.message &&
            /No auth token|No authorization token/i.test(info.message));
    }
    getFailureInfo(err, info) {
        if (info?.message || info?.name) {
            return info;
        }
        if (err instanceof Error) {
            return {
                message: err.message,
                name: err.name,
            };
        }
        return undefined;
    }
};
exports.JwtAuthGuard = JwtAuthGuard;
exports.JwtAuthGuard = JwtAuthGuard = __decorate([
    (0, common_1.Injectable)()
], JwtAuthGuard);
//# sourceMappingURL=jwt-auth.guard.js.map