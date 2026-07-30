import { ForbiddenException } from '@nestjs/common';
import { TokenQuotaService, weekEnd, weekStart } from './token-quota.service';
import {
  MAX_SINGLE_REPLY_TOKENS,
  TOKEN_CRITICAL_THRESHOLD_PERCENT,
  TOKEN_LIMIT_MIN,
  TOKEN_WARN_THRESHOLD_PERCENT,
} from './ai-tier.constants';

jest.mock('@app/database', () => ({ PrismaService: class PrismaService {} }));

const WS = 'ws-1';
const USER = 'user-1';
const ACTOR = 'actor-1';

function allowance(over: Partial<Record<string, unknown>> = {}) {
  return {
    id: 'alw-1',
    workspaceId: WS,
    userId: USER,
    tokenLimit: 1000,
    consumedTokens: 0,
    estimatedTokens: 0,
    costUsdUsed: 0,
    fallbackOptIn: false,
    ...over,
  };
}

function makeService(row: unknown = null, previous: unknown = null) {
  const prisma: any = {
    aiTokenAllowance: {
      findUnique: jest.fn().mockResolvedValue(row),
      findFirst: jest.fn().mockResolvedValue(previous),
      create: jest.fn().mockImplementation(({ data }: any) => Promise.resolve(allowance(data))),
      update: jest.fn().mockImplementation(({ data }: any) => Promise.resolve(allowance(data))),
      upsert: jest.fn().mockImplementation(({ create, update }: any) =>
        Promise.resolve(allowance({ ...create, ...update })),
      ),
      updateMany: jest.fn().mockResolvedValue({ count: 1 }),
    },
    aiTokenAllowanceHistory: { create: jest.fn().mockResolvedValue({}) },
  };
  prisma.$transaction = jest.fn((cb: any) => cb(prisma));
  return { service: new TokenQuotaService(prisma as never), prisma };
}

describe('weekStart / weekEnd', () => {
  it('anchors to UTC Monday 00:00', () => {
    // 2026-07-29 is a Wednesday.
    expect(weekStart(new Date('2026-07-29T13:45:00Z')).toISOString()).toBe(
      '2026-07-27T00:00:00.000Z',
    );
  });

  it('treats Monday itself as the start of its own week', () => {
    expect(weekStart(new Date('2026-07-27T00:00:00Z')).toISOString()).toBe(
      '2026-07-27T00:00:00.000Z',
    );
  });

  it('puts Sunday in the week that began the preceding Monday', () => {
    // Regression: getUTCDay() returns 0 for Sunday, so a naive shift lands a
    // week early.
    expect(weekStart(new Date('2026-08-02T23:59:59Z')).toISOString()).toBe(
      '2026-07-27T00:00:00.000Z',
    );
  });

  it('rolls over the following Monday', () => {
    expect(weekEnd(weekStart(new Date('2026-07-29T00:00:00Z'))).toISOString()).toBe(
      '2026-08-03T00:00:00.000Z',
    );
  });

  it('crosses month and year boundaries', () => {
    expect(weekStart(new Date('2027-01-01T12:00:00Z')).toISOString()).toBe(
      '2026-12-28T00:00:00.000Z',
    );
  });
});

describe('TokenQuotaService.getStatus', () => {
  it('reports standard-tier members as unmetered', async () => {
    const { service, prisma } = makeService();

    const status = await service.getStatus(WS, USER, 'STANDARD' as never);

    expect(status.metered).toBe(false);
    expect(status.exhausted).toBe(false);
    // Standard tier must not even query — it is never metered.
    expect(prisma.aiTokenAllowance.findUnique).not.toHaveBeenCalled();
  });

  it('treats a premium member with no allowance as unmetered, not blocked', async () => {
    // Upgrading someone must never silently lock them out of chat.
    const { service } = makeService(null, null);

    const status = await service.getStatus(WS, USER, 'PREMIUM' as never);

    expect(status.metered).toBe(false);
  });

  it('computes percentage, remaining and band', async () => {
    const { service } = makeService(allowance({ tokenLimit: 1000, consumedTokens: 850 }));

    const status = await service.getStatus(WS, USER, 'PREMIUM' as never);

    expect(status.percentUsed).toBe(85);
    expect(status.remainingTokens).toBe(150);
    expect(status.band).toBe('critical');
  });

  // Boundaries derived from the constants so retuning the zones does not require
  // rewriting the arithmetic here. On a 1000-token limit each percent is 10
  // tokens: green below 50%, yellow from 50%, red from 85%.
  it.each([
    [0, 'ok'],
    [TOKEN_WARN_THRESHOLD_PERCENT * 10 - 1, 'ok'],
    [TOKEN_WARN_THRESHOLD_PERCENT * 10, 'warn'],
    [TOKEN_CRITICAL_THRESHOLD_PERCENT * 10 - 1, 'warn'],
    [TOKEN_CRITICAL_THRESHOLD_PERCENT * 10, 'critical'],
    [1200, 'critical'],
  ])('maps %i consumed of 1000 to band %s', async (consumed, band) => {
    const { service } = makeService(allowance({ tokenLimit: 1000, consumedTokens: consumed }));

    expect((await service.getStatus(WS, USER, 'PREMIUM' as never)).band).toBe(band);
  });

  it('uses green/yellow/red zones rather than late-stage warnings', () => {
    // The bar is always on screen, so green must cover the first half of a
    // normal week rather than everything below 80%.
    expect(TOKEN_WARN_THRESHOLD_PERCENT).toBe(50);
    expect(TOKEN_CRITICAL_THRESHOLD_PERCENT).toBe(85);
  });

  it('caps percentUsed at 100 when consumption overshoots', async () => {
    // Overshoot is expected: a request's cost is unknown until it completes.
    const { service } = makeService(allowance({ tokenLimit: 1000, consumedTokens: 1500 }));

    const status = await service.getStatus(WS, USER, 'PREMIUM' as never);

    expect(status.percentUsed).toBe(100);
    expect(status.remainingTokens).toBe(0);
    expect(status.exhausted).toBe(true);
  });

  it('rolls over into a new week, carrying the limit and zeroing usage', async () => {
    const previous = allowance({
      tokenLimit: 5000,
      consumedTokens: 4200,
      periodStart: new Date('2026-07-20T00:00:00Z'),
    });
    const { service, prisma } = makeService(null, previous);

    const status = await service.getStatus(WS, USER, 'PREMIUM' as never, new Date('2026-07-29T10:00:00Z'));

    expect(status.tokenLimit).toBe(5000);
    expect(status.consumedTokens).toBe(0);
    expect(prisma.aiTokenAllowanceHistory.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ event: 'PERIOD_ROLLOVER', consumedTokens: 4200 }),
      }),
    );
  });
});

describe('TokenQuotaService.assertWithinQuota', () => {
  it('allows a member under the limit', async () => {
    const { service } = makeService(allowance({ tokenLimit: 1000, consumedTokens: 500 }));

    await expect(service.assertWithinQuota(WS, USER, 'PREMIUM' as never)).resolves.toBeDefined();
  });

  it('blocks a premium member whose measured usage exhausted the limit', async () => {
    const { service } = makeService(allowance({ tokenLimit: 1000, consumedTokens: 1000 }));

    await expect(service.assertWithinQuota(WS, USER, 'PREMIUM' as never)).rejects.toThrow(
      ForbiddenException,
    );
  });

  it('never blocks a standard member', async () => {
    const { service } = makeService(allowance({ tokenLimit: 1, consumedTokens: 999 }));

    await expect(service.assertWithinQuota(WS, USER, 'STANDARD' as never)).resolves.toBeDefined();
  });

  it('allows through when only estimated tokens push it over the limit', async () => {
    // Estimation error must degrade accounting, never deny service.
    const { service } = makeService(
      allowance({ tokenLimit: 1000, consumedTokens: 1100, estimatedTokens: 300 }),
    );

    // Measured alone is 800 — under the limit, so the request proceeds.
    await expect(service.assertWithinQuota(WS, USER, 'PREMIUM' as never)).resolves.toBeDefined();
  });

  it('still blocks when measured usage alone exceeds the limit', async () => {
    const { service } = makeService(
      allowance({ tokenLimit: 1000, consumedTokens: 1400, estimatedTokens: 200 }),
    );

    // Measured alone is 1200 — genuinely over.
    await expect(service.assertWithinQuota(WS, USER, 'PREMIUM' as never)).rejects.toThrow(
      ForbiddenException,
    );
  });

  it('allows an exhausted member who accepted the fallback', async () => {
    const { service } = makeService(
      allowance({ tokenLimit: 1000, consumedTokens: 5000, fallbackOptIn: true }),
    );

    await expect(service.assertWithinQuota(WS, USER, 'PREMIUM' as never)).resolves.toBeDefined();
  });
});

describe('TokenQuotaService.recordUsage', () => {
  it('increments atomically rather than read-modify-write', async () => {
    const { service, prisma } = makeService(allowance());

    await service.recordUsage(prisma as never, {
      workspaceId: WS,
      userId: USER,
      totalTokens: 120,
      estimatedTokens: 0,
      costUsd: 0.0012,
    });

    expect(prisma.aiTokenAllowance.updateMany).toHaveBeenCalledWith(
      expect.objectContaining({
        data: {
          consumedTokens: { increment: 120 },
          estimatedTokens: { increment: 0 },
          costUsdUsed: { increment: 0.0012 },
        },
      }),
    );
  });

  it('treats a null cost as zero rather than failing', async () => {
    const { service, prisma } = makeService(allowance());

    await service.recordUsage(prisma as never, {
      workspaceId: WS,
      userId: USER,
      totalTokens: 10,
      estimatedTokens: 10,
      costUsd: null,
    });

    expect(prisma.aiTokenAllowance.updateMany).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ costUsdUsed: { increment: 0 } }) }),
    );
  });

  it('does nothing for a zero-token turn', async () => {
    const { service, prisma } = makeService(allowance());

    await service.recordUsage(prisma as never, {
      workspaceId: WS,
      userId: USER,
      totalTokens: 0,
      estimatedTokens: 0,
      costUsd: 0,
    });

    expect(prisma.aiTokenAllowance.updateMany).not.toHaveBeenCalled();
  });
});

describe('TokenQuotaService.setLimit / resetNow', () => {
  it('rejects a non-positive or non-integer limit', async () => {
    const { service } = makeService();

    await expect(service.setLimit(WS, USER, 0, ACTOR)).rejects.toThrow();
    await expect(service.setLimit(WS, USER, -5, ACTOR)).rejects.toThrow();
    await expect(service.setLimit(WS, USER, 1.5, ACTOR)).rejects.toThrow();
  });

  it('rejects a limit smaller than one possible reply', async () => {
    // A 500-token limit is incoherent: the first reply blows through it and
    // raising the limit then appears to do nothing, because consumption already
    // exceeds the new value.
    const { service } = makeService();

    await expect(service.setLimit(WS, USER, 500, ACTOR)).rejects.toThrow();
    await expect(service.setLimit(WS, USER, TOKEN_LIMIT_MIN - 1, ACTOR)).rejects.toThrow();
  });

  it('accepts a limit at the minimum and above', async () => {
    const { service } = makeService();

    await expect(service.setLimit(WS, USER, TOKEN_LIMIT_MIN, ACTOR)).resolves.toBeDefined();
    await expect(service.setLimit(WS, USER, 1_000_000, ACTOR)).resolves.toBeDefined();
  });

  it('keeps the minimum above the largest single reply', () => {
    // Otherwise one answer could exhaust a freshly-assigned allowance.
    expect(TOKEN_LIMIT_MIN).toBeGreaterThan(MAX_SINGLE_REPLY_TOKENS);
  });

  it('rejects an implausibly large limit', async () => {
    const { service } = makeService();

    await expect(service.setLimit(WS, USER, 1_000_000_001, ACTOR)).rejects.toThrow();
  });

  it('records who changed a limit', async () => {
    const { service, prisma } = makeService();

    await service.setLimit(WS, USER, 2_000_000, ACTOR);

    expect(prisma.aiTokenAllowanceHistory.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ event: 'LIMIT_SET', actorUserId: ACTOR }),
      }),
    );
  });

  it('zeroes usage and clears the fallback on manual reset', async () => {
    const { service, prisma } = makeService(
      allowance({ consumedTokens: 900, estimatedTokens: 100, fallbackOptIn: true }),
    );

    await service.resetNow(WS, USER, ACTOR);

    expect(prisma.aiTokenAllowance.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: {
          consumedTokens: 0,
          estimatedTokens: 0,
          costUsdUsed: 0,
          fallbackOptIn: false,
        },
      }),
    );
    // Snapshot the pre-reset figure so the reset is auditable.
    expect(prisma.aiTokenAllowanceHistory.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ event: 'MANUAL_RESET', consumedTokens: 900 }),
      }),
    );
  });
});
