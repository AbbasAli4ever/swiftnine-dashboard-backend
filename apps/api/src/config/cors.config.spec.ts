import type { Request } from 'express';
import { buildCorsOptions, buildWebsocketCorsOptions } from './cors.config';

describe('buildCorsOptions', () => {
  it('builds a credentialed CORS config that allows any origin and method by default', () => {
    const options = buildCorsOptions({
      CORS_ALLOW_CREDENTIALS: 'true',
      CORS_METHODS: 'GET,POST',
      CORS_ALLOWED_HEADERS: 'Content-Type, Authorization',
    });

    const callback = jest.fn();
    options(
      {
        method: 'GET',
        url: '/api/v1/projects',
        headers: { origin: 'http://localhost:3000' },
      } as Request,
      callback,
    );

    expect(callback).toHaveBeenCalledWith(
      null,
      expect.objectContaining({
        credentials: true,
        methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'x-workspace-id'],
        origin: true,
      }),
    );
  });

  it('allows requests from any origin when no allowlist is configured', () => {
    const options = buildCorsOptions({
      CORS_ALLOW_CREDENTIALS: 'true',
    });

    const callback = jest.fn();
    options(
      {
        method: 'GET',
        url: '/health',
        headers: { origin: 'https://any-client.example' },
      } as Request,
      callback,
    );

    expect(callback).toHaveBeenCalledWith(
      null,
      expect.objectContaining({
        origin: true,
      }),
    );
  });

  it('reflects requested preflight headers so custom headers are allowed', () => {
    const options = buildCorsOptions({});

    const callback = jest.fn();
    options(
      {
        method: 'OPTIONS',
        url: '/api/v1/projects',
        originalUrl: '/api/v1/projects',
        headers: {
          origin: 'http://localhost:4000',
          'access-control-request-method': 'POST',
          'access-control-request-headers':
            'authorization,x-workspace-id,x-debug-header',
        },
      } as Request,
      callback,
    );

    expect(callback).toHaveBeenCalledWith(
      null,
      expect.objectContaining({
        origin: true,
        allowedHeaders: ['authorization', 'x-workspace-id', 'x-debug-header'],
      }),
    );
  });

  it('keeps all default methods open even when CORS_METHODS is configured', () => {
    const options = buildCorsOptions({ CORS_METHODS: 'GET' });

    const callback = jest.fn();
    options(
      {
        method: 'OPTIONS',
        url: '/api/v1/projects',
        originalUrl: '/api/v1/projects',
        headers: {
          origin: 'http://localhost:3000',
          'access-control-request-method': 'POST',
        },
      } as Request,
      callback,
    );

    expect(callback).toHaveBeenCalledWith(
      null,
      expect.objectContaining({
        methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
        origin: true,
      }),
    );
  });

  it('restricts HTTP origins when an allowlist is configured', () => {
    const options = buildCorsOptions({
      CORS_ALLOWED_ORIGINS: 'https://app.example.com,https://admin.example.com',
    });

    const allowedCallback = jest.fn();
    options(
      {
        method: 'GET',
        url: '/health',
        headers: { origin: 'https://app.example.com' },
      } as Request,
      allowedCallback,
    );

    expect(allowedCallback).toHaveBeenCalledWith(
      null,
      expect.objectContaining({
        origin: 'https://app.example.com',
      }),
    );

    const deniedCallback = jest.fn();
    options(
      {
        method: 'GET',
        url: '/health',
        headers: { origin: 'https://evil.example.com' },
      } as Request,
      deniedCallback,
    );

    expect(deniedCallback).toHaveBeenCalledWith(
      null,
      expect.objectContaining({
        origin: false,
      }),
    );
  });
});

describe('buildWebsocketCorsOptions', () => {
  it('allows listed origins and rejects others', () => {
    const cors = buildWebsocketCorsOptions({
      CORS_ALLOWED_ORIGINS: 'https://app.example.com',
    });

    const allowed = jest.fn();
    cors.origin('https://app.example.com', allowed);
    expect(allowed).toHaveBeenCalledWith(null, true);

    const denied = jest.fn();
    cors.origin('https://evil.example.com', denied);
    expect(denied).toHaveBeenCalledWith(expect.any(Error), false);
  });
});
