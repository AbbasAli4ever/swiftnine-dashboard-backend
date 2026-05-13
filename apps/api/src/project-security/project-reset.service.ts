import { Injectable } from '@nestjs/common';
import { PrismaService } from '@app/database';
import { createHash, randomUUID } from 'node:crypto';
import {
  PROJECT_PASSWORD_RESET_REQUEST_COOLDOWN_MS,
  PROJECT_PASSWORD_RESET_TOKEN_TTL_MS,
  PROJECT_PASSWORD_RESET_TOKEN_USED_RETENTION_MS,
  resetRequestRateLimitedException,
  resetTokenInvalidException,
} from './project-security.constants';

@Injectable()
export class ProjectResetService {
  constructor(private readonly prisma: PrismaService) {}

  async createResetToken(projectId: string, now = new Date()) {
    await this.assertResetRequestAllowed(projectId, now);

    const token = randomUUID();
    const tokenHash = this.hashToken(token);
    const expiresAt = new Date(now.getTime() + PROJECT_PASSWORD_RESET_TOKEN_TTL_MS);

    await this.prisma.$transaction([
      this.prisma.projectPasswordResetToken.updateMany({
        where: { projectId, usedAt: null },
        data: { usedAt: now },
      }),
      this.prisma.projectPasswordResetToken.create({
        data: { projectId, tokenHash, expiresAt },
        select: { id: true },
      }),
    ]);

    return { token, tokenHash, expiresAt };
  }

  async assertResetRequestAllowed(projectId: string, now = new Date()) {
    const recentCutoff = new Date(
      now.getTime() - PROJECT_PASSWORD_RESET_REQUEST_COOLDOWN_MS,
    );
    const recentToken = await this.prisma.projectPasswordResetToken.findFirst({
      where: {
        projectId,
        usedAt: null,
        createdAt: { gt: recentCutoff },
      },
      select: { id: true },
    });

    if (recentToken) throw resetRequestRateLimitedException();
  }

  async findValidResetToken(rawToken: string, now = new Date()) {
    const tokenHash = this.hashToken(rawToken);

    const stored = await this.prisma.projectPasswordResetToken.findFirst({
      where: {
        tokenHash,
        usedAt: null,
        expiresAt: { gt: now },
        project: { deletedAt: null },
      },
      select: { id: true, projectId: true },
    });

    if (!stored) throw resetTokenInvalidException();
    return stored;
  }

  async consumeResetToken(rawToken: string, now = new Date()) {
    const stored = await this.findValidResetToken(rawToken, now);

    await this.prisma.projectPasswordResetToken.update({
      where: { id: stored.id },
      data: { usedAt: now },
    });

    return stored;
  }

  hashToken(rawToken: string): string {
    return createHash('sha256').update(rawToken).digest('hex');
  }

  async pruneExpiredResetTokens(now = new Date()): Promise<number> {
    const usedTokenCutoff = new Date(
      now.getTime() - PROJECT_PASSWORD_RESET_TOKEN_USED_RETENTION_MS,
    );
    const result = await this.prisma.projectPasswordResetToken.deleteMany({
      where: {
        OR: [
          { expiresAt: { lte: now } },
          { usedAt: { lte: usedTokenCutoff } },
        ],
      },
    });
    return result.count;
  }
}
