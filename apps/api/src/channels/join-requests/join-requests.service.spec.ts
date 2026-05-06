import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { JoinRequestsService } from './join-requests.service';

jest.mock('@app/database', () => ({
  PrismaService: class PrismaService {},
}));

describe('JoinRequestsService', () => {
  let service: JoinRequestsService;
  let prisma: {
    channel: { findFirst: jest.Mock };
    channelMember: {
      findFirst: jest.Mock;
      create: jest.Mock;
    };
    channelJoinRequest: {
      findFirst: jest.Mock;
      findUnique: jest.Mock;
      create: jest.Mock;
      update: jest.Mock;
    };
    workspaceMember: { findFirst: jest.Mock };
    activityLog: { create: jest.Mock };
    user: { findUnique: jest.Mock };
    $transaction: jest.Mock;
  };
  let chatSystem: { emit: jest.Mock };
  let notifications: { createNotification: jest.Mock };

  beforeEach(() => {
    prisma = {
      channel: { findFirst: jest.fn() },
      channelMember: {
        findFirst: jest.fn(),
        create: jest.fn(),
      },
      channelJoinRequest: {
        findFirst: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      },
      workspaceMember: { findFirst: jest.fn() },
      activityLog: { create: jest.fn().mockResolvedValue(undefined) },
      user: { findUnique: jest.fn() },
      $transaction: jest.fn(),
    };
    prisma.$transaction.mockImplementation(
      async (callback: (tx: typeof prisma) => unknown) => callback(prisma),
    );

    chatSystem = { emit: jest.fn().mockResolvedValue(undefined) };
    notifications = {
      createNotification: jest.fn().mockResolvedValue(undefined),
    };

    service = new JoinRequestsService(
      prisma as never,
      chatSystem as never,
      notifications as never,
    );
  });

  it('creates a pending join request for a public channel', async () => {
    prisma.channel.findFirst.mockResolvedValue({
      id: 'channel-1',
      workspaceId: 'workspace-1',
      kind: 'CHANNEL',
      name: 'Announcements',
      privacy: 'PUBLIC',
    });
    prisma.channelMember.findFirst
      .mockResolvedValueOnce(null);
    prisma.channelJoinRequest.findFirst
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(null);
    prisma.channelJoinRequest.create.mockResolvedValue({
      id: 'request-1',
      channelId: 'channel-1',
      userId: 'user-2',
      status: 'PENDING',
    });

    const result = await service.createRequest(
      'workspace-1',
      'channel-1',
      'user-2',
    );

    expect(prisma.channelJoinRequest.create).toHaveBeenCalledWith({
      data: {
        channelId: 'channel-1',
        userId: 'user-2',
      },
      include: expect.any(Object),
    });
    expect(result.status).toBe('PENDING');
  });

  it('rejects join requests for private channels', async () => {
    prisma.channel.findFirst.mockResolvedValue({
      id: 'channel-1',
      workspaceId: 'workspace-1',
      kind: 'CHANNEL',
      name: 'Leadership',
      privacy: 'PRIVATE',
    });

    await expect(
      service.createRequest('workspace-1', 'channel-1', 'user-2'),
    ).rejects.toThrow(
      new ForbiddenException('Private channels are invite-only'),
    );
  });

  it('enforces a 24 hour cooldown after a rejected join request', async () => {
    prisma.channel.findFirst.mockResolvedValue({
      id: 'channel-1',
      workspaceId: 'workspace-1',
      kind: 'CHANNEL',
      name: 'Announcements',
      privacy: 'PUBLIC',
    });
    prisma.channelMember.findFirst.mockResolvedValue(null);
    prisma.channelJoinRequest.findFirst
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({
        decidedAt: new Date(Date.now() - 60 * 60 * 1000),
      });

    await expect(
      service.createRequest('workspace-1', 'channel-1', 'user-2'),
    ).rejects.toThrow(
      new BadRequestException(
        'You can request to join this channel again 24 hours after the last rejection',
      ),
    );
  });

  it('approves a pending join request, creates membership, emits a system message, and notifies the requester', async () => {
    prisma.channel.findFirst.mockResolvedValue({
      id: 'channel-1',
      workspaceId: 'workspace-1',
      kind: 'CHANNEL',
      name: 'Announcements',
      privacy: 'PUBLIC',
    });
    prisma.channelMember.findFirst
      .mockResolvedValueOnce({ role: 'ADMIN' })
      .mockResolvedValueOnce(null);
    prisma.channelJoinRequest.findUnique.mockResolvedValue({
      id: 'request-1',
      channelId: 'channel-1',
      userId: 'user-2',
      status: 'PENDING',
      user: { id: 'user-2', fullName: 'Requester', avatarUrl: null },
      decidedBy: null,
    });
    prisma.channelJoinRequest.update.mockResolvedValue({
      id: 'request-1',
      channelId: 'channel-1',
      userId: 'user-2',
      status: 'APPROVED',
      user: { id: 'user-2', fullName: 'Requester', avatarUrl: null },
      decidedBy: { id: 'admin-1', fullName: 'Admin', avatarUrl: null },
    });
    prisma.workspaceMember.findFirst.mockResolvedValue({
      id: 'workspace-member-1',
    });
    prisma.channelMember.create.mockResolvedValue({
      id: 'membership-1',
      channelId: 'channel-1',
      userId: 'user-2',
      role: 'MEMBER',
    });
    prisma.user.findUnique.mockResolvedValue({ fullName: 'Admin User' });

    const result = await service.decideRequest(
      'workspace-1',
      'channel-1',
      'request-1',
      'admin-1',
      'approve',
    );

    expect(prisma.channelMember.create).toHaveBeenCalledWith({
      data: {
        channelId: 'channel-1',
        userId: 'user-2',
        role: 'MEMBER',
      },
    });
    expect(chatSystem.emit).toHaveBeenCalledWith(
      'channel-1',
      expect.objectContaining({
        event: 'member_joined',
        userId: 'user-2',
        actorUserId: 'admin-1',
        source: 'join_request',
      }),
      prisma,
    );
    expect(notifications.createNotification).toHaveBeenCalledWith(
      'workspace-1',
      'user-2',
      'admin-1',
      'channel:member_added',
      'Added to channel Announcements',
      'Admin User approved your request to join Announcements as member',
      'channel',
      'channel-1',
      false,
    );
    expect(result.status).toBe('APPROVED');
  });

  it('rejects approval when the requester is no longer a workspace member', async () => {
    prisma.channel.findFirst.mockResolvedValue({
      id: 'channel-1',
      workspaceId: 'workspace-1',
      kind: 'CHANNEL',
      name: 'Announcements',
      privacy: 'PUBLIC',
    });
    prisma.channelMember.findFirst.mockResolvedValueOnce({ role: 'OWNER' });
    prisma.channelJoinRequest.findUnique.mockResolvedValue({
      id: 'request-1',
      channelId: 'channel-1',
      userId: 'user-2',
      status: 'PENDING',
      user: { id: 'user-2', fullName: 'Requester', avatarUrl: null },
      decidedBy: null,
    });
    prisma.channelJoinRequest.update.mockResolvedValue({
      id: 'request-1',
      channelId: 'channel-1',
      userId: 'user-2',
      status: 'APPROVED',
      user: { id: 'user-2', fullName: 'Requester', avatarUrl: null },
      decidedBy: { id: 'owner-1', fullName: 'Owner', avatarUrl: null },
    });
    prisma.workspaceMember.findFirst.mockResolvedValue(null);

    await expect(
      service.decideRequest(
        'workspace-1',
        'channel-1',
        'request-1',
        'owner-1',
        'approve',
      ),
    ).rejects.toThrow(
      new BadRequestException(
        'Requester is no longer a member of this workspace',
      ),
    );
  });
});
