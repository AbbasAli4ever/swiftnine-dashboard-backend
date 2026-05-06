import { PresenceService } from './presence.service';

jest.mock('@app/database', () => ({
  PrismaService: class PrismaService {},
}));

describe('PresenceService', () => {
  let service: PresenceService;
  let prisma: {
    user: {
      update: jest.Mock;
    };
    workspaceMember: {
      findMany: jest.Mock;
    };
  };
  let server: {
    to: jest.Mock;
  };
  let emit: jest.Mock;

  beforeEach(() => {
    emit = jest.fn();
    server = {
      to: jest.fn(() => ({ emit })),
    };
    prisma = {
      user: {
        update: jest.fn(),
      },
      workspaceMember: {
        findMany: jest.fn(),
      },
    };

    service = new PresenceService(prisma as never);
    service.bindServer(server as never);
  });

  it('marks a user online only on the first active socket', async () => {
    prisma.user.update.mockResolvedValue({
      id: 'user-1',
      lastSeenAt: new Date('2026-05-05T00:00:00.000Z'),
    });
    prisma.workspaceMember.findMany.mockResolvedValue([
      { workspaceId: 'workspace-1' },
      { workspaceId: 'workspace-2' },
    ]);

    await service.connect('socket-1', {
      id: 'user-1',
      fullName: 'User One',
      email: 'user@example.com',
      avatarUrl: null,
    });
    await service.connect('socket-2', {
      id: 'user-1',
      fullName: 'User One',
      email: 'user@example.com',
      avatarUrl: null,
    });

    expect(prisma.user.update).toHaveBeenCalledTimes(1);
    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { id: 'user-1' },
      data: { isOnline: true },
      select: { id: true, lastSeenAt: true },
    });
    expect(server.to).toHaveBeenCalledTimes(2);
    expect(server.to).toHaveBeenNthCalledWith(1, 'workspace:workspace-1');
    expect(server.to).toHaveBeenNthCalledWith(2, 'workspace:workspace-2');
    expect(emit).toHaveBeenCalledWith('presence:changed', {
      userId: 'user-1',
      isOnline: true,
      lastSeenAt: new Date('2026-05-05T00:00:00.000Z'),
    });
  });

  it('marks a user offline only after the last socket disconnects', async () => {
    prisma.user.update
      .mockResolvedValueOnce({
        id: 'user-1',
        lastSeenAt: null,
      })
      .mockResolvedValueOnce({
        id: 'user-1',
        lastSeenAt: new Date('2026-05-05T01:00:00.000Z'),
      });
    prisma.workspaceMember.findMany.mockResolvedValue([
      { workspaceId: 'workspace-1' },
    ]);

    await service.connect('socket-1', {
      id: 'user-1',
      fullName: 'User One',
      email: 'user@example.com',
      avatarUrl: null,
    });
    await service.connect('socket-2', {
      id: 'user-1',
      fullName: 'User One',
      email: 'user@example.com',
      avatarUrl: null,
    });
    await service.disconnect('socket-1');
    await service.disconnect('socket-2');

    expect(prisma.user.update).toHaveBeenNthCalledWith(2, {
      where: { id: 'user-1' },
      data: {
        isOnline: false,
        lastSeenAt: expect.any(Date),
      },
      select: { id: true, lastSeenAt: true },
    });
    expect(emit).toHaveBeenLastCalledWith('presence:changed', {
      userId: 'user-1',
      isOnline: false,
      lastSeenAt: new Date('2026-05-05T01:00:00.000Z'),
    });
  });
});
