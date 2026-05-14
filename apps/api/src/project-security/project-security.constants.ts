import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import type { Prisma } from '@app/database/generated/prisma/client';

export const PROJECT_NOT_FOUND = 'Project not found';
export const PROJECT_LOCKED = 'Project is locked';
export const PROJECT_PASSWORD_MANAGER_ONLY =
  'Only the workspace owner or project creator can manage the project password';
export const INVALID_PASSWORD = 'Invalid project password';
export const TOO_MANY_ATTEMPTS = 'Too many failed attempts. Try again later';
export const INVALID_PASSWORD_FORMAT =
  'Project password must be at least 8 characters and include at least 1 digit';
export const PASSWORD_ALREADY_SET = 'Project password is already set';
export const PROJECT_PASSWORD_NOT_SET = 'Project password is not set';
export const RESET_TOKEN_INVALID = 'Project password reset token is invalid or expired';
export const RESET_REQUEST_RATE_LIMITED =
  'Project password reset was requested recently. Try again later';

export const PROJECT_PASSWORD_SALT_ROUNDS = 10;
export const PROJECT_UNLOCK_TTL_MS = 24 * 60 * 60 * 1000;
export const PROJECT_UNLOCK_MAX_FAILED_ATTEMPTS = 5;
export const PROJECT_UNLOCK_LOCKOUT_MS = 15 * 60 * 1000;
export const PROJECT_UNLOCK_FAILED_ATTEMPT_WINDOW_MS = 15 * 60 * 1000;
export const PROJECT_PASSWORD_RESET_TOKEN_TTL_MS = 60 * 60 * 1000;
export const PROJECT_PASSWORD_RESET_REQUEST_COOLDOWN_MS = 5 * 60 * 1000;
export const PROJECT_PASSWORD_RESET_TOKEN_USED_RETENTION_MS = 24 * 60 * 60 * 1000;
export const PROJECT_SECURITY_CLEANUP_INTERVAL_MS = 60 * 60 * 1000;

export const PROJECT_PASSWORD_PATTERN = /^(?=.*\d).{8,}$/;

export const PROJECT_SECURITY_PROJECT_SELECT = {
  id: true,
  workspaceId: true,
  name: true,
  createdBy: true,
  passwordHash: true,
  passwordSetBy: true,
  passwordUpdatedAt: true,
  deletedAt: true,
} satisfies Prisma.ProjectSelect;

export type ProjectSecurityProject = Prisma.ProjectGetPayload<{
  select: typeof PROJECT_SECURITY_PROJECT_SELECT;
}>;

export type ProjectSecurityErrorCode =
  | 'PROJECT_LOCKED'
  | 'INVALID_PASSWORD'
  | 'TOO_MANY_ATTEMPTS'
  | 'INVALID_PASSWORD_FORMAT'
  | 'PASSWORD_ALREADY_SET'
  | 'PROJECT_PASSWORD_NOT_SET'
  | 'RESET_TOKEN_INVALID'
  | 'RESET_REQUEST_RATE_LIMITED'
  | 'PROJECT_PASSWORD_MANAGER_ONLY'
  | 'PROJECT_NOT_FOUND';

export function projectSecurityError(
  code: ProjectSecurityErrorCode,
  message: string,
) {
  return { code, message };
}

export function projectNotFoundException(): NotFoundException {
  return new NotFoundException(projectSecurityError('PROJECT_NOT_FOUND', PROJECT_NOT_FOUND));
}

export function projectLockedException(): ForbiddenException {
  return new ForbiddenException(projectSecurityError('PROJECT_LOCKED', PROJECT_LOCKED));
}

export function projectPasswordManagerOnlyException(): ForbiddenException {
  return new ForbiddenException(
    projectSecurityError(
      'PROJECT_PASSWORD_MANAGER_ONLY',
      PROJECT_PASSWORD_MANAGER_ONLY,
    ),
  );
}

export function invalidPasswordException(): UnauthorizedException {
  return new UnauthorizedException(projectSecurityError('INVALID_PASSWORD', INVALID_PASSWORD));
}

export function tooManyAttemptsException(): ForbiddenException {
  return new ForbiddenException(projectSecurityError('TOO_MANY_ATTEMPTS', TOO_MANY_ATTEMPTS));
}

export function invalidPasswordFormatException(): BadRequestException {
  return new BadRequestException(
    projectSecurityError('INVALID_PASSWORD_FORMAT', INVALID_PASSWORD_FORMAT),
  );
}

export function passwordAlreadySetException(): ConflictException {
  return new ConflictException(
    projectSecurityError('PASSWORD_ALREADY_SET', PASSWORD_ALREADY_SET),
  );
}

export function projectPasswordNotSetException(): BadRequestException {
  return new BadRequestException(
    projectSecurityError('PROJECT_PASSWORD_NOT_SET', PROJECT_PASSWORD_NOT_SET),
  );
}

export function resetTokenInvalidException(): UnauthorizedException {
  return new UnauthorizedException(
    projectSecurityError('RESET_TOKEN_INVALID', RESET_TOKEN_INVALID),
  );
}

export function resetRequestRateLimitedException(): HttpException {
  return new HttpException(
    projectSecurityError('RESET_REQUEST_RATE_LIMITED', RESET_REQUEST_RATE_LIMITED),
    HttpStatus.TOO_MANY_REQUESTS,
  );
}
