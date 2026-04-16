import { ConflictException, NotFoundException } from '@nestjs/common';
import { WorkspaceService } from './workspace.service';

jest.mock('@app/database', () => ({
  PrismaService: class PrismaService {},
}));

describe('WorkspaceService', () => {
  let service: WorkspaceService;
  let prisma: {
    workspaceInvite: {
      findFirst: jest.Mock;
      update: jest.Mock;
    };
    user: {
      findFirst: jest.Mock;
      create: jest.Mock;
      update: jest.Mock;
    };
    workspaceMember: {
      findFirst: jest.Mock;
      create: jest.Mock;
    };
    emailVerificationToken: {
      deleteMany: jest.Mock;
    };
    $transaction: jest.Mock;
  };
  let authService: {
    issueTokens: jest.Mock;
  };

  beforeEach(() => {
    prisma = {
      workspaceInvite: {
        findFirst: jest.fn(),
        update: jest.fn().mockResolvedValue(undefined),
      },
      user: {
        findFirst: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      },
      workspaceMember: {
        findFirst: jest.fn(),
        create: jest.fn().mockResolvedValue(undefined),
      },
      emailVerificationToken: {
        deleteMany: jest.fn().mockResolvedValue({ count: 0 }),
      },
      $transaction: jest.fn(),
    };
    authService = {
      issueTokens: jest.fn().mockResolvedValue({
        user: {
          id: 'user-1',
          fullName: 'Jane Invitee',
          email: 'invitee@example.com',
          avatarUrl: null,
          avatarColor: '#6366f1',
        },
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      }),
    };

    prisma.$transaction.mockImplementation(async (callback: (tx: typeof prisma) => unknown) =>
      callback(prisma),
    );

    service = new WorkspaceService(
      prisma as never,
      {} as never,
      authService as never,
    );
  });

  it('claims a valid invite by creating a verified user, joining the workspace, and issuing tokens', async () => {
    prisma.workspaceInvite.findFirst.mockResolvedValue({
      id: 'invite-1',
      workspaceId: 'workspace-1',
      email: 'invitee@example.com',
      role: 'MEMBER',
    });
    prisma.user.findFirst.mockResolvedValue(null);
    prisma.user.create.mockResolvedValue({
      id: 'user-1',
      fullName: 'Jane Invitee',
      email: 'invitee@example.com',
      avatarUrl: null,
      avatarColor: '#6366f1',
    });
    prisma.workspaceMember.findFirst.mockResolvedValue(null);

    const result = await service.claimInvite({
      token: '2d739145-2b0c-420d-85fc-e27a5d7dfca6',
      fullName: '  Jane Invitee  ',
      password: 'Password123!',
    });

    expect(prisma.user.create).toHaveBeenCalledWith({
      data: {
        fullName: 'Jane Invitee',
        email: 'invitee@example.com',
        passwordHash: expect.any(String),
        isEmailVerified: true,
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        avatarUrl: true,
        avatarColor: true,
      },
    });
    expect(prisma.workspaceInvite.update).toHaveBeenCalledWith({
      where: { id: 'invite-1' },
      data: { status: 'ACCEPTED', acceptedAt: expect.any(Date) },
    });
    expect(prisma.workspaceMember.create).toHaveBeenCalledWith({
      data: {
        workspaceId: 'workspace-1',
        userId: 'user-1',
        role: 'MEMBER',
      },
    });
    expect(authService.issueTokens).toHaveBeenCalledWith({
      id: 'user-1',
      fullName: 'Jane Invitee',
      email: 'invitee@example.com',
      avatarUrl: null,
      avatarColor: '#6366f1',
    });
    expect(result).toEqual({
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
  });

  it('returns claim_account as the next step when the invited email has no verified account yet', async () => {
    prisma.workspaceInvite.findFirst.mockResolvedValue({
      email: 'invitee@example.com',
      role: 'MEMBER',
      workspace: { id: 'workspace-1', name: 'Acme Corp' },
      sender: { fullName: 'Zaeem Hassan' },
    });
    prisma.user.findFirst.mockResolvedValue(null);

    const result = await service.getInviteDetails(
      '2d739145-2b0c-420d-85fc-e27a5d7dfca6',
    );

    expect(prisma.user.findFirst).toHaveBeenCalledWith({
      where: {
        email: 'invitee@example.com',
        deletedAt: null,
      },
      select: { id: true, isEmailVerified: true },
    });
    expect(result).toEqual({
      workspaceId: 'workspace-1',
      workspaceName: 'Acme Corp',
      invitedEmail: 'invitee@example.com',
      role: 'MEMBER',
      inviterName: 'Zaeem Hassan',
      nextStep: 'claim_account',
    });
  });

  it('returns login as the next step when the invited email already has a verified account', async () => {
    prisma.workspaceInvite.findFirst.mockResolvedValue({
      email: 'invitee@example.com',
      role: 'MEMBER',
      workspace: { id: 'workspace-1', name: 'Acme Corp' },
      sender: { fullName: 'Zaeem Hassan' },
    });
    prisma.user.findFirst.mockResolvedValue({
      id: 'user-1',
      isEmailVerified: true,
    });

    const result = await service.getInviteDetails(
      '2d739145-2b0c-420d-85fc-e27a5d7dfca6',
    );

    expect(result).toEqual({
      workspaceId: 'workspace-1',
      workspaceName: 'Acme Corp',
      invitedEmail: 'invitee@example.com',
      role: 'MEMBER',
      inviterName: 'Zaeem Hassan',
      nextStep: 'login',
    });
  });

  it('upgrades an existing unverified user instead of creating a duplicate account', async () => {
    prisma.workspaceInvite.findFirst.mockResolvedValue({
      id: 'invite-1',
      workspaceId: 'workspace-1',
      email: 'invitee@example.com',
      role: 'OWNER',
    });
    prisma.user.findFirst.mockResolvedValue({
      id: 'user-1',
      fullName: 'Old Name',
      email: 'invitee@example.com',
      avatarUrl: null,
      avatarColor: '#6366f1',
      isEmailVerified: false,
    });
    prisma.user.update.mockResolvedValue({
      id: 'user-1',
      fullName: 'Jane Invitee',
      email: 'invitee@example.com',
      avatarUrl: null,
      avatarColor: '#6366f1',
    });
    prisma.workspaceMember.findFirst.mockResolvedValue(null);

    await service.claimInvite({
      token: '2d739145-2b0c-420d-85fc-e27a5d7dfca6',
      fullName: 'Jane Invitee',
      password: 'Password123!',
    });

    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { id: 'user-1' },
      data: {
        fullName: 'Jane Invitee',
        passwordHash: expect.any(String),
        isEmailVerified: true,
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        avatarUrl: true,
        avatarColor: true,
      },
    });
    expect(prisma.emailVerificationToken.deleteMany).toHaveBeenCalledWith({
      where: { userId: 'user-1' },
    });
    expect(prisma.workspaceMember.create).toHaveBeenCalledWith({
      data: {
        workspaceId: 'workspace-1',
        userId: 'user-1',
        role: 'OWNER',
      },
    });
  });

  it('rejects invite claims when a verified account already exists for the invite email', async () => {
    prisma.workspaceInvite.findFirst.mockResolvedValue({
      id: 'invite-1',
      workspaceId: 'workspace-1',
      email: 'invitee@example.com',
      role: 'MEMBER',
    });
    prisma.user.findFirst.mockResolvedValue({
      id: 'user-1',
      fullName: 'Jane Invitee',
      email: 'invitee@example.com',
      avatarUrl: null,
      avatarColor: '#6366f1',
      isEmailVerified: true,
    });

    await expect(
      service.claimInvite({
        token: '2d739145-2b0c-420d-85fc-e27a5d7dfca6',
        fullName: 'Jane Invitee',
        password: 'Password123!',
      }),
    ).rejects.toThrow(
      new ConflictException(
        'An account already exists for this email. Please log in to accept the invite.',
      ),
    );

    expect(authService.issueTokens).not.toHaveBeenCalled();
  });

  it('rejects invalid or expired invite tokens during claim', async () => {
    prisma.workspaceInvite.findFirst.mockResolvedValue(null);

    await expect(
      service.claimInvite({
        token: '2d739145-2b0c-420d-85fc-e27a5d7dfca6',
        fullName: 'Jane Invitee',
        password: 'Password123!',
      }),
    ).rejects.toThrow(
      new NotFoundException('Invite not found, already used, or expired'),
    );
  });
});
