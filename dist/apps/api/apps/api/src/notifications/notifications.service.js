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
var NotificationsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsService = void 0;
const common_1 = require("@nestjs/common");
const database_1 = require("../../../../libs/database/src");
const sse_service_1 = require("./sse.service");
let NotificationsService = NotificationsService_1 = class NotificationsService {
    prisma;
    sse;
    logger = new common_1.Logger(NotificationsService_1.name);
    snoozeWatcher;
    constructor(prisma, sse) {
        this.prisma = prisma;
        this.sse = sse;
        this.startSnoozeWatcher();
    }
    onModuleDestroy() {
        if (this.snoozeWatcher)
            clearInterval(this.snoozeWatcher);
    }
    startSnoozeWatcher() {
        this.snoozeWatcher = setInterval(() => {
            this.processExpiredSnoozes().catch((err) => this.logger.debug('Snooze watcher error', err));
        }, 60_000);
    }
    async processExpiredSnoozes() {
        const now = new Date();
        const expired = await this.prisma.notification.findMany({
            where: { isSnoozed: true, snoozedAt: { lte: now }, isCleared: false },
        });
        if (!expired || expired.length === 0)
            return;
        for (const notif of expired) {
            const updated = await this.prisma.notification.update({
                where: { id: notif.id },
                data: { isSnoozed: false, snoozedAt: null },
            });
            const members = await this.prisma.workspaceMember.findMany({
                where: { userId: updated.userId, deletedAt: null },
                select: { id: true },
            });
            const payload = {
                id: updated.id,
                type: updated.type,
                title: updated.title,
                message: updated.message,
                referenceType: updated.referenceType,
                referenceId: updated.referenceId,
                actorId: updated.actorId,
                isRead: updated.isRead,
                isCleared: updated.isCleared,
                isSnoozed: updated.isSnoozed,
                snoozedAt: updated.snoozedAt,
                createdAt: updated.createdAt,
            };
            for (const m of members) {
                try {
                    this.sse.broadcastToMember(m.id, 'notification:created', payload);
                }
                catch (err) {
                    this.logger.debug('Failed broadcasting unsnoozed notification', err);
                }
            }
        }
    }
    async resolveWorkspaceMember(workspaceId, memberIdOrUserId) {
        let member = await this.prisma.workspaceMember.findFirst({
            where: { id: memberIdOrUserId, workspaceId, deletedAt: null },
            select: { id: true, userId: true },
        });
        if (!member) {
            member = await this.prisma.workspaceMember.findFirst({
                where: { userId: memberIdOrUserId, workspaceId, deletedAt: null },
                select: { id: true, userId: true },
            });
        }
        return member;
    }
    async createNotification(workspaceId, targetMemberIdOrUserId, actorUserId, type, title, message, referenceType, referenceId) {
        const member = await this.resolveWorkspaceMember(workspaceId, targetMemberIdOrUserId);
        if (!member) {
            this.logger.debug(`Notification: no member found for target ${targetMemberIdOrUserId} workspace=${workspaceId}`);
            return null;
        }
        if (member.userId === actorUserId)
            return null;
        const notif = await this.prisma.notification.create({
            data: {
                userId: member.userId,
                type,
                title,
                message: message ?? undefined,
                referenceType: referenceType ?? '',
                referenceId: referenceId ?? '',
                actorId: actorUserId ?? undefined,
                isCleared: false,
                isSnoozed: false,
                snoozedAt: null,
            },
        });
        try {
            if (!notif.isCleared && !notif.isSnoozed) {
                this.sse.broadcastToMember(member.id, 'notification:created', {
                    id: notif.id,
                    type: notif.type,
                    title: notif.title,
                    message: notif.message,
                    referenceType: notif.referenceType,
                    referenceId: notif.referenceId,
                    actorId: notif.actorId,
                    isRead: notif.isRead,
                    isCleared: notif.isCleared,
                    isSnoozed: notif.isSnoozed,
                    snoozedAt: notif.snoozedAt,
                    createdAt: notif.createdAt,
                });
            }
            else {
                this.logger.debug('Notification created but not broadcast (cleared or snoozed)');
            }
        }
        catch (err) {
            this.logger.debug('Failed to broadcast notification SSE', err);
        }
        return notif;
    }
    async notifyTaskAssignees(workspaceId, taskId, actorUserId, opts) {
        const assignees = await this.prisma.taskAssignee.findMany({ where: { taskId }, select: { userId: true } });
        const exclude = new Set(opts?.excludeUserIds ?? []);
        for (const a of assignees) {
            if (a.userId === actorUserId)
                continue;
            if (exclude.has(a.userId))
                continue;
            await this.createNotification(workspaceId, a.userId, actorUserId, opts?.type ?? 'task:updated', opts?.title ?? 'Task updated', opts?.message ?? undefined, 'task', taskId);
        }
    }
};
exports.NotificationsService = NotificationsService;
exports.NotificationsService = NotificationsService = NotificationsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_1.PrismaService, sse_service_1.NotificationsSseService])
], NotificationsService);
//# sourceMappingURL=notifications.service.js.map