import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@app/database';
import type {
  Prisma,
  ProjectVisibility,
  Role,
} from '@app/database/generated/prisma/client';
import type { CreateProjectDto } from './dto/create-project.dto';
import type { UpdateProjectDto } from './dto/update-project.dto';
import {
  DEFAULT_STATUSES,
  OWNER_ONLY,
  PROJECT_ALREADY_ARCHIVED,
  PROJECT_CANNOT_INVITE_TO_PUBLIC,
  PROJECT_CANNOT_REMOVE_CREATOR,
  PROJECT_MEMBER_ALREADY_INVITED,
  PROJECT_MEMBER_NOT_FOUND,
  PROJECT_MEMBER_NOT_WORKSPACE_MEMBER,
  PROJECT_MEMBER_SELECT,
  PROJECT_NOT_FOUND,
  PROJECT_NOT_ARCHIVED,
  PROJECT_PREFIX_TAKEN,
  PROJECT_SELECT,
  PROJECT_VISIBILITY_MANAGER_ONLY,
  PROJECT_WITH_STATUSES_SELECT,
} from './project.constants';
import { FavoritesService } from '../favorites/favorites.service';
import { ProjectSecurityService } from '../project-security/project-security.service';

export type ProjectData = Prisma.ProjectGetPayload<{ select: typeof PROJECT_SELECT }>;
type RawProjectWithDetails = Prisma.ProjectGetPayload<{ select: typeof PROJECT_WITH_STATUSES_SELECT }>;
export type ProjectWithDetails = RawProjectWithDetails & { isFavorite: boolean };
export type ProjectListItem = ProjectWithDetails & { favoritedAt?: Date };

export type BatchInviteProjectMemberResult = {
  userId: string;
  status: 'invited' | 'already_member' | 'failed';
  message: string | null;
};
export type BatchInviteProjectMembersResult = {
  results: BatchInviteProjectMemberResult[];
  summary: {
    total: number;
    invited: number;
    alreadyMember: number;
    failed: number;
  };
};

export type ProjectMemberCandidate = {
  id: string;
  fullName: string;
  email: string;
  avatarUrl: string | null;
  avatarColor: string;
  isProjectMember: boolean;
  isCreator: boolean;
};

@Injectable()
export class ProjectService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly projectSecurity: ProjectSecurityService,
    private readonly favorites?: FavoritesService,
  ) {}

  async create(workspaceId: string, userId: string, dto: CreateProjectDto): Promise<ProjectWithDetails> {
    const prefixTaken = await this.prisma.project.findFirst({
      where: { workspaceId, taskIdPrefix: dto.taskIdPrefix, deletedAt: null },
      select: { id: true },
    });
    if (prefixTaken) throw new ConflictException(PROJECT_PREFIX_TAKEN);

    return this.prisma.$transaction(async (tx) => {
      const project = await tx.project.create({
        data: {
          workspaceId,
          name: dto.name.trim(),
          description: dto.description?.trim() ?? null,
          color: dto.color,
          icon: dto.icon ?? null,
          taskIdPrefix: dto.taskIdPrefix,
          createdBy: userId,
          visibility: dto.visibility,
        },
        select: PROJECT_SELECT,
      });

      await tx.status.createMany({
        data: DEFAULT_STATUSES.map((s) => ({ ...s, projectId: project.id })),
      });

      // The creator is always a member of their own project — self-invited,
      // at creation. This is what makes "can this user see the project"
      // always the same one check (ProjectMember) instead of a special
      // creator case scattered across every consumer.
      await tx.projectMember.create({
        data: { projectId: project.id, userId, invitedBy: userId },
      });

      await tx.activityLog.create({
        data: {
          workspaceId,
          entityType: 'project',
          entityId: project.id,
          action: 'created',
          metadata: { projectName: project.name },
          performedBy: userId,
        },
      });

      const created = await tx.project.findFirstOrThrow({
        where: { id: project.id },
        select: PROJECT_WITH_STATUSES_SELECT,
      });

      return { ...created, isFavorite: false };
    });
  }

  async findAll(
    workspaceId: string,
    userId: string,
    includeArchived = false,
  ): Promise<ProjectListItem[]> {
    const projects = await this.prisma.project.findMany({
      where: {
        workspaceId,
        deletedAt: null,
        ...(includeArchived ? {} : { isArchived: false }),
        ...this.visibleToUserFilter(userId),
      },
      select: PROJECT_WITH_STATUSES_SELECT,
      orderBy: { createdAt: 'asc' },
    });
    return this.withFavoriteState(userId, projects);
  }

  async findArchived(workspaceId: string, userId: string): Promise<ProjectListItem[]> {
    const projects = await this.prisma.project.findMany({
      where: {
        workspaceId,
        deletedAt: null,
        isArchived: true,
        ...this.visibleToUserFilter(userId),
      },
      select: PROJECT_WITH_STATUSES_SELECT,
      orderBy: { updatedAt: 'desc' },
    });
    return this.withFavoriteState(userId, projects);
  }

  // A PRIVATE project the caller isn't a ProjectMember of is excluded from
  // the query entirely — it doesn't appear in the list at all.
  private visibleToUserFilter(userId: string): Prisma.ProjectWhereInput {
    return {
      OR: [
        { visibility: 'PUBLIC' },
        { visibility: 'PRIVATE', members: { some: { userId } } },
      ],
    };
  }

  async findOne(workspaceId: string, userId: string, projectId: string): Promise<ProjectWithDetails> {
    await this.projectSecurity.assertUnlocked(workspaceId, projectId, userId);

    const project = await this.prisma.project.findFirst({
      where: { id: projectId, workspaceId, deletedAt: null },
      select: PROJECT_WITH_STATUSES_SELECT,
    });
    if (!project) throw new NotFoundException(PROJECT_NOT_FOUND);
    return this.withFavoriteState(userId, project);
  }

  async update(
    workspaceId: string,
    projectId: string,
    userId: string,
    dto: UpdateProjectDto,
  ): Promise<ProjectWithDetails> {
    await this.projectSecurity.assertUnlocked(workspaceId, projectId, userId);

    const project = await this.prisma.project.findFirst({
      where: { id: projectId, workspaceId, deletedAt: null },
      select: PROJECT_SELECT,
    });
    if (!project) throw new NotFoundException(PROJECT_NOT_FOUND);

    const updateData: Prisma.ProjectUpdateInput = {};
    const logEntries: Array<{ fieldName: string; oldValue: string | null; newValue: string | null }> = [];

    if (dto.name !== undefined && dto.name !== project.name) {
      updateData.name = dto.name.trim();
      logEntries.push({ fieldName: 'name', oldValue: project.name, newValue: dto.name.trim() });
    }
    if (dto.description !== undefined && dto.description !== project.description) {
      updateData.description = dto.description;
      logEntries.push({ fieldName: 'description', oldValue: project.description ?? null, newValue: dto.description ?? null });
    }
    if (dto.color !== undefined && dto.color !== project.color) {
      updateData.color = dto.color;
      logEntries.push({ fieldName: 'color', oldValue: project.color, newValue: dto.color });
    }
    if (dto.icon !== undefined && dto.icon !== project.icon) {
      updateData.icon = dto.icon;
      logEntries.push({ fieldName: 'icon', oldValue: project.icon ?? null, newValue: dto.icon ?? null });
    }

    if (Object.keys(updateData).length === 0) {
      return this.findOne(workspaceId, userId, projectId);
    }

    await this.prisma.project.update({
      where: { id: projectId },
      data: updateData,
    });

    if (logEntries.length > 0) {
      await this.prisma.activityLog.createMany({
        data: logEntries.map((entry) => ({
          workspaceId,
          entityType: 'project',
          entityId: projectId,
          action: 'updated',
          fieldName: entry.fieldName,
          oldValue: entry.oldValue,
          newValue: entry.newValue,
          metadata: { projectName: updateData.name ?? project.name },
          performedBy: userId,
        })),
      });
    }

    return this.findOne(workspaceId, userId, projectId);
  }

  async archive(
    workspaceId: string,
    projectId: string,
    userId: string,
    role: Role,
  ): Promise<ProjectWithDetails> {
    this.assertCanArchive(role);
    await this.projectSecurity.assertUnlocked(workspaceId, projectId, userId);

    const project = await this.prisma.project.findFirst({
      where: { id: projectId, workspaceId, deletedAt: null },
      select: { id: true, name: true, isArchived: true },
    });
    if (!project) throw new NotFoundException(PROJECT_NOT_FOUND);
    if (project.isArchived) throw new BadRequestException(PROJECT_ALREADY_ARCHIVED);

    await this.prisma.$transaction(async (tx) => {
      await tx.project.update({
        where: { id: projectId },
        data: { isArchived: true },
      });

      await tx.activityLog.create({
        data: {
          workspaceId,
          entityType: 'project',
          entityId: projectId,
          action: 'archived',
          metadata: { projectName: project.name },
          performedBy: userId,
        },
      });
    });

    return this.findOne(workspaceId, userId, projectId);
  }

  async restore(
    workspaceId: string,
    projectId: string,
    userId: string,
    role: Role,
  ): Promise<ProjectWithDetails> {
    this.assertCanArchive(role);
    await this.projectSecurity.assertUnlocked(workspaceId, projectId, userId);

    const project = await this.prisma.project.findFirst({
      where: { id: projectId, workspaceId, deletedAt: null },
      select: { id: true, name: true, isArchived: true },
    });
    if (!project) throw new NotFoundException(PROJECT_NOT_FOUND);
    if (!project.isArchived) throw new BadRequestException(PROJECT_NOT_ARCHIVED);

    await this.prisma.$transaction(async (tx) => {
      await tx.project.update({
        where: { id: projectId },
        data: { isArchived: false },
      });

      await tx.activityLog.create({
        data: {
          workspaceId,
          entityType: 'project',
          entityId: projectId,
          action: 'restored',
          metadata: { projectName: project.name },
          performedBy: userId,
        },
      });
    });

    return this.findOne(workspaceId, userId, projectId);
  }

  async remove(workspaceId: string, projectId: string, userId: string, role: Role): Promise<void> {
    if (role !== 'OWNER') throw new ForbiddenException(OWNER_ONLY);
    await this.projectSecurity.assertUnlocked(workspaceId, projectId, userId);

    const project = await this.prisma.project.findFirst({
      where: { id: projectId, workspaceId, deletedAt: null },
      select: { id: true, name: true },
    });
    if (!project) throw new NotFoundException(PROJECT_NOT_FOUND);

    const now = new Date();

    await this.prisma.$transaction(async (tx) => {
      // Cascade soft delete project-owned records before hiding the project.
      const taskLists = await tx.taskList.findMany({
        where: { projectId, deletedAt: null },
        select: { id: true },
      });
      const listIds = taskLists.map((l) => l.id);

      if (listIds.length > 0) {
        await tx.task.updateMany({
          where: { listId: { in: listIds }, deletedAt: null },
          data: { deletedAt: now },
        });
      }

      await tx.taskList.updateMany({
        where: { projectId, deletedAt: null },
        data: { deletedAt: now },
      });

      await tx.status.updateMany({
        where: { projectId, deletedAt: null },
        data: { deletedAt: now },
      });

      await tx.attachment.updateMany({
        where: { projectId, deletedAt: null },
        data: { deletedAt: now },
      });

      await tx.project.update({
        where: { id: projectId },
        data: { deletedAt: now },
      });

      await tx.activityLog.create({
        data: {
          workspaceId,
          entityType: 'project',
          entityId: projectId,
          action: 'deleted',
          metadata: { projectName: project.name },
          performedBy: userId,
        },
      });
    });
  }

  // Creator-only, no OWNER override — the user explicitly wants visibility
  // control to stay with whoever created the private project, full stop.
  async updateVisibility(
    workspaceId: string,
    projectId: string,
    userId: string,
    visibility: ProjectVisibility,
  ): Promise<ProjectWithDetails> {
    await this.projectSecurity.assertUnlocked(workspaceId, projectId, userId);

    const project = await this.prisma.project.findFirst({
      where: { id: projectId, workspaceId, deletedAt: null },
      select: { id: true, name: true, createdBy: true, visibility: true },
    });
    if (!project) throw new NotFoundException(PROJECT_NOT_FOUND);
    if (project.createdBy !== userId) {
      throw new ForbiddenException(PROJECT_VISIBILITY_MANAGER_ONLY);
    }
    if (project.visibility === visibility) {
      return this.findOne(workspaceId, userId, projectId);
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.project.update({
        where: { id: projectId },
        data: { visibility },
      });

      if (visibility === 'PRIVATE') {
        // Grandfather in every current task assignee, and the creator
        // themselves, so nobody already doing work on this project silently
        // loses access to it. Including the creator unconditionally (not
        // just "if they don't already have a row") is deliberate: it makes
        // this call self-healing for any project whose creator is missing
        // a ProjectMember row for any reason (pre-existing project from
        // before this table existed, restored backup, data seeded outside
        // create()) — skipDuplicates makes the normal case a no-op and the
        // broken case a repair, so there's no assumption left to violate.
        const assignees = await tx.taskAssignee.findMany({
          where: { task: { deletedAt: null, list: { projectId } } },
          select: { userId: true },
          distinct: ['userId'],
        });
        const memberIds = new Set(assignees.map((a) => a.userId));
        memberIds.add(userId);

        await tx.projectMember.createMany({
          data: [...memberIds].map((memberUserId) => ({
            projectId,
            userId: memberUserId,
            invitedBy: userId,
          })),
          skipDuplicates: true,
        });
      }

      await tx.activityLog.create({
        data: {
          workspaceId,
          entityType: 'project',
          entityId: projectId,
          action: 'visibility_changed',
          fieldName: 'visibility',
          oldValue: project.visibility,
          newValue: visibility,
          metadata: { projectName: project.name },
          performedBy: userId,
        },
      });
    });

    return this.findOne(workspaceId, userId, projectId);
  }

  async listMembers(workspaceId: string, projectId: string, userId: string) {
    // assertUnlocked already enforces "can this user view the project" —
    // PRIVATE + not-a-member throws 404 here too, same as everywhere else.
    await this.projectSecurity.assertUnlocked(workspaceId, projectId, userId);

    return this.prisma.projectMember.findMany({
      where: { projectId },
      select: PROJECT_MEMBER_SELECT,
      orderBy: { createdAt: 'asc' },
    });
  }

  async inviteMember(
    workspaceId: string,
    projectId: string,
    userId: string,
    targetUserId: string,
  ): Promise<void> {
    await this.assertCanManageInvites(workspaceId, projectId, userId);

    const workspaceMember = await this.prisma.workspaceMember.findFirst({
      where: { workspaceId, userId: targetUserId, deletedAt: null },
      select: { id: true },
    });
    if (!workspaceMember) {
      throw new BadRequestException(PROJECT_MEMBER_NOT_WORKSPACE_MEMBER);
    }

    const existing = await this.prisma.projectMember.findUnique({
      where: { projectId_userId: { projectId, userId: targetUserId } },
    });
    if (existing) throw new ConflictException(PROJECT_MEMBER_ALREADY_INVITED);

    await this.prisma.projectMember.create({
      data: { projectId, userId: targetUserId, invitedBy: userId },
    });

    await this.prisma.activityLog.create({
      data: {
        workspaceId,
        entityType: 'project',
        entityId: projectId,
        action: 'member_invited',
        metadata: { invitedUserId: targetUserId },
        performedBy: userId,
      },
    });
  }

  // Same rules as inviteMember, applied to each id independently — one bad
  // id in the batch (not a workspace member, already invited) doesn't fail
  // the rest. Mirrors WorkspaceService.addMembersByUserIds's per-item
  // results/summary shape.
  async inviteMembersBatch(
    workspaceId: string,
    projectId: string,
    userId: string,
    targetUserIds: string[],
  ): Promise<BatchInviteProjectMembersResult> {
    await this.assertCanManageInvites(workspaceId, projectId, userId);

    const uniqueIds = [...new Set(targetUserIds.map((id) => id.trim()))];
    const results: BatchInviteProjectMemberResult[] = [];

    for (const targetUserId of uniqueIds) {
      try {
        const workspaceMember = await this.prisma.workspaceMember.findFirst({
          where: { workspaceId, userId: targetUserId, deletedAt: null },
          select: { id: true },
        });
        if (!workspaceMember) {
          results.push({
            userId: targetUserId,
            status: 'failed',
            message: PROJECT_MEMBER_NOT_WORKSPACE_MEMBER,
          });
          continue;
        }

        const existing = await this.prisma.projectMember.findUnique({
          where: { projectId_userId: { projectId, userId: targetUserId } },
        });
        if (existing) {
          results.push({
            userId: targetUserId,
            status: 'already_member',
            message: null,
          });
          continue;
        }

        await this.prisma.$transaction([
          this.prisma.projectMember.create({
            data: { projectId, userId: targetUserId, invitedBy: userId },
          }),
          this.prisma.activityLog.create({
            data: {
              workspaceId,
              entityType: 'project',
              entityId: projectId,
              action: 'member_invited',
              metadata: { invitedUserId: targetUserId },
              performedBy: userId,
            },
          }),
        ]);

        results.push({
          userId: targetUserId,
          status: 'invited',
          message: null,
        });
      } catch (err) {
        results.push({
          userId: targetUserId,
          status: 'failed',
          message: err instanceof Error ? err.message : 'Unknown error',
        });
      }
    }

    return {
      results,
      summary: {
        total: results.length,
        invited: results.filter((r) => r.status === 'invited').length,
        alreadyMember: results.filter((r) => r.status === 'already_member')
          .length,
        failed: results.filter((r) => r.status === 'failed').length,
      },
    };
  }

  // Every workspace member, annotated with whether they already have access
  // to this project — for building an invite picker in one call instead of
  // the frontend cross-referencing two separate lists. Creator-only, same
  // as every other project-membership-management action; not restricted to
  // PRIVATE projects (harmless to call on a PUBLIC one, just less useful).
  async listMemberCandidates(
    workspaceId: string,
    projectId: string,
    userId: string,
  ): Promise<ProjectMemberCandidate[]> {
    const project = await this.projectSecurity.assertUnlocked(
      workspaceId,
      projectId,
      userId,
    );
    if (project.createdBy !== userId) {
      throw new ForbiddenException(PROJECT_VISIBILITY_MANAGER_ONLY);
    }

    const [workspaceMembers, projectMembers] = await Promise.all([
      this.prisma.workspaceMember.findMany({
        where: { workspaceId, deletedAt: null },
        select: {
          user: {
            select: {
              id: true,
              fullName: true,
              email: true,
              avatarUrl: true,
              avatarColor: true,
            },
          },
        },
      }),
      this.prisma.projectMember.findMany({
        where: { projectId },
        select: { userId: true },
      }),
    ]);

    const memberIds = new Set(projectMembers.map((m) => m.userId));

    return workspaceMembers.map(({ user }) => ({
      ...user,
      isProjectMember: memberIds.has(user.id),
      isCreator: user.id === project.createdBy,
    }));
  }

  // assertUnlocked first — a non-member of a PRIVATE project must get the
  // same 404 a genuinely missing project would, before we ever reveal
  // whether they'd also fail the creator check. Checking createdBy first
  // (as inviteMember/removeMember/listMemberCandidates all originally did)
  // leaks existence via 403 instead.
  private async assertCanManageInvites(
    workspaceId: string,
    projectId: string,
    userId: string,
  ): Promise<{ id: string; createdBy: string; visibility: ProjectVisibility }> {
    const project = await this.projectSecurity.assertUnlocked(
      workspaceId,
      projectId,
      userId,
    );
    if (project.createdBy !== userId) {
      throw new ForbiddenException(PROJECT_VISIBILITY_MANAGER_ONLY);
    }
    if (project.visibility !== 'PRIVATE') {
      throw new BadRequestException(PROJECT_CANNOT_INVITE_TO_PUBLIC);
    }
    return project;
  }

  async removeMember(
    workspaceId: string,
    projectId: string,
    userId: string,
    targetUserId: string,
  ): Promise<void> {
    const project = await this.projectSecurity.assertUnlocked(
      workspaceId,
      projectId,
      userId,
    );
    if (project.createdBy !== userId) {
      throw new ForbiddenException(PROJECT_VISIBILITY_MANAGER_ONLY);
    }
    if (targetUserId === project.createdBy) {
      throw new BadRequestException(PROJECT_CANNOT_REMOVE_CREATOR);
    }

    const membership = await this.prisma.projectMember.findUnique({
      where: { projectId_userId: { projectId, userId: targetUserId } },
    });
    if (!membership) throw new NotFoundException(PROJECT_MEMBER_NOT_FOUND);

    await this.prisma.$transaction(async (tx) => {
      await tx.projectMember.delete({ where: { id: membership.id } });

      // A removed member can no longer open the project — leaving them as
      // a task assignee there would dangle a reference to something they
      // can't see any more.
      await tx.taskAssignee.deleteMany({
        where: { userId: targetUserId, task: { list: { projectId } } },
      });

      await tx.activityLog.create({
        data: {
          workspaceId,
          entityType: 'project',
          entityId: projectId,
          action: 'member_removed',
          metadata: { removedUserId: targetUserId },
          performedBy: userId,
        },
      });
    });
  }

  private assertCanArchive(role: Role) {
    if (role !== 'OWNER' && role !== 'ADMIN') {
      throw new ForbiddenException('Only workspace owners or admins can archive projects');
    }
  }

  private async withFavoriteState<T extends RawProjectWithDetails>(
    userId: string,
    project: T,
  ): Promise<T & { isFavorite: boolean }>;
  private async withFavoriteState<T extends RawProjectWithDetails>(
    userId: string,
    projects: T[],
  ): Promise<Array<T & { isFavorite: boolean }>>;
  private async withFavoriteState<T extends RawProjectWithDetails>(
    userId: string,
    input: T | T[],
  ): Promise<(T & { isFavorite: boolean }) | Array<T & { isFavorite: boolean }>> {
    const projects = Array.isArray(input) ? input : [input];
    const favoriteIds = this.favorites
      ? await this.favorites.projectFavoriteIds(
          userId,
          projects.map((project) => project.id),
        )
      : new Set<string>();
    const enriched = projects.map((project) => ({
      ...project,
      isFavorite: favoriteIds.has(project.id),
    }));
    return Array.isArray(input) ? enriched : enriched[0];
  }
}
