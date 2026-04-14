import { Logger } from '@nestjs/common';
import type {
  CorsOptions,
  CorsOptionsDelegate,
} from '@nestjs/common/interfaces/external/cors-options.interface';
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

const corsLogger = new Logger('CORS');

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
  const allowedOrigins = parseOrigins(env['CORS_ORIGINS']);
  const allowedMethods = parseListEnv(env['CORS_METHODS'], DEFAULT_CORS_METHODS);
  const allowedHeaders = ensureRequiredHeaders(
    parseListEnv(env['CORS_ALLOWED_HEADERS'], DEFAULT_CORS_ALLOWED_HEADERS),
    DEFAULT_CORS_ALLOWED_HEADERS,
  );
  const allowAllOrigins =
    allowedOrigins.length === 1 && allowedOrigins[0] === '*';

  if (allowAllOrigins && allowCredentials) {
    throw new Error(
      'CORS_ORIGINS cannot be "*" when CORS_ALLOW_CREDENTIALS is enabled.',
    );
  }

  return (req, callback) => {
    const requestOrigin = getSingleHeader(req.headers.origin);
    const requestedMethod = getSingleHeader(
      req.headers['access-control-request-method'],
    );
    const requestedHeaders = parseHeaderList(
      getSingleHeader(req.headers['access-control-request-headers']),
    );
    const corsIssues = getCorsIssues({
      requestOrigin,
      requestedMethod,
      requestedHeaders,
      allowedOrigins,
      allowedMethods,
      allowedHeaders,
      allowAllOrigins,
    });

    if (corsIssues.length > 0) {
      corsLogger.warn(
        `Rejected CORS request: ${JSON.stringify({
          path: req.originalUrl ?? req.url,
          method: req.method,
          origin: requestOrigin ?? null,
          requestedMethod: requestedMethod ?? null,
          requestedHeaders,
          allowedOrigins,
          allowedMethods,
          allowedHeaders,
          issues: corsIssues,
        })}`,
      );
    }

    callback(null, {
      credentials: allowCredentials,
      methods: allowedMethods,
      allowedHeaders,
      origin:
        !requestOrigin || allowAllOrigins || allowedOrigins.includes(requestOrigin),
      optionsSuccessStatus: 204,
    });
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

function getCorsIssues({
  requestOrigin,
  requestedMethod,
  requestedHeaders,
  allowedOrigins,
  allowedMethods,
  allowedHeaders,
  allowAllOrigins,
}: {
  requestOrigin: string | undefined;
  requestedMethod: string | undefined;
  requestedHeaders: string[];
  allowedOrigins: string[];
  allowedMethods: string[];
  allowedHeaders: string[];
  allowAllOrigins: boolean;
}): string[] {
  const issues: string[] = [];

  if (
    requestOrigin &&
    !allowAllOrigins &&
    !allowedOrigins.includes(requestOrigin)
  ) {
    issues.push(`Origin "${requestOrigin}" is not in CORS_ORIGINS`);
  }

  if (
    requestedMethod &&
    !allowedMethods.some(
      (allowedMethod) =>
        allowedMethod.toLowerCase() === requestedMethod.toLowerCase(),
    )
  ) {
    issues.push(`Method "${requestedMethod}" is not allowed by CORS_METHODS`);
  }

  const disallowedHeaders = requestedHeaders.filter(
    (requestedHeader) =>
      !allowedHeaders.some(
        (allowedHeader) =>
          allowedHeader.toLowerCase() === requestedHeader.toLowerCase(),
      ),
  );

  if (disallowedHeaders.length > 0) {
    issues.push(
      `Headers not allowed by CORS_ALLOWED_HEADERS: ${disallowedHeaders.join(', ')}`,
    );
  }

  return issues;
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
