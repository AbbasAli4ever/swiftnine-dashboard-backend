import type { CookieOptions } from 'express';
import { REFRESH_TOKEN_TTL_MS } from './auth.constants';

type SameSite = 'lax' | 'strict' | 'none';

function resolveSameSite(): SameSite {
  const raw = process.env['COOKIE_SAMESITE']?.toLowerCase();
  if (raw === 'lax' || raw === 'strict' || raw === 'none') return raw;
  return 'lax';
}

function baseRefreshCookieOptions(): CookieOptions {
  const sameSite = resolveSameSite();
  const domain = process.env['COOKIE_DOMAIN']?.trim();
  const isProd = process.env['NODE_ENV'] === 'production';
  return {
    httpOnly: true,
    // Browsers require Secure when SameSite=None, regardless of NODE_ENV.
    secure: isProd || sameSite === 'none',
    sameSite,
    path: '/',
    ...(domain ? { domain } : {}),
  };
}

export function buildRefreshCookieOptions(): CookieOptions {
  return { ...baseRefreshCookieOptions(), maxAge: REFRESH_TOKEN_TTL_MS };
}

export function buildClearRefreshCookieOptions(): CookieOptions {
  return baseRefreshCookieOptions();
}
