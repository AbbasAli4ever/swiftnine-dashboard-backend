import { Injectable } from '@nestjs/common';
import { PrismaService } from '@app/database';
import {
  PROJECT_UNLOCK_LOCKOUT_MS,
  PROJECT_UNLOCK_FAILED_ATTEMPT_WINDOW_MS,
  PROJECT_UNLOCK_MAX_FAILED_ATTEMPTS,
  PROJECT_UNLOCK_TTL_MS,
  tooManyAttemptsException,
} from './project-security.constants';

@Injectable()
export class ProjectUnlockService {
  constructor(private readonly prisma: PrismaService) {}

  async getActiveUnlockSession(projectId: string, userId: string, now = new Date()) {
    return this.prisma.projectUnlockSession.findFirst({
      where: { projectId, userId, expiresAt: { gt: now } },
      select: { id: true, projectId: true, userId: true, expiresAt: true, createdAt: true },
    });
  }

  async hasActiveUnlock(projectId: string, userId: string, now = new Date()): Promise<boolean> {
    const session = await this.getActiveUnlockSession(projectId, userId, now);
    return Boolean(session);
  }

  async activeUnlockedProjectIds(
    projectIds: string[],
    userId: string,
    now = new Date(),
  ): Promise<Set<string>> {
    if (projectIds.length === 0) return new Set<string>();

    const sessions = await this.prisma.projectUnlockSession.findMany({
      where: {
        userId,
        projectId: { in: projectIds },
        expiresAt: { gt: now },
      },
      select: { projectId: true },
    });

    return new Set(sessions.map((session) => session.projectId));
  }

  async activeUnlockedWorkspaceProjectIds(
    workspaceId: string,
    userId: string,
    now = new Date(),
  ): Promise<Set<string>> {
    const sessions = await this.prisma.projectUnlockSession.findMany({
      where: {
        userId,
        expiresAt: { gt: now },
        project: { workspaceId, deletedAt: null },
      },
      select: { projectId: true },
    });

    return new Set(sessions.map((session) => session.projectId));
  }

  async createUnlockSession(projectId: string, userId: string, now = new Date()) {
    const expiresAt = new Date(now.getTime() + PROJECT_UNLOCK_TTL_MS);

    return this.prisma.$transaction(async (tx) => {
      await tx.projectUnlockAttempt.deleteMany({ where: { projectId, userId } });

      return tx.projectUnlockSession.upsert({
        where: { projectId_userId: { projectId, userId } },
        create: { projectId, userId, expiresAt },
        update: { expiresAt, createdAt: now },
        select: { id: true, projectId: true, userId: true, expiresAt: true, createdAt: true },
      });
    });
  }

  async invalidateUnlockSessions(projectId: string): Promise<number> {
    const result = await this.prisma.projectUnlockSession.deleteMany({
      where: { projectId },
    });
    return result.count;
  }

  async pruneExpiredUnlockSessions(now = new Date()): Promise<number> {
    const result = await this.prisma.projectUnlockSession.deleteMany({
      where: { expiresAt: { lte: now } },
    });
    return result.count;
  }

  async assertNotLockedOut(projectId: string, userId: string, now = new Date()): Promise<void> {
    const attempt = await this.prisma.projectUnlockAttempt.findUnique({
      where: { projectId_userId: { projectId, userId } },
      select: { lockedUntil: true },
    });

    if (attempt?.lockedUntil && attempt.lockedUntil > now) {
      throw tooManyAttemptsException();
    }
  }

  async recordFailedAttempt(projectId: string, userId: string, now = new Date()) {
    const existing = await this.prisma.projectUnlockAttempt.findUnique({
      where: { projectId_userId: { projectId, userId } },
      select: { failedCount: true, lockedUntil: true, lastFailAt: true },
    });

    const previousFailedCount =
      (existing?.lockedUntil && existing.lockedUntil <= now) ||
      (existing?.lastFailAt &&
        now.getTime() - existing.lastFailAt.getTime() >
          PROJECT_UNLOCK_FAILED_ATTEMPT_WINDOW_MS)
        ? 0
        : existing?.failedCount ?? 0;
    const failedCount = previousFailedCount + 1;
    const lockedUntil =
      failedCount >= PROJECT_UNLOCK_MAX_FAILED_ATTEMPTS
        ? new Date(now.getTime() + PROJECT_UNLOCK_LOCKOUT_MS)
        : null;

    return this.prisma.projectUnlockAttempt.upsert({
      where: { projectId_userId: { projectId, userId } },
      create: {
        projectId,
        userId,
        failedCount,
        lockedUntil,
        lastFailAt: now,
      },
      update: {
        failedCount,
        lockedUntil,
        lastFailAt: now,
      },
      select: {
        id: true,
        projectId: true,
        userId: true,
        failedCount: true,
        lockedUntil: true,
        lastFailAt: true,
      },
    });
  }

  async clearFailedAttempts(projectId: string, userId: string): Promise<void> {
    await this.prisma.projectUnlockAttempt.deleteMany({
      where: { projectId, userId },
    });
  }

  async pruneExpiredFailedAttempts(now = new Date()): Promise<number> {
    const staleAttemptCutoff = new Date(
      now.getTime() - PROJECT_UNLOCK_FAILED_ATTEMPT_WINDOW_MS,
    );
    const result = await this.prisma.projectUnlockAttempt.deleteMany({
      where: {
        OR: [
          { lockedUntil: { lte: now } },
          {
            lockedUntil: null,
            lastFailAt: { lte: staleAttemptCutoff },
          },
        ],
      },
    });
    return result.count;
  }
}
