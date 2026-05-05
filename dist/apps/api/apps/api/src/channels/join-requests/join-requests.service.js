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
exports.JoinRequestsService = void 0;
const common_1 = require("@nestjs/common");
const database_1 = require("../../../../../libs/database/src");
const chat_system_service_1 = require("../../chat/chat-system.service");
const notifications_service_1 = require("../../notifications/notifications.service");
const JOIN_REQUEST_STATUSES = [
    'PENDING',
    'APPROVED',
    'REJECTED',
];
let JoinRequestsService = class JoinRequestsService {
    prisma;
    chatSystem;
    notifications;
    constructor(prisma, chatSystem, notifications) {
        this.prisma = prisma;
        this.chatSystem = chatSystem;
        this.notifications = notifications;
    }
    channelLabel(name) {
        return name?.trim() || 'this channel';
    }
    joinRequestInclude() {
        return {
            user: {
                select: { id: true, fullName: true, avatarUrl: true },
            },
            decidedBy: {
                select: { id: true, fullName: true, avatarUrl: true },
            },
        };
    }
    async getChannelOrThrow(workspaceId, channelId) {
        const channel = await this.prisma.channel.findFirst({
            where: { id: channelId, workspaceId },
            select: {
                id: true,
                workspaceId: true,
                kind: true,
                name: true,
                privacy: true,
            },
        });
        if (!channel) {
            throw new common_1.NotFoundException('Channel not found in workspace');
        }
        return channel;
    }
    async assertChannelAdmin(channelId, userId) {
        const membership = await this.prisma.channelMember.findFirst({
            where: { channelId, userId },
            select: { role: true },
        });
        if (!membership ||
            (membership.role !== 'OWNER' && membership.role !== 'ADMIN')) {
            throw new common_1.ForbiddenException('Only channel admins can manage join requests');
        }
        return membership;
    }
    async createRequest(workspaceId, channelId, requesterUserId) {
        const channel = await this.getChannelOrThrow(workspaceId, channelId);
        if (channel.kind !== 'CHANNEL') {
            throw new common_1.BadRequestException('Join requests are only supported for channels');
        }
        if (channel.privacy !== 'PUBLIC') {
            throw new common_1.ForbiddenException('Private channels are invite-only');
        }
        const existingMember = await this.prisma.channelMember.findFirst({
            where: { channelId, userId: requesterUserId },
            select: { id: true },
        });
        if (existingMember) {
            throw new common_1.BadRequestException('You are already a member of this channel');
        }
        const existingPending = await this.prisma.channelJoinRequest.findFirst({
            where: {
                channelId,
                userId: requesterUserId,
                status: 'PENDING',
            },
            select: { id: true },
        });
        if (existingPending) {
            throw new common_1.BadRequestException('A join request is already pending for this channel');
        }
        return this.prisma.channelJoinRequest.create({
            data: {
                channelId,
                userId: requesterUserId,
            },
            include: this.joinRequestInclude(),
        });
    }
    async listRequests(workspaceId, channelId, callerUserId, status) {
        await this.getChannelOrThrow(workspaceId, channelId);
        await this.assertChannelAdmin(channelId, callerUserId);
        const normalizedStatus = status?.toUpperCase();
        if (normalizedStatus &&
            !JOIN_REQUEST_STATUSES.includes(normalizedStatus)) {
            throw new common_1.BadRequestException('Invalid join request status');
        }
        return this.prisma.channelJoinRequest.findMany({
            where: {
                channelId,
                ...(normalizedStatus
                    ? { status: normalizedStatus }
                    : {}),
            },
            include: this.joinRequestInclude(),
            orderBy: [{ requestedAt: 'desc' }, { id: 'desc' }],
        });
    }
    async getMyRequestStatus(workspaceId, channelId, userId) {
        await this.getChannelOrThrow(workspaceId, channelId);
        return this.prisma.channelJoinRequest.findFirst({
            where: { channelId, userId },
            include: this.joinRequestInclude(),
            orderBy: [{ requestedAt: 'desc' }, { id: 'desc' }],
        });
    }
    async decideRequest(workspaceId, channelId, requestId, callerUserId, decision) {
        const channel = await this.getChannelOrThrow(workspaceId, channelId);
        await this.assertChannelAdmin(channelId, callerUserId);
        const request = await this.prisma.channelJoinRequest.findUnique({
            where: { id: requestId },
            include: this.joinRequestInclude(),
        });
        if (!request || request.channelId !== channelId) {
            throw new common_1.NotFoundException('Join request not found for this channel');
        }
        if (request.status !== 'PENDING') {
            throw new common_1.BadRequestException('Only pending join requests can be decided');
        }
        const decisionStatus = decision === 'approve' ? 'APPROVED' : 'REJECTED';
        const updated = await this.prisma.$transaction(async (tx) => {
            const updatedRequest = await tx.channelJoinRequest.update({
                where: { id: requestId },
                data: {
                    status: decisionStatus,
                    decidedById: callerUserId,
                    decidedAt: new Date(),
                },
                include: this.joinRequestInclude(),
            });
            if (decisionStatus === 'APPROVED') {
                const workspaceMember = await tx.workspaceMember.findFirst({
                    where: { workspaceId, userId: request.userId, deletedAt: null },
                    select: { id: true },
                });
                if (!workspaceMember) {
                    throw new common_1.BadRequestException('Requester is no longer a member of this workspace');
                }
                const existingMember = await tx.channelMember.findFirst({
                    where: { channelId, userId: request.userId },
                    select: { id: true },
                });
                if (!existingMember) {
                    await tx.channelMember.create({
                        data: {
                            channelId,
                            userId: request.userId,
                            role: 'MEMBER',
                        },
                    });
                    await this.chatSystem.emit(channelId, {
                        event: 'member_joined',
                        userId: request.userId,
                        actorUserId: callerUserId,
                        source: 'join_request',
                    }, tx);
                }
                await tx.activityLog.create({
                    data: {
                        workspaceId,
                        entityType: 'channel',
                        entityId: channelId,
                        action: 'join_request_approved',
                        metadata: { requestId, userId: request.userId },
                        performedBy: callerUserId,
                    },
                });
            }
            else {
                await tx.activityLog.create({
                    data: {
                        workspaceId,
                        entityType: 'channel',
                        entityId: channelId,
                        action: 'join_request_rejected',
                        metadata: { requestId, userId: request.userId },
                        performedBy: callerUserId,
                    },
                });
            }
            return updatedRequest;
        });
        if (decisionStatus === 'APPROVED') {
            try {
                const actor = await this.prisma.user.findUnique({
                    where: { id: callerUserId },
                    select: { fullName: true },
                });
                const channelName = this.channelLabel(channel.name);
                await this.notifications.createNotification(workspaceId, request.userId, callerUserId, 'channel:member_added', `Added to channel ${channelName}`, `${actor?.fullName ?? 'A member'} approved your request to join ${channelName} as member`, 'channel', channelId, false);
            }
            catch { }
        }
        return updated;
    }
};
exports.JoinRequestsService = JoinRequestsService;
exports.JoinRequestsService = JoinRequestsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_1.PrismaService,
        chat_system_service_1.ChatSystemService,
        notifications_service_1.NotificationsService])
], JoinRequestsService);
//# sourceMappingURL=join-requests.service.js.map