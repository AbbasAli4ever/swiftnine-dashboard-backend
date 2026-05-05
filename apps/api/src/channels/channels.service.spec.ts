import { ChannelsService } from './channels.service';

jest.mock('@app/database', () => ({
  PrismaService: class PrismaService {},
}));

describe('ChannelsService', () => {
  let service: ChannelsService;
  let prisma: {
    channel: {
      findMany: jest.Mock;
    };
  };

  beforeEach(() => {
    prisma = {
      channel: {
        findMany: jest.fn(),
      },
    };

    service = new ChannelsService(
      prisma as never,
      { createNotification: jest.fn() } as never,
      { emit: jest.fn() } as never,
    );
  });

  it('surfaces caller unread state on workspace channel listings', async () => {
    prisma.channel.findMany.mockResolvedValue([
      {
        id: 'channel-1',
        workspaceId: 'workspace-1',
        projectId: null,
        name: 'General',
        description: null,
        privacy: 'PUBLIC',
        createdBy: 'user-1',
        createdAt: new Date('2026-05-05T00:00:00.000Z'),
        updatedAt: new Date('2026-05-05T00:00:00.000Z'),
        project: null,
        members: [
          {
            id: 'member-1',
            channelId: 'channel-1',
            userId: 'user-1',
            role: 'MEMBER',
            isMuted: true,
            unreadCount: 7,
            lastReadMessageId: 'message-4',
            joinedAt: new Date('2026-05-05T00:00:00.000Z'),
            createdAt: new Date('2026-05-05T00:00:00.000Z'),
            user: { id: 'user-1', fullName: 'User One', avatarUrl: null },
          },
        ],
      },
    ]);

    const result = await service.listByWorkspace('workspace-1', 'user-1');

    expect(result[0]).toEqual(
      expect.objectContaining({
        isMember: true,
        isMuted: true,
        unreadCount: 7,
        lastReadMessageId: 'message-4',
        viewerMembership: expect.objectContaining({
          id: 'member-1',
          userId: 'user-1',
        }),
      }),
    );
  });
});
