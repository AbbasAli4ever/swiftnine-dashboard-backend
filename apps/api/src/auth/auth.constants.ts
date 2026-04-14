import type { Prisma } from '@app/database/generated/prisma/client';
import { z } from 'zod';

// Must stay in sync with JWT_REFRESH_EXPIRES_IN env var
export const REFRESH_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7d

export const INVALID_CREDENTIALS_MESSAGE = 'Invalid email or password';
export const AUTHENTICATION_REQUIRED_MESSAGE =
  'Authentication token is required';
export const INVALID_ACCESS_TOKEN_MESSAGE = 'Invalid or expired access token';
export const ACCESS_TOKEN_EXPIRED_MESSAGE = 'Access token has expired';
export const GOOGLE_EMAIL_REQUIRED_MESSAGE =
  'Google account must provide a verified email address';
export const INACTIVE_ACCOUNT_MESSAGE = 'Account is no longer active';
export const GOOGLE_ACCOUNT_CONFLICT_MESSAGE =
  'This email is already linked to another Google account';
export const INVALID_REFRESH_TOKEN_MESSAGE =
  'Refresh token is invalid, expired, or already used';
export const INVALID_OTP_MESSAGE = 'OTP is invalid or has expired';
export const GOOGLE_ONLY_ACCOUNT_MESSAGE =
  'This account uses Google sign-in and has no password to reset';

export const RESET_OTP_TTL_MS = 15 * 60 * 1000; // 15 min

export const AUTH_USER_SELECT = {
  id: true,
  fullName: true,
  email: true,
  avatarUrl: true,
  avatarColor: true,
} satisfies Prisma.UserSelect;

export const ACCESS_TOKEN_PAYLOAD_SCHEMA = z.object({
  sub: z.string().trim().min(1),
  email: z.string().trim().toLowerCase().email(),
  iat: z.number().optional(),
  exp: z.number().optional(),
});

export type AccessTokenPayload = z.infer<typeof ACCESS_TOKEN_PAYLOAD_SCHEMA>;
