import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@app/database';
import type { Prisma } from '@app/database/generated/prisma/client';
import {
  ACTION_CATEGORY_MAP,
  DEFAULT_ACTIVITY_LIMIT,
  FIELD_CATEGORY_MAP,
  type ActivityCategory,
} from './activity.constants';
import type { ListActivityDto } from './dto/list-activity.dto';
import { ProjectSecurityService } from '../project-security/project-security.service';

type ActivityLogClient = Pick<PrismaService, 'activityLog'> | Prisma.TransactionClient;

type ActivityLogInput = {
  workspaceId: string;
  entityType: string;
  entityId: string;
  action: string;
  performedBy: string;
  fieldName?: string | null;
  oldValue?: unknown;
  newValue?: unknown;
  metadata?: Prisma.InputJsonValue;
};

const ACTIVITY_SELECT = {
  id: true,
  workspaceId: true,
  entityType: true,
  entityId: true,
  action: true,
  fieldName: true,
  oldValue: true,
  newValue: true,
  metadata: true,
  performedBy: true,
  createdAt: true,
  performer: {
    select: {
      id: true,
      fullName: true,
      email: true,
      avatarUrl: true,
      avatarColor: true,
    },
  },
} satisfies Prisma.ActivityLogSelect;

type RawActivity = Prisma.ActivityLogGetPayload<{ select: typeof ACTIVITY_SELECT }>;

export type ActivityFeedItem = {
  id: string;
  kind: 'activity' | 'comment';
  category: ActivityCategory | string;
  entityType: string;
  entityId: string;
  action: string;
  fieldName: string | null;
  oldValue: string | null;
  newValue: string | null;
  metadata: Record<string, unknown>;
  actor: RawActivity['performer'];
  displayText: string;
  createdAt: Date;
};

export type ActivityFeedResult = {
  items: ActivityFeedItem[];
  nextCursor: string | null;
};

@Injectable()
export class ActivityService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly projectSecurity: ProjectSecurityService,
  ) {}

  async log(input: ActivityLogInput, client: ActivityLogClient = this.prisma): Promise<void> {
    await client.activityLog.create({
      data: this.toCreateInput(input),
    });
  }

  async logMany(inputs: ActivityLogInput[], client: ActivityLogClient = this.prisma): Promise<void> {
    if (inputs.length === 0) return;

    await client.activityLog.createMany({
      data: inputs.map((input) => this.toCreateInput(input)),
    });
  }

  async listWorkspaceActivity(
    workspaceId: string,
    actorId: string,
    dto: ListActivityDto,
  ): Promise<ActivityFeedResult> {
    const limit = dto.limit ?? DEFAULT_ACTIVITY_LIMIT;
    const where = await this.buildWorkspaceWhere(workspaceId, actorId, dto);

    const rows = await this.prisma.activityLog.findMany({
      where,
      select: ACTIVITY_SELECT,
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      take: limit + 1,
      ...(dto.cursor ? { cursor: { id: dto.cursor }, skip: 1 } : {}),
    });

    return this.toFeedResult(rows, limit);
  }

  async listTaskActivity(
    workspaceId: string,
    taskId: string,
    actorId: string,
    dto: ListActivityDto,
  ): Promise<ActivityFeedResult> {
    const task = await this.prisma.task.findFirst({
      where: {
        id: taskId,
        deletedAt: null,
        list: { deletedAt: null, project: { workspaceId, deletedAt: null } },
      },
      select: { id: true, list: { select: { projectId: true } } },
    });

    if (!task) throw new NotFoundException('Task not found');
    await this.projectSecurity.assertUnlocked(workspaceId, task.list.projectId, actorId);

    const scopedIds = await this.getTaskRelatedActivityIds([taskId], dto.includeSubtasks ?? true);
    const baseWhere = this.buildBaseWhere(workspaceId, actorId, {
      ...dto,
      taskId: undefined,
      projectId: undefined,
      listId: undefined,
      entityType: undefined,
      entityId: undefined,
    });

    const where: Prisma.ActivityLogWhereInput = {
      AND: [
        baseWhere,
        {
          OR: [
            { entityType: 'task', entityId: { in: scopedIds.taskIds } },
            ...(scopedIds.commentIds.length
              ? [{ entityType: 'comment', entityId: { in: scopedIds.commentIds } }]
              : []),
            ...(scopedIds.attachmentIds.length
              ? [{ entityType: 'attachment', entityId: { in: scopedIds.attachmentIds } }]
              : []),
            ...(scopedIds.timeEntryIds.length
              ? [{ entityType: 'time_entry', entityId: { in: scopedIds.timeEntryIds } }]
              : []),
          ],
        },
      ],
    };

    const limit = dto.limit ?? DEFAULT_ACTIVITY_LIMIT;
    const rows = await this.prisma.activityLog.findMany({
      where,
      select: ACTIVITY_SELECT,
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      take: limit + 1,
      ...(dto.cursor ? { cursor: { id: dto.cursor }, skip: 1 } : {}),
    });

    return this.toFeedResult(rows, limit);
  }

  getCategory(action: string, entityType: string, fieldName?: string | null): ActivityCategory | string {
    if (fieldName && FIELD_CATEGORY_MAP[fieldName]) return FIELD_CATEGORY_MAP[fieldName];
    if (entityType === 'task' && action === 'created') return 'task_creation';
    if (ACTION_CATEGORY_MAP[action]) return ACTION_CATEGORY_MAP[action];

    if (entityType === 'project') return 'project';
    if (entityType === 'task_list') return 'list';
    if (entityType === 'status') return 'status';
    if (entityType === 'tag') return 'tag';
    if (entityType === 'workspace') return 'workspace';
    if (entityType === 'workspace_member') return 'member';
    if (entityType === 'workspace_invite') return 'invite';
    if (entityType === 'attachment') return 'attachments';
    if (entityType === 'comment') return 'comments';
    if (entityType === 'time_entry') return 'time_tracked';

    return entityType;
  }

  private buildCategoryWhere(categories: string[]): Prisma.ActivityLogWhereInput {
    const actions = Object.entries(ACTION_CATEGORY_MAP)
      .filter(([, category]) => categories.includes(category))
      .map(([action]) => action);
    const fields = Object.entries(FIELD_CATEGORY_MAP)
      .filter(([, category]) => categories.includes(category))
      .map(([field]) => field);
    const entityTypes = this.entityTypesForCategories(categories);

    const or: Prisma.ActivityLogWhereInput[] = [];
    if (actions.length) or.push({ action: { in: actions } });
    if (fields.length) or.push({ fieldName: { in: fields } });
    if (entityTypes.length) or.push({ entityType: { in: entityTypes } });
    if (categories.includes('task_creation')) {
      or.push({ entityType: 'task', action: 'created' });
    }

    return or.length ? { OR: or } : { id: { in: [] } };
  }

  private entityTypesForCategories(categories: string[]): string[] {
    const entityTypes: string[] = [];
    const pairs: Array<[string, string]> = [
      ['workspace', 'workspace'],
      ['member', 'workspace_member'],
      ['invite', 'workspace_invite'],
      ['project', 'project'],
      ['list', 'task_list'],
      ['status', 'status'],
      ['tag', 'tag'],
      ['attachments', 'attachment'],
      ['comments', 'comment'],
      ['time_tracked', 'time_entry'],
    ];

    for (const [category, entityType] of pairs) {
      if (categories.includes(category)) entityTypes.push(entityType);
    }

    return entityTypes;
  }

  private async buildWorkspaceWhere(
    workspaceId: string,
    actorId: string,
    dto: ListActivityDto,
  ): Promise<Prisma.ActivityLogWhereInput> {
    const baseWhere = this.buildBaseWhere(workspaceId, actorId, dto);
    const scopeConditions = await this.buildScopeConditions(workspaceId, actorId, dto);
    const visibilityWhere = await this.buildLockedProjectExclusion(workspaceId, actorId);
    if (scopeConditions.length === 0) {
      return { AND: [baseWhere, visibilityWhere] };
    }

    return {
      AND: [baseWhere, visibilityWhere, { OR: scopeConditions }],
    };
  }

  private buildBaseWhere(
    workspaceId: string,
    actorId: string,
    dto: ListActivityDto,
  ): Prisma.ActivityLogWhereInput {
    const and: Prisma.ActivityLogWhereInput[] = [{ workspaceId }];

    if (dto.me) and.push({ performedBy: actorId });
    if (dto.actorIds?.length) and.push({ performedBy: { in: dto.actorIds } });
    if (dto.entityType) and.push({ entityType: dto.entityType });
    if (dto.entityId) and.push({ entityId: dto.entityId });
    if (dto.actions?.length) and.push({ action: { in: dto.actions } });
    if (dto.categories?.length) and.push(this.buildCategoryWhere(dto.categories));
    if (dto.from || dto.to) {
      and.push({
        createdAt: {
          ...(dto.from ? { gte: new Date(dto.from) } : {}),
          ...(dto.to ? { lte: new Date(dto.to) } : {}),
        },
      });
    }
    if (dto.q) {
      and.push({
        OR: [
          { action: { contains: dto.q, mode: 'insensitive' } },
          { entityType: { contains: dto.q, mode: 'insensitive' } },
          { fieldName: { contains: dto.q, mode: 'insensitive' } },
          { oldValue: { contains: dto.q, mode: 'insensitive' } },
          { newValue: { contains: dto.q, mode: 'insensitive' } },
          { performer: { fullName: { contains: dto.q, mode: 'insensitive' } } },
          { performer: { email: { contains: dto.q, mode: 'insensitive' } } },
        ],
      });
    }

    return and.length === 1 ? and[0] : { AND: and };
  }

  private async buildScopeConditions(
    workspaceId: string,
    actorId: string,
    dto: ListActivityDto,
  ): Promise<Prisma.ActivityLogWhereInput[]> {
    if (dto.taskId) {
      const task = await this.prisma.task.findFirst({
        where: {
          id: dto.taskId,
          deletedAt: null,
          list: { deletedAt: null, project: { workspaceId, deletedAt: null } },
        },
        select: { list: { select: { projectId: true } } },
      });
      if (!task) throw new NotFoundException('Task not found');
      await this.projectSecurity.assertUnlocked(workspaceId, task.list.projectId, actorId);

      const scopedIds = await this.getTaskRelatedActivityIds([dto.taskId], dto.includeSubtasks ?? true);
      return [
        { entityType: 'task', entityId: { in: scopedIds.taskIds } },
        ...(scopedIds.commentIds.length ? [{ entityType: 'comment', entityId: { in: scopedIds.commentIds } }] : []),
        ...(scopedIds.attachmentIds.length
          ? [{ entityType: 'attachment', entityId: { in: scopedIds.attachmentIds } }]
          : []),
        ...(scopedIds.timeEntryIds.length
          ? [{ entityType: 'time_entry', entityId: { in: scopedIds.timeEntryIds } }]
          : []),
      ];
    }

    if (dto.listId) {
      const list = await this.prisma.taskList.findFirst({
        where: { id: dto.listId, deletedAt: null, project: { workspaceId, deletedAt: null } },
        select: { id: true, projectId: true },
      });
      if (!list) throw new NotFoundException('Task list not found');
      await this.projectSecurity.assertUnlocked(workspaceId, list.projectId, actorId);
      return this.getListScopeConditions([dto.listId], dto.includeSubtasks ?? true);
    }

    if (dto.projectId) {
      const project = await this.prisma.project.findFirst({
        where: { id: dto.projectId, workspaceId, deletedAt: null },
        select: { id: true },
      });
      if (!project) throw new NotFoundException('Project not found');
      await this.projectSecurity.assertUnlocked(workspaceId, dto.projectId, actorId);

      const lists = await this.prisma.taskList.findMany({
        where: { projectId: dto.projectId, deletedAt: null },
        select: { id: true },
      });
      const conditions = await this.getListScopeConditions(
        lists.map((list) => list.id),
        dto.includeSubtasks ?? true,
      );

      return [
        { entityType: 'project', entityId: dto.projectId },
        { entityType: 'status', entityId: { in: await this.getProjectStatusIds(dto.projectId) } },
        { entityType: 'task_list', entityId: { in: lists.map((list) => list.id) } },
        ...conditions,
      ];
    }

    return [];
  }

  private async getListScopeConditions(
    listIds: string[],
    includeSubtasks: boolean,
  ): Promise<Prisma.ActivityLogWhereInput[]> {
    if (listIds.length === 0) return [];

    const tasks = await this.prisma.task.findMany({
      where: {
        listId: { in: listIds },
        deletedAt: null,
        ...(includeSubtasks ? {} : { depth: 0 }),
      },
      select: { id: true },
    });
    const taskIds = tasks.map((task) => task.id);
    const scopedIds = await this.getTaskRelatedActivityIds(taskIds, false);

    return [
      { entityType: 'task_list', entityId: { in: listIds } },
      ...(scopedIds.taskIds.length ? [{ entityType: 'task', entityId: { in: scopedIds.taskIds } }] : []),
      ...(scopedIds.commentIds.length ? [{ entityType: 'comment', entityId: { in: scopedIds.commentIds } }] : []),
      ...(scopedIds.attachmentIds.length
        ? [{ entityType: 'attachment', entityId: { in: scopedIds.attachmentIds } }]
        : []),
      ...(scopedIds.timeEntryIds.length
        ? [{ entityType: 'time_entry', entityId: { in: scopedIds.timeEntryIds } }]
        : []),
    ];
  }

  private async getTaskRelatedActivityIds(taskIds: string[], includeSubtasks: boolean) {
    if (taskIds.length === 0) {
      return { taskIds: [], commentIds: [], attachmentIds: [], timeEntryIds: [] };
    }

    let scopedTaskIds = [...taskIds];
    if (includeSubtasks) {
      const subtasks = await this.prisma.task.findMany({
        where: { parentId: { in: taskIds }, deletedAt: null },
        select: { id: true },
      });
      scopedTaskIds = [...new Set([...scopedTaskIds, ...subtasks.map((task) => task.id)])];
    }

    const [comments, attachments, timeEntries] = await Promise.all([
      this.prisma.comment.findMany({
        where: { taskId: { in: scopedTaskIds }, deletedAt: null },
        select: { id: true },
      }),
      this.prisma.attachment.findMany({
        where: { taskId: { in: scopedTaskIds } },
        select: { id: true },
      }),
      this.prisma.timeEntry.findMany({
        where: { taskId: { in: scopedTaskIds } },
        select: { id: true },
      }),
    ]);

    return {
      taskIds: scopedTaskIds,
      commentIds: comments.map((comment) => comment.id),
      attachmentIds: attachments.map((attachment) => attachment.id),
      timeEntryIds: timeEntries.map((entry) => entry.id),
    };
  }

  private async getProjectStatusIds(projectId: string): Promise<string[]> {
    const statuses = await this.prisma.status.findMany({
      where: { projectId, deletedAt: null },
      select: { id: true },
    });
    return statuses.map((status) => status.id);
  }

  private async buildLockedProjectExclusion(
    workspaceId: string,
    actorId: string,
  ): Promise<Prisma.ActivityLogWhereInput> {
    const lockedProjects = await this.prisma.project.findMany({
      where: { workspaceId, deletedAt: null, passwordHash: { not: null } },
      select: { id: true },
    });
    const lockedProjectIds = lockedProjects.map((project) => project.id);
    if (lockedProjectIds.length === 0) return {};

    const unlockedProjectIds = await this.projectSecurity.activeUnlockedProjectIds(
      lockedProjectIds,
      actorId,
    );
    const hiddenProjectIds = lockedProjectIds.filter((id) => !unlockedProjectIds.has(id));
    if (hiddenProjectIds.length === 0) return {};

    const [statuses, lists, tasks] = await Promise.all([
      this.prisma.status.findMany({
        where: { projectId: { in: hiddenProjectIds } },
        select: { id: true },
      }),
      this.prisma.taskList.findMany({
        where: { projectId: { in: hiddenProjectIds } },
        select: { id: true },
      }),
      this.prisma.task.findMany({
        where: { list: { projectId: { in: hiddenProjectIds } } },
        select: { id: true },
      }),
    ]);

    const taskIds = tasks.map((task) => task.id);
    const [comments, attachments, timeEntries] = await Promise.all([
      this.prisma.comment.findMany({
        where: { taskId: { in: taskIds } },
        select: { id: true },
      }),
      this.prisma.attachment.findMany({
        where: {
          OR: [
            { taskId: { in: taskIds } },
            { doc: { projectId: { in: hiddenProjectIds } } },
            { channelMessage: { channel: { projectId: { in: hiddenProjectIds } } } },
          ],
        },
        select: { id: true },
      }),
      this.prisma.timeEntry.findMany({
        where: { taskId: { in: taskIds } },
        select: { id: true },
      }),
    ]);

    return {
      NOT: {
        OR: [
          { entityType: 'project', entityId: { in: hiddenProjectIds } },
          { entityType: 'status', entityId: { in: statuses.map((status) => status.id) } },
          { entityType: 'task_list', entityId: { in: lists.map((list) => list.id) } },
          { entityType: 'task', entityId: { in: taskIds } },
          { entityType: 'comment', entityId: { in: comments.map((comment) => comment.id) } },
          { entityType: 'attachment', entityId: { in: attachments.map((attachment) => attachment.id) } },
          { entityType: 'time_entry', entityId: { in: timeEntries.map((entry) => entry.id) } },
        ],
      },
    };
  }

  private toFeedResult(rows: RawActivity[], limit: number): ActivityFeedResult {
    const hasNext = rows.length > limit;
    const pageRows = hasNext ? rows.slice(0, limit) : rows;

    return {
      items: pageRows.map((row) => this.toFeedItem(row)),
      nextCursor: hasNext ? pageRows[pageRows.length - 1]?.id ?? null : null,
    };
  }

  private toFeedItem(row: RawActivity): ActivityFeedItem {
    const metadata = this.toRecord(row.metadata);
    const category = this.getCategory(row.action, row.entityType, row.fieldName);

    return {
      id: row.id,
      kind: row.entityType === 'comment' ? 'comment' : 'activity',
      category,
      entityType: row.entityType,
      entityId: row.entityId,
      action: row.action,
      fieldName: row.fieldName,
      oldValue: row.oldValue,
      newValue: row.newValue,
      metadata,
      actor: row.performer,
      displayText: this.formatDisplayText(row, category, metadata),
      createdAt: row.createdAt,
    };
  }

  private formatDisplayText(
    row: RawActivity,
    category: ActivityCategory | string,
    metadata: Record<string, unknown>,
  ): string {
    const actor = row.performer.fullName;
    const target = this.getTargetLabel(row, metadata);

    if (row.action === 'created') return `${actor} created ${target}`;
    if (row.action === 'deleted') return `${actor} deleted ${target}`;
    if (row.action === 'archived') return `${actor} archived ${target}`;
    if (row.action === 'restored') return `${actor} restored ${target}`;
    if (row.fieldName) {
      return `${actor} changed ${this.humanize(row.fieldName)} from ${row.oldValue ?? 'empty'} to ${row.newValue ?? 'empty'}`;
    }
    if (category === 'assignee') return `${actor} updated assignees on ${target}`;
    if (category === 'tags') return `${actor} updated tags on ${target}`;
    if (category === 'attachments') return `${actor} updated attachments on ${target}`;
    if (category === 'time_tracked') return `${actor} updated tracked time on ${target}`;
    if (category === 'comments') return `${actor} updated comments on ${target}`;

    return `${actor} ${this.humanize(row.action)} ${target}`;
  }

  private getTargetLabel(row: RawActivity, metadata: Record<string, unknown>): string {
    const named =
      metadata['taskTitle'] ??
      metadata['title'] ??
      metadata['projectName'] ??
      metadata['listName'] ??
      metadata['statusName'] ??
      metadata['tagName'] ??
      metadata['fileName'] ??
      metadata['workspaceName'];

    if (typeof named === 'string' && named.trim()) return named;
    return row.entityType.replace(/_/g, ' ');
  }

  private humanize(value: string): string {
    return value
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/_/g, ' ')
      .toLowerCase();
  }

  private toRecord(value: Prisma.JsonValue): Record<string, unknown> {
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      return value as Record<string, unknown>;
    }
    return {};
  }

  private toCreateInput(input: ActivityLogInput): Prisma.ActivityLogCreateManyInput {
    return {
      workspaceId: input.workspaceId,
      entityType: input.entityType,
      entityId: input.entityId,
      action: input.action,
      fieldName: input.fieldName ?? null,
      oldValue: this.stringifyValue(input.oldValue),
      newValue: this.stringifyValue(input.newValue),
      metadata: input.metadata ?? {},
      performedBy: input.performedBy,
    };
  }

  private stringifyValue(value: unknown): string | null {
    if (value === undefined || value === null) return null;
    if (value instanceof Date) return value.toISOString();
    if (typeof value === 'string') return value;
    if (typeof value === 'number' || typeof value === 'boolean' || typeof value === 'bigint') {
      return String(value);
    }
    return JSON.stringify(value);
  }
}
