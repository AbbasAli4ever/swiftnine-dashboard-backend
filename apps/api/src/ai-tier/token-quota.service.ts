import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@app/database';
import type { AiModelTier, Prisma } from '@app/database/generated/prisma/client';
import {
  TOKEN_CRITICAL_THRESHOLD_PERCENT,
  TOKEN_LIMIT_MAX,
  TOKEN_LIMIT_MIN,
  TOKEN_WARN_THRESHOLD_PERCENT,
  tokenLimitExceededException,
  tokenLimitInvalidException,
} from './ai-tier.constants';

/** Transaction client, so usage can be recorded atomically with a message row. */
type TxClient = Prisma.TransactionClient;

export interface QuotaStatus {
  /** False for standard-tier members, who are unmetered. */
  metered: boolean;
  tokenLimit: number;
  consumedTokens: number;
  remainingTokens: number;
  percentUsed: number;
  /** Subset of consumption counted locally rather than reported by OpenAI. */
  estimatedTokens: number;
  costUsdUsed: number;
  periodStart: Date;
  resetsAt: Date;
  exhausted: boolean;
  fallbackOptIn: boolean;
  /** 'ok' | 'warn' (>=80%) | 'critical' (>=95%) — one source of truth for the UI. */
  band: 'ok' | 'warn' | 'critical';
}

/**
 * Start of the UTC week (Monday 00:00) containing `date`.
 *
 * Exported for testing. Deliberately UTC: a locale-dependent boundary would
 * shift with DST and make stored periodStart values inconsistent.
 */
export function weekStart(date: Date): Date {
  const d = new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 0, 0, 0, 0),
  );
  // getUTCDay: 0=Sunday. Shift so Monday is day 0.
  const daysSinceMonday = (d.getUTCDay() + 6) % 7;
  d.setUTCDate(d.getUTCDate() - daysSinceMonday);
  return d;
}

export function weekEnd(periodStart: Date): Date {
  const d = new Date(periodStart);
  d.setUTCDate(d.getUTCDate() + 7);
  return d;
}

@Injectable()
export class TokenQuotaService {
  private readonly logger = new Logger(TokenQuotaService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Current quota state for a member.
   *
   * Standard-tier members are unmetered, so this reports `metered: false` and
   * callers should not enforce anything.
   */
  async getStatus(
    workspaceId: string,
    userId: string,
    tier: AiModelTier,
    now = new Date(),
  ): Promise<QuotaStatus> {
    const periodStart = weekStart(now);

    if (tier !== 'PREMIUM') {
      return this.unmeteredStatus(periodStart);
    }

    const row = await this.currentRow(workspaceId, userId, periodStart);

    // No allowance ever assigned — premium with no cap. Treated as unmetered
    // rather than blocked, so upgrading someone never silently locks them out.
    if (!row) return this.unmeteredStatus(periodStart);

    return this.toStatus(row, periodStart);
  }

  /**
   * Throws when a premium member has no budget left and has not accepted the
   * standard-model fallback.
   *
   * Estimated consumption never blocks on its own: if removing locally-counted
   * tokens would put the member back under the limit, the request is allowed and
   * logged. Estimation error must degrade accounting, not deny service.
   */
  async assertWithinQuota(
    workspaceId: string,
    userId: string,
    tier: AiModelTier,
    now = new Date(),
  ): Promise<QuotaStatus> {
    const status = await this.getStatus(workspaceId, userId, tier, now);
    if (!status.metered || !status.exhausted || status.fallbackOptIn) return status;

    const measuredOnly = status.consumedTokens - status.estimatedTokens;
    if (measuredOnly < status.tokenLimit) {
      this.logger.warn(
        `Allowing request for user ${userId} in workspace ${workspaceId}: over limit only when ` +
          `including ${status.estimatedTokens} estimated tokens (measured ${measuredOnly}/${status.tokenLimit}).`,
      );
      return status;
    }

    throw tokenLimitExceededException();
  }

  /**
   * Adds consumption to the current period. Takes a transaction client so the
   * increment commits with the message row it describes — a separate write could
   * leave the counter and the audit trail disagreeing.
   *
   * Atomic `increment` rather than read-modify-write: concurrent streams from
   * multiple tabs are normal.
   */
  async recordUsage(
    tx: TxClient,
    params: {
      workspaceId: string;
      userId: string;
      totalTokens: number;
      estimatedTokens: number;
      costUsd: number | null;
      now?: Date;
    },
  ): Promise<void> {
    const { workspaceId, userId, totalTokens, estimatedTokens, costUsd } = params;
    if (totalTokens <= 0) return;

    const periodStart = weekStart(params.now ?? new Date());

    // Only meters members who have an allowance row for this period. updateMany
    // is a no-op when absent, which is the desired behaviour for unmetered users.
    await tx.aiTokenAllowance.updateMany({
      where: { workspaceId, userId, periodStart },
      data: {
        consumedTokens: { increment: totalTokens },
        estimatedTokens: { increment: estimatedTokens },
        costUsdUsed: { increment: costUsd ?? 0 },
      },
    });
  }

  /**
   * Assigns or updates a member's weekly limit for the current period.
   * Carries consumption forward — raising a limit must not wipe usage.
   */
  async setLimit(
    workspaceId: string,
    userId: string,
    tokenLimit: number,
    actorUserId: string,
    now = new Date(),
  ): Promise<QuotaStatus> {
    // Floor at TOKEN_LIMIT_MIN: a limit smaller than one possible reply makes the
    // quota incoherent — the member is blocked by their first message, and
    // raising the limit appears to do nothing because consumption already
    // exceeds it.
    if (
      !Number.isInteger(tokenLimit) ||
      tokenLimit < TOKEN_LIMIT_MIN ||
      tokenLimit > TOKEN_LIMIT_MAX
    ) {
      throw tokenLimitInvalidException();
    }

    const periodStart = weekStart(now);

    const row = await this.prisma.$transaction(async (tx) => {
      const updated = await tx.aiTokenAllowance.upsert({
        where: { workspaceId_userId_periodStart: { workspaceId, userId, periodStart } },
        create: { workspaceId, userId, periodStart, tokenLimit },
        update: { tokenLimit },
      });

      await tx.aiTokenAllowanceHistory.create({
        data: {
          workspaceId,
          userId,
          event: 'LIMIT_SET',
          periodStart,
          tokenLimit,
          consumedTokens: updated.consumedTokens,
          costUsdUsed: updated.costUsdUsed,
          actorUserId,
        },
      });

      return updated;
    });

    return this.toStatus(row, periodStart);
  }

  /** Zeroes consumption for the current period, keeping the same limit. */
  async resetNow(
    workspaceId: string,
    userId: string,
    actorUserId: string,
    now = new Date(),
  ): Promise<QuotaStatus> {
    const periodStart = weekStart(now);

    const row = await this.prisma.$transaction(async (tx) => {
      const existing = await tx.aiTokenAllowance.findUnique({
        where: { workspaceId_userId_periodStart: { workspaceId, userId, periodStart } },
      });
      if (!existing) return null;

      await tx.aiTokenAllowanceHistory.create({
        data: {
          workspaceId,
          userId,
          event: 'MANUAL_RESET',
          periodStart,
          tokenLimit: existing.tokenLimit,
          // Snapshot of what was consumed before zeroing, so the reset is auditable.
          consumedTokens: existing.consumedTokens,
          costUsdUsed: existing.costUsdUsed,
          actorUserId,
        },
      });

      return tx.aiTokenAllowance.update({
        where: { id: existing.id },
        data: {
          consumedTokens: 0,
          estimatedTokens: 0,
          costUsdUsed: 0,
          fallbackOptIn: false,
        },
      });
    });

    if (!row) throw tokenLimitInvalidException();
    return this.toStatus(row, periodStart);
  }

  /** Records that a member accepted the standard-model fallback this period. */
  async setFallbackOptIn(
    workspaceId: string,
    userId: string,
    optIn: boolean,
    now = new Date(),
  ): Promise<void> {
    await this.prisma.aiTokenAllowance.updateMany({
      where: { workspaceId, userId, periodStart: weekStart(now) },
      data: { fallbackOptIn: optIn },
    });
  }

  /**
   * Finds the row for this period, rolling over from the previous one if needed.
   *
   * Reset is lazy rather than scheduled: a missed timer or a restart cannot skip
   * a rollover, and no cron dependency is introduced. The previous period's row
   * is left intact as history; a fresh row starts at zero.
   */
  private async currentRow(workspaceId: string, userId: string, periodStart: Date) {
    const existing = await this.prisma.aiTokenAllowance.findUnique({
      where: { workspaceId_userId_periodStart: { workspaceId, userId, periodStart } },
    });
    if (existing) return existing;

    const previous = await this.prisma.aiTokenAllowance.findFirst({
      where: { workspaceId, userId, periodStart: { lt: periodStart } },
      orderBy: { periodStart: 'desc' },
    });
    if (!previous) return null;

    // Carry the limit into the new week and start consumption at zero. The
    // rollover is recorded so week-over-week usage stays queryable.
    try {
      return await this.prisma.$transaction(async (tx) => {
        await tx.aiTokenAllowanceHistory.create({
          data: {
            workspaceId,
            userId,
            event: 'PERIOD_ROLLOVER',
            periodStart: previous.periodStart,
            tokenLimit: previous.tokenLimit,
            consumedTokens: previous.consumedTokens,
            costUsdUsed: previous.costUsdUsed,
          },
        });

        return tx.aiTokenAllowance.create({
          data: { workspaceId, userId, periodStart, tokenLimit: previous.tokenLimit },
        });
      });
    } catch {
      // A concurrent request may have created the row first; the unique
      // constraint makes that safe to absorb.
      return this.prisma.aiTokenAllowance.findUnique({
        where: { workspaceId_userId_periodStart: { workspaceId, userId, periodStart } },
      });
    }
  }

  private unmeteredStatus(periodStart: Date): QuotaStatus {
    return {
      metered: false,
      tokenLimit: 0,
      consumedTokens: 0,
      remainingTokens: 0,
      percentUsed: 0,
      estimatedTokens: 0,
      costUsdUsed: 0,
      periodStart,
      resetsAt: weekEnd(periodStart),
      exhausted: false,
      fallbackOptIn: false,
      band: 'ok',
    };
  }

  private toStatus(
    row: {
      tokenLimit: number;
      consumedTokens: number;
      estimatedTokens: number;
      costUsdUsed: Prisma.Decimal | number;
      fallbackOptIn: boolean;
    },
    periodStart: Date,
  ): QuotaStatus {
    const percentUsed =
      row.tokenLimit > 0 ? Math.min(100, (row.consumedTokens / row.tokenLimit) * 100) : 0;

    return {
      metered: true,
      tokenLimit: row.tokenLimit,
      consumedTokens: row.consumedTokens,
      remainingTokens: Math.max(0, row.tokenLimit - row.consumedTokens),
      percentUsed: Math.round(percentUsed * 10) / 10,
      estimatedTokens: row.estimatedTokens,
      costUsdUsed: Number(row.costUsdUsed),
      periodStart,
      resetsAt: weekEnd(periodStart),
      exhausted: row.consumedTokens >= row.tokenLimit,
      fallbackOptIn: row.fallbackOptIn,
      band:
        percentUsed >= TOKEN_CRITICAL_THRESHOLD_PERCENT
          ? 'critical'
          : percentUsed >= TOKEN_WARN_THRESHOLD_PERCENT
            ? 'warn'
            : 'ok',
    };
  }
}
