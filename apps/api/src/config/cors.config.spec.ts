import { buildCorsOptions } from './cors.config';

describe('buildCorsOptions', () => {
  it('builds a credentialed CORS config from env values', () => {
    const options = buildCorsOptions({
      CORS_ORIGINS: 'http://localhost:3000, http://localhost:5173',
      CORS_ALLOW_CREDENTIALS: 'true',
      CORS_METHODS: 'GET,POST',
      CORS_ALLOWED_HEADERS: 'Content-Type, Authorization',
    });

    expect(options.credentials).toBe(true);
    expect(options.methods).toEqual(['GET', 'POST']);
    expect(options.allowedHeaders).toEqual(['Content-Type', 'Authorization']);

    const origin = options.origin as (
      requestOrigin: string | undefined,
      callback: (err: Error | null, allow?: boolean) => void,
    ) => void;

    const callback = jest.fn();
    origin('http://localhost:3000', callback);

    expect(callback).toHaveBeenCalledWith(null, true);
  });

  it('allows requests without an origin header', () => {
    const options = buildCorsOptions({
      CORS_ORIGINS: 'http://localhost:3000',
    });

    const origin = options.origin as (
      requestOrigin: string | undefined,
      callback: (err: Error | null, allow?: boolean) => void,
    ) => void;

    const callback = jest.fn();
    origin(undefined, callback);

    expect(callback).toHaveBeenCalledWith(null, true);
  });

  it('rejects origins not present in the allow list', () => {
    const options = buildCorsOptions({
      CORS_ORIGINS: 'http://localhost:3000',
    });

    const origin = options.origin as (
      requestOrigin: string | undefined,
      callback: (err: Error | null, allow?: boolean) => void,
    ) => void;

    const callback = jest.fn();
    origin('http://localhost:4000', callback);

    expect(callback).toHaveBeenCalledWith(null, false);
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
});
