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
exports.WorkspaceService = void 0;
const common_1 = require("@nestjs/common");
const database_1 = require("../../../../libs/database/src");
const WORKSPACE_NOT_FOUND = 'Workspace not found';
const OWNER_ONLY = 'Only the workspace owner can perform this action';
const WORKSPACE_SELECT = {
    id: true,
    name: true,
    logoUrl: true,
    createdBy: true,
    createdAt: true,
    updatedAt: true,
};
let WorkspaceService = class WorkspaceService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, dto) {
        return this.prisma.$transaction(async (tx) => {
            const workspace = await tx.workspace.create({
                data: {
                    name: dto.name.trim(),
                    logoUrl: dto.logoUrl ?? null,
                    createdBy: userId,
                },
                select: WORKSPACE_SELECT,
            });
            await tx.workspaceMember.create({
                data: {
                    workspaceId: workspace.id,
                    userId,
                    role: 'OWNER',
                },
            });
            await tx.activityLog.create({
                data: {
                    workspaceId: workspace.id,
                    entityType: 'workspace',
                    entityId: workspace.id,
                    action: 'created',
                    metadata: { workspaceName: workspace.name },
                    performedBy: userId,
                },
            });
            return workspace;
        });
    }
    async findAllForUser(userId) {
        const memberships = await this.prisma.workspaceMember.findMany({
            where: {
                userId,
                deletedAt: null,
                workspace: { deletedAt: null },
            },
            select: {
                workspace: { select: WORKSPACE_SELECT },
            },
            orderBy: { createdAt: 'asc' },
        });
        return memberships.map((m) => m.workspace);
    }
    async findOne(workspaceId, userId) {
        const [workspace, memberCount] = await Promise.all([
            this.prisma.workspace.findFirst({
                where: { id: workspaceId, deletedAt: null },
                select: WORKSPACE_SELECT,
            }),
            this.prisma.workspaceMember.count({
                where: { workspaceId, deletedAt: null },
            }),
        ]);
        if (!workspace)
            throw new common_1.NotFoundException(WORKSPACE_NOT_FOUND);
        return { ...workspace, memberCount };
    }
    async update(workspaceId, userId, role, dto) {
        if (role !== 'OWNER')
            throw new common_1.ForbiddenException(OWNER_ONLY);
        const workspace = await this.prisma.workspace.findFirst({
            where: { id: workspaceId, deletedAt: null },
            select: WORKSPACE_SELECT,
        });
        if (!workspace)
            throw new common_1.NotFoundException(WORKSPACE_NOT_FOUND);
        const updateData = {};
        const logEntries = [];
        if (dto.name !== undefined && dto.name !== workspace.name) {
            updateData.name = dto.name.trim();
            logEntries.push({ fieldName: 'name', oldValue: workspace.name, newValue: dto.name.trim() });
        }
        if (dto.logoUrl !== undefined && dto.logoUrl !== workspace.logoUrl) {
            updateData.logoUrl = dto.logoUrl;
            logEntries.push({ fieldName: 'logoUrl', oldValue: workspace.logoUrl ?? null, newValue: dto.logoUrl ?? null });
        }
        if (Object.keys(updateData).length === 0)
            return workspace;
        const updated = await this.prisma.workspace.update({
            where: { id: workspaceId },
            data: updateData,
            select: WORKSPACE_SELECT,
        });
        if (logEntries.length > 0) {
            await this.prisma.activityLog.createMany({
                data: logEntries.map((entry) => ({
                    workspaceId,
                    entityType: 'workspace',
                    entityId: workspaceId,
                    action: 'updated',
                    fieldName: entry.fieldName,
                    oldValue: entry.oldValue,
                    newValue: entry.newValue,
                    metadata: { workspaceName: updated.name },
                    performedBy: userId,
                })),
            });
        }
        return updated;
    }
    async remove(workspaceId, userId, role) {
        if (role !== 'OWNER')
            throw new common_1.ForbiddenException(OWNER_ONLY);
        const workspace = await this.prisma.workspace.findFirst({
            where: { id: workspaceId, deletedAt: null },
            select: { id: true, name: true },
        });
        if (!workspace)
            throw new common_1.NotFoundException(WORKSPACE_NOT_FOUND);
        await this.prisma.$transaction([
            this.prisma.workspace.update({
                where: { id: workspaceId },
                data: { deletedAt: new Date() },
            }),
            this.prisma.activityLog.create({
                data: {
                    workspaceId,
                    entityType: 'workspace',
                    entityId: workspaceId,
                    action: 'deleted',
                    metadata: { workspaceName: workspace.name },
                    performedBy: userId,
                },
            }),
        ]);
    }
};
exports.WorkspaceService = WorkspaceService;
exports.WorkspaceService = WorkspaceService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_1.PrismaService])
], WorkspaceService);
//# sourceMappingURL=workspace.service.js.map