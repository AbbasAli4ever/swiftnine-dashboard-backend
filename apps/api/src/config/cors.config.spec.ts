import { Logger } from '@nestjs/common';
import type { Request } from 'express';
import { buildCorsOptions } from './cors.config';

describe('buildCorsOptions', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('builds a credentialed CORS config from env values', () => {
    const options = buildCorsOptions({
      CORS_ORIGINS: 'http://localhost:3000, http://localhost:5173',
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
        methods: ['GET', 'POST'],
        allowedHeaders: ['Content-Type', 'Authorization', 'x-workspace-id'],
        origin: true,
      }),
    );
  });

  it('allows requests without an origin header', () => {
    const options = buildCorsOptions({
      CORS_ORIGINS: 'http://localhost:3000',
    });

    const callback = jest.fn();
    options(
      {
        method: 'GET',
        url: '/health',
        headers: {},
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

  it('rejects origins not present in the allow list and logs request details', () => {
    const warnSpy = jest
      .spyOn(Logger.prototype, 'warn')
      .mockImplementation(() => undefined);
    const options = buildCorsOptions({
      CORS_ORIGINS: 'http://localhost:3000',
    });

    const callback = jest.fn();
    options(
      {
        method: 'OPTIONS',
        url: '/api/v1/projects',
        originalUrl: '/api/v1/projects',
        headers: {
          origin: 'http://localhost:4000',
          'access-control-request-method': 'POST',
          'access-control-request-headers': 'authorization,x-workspace-id',
        },
      } as Request,
      callback,
    );

    expect(callback).toHaveBeenCalledWith(
      null,
      expect.objectContaining({
        origin: false,
      }),
    );
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('Rejected CORS request:'),
    );
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('http://localhost:4000'),
    );
  });

  it('rejects wildcard origins when credentials are enabled', () => {
    expect(() =>
      buildCorsOptions({
        CORS_ORIGINS: '*',
        CORS_ALLOW_CREDENTIALS: 'true',
      }),
    ).toThrow(
      'CORS_ORIGINS cannot be "*" when CORS_ALLOW_CREDENTIALS is enabled.',
    );
  });

  it('rejects invalid origin values that include a path', () => {
    expect(() =>
      buildCorsOptions({
        CORS_ORIGINS: 'http://localhost:3000/app',
      }),
    ).toThrow(
      'CORS origin "http://localhost:3000/app" must not include a path, query string, or trailing slash.',
    );
  });

  it('logs disallowed requested headers during preflight checks', () => {
    const warnSpy = jest
      .spyOn(Logger.prototype, 'warn')
      .mockImplementation(() => undefined);
    const options = buildCorsOptions({
      CORS_ORIGINS: 'http://localhost:3000',
    });

    const callback = jest.fn();
    options(
      {
        method: 'OPTIONS',
        url: '/api/v1/projects',
        originalUrl: '/api/v1/projects',
        headers: {
          origin: 'http://localhost:3000',
          'access-control-request-method': 'POST',
          'access-control-request-headers': 'x-debug-header',
        },
      } as Request,
      callback,
    );

    expect(callback).toHaveBeenCalledWith(
      null,
      expect.objectContaining({
        origin: true,
      }),
    );
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('x-debug-header'),
    );
  });
});
