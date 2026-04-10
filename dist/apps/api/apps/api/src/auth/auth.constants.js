"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AUTH_USER_SELECT = exports.INVALID_CREDENTIALS_MESSAGE = exports.REFRESH_TOKEN_TTL_MS = void 0;
exports.REFRESH_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000;
exports.INVALID_CREDENTIALS_MESSAGE = 'Invalid email or password';
exports.AUTH_USER_SELECT = {
    id: true,
    fullName: true,
    email: true,
    avatarUrl: true,
    avatarColor: true,
};
//# sourceMappingURL=auth.constants.js.map