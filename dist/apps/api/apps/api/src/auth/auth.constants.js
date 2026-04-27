"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ACCESS_TOKEN_PAYLOAD_SCHEMA = exports.AUTH_USER_SELECT = exports.VERIFICATION_OTP_TTL_MS = exports.RESET_TOKEN_TTL_MS = exports.GOOGLE_ONLY_ACCOUNT_MESSAGE = exports.EMAIL_ALREADY_REGISTERED_MESSAGE = exports.EMAIL_NOT_VERIFIED_MESSAGE = exports.INVALID_RESET_TOKEN_MESSAGE = exports.INVALID_OTP_MESSAGE = exports.INVALID_REFRESH_TOKEN_MESSAGE = exports.GOOGLE_ACCOUNT_CONFLICT_MESSAGE = exports.INACTIVE_ACCOUNT_MESSAGE = exports.GOOGLE_EMAIL_REQUIRED_MESSAGE = exports.ACCESS_TOKEN_EXPIRED_MESSAGE = exports.INVALID_ACCESS_TOKEN_MESSAGE = exports.AUTHENTICATION_REQUIRED_MESSAGE = exports.INVALID_CREDENTIALS_MESSAGE = exports.REFRESH_TOKEN_TTL_MS = void 0;
const zod_1 = require("zod");
exports.REFRESH_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000;
exports.INVALID_CREDENTIALS_MESSAGE = 'Invalid email or password';
exports.AUTHENTICATION_REQUIRED_MESSAGE = 'Authentication token is required';
exports.INVALID_ACCESS_TOKEN_MESSAGE = 'Invalid or expired access token';
exports.ACCESS_TOKEN_EXPIRED_MESSAGE = 'Access token has expired';
exports.GOOGLE_EMAIL_REQUIRED_MESSAGE = 'Google account must provide a verified email address';
exports.INACTIVE_ACCOUNT_MESSAGE = 'Account is no longer active';
exports.GOOGLE_ACCOUNT_CONFLICT_MESSAGE = 'This email is already linked to another Google account';
exports.INVALID_REFRESH_TOKEN_MESSAGE = 'Refresh token is invalid, expired, or already used';
exports.INVALID_OTP_MESSAGE = 'OTP is invalid or has expired';
exports.INVALID_RESET_TOKEN_MESSAGE = 'Reset link is invalid or has expired';
exports.EMAIL_NOT_VERIFIED_MESSAGE = 'Email not verified. Check your inbox for the verification code.';
exports.EMAIL_ALREADY_REGISTERED_MESSAGE = 'This email is already registered but not yet verified. A new verification code has been sent.';
exports.GOOGLE_ONLY_ACCOUNT_MESSAGE = 'This account uses Google sign-in and has no password to reset';
exports.RESET_TOKEN_TTL_MS = 60 * 60 * 1000;
exports.VERIFICATION_OTP_TTL_MS = 15 * 60 * 1000;
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