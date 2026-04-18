import type { Response } from 'express';
import { WorkspaceController } from './workspace.controller';
import { WorkspaceService } from './workspace.service';
import type { WorkspaceRequest } from './workspace.types';

jest.mock('@app/database', () => ({
  PrismaService: class PrismaService {},
  DatabaseModule: class DatabaseModule {},
}));

describe('WorkspaceController', () => {
  let controller: WorkspaceController;
  let workspaceService: {
    claimInvite: jest.Mock;
    sendBatchInvites: jest.Mock;
  };

  beforeEach(() => {
    workspaceService = {
      claimInvite: jest.fn(),
      sendBatchInvites: jest.fn(),
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
        sameSite: 'lax',
        path: '/',
        maxAge: 7 * 24 * 60 * 60 * 1000,
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

  it('returns the batch invite result payload from the controller', async () => {
    workspaceService.sendBatchInvites.mockResolvedValue({
      results: [
        { email: 'a@example.com', status: 'invited', message: null },
        { email: 'b@example.com', status: 'already_member', message: null },
      ],
      summary: {
        total: 2,
        invited: 1,
        alreadyMember: 1,
        failed: 0,
      },
    });

    const request = {
      user: { id: 'user-1' },
      workspaceContext: {
        workspaceId: 'workspace-1',
        role: 'OWNER',
      },
    } as unknown as WorkspaceRequest;

    const result = await controller.sendBatchInvites(request, {
      emails: ['a@example.com', 'b@example.com'],
      role: 'MEMBER',
    });

    expect(workspaceService.sendBatchInvites).toHaveBeenCalledWith(
      'workspace-1',
      'user-1',
      'OWNER',
      {
        emails: ['a@example.com', 'b@example.com'],
        role: 'MEMBER',
      },
    );
    expect(result).toEqual({
      success: true,
      data: {
        results: [
          { email: 'a@example.com', status: 'invited', message: null },
          { email: 'b@example.com', status: 'already_member', message: null },
        ],
        summary: {
          total: 2,
          invited: 1,
          alreadyMember: 1,
          failed: 0,
        },
      },
      message: 'Batch invite processed',
    });
  });
});
