import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

export const TIER_SECRET_INVALID = 'Invalid secret key';
export const TIER_SECRET_NOT_CONFIGURED =
  'Tier change secret is not configured. Contact your administrator';
export const TIER_TOO_MANY_ATTEMPTS = 'Too many failed attempts. Try again later';
export const TIER_MEMBER_NOT_FOUND = 'Member not found in this workspace';
export const TIER_ALREADY_SET = 'Member is already on this tier';

export const TIER_SECRET_SALT_ROUNDS = 10;
export const TIER_SECRET_MAX_FAILED_ATTEMPTS = 5;
export const TIER_SECRET_LOCKOUT_MS = 15 * 60 * 1000;
export const TIER_SECRET_FAILED_ATTEMPT_WINDOW_MS = 15 * 60 * 1000;

/// Minimum length for a seeded secret. Long enough that brute force is
/// impractical even without the lockout.
export const TIER_SECRET_MIN_LENGTH = 12;

export const TOKEN_LIMIT_EXCEEDED =
  'Weekly premium token allowance is used up. Continue on the standard model, or ask an administrator to raise the limit';
export const TOKEN_ALLOWANCE_NOT_SET =
  'No token allowance is set for this member. Ask an administrator to assign one';
export const TOKEN_LIMIT_INVALID = 'Token limit must be a positive whole number';

/**
 * Usage bands surfaced to the client so the UI has one source of truth.
 *
 * The bar is always visible, so these are colour zones rather than warnings:
 * green below half, yellow from half, red approaching the limit.
 */
export const TOKEN_WARN_THRESHOLD_PERCENT = 50;
export const TOKEN_CRITICAL_THRESHOLD_PERCENT = 85;

/** Upper bound on a single assignment — guards against a mistyped extra digit. */
export const TOKEN_LIMIT_MAX = 1_000_000_000;

/**
 * Largest completion gpt-5.6-luna will emit in one reply — verified against the
 * API, which rejects anything above this. Replies are never truncated, so this
 * is the theoretical worst-case overshoot for a single message.
 */
export const MAX_SINGLE_REPLY_TOKENS = 128_000;

/**
 * Smallest assignable weekly limit. A limit below one possible reply makes the
 * quota behave incoherently — the member is blocked by their first message and
 * raising the limit appears to do nothing. Kept above MAX_SINGLE_REPLY_TOKENS so
 * an allowance is always worth at least one full answer.
 */
export const TOKEN_LIMIT_MIN = 150_000;

export const TOKEN_LIMIT_TOO_SMALL = `Weekly limit must be at least ${TOKEN_LIMIT_MIN.toLocaleString()} tokens — a single reply can use up to ${MAX_SINGLE_REPLY_TOKENS.toLocaleString()}`;

export type AiTierErrorCode =
  | 'TIER_SECRET_INVALID'
  | 'TIER_SECRET_NOT_CONFIGURED'
  | 'TIER_TOO_MANY_ATTEMPTS'
  | 'TIER_MEMBER_NOT_FOUND'
  | 'TIER_ALREADY_SET'
  | 'TOKEN_LIMIT_EXCEEDED'
  | 'TOKEN_ALLOWANCE_NOT_SET'
  | 'TOKEN_LIMIT_INVALID';

export function aiTierError(code: AiTierErrorCode, message: string) {
  return { code, message };
}

export function tierSecretInvalidException(): UnauthorizedException {
  return new UnauthorizedException(aiTierError('TIER_SECRET_INVALID', TIER_SECRET_INVALID));
}

export function tierSecretNotConfiguredException(): ForbiddenException {
  return new ForbiddenException(
    aiTierError('TIER_SECRET_NOT_CONFIGURED', TIER_SECRET_NOT_CONFIGURED),
  );
}

export function tierTooManyAttemptsException(): ForbiddenException {
  return new ForbiddenException(
    aiTierError('TIER_TOO_MANY_ATTEMPTS', TIER_TOO_MANY_ATTEMPTS),
  );
}

export function tierMemberNotFoundException(): NotFoundException {
  return new NotFoundException(aiTierError('TIER_MEMBER_NOT_FOUND', TIER_MEMBER_NOT_FOUND));
}

/** 403 rather than 429: the budget is exhausted, not rate-limited. */
export function tokenLimitExceededException(): ForbiddenException {
  return new ForbiddenException(aiTierError('TOKEN_LIMIT_EXCEEDED', TOKEN_LIMIT_EXCEEDED));
}

export function tokenAllowanceNotSetException(): ForbiddenException {
  return new ForbiddenException(aiTierError('TOKEN_ALLOWANCE_NOT_SET', TOKEN_ALLOWANCE_NOT_SET));
}

export function tokenLimitInvalidException(): BadRequestException {
  return new BadRequestException(aiTierError('TOKEN_LIMIT_INVALID', TOKEN_LIMIT_INVALID));
}
