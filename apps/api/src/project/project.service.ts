import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@app/database';
import type { Prisma, Role } from '@app/database/generated/prisma/client';
import type { CreateProjectDto } from './dto/create-project.dto';
import type { UpdateProjectDto } from './dto/update-project.dto';
import {
  DEFAULT_STATUSES,
  OWNER_ONLY,
  PROJECT_ALREADY_ARCHIVED,
  PROJECT_NOT_FOUND,
  PROJECT_NOT_ARCHIVED,
  PROJECT_PREFIX_TAKEN,
  PROJECT_SELECT,
  PROJECT_WITH_STATUSES_SELECT,
} from './project.constants';
import { FavoritesService } from '../favorites/favorites.service';
import { ProjectSecurityService } from '../project-security/project-security.service';

export type ProjectData = Prisma.ProjectGetPayload<{ select: typeof PROJECT_SELECT }>;
type RawProjectWithDetails = Prisma.ProjectGetPayload<{ select: typeof PROJECT_WITH_STATUSES_SELECT }>;
type RawProjectWithSecurity = RawProjectWithDetails & {
  passwordHash: string | null;
  passwordUpdatedAt: Date | null;
};
export type ProjectWithDetails = RawProjectWithDetails & { isFavorite: boolean };
export type LockedProjectListItem = {
  id: string;
  workspaceId: string;
  locked: true;
  isFavorite: boolean;
  favoritedAt?: Date;
};
export type ProjectListItem =
  | (ProjectWithDetails & {
      locked: false;
      passwordUpdatedAt: Date | null;
      favoritedAt?: Date;
    })
  | LockedProjectListItem;

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
        },
        select: PROJECT_SELECT,
      });

      await tx.status.createMany({
        data: DEFAULT_STATUSES.map((s) => ({ ...s, projectId: project.id })),
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
      },
      select: {
        ...PROJECT_WITH_STATUSES_SELECT,
        passwordHash: true,
        passwordUpdatedAt: true,
      },
      orderBy: { createdAt: 'asc' },
    });
    return this.applyProjectVisibility(userId, await this.withFavoriteState(userId, projects));
  }

  async findArchived(workspaceId: string, userId: string): Promise<ProjectListItem[]> {
    const projects = await this.prisma.project.findMany({
      where: { workspaceId, deletedAt: null, isArchived: true },
      select: {
        ...PROJECT_WITH_STATUSES_SELECT,
        passwordHash: true,
        passwordUpdatedAt: true,
      },
      orderBy: { updatedAt: 'desc' },
    });
    return this.applyProjectVisibility(userId, await this.withFavoriteState(userId, projects));
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

  private async applyProjectVisibility(
    userId: string,
    projects: Array<RawProjectWithSecurity & { isFavorite: boolean; favoritedAt?: Date }>,
  ): Promise<ProjectListItem[]> {
    const lockedProjectIds = projects
      .filter((project) => Boolean(project.passwordHash))
      .map((project) => project.id);
    const unlockedProjectIds = await this.projectSecurity.activeUnlockedProjectIds(
      lockedProjectIds,
      userId,
    );

    return projects.map((project) => {
      const { passwordHash, ...safeProject } = project;
      const isLockedForUser = Boolean(passwordHash) && !unlockedProjectIds.has(project.id);

      if (isLockedForUser) {
        return {
          id: project.id,
          workspaceId: project.workspaceId,
          locked: true,
          isFavorite: project.isFavorite,
          ...(project.favoritedAt ? { favoritedAt: project.favoritedAt } : {}),
        };
      }

      return {
        ...safeProject,
        locked: false,
      };
    });
  }
}
