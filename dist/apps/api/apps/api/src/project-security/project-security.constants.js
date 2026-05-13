"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PROJECT_SECURITY_PROJECT_SELECT = exports.PROJECT_PASSWORD_PATTERN = exports.PROJECT_SECURITY_CLEANUP_INTERVAL_MS = exports.PROJECT_PASSWORD_RESET_TOKEN_USED_RETENTION_MS = exports.PROJECT_PASSWORD_RESET_REQUEST_COOLDOWN_MS = exports.PROJECT_PASSWORD_RESET_TOKEN_TTL_MS = exports.PROJECT_UNLOCK_FAILED_ATTEMPT_WINDOW_MS = exports.PROJECT_UNLOCK_LOCKOUT_MS = exports.PROJECT_UNLOCK_MAX_FAILED_ATTEMPTS = exports.PROJECT_UNLOCK_TTL_MS = exports.PROJECT_PASSWORD_SALT_ROUNDS = exports.RESET_REQUEST_RATE_LIMITED = exports.RESET_TOKEN_INVALID = exports.PROJECT_PASSWORD_NOT_SET = exports.PASSWORD_ALREADY_SET = exports.INVALID_PASSWORD_FORMAT = exports.TOO_MANY_ATTEMPTS = exports.INVALID_PASSWORD = exports.PROJECT_PASSWORD_MANAGER_ONLY = exports.PROJECT_LOCKED = exports.PROJECT_NOT_FOUND = void 0;
exports.projectSecurityError = projectSecurityError;
exports.projectNotFoundException = projectNotFoundException;
exports.projectLockedException = projectLockedException;
exports.projectPasswordManagerOnlyException = projectPasswordManagerOnlyException;
exports.invalidPasswordException = invalidPasswordException;
exports.tooManyAttemptsException = tooManyAttemptsException;
exports.invalidPasswordFormatException = invalidPasswordFormatException;
exports.passwordAlreadySetException = passwordAlreadySetException;
exports.projectPasswordNotSetException = projectPasswordNotSetException;
exports.resetTokenInvalidException = resetTokenInvalidException;
exports.resetRequestRateLimitedException = resetRequestRateLimitedException;
const common_1 = require("@nestjs/common");
exports.PROJECT_NOT_FOUND = 'Project not found';
exports.PROJECT_LOCKED = 'Project is locked';
exports.PROJECT_PASSWORD_MANAGER_ONLY = 'Only the workspace owner or project creator can manage the project password';
exports.INVALID_PASSWORD = 'Invalid project password';
exports.TOO_MANY_ATTEMPTS = 'Too many failed attempts. Try again later';
exports.INVALID_PASSWORD_FORMAT = 'Project password must be at least 8 characters and include at least 1 digit';
exports.PASSWORD_ALREADY_SET = 'Project password is already set';
exports.PROJECT_PASSWORD_NOT_SET = 'Project password is not set';
exports.RESET_TOKEN_INVALID = 'Project password reset token is invalid or expired';
exports.RESET_REQUEST_RATE_LIMITED = 'Project password reset was requested recently. Try again later';
exports.PROJECT_PASSWORD_SALT_ROUNDS = 10;
exports.PROJECT_UNLOCK_TTL_MS = 24 * 60 * 60 * 1000;
exports.PROJECT_UNLOCK_MAX_FAILED_ATTEMPTS = 5;
exports.PROJECT_UNLOCK_LOCKOUT_MS = 15 * 60 * 1000;
exports.PROJECT_UNLOCK_FAILED_ATTEMPT_WINDOW_MS = 15 * 60 * 1000;
exports.PROJECT_PASSWORD_RESET_TOKEN_TTL_MS = 60 * 60 * 1000;
exports.PROJECT_PASSWORD_RESET_REQUEST_COOLDOWN_MS = 5 * 60 * 1000;
exports.PROJECT_PASSWORD_RESET_TOKEN_USED_RETENTION_MS = 24 * 60 * 60 * 1000;
exports.PROJECT_SECURITY_CLEANUP_INTERVAL_MS = 60 * 60 * 1000;
exports.PROJECT_PASSWORD_PATTERN = /^(?=.*\d).{8,}$/;
exports.PROJECT_SECURITY_PROJECT_SELECT = {
    id: true,
    workspaceId: true,
    name: true,
    createdBy: true,
    passwordHash: true,
    passwordSetBy: true,
    passwordUpdatedAt: true,
    deletedAt: true,
};
function projectSecurityError(code, message) {
    return { code, message };
}
function projectNotFoundException() {
    return new common_1.NotFoundException(projectSecurityError('PROJECT_NOT_FOUND', exports.PROJECT_NOT_FOUND));
}
function projectLockedException() {
    return new common_1.ForbiddenException(projectSecurityError('PROJECT_LOCKED', exports.PROJECT_LOCKED));
}
function projectPasswordManagerOnlyException() {
    return new common_1.ForbiddenException(projectSecurityError('PROJECT_PASSWORD_MANAGER_ONLY', exports.PROJECT_PASSWORD_MANAGER_ONLY));
}
function invalidPasswordException() {
    return new common_1.UnauthorizedException(projectSecurityError('INVALID_PASSWORD', exports.INVALID_PASSWORD));
}
function tooManyAttemptsException() {
    return new common_1.ForbiddenException(projectSecurityError('TOO_MANY_ATTEMPTS', exports.TOO_MANY_ATTEMPTS));
}
function invalidPasswordFormatException() {
    return new common_1.BadRequestException(projectSecurityError('INVALID_PASSWORD_FORMAT', exports.INVALID_PASSWORD_FORMAT));
}
function passwordAlreadySetException() {
    return new common_1.ConflictException(projectSecurityError('PASSWORD_ALREADY_SET', exports.PASSWORD_ALREADY_SET));
}
function projectPasswordNotSetException() {
    return new common_1.BadRequestException(projectSecurityError('PROJECT_PASSWORD_NOT_SET', exports.PROJECT_PASSWORD_NOT_SET));
}
function resetTokenInvalidException() {
    return new common_1.UnauthorizedException(projectSecurityError('RESET_TOKEN_INVALID', exports.RESET_TOKEN_INVALID));
}
function resetRequestRateLimitedException() {
    return new common_1.HttpException(projectSecurityError('RESET_REQUEST_RATE_LIMITED', exports.RESET_REQUEST_RATE_LIMITED), common_1.HttpStatus.TOO_MANY_REQUESTS);
}
//# sourceMappingURL=project-security.constants.js.map