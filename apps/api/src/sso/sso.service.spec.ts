import { Test } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { sign } from 'jsonwebtoken';
import { SsoService } from './sso.service';
import type { AuthUser } from '../auth/auth.service';

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(() => 'signed-token'),
}));

describe('SsoService', () => {
  const authUser: AuthUser = {
    id: 'user-1',
    fullName: 'Jane Doe',
    email: 'jane@example.com',
    avatarUrl: null,
    avatarColor: '#6366f1',
  };

  const config: Record<string, string> = {
    SSO_ODOO_JWT_SECRET: 'test-secret',
    SSO_ODOO_JWT_ISSUER: 'dashboard',
    SSO_ODOO_JWT_AUDIENCE: 'odoo',
    SSO_ODOO_REDIRECT_BASE_URL: 'https://sales.swiftnine.com/auth/sso',
  };

  async function buildService(overrides: Record<string, string> = {}) {
    const values = { ...config, ...overrides };
    const module = await Test.createTestingModule({
      providers: [
        SsoService,
        {
          provide: ConfigService,
          useValue: {
            getOrThrow: (key: string) => {
              const value = values[key];
              if (value === undefined) {
                throw new Error(`Config key "${key}" does not exist`);
              }
              return value;
            },
          },
        },
      ],
    }).compile();

    return module.get(SsoService);
  }

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('signs an HS256 JWT via sign options (not duplicated payload claims) and returns the redirect URL', async () => {
    const service = await buildService();

    const result = service.mintOdooLoginToken(authUser);

    expect(sign).toHaveBeenCalledWith(
      {
        sub: authUser.id,
        email: authUser.email,
        name: authUser.fullName,
      },
      'test-secret',
      expect.objectContaining({
        algorithm: 'HS256',
        expiresIn: '60s',
        issuer: 'dashboard',
        audience: 'odoo',
        jwtid: expect.any(String),
      }),
    );
    expect(result).toEqual({
      token: 'signed-token',
      redirectUrl: 'https://sales.swiftnine.com/auth/sso?token=signed-token',
    });
  });

  it('mints a different jti on every call', async () => {
    const service = await buildService();

    service.mintOdooLoginToken(authUser);
    service.mintOdooLoginToken(authUser);

    const signMock = sign as jest.Mock;
    const firstJti = signMock.mock.calls[0][2].jwtid;
    const secondJti = signMock.mock.calls[1][2].jwtid;
    expect(firstJti).not.toEqual(secondJti);
  });

  it('throws instead of falling back when SSO_ODOO_JWT_SECRET is not configured', async () => {
    const service = await buildService({ SSO_ODOO_JWT_SECRET: undefined as unknown as string });

    expect(() => service.mintOdooLoginToken(authUser)).toThrow();
    expect(sign).not.toHaveBeenCalled();
  });
});
