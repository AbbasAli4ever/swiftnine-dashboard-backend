"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkspaceService = void 0;
const common_1 = require("@nestjs/common");
const database_1 = require("../../../../libs/database/src");
const common_2 = require("../../../../libs/common/src");
const bcrypt = __importStar(require("bcrypt"));
const node_crypto_1 = require("node:crypto");
const auth_service_1 = require("../auth/auth.service");
const WORKSPACE_NOT_FOUND = 'Workspace not found';
const OWNER_ONLY = 'Only the workspace owner can perform this action';
const INVITE_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000;
const PASSWORD_SALT_ROUNDS = 10;
const INVITE_ALREADY_REGISTERED_MESSAGE = 'An account already exists for this email. Please log in to accept the invite.';
const WORKSPACE_SELECT = {
    id: true,
    name: true,
    logoUrl: true,
    workspaceUse: true,
    managementType: true,
    createdBy: true,
    createdAt: true,
    updatedAt: true,
};
let WorkspaceService = class WorkspaceService {
    prisma;
    email;
    authService;
    constructor(prisma, email, authService) {
        this.prisma = prisma;
        this.email = email;
        this.authService = authService;
    }
    async create(userId, dto) {
        return this.prisma.$transaction(async (tx) => {
            const workspace = await tx.workspace.create({
                data: {
                    name: dto.name.trim(),
                    logoUrl: dto.logoUrl ?? null,
                    workspaceUse: dto.workspaceUse,
                    managementType: dto.managementType,
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
                    metadata: {
                        workspaceName: workspace.name,
                        workspaceUse: workspace.workspaceUse,
                        managementType: workspace.managementType,
                    },
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
    async listMembers(workspaceId) {
        const members = await this.prisma.workspaceMember.findMany({
            where: { workspaceId, deletedAt: null },
            select: {
                role: true,
                createdAt: true,
                user: { select: { id: true, fullName: true, email: true, lastSeenAt: true } },
            },
            orderBy: { createdAt: 'asc' },
        });
        const emails = [...new Set(members.map((m) => m.user.email.trim().toLowerCase()))];
        const invites = emails.length > 0
            ? await this.prisma.workspaceInvite.findMany({
                where: { workspaceId, email: { in: emails } },
                select: { email: true, createdAt: true, status: true, sender: { select: { fullName: true } } },
                orderBy: { createdAt: 'desc' },
            })
            : [];
        const inviteMap = new Map();
        for (const inv of invites) {
            const key = inv.email.trim().toLowerCase();
            if (!inviteMap.has(key))
                inviteMap.set(key, inv);
        }
        return members.map((m) => {
            const u = m.user;
            const key = u.email.trim().toLowerCase();
            const inv = inviteMap.get(key);
            return {
                id: u.id,
                fullName: u.fullName,
                email: u.email,
                role: m.role,
                lastActive: u.lastSeenAt ?? null,
                invitedBy: inv?.sender?.fullName ?? null,
                invitedOn: inv?.createdAt ?? null,
                inviteStatus: inv?.status ?? null,
            };
        });
    }
    async getMember(workspaceId, memberId) {
        let member = await this.prisma.workspaceMember.findFirst({
            where: { id: memberId, workspaceId, deletedAt: null },
            select: {
                id: true,
                role: true,
                createdAt: true,
                user: {
                    select: {
                        id: true,
                        fullName: true,
                        email: true,
                        avatarUrl: true,
                        avatarColor: true,
                        designation: true,
                        bio: true,
                        isOnline: true,
                        lastSeenAt: true,
                        timezone: true,
                        notificationPreferences: true,
                        createdAt: true,
                        updatedAt: true,
                    },
                },
            },
        });
        if (!member) {
            member = await this.prisma.workspaceMember.findFirst({
                where: { userId: memberId, workspaceId, deletedAt: null },
                select: {
                    id: true,
                    role: true,
                    createdAt: true,
                    user: {
                        select: {
                            id: true,
                            fullName: true,
                            email: true,
                            avatarUrl: true,
                            avatarColor: true,
                            designation: true,
                            bio: true,
                            isOnline: true,
                            lastSeenAt: true,
                            timezone: true,
                            notificationPreferences: true,
                            createdAt: true,
                            updatedAt: true,
                        },
                    },
                },
            });
        }
        if (!member) {
            throw new common_1.NotFoundException('Member not found');
        }
        const u = member.user;
        const invite = await this.prisma.workspaceInvite.findFirst({
            where: { workspaceId, email: u.email.trim().toLowerCase() },
            select: { createdAt: true, status: true, sender: { select: { fullName: true } } },
            orderBy: { createdAt: 'desc' },
        });
        return {
            id: u.id,
            workspaceMemberId: member.id,
            fullName: u.fullName,
            email: u.email,
            role: member.role,
            avatarUrl: u.avatarUrl ?? null,
            avatarColor: u.avatarColor ?? null,
            designation: u.designation ?? null,
            bio: u.bio ?? null,
            isOnline: u.isOnline ?? false,
            lastActive: u.lastSeenAt ?? null,
            timezone: u.timezone ?? null,
            notificationPreferences: u.notificationPreferences ?? null,
            invitedBy: invite?.sender?.fullName ?? null,
            invitedOn: invite?.createdAt ?? null,
            inviteStatus: invite?.status ?? null,
            createdAt: u.createdAt,
            updatedAt: u.updatedAt,
        };
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
        if (dto.workspaceUse !== undefined && dto.workspaceUse !== workspace.workspaceUse) {
            updateData.workspaceUse = dto.workspaceUse;
            logEntries.push({
                fieldName: 'workspaceUse',
                oldValue: workspace.workspaceUse,
                newValue: dto.workspaceUse,
            });
        }
        if (dto.managementType !== undefined &&
            dto.managementType !== workspace.managementType) {
            updateData.managementType = dto.managementType;
            logEntries.push({
                fieldName: 'managementType',
                oldValue: workspace.managementType,
                newValue: dto.managementType,
            });
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
        const inviteContext = await this.prepareInviteContext(workspaceId, inviterId, role);
        const result = await this.sendInviteToEmail(inviteContext, dto.email, dto.role);
        if (result.status === 'failed') {
            throw new common_1.InternalServerErrorException(result.message ?? 'Failed to send invite email');
        }
    }
    async sendBatchInvites(workspaceId, inviterId, role, dto) {
        const inviteContext = await this.prepareInviteContext(workspaceId, inviterId, role);
        const uniqueEmails = [...new Set(dto.emails.map((email) => email.trim().toLowerCase()))];
        const results = [];
        for (const email of uniqueEmails) {
            results.push(await this.sendInviteToEmail(inviteContext, email, dto.role));
        }
        return {
            results,
            summary: {
                total: results.length,
                invited: results.filter((result) => result.status === 'invited').length,
                alreadyMember: results.filter((result) => result.status === 'already_member').length,
                failed: results.filter((result) => result.status === 'failed').length,
            },
        };
    }
    async getInviteDetails(token) {
        const invite = await this.findPendingInviteByToken(token, {
            email: true,
            role: true,
            workspace: { select: { id: true, name: true } },
            sender: { select: { fullName: true } },
        });
        const existingUser = await this.prisma.user.findFirst({
            where: { email: invite.email.trim().toLowerCase(), deletedAt: null },
            select: { id: true, isEmailVerified: true },
        });
        return {
            workspaceId: invite.workspace.id,
            workspaceName: invite.workspace.name,
            invitedEmail: invite.email,
            role: invite.role,
            inviterName: invite.sender.fullName,
            nextStep: existingUser?.isEmailVerified ? 'login' : 'claim_account',
        };
    }
    async claimInvite(dto) {
        const invite = await this.findPendingInviteByToken(dto.token, {
            id: true,
            workspaceId: true,
            email: true,
            role: true,
        });
        const inviteEmail = invite.email.trim().toLowerCase();
        const fullName = dto.fullName.trim();
        const passwordHash = await bcrypt.hash(dto.password, PASSWORD_SALT_ROUNDS);
        const user = await this.prisma.$transaction(async (tx) => {
            const existingUser = await tx.user.findFirst({
                where: { email: inviteEmail, deletedAt: null },
                select: {
                    id: true,
                    fullName: true,
                    email: true,
                    avatarUrl: true,
                    avatarColor: true,
                    isEmailVerified: true,
                },
            });
            if (existingUser?.isEmailVerified) {
                throw new common_1.ConflictException(INVITE_ALREADY_REGISTERED_MESSAGE);
            }
            let authUser;
            if (existingUser) {
                authUser = await tx.user.update({
                    where: { id: existingUser.id },
                    data: {
                        fullName,
                        passwordHash,
                        isEmailVerified: true,
                    },
                    select: {
                        id: true,
                        fullName: true,
                        email: true,
                        avatarUrl: true,
                        avatarColor: true,
                    },
                });
                await tx.emailVerificationToken.deleteMany({
                    where: { userId: existingUser.id },
                });
            }
            else {
                authUser = await tx.user.create({
                    data: {
                        fullName,
                        email: inviteEmail,
                        passwordHash,
                        isEmailVerified: true,
                    },
                    select: {
                        id: true,
                        fullName: true,
                        email: true,
                        avatarUrl: true,
                        avatarColor: true,
                    },
                });
            }
            const existingMember = await tx.workspaceMember.findFirst({
                where: {
                    workspaceId: invite.workspaceId,
                    userId: authUser.id,
                    deletedAt: null,
                },
                select: { id: true },
            });
            await tx.workspaceInvite.update({
                where: { id: invite.id },
                data: { status: 'ACCEPTED', acceptedAt: new Date() },
            });
            if (!existingMember) {
                await tx.workspaceMember.create({
                    data: {
                        workspaceId: invite.workspaceId,
                        userId: authUser.id,
                        role: invite.role,
                    },
                });
            }
            return authUser;
        });
        const tokenPair = await this.authService.issueTokens(user);
        return {
            ...tokenPair,
            workspaceId: invite.workspaceId,
        };
    }
    async acceptInvite(token, userId, userEmail) {
        const invite = await this.findPendingInviteByToken(token, {
            id: true,
            workspaceId: true,
            email: true,
            role: true,
        });
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
    async prepareInviteContext(workspaceId, inviterId, role) {
        if (role !== 'OWNER')
            throw new common_1.ForbiddenException(OWNER_ONLY);
        const workspace = await this.prisma.workspace.findFirst({
            where: { id: workspaceId, deletedAt: null },
            select: { id: true, name: true },
        });
        if (!workspace)
            throw new common_1.NotFoundException(WORKSPACE_NOT_FOUND);
        const inviter = await this.prisma.user.findFirst({
            where: { id: inviterId, deletedAt: null },
            select: { fullName: true },
        });
        return {
            workspaceId: workspace.id,
            workspaceName: workspace.name,
            inviterId,
            inviterName: inviter?.fullName ?? 'A team member',
        };
    }
    async findPendingInviteByToken(token, select) {
        const invite = await this.prisma.workspaceInvite.findFirst({
            where: {
                inviteToken: this.hashToken(token),
                status: 'PENDING',
                expiresAt: { gt: new Date() },
            },
            select,
        });
        if (!invite) {
            throw new common_1.NotFoundException('Invite not found, already used, or expired');
        }
        return invite;
    }
    async sendInviteToEmail(inviteContext, email, inviteRole) {
        const inviteeEmail = email.trim().toLowerCase();
        const alreadyMember = await this.prisma.workspaceMember.findFirst({
            where: {
                workspaceId: inviteContext.workspaceId,
                deletedAt: null,
                user: { email: inviteeEmail, deletedAt: null },
            },
            select: { id: true },
        });
        if (alreadyMember) {
            return {
                email: inviteeEmail,
                status: 'already_member',
                message: null,
            };
        }
        await this.prisma.workspaceInvite.updateMany({
            where: {
                workspaceId: inviteContext.workspaceId,
                email: inviteeEmail,
                status: 'PENDING',
            },
            data: { status: 'REVOKED' },
        });
        const rawToken = (0, node_crypto_1.randomUUID)();
        const tokenHash = this.hashToken(rawToken);
        const invite = await this.prisma.workspaceInvite.create({
            data: {
                workspaceId: inviteContext.workspaceId,
                email: inviteeEmail,
                role: inviteRole,
                inviteToken: tokenHash,
                invitedBy: inviteContext.inviterId,
                status: 'PENDING',
                expiresAt: new Date(Date.now() + INVITE_TOKEN_TTL_MS),
            },
            select: { id: true },
        });
        const frontendUrl = process.env['FRONTEND_URL'] ?? 'http://localhost:3000';
        const inviteUrl = `${frontendUrl}/invite?token=${rawToken}`;
        try {
            await this.email.sendWorkspaceInviteEmail(inviteeEmail, inviteContext.inviterName, inviteContext.workspaceName, inviteUrl);
            return {
                email: inviteeEmail,
                status: 'invited',
                message: null,
            };
        }
        catch {
            await this.prisma.workspaceInvite.update({
                where: { id: invite.id },
                data: { status: 'REVOKED' },
            });
            return {
                email: inviteeEmail,
                status: 'failed',
                message: 'Failed to send invite email',
            };
        }
    }
    async assertActorIsOwner(workspaceId, actorId) {
        const actor = await this.prisma.workspaceMember.findFirst({
            where: { workspaceId, userId: actorId, deletedAt: null },
            select: { role: true },
        });
        if (!actor) {
            throw new common_1.ForbiddenException('You are not a member of this workspace');
        }
        if (actor.role !== 'OWNER') {
            throw new common_1.ForbiddenException('Only the workspace owner can perform this action');
        }
    }
    async removeMember(workspaceId, memberId, actorId) {
        await this.assertActorIsOwner(workspaceId, actorId);
        let member = await this.prisma.workspaceMember.findFirst({
            where: { id: memberId, workspaceId, deletedAt: null },
            select: { id: true, userId: true, user: { select: { fullName: true } } },
        });
        if (!member) {
            member = await this.prisma.workspaceMember.findFirst({
                where: { userId: memberId, workspaceId, deletedAt: null },
                select: { id: true, userId: true, user: { select: { fullName: true } } },
            });
        }
        if (!member) {
            throw new common_1.NotFoundException('Member not found');
        }
        await this.prisma.workspaceMember.update({
            where: { id: member.id },
            data: { deletedAt: new Date() },
        });
        await this.prisma.activityLog.create({
            data: {
                workspaceId,
                entityType: 'workspace',
                entityId: workspaceId,
                action: 'member_removed',
                metadata: {
                    memberId: member.userId,
                    memberName: member.user?.fullName ?? null,
                },
                performedBy: actorId,
            },
        });
    }
    async changeMemberRole(workspaceId, memberId, newRole, actorId) {
        await this.assertActorIsOwner(workspaceId, actorId);
        let member = await this.prisma.workspaceMember.findFirst({
            where: { id: memberId, workspaceId, deletedAt: null },
            select: { id: true, userId: true, role: true, user: { select: { fullName: true } } },
        });
        if (!member) {
            member = await this.prisma.workspaceMember.findFirst({
                where: { userId: memberId, workspaceId, deletedAt: null },
                select: { id: true, userId: true, role: true, user: { select: { fullName: true } } },
            });
        }
        if (!member) {
            throw new common_1.NotFoundException('Member not found');
        }
        const oldRole = member.role;
        if (oldRole === newRole)
            return;
        await this.prisma.workspaceMember.update({
            where: { id: member.id },
            data: { role: newRole },
        });
        await this.prisma.activityLog.create({
            data: {
                workspaceId,
                entityType: 'workspace',
                entityId: workspaceId,
                action: 'member_role_changed',
                fieldName: 'role',
                oldValue: oldRole,
                newValue: newRole,
                metadata: {
                    memberId: member.userId,
                    memberName: member.user?.fullName ?? null,
                },
                performedBy: actorId,
            },
        });
    }
};
exports.WorkspaceService = WorkspaceService;
exports.WorkspaceService = WorkspaceService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_1.PrismaService,
        common_2.EmailService,
        auth_service_1.AuthService])
], WorkspaceService);
//# sourceMappingURL=workspace.service.js.map