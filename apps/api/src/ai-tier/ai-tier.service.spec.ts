import { ForbiddenException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AiTierService } from './ai-tier.service';
import { TIER_SECRET_MAX_FAILED_ATTEMPTS } from './ai-tier.constants';

jest.mock('@app/database', () => ({
  PrismaService: class PrismaService {},
}));

const WORKSPACE_ID = 'ws-1';
const ACTOR_ID = 'actor-1';
const TARGET_ID = 'target-1';
const SECRET = 'correct-horse-battery';

describe('AiTierService', () => {
  let prisma: {
    workspaceMember: { findFirst: jest.Mock; update: jest.Mock };
    tierChangeSecret: { findMany: jest.Mock };
    tierChangeAttempt: { findUnique: jest.Mock; upsert: jest.Mock; deleteMany: jest.Mock };
    aiTierChangeLog: { create: jest.Mock };
    $transaction: jest.Mock;
  };
  let service: AiTierService;
  let secretHash: string;

  beforeAll(async () => {
    secretHash = await bcrypt.hash(SECRET, 10);
  });

  beforeEach(() => {
    prisma = {
      workspaceMember: {
        findFirst: jest.fn().mockResolvedValue({ id: 'wm-1', aiModelTier: 'STANDARD' }),
        update: jest.fn().mockResolvedValue({
          userId: TARGET_ID,
          workspaceId: WORKSPACE_ID,
          aiModelTier: 'PREMIUM',
        }),
      },
      tierChangeSecret: {
        findMany: jest.fn().mockResolvedValue([{ label: 'office-admin', secretHash }]),
      },
      tierChangeAttempt: {
        findUnique: jest.fn().mockResolvedValue(null),
        upsert: jest.fn().mockResolvedValue({}),
        deleteMany: jest.fn().mockResolvedValue({ count: 1 }),
      },
      aiTierChangeLog: { create: jest.fn().mockResolvedValue({}) },
      $transaction: jest.fn(),
    };
    // Run the transaction callback against the same mock client.
    prisma.$transaction.mockImplementation((cb: (tx: unknown) => unknown) => cb(prisma));
    service = new AiTierService(prisma as never);
  });

  const change = (secret = SECRET, tier: 'PREMIUM' | 'STANDARD' = 'PREMIUM') =>
    service.changeTier(ACTOR_ID, WORKSPACE_ID, TARGET_ID, tier as never, secret);

  it('updates the tier when the secret is correct', async () => {
    await expect(change()).resolves.toEqual({
      userId: TARGET_ID,
      workspaceId: WORKSPACE_ID,
      aiModelTier: 'PREMIUM',
    });

    expect(prisma.workspaceMember.update).toHaveBeenCalledWith(
      expect.objectContaining({ data: { aiModelTier: 'PREMIUM' } }),
    );
  });

  it('writes an audit row naming the actor, target, and secret used', async () => {
    await change();

    expect(prisma.aiTierChangeLog.create).toHaveBeenCalledWith({
      data: {
        workspaceId: WORKSPACE_ID,
        targetUserId: TARGET_ID,
        actorUserId: ACTOR_ID,
        fromTier: 'STANDARD',
        toTier: 'PREMIUM',
        secretLabel: 'office-admin',
      },
    });
  });

  it('rejects a wrong secret and does not touch the tier', async () => {
    await expect(change('wrong-secret')).rejects.toThrow(UnauthorizedException);
    expect(prisma.workspaceMember.update).not.toHaveBeenCalled();
    expect(prisma.tierChangeAttempt.upsert).toHaveBeenCalled();
  });

  it('locks out after the configured number of failures', async () => {
    prisma.tierChangeAttempt.findUnique.mockResolvedValue({
      failedCount: TIER_SECRET_MAX_FAILED_ATTEMPTS - 1,
      lockedUntil: null,
      lastFailAt: new Date(),
    });

    await expect(change('wrong-secret')).rejects.toThrow(UnauthorizedException);

    expect(prisma.tierChangeAttempt.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        create: expect.objectContaining({ lockedUntil: expect.any(Date) }),
      }),
    );
  });

  it('refuses while locked out, before comparing the secret', async () => {
    prisma.tierChangeAttempt.findUnique.mockResolvedValue({
      lockedUntil: new Date(Date.now() + 60_000),
    });

    await expect(change()).rejects.toThrow(ForbiddenException);
    // Correct secret, but lockout short-circuits: no comparison happened.
    expect(prisma.tierChangeSecret.findMany).not.toHaveBeenCalled();
  });

  it('clears the failure counter after a successful change', async () => {
    await change();
    expect(prisma.tierChangeAttempt.deleteMany).toHaveBeenCalledWith({
      where: { userId: ACTOR_ID },
    });
  });

  it('rejects when no secret is configured', async () => {
    prisma.tierChangeSecret.findMany.mockResolvedValue([]);
    await expect(change()).rejects.toThrow(ForbiddenException);
  });

  it('ignores revoked secrets', async () => {
    await change();
    expect(prisma.tierChangeSecret.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { revokedAt: null } }),
    );
  });

  it('404s when the target is not a member of the workspace', async () => {
    prisma.workspaceMember.findFirst.mockResolvedValue(null);
    await expect(change()).rejects.toThrow(NotFoundException);
  });

  it('excludes soft-deleted members', async () => {
    await change();
    expect(prisma.workspaceMember.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { workspaceId: WORKSPACE_ID, userId: TARGET_ID, deletedAt: null },
      }),
    );
  });
});
