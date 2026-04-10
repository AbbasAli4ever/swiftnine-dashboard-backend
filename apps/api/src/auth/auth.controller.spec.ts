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
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: '/api/v1/auth',
      },
    );
    expect(result).toEqual({
      user: authUser,
      accessToken: 'access-token',
    });
  });
});
