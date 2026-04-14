import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthService, type AuthUser } from './auth.service';

jest.mock('@app/database', () => ({
  PrismaService: class PrismaService {},
}));

describe('AuthService', () => {
  let service: AuthService;
  let prisma: {
    user: {
      create: jest.Mock;
      findFirst: jest.Mock;
      update: jest.Mock;
    };
    refreshToken: {
      create: jest.Mock;
    };
  };
  let jwt: { signAsync: jest.Mock };

  const authUser: AuthUser = {
    id: 'user-1',
    fullName: 'Jane Doe',
    email: 'jane@example.com',
    avatarUrl: null,
    avatarColor: '#6366f1',
  };

  beforeEach(() => {
    prisma = {
      user: {
        create: jest.fn(),
        findFirst: jest.fn(),
        update: jest.fn(),
      },
      refreshToken: {
        create: jest.fn().mockResolvedValue(undefined),
      },
    };
    jwt = {
      signAsync: jest.fn().mockResolvedValue('access-token'),
    };

    service = new AuthService(prisma as never, jwt as unknown as JwtService);
  });

  it('registers users with normalized auth fields', async () => {
    prisma.user.create.mockResolvedValue(authUser);

    const result = await service.register({
      fullName: '  Jane Doe  ',
      email: '  JANE@Example.com ',
      password: 'Password123!',
    });

    expect(prisma.user.create).toHaveBeenCalledWith({
      data: {
        fullName: 'Jane Doe',
        email: 'jane@example.com',
        passwordHash: expect.any(String),
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        avatarUrl: true,
        avatarColor: true,
      },
    });
    expect(result.user).toEqual(authUser);
    expect(result.accessToken).toBe('access-token');
    expect(result.refreshToken).toEqual(expect.any(String));
  });

  it('validates users with normalized email lookup', async () => {
    prisma.user.findFirst.mockResolvedValue({
      ...authUser,
      passwordHash: await bcrypt.hash('Password123!', 10),
    });

    const result = await service.validateUser(
      '  JANE@Example.com ',
      'Password123!',
    );

    expect(prisma.user.findFirst).toHaveBeenCalledWith({
      where: {
        email: 'jane@example.com',
        deletedAt: null,
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        avatarUrl: true,
        avatarColor: true,
        passwordHash: true,
      },
    });
    expect(result).toEqual(authUser);
  });

  it('rejects invalid credentials with a generic error', async () => {
    prisma.user.findFirst.mockResolvedValue(null);

    await expect(
      service.validateUser('missing@example.com', 'Password123!'),
    ).rejects.toThrow(new UnauthorizedException('Invalid email or password'));
  });

  it('finds active auth users by id and normalized email', async () => {
    prisma.user.findFirst.mockResolvedValue(authUser);

    const result = await service.findActiveAuthUser(
      'user-1',
      '  JANE@Example.com ',
    );

    expect(prisma.user.findFirst).toHaveBeenCalledWith({
      where: {
        id: 'user-1',
        email: 'jane@example.com',
        deletedAt: null,
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        avatarUrl: true,
        avatarColor: true,
      },
    });
    expect(result).toEqual(authUser);
  });

  it('issues access and refresh tokens on login', async () => {
    const result = await service.login(authUser);

    expect(jwt.signAsync).toHaveBeenCalledWith({
      sub: authUser.id,
      email: authUser.email,
    });
    expect(prisma.refreshToken.create).toHaveBeenCalledWith({
      data: {
        userId: authUser.id,
        tokenHash: expect.any(String),
        expiresAt: expect.any(Date),
      },
    });
    expect(result).toEqual({
      user: authUser,
      accessToken: 'access-token',
      refreshToken: expect.any(String),
    });
  });

  it('creates a new user for a first-time Google login', async () => {
    prisma.user.findFirst
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(null);
    prisma.user.create.mockResolvedValue(authUser);

    const result = await service.handleGoogleAuth({
      googleId: 'google-1',
      email: 'Jane@Example.com',
      fullName: 'Jane Doe',
      avatarUrl: 'https://example.com/avatar.png',
    });

    expect(prisma.user.create).toHaveBeenCalledWith({
      data: {
        googleId: 'google-1',
        email: 'jane@example.com',
        fullName: 'Jane Doe',
        avatarUrl: 'https://example.com/avatar.png',
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        avatarUrl: true,
        avatarColor: true,
      },
    });
    expect(result.user).toEqual(authUser);
  });

  it('links an existing email account to Google when not yet linked', async () => {
    prisma.user.findFirst
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({
        ...authUser,
        googleId: null,
      });
    prisma.user.update.mockResolvedValue(authUser);

    const result = await service.handleGoogleAuth({
      googleId: 'google-1',
      email: 'jane@example.com',
      fullName: 'Jane Doe',
      avatarUrl: null,
    });

    expect(prisma.user.update).toHaveBeenCalledWith({
      where: {
        id: authUser.id,
      },
      data: {
        googleId: 'google-1',
        avatarUrl: undefined,
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        avatarUrl: true,
        avatarColor: true,
      },
    });
    expect(result.user).toEqual(authUser);
  });

  it('preserves the existing profile name for linked Google accounts', async () => {
    prisma.user.findFirst
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({
        ...authUser,
        googleId: 'google-1',
      });

    const result = await service.handleGoogleAuth({
      googleId: 'google-1',
      email: 'jane@example.com',
      fullName: 'Google Display Name',
      avatarUrl: null,
    });

    expect(prisma.user.update).not.toHaveBeenCalled();
    expect(result.user).toEqual(authUser);
  });

  it('keeps existing profile fields when Google omits optional profile data', async () => {
    prisma.user.findFirst.mockResolvedValueOnce(null).mockResolvedValueOnce({
      ...authUser,
      googleId: 'google-1',
    });

    const result = await service.handleGoogleAuth({
      googleId: 'google-1',
      email: 'jane@example.com',
      fullName: null,
      avatarUrl: null,
    });

    expect(prisma.user.update).not.toHaveBeenCalled();
    expect(result.user).toEqual(authUser);
  });

  it('rejects Google auth for inactive accounts', async () => {
    prisma.user.findFirst.mockResolvedValueOnce({ id: 'deleted-user' });

    await expect(
      service.handleGoogleAuth({
        googleId: 'google-1',
        email: 'jane@example.com',
        fullName: 'Jane Doe',
        avatarUrl: null,
      }),
    ).rejects.toThrow(new ConflictException('Account is no longer active'));
  });

  it('rejects conflicting Google account links', async () => {
    prisma.user.findFirst
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({
        ...authUser,
        googleId: 'another-google-id',
      });

    await expect(
      service.handleGoogleAuth({
        googleId: 'google-1',
        email: 'jane@example.com',
        fullName: 'Jane Doe',
        avatarUrl: null,
      }),
    ).rejects.toThrow(
      new ConflictException(
        'This email is already linked to another Google account',
      ),
    );
  });
});
