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
exports.StatusService = void 0;
const common_1 = require("@nestjs/common");
const database_1 = require("../../../../libs/database/src");
const status_constants_1 = require("./status.constants");
const STATUS_NAME_TAKEN = 'A status with this name already exists in this project';
let StatusService = class StatusService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(workspaceId, userId, role, dto) {
        this.assertOwner(role);
        const project = await this.findProjectOrThrow(workspaceId, dto.projectId);
        const name = dto.name.trim();
        await this.assertUniqueStatusName(project.id, name);
        const status = await this.prisma.status.create({
            data: {
                projectId: project.id,
                name,
                color: dto.color ?? '#94a3b8',
                group: dto.group,
                position: await this.getNextPosition(project.id, dto.group),
                isDefault: false,
                isProtected: false,
                isClosed: false,
            },
            select: status_constants_1.STATUS_SELECT,
        });
        await this.prisma.activityLog.create({
            data: {
                workspaceId,
                entityType: 'status',
                entityId: status.id,
                action: 'created',
                metadata: {
                    projectName: project.name,
                    statusGroup: status.group,
                },
                performedBy: userId,
            },
        });
        return status;
    }
    async findAll(workspaceId, projectId) {
        await this.findProjectOrThrow(workspaceId, projectId);
        const statuses = await this.listProjectStatuses(projectId);
        return this.groupStatuses(projectId, statuses);
    }
    async findOne(workspaceId, statusId) {
        return this.findStatusOrThrow(workspaceId, statusId);
    }
    async update(workspaceId, statusId, userId, role, dto) {
        this.assertOwner(role);
        const status = await this.findStatusOrThrow(workspaceId, statusId, {
            project: { select: { name: true } },
        });
        if (status.isProtected && dto.color !== undefined) {
            throw new common_1.BadRequestException(status_constants_1.PROTECTED_STATUS_UPDATE_FORBIDDEN);
        }
        const updateData = {};
        const logEntries = [];
        if (dto.name !== undefined) {
            const normalizedName = dto.name.trim();
            if (normalizedName !== status.name) {
                await this.assertUniqueStatusName(status.projectId, normalizedName, status.id);
                updateData.name = normalizedName;
                logEntries.push({
                    fieldName: 'name',
                    oldValue: status.name,
                    newValue: normalizedName,
                });
            }
        }
        if (!status.isProtected && dto.color !== undefined && dto.color !== status.color) {
            updateData.color = dto.color;
            logEntries.push({
                fieldName: 'color',
                oldValue: status.color,
                newValue: dto.color,
            });
        }
        if (Object.keys(updateData).length === 0) {
            return this.findStatusOrThrow(workspaceId, statusId);
        }
        const updated = await this.prisma.status.update({
            where: { id: statusId },
            data: updateData,
            select: status_constants_1.STATUS_SELECT,
        });
        if (logEntries.length > 0) {
            await this.prisma.activityLog.createMany({
                data: logEntries.map((entry) => ({
                    workspaceId,
                    entityType: 'status',
                    entityId: statusId,
                    action: 'updated',
                    fieldName: entry.fieldName,
                    oldValue: entry.oldValue,
                    newValue: entry.newValue,
                    metadata: { projectName: status.project.name },
                    performedBy: userId,
                })),
            });
        }
        return updated;
    }
    async remove(workspaceId, statusId, userId, role, dto) {
        this.assertOwner(role);
        const status = await this.findStatusOrThrow(workspaceId, statusId, {
            project: { select: { name: true } },
        });
        if (status.isProtected) {
            throw new common_1.BadRequestException(status_constants_1.PROTECTED_STATUS_DELETE_FORBIDDEN);
        }
        const activeTaskCount = await this.prisma.task.count({
            where: { statusId, deletedAt: null },
        });
        let replacementStatusId;
        if (activeTaskCount > 0) {
            if (!dto.replacementStatusId) {
                throw new common_1.BadRequestException(status_constants_1.DELETE_REPLACEMENT_REQUIRED);
            }
            const replacementStatus = await this.prisma.status.findFirst({
                where: {
                    id: dto.replacementStatusId,
                    projectId: status.projectId,
                    deletedAt: null,
                },
                select: { id: true },
            });
            if (!replacementStatus || replacementStatus.id === status.id) {
                throw new common_1.BadRequestException(status_constants_1.INVALID_REPLACEMENT_STATUS);
            }
            replacementStatusId = replacementStatus.id;
        }
        const deletedAt = new Date();
        await this.prisma.$transaction(async (tx) => {
            if (replacementStatusId) {
                await tx.task.updateMany({
                    where: { statusId: status.id, deletedAt: null },
                    data: { statusId: replacementStatusId },
                });
            }
            await tx.status.update({
                where: { id: status.id },
                data: { deletedAt },
            });
            await tx.activityLog.create({
                data: {
                    workspaceId,
                    entityType: 'status',
                    entityId: status.id,
                    action: 'deleted',
                    metadata: {
                        projectName: status.project.name,
                        replacementStatusId: replacementStatusId ?? null,
                    },
                    performedBy: userId,
                },
            });
        });
    }
    async reorder(workspaceId, userId, role, dto) {
        this.assertOwner(role);
        const project = await this.findProjectOrThrow(workspaceId, dto.projectId);
        const statuses = await this.listProjectStatuses(project.id);
        const allIds = statuses.map((status) => status.id);
        const reorderedIds = [
            ...dto.groups.notStarted,
            ...dto.groups.active,
            ...dto.groups.done,
            ...dto.groups.closed,
        ];
        if (reorderedIds.length !== allIds.length ||
            new Set(reorderedIds).size !== reorderedIds.length ||
            allIds.some((id) => !reorderedIds.includes(id))) {
            throw new common_1.BadRequestException(status_constants_1.INVALID_REORDER_PAYLOAD);
        }
        const closedStatuses = statuses.filter((status) => status.isProtected || status.group === 'CLOSED');
        if (dto.groups.closed.length !== 1 ||
            closedStatuses.length !== 1 ||
            dto.groups.closed[0] !== closedStatuses[0]?.id) {
            throw new common_1.BadRequestException(status_constants_1.CLOSED_GROUP_REORDER_FORBIDDEN);
        }
        const statusById = new Map(statuses.map((status) => [status.id, status]));
        const nextState = [
            ...dto.groups.notStarted.map((id, index) => ({ id, group: 'NOT_STARTED', position: (index + 1) * 1000 })),
            ...dto.groups.active.map((id, index) => ({ id, group: 'ACTIVE', position: (index + 1) * 1000 })),
            ...dto.groups.done.map((id, index) => ({ id, group: 'DONE', position: (index + 1) * 1000 })),
            ...dto.groups.closed.map((id, index) => ({ id, group: 'CLOSED', position: (index + 1) * 1000 })),
        ];
        const changedStates = nextState.filter((entry) => {
            const current = statusById.get(entry.id);
            return current && (current.group !== entry.group || current.position !== entry.position);
        });
        if (changedStates.length === 0) {
            return this.groupStatuses(project.id, statuses);
        }
        await this.prisma.$transaction(async (tx) => {
            for (const entry of changedStates) {
                await tx.status.update({
                    where: { id: entry.id },
                    data: {
                        group: entry.group,
                        position: entry.position,
                        isClosed: entry.group === 'CLOSED',
                    },
                });
            }
            await tx.activityLog.createMany({
                data: changedStates.map((entry) => {
                    const current = statusById.get(entry.id);
                    return {
                        workspaceId,
                        entityType: 'status',
                        entityId: entry.id,
                        action: 'updated',
                        fieldName: current.group !== entry.group ? 'group' : 'position',
                        oldValue: current.group !== entry.group
                            ? current.group
                            : String(current.position),
                        newValue: current.group !== entry.group ? entry.group : String(entry.position),
                        metadata: { projectName: project.name },
                        performedBy: userId,
                    };
                }),
            });
        });
        return this.findAll(workspaceId, project.id);
    }
    async applyDefaultTemplate(workspaceId, userId, role, dto) {
        this.assertOwner(role);
        const project = await this.findProjectOrThrow(workspaceId, dto.projectId);
        const statuses = await this.listProjectStatuses(project.id);
        await this.prisma.$transaction(async (tx) => {
            for (const template of status_constants_1.DEFAULT_STATUS_TEMPLATE) {
                const existing = template.group === 'CLOSED'
                    ? statuses.find((status) => status.isProtected || status.group === 'CLOSED')
                    : statuses.find((status) => status.name === template.name);
                if (existing) {
                    await tx.status.update({
                        where: { id: existing.id },
                        data: {
                            name: template.name,
                            color: template.color,
                            group: template.group,
                            position: template.position,
                            isDefault: true,
                            isProtected: template.isProtected,
                            isClosed: template.isClosed,
                        },
                    });
                    continue;
                }
                await tx.status.create({
                    data: {
                        projectId: project.id,
                        name: template.name,
                        color: template.color,
                        group: template.group,
                        position: template.position,
                        isDefault: true,
                        isProtected: template.isProtected,
                        isClosed: template.isClosed,
                    },
                });
            }
            await tx.activityLog.create({
                data: {
                    workspaceId,
                    entityType: 'status',
                    entityId: project.id,
                    action: 'created',
                    metadata: {
                        projectName: project.name,
                        template: 'default_statuses',
                    },
                    performedBy: userId,
                },
            });
        });
        return this.findAll(workspaceId, project.id);
    }
    assertOwner(role) {
        if (role !== 'OWNER') {
            throw new common_1.ForbiddenException(status_constants_1.OWNER_ONLY);
        }
    }
    async findProjectOrThrow(workspaceId, projectId) {
        const project = await this.prisma.project.findFirst({
            where: { id: projectId, workspaceId, deletedAt: null },
            select: { id: true, name: true },
        });
        if (!project) {
            throw new common_1.NotFoundException(status_constants_1.PROJECT_NOT_FOUND);
        }
        return project;
    }
    async findStatusOrThrow(workspaceId, statusId, extraSelect) {
        const status = await this.prisma.status.findFirst({
            where: {
                id: statusId,
                deletedAt: null,
                project: { workspaceId, deletedAt: null },
            },
            select: {
                ...status_constants_1.STATUS_SELECT,
                ...(extraSelect ?? {}),
            },
        });
        if (!status) {
            throw new common_1.NotFoundException(status_constants_1.STATUS_NOT_FOUND);
        }
        return status;
    }
    async listProjectStatuses(projectId) {
        return this.prisma.status.findMany({
            where: { projectId, deletedAt: null },
            select: status_constants_1.STATUS_SELECT,
            orderBy: [{ group: 'asc' }, { position: 'asc' }],
        });
    }
    groupStatuses(projectId, statuses) {
        return {
            projectId,
            groups: {
                notStarted: statuses.filter((status) => status.group === 'NOT_STARTED'),
                active: statuses.filter((status) => status.group === 'ACTIVE'),
                done: statuses.filter((status) => status.group === 'DONE'),
                closed: statuses.filter((status) => status.group === 'CLOSED'),
            },
        };
    }
    async getNextPosition(projectId, group) {
        const lastStatus = await this.prisma.status.findFirst({
            where: { projectId, group, deletedAt: null },
            orderBy: { position: 'desc' },
            select: { position: true },
        });
        return (lastStatus?.position ?? 0) + 1000;
    }
    async assertUniqueStatusName(projectId, name, ignoreStatusId) {
        const existingStatus = await this.prisma.status.findFirst({
            where: {
                projectId,
                name,
                deletedAt: null,
                ...(ignoreStatusId ? { id: { not: ignoreStatusId } } : {}),
            },
            select: { id: true },
        });
        if (existingStatus) {
            throw new common_1.ConflictException(STATUS_NAME_TAKEN);
        }
    }
};
exports.StatusService = StatusService;
exports.StatusService = StatusService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_1.PrismaService])
], StatusService);
//# sourceMappingURL=status.service.js.map