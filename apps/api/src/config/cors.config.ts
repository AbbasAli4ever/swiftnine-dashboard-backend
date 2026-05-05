import type { CorsOptionsDelegate } from '@nestjs/common/interfaces/external/cors-options.interface';
import type { Request } from 'express';

const DEFAULT_CORS_METHODS = [
  'GET',
  'HEAD',
  'PUT',
  'PATCH',
  'POST',
  'DELETE',
  'OPTIONS',
];

const DEFAULT_CORS_ALLOWED_HEADERS = [
  'Content-Type',
  'Authorization',
  'x-workspace-id',
];

const TRUE_VALUES = new Set(['true', '1', 'yes', 'on']);
const FALSE_VALUES = new Set(['false', '0', 'no', 'off']);

export function buildCorsOptions(
  env: NodeJS.ProcessEnv,
): CorsOptionsDelegate<Request> {
  const allowCredentials = parseBooleanEnv(
    env['CORS_ALLOW_CREDENTIALS'],
    true,
    'CORS_ALLOW_CREDENTIALS',
  );
  const allowedHeaders = ensureRequiredHeaders(
    parseListEnv(env['CORS_ALLOWED_HEADERS'], DEFAULT_CORS_ALLOWED_HEADERS),
    DEFAULT_CORS_ALLOWED_HEADERS,
  );
  const allowedOrigins = parseListEnv(env['CORS_ALLOWED_ORIGINS']);

  return (req, callback) => {
    const requestedHeaders = parseHeaderList(
      getSingleHeader(req.headers['access-control-request-headers']),
    );

    callback(null, {
      credentials: allowCredentials,
      methods: DEFAULT_CORS_METHODS,
      allowedHeaders:
        requestedHeaders.length > 0 ? requestedHeaders : allowedHeaders,
      origin: resolveCorsOrigin(
        getSingleHeader(req.headers.origin),
        allowedOrigins,
      ),
      optionsSuccessStatus: 204,
    });
  };
}

export function buildWebsocketCorsOptions(env: NodeJS.ProcessEnv) {
  const allowCredentials = parseBooleanEnv(
    env['CORS_ALLOW_CREDENTIALS'],
    true,
    'CORS_ALLOW_CREDENTIALS',
  );
  const allowedHeaders = ensureRequiredHeaders(
    parseListEnv(env['CORS_ALLOWED_HEADERS'], DEFAULT_CORS_ALLOWED_HEADERS),
    DEFAULT_CORS_ALLOWED_HEADERS,
  );
  const allowedOrigins = parseListEnv(env['CORS_ALLOWED_ORIGINS']);

  return {
    credentials: allowCredentials,
    methods: DEFAULT_CORS_METHODS,
    allowedHeaders,
    origin(
      origin: string | undefined,
      callback: (err: Error | null, allow?: boolean) => void,
    ) {
      const resolved = resolveCorsOrigin(origin, allowedOrigins);

      if (resolved === true || typeof resolved === 'string') {
        callback(null, true);
        return;
      }

      callback(new Error('Origin not allowed by CORS'), false);
    },
  };
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

function ensureRequiredHeaders(
  configuredHeaders: string[],
  requiredHeaders: string[],
): string[] {
  const mergedHeaders = [...configuredHeaders];

  for (const requiredHeader of requiredHeaders) {
    const alreadyIncluded = mergedHeaders.some(
      (header) => header.toLowerCase() === requiredHeader.toLowerCase(),
    );

    if (!alreadyIncluded) {
      mergedHeaders.push(requiredHeader);
    }
  }

  return mergedHeaders;
}

function getSingleHeader(
  value: string | string[] | undefined,
): string | undefined {
  if (typeof value === 'string') {
    return value.trim() || undefined;
  }

  if (Array.isArray(value)) {
    return value[0]?.trim() || undefined;
  }

  return undefined;
}

function parseHeaderList(value: string | undefined): string[] {
  if (!value) {
    return [];
  }

  return value
    .split(',')
    .map((header) => header.trim())
    .filter(Boolean);
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

function resolveCorsOrigin(
  origin: string | undefined,
  allowedOrigins: string[],
): true | string | false {
  if (allowedOrigins.length === 0) {
    return true;
  }

  if (!origin) {
    return false;
  }

  return allowedOrigins.includes(origin) ? origin : false;
}
