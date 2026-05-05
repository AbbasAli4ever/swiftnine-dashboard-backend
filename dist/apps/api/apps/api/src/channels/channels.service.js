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
const chat_system_service_1 = require("../chat/chat-system.service");
let ChannelsService = class ChannelsService {
    prisma;
    notifications;
    chatSystem;
    constructor(prisma, notifications, chatSystem) {
        this.prisma = prisma;
        this.notifications = notifications;
        this.chatSystem = chatSystem;
    }
    channelLabel(name) {
        return name?.trim() || 'this channel';
    }
    channelInclude() {
        return {
            members: {
                include: {
                    user: { select: { id: true, fullName: true, avatarUrl: true } },
                },
            },
            project: true,
        };
    }
    async listByWorkspace(workspaceId, userId) {
        return this.prisma.channel.findMany({
            where: {
                workspaceId,
                OR: [
                    { privacy: 'PUBLIC' },
                    { privacy: 'PRIVATE', members: { some: { userId } } },
                ],
            },
            include: this.channelInclude(),
            orderBy: { createdAt: 'asc' },
        });
    }
    async listByProject(workspaceId, projectId, userId) {
        const project = await this.prisma.project.findFirst({
            where: { id: projectId, workspaceId, deletedAt: null },
            select: { id: true },
        });
        if (!project)
            throw new common_1.NotFoundException('Project not found in workspace');
        return this.prisma.channel.findMany({
            where: {
                workspaceId,
                projectId,
                OR: [
                    { privacy: 'PUBLIC' },
                    { privacy: 'PRIVATE', members: { some: { userId } } },
                ],
            },
            include: this.channelInclude(),
            orderBy: { createdAt: 'asc' },
        });
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
            await tx.channelMember.create({
                data: { channelId: channel.id, userId, role: 'OWNER' },
            });
            await this.chatSystem.emit(channel.id, {
                event: 'channel_created',
                actorUserId: userId,
                channelName: channel.name,
                privacy: channel.privacy,
                projectId: channel.projectId,
            }, tx);
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
                include: this.channelInclude(),
            });
        });
    }
    async updateChannel(workspaceId, channelId, callerUserId, dto) {
        const channel = await this.prisma.channel.findFirst({
            where: { id: channelId, workspaceId },
            select: { id: true, name: true, privacy: true },
        });
        if (!channel)
            throw new common_1.NotFoundException('Channel not found in workspace');
        const callerMembership = await this.prisma.channelMember.findFirst({
            where: { channelId, userId: callerUserId },
            select: { role: true },
        });
        if (!callerMembership ||
            (callerMembership.role !== 'OWNER' && callerMembership.role !== 'ADMIN')) {
            throw new common_1.ForbiddenException('Only channel admins can update the channel');
        }
        const updateData = {};
        if (dto.name !== undefined)
            updateData.name = dto.name.trim();
        if (Object.prototype.hasOwnProperty.call(dto, 'description')) {
            updateData.description =
                dto.description === null
                    ? null
                    : (dto.description ?? '').trim() || null;
        }
        if (dto.privacy !== undefined)
            updateData.privacy = dto.privacy;
        if (Object.keys(updateData).length === 0) {
            throw new common_1.BadRequestException('At least one field must be provided');
        }
        return this.prisma.$transaction(async (tx) => {
            const updated = await tx.channel.update({
                where: { id: channelId },
                data: updateData,
                include: this.channelInclude(),
            });
            if (updateData.name !== undefined && updateData.name !== channel.name) {
                await this.chatSystem.emit(channelId, {
                    event: 'channel_renamed',
                    actorUserId: callerUserId,
                    name: updateData.name,
                }, tx);
            }
            if (updateData.privacy !== undefined &&
                updateData.privacy !== channel.privacy) {
                await this.chatSystem.emit(channelId, {
                    event: 'channel_privacy_changed',
                    actorUserId: callerUserId,
                    privacy: updateData.privacy,
                }, tx);
            }
            return updated;
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
        const channel = await this.prisma.channel.findFirst({
            where: { id: channelId, workspaceId },
        });
        if (!channel)
            throw new common_1.NotFoundException('Channel not found in workspace');
        const callerMembership = await this.prisma.channelMember.findFirst({
            where: { channelId, userId: callerUserId },
        });
        if (!callerMembership ||
            (callerMembership.role !== 'OWNER' && callerMembership.role !== 'ADMIN')) {
            throw new common_1.ForbiddenException('Only channel admins can add members');
        }
        const workspaceMember = await this.prisma.workspaceMember.findFirst({
            where: { workspaceId, userId },
        });
        if (!workspaceMember) {
            throw new common_1.NotFoundException('User is not a member of this workspace');
        }
        return this.prisma
            .$transaction(async (tx) => {
            const existing = await tx.channelMember.findFirst({
                where: { channelId, userId },
            });
            let result;
            let systemEvent = null;
            if (existing) {
                if (existing.role === role) {
                    result = existing;
                }
                else {
                    result = await tx.channelMember.update({
                        where: { id: existing.id },
                        data: { role },
                    });
                    systemEvent = 'member_role_changed';
                }
            }
            else {
                result = await tx.channelMember.create({
                    data: { channelId, userId, role },
                });
                systemEvent = 'member_joined';
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
            if (systemEvent) {
                await this.chatSystem.emit(channelId, {
                    event: systemEvent,
                    userId,
                    role,
                    actorUserId: callerUserId,
                }, tx);
            }
            return result;
        })
            .then(async (created) => {
            const actor = await this.prisma.user.findUnique({
                where: { id: callerUserId },
                select: { fullName: true },
            });
            const _role = role;
            const roleLabel = _role === 'OWNER' ? 'owner' : _role === 'ADMIN' ? 'admin' : 'member';
            const channelName = this.channelLabel(channel.name);
            const title = `Added to channel ${channelName}`;
            const message = `${actor?.fullName ?? 'A member'} added you to ${channelName} as ${roleLabel}`;
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
        const channel = await this.prisma.channel.findFirst({
            where: { id: channelId, workspaceId },
        });
        if (!channel)
            throw new common_1.NotFoundException('Channel not found in workspace');
        const callerMembership = await this.prisma.channelMember.findFirst({
            where: { channelId, userId: callerUserId },
        });
        if (!callerMembership ||
            (callerMembership.role !== 'OWNER' && callerMembership.role !== 'ADMIN')) {
            throw new common_1.ForbiddenException('Only channel admins can add members');
        }
        const userIds = Array.from(new Set(members.map((m) => m.userId)));
        const workspaceMembers = await this.prisma.workspaceMember.findMany({
            where: { workspaceId, userId: { in: userIds } },
            select: { userId: true },
        });
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
                const existing = await tx.channelMember.findFirst({
                    where: { channelId, userId: m.userId },
                });
                let res;
                if (existing) {
                    if (existing.role === role) {
                        res = existing;
                    }
                    else {
                        res = await tx.channelMember.update({
                            where: { id: existing.id },
                            data: { role },
                        });
                        await this.chatSystem.emit(channelId, {
                            event: 'member_role_changed',
                            userId: m.userId,
                            role,
                            actorUserId: callerUserId,
                        }, tx);
                    }
                }
                else {
                    res = await tx.channelMember.create({
                        data: { channelId, userId: m.userId, role },
                    });
                    toNotify.push({ userId: m.userId, role });
                    await this.chatSystem.emit(channelId, {
                        event: 'member_joined',
                        userId: m.userId,
                        role,
                        actorUserId: callerUserId,
                    }, tx);
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
        const actor = await this.prisma.user.findUnique({
            where: { id: callerUserId },
            select: { fullName: true },
        });
        const channelName = this.channelLabel(channel.name);
        const title = `Added to channel ${channelName}`;
        for (const n of toNotify) {
            const _nRole = n.role;
            const roleLabel = _nRole === 'OWNER' ? 'owner' : _nRole === 'ADMIN' ? 'admin' : 'member';
            const message = `${actor?.fullName ?? 'A member'} added you to ${channelName} as ${roleLabel}`;
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
        if (!cm ||
            cm.channel.id !== channelId ||
            cm.channel.workspaceId !== workspaceId) {
            throw new common_1.NotFoundException('Channel member not found in workspace');
        }
        const caller = await this.prisma.channelMember.findFirst({
            where: { channelId, userId: callerUserId },
        });
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
        await this.prisma.$transaction(async (tx) => {
            await tx.channelMember.delete({ where: { id: channelMemberId } });
            await this.chatSystem.emit(channelId, {
                event: 'member_removed',
                userId: cm.userId,
                role: cm.role,
                actorUserId: callerUserId,
            }, tx);
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
            const actor = await this.prisma.user.findUnique({
                where: { id: callerUserId },
                select: { fullName: true },
            });
            const _cmRole = cm.role;
            const roleLabel = _cmRole === 'OWNER'
                ? 'owner'
                : _cmRole === 'ADMIN'
                    ? 'admin'
                    : 'member';
            const channelName = this.channelLabel(cm.channel.name);
            const title = `Removed from channel ${channelName}`;
            const message = `${actor?.fullName ?? 'A member'} removed you from ${channelName} (was ${roleLabel})`;
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
    __metadata("design:paramtypes", [database_1.PrismaService,
        notifications_service_1.NotificationsService,
        chat_system_service_1.ChatSystemService])
], ChannelsService);
//# sourceMappingURL=channels.service.js.map