import type { Request } from 'express';
import { buildCorsOptions } from './cors.config';

describe('buildCorsOptions', () => {
  it('builds a credentialed CORS config that allows any origin and method', () => {
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

  it('allows requests from any origin', () => {
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
});
