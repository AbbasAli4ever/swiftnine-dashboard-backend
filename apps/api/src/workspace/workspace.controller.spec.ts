import type { Response } from 'express';
import { WorkspaceController } from './workspace.controller';
import { WorkspaceService } from './workspace.service';

jest.mock('@app/database', () => ({
  PrismaService: class PrismaService {},
  DatabaseModule: class DatabaseModule {},
}));

describe('WorkspaceController', () => {
  let controller: WorkspaceController;
  let workspaceService: {
    claimInvite: jest.Mock;
  };

  beforeEach(() => {
    workspaceService = {
      claimInvite: jest.fn(),
    };

    controller = new WorkspaceController(workspaceService as unknown as WorkspaceService);
  });

  it('sets the refresh cookie and omits the refresh token from the claim invite response body', async () => {
    workspaceService.claimInvite.mockResolvedValue({
      user: {
        id: 'user-1',
        fullName: 'Jane Invitee',
        email: 'invitee@example.com',
        avatarUrl: null,
        avatarColor: '#6366f1',
      },
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
      workspaceId: 'workspace-1',
    });

    const response = {
      cookie: jest.fn(),
    } as unknown as Response;

    const result = await controller.claimInvite(
      {
        token: '2d739145-2b0c-420d-85fc-e27a5d7dfca6',
        fullName: 'Jane Invitee',
        password: 'Password123!',
      },
      response,
    );

    expect(workspaceService.claimInvite).toHaveBeenCalledWith({
      token: '2d739145-2b0c-420d-85fc-e27a5d7dfca6',
      fullName: 'Jane Invitee',
      password: 'Password123!',
    });
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
      success: true,
      data: {
        user: {
          id: 'user-1',
          fullName: 'Jane Invitee',
          email: 'invitee@example.com',
          avatarUrl: null,
          avatarColor: '#6366f1',
        },
        accessToken: 'access-token',
        workspaceId: 'workspace-1',
      },
      message: 'Invite claimed successfully',
    });
  });
});
