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
    project: {
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
      project: {
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

  it('filters locked project task notifications until the recipient unlocks the project', async () => {
    prisma.task.findMany.mockResolvedValue([
      { id: 'task-1', list: { projectId: 'project-locked' } },
      { id: 'task-2', list: { projectId: 'project-open' } },
    ]);
    prisma.project.findMany.mockResolvedValue([
      { id: 'project-locked', passwordHash: 'hash' },
      { id: 'project-open', passwordHash: null },
    ]);

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

  it('keeps locked project notifications visible after the recipient unlocks the project', async () => {
    prisma.comment.findMany.mockResolvedValue([
      {
        id: 'comment-1',
        task: { list: { projectId: 'project-locked' } },
      },
    ]);
    prisma.project.findMany.mockResolvedValue([
      { id: 'project-locked', passwordHash: 'hash' },
    ]);
    projectSecurity.activeUnlockedProjectIds.mockResolvedValue(
      new Set(['project-locked']),
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
