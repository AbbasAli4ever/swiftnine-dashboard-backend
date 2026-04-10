import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';
import { AuthService, type AuthUser } from '../auth.service';

jest.mock('@app/database', () => ({
  PrismaService: class PrismaService {},
}));

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;
  let authService: {
    findActiveAuthUser: jest.Mock;
  };

  const authUser: AuthUser = {
    id: 'user-1',
    fullName: 'Jane Doe',
    email: 'jane@example.com',
    avatarUrl: null,
    avatarColor: '#6366f1',
  };

  beforeEach(() => {
    authService = {
      findActiveAuthUser: jest.fn(),
    };

    strategy = new JwtStrategy(
      {
        getOrThrow: jest.fn().mockReturnValue('access-secret'),
      } as unknown as ConfigService,
      authService as unknown as AuthService,
    );
  });

  it('returns the active auth user for a valid access token payload', async () => {
    authService.findActiveAuthUser.mockResolvedValue(authUser);

    const result = await strategy.validate({
      sub: 'user-1',
      email: 'JANE@example.com',
    });

    expect(authService.findActiveAuthUser).toHaveBeenCalledWith(
      'user-1',
      'jane@example.com',
    );
    expect(result).toEqual(authUser);
  });

  it('rejects malformed access token payloads', async () => {
    await expect(
      strategy.validate({
        sub: '',
        email: 'not-an-email',
      }),
    ).rejects.toThrow(
      new UnauthorizedException('Invalid or expired access token'),
    );
  });

  it('rejects tokens for users that no longer resolve to an active account', async () => {
    authService.findActiveAuthUser.mockResolvedValue(null);

    await expect(
      strategy.validate({
        sub: 'user-1',
        email: 'jane@example.com',
      }),
    ).rejects.toThrow(
      new UnauthorizedException('Invalid or expired access token'),
    );
  });
});
