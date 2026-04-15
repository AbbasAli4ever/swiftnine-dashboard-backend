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
const common_2 = require("../../../../libs/common/src");
const node_crypto_1 = require("node:crypto");
const WORKSPACE_NOT_FOUND = 'Workspace not found';
const OWNER_ONLY = 'Only the workspace owner can perform this action';
const INVITE_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000;
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
    email;
    constructor(prisma, email) {
        this.prisma = prisma;
        this.email = email;
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
    async sendInvite(workspaceId, inviterId, role, dto) {
        if (role !== 'OWNER')
            throw new common_1.ForbiddenException(OWNER_ONLY);
        const workspace = await this.prisma.workspace.findFirst({
            where: { id: workspaceId, deletedAt: null },
            select: { id: true, name: true },
        });
        if (!workspace)
            throw new common_1.NotFoundException(WORKSPACE_NOT_FOUND);
        const inviteeEmail = dto.email.trim().toLowerCase();
        const alreadyMember = await this.prisma.workspaceMember.findFirst({
            where: {
                workspaceId,
                deletedAt: null,
                user: { email: inviteeEmail, deletedAt: null },
            },
            select: { id: true },
        });
        if (alreadyMember)
            return;
        const inviter = await this.prisma.user.findFirst({
            where: { id: inviterId, deletedAt: null },
            select: { fullName: true },
        });
        await this.prisma.workspaceInvite.updateMany({
            where: { workspaceId, email: inviteeEmail, status: 'PENDING' },
            data: { status: 'REVOKED' },
        });
        const rawToken = (0, node_crypto_1.randomUUID)();
        const tokenHash = this.hashToken(rawToken);
        await this.prisma.workspaceInvite.create({
            data: {
                workspaceId,
                email: inviteeEmail,
                role: dto.role,
                inviteToken: tokenHash,
                invitedBy: inviterId,
                status: 'PENDING',
                expiresAt: new Date(Date.now() + INVITE_TOKEN_TTL_MS),
            },
        });
        const frontendUrl = process.env['FRONTEND_URL'] ?? 'http://localhost:3000';
        const inviteUrl = `${frontendUrl}/invite?token=${rawToken}`;
        await this.email.sendWorkspaceInviteEmail(inviteeEmail, inviter?.fullName ?? 'A team member', workspace.name, inviteUrl);
    }
    async getInviteDetails(token) {
        const tokenHash = this.hashToken(token);
        const invite = await this.prisma.workspaceInvite.findFirst({
            where: {
                inviteToken: tokenHash,
                status: 'PENDING',
                expiresAt: { gt: new Date() },
            },
            select: {
                email: true,
                role: true,
                workspace: { select: { id: true, name: true } },
                sender: { select: { fullName: true } },
            },
        });
        if (!invite) {
            throw new common_1.NotFoundException('Invite not found, already used, or expired');
        }
        return {
            workspaceId: invite.workspace.id,
            workspaceName: invite.workspace.name,
            invitedEmail: invite.email,
            role: invite.role,
            inviterName: invite.sender.fullName,
        };
    }
    async acceptInvite(token, userId, userEmail) {
        const tokenHash = this.hashToken(token);
        const invite = await this.prisma.workspaceInvite.findFirst({
            where: {
                inviteToken: tokenHash,
                status: 'PENDING',
                expiresAt: { gt: new Date() },
            },
            select: { id: true, workspaceId: true, email: true, role: true },
        });
        if (!invite) {
            throw new common_1.NotFoundException('Invite not found, already used, or expired');
        }
        if (invite.email !== userEmail.trim().toLowerCase()) {
            throw new common_1.BadRequestException('This invite was sent to a different email address');
        }
        const existingMember = await this.prisma.workspaceMember.findFirst({
            where: { workspaceId: invite.workspaceId, userId, deletedAt: null },
            select: { id: true },
        });
        await this.prisma.$transaction(async (tx) => {
            await tx.workspaceInvite.update({
                where: { id: invite.id },
                data: { status: 'ACCEPTED', acceptedAt: new Date() },
            });
            if (!existingMember) {
                await tx.workspaceMember.create({
                    data: {
                        workspaceId: invite.workspaceId,
                        userId,
                        role: invite.role,
                    },
                });
            }
        });
        return { workspaceId: invite.workspaceId };
    }
    hashToken(rawToken) {
        return (0, node_crypto_1.createHash)('sha256').update(rawToken).digest('hex');
    }
};
exports.WorkspaceService = WorkspaceService;
exports.WorkspaceService = WorkspaceService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_1.PrismaService,
        common_2.EmailService])
], WorkspaceService);
//# sourceMappingURL=workspace.service.js.map