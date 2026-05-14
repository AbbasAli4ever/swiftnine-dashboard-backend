import { Injectable } from '@nestjs/common';
import { PrismaService } from '@app/database';
import { createHash, randomInt } from 'node:crypto';
import {
  PROJECT_PASSWORD_RESET_REQUEST_COOLDOWN_MS,
  PROJECT_PASSWORD_RESET_OTP_TTL_MS,
  PROJECT_PASSWORD_RESET_OTP_USED_RETENTION_MS,
  resetRequestRateLimitedException,
  resetOtpInvalidException,
} from './project-security.constants';

@Injectable()
export class ProjectResetService {
  constructor(private readonly prisma: PrismaService) {}

  async createResetOtp(projectId: string, now = new Date()) {
    await this.assertResetRequestAllowed(projectId, now);

    const otp = this.generateOtp();
    const otpHash = this.hashOtp(otp);
    const expiresAt = new Date(now.getTime() + PROJECT_PASSWORD_RESET_OTP_TTL_MS);

    await this.prisma.$transaction([
      this.prisma.projectPasswordResetToken.updateMany({
        where: { projectId, usedAt: null },
        data: { usedAt: now },
      }),
      this.prisma.projectPasswordResetToken.create({
        data: { projectId, tokenHash: otpHash, expiresAt },
        select: { id: true },
      }),
    ]);

    return { otp, otpHash, expiresAt };
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

  async findValidResetOtp(otp: string, now = new Date()) {
    const otpHash = this.hashOtp(otp);

    const stored = await this.prisma.projectPasswordResetToken.findFirst({
      where: {
        tokenHash: otpHash,
        usedAt: null,
        expiresAt: { gt: now },
        project: { deletedAt: null },
      },
      select: { id: true, projectId: true },
    });

    if (!stored) throw resetOtpInvalidException();
    return stored;
  }

  async consumeResetOtp(otp: string, now = new Date()) {
    const stored = await this.findValidResetOtp(otp, now);

    await this.prisma.projectPasswordResetToken.update({
      where: { id: stored.id },
      data: { usedAt: now },
    });

    return stored;
  }

  generateOtp(): string {
    return randomInt(100000, 1000000).toString();
  }

  hashOtp(otp: string): string {
    return createHash('sha256').update(otp).digest('hex');
  }

  async pruneExpiredResetTokens(now = new Date()): Promise<number> {
    const usedTokenCutoff = new Date(
      now.getTime() - PROJECT_PASSWORD_RESET_OTP_USED_RETENTION_MS,
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
