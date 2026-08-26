import { NotificationsService } from './notifications.service';

jest.mock('@app/database', () => ({
  PrismaService: class PrismaService {},
}));

describe('NotificationsService', () => {
  let service: NotificationsService;
  let projectSecurity: {
    activeUnlockedProjectIds: jest.Mock;
  };
  let prisma: {
    task: {
      findMany: jest.Mock;
    };
    comment: {
      findMany: jest.Mock;
    };
    channelMessage: {
      findMany: jest.Mock;
    };
    notification: {
      deleteMany: jest.Mock;
    };
  };

  beforeEach(() => {
    projectSecurity = {
      activeUnlockedProjectIds: jest.fn().mockResolvedValue(new Set()),
    };
    prisma = {
      task: {
        findMany: jest.fn().mockResolvedValue([]),
      },
      comment: {
        findMany: jest.fn().mockResolvedValue([]),
      },
      channelMessage: {
        findMany: jest.fn().mockResolvedValue([]),
      },
      notification: {
        deleteMany: jest.fn().mockResolvedValue({ count: 3 }),
      },
    };

    service = new NotificationsService(
      prisma as never,
      projectSecurity as never,
      {} as never,
    );
  });

  afterEach(() => {
    service.onModuleDestroy();
  });

  it('deletes notifications older than the retention window', async () => {
    const count = await service.deleteExpiredNotifications(
      new Date('2026-05-05T00:00:00.000Z'),
    );

    expect(prisma.notification.deleteMany).toHaveBeenCalledWith({
      where: {
        createdAt: {
          lt: new Date('2026-02-04T00:00:00.000Z'),
        },
      },
    });
    expect(count).toBe(3);
  });

  it('filters private-project task notifications the recipient has no access to', async () => {
    prisma.task.findMany.mockResolvedValue([
      { id: 'task-1', list: { projectId: 'project-private' } },
      { id: 'task-2', list: { projectId: 'project-open' } },
    ]);
    projectSecurity.activeUnlockedProjectIds.mockResolvedValue(
      new Set(['project-open']),
    );

    const visible = await service.filterVisibleNotificationsForUser('user-1', [
      { id: 'notif-1', referenceType: 'task', referenceId: 'task-1' },
      { id: 'notif-2', referenceType: 'task', referenceId: 'task-2' },
      { id: 'notif-3', referenceType: 'workspace', referenceId: 'workspace-1' },
    ]);

    expect(visible.map((notification) => notification.id)).toEqual([
      'notif-2',
      'notif-3',
    ]);
  });

  it('keeps private-project notifications visible for a member with access', async () => {
    prisma.comment.findMany.mockResolvedValue([
      {
        id: 'comment-1',
        task: { list: { projectId: 'project-private' } },
      },
    ]);
    projectSecurity.activeUnlockedProjectIds.mockResolvedValue(
      new Set(['project-private']),
    );

    const visible = await service.filterVisibleNotificationsForUser('user-1', [
      { id: 'notif-1', referenceType: 'comment', referenceId: 'comment-1' },
    ]);

    expect(visible.map((notification) => notification.id)).toEqual(['notif-1']);
  });

  it('keeps non-project chat message notifications visible', async () => {
    prisma.channelMessage.findMany.mockResolvedValue([
      { id: 'message-1', channel: { projectId: null } },
    ]);

    const visible = await service.filterVisibleNotificationsForUser('user-1', [
      {
        id: 'notif-1',
        referenceType: 'channel_message',
        referenceId: 'message-1',
      },
    ]);

    expect(visible.map((notification) => notification.id)).toEqual(['notif-1']);
  });
});
