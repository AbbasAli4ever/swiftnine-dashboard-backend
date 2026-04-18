"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildRefreshCookieOptions = buildRefreshCookieOptions;
exports.buildClearRefreshCookieOptions = buildClearRefreshCookieOptions;
const auth_constants_1 = require("./auth.constants");
function resolveSameSite() {
    const raw = process.env['COOKIE_SAMESITE']?.toLowerCase();
    if (raw === 'lax' || raw === 'strict' || raw === 'none')
        return raw;
    return 'lax';
}
function baseRefreshCookieOptions() {
    const sameSite = resolveSameSite();
    const domain = process.env['COOKIE_DOMAIN']?.trim();
    const isProd = process.env['NODE_ENV'] === 'production';
    return {
        httpOnly: true,
        secure: isProd || sameSite === 'none',
        sameSite,
        path: '/',
        ...(domain ? { domain } : {}),
    };
}
function buildRefreshCookieOptions() {
    return { ...baseRefreshCookieOptions(), maxAge: auth_constants_1.REFRESH_TOKEN_TTL_MS };
}
function buildClearRefreshCookieOptions() {
    return baseRefreshCookieOptions();
}
//# sourceMappingURL=auth.cookies.js.map