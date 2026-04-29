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
exports.ChannelsService = void 0;
const common_1 = require("@nestjs/common");
const database_1 = require("../../../../libs/database/src");
const notifications_service_1 = require("../notifications/notifications.service");
let ChannelsService = class ChannelsService {
    prisma;
    notifications;
    constructor(prisma, notifications) {
        this.prisma = prisma;
        this.notifications = notifications;
    }
    async create(workspaceId, userId, dto) {
        if (dto.projectId) {
            const project = await this.prisma.project.findFirst({
                where: { id: dto.projectId, workspaceId, deletedAt: null },
                select: { id: true },
            });
            if (!project)
                throw new common_1.NotFoundException('Project not found in workspace');
        }
        return this.prisma.$transaction(async (tx) => {
            const channel = await tx.channel.create({
                data: {
                    workspaceId,
                    projectId: dto.projectId ?? null,
                    name: dto.name.trim(),
                    description: dto.description?.trim() ?? null,
                    privacy: dto.privacy ?? 'PUBLIC',
                    createdBy: userId,
                },
            });
            await tx.channelMember.create({ data: { channelId: channel.id, userId, role: 'OWNER' } });
            await tx.activityLog.create({
                data: {
                    workspaceId,
                    entityType: 'channel',
                    entityId: channel.id,
                    action: 'created',
                    metadata: { channelName: channel.name },
                    performedBy: userId,
                },
            });
            return tx.channel.findFirst({
                where: { id: channel.id },
                include: { members: { include: { user: { select: { id: true, fullName: true, avatarUrl: true } } } }, project: true },
            });
        });
    }
    mapRoleInput(input) {
        const normalized = (input ?? '').toLowerCase();
        if (normalized === 'admin')
            return 'ADMIN';
        return 'MEMBER';
    }
    async addChannelMember(workspaceId, channelId, callerUserId, userId, roleInput) {
        const role = this.mapRoleInput(roleInput);
        const channel = await this.prisma.channel.findFirst({ where: { id: channelId, workspaceId } });
        if (!channel)
            throw new common_1.NotFoundException('Channel not found in workspace');
        const callerMembership = await this.prisma.channelMember.findFirst({ where: { channelId, userId: callerUserId } });
        if (!callerMembership || (callerMembership.role !== 'OWNER' && callerMembership.role !== 'ADMIN')) {
            throw new common_1.ForbiddenException('Only channel admins can add members');
        }
        const workspaceMember = await this.prisma.workspaceMember.findFirst({ where: { workspaceId, userId } });
        if (!workspaceMember) {
            throw new common_1.NotFoundException('User is not a member of this workspace');
        }
        return this.prisma.$transaction(async (tx) => {
            const existing = await tx.channelMember.findFirst({ where: { channelId, userId } });
            let result;
            if (existing) {
                if (existing.role === role) {
                    result = existing;
                }
                else {
                    result = await tx.channelMember.update({ where: { id: existing.id }, data: { role } });
                }
            }
            else {
                result = await tx.channelMember.create({ data: { channelId, userId, role } });
            }
            await tx.activityLog.create({
                data: {
                    workspaceId,
                    entityType: 'channel',
                    entityId: channelId,
                    action: existing ? 'member_role_changed' : 'member_added',
                    metadata: { userId, role },
                    performedBy: callerUserId,
                },
            });
            return result;
        }).then(async (created) => {
            const actor = await this.prisma.user.findUnique({ where: { id: callerUserId }, select: { fullName: true } });
            const _role = role;
            const roleLabel = _role === 'OWNER' ? 'owner' : _role === 'ADMIN' ? 'admin' : 'member';
            const title = `Added to channel ${channel.name}`;
            const message = `${actor?.fullName ?? 'A member'} added you to ${channel.name} as ${roleLabel}`;
            try {
                await this.notifications.createNotification(workspaceId, userId, callerUserId, 'channel:member_added', title, message, 'channel', channelId, false);
            }
            catch (err) {
            }
            return created;
        });
    }
    async addChannelMembersBulk(workspaceId, channelId, callerUserId, members) {
        if (!Array.isArray(members) || members.length === 0)
            throw new common_1.BadRequestException('members must be a non-empty array');
        const channel = await this.prisma.channel.findFirst({ where: { id: channelId, workspaceId } });
        if (!channel)
            throw new common_1.NotFoundException('Channel not found in workspace');
        const callerMembership = await this.prisma.channelMember.findFirst({ where: { channelId, userId: callerUserId } });
        if (!callerMembership || (callerMembership.role !== 'OWNER' && callerMembership.role !== 'ADMIN')) {
            throw new common_1.ForbiddenException('Only channel admins can add members');
        }
        const userIds = Array.from(new Set(members.map((m) => m.userId)));
        const workspaceMembers = await this.prisma.workspaceMember.findMany({ where: { workspaceId, userId: { in: userIds } }, select: { userId: true } });
        const existingUserIds = new Set(workspaceMembers.map((w) => w.userId));
        const missing = userIds.filter((id) => !existingUserIds.has(id));
        if (missing.length > 0) {
            throw new common_1.BadRequestException(`Some users are not members of the workspace: ${missing.join(',')}`);
        }
        const results = [];
        const toNotify = [];
        await this.prisma.$transaction(async (tx) => {
            for (const m of members) {
                const role = this.mapRoleInput(m.role);
                const existing = await tx.channelMember.findFirst({ where: { channelId, userId: m.userId } });
                let res;
                if (existing) {
                    if (existing.role === role) {
                        res = existing;
                    }
                    else {
                        res = await tx.channelMember.update({ where: { id: existing.id }, data: { role } });
                    }
                }
                else {
                    res = await tx.channelMember.create({ data: { channelId, userId: m.userId, role } });
                    toNotify.push({ userId: m.userId, role });
                }
                await tx.activityLog.create({
                    data: {
                        workspaceId,
                        entityType: 'channel',
                        entityId: channelId,
                        action: existing ? 'member_role_changed' : 'member_added',
                        metadata: { userId: m.userId, role },
                        performedBy: callerUserId,
                    },
                });
                results.push(res);
            }
        });
        const actor = await this.prisma.user.findUnique({ where: { id: callerUserId }, select: { fullName: true } });
        const title = `Added to channel ${channel.name}`;
        for (const n of toNotify) {
            const _nRole = n.role;
            const roleLabel = _nRole === 'OWNER' ? 'owner' : _nRole === 'ADMIN' ? 'admin' : 'member';
            const message = `${actor?.fullName ?? 'A member'} added you to ${channel.name} as ${roleLabel}`;
            try {
                await this.notifications.createNotification(workspaceId, n.userId, callerUserId, 'channel:member_added', title, message, 'channel', channelId, false);
            }
            catch (err) {
            }
        }
        return results;
    }
    async removeChannelMember(workspaceId, channelId, callerUserId, channelMemberId) {
        const cm = await this.prisma.channelMember.findUnique({
            where: { id: channelMemberId },
            include: { channel: true },
        });
        if (!cm || cm.channel.id !== channelId || cm.channel.workspaceId !== workspaceId) {
            throw new common_1.NotFoundException('Channel member not found in workspace');
        }
        const caller = await this.prisma.channelMember.findFirst({ where: { channelId, userId: callerUserId } });
        if (!caller || (caller.role !== 'OWNER' && caller.role !== 'ADMIN')) {
            throw new common_1.ForbiddenException('Only channel admins can remove members');
        }
        if (cm.userId === callerUserId) {
            throw new common_1.ForbiddenException('Cannot remove yourself from the channel');
        }
        if (cm.role === 'OWNER') {
            throw new common_1.ForbiddenException('Cannot remove channel owner');
        }
        if (cm.role === 'ADMIN' && caller.role !== 'OWNER') {
            throw new common_1.ForbiddenException('Only channel owner can remove an admin');
        }
        const deleted = await this.prisma.$transaction(async (tx) => {
            await tx.channelMember.delete({ where: { id: channelMemberId } });
            await tx.activityLog.create({
                data: {
                    workspaceId,
                    entityType: 'channel',
                    entityId: channelId,
                    action: 'member_removed',
                    metadata: { userId: cm.userId, role: cm.role },
                    performedBy: callerUserId,
                },
            });
        });
        try {
            const actor = await this.prisma.user.findUnique({ where: { id: callerUserId }, select: { fullName: true } });
            const _cmRole = cm.role;
            const roleLabel = _cmRole === 'OWNER' ? 'owner' : _cmRole === 'ADMIN' ? 'admin' : 'member';
            const title = `Removed from channel ${cm.channel.name}`;
            const message = `${actor?.fullName ?? 'A member'} removed you from ${cm.channel.name} (was ${roleLabel})`;
            await this.notifications.createNotification(workspaceId, cm.userId, callerUserId, 'channel:member_removed', title, message, 'channel', channelId, false);
        }
        catch (err) {
        }
        return true;
    }
};
exports.ChannelsService = ChannelsService;
exports.ChannelsService = ChannelsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_1.PrismaService, notifications_service_1.NotificationsService])
], ChannelsService);
//# sourceMappingURL=channels.service.js.map