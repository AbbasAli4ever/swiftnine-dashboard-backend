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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const workspace_guard_1 = require("../workspace/workspace.guard");
const sse_service_1 = require("./sse.service");
const database_1 = require("../../../../libs/database/src");
const patch_notification_clear_dto_1 = require("./dto/patch-notification-clear.dto");
const patch_notification_snooze_dto_1 = require("./dto/patch-notification-snooze.dto");
const patch_notification_read_dto_1 = require("./dto/patch-notification-read.dto");
let NotificationsController = class NotificationsController {
    sse;
    prisma;
    constructor(sse, prisma) {
        this.sse = sse;
        this.prisma = prisma;
    }
    async findOwnedNotification(req, id) {
        const notif = await this.prisma.notification.findUnique({ where: { id } });
        if (!notif)
            throw new common_1.NotFoundException('Notification not found');
        if (notif.userId !== req.user.id)
            throw new common_1.ForbiddenException('Cannot modify another user\'s notification');
        return notif;
    }
    async getCurrentWorkspaceMember(req) {
        const member = await this.prisma.workspaceMember.findFirst({
            where: { userId: req.user.id, workspaceId: req.workspaceContext.workspaceId, deletedAt: null },
            select: { id: true, userId: true },
        });
        if (!member)
            throw new common_1.NotFoundException('Member not found');
        return member;
    }
    toNotificationPayload(notification) {
        return {
            id: notification.id,
            type: notification.type,
            title: notification.title,
            message: notification.message,
            referenceType: notification.referenceType,
            referenceId: notification.referenceId,
            actorId: notification.actorId,
            isRead: notification.isRead,
            isCleared: notification.isCleared,
            isSnoozed: notification.isSnoozed,
            snoozedAt: notification.snoozedAt,
            createdAt: notification.createdAt,
        };
    }
    async broadcastUpdatedNotification(req, notification) {
        const member = await this.prisma.workspaceMember.findFirst({
            where: { userId: req.user.id, workspaceId: req.workspaceContext.workspaceId, deletedAt: null },
            select: { id: true },
        });
        if (!member)
            return;
        try {
            this.sse.broadcastToMember(member.id, 'notification:updated', this.toNotificationPayload(notification));
        }
        catch (err) { }
    }
    async stream(req, memberId, res) {
        let member = await this.prisma.workspaceMember.findFirst({
            where: { id: memberId, workspaceId: req.workspaceContext.workspaceId, deletedAt: null },
            select: { id: true, userId: true },
        });
        if (!member) {
            member = await this.prisma.workspaceMember.findFirst({
                where: { userId: memberId, workspaceId: req.workspaceContext.workspaceId, deletedAt: null },
                select: { id: true, userId: true },
            });
        }
        if (!member)
            throw new common_1.NotFoundException('Member not found');
        if (member.userId !== req.user.id)
            throw new common_1.ForbiddenException('Cannot open notification stream for another member');
        this.sse.registerClient(member.id, res);
        await this.prisma.notification.updateMany({
            where: { userId: member.userId, isSnoozed: true, snoozedAt: { lte: new Date() } },
            data: { isSnoozed: false, snoozedAt: null },
        });
        const notifs = await this.prisma.notification.findMany({
            where: { userId: member.userId, isCleared: false, isSnoozed: false },
            orderBy: { createdAt: 'desc' },
            take: 200,
        });
        this.sse.sendToClient(res, 'notifications:init', notifs);
    }
    async updateNotificationClear(req, id, dto) {
        await this.findOwnedNotification(req, id);
        if (typeof dto.isCleared !== 'boolean') {
            throw new common_1.BadRequestException('isCleared must be boolean');
        }
        const updateData = { isCleared: dto.isCleared };
        if (dto.isCleared) {
            updateData.isSnoozed = false;
            updateData.snoozedAt = null;
            updateData.isRead = false;
            updateData.readAt = null;
        }
        const updated = await this.prisma.notification.update({ where: { id }, data: updateData });
        await this.broadcastUpdatedNotification(req, updated);
        return updated;
    }
    async updateNotificationSnooze(req, id, dto) {
        await this.findOwnedNotification(req, id);
        if (typeof dto.isSnoozed !== 'boolean') {
            throw new common_1.BadRequestException('isSnoozed must be boolean');
        }
        if (!dto.isSnoozed && dto.snoozeUntil !== undefined) {
            throw new common_1.BadRequestException('snoozeUntil can only be provided when isSnoozed=true');
        }
        const updateData = {};
        if (!dto.isSnoozed) {
            updateData.isSnoozed = false;
            updateData.snoozedAt = null;
        }
        else {
            let until = null;
            if (dto.snoozeUntil) {
                const d = new Date(dto.snoozeUntil);
                if (isNaN(d.getTime()))
                    throw new common_1.BadRequestException('Invalid snoozeUntil datetime');
                if (d.getTime() <= Date.now()) {
                    throw new common_1.BadRequestException('snoozeUntil must be a future datetime');
                }
                until = d;
            }
            updateData.isSnoozed = true;
            updateData.snoozedAt = until;
            updateData.isCleared = false;
            updateData.isRead = false;
            updateData.readAt = null;
        }
        const updated = await this.prisma.notification.update({ where: { id }, data: updateData });
        await this.broadcastUpdatedNotification(req, updated);
        return updated;
    }
    async updateNotificationRead(req, id, dto) {
        await this.findOwnedNotification(req, id);
        if (typeof dto.isRead !== 'boolean') {
            throw new common_1.BadRequestException('isRead must be boolean');
        }
        const updateData = {
            isRead: dto.isRead,
            readAt: dto.isRead ? new Date() : null,
        };
        if (dto.isRead) {
            updateData.isCleared = false;
            updateData.isSnoozed = false;
            updateData.snoozedAt = null;
        }
        const updated = await this.prisma.notification.update({ where: { id }, data: updateData });
        await this.broadcastUpdatedNotification(req, updated);
        return updated;
    }
    async getCleared(req) {
        const member = await this.getCurrentWorkspaceMember(req);
        const notifs = await this.prisma.notification.findMany({
            where: { userId: member.userId, isCleared: true },
            orderBy: { createdAt: 'desc' },
            take: 500,
        });
        return notifs;
    }
    async getSnoozed(req) {
        const member = await this.getCurrentWorkspaceMember(req);
        await this.prisma.notification.updateMany({
            where: { userId: member.userId, isSnoozed: true, snoozedAt: { lte: new Date() } },
            data: { isSnoozed: false, snoozedAt: null },
        });
        const notifs = await this.prisma.notification.findMany({
            where: { userId: member.userId, isSnoozed: true },
            orderBy: { snoozedAt: 'asc' },
            take: 500,
        });
        return notifs;
    }
};
exports.NotificationsController = NotificationsController;
__decorate([
    (0, common_1.Get)('members/:memberId/stream'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, workspace_guard_1.WorkspaceGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiHeader)({ name: 'x-workspace-id', required: true }),
    (0, swagger_1.ApiOperation)({ summary: 'Open SSE stream for workspace member notifications' }),
    (0, swagger_1.ApiParam)({ name: 'memberId', description: 'Workspace member id or user id' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('memberId')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "stream", null);
__decorate([
    (0, common_1.Patch)(':id/clear'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, workspace_guard_1.WorkspaceGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Set notification clear state' }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiHeader)({ name: 'x-workspace-id', required: true }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, patch_notification_clear_dto_1.PatchNotificationClearDto]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "updateNotificationClear", null);
__decorate([
    (0, common_1.Patch)(':id/snooze'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, workspace_guard_1.WorkspaceGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Set notification snooze state and optional snooze expiry' }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiHeader)({ name: 'x-workspace-id', required: true }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, patch_notification_snooze_dto_1.PatchNotificationSnoozeDto]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "updateNotificationSnooze", null);
__decorate([
    (0, common_1.Patch)(':id/read'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, workspace_guard_1.WorkspaceGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Set notification read state' }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiHeader)({ name: 'x-workspace-id', required: true }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, patch_notification_read_dto_1.PatchNotificationReadDto]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "updateNotificationRead", null);
__decorate([
    (0, common_1.Get)('cleared'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, workspace_guard_1.WorkspaceGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Get cleared notifications for current member' }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiHeader)({ name: 'x-workspace-id', required: true }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "getCleared", null);
__decorate([
    (0, common_1.Get)('snoozed'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, workspace_guard_1.WorkspaceGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Get currently snoozed notifications for current member' }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiHeader)({ name: 'x-workspace-id', required: true }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "getSnoozed", null);
exports.NotificationsController = NotificationsController = __decorate([
    (0, swagger_1.ApiTags)('notifications'),
    (0, common_1.Controller)('notifications'),
    __metadata("design:paramtypes", [sse_service_1.NotificationsSseService, database_1.PrismaService])
], NotificationsController);
//# sourceMappingURL=notifications.controller.js.map