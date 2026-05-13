import { Injectable } from '@nestjs/common';
import { PrismaService } from '@app/database';
import { EmailService } from '@app/common';
import type { Prisma, Role } from '@app/database/generated/prisma/client';
import * as bcrypt from 'bcrypt';
import {
  PROJECT_PASSWORD_PATTERN,
  PROJECT_PASSWORD_SALT_ROUNDS,
  invalidPasswordException,
  invalidPasswordFormatException,
  passwordAlreadySetException,
  projectPasswordNotSetException,
  resetTokenInvalidException,
  tooManyAttemptsException,
} from './project-security.constants';
import { ProjectSecurityService } from './project-security.service';
import { ProjectResetService } from './project-reset.service';
import { ProjectRealtimeLockService } from './project-realtime-lock.service';
import { ProjectUnlockService } from './project-unlock.service';

@Injectable()
export class ProjectPasswordService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly security: ProjectSecurityService,
    private readonly unlocks: ProjectUnlockService,
    private readonly resets: ProjectResetService,
    private readonly realtimeLocks: ProjectRealtimeLockService,
    private readonly email: EmailService,
  ) {}

  assertPasswordFormat(password: string): void {
    if (!PROJECT_PASSWORD_PATTERN.test(password)) {
      throw invalidPasswordFormatException();
    }
  }

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, PROJECT_PASSWORD_SALT_ROUNDS);
  }

  async comparePassword(password: string, passwordHash: string): Promise<boolean> {
    return bcrypt.compare(password, passwordHash);
  }

  private projectPasswordActivityInput(params: {
    workspaceId: string;
    projectId: string;
    projectName: string;
    action: string;
    performedBy: string;
    oldValue?: string | null;
    newValue?: string | null;
  }): Prisma.ActivityLogCreateManyInput {
    return {
      workspaceId: params.workspaceId,
      entityType: 'project',
      entityId: params.projectId,
      action: params.action,
      performedBy: params.performedBy,
      fieldName: 'password',
      oldValue: params.oldValue,
      newValue: params.newValue,
      metadata: {
        projectName: params.projectName,
        securityEvent: true,
      },
    };
  }

  async setPassword(
    workspaceId: string,
    projectId: string,
    actorUserId: string,
    actorRole: Role,
    password: string,
  ) {
    this.assertPasswordFormat(password);

    const project = await this.security.assertPasswordManager(
      workspaceId,
      projectId,
      actorUserId,
      actorRole,
    );

    if (project.passwordHash) throw passwordAlreadySetException();

    const passwordHash = await this.hashPassword(password);
    const passwordUpdatedAt = new Date();

    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.project.update({
        where: { id: project.id },
        data: {
          passwordHash,
          passwordSetBy: actorUserId,
          passwordUpdatedAt,
        },
        select: {
          id: true,
          workspaceId: true,
          passwordUpdatedAt: true,
        },
      });

      await tx.activityLog.create({
        data: this.projectPasswordActivityInput({
          workspaceId: project.workspaceId,
          projectId: project.id,
          projectName: project.name,
          action: 'project_password_set',
          performedBy: actorUserId,
          oldValue: 'disabled',
          newValue: 'enabled',
        }),
      });

      return updated;
    });
  }

  async changePassword(
    workspaceId: string,
    projectId: string,
    actorUserId: string,
    actorRole: Role,
    currentPassword: string,
    newPassword: string,
  ) {
    this.assertPasswordFormat(newPassword);

    const project = await this.security.assertPasswordManager(
      workspaceId,
      projectId,
      actorUserId,
      actorRole,
    );

    if (!project.passwordHash) throw projectPasswordNotSetException();

    const isCurrentPasswordValid = await this.comparePassword(
      currentPassword,
      project.passwordHash,
    );
    if (!isCurrentPasswordValid) throw invalidPasswordException();

    const passwordHash = await this.hashPassword(newPassword);
    const passwordUpdatedAt = new Date();

    const updated = await this.prisma.$transaction(async (tx) => {
      const updated = await tx.project.update({
        where: { id: project.id },
        data: {
          passwordHash,
          passwordSetBy: actorUserId,
          passwordUpdatedAt,
        },
        select: {
          id: true,
          workspaceId: true,
          passwordUpdatedAt: true,
        },
      });

      await tx.projectUnlockSession.deleteMany({ where: { projectId: project.id } });

      await tx.activityLog.create({
        data: this.projectPasswordActivityInput({
          workspaceId: project.workspaceId,
          projectId: project.id,
          projectName: project.name,
          action: 'project_password_changed',
          performedBy: actorUserId,
          oldValue: 'enabled',
          newValue: 'enabled',
        }),
      });

      return updated;
    });

    this.realtimeLocks.emitLockChanged({
      projectId: project.id,
      reason: 'password_changed',
    });

    return updated;
  }

  async removePassword(
    workspaceId: string,
    projectId: string,
    actorUserId: string,
    actorRole: Role,
  ): Promise<void> {
    const project = await this.security.assertPasswordManager(
      workspaceId,
      projectId,
      actorUserId,
      actorRole,
    );

    if (!project.passwordHash) throw projectPasswordNotSetException();

    await this.prisma.$transaction(async (tx) => {
      await tx.project.update({
        where: { id: project.id },
        data: {
          passwordHash: null,
          passwordSetBy: null,
          passwordUpdatedAt: null,
        },
      });

      await tx.projectUnlockSession.deleteMany({ where: { projectId: project.id } });
      await tx.projectUnlockAttempt.deleteMany({ where: { projectId: project.id } });
      await tx.projectPasswordResetToken.deleteMany({ where: { projectId: project.id } });

      await tx.activityLog.create({
        data: this.projectPasswordActivityInput({
          workspaceId: project.workspaceId,
          projectId: project.id,
          projectName: project.name,
          action: 'project_password_removed',
          performedBy: actorUserId,
          oldValue: 'enabled',
          newValue: 'disabled',
        }),
      });
    });

    this.realtimeLocks.emitLockChanged({
      projectId: project.id,
      reason: 'password_removed',
    });
  }

  async invalidateUnlockSessions(projectId: string): Promise<number> {
    return this.unlocks.invalidateUnlockSessions(projectId);
  }

  async unlockProject(
    workspaceId: string,
    projectId: string,
    userId: string,
    password: string,
    now = new Date(),
  ) {
    const project = await this.security.findProjectOrThrow(workspaceId, projectId);
    if (!project.passwordHash) {
      return {
        projectId: project.id,
        isLocked: false,
        unlockedUntil: null,
      };
    }

    await this.unlocks.assertNotLockedOut(project.id, userId, now);

    const isPasswordValid = await this.comparePassword(password, project.passwordHash);

    if (!isPasswordValid) {
      const attempt = await this.unlocks.recordFailedAttempt(project.id, userId, now);
      if (attempt.lockedUntil && attempt.lockedUntil > now) {
        throw tooManyAttemptsException();
      }
      throw invalidPasswordException();
    }

    const session = await this.unlocks.createUnlockSession(project.id, userId, now);

    return {
      projectId: project.id,
      isLocked: true,
      unlockedUntil: session.expiresAt,
    };
  }

  async requestPasswordReset(
    workspaceId: string,
    projectId: string,
    actorUserId: string,
    actorRole: Role,
  ): Promise<void> {
    const project = await this.security.assertPasswordManager(
      workspaceId,
      projectId,
      actorUserId,
      actorRole,
    );

    if (!project.passwordHash) throw projectPasswordNotSetException();

    const projectOwner = await this.prisma.user.findFirst({
      where: { id: project.createdBy, deletedAt: null },
      select: { email: true, fullName: true },
    });

    if (!projectOwner) return;

    const { token, tokenHash } = await this.resets.createResetToken(project.id);
    const frontendUrl = process.env['FRONTEND_URL'] ?? 'http://localhost:3000';
    const resetUrl = `${frontendUrl}/projects/${project.id}/password/reset?token=${token}`;

    try {
      await this.email.sendProjectPasswordResetEmail(
        projectOwner.email,
        projectOwner.fullName,
        project.name,
        resetUrl,
      );
    } catch (error) {
      await this.prisma.projectPasswordResetToken.updateMany({
        where: { projectId: project.id, tokenHash, usedAt: null },
        data: { usedAt: new Date() },
      });
      throw error;
    }

    await this.prisma.activityLog.create({
      data: this.projectPasswordActivityInput({
        workspaceId: project.workspaceId,
        projectId: project.id,
        projectName: project.name,
        action: 'project_password_reset_requested',
        performedBy: actorUserId,
        oldValue: 'enabled',
        newValue: 'reset_requested',
      }),
    });
  }

  async resetPasswordWithToken(
    projectId: string,
    token: string,
    newPassword: string,
    actorUserId?: string,
  ) {
    this.assertPasswordFormat(newPassword);

    const stored = await this.resets.findValidResetToken(token);
    if (stored.projectId !== projectId) {
      throw resetTokenInvalidException();
    }

    const passwordHash = await this.hashPassword(newPassword);
    const passwordUpdatedAt = new Date();

    const result = await this.prisma.$transaction(async (tx) => {
      const updatedProject = await tx.project.update({
        where: { id: stored.projectId },
        data: {
          passwordHash,
          passwordUpdatedAt,
        },
        select: {
          id: true,
          workspaceId: true,
          name: true,
          createdBy: true,
        },
      });

      await tx.projectPasswordResetToken.update({
        where: { id: stored.id },
        data: { usedAt: passwordUpdatedAt },
      });

      await tx.projectUnlockSession.deleteMany({
        where: { projectId: stored.projectId },
      });

      await tx.projectUnlockAttempt.deleteMany({
        where: { projectId: stored.projectId },
      });

      await tx.activityLog.create({
        data: this.projectPasswordActivityInput({
          workspaceId: updatedProject.workspaceId,
          projectId: updatedProject.id,
          projectName: updatedProject.name,
          action: 'project_password_reset_completed',
          performedBy: actorUserId ?? updatedProject.createdBy,
          oldValue: 'reset_requested',
          newValue: 'enabled',
        }),
      });

      return {
        projectId: stored.projectId,
        passwordUpdatedAt,
      };
    });

    this.realtimeLocks.emitLockChanged({
      projectId: stored.projectId,
      reason: 'password_reset',
    });

    return result;
  }
}
