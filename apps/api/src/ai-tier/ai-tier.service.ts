import { Injectable } from '@nestjs/common';
import { PrismaService } from '@app/database';
import type { AiModelTier } from '@app/database/generated/prisma/client';
import * as bcrypt from 'bcrypt';
import {
  TIER_SECRET_FAILED_ATTEMPT_WINDOW_MS,
  TIER_SECRET_LOCKOUT_MS,
  TIER_SECRET_MAX_FAILED_ATTEMPTS,
  tierMemberNotFoundException,
  tierSecretInvalidException,
  tierSecretNotConfiguredException,
  tierTooManyAttemptsException,
} from './ai-tier.constants';

export interface TierChangeResult {
  userId: string;
  workspaceId: string;
  aiModelTier: AiModelTier;
}

@Injectable()
export class AiTierService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * The tier a member is entitled to in this workspace. Falls back to STANDARD
   * when no membership row exists so a missing row can never grant premium.
   */
  async getTier(workspaceId: string, userId: string): Promise<AiModelTier> {
    const member = await this.prisma.workspaceMember.findFirst({
      where: { workspaceId, userId, deletedAt: null },
      select: { aiModelTier: true },
    });
    return member?.aiModelTier ?? 'STANDARD';
  }

  /**
   * Verifies the secret and applies the tier change atomically.
   *
   * Order matters: lockout is checked before any bcrypt compare so a
   * locked-out caller cannot use this endpoint as a timing oracle.
   */
  async changeTier(
    actorUserId: string,
    workspaceId: string,
    targetUserId: string,
    tier: AiModelTier,
    secret: string,
    now = new Date(),
  ): Promise<TierChangeResult> {
    await this.assertNotLockedOut(actorUserId, now);

    const member = await this.prisma.workspaceMember.findFirst({
      where: { workspaceId, userId: targetUserId, deletedAt: null },
      select: { id: true, aiModelTier: true },
    });
    if (!member) throw tierMemberNotFoundException();

    const secretLabel = await this.verifySecret(actorUserId, secret, now);

    // Secret was correct — clear the failure counter before mutating.
    await this.clearFailedAttempts(actorUserId);

    const updated = await this.prisma.$transaction(async (tx) => {
      const result = await tx.workspaceMember.update({
        where: { id: member.id },
        data: { aiModelTier: tier },
        select: { userId: true, workspaceId: true, aiModelTier: true },
      });

      await tx.aiTierChangeLog.create({
        data: {
          workspaceId,
          targetUserId,
          actorUserId,
          fromTier: member.aiModelTier,
          toTier: tier,
          secretLabel,
        },
      });

      return result;
    });

    return updated;
  }

  /**
   * Full secret check for callers outside this service (e.g. token-allowance
   * changes): lockout guard, then compare, then clear the failure counter on
   * success. Returns the matching secret's label for audit rows.
   *
   * Exists so other secret-gated operations reuse this logic rather than
   * duplicating the bcrypt compare and the lockout bookkeeping.
   */
  async authoriseWithSecret(
    actorUserId: string,
    secret: string,
    now = new Date(),
  ): Promise<string> {
    await this.assertNotLockedOut(actorUserId, now);
    const label = await this.verifySecret(actorUserId, secret, now);
    await this.clearFailedAttempts(actorUserId);
    return label;
  }

  /**
   * Compares the supplied secret against every active secret hash.
   * Returns the matching secret's label for the audit row.
   */
  private async verifySecret(
    actorUserId: string,
    secret: string,
    now: Date,
  ): Promise<string> {
    const activeSecrets = await this.prisma.tierChangeSecret.findMany({
      where: { revokedAt: null },
      select: { label: true, secretHash: true },
    });

    if (activeSecrets.length === 0) throw tierSecretNotConfiguredException();

    for (const candidate of activeSecrets) {
      if (await bcrypt.compare(secret, candidate.secretHash)) {
        return candidate.label;
      }
    }

    await this.recordFailedAttempt(actorUserId, now);
    throw tierSecretInvalidException();
  }

  async assertNotLockedOut(userId: string, now = new Date()): Promise<void> {
    const attempt = await this.prisma.tierChangeAttempt.findUnique({
      where: { userId },
      select: { lockedUntil: true },
    });

    if (attempt?.lockedUntil && attempt.lockedUntil > now) {
      throw tierTooManyAttemptsException();
    }
  }

  async recordFailedAttempt(userId: string, now = new Date()) {
    const existing = await this.prisma.tierChangeAttempt.findUnique({
      where: { userId },
      select: { failedCount: true, lockedUntil: true, lastFailAt: true },
    });

    // Reset the counter if the previous lockout has elapsed or the last
    // failure fell outside the sliding window.
    const previousFailedCount =
      (existing?.lockedUntil && existing.lockedUntil <= now) ||
      (existing?.lastFailAt &&
        now.getTime() - existing.lastFailAt.getTime() >
          TIER_SECRET_FAILED_ATTEMPT_WINDOW_MS)
        ? 0
        : existing?.failedCount ?? 0;
    const failedCount = previousFailedCount + 1;
    const lockedUntil =
      failedCount >= TIER_SECRET_MAX_FAILED_ATTEMPTS
        ? new Date(now.getTime() + TIER_SECRET_LOCKOUT_MS)
        : null;

    return this.prisma.tierChangeAttempt.upsert({
      where: { userId },
      create: { userId, failedCount, lockedUntil, lastFailAt: now },
      update: { failedCount, lockedUntil, lastFailAt: now },
      select: { id: true, userId: true, failedCount: true, lockedUntil: true },
    });
  }

  async clearFailedAttempts(userId: string): Promise<void> {
    await this.prisma.tierChangeAttempt.deleteMany({ where: { userId } });
  }
}
