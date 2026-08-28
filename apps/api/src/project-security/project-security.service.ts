import { Injectable } from '@nestjs/common';
import { PrismaService } from '@app/database';
import type { ProjectVisibility } from '@app/database/generated/prisma/client';
import {
  PROJECT_SECURITY_PROJECT_SELECT,
  type ProjectSecurityProject,
  projectNotFoundException,
  userNotProjectMemberException,
} from './project-security.constants';

@Injectable()
export class ProjectSecurityService {
  constructor(private readonly prisma: PrismaService) {}

  // The single choke point for "can userId see this project at all" — every
  // caller across the app that needs to gate access to a project (or
  // anything scoped under one) routes through here, directly or via
  // ProjectUnlockedGuard. A PRIVATE project a caller isn't a ProjectMember
  // of throws the exact same "not found" as a genuinely missing project —
  // existence itself isn't leaked.
  //
  // Formerly also checked a password/unlock-session lock on top of this —
  // that feature was removed (superseded by PRIVATE visibility, which
  // already restricts to invited members). The method name and the guard
  // that calls it ("assertUnlocked" / ProjectUnlockedGuard) are kept as-is
  // rather than renamed across the ~20 unrelated modules that call them
  // (activity, chat, docs, comments, time-entry, notifications, status,
  // attachments, ...) purely for this project's own visibility check.
  async findProjectOrThrow(
    workspaceId: string,
    projectId: string,
    userId: string,
  ): Promise<ProjectSecurityProject> {
    const project = await this.prisma.project.findFirst({
      where: { id: projectId, workspaceId, deletedAt: null },
      select: PROJECT_SECURITY_PROJECT_SELECT,
    });

    if (!project) throw projectNotFoundException();

    if (project.visibility === 'PRIVATE') {
      const membership = await this.prisma.projectMember.findUnique({
        where: { projectId_userId: { projectId, userId } },
      });
      if (!membership) throw projectNotFoundException();
    }

    return project;
  }

  // For assignee validation: a PUBLIC project accepts any workspace member
  // (caller already checked that separately); a PRIVATE project narrows the
  // candidate pool to its own ProjectMember rows.
  async assertUsersCanAccessProject(
    projectId: string,
    visibility: ProjectVisibility,
    userIds: string[],
  ): Promise<void> {
    if (visibility !== 'PRIVATE') return;

    const members = await this.prisma.projectMember.findMany({
      where: { projectId, userId: { in: userIds } },
      select: { userId: true },
    });
    if (members.length !== userIds.length) {
      throw userNotProjectMemberException();
    }
  }

  // Kept as a thin passthrough for the same reason as findProjectOrThrow —
  // dozens of unrelated call sites just need "can I proceed with this
  // project," and no longer care about the lock state the name once
  // implied.
  async assertUnlocked(
    workspaceId: string,
    projectId: string,
    userId: string,
  ): Promise<ProjectSecurityProject> {
    return this.findProjectOrThrow(workspaceId, projectId, userId);
  }

  // Of the given project ids, which can userId currently see? Every id is
  // either PUBLIC (always accessible) or PRIVATE (accessible only if
  // userId has a ProjectMember row). Used by list/feed-style consumers
  // (activity, chat, docs, notifications, favorites, ...) to filter or mask
  // a batch of projects in one query instead of one findProjectOrThrow per
  // item.
  async activeUnlockedProjectIds(
    projectIds: string[],
    userId: string,
  ): Promise<Set<string>> {
    if (projectIds.length === 0) return new Set<string>();

    const projects = await this.prisma.project.findMany({
      where: { id: { in: projectIds }, deletedAt: null },
      select: { id: true, visibility: true },
    });

    return this.accessibleIds(projects, userId);
  }

  // Same as above, scoped to every project in a workspace rather than a
  // specific list of ids.
  async activeUnlockedWorkspaceProjectIds(
    workspaceId: string,
    userId: string,
  ): Promise<Set<string>> {
    const projects = await this.prisma.project.findMany({
      where: { workspaceId, deletedAt: null },
      select: { id: true, visibility: true },
    });

    return this.accessibleIds(projects, userId);
  }

  private async accessibleIds(
    projects: { id: string; visibility: ProjectVisibility }[],
    userId: string,
  ): Promise<Set<string>> {
    const publicIds = projects
      .filter((p) => p.visibility === 'PUBLIC')
      .map((p) => p.id);
    const privateIds = projects
      .filter((p) => p.visibility === 'PRIVATE')
      .map((p) => p.id);

    if (privateIds.length === 0) return new Set(publicIds);

    const memberships = await this.prisma.projectMember.findMany({
      where: { projectId: { in: privateIds }, userId },
      select: { projectId: true },
    });

    return new Set([...publicIds, ...memberships.map((m) => m.projectId)]);
  }
}
