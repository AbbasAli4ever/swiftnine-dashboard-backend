import { ConflictException, NotFoundException } from '@nestjs/common';
import { WorkspaceService } from './workspace.service';

jest.mock('@app/database', () => ({
  PrismaService: class PrismaService {},
}));

describe('WorkspaceService', () => {
  let service: WorkspaceService;
  let prisma: {
    workspace: {
      create: jest.Mock;
      findFirst: jest.Mock;
      update: jest.Mock;
    };
    workspaceInvite: {
      create: jest.Mock;
      findFirst: jest.Mock;
      findMany: jest.Mock;
      update: jest.Mock;
      updateMany: jest.Mock;
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
    activityLog: {
      create: jest.Mock;
      createMany: jest.Mock;
    };
    $transaction: jest.Mock;
  };
  let emailService: {
    sendWorkspaceInviteEmail: jest.Mock;
  };
  let authService: {
    issueTokens: jest.Mock;
  };

  beforeEach(() => {
    prisma = {
      workspace: {
        create: jest.fn(),
        findFirst: jest.fn(),
        update: jest.fn(),
      },
      workspaceInvite: {
        create: jest.fn(),
        findFirst: jest.fn(),
        findMany: jest.fn().mockResolvedValue([]),
        update: jest.fn().mockResolvedValue(undefined),
        updateMany: jest.fn().mockResolvedValue({ count: 0 }),
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
      activityLog: {
        create: jest.fn().mockResolvedValue(undefined),
        createMany: jest.fn().mockResolvedValue({ count: 0 }),
      },
      $transaction: jest.fn(),
    };
    emailService = {
      sendWorkspaceInviteEmail: jest.fn().mockResolvedValue(undefined),
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
      emailService as never,
      authService as never,
    );
  });

  it('creates a workspace with required metadata fields', async () => {
    prisma.workspace.create.mockResolvedValue({
      id: 'workspace-1',
      name: 'Acme Corp',
      logoUrl: 'https://cdn.example.com/logo.png',
      workspaceUse: 'WORK',
      managementType: 'SOFTWARE_DEVELOPMENT',
      createdBy: 'user-1',
      createdAt: new Date('2026-04-16T09:00:00.000Z'),
      updatedAt: new Date('2026-04-16T09:00:00.000Z'),
    });

    const result = await service.create('user-1', {
      name: '  Acme Corp  ',
      logoUrl: 'https://cdn.example.com/logo.png',
      workspaceUse: 'WORK',
      managementType: 'SOFTWARE_DEVELOPMENT',
    });

    expect(prisma.workspace.create).toHaveBeenCalledWith({
      data: {
        name: 'Acme Corp',
        logoUrl: 'https://cdn.example.com/logo.png',
        workspaceUse: 'WORK',
        managementType: 'SOFTWARE_DEVELOPMENT',
        createdBy: 'user-1',
      },
      select: {
        id: true,
        name: true,
        logoUrl: true,
        workspaceUse: true,
        managementType: true,
        createdBy: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    expect(prisma.workspaceMember.create).toHaveBeenCalledWith({
      data: {
        workspaceId: 'workspace-1',
        userId: 'user-1',
        role: 'OWNER',
      },
    });
    expect(prisma.activityLog.create).toHaveBeenCalledWith({
      data: {
        workspaceId: 'workspace-1',
        entityType: 'workspace',
        entityId: 'workspace-1',
        action: 'created',
        metadata: {
          workspaceName: 'Acme Corp',
          workspaceUse: 'WORK',
          managementType: 'SOFTWARE_DEVELOPMENT',
        },
        performedBy: 'user-1',
      },
    });
    expect(result).toEqual({
      id: 'workspace-1',
      name: 'Acme Corp',
      logoUrl: 'https://cdn.example.com/logo.png',
      workspaceUse: 'WORK',
      managementType: 'SOFTWARE_DEVELOPMENT',
      createdBy: 'user-1',
      createdAt: new Date('2026-04-16T09:00:00.000Z'),
      updatedAt: new Date('2026-04-16T09:00:00.000Z'),
    });
  });

  it('lists pending invite-only users alongside current members', async () => {
    prisma.workspaceMember.findMany = jest.fn().mockResolvedValue([
      {
        role: 'OWNER',
        createdAt: new Date('2026-04-16T09:00:00.000Z'),
        user: {
          id: 'user-1',
          fullName: 'Jane Owner',
          email: 'owner@example.com',
          lastSeenAt: new Date('2026-04-16T10:00:00.000Z'),
        },
      },
    ]);
    prisma.workspaceInvite.findMany = jest.fn().mockResolvedValue([
      {
        id: 'invite-1',
        email: 'pending@example.com',
        role: 'MEMBER',
        createdAt: new Date('2026-04-16T11:00:00.000Z'),
        status: 'PENDING',
        sender: { fullName: 'Jane Owner' },
      },
    ]);

    const result = await service.listMembers('workspace-1');

    expect(result).toEqual([
      {
        id: 'user-1',
        fullName: 'Jane Owner',
        email: 'owner@example.com',
        role: 'OWNER',
        lastActive: new Date('2026-04-16T10:00:00.000Z'),
        invitedBy: null,
        invitedOn: null,
        inviteStatus: null,
      },
      {
        id: 'invite-1',
        fullName: 'pending@example.com',
        email: 'pending@example.com',
        role: 'MEMBER',
        lastActive: null,
        invitedBy: 'Jane Owner',
        invitedOn: new Date('2026-04-16T11:00:00.000Z'),
        inviteStatus: 'PENDING',
      },
    ]);
  });

  it('updates workspace metadata fields when provided', async () => {
    prisma.workspace.findFirst.mockResolvedValue({
      id: 'workspace-1',
      name: 'Acme Corp',
      logoUrl: null,
      workspaceUse: 'WORK',
      managementType: 'SOFTWARE_DEVELOPMENT',
      createdBy: 'user-1',
      createdAt: new Date('2026-04-16T09:00:00.000Z'),
      updatedAt: new Date('2026-04-16T09:00:00.000Z'),
    });
    prisma.workspace.update.mockResolvedValue({
      id: 'workspace-1',
      name: 'Acme Corp',
      logoUrl: null,
      workspaceUse: 'PERSONAL',
      managementType: 'OTHER',
      createdBy: 'user-1',
      createdAt: new Date('2026-04-16T09:00:00.000Z'),
      updatedAt: new Date('2026-04-16T10:00:00.000Z'),
    });

    const result = await service.update('workspace-1', 'user-1', 'OWNER', {
      workspaceUse: 'PERSONAL',
      managementType: 'OTHER',
    });

    expect(prisma.workspace.update).toHaveBeenCalledWith({
      where: { id: 'workspace-1' },
      data: {
        workspaceUse: 'PERSONAL',
        managementType: 'OTHER',
      },
      select: {
        id: true,
        name: true,
        logoUrl: true,
        workspaceUse: true,
        managementType: true,
        createdBy: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    expect(prisma.activityLog.createMany).toHaveBeenCalledWith({
      data: [
        {
          workspaceId: 'workspace-1',
          entityType: 'workspace',
          entityId: 'workspace-1',
          action: 'updated',
          fieldName: 'workspaceUse',
          oldValue: 'WORK',
          newValue: 'PERSONAL',
          metadata: { workspaceName: 'Acme Corp' },
          performedBy: 'user-1',
        },
        {
          workspaceId: 'workspace-1',
          entityType: 'workspace',
          entityId: 'workspace-1',
          action: 'updated',
          fieldName: 'managementType',
          oldValue: 'SOFTWARE_DEVELOPMENT',
          newValue: 'OTHER',
          metadata: { workspaceName: 'Acme Corp' },
          performedBy: 'user-1',
        },
      ],
    });
    expect(result.workspaceUse).toBe('PERSONAL');
    expect(result.managementType).toBe('OTHER');
  });

  it('processes batch invites with deduping, mixed statuses, and summary counts', async () => {
    prisma.workspace.findFirst.mockResolvedValue({
      id: 'workspace-1',
      name: 'Acme Corp',
    });
    prisma.user.findFirst.mockResolvedValueOnce({ fullName: 'Zaeem Hassan' });
    prisma.workspaceMember.findFirst
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({ id: 'member-1' })
      .mockResolvedValueOnce(null);
    prisma.workspaceInvite.create
      .mockResolvedValueOnce({ id: 'invite-1' })
      .mockResolvedValueOnce({ id: 'invite-2' });
    emailService.sendWorkspaceInviteEmail
      .mockResolvedValueOnce(undefined)
      .mockRejectedValueOnce(new Error('mailer down'));

    const result = await service.sendBatchInvites(
      'workspace-1',
      'user-1',
      'OWNER',
      {
        emails: [
          '  first@example.com ',
          'member@example.com',
          'FIRST@example.com',
          'fail@example.com',
        ],
        role: 'MEMBER',
      },
    );

    expect(result).toEqual({
      results: [
        { email: 'first@example.com', status: 'invited', message: null },
        { email: 'member@example.com', status: 'already_member', message: null },
        {
          email: 'fail@example.com',
          status: 'failed',
          message: 'Failed to send invite email',
        },
      ],
      summary: {
        total: 3,
        invited: 1,
        alreadyMember: 1,
        failed: 1,
      },
    });
    expect(prisma.workspaceInvite.updateMany).toHaveBeenCalledTimes(2);
    expect(prisma.workspaceInvite.create).toHaveBeenCalledTimes(2);
    expect(emailService.sendWorkspaceInviteEmail).toHaveBeenCalledTimes(2);
    expect(prisma.workspaceInvite.update).toHaveBeenCalledWith({
      where: { id: 'invite-2' },
      data: { status: 'REVOKED' },
    });
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
