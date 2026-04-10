import type { Prisma } from '@app/database/generated/prisma/client';

// Must stay in sync with JWT_REFRESH_EXPIRES_IN env var
export const REFRESH_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7d

export const INVALID_CREDENTIALS_MESSAGE = 'Invalid email or password';

export const AUTH_USER_SELECT = {
  id: true,
  fullName: true,
  email: true,
  avatarUrl: true,
  avatarColor: true,
} satisfies Prisma.UserSelect;
