import { ForbiddenException } from '@nestjs/common';
import { ProjectUnlockService } from './project-unlock.service';

jest.mock('@app/database', () => ({
  PrismaService: class PrismaService {},
}));

describe('ProjectUnlockService', () => {
  let prisma: {
    projectUnlockAttempt: {
      findUnique: jest.Mock;
      upsert: jest.Mock;
      deleteMany: jest.Mock;
    };
    projectUnlockSession: {
      findFirst: jest.Mock;
      findMany: jest.Mock;
      deleteMany: jest.Mock;
    };
    $transaction: jest.Mock;
  };
  let service: ProjectUnlockService;

  beforeEach(() => {
    prisma = {
      projectUnlockAttempt: {
        findUnique: jest.fn(),
        upsert: jest.fn(),
        deleteMany: jest.fn().mockResolvedValue({ count: 2 }),
      },
      projectUnlockSession: {
        findFirst: jest.fn(),
        findMany: jest.fn(),
        deleteMany: jest.fn().mockResolvedValue({ count: 1 }),
      },
      $transaction: jest.fn(),
    };
    service = new ProjectUnlockService(prisma as never);
  });

  it('resets failed attempt count after the failed-attempt window expires', async () => {
    const now = new Date('2026-05-13T10:00:00.000Z');
    prisma.projectUnlockAttempt.findUnique.mockResolvedValue({
      failedCount: 4,
      lockedUntil: null,
      lastFailAt: new Date('2026-05-13T09:40:00.000Z'),
    });
    prisma.projectUnlockAttempt.upsert.mockResolvedValue({
      failedCount: 1,
      lockedUntil: null,
    });

    await service.recordFailedAttempt('project-1', 'user-1', now);

    expect(prisma.projectUnlockAttempt.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        create: expect.objectContaining({ failedCount: 1 }),
        update: expect.objectContaining({ failedCount: 1 }),
      }),
    );
  });

  it('throws while an unlock lockout is still active', async () => {
    prisma.projectUnlockAttempt.findUnique.mockResolvedValue({
      lockedUntil: new Date('2026-05-13T10:05:00.000Z'),
    });

    await expect(
      service.assertNotLockedOut(
        'project-1',
        'user-1',
        new Date('2026-05-13T10:00:00.000Z'),
      ),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('prunes expired sessions and stale failed attempts', async () => {
    const now = new Date('2026-05-13T10:00:00.000Z');

    await expect(service.pruneExpiredUnlockSessions(now)).resolves.toBe(1);
    await expect(service.pruneExpiredFailedAttempts(now)).resolves.toBe(2);

    expect(prisma.projectUnlockSession.deleteMany).toHaveBeenCalledWith({
      where: { expiresAt: { lte: now } },
    });
    expect(prisma.projectUnlockAttempt.deleteMany).toHaveBeenCalledWith({
      where: {
        OR: [
          { lockedUntil: { lte: now } },
          {
            lockedUntil: null,
            lastFailAt: { lte: new Date('2026-05-13T09:45:00.000Z') },
          },
        ],
      },
    });
  });
});
