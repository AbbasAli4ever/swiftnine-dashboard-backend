import { Injectable } from '@nestjs/common';
import { PrismaService } from '@app/database';
import type { Role } from '@app/database/generated/prisma/client';
import {
  PROJECT_SECURITY_PROJECT_SELECT,
  type ProjectSecurityProject,
  projectLockedException,
  projectNotFoundException,
  projectPasswordManagerOnlyException,
} from './project-security.constants';
import { ProjectUnlockService } from './project-unlock.service';

@Injectable()
export class ProjectSecurityService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly unlocks: ProjectUnlockService,
  ) {}

  async findProjectOrThrow(
    workspaceId: string,
    projectId: string,
  ): Promise<ProjectSecurityProject> {
    const project = await this.prisma.project.findFirst({
      where: { id: projectId, workspaceId, deletedAt: null },
      select: PROJECT_SECURITY_PROJECT_SELECT,
    });

    if (!project) throw projectNotFoundException();
    return project;
  }

  isProjectLocked(project: Pick<ProjectSecurityProject, 'passwordHash'>): boolean {
    return Boolean(project.passwordHash);
  }

  canManagePassword(
    project: Pick<ProjectSecurityProject, 'createdBy'>,
    actorUserId: string,
    actorRole: Role,
  ): boolean {
    return actorRole === 'OWNER' || project.createdBy === actorUserId;
  }

  async assertPasswordManager(
    workspaceId: string,
    projectId: string,
    actorUserId: string,
    actorRole: Role,
  ): Promise<ProjectSecurityProject> {
    const project = await this.findProjectOrThrow(workspaceId, projectId);

    if (!this.canManagePassword(project, actorUserId, actorRole)) {
      throw projectPasswordManagerOnlyException();
    }

    return project;
  }

  async getLockStatus(workspaceId: string, projectId: string, userId: string, now = new Date()) {
    const project = await this.findProjectOrThrow(workspaceId, projectId);
    const isLocked = this.isProjectLocked(project);
    const session = isLocked
      ? await this.unlocks.getActiveUnlockSession(project.id, userId, now)
      : null;

    return {
      projectId: project.id,
      isLocked,
      isUnlocked: !isLocked || Boolean(session),
      unlockedUntil: session?.expiresAt ?? null,
      passwordUpdatedAt: project.passwordUpdatedAt,
    };
  }

  async assertUnlocked(
    workspaceId: string,
    projectId: string,
    userId: string,
    now = new Date(),
  ): Promise<ProjectSecurityProject> {
    const project = await this.findProjectOrThrow(workspaceId, projectId);

    if (!this.isProjectLocked(project)) return project;

    const isUnlocked = await this.unlocks.hasActiveUnlock(project.id, userId, now);
    if (!isUnlocked) throw projectLockedException();

    return project;
  }

  async activeUnlockedProjectIds(
    projectIds: string[],
    userId: string,
    now = new Date(),
  ): Promise<Set<string>> {
    return this.unlocks.activeUnlockedProjectIds(projectIds, userId, now);
  }

  async activeUnlockedWorkspaceProjectIds(
    workspaceId: string,
    userId: string,
    now = new Date(),
  ): Promise<Set<string>> {
    return this.unlocks.activeUnlockedWorkspaceProjectIds(workspaceId, userId, now);
  }
}
