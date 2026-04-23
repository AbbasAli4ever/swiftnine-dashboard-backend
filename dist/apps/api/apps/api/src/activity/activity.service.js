"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivityService = void 0;
const common_1 = require("@nestjs/common");
const database_1 = require("../../../../libs/database/src");
const activity_constants_1 = require("./activity.constants");
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
};
let ActivityService = class ActivityService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async log(input, client = this.prisma) {
        await client.activityLog.create({
            data: this.toCreateInput(input),
        });
    }
    async logMany(inputs, client = this.prisma) {
        if (inputs.length === 0)
            return;
        await client.activityLog.createMany({
            data: inputs.map((input) => this.toCreateInput(input)),
        });
    }
    async listWorkspaceActivity(workspaceId, actorId, dto) {
        const limit = dto.limit ?? activity_constants_1.DEFAULT_ACTIVITY_LIMIT;
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
    async listTaskActivity(workspaceId, taskId, actorId, dto) {
        const task = await this.prisma.task.findFirst({
            where: {
                id: taskId,
                deletedAt: null,
                list: { deletedAt: null, project: { workspaceId, deletedAt: null } },
            },
            select: { id: true },
        });
        if (!task)
            throw new common_1.NotFoundException('Task not found');
        const scopedIds = await this.getTaskRelatedActivityIds([taskId], dto.includeSubtasks ?? true);
        const baseWhere = this.buildBaseWhere(workspaceId, actorId, {
            ...dto,
            taskId: undefined,
            projectId: undefined,
            listId: undefined,
            entityType: undefined,
            entityId: undefined,
        });
        const where = {
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
        const limit = dto.limit ?? activity_constants_1.DEFAULT_ACTIVITY_LIMIT;
        const rows = await this.prisma.activityLog.findMany({
            where,
            select: ACTIVITY_SELECT,
            orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
            take: limit + 1,
            ...(dto.cursor ? { cursor: { id: dto.cursor }, skip: 1 } : {}),
        });
        return this.toFeedResult(rows, limit);
    }
    getCategory(action, entityType, fieldName) {
        if (fieldName && activity_constants_1.FIELD_CATEGORY_MAP[fieldName])
            return activity_constants_1.FIELD_CATEGORY_MAP[fieldName];
        if (entityType === 'task' && action === 'created')
            return 'task_creation';
        if (activity_constants_1.ACTION_CATEGORY_MAP[action])
            return activity_constants_1.ACTION_CATEGORY_MAP[action];
        if (entityType === 'project')
            return 'project';
        if (entityType === 'task_list')
            return 'list';
        if (entityType === 'status')
            return 'status';
        if (entityType === 'tag')
            return 'tag';
        if (entityType === 'workspace')
            return 'workspace';
        if (entityType === 'workspace_member')
            return 'member';
        if (entityType === 'workspace_invite')
            return 'invite';
        if (entityType === 'attachment')
            return 'attachments';
        if (entityType === 'comment')
            return 'comments';
        if (entityType === 'time_entry')
            return 'time_tracked';
        return entityType;
    }
    buildCategoryWhere(categories) {
        const actions = Object.entries(activity_constants_1.ACTION_CATEGORY_MAP)
            .filter(([, category]) => categories.includes(category))
            .map(([action]) => action);
        const fields = Object.entries(activity_constants_1.FIELD_CATEGORY_MAP)
            .filter(([, category]) => categories.includes(category))
            .map(([field]) => field);
        const entityTypes = this.entityTypesForCategories(categories);
        const or = [];
        if (actions.length)
            or.push({ action: { in: actions } });
        if (fields.length)
            or.push({ fieldName: { in: fields } });
        if (entityTypes.length)
            or.push({ entityType: { in: entityTypes } });
        if (categories.includes('task_creation')) {
            or.push({ entityType: 'task', action: 'created' });
        }
        return or.length ? { OR: or } : { id: { in: [] } };
    }
    entityTypesForCategories(categories) {
        const entityTypes = [];
        const pairs = [
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
            if (categories.includes(category))
                entityTypes.push(entityType);
        }
        return entityTypes;
    }
    async buildWorkspaceWhere(workspaceId, actorId, dto) {
        const baseWhere = this.buildBaseWhere(workspaceId, actorId, dto);
        const scopeConditions = await this.buildScopeConditions(workspaceId, dto);
        if (scopeConditions.length === 0)
            return baseWhere;
        return {
            AND: [baseWhere, { OR: scopeConditions }],
        };
    }
    buildBaseWhere(workspaceId, actorId, dto) {
        const and = [{ workspaceId }];
        if (dto.me)
            and.push({ performedBy: actorId });
        if (dto.actorIds?.length)
            and.push({ performedBy: { in: dto.actorIds } });
        if (dto.entityType)
            and.push({ entityType: dto.entityType });
        if (dto.entityId)
            and.push({ entityId: dto.entityId });
        if (dto.actions?.length)
            and.push({ action: { in: dto.actions } });
        if (dto.categories?.length)
            and.push(this.buildCategoryWhere(dto.categories));
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
    async buildScopeConditions(workspaceId, dto) {
        if (dto.taskId) {
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
                select: { id: true },
            });
            if (!list)
                throw new common_1.NotFoundException('Task list not found');
            return this.getListScopeConditions([dto.listId], dto.includeSubtasks ?? true);
        }
        if (dto.projectId) {
            const project = await this.prisma.project.findFirst({
                where: { id: dto.projectId, workspaceId, deletedAt: null },
                select: { id: true },
            });
            if (!project)
                throw new common_1.NotFoundException('Project not found');
            const lists = await this.prisma.taskList.findMany({
                where: { projectId: dto.projectId, deletedAt: null },
                select: { id: true },
            });
            const conditions = await this.getListScopeConditions(lists.map((list) => list.id), dto.includeSubtasks ?? true);
            return [
                { entityType: 'project', entityId: dto.projectId },
                { entityType: 'status', entityId: { in: await this.getProjectStatusIds(dto.projectId) } },
                { entityType: 'task_list', entityId: { in: lists.map((list) => list.id) } },
                ...conditions,
            ];
        }
        return [];
    }
    async getListScopeConditions(listIds, includeSubtasks) {
        if (listIds.length === 0)
            return [];
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
    async getTaskRelatedActivityIds(taskIds, includeSubtasks) {
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
    async getProjectStatusIds(projectId) {
        const statuses = await this.prisma.status.findMany({
            where: { projectId, deletedAt: null },
            select: { id: true },
        });
        return statuses.map((status) => status.id);
    }
    toFeedResult(rows, limit) {
        const hasNext = rows.length > limit;
        const pageRows = hasNext ? rows.slice(0, limit) : rows;
        return {
            items: pageRows.map((row) => this.toFeedItem(row)),
            nextCursor: hasNext ? pageRows[pageRows.length - 1]?.id ?? null : null,
        };
    }
    toFeedItem(row) {
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
    formatDisplayText(row, category, metadata) {
        const actor = row.performer.fullName;
        const target = this.getTargetLabel(row, metadata);
        if (row.action === 'created')
            return `${actor} created ${target}`;
        if (row.action === 'deleted')
            return `${actor} deleted ${target}`;
        if (row.action === 'archived')
            return `${actor} archived ${target}`;
        if (row.action === 'restored')
            return `${actor} restored ${target}`;
        if (row.fieldName) {
            return `${actor} changed ${this.humanize(row.fieldName)} from ${row.oldValue ?? 'empty'} to ${row.newValue ?? 'empty'}`;
        }
        if (category === 'assignee')
            return `${actor} updated assignees on ${target}`;
        if (category === 'tags')
            return `${actor} updated tags on ${target}`;
        if (category === 'attachments')
            return `${actor} updated attachments on ${target}`;
        if (category === 'time_tracked')
            return `${actor} updated tracked time on ${target}`;
        if (category === 'comments')
            return `${actor} updated comments on ${target}`;
        return `${actor} ${this.humanize(row.action)} ${target}`;
    }
    getTargetLabel(row, metadata) {
        const named = metadata['taskTitle'] ??
            metadata['title'] ??
            metadata['projectName'] ??
            metadata['listName'] ??
            metadata['statusName'] ??
            metadata['tagName'] ??
            metadata['fileName'] ??
            metadata['workspaceName'];
        if (typeof named === 'string' && named.trim())
            return named;
        return row.entityType.replace(/_/g, ' ');
    }
    humanize(value) {
        return value
            .replace(/([a-z])([A-Z])/g, '$1 $2')
            .replace(/_/g, ' ')
            .toLowerCase();
    }
    toRecord(value) {
        if (value && typeof value === 'object' && !Array.isArray(value)) {
            return value;
        }
        return {};
    }
    toCreateInput(input) {
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
    stringifyValue(value) {
        if (value === undefined || value === null)
            return null;
        if (value instanceof Date)
            return value.toISOString();
        if (typeof value === 'string')
            return value;
        if (typeof value === 'number' || typeof value === 'boolean' || typeof value === 'bigint') {
            return String(value);
        }
        return JSON.stringify(value);
    }
};
exports.ActivityService = ActivityService;
exports.ActivityService = ActivityService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_1.PrismaService])
], ActivityService);
//# sourceMappingURL=activity.service.js.map