import type { Request, Response } from 'express';
import { AuthController } from './auth.controller';
import { AuthService, type AuthUser } from './auth.service';

jest.mock('@app/database', () => ({
  PrismaService: class PrismaService {},
}));

describe('AuthController', () => {
  let controller: AuthController;
  let authService: {
    register: jest.Mock;
    login: jest.Mock;
    handleGoogleAuth: jest.Mock;
    logout: jest.Mock;
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
      register: jest.fn(),
      login: jest.fn(),
      handleGoogleAuth: jest.fn(),
      logout: jest.fn(),
    };

    controller = new AuthController(authService as unknown as AuthService);
  });

  it('sets the refresh cookie and returns the auth response on login', async () => {
    authService.login.mockResolvedValue({
      user: authUser,
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
    });
    const response = {
      cookie: jest.fn(),
    } as unknown as Response;
    const request = {
      user: authUser,
    } as Request & { user: AuthUser };

    const result = await controller.login(request, response);

    expect(authService.login).toHaveBeenCalledWith(authUser);
    expect(response.cookie).toHaveBeenCalledWith(
      'refresh_token',
      'refresh-token',
      {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        path: '/',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      },
    );
    expect(result).toEqual({
      user: authUser,
      accessToken: 'access-token',
    });
  });

  it('sets the refresh cookie and returns the auth response on google callback', async () => {
    authService.handleGoogleAuth.mockResolvedValue({
      user: authUser,
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
    });
    const response = {
      cookie: jest.fn(),
      redirect: jest.fn(),
    } as unknown as Response;
    const request = {
      user: {
        googleId: 'google-1',
        email: 'jane@example.com',
        fullName: 'Jane Doe',
        avatarUrl: 'https://example.com/avatar.png',
      },
    } as Request & {
      user: {
        googleId: string;
        email: string;
        fullName: string;
        avatarUrl: string | null;
      };
    };

    const result = await controller.googleCallback(request, response);

    expect(authService.handleGoogleAuth).toHaveBeenCalledWith(request.user);
    expect(response.cookie).toHaveBeenCalledWith(
      'refresh_token',
      'refresh-token',
      {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        path: '/',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      },
    );
    expect(response.redirect).toHaveBeenCalledWith(
      'http://localhost:3000/auth/callback?token=access-token',
    );
    expect(result).toBeUndefined();
  });

  it('revokes the current refresh token and clears the cookie on logout', async () => {
    const response = {
      clearCookie: jest.fn(),
    } as unknown as Response;
    const request = {
      cookies: {
        refresh_token: 'refresh-token',
      },
    } as Request;

    await controller.logout(request, response);

    expect(authService.logout).toHaveBeenCalledWith('refresh-token');
    expect(response.clearCookie).toHaveBeenCalledWith('refresh_token', {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      path: '/',
    });
  });

  it('still clears the cookie when logout is called without a refresh token', async () => {
    const response = {
      clearCookie: jest.fn(),
    } as unknown as Response;
    const request = {
      cookies: {},
    } as Request;

    await controller.logout(request, response);

    expect(authService.logout).not.toHaveBeenCalled();
    expect(response.clearCookie).toHaveBeenCalledWith('refresh_token', {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      path: '/',
    });
  });
});
