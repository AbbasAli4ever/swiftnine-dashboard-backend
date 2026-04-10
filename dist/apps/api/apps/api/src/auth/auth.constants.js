"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ACCESS_TOKEN_PAYLOAD_SCHEMA = exports.AUTH_USER_SELECT = exports.ACCESS_TOKEN_EXPIRED_MESSAGE = exports.INVALID_ACCESS_TOKEN_MESSAGE = exports.AUTHENTICATION_REQUIRED_MESSAGE = exports.INVALID_CREDENTIALS_MESSAGE = exports.REFRESH_TOKEN_TTL_MS = void 0;
const zod_1 = require("zod");
exports.REFRESH_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000;
exports.INVALID_CREDENTIALS_MESSAGE = 'Invalid email or password';
exports.AUTHENTICATION_REQUIRED_MESSAGE = 'Authentication token is required';
exports.INVALID_ACCESS_TOKEN_MESSAGE = 'Invalid or expired access token';
exports.ACCESS_TOKEN_EXPIRED_MESSAGE = 'Access token has expired';
exports.AUTH_USER_SELECT = {
    id: true,
    fullName: true,
    email: true,
    avatarUrl: true,
    avatarColor: true,
};
exports.ACCESS_TOKEN_PAYLOAD_SCHEMA = zod_1.z.object({
    sub: zod_1.z.string().trim().min(1),
    email: zod_1.z.string().trim().toLowerCase().email(),
    iat: zod_1.z.number().optional(),
    exp: zod_1.z.number().optional(),
});
//# sourceMappingURL=auth.constants.js.map