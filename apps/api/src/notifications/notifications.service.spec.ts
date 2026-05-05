import { NotificationsService } from './notifications.service';

jest.mock('@app/database', () => ({
  PrismaService: class PrismaService {},
}));

describe('NotificationsService', () => {
  let service: NotificationsService;
  let prisma: {
    notification: {
      deleteMany: jest.Mock;
    };
  };

  beforeEach(() => {
    prisma = {
      notification: {
        deleteMany: jest.fn().mockResolvedValue({ count: 3 }),
      },
    };

    service = new NotificationsService(
      prisma as never,
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
});
