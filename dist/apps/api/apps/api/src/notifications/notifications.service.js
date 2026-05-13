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
const project_security_service_1 = require("../project-security/project-security.service");
const sse_service_1 = require("./sse.service");
let NotificationsService = NotificationsService_1 = class NotificationsService {
    prisma;
    projectSecurity;
    sse;
    logger = new common_1.Logger(NotificationsService_1.name);
    snoozeWatcher;
    retentionWatcher;
    constructor(prisma, projectSecurity, sse) {
        this.prisma = prisma;
        this.projectSecurity = projectSecurity;
        this.sse = sse;
        this.startSnoozeWatcher();
        this.startRetentionWatcher();
    }
    onModuleDestroy() {
        if (this.snoozeWatcher)
            clearInterval(this.snoozeWatcher);
        if (this.retentionWatcher)
            clearInterval(this.retentionWatcher);
    }
    startSnoozeWatcher() {
        this.snoozeWatcher = setInterval(() => {
            this.processExpiredSnoozes().catch((err) => this.logger.debug('Snooze watcher error', err));
        }, 60_000);
    }
    startRetentionWatcher() {
        this.retentionWatcher = setInterval(() => {
            this.deleteExpiredNotifications().catch((err) => this.logger.debug('Retention watcher error', err));
        }, this.retentionCleanupIntervalMs());
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
            if (!(await this.isNotificationVisibleToUser(updated.userId, updated))) {
                continue;
            }
            const members = await this.prisma.workspaceMember.findMany({
                where: { userId: updated.userId, deletedAt: null },
                select: { id: true },
            });
            const payload = await this.toNotificationPayload(updated);
            for (const m of members) {
                try {
                    this.sse.broadcastToMember(m.id, 'notification:updated', payload);
                }
                catch (err) {
                    this.logger.debug('Failed broadcasting unsnoozed notification', err);
                }
            }
        }
    }
    async deleteExpiredNotifications(now = new Date()) {
        const retentionDays = this.notificationRetentionDays();
        const cutoff = new Date(now.getTime() - retentionDays * 24 * 60 * 60 * 1000);
        const result = await this.prisma.notification.deleteMany({
            where: { createdAt: { lt: cutoff } },
        });
        if (result.count > 0) {
            this.logger.log(`Deleted ${result.count} notifications older than ${retentionDays} days`);
        }
        return result.count;
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
    notificationRetentionDays() {
        const raw = Number.parseInt(process.env['NOTIFICATIONS_RETENTION_DAYS'] ?? '90', 10);
        return Number.isNaN(raw) || raw < 1 ? 90 : raw;
    }
    retentionCleanupIntervalMs() {
        const raw = Number.parseInt(process.env['NOTIFICATIONS_RETENTION_CLEANUP_INTERVAL_MS'] ??
            `${24 * 60 * 60 * 1000}`, 10);
        return Number.isNaN(raw) || raw < 60_000 ? 24 * 60 * 60 * 1000 : raw;
    }
    getTaskId(notification, commentTaskIds) {
        if (notification.referenceType === 'task')
            return notification.referenceId ?? null;
        if (notification.referenceType === 'comment' && notification.referenceId) {
            return commentTaskIds.get(notification.referenceId) ?? null;
        }
        return null;
    }
    notificationReferenceKey(notification) {
        if (!notification.referenceType || !notification.referenceId)
            return null;
        return `${notification.referenceType}:${notification.referenceId}`;
    }
    async resolveNotificationProjectIds(notifications) {
        const result = new Map();
        const taskIds = Array.from(new Set(notifications
            .filter((n) => n.referenceType === 'task' && n.referenceId)
            .map((n) => n.referenceId)));
        const commentIds = Array.from(new Set(notifications
            .filter((n) => n.referenceType === 'comment' && n.referenceId)
            .map((n) => n.referenceId)));
        const channelMessageIds = Array.from(new Set(notifications
            .filter((n) => n.referenceType === 'channel_message' && n.referenceId)
            .map((n) => n.referenceId)));
        if (taskIds.length > 0) {
            const tasks = await this.prisma.task.findMany({
                where: { id: { in: taskIds }, deletedAt: null },
                select: { id: true, list: { select: { projectId: true } } },
            });
            tasks.forEach((task) => {
                result.set(`task:${task.id}`, task.list?.projectId ?? null);
            });
        }
        if (commentIds.length > 0) {
            const comments = await this.prisma.comment.findMany({
                where: { id: { in: commentIds }, deletedAt: null },
                select: {
                    id: true,
                    task: { select: { list: { select: { projectId: true } } } },
                },
            });
            comments.forEach((comment) => {
                result.set(`comment:${comment.id}`, comment.task?.list?.projectId ?? null);
            });
        }
        if (channelMessageIds.length > 0) {
            const messages = await this.prisma.channelMessage.findMany({
                where: { id: { in: channelMessageIds }, deletedAt: null },
                select: {
                    id: true,
                    channel: { select: { projectId: true } },
                },
            });
            messages.forEach((message) => {
                result.set(`channel_message:${message.id}`, message.channel?.projectId ?? null);
            });
        }
        return result;
    }
    isProjectBoundReference(notification) {
        return ['task', 'comment', 'channel_message'].includes(notification.referenceType ?? '');
    }
    async filterVisibleNotificationsForUser(userId, notifications) {
        if (notifications.length === 0)
            return notifications;
        const projectIdsByReference = await this.resolveNotificationProjectIds(notifications);
        const referencedProjectIds = Array.from(new Set(Array.from(projectIdsByReference.values()).filter(Boolean)));
        const projects = referencedProjectIds.length === 0
            ? []
            : await this.prisma.project.findMany({
                where: { id: { in: referencedProjectIds }, deletedAt: null },
                select: { id: true, passwordHash: true },
            });
        const projectLockState = new Map(projects.map((project) => [project.id, Boolean(project.passwordHash)]));
        const lockedProjectIds = projects
            .filter((project) => Boolean(project.passwordHash))
            .map((project) => project.id);
        const unlockedProjectIds = lockedProjectIds.length === 0
            ? new Set()
            : await this.projectSecurity.activeUnlockedProjectIds(lockedProjectIds, userId);
        return notifications.filter((notification) => {
            const key = this.notificationReferenceKey(notification);
            if (!key)
                return true;
            const hasResolvedReference = projectIdsByReference.has(key);
            const projectId = projectIdsByReference.get(key);
            if (!projectId) {
                return hasResolvedReference || !this.isProjectBoundReference(notification);
            }
            const isLocked = projectLockState.get(projectId);
            if (isLocked === undefined)
                return false;
            return !isLocked || unlockedProjectIds.has(projectId);
        });
    }
    async isNotificationVisibleToUser(userId, notification) {
        const visible = await this.filterVisibleNotificationsForUser(userId, [
            notification,
        ]);
        return visible.length > 0;
    }
    async addTaskIds(notifications) {
        const taskIds = Array.from(new Set(notifications
            .filter((n) => n.referenceType === 'task' && n.referenceId)
            .map((n) => n.referenceId)));
        const commentIds = Array.from(new Set(notifications
            .filter((n) => n.referenceType === 'comment' && n.referenceId)
            .map((n) => n.referenceId)));
        const tasks = taskIds.length === 0
            ? []
            : await this.prisma.task.findMany({
                where: { id: { in: taskIds } },
                select: { id: true, title: true },
            });
        const taskMap = new Map(tasks.map((t) => [t.id, t.title]));
        const comments = commentIds.length === 0
            ? []
            : await this.prisma.comment.findMany({
                where: { id: { in: commentIds } },
                select: { id: true, taskId: true, content: true },
            });
        const commentTaskIds = new Map(comments.map((c) => [c.id, c.taskId]));
        const commentContentMap = new Map(comments.map((c) => [c.id, (c.content ?? '').toString().slice(0, 200)]));
        const commentParentTaskIds = Array.from(new Set(comments.map((c) => c.taskId).filter(Boolean))).filter((id) => !taskMap.has(id));
        if (commentParentTaskIds.length > 0) {
            const parentTasks = await this.prisma.task.findMany({
                where: { id: { in: commentParentTaskIds } },
                select: { id: true, title: true },
            });
            parentTasks.forEach((t) => taskMap.set(t.id, t.title));
        }
        return notifications.map((notification) => {
            const resolvedTaskId = this.getTaskId(notification, commentTaskIds);
            const isComment = notification.referenceType === 'comment';
            return {
                ...notification,
                taskId: resolvedTaskId,
                taskName: resolvedTaskId ? (taskMap.get(resolvedTaskId) ?? null) : null,
                commentId: isComment ? (notification.referenceId ?? null) : null,
                commentName: isComment && notification.referenceId
                    ? (commentContentMap.get(notification.referenceId) ?? null)
                    : null,
            };
        });
    }
    async addTaskId(notification) {
        const [enriched] = await this.addTaskIds([notification]);
        return enriched;
    }
    async toNotificationPayload(notification) {
        const enriched = await this.addTaskId(notification);
        return {
            id: enriched.id,
            type: enriched.type,
            title: enriched.title,
            message: enriched.message,
            workspaceId: enriched.workspaceId,
            referenceType: enriched.referenceType,
            referenceId: enriched.referenceId,
            taskId: enriched.taskId,
            taskName: enriched.taskName,
            commentId: enriched.commentId,
            commentName: enriched.commentName,
            replyCommentId: enriched.referenceType === 'comment' ? (enriched.referenceId ?? null) : null,
            repliedToCommentId: enriched.parentCommentId ?? null,
            actorId: enriched.actorId,
            isRead: enriched.isRead,
            isCleared: enriched.isCleared,
            isSnoozed: enriched.isSnoozed,
            isCommented: enriched.isCommented,
            snoozedAt: enriched.snoozedAt,
            createdAt: enriched.createdAt,
        };
    }
    async createNotification(workspaceId, targetMemberIdOrUserId, actorUserId, type, title, message, referenceType, referenceId, isCommented, meta) {
        const member = await this.resolveWorkspaceMember(workspaceId, targetMemberIdOrUserId);
        if (!member) {
            this.logger.debug(`Notification: no member found for target ${targetMemberIdOrUserId} workspace=${workspaceId}`);
            return null;
        }
        if (member.userId === actorUserId)
            return null;
        if (!(await this.isNotificationVisibleToUser(member.userId, {
            referenceType,
            referenceId,
        }))) {
            return null;
        }
        const notif = await this.prisma.notification.create({
            data: {
                userId: member.userId,
                workspaceId,
                type,
                title,
                message: message ?? undefined,
                referenceType: referenceType ?? '',
                referenceId: referenceId ?? '',
                actorId: actorUserId ?? undefined,
                isCommented: isCommented ?? false,
                isCleared: false,
                isSnoozed: false,
                snoozedAt: null,
            },
        });
        try {
            if (!notif.isCleared && !notif.isSnoozed) {
                const payloadSource = meta ? { ...notif, ...meta } : notif;
                this.sse.broadcastToMember(member.id, 'notification:created', await this.toNotificationPayload(payloadSource));
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
        const assignees = await this.prisma.taskAssignee.findMany({
            where: { taskId },
            select: { userId: true },
        });
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
    __metadata("design:paramtypes", [database_1.PrismaService,
        project_security_service_1.ProjectSecurityService,
        sse_service_1.NotificationsSseService])
], NotificationsService);
//# sourceMappingURL=notifications.service.js.map