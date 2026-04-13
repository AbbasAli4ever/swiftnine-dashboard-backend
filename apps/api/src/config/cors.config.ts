import type { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

const DEFAULT_CORS_METHODS = [
  'GET',
  'HEAD',
  'PUT',
  'PATCH',
  'POST',
  'DELETE',
  'OPTIONS',
];

const DEFAULT_CORS_ALLOWED_HEADERS = ['Content-Type', 'Authorization'];

const TRUE_VALUES = new Set(['true', '1', 'yes', 'on']);
const FALSE_VALUES = new Set(['false', '0', 'no', 'off']);

export function buildCorsOptions(env: NodeJS.ProcessEnv): CorsOptions {
  const allowCredentials = parseBooleanEnv(
    env['CORS_ALLOW_CREDENTIALS'],
    true,
    'CORS_ALLOW_CREDENTIALS',
  );
  const allowedOrigins = parseOrigins(env['CORS_ORIGINS']);
  const allowAllOrigins =
    allowedOrigins.length === 1 && allowedOrigins[0] === '*';

  if (allowAllOrigins && allowCredentials) {
    throw new Error(
      'CORS_ORIGINS cannot be "*" when CORS_ALLOW_CREDENTIALS is enabled.',
    );
  }

  return {
    credentials: allowCredentials,
    methods: parseListEnv(env['CORS_METHODS'], DEFAULT_CORS_METHODS),
    allowedHeaders: parseListEnv(
      env['CORS_ALLOWED_HEADERS'],
      DEFAULT_CORS_ALLOWED_HEADERS,
    ),
    origin: (origin, callback) => {
      // Requests from tools/server-side callers often omit Origin and should not
      // be blocked by CORS policy checks.
      if (!origin) {
        callback(null, true);
        return;
      }

      if (allowAllOrigins || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(null, false);
    },
    optionsSuccessStatus: 204,
  };
}

function parseOrigins(originsEnv: string | undefined): string[] {
  const origins = parseListEnv(originsEnv);

  if (origins.length === 0) {
    throw new Error(
      'CORS_ORIGINS must be provided as a comma-separated list of allowed origins.',
    );
  }

  if (origins.includes('*') && origins.length > 1) {
    throw new Error('CORS_ORIGINS cannot combine "*" with specific origins.');
  }

  return origins.map(validateOrigin);
}

function parseListEnv(
  value: string | undefined,
  fallback: string[] = [],
): string[] {
  if (!value?.trim()) {
    return [...fallback];
  }

  return [
    ...new Set(
      value
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean),
    ),
  ];
}

function parseBooleanEnv(
  value: string | undefined,
  fallback: boolean,
  key: string,
): boolean {
  if (!value?.trim()) {
    return fallback;
  }

  const normalizedValue = value.trim().toLowerCase();

  if (TRUE_VALUES.has(normalizedValue)) {
    return true;
  }

  if (FALSE_VALUES.has(normalizedValue)) {
    return false;
  }

  throw new Error(
    `${key} must be a boolean-like value: true/false, 1/0, yes/no, on/off.`,
  );
}

function validateOrigin(origin: string): string {
  if (origin === '*') {
    return origin;
  }

  let parsedUrl: URL;

  try {
    parsedUrl = new URL(origin);
  } catch {
    throw new Error(`CORS origin "${origin}" is not a valid URL.`);
  }

  if (parsedUrl.origin !== origin) {
    throw new Error(
      `CORS origin "${origin}" must not include a path, query string, or trailing slash.`,
    );
  }

  return origin;
}
