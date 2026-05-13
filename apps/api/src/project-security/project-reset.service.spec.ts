import { ProjectResetService } from './project-reset.service';

jest.mock('@app/database', () => ({
  PrismaService: class PrismaService {},
}));

describe('ProjectResetService', () => {
  let prisma: {
    projectPasswordResetToken: {
      findFirst: jest.Mock;
      updateMany: jest.Mock;
      create: jest.Mock;
      deleteMany: jest.Mock;
    };
    $transaction: jest.Mock;
  };
  let service: ProjectResetService;

  beforeEach(() => {
    prisma = {
      projectPasswordResetToken: {
        findFirst: jest.fn().mockResolvedValue(null),
        updateMany: jest.fn(),
        create: jest.fn(),
        deleteMany: jest.fn().mockResolvedValue({ count: 3 }),
      },
      $transaction: jest.fn().mockResolvedValue(undefined),
    };
    service = new ProjectResetService(prisma as never);
  });

  it('rate limits repeated reset requests for the same project', async () => {
    prisma.projectPasswordResetToken.findFirst.mockResolvedValue({ id: 'token-1' });

    await expect(
      service.assertResetRequestAllowed(
        'project-1',
        new Date('2026-05-13T10:00:00.000Z'),
      ),
    ).rejects.toMatchObject({ status: 429 });
    expect(prisma.projectPasswordResetToken.findFirst).toHaveBeenCalledWith({
      where: {
        projectId: 'project-1',
        usedAt: null,
        createdAt: { gt: new Date('2026-05-13T09:55:00.000Z') },
      },
      select: { id: true },
    });
  });

  it('creates a reset token when no recent token exists', async () => {
    const result = await service.createResetToken(
      'project-1',
      new Date('2026-05-13T10:00:00.000Z'),
    );

    expect(result.token).toEqual(expect.any(String));
    expect(result.tokenHash).toHaveLength(64);
    expect(result.expiresAt).toEqual(new Date('2026-05-13T11:00:00.000Z'));
    expect(prisma.$transaction).toHaveBeenCalled();
  });

  it('prunes expired and old used reset tokens', async () => {
    const count = await service.pruneExpiredResetTokens(
      new Date('2026-05-13T10:00:00.000Z'),
    );

    expect(count).toBe(3);
    expect(prisma.projectPasswordResetToken.deleteMany).toHaveBeenCalledWith({
      where: {
        OR: [
          { expiresAt: { lte: new Date('2026-05-13T10:00:00.000Z') } },
          { usedAt: { lte: new Date('2026-05-12T10:00:00.000Z') } },
        ],
      },
    });
  });
});
