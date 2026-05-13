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
var CommentsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentsService = void 0;
const common_1 = require("@nestjs/common");
const database_1 = require("../../../../libs/database/src");
const activity_service_1 = require("../activity/activity.service");
const notifications_service_1 = require("../notifications/notifications.service");
const sse_service_1 = require("./sse.service");
const project_security_service_1 = require("../project-security/project-security.service");
const COMMENT_INCLUDE = {
    author: { select: { id: true, fullName: true, avatarUrl: true } },
    reactions: {
        select: {
            id: true,
            reactFace: true,
            createdAt: true,
            member: {
                select: {
                    id: true,
                    userId: true,
                    role: true,
                    user: { select: { id: true, fullName: true, avatarUrl: true } },
                },
            },
        },
    },
    mentions: {
        select: {
            id: true,
            mentionedUserId: true,
            mentionedUser: {
                select: { id: true, fullName: true, avatarUrl: true, email: true },
            },
        },
    },
};
let CommentsService = CommentsService_1 = class CommentsService {
    prisma;
    sse;
    activity;
    notifications;
    projectSecurity;
    logger = new common_1.Logger(CommentsService_1.name);
    constructor(prisma, sse, activity, notifications, projectSecurity) {
        this.prisma = prisma;
        this.sse = sse;
        this.activity = activity;
        this.notifications = notifications;
        this.projectSecurity = projectSecurity;
    }
    async getCommentsForTask(workspaceId, userId, taskId) {
        const task = await this.findTaskInWorkspaceOrThrow(workspaceId, taskId);
        await this.projectSecurity.assertUnlocked(workspaceId, task.list.project.id, userId);
        return this.prisma.comment.findMany({
            where: { taskId, deletedAt: null },
            orderBy: { createdAt: 'asc' },
            include: COMMENT_INCLUDE,
        });
    }
    async createComment(workspaceId, userId, taskId, content, parentId, mentionedUserIds) {
        const task = await this.findTaskInWorkspaceOrThrow(workspaceId, taskId);
        await this.projectSecurity.assertUnlocked(workspaceId, task.list.project.id, userId);
        if (parentId) {
            const parent = await this.prisma.comment.findFirst({
                where: { id: parentId, taskId, deletedAt: null },
            });
            if (!parent) {
                throw new common_1.BadRequestException('Parent comment not found or does not belong to this task');
            }
        }
        const normalizedContent = content.trim();
        const mentionedUsers = await this.resolveMentionedUsers(workspaceId, userId, mentionedUserIds);
        const comment = await this.prisma.$transaction(async (tx) => {
            const created = await tx.comment.create({
                data: { taskId, userId, parentId: parentId ?? null, content: normalizedContent },
                include: COMMENT_INCLUDE,
            });
            if (mentionedUsers.length > 0) {
                await tx.mention.createMany({
                    data: mentionedUsers.map((mentionedUser) => ({
                        commentId: created.id,
                        mentionedUserId: mentionedUser.userId,
                    })),
                });
            }
            await this.activity.log({
                workspaceId,
                entityType: 'comment',
                entityId: created.id,
                action: 'comment_created',
                newValue: normalizedContent,
                metadata: this.buildActivityMetadata(task, {
                    commentId: created.id,
                    parentId: created.parentId,
                }),
                performedBy: userId,
            }, tx);
            return tx.comment.findUniqueOrThrow({
                where: { id: created.id },
                include: COMMENT_INCLUDE,
            });
        });
        this.sse.broadcast(taskId, 'comment:created', comment);
        await this.notifyOnCommentCreated(workspaceId, userId, task, comment.id, normalizedContent, mentionedUsers, comment.parentId);
        return comment;
    }
    async updateComment(workspaceId, userId, commentId, content, mentionedUserIds) {
        const comment = await this.prisma.comment.findFirst({
            where: {
                id: commentId,
                deletedAt: null,
                task: { deletedAt: null, list: { deletedAt: null, project: { workspaceId, deletedAt: null } } },
            },
            select: {
                id: true,
                userId: true,
                content: true,
                createdAt: true,
                taskId: true,
                parentId: true,
                task: {
                    select: {
                        id: true,
                        title: true,
                        taskNumber: true,
                        createdBy: true,
                        list: {
                            select: {
                                id: true,
                                name: true,
                                project: { select: { id: true, name: true, workspaceId: true } },
                            },
                        },
                    },
                },
            },
        });
        if (!comment)
            throw new common_1.NotFoundException('Comment not found');
        await this.projectSecurity.assertUnlocked(workspaceId, comment.task.list.project.id, userId);
        if (comment.userId !== userId) {
            throw new common_1.ForbiddenException('Only the author can edit the comment');
        }
        const createdAt = new Date(comment.createdAt).getTime();
        const now = Date.now();
        const fiveMinutes = 5 * 60 * 1000;
        if (now - createdAt > fiveMinutes) {
            throw new common_1.ForbiddenException('Comment can only be edited within 5 minutes of creation');
        }
        const normalizedContent = content.trim();
        const mentionedUsers = mentionedUserIds === undefined
            ? undefined
            : await this.resolveMentionedUsers(workspaceId, userId, mentionedUserIds);
        let newMentionedUsers = [];
        const updated = await this.prisma.$transaction(async (tx) => {
            const previousMentionIds = mentionedUsers
                ? (await tx.mention.findMany({
                    where: { commentId },
                    select: { mentionedUserId: true },
                })).map((mention) => mention.mentionedUserId)
                : [];
            await tx.comment.update({
                where: { id: commentId },
                data: { content: normalizedContent, isEdited: true },
            });
            if (mentionedUsers) {
                await tx.mention.deleteMany({ where: { commentId } });
                if (mentionedUsers.length > 0) {
                    await tx.mention.createMany({
                        data: mentionedUsers.map((mentionedUser) => ({
                            commentId,
                            mentionedUserId: mentionedUser.userId,
                        })),
                    });
                }
                newMentionedUsers = mentionedUsers.filter((mentionedUser) => !previousMentionIds.includes(mentionedUser.userId));
            }
            await this.activity.log({
                workspaceId,
                entityType: 'comment',
                entityId: commentId,
                action: 'comment_updated',
                oldValue: comment.content,
                newValue: normalizedContent,
                fieldName: 'content',
                metadata: this.buildActivityMetadata(comment.task, {
                    commentId,
                    parentId: comment.parentId,
                }),
                performedBy: userId,
            }, tx);
            return tx.comment.findUniqueOrThrow({
                where: { id: commentId },
                include: COMMENT_INCLUDE,
            });
        });
        this.sse.broadcast(updated.taskId, 'comment:updated', updated);
        await this.notifications.notifyTaskAssignees(workspaceId, updated.taskId, userId, {
            type: 'comment:updated',
            title: 'Comment updated',
            message: normalizedContent,
            excludeUserIds: newMentionedUsers.map((mentionedUser) => mentionedUser.userId),
        });
        await this.notifyMentionedUsers(workspaceId, userId, comment.task, commentId, normalizedContent, newMentionedUsers);
        return updated;
    }
    async deleteComment(workspaceId, userId, commentId, requesterRole) {
        const comment = await this.prisma.comment.findFirst({
            where: {
                id: commentId,
                deletedAt: null,
                task: { deletedAt: null, list: { deletedAt: null, project: { workspaceId, deletedAt: null } } },
            },
            include: {
                task: {
                    select: {
                        list: { select: { project: { select: { id: true } } } },
                    },
                },
            },
        });
        if (!comment)
            throw new common_1.NotFoundException('Comment not found');
        await this.projectSecurity.assertUnlocked(workspaceId, comment.task.list.project.id, userId);
        const isOwner = requesterRole === 'OWNER';
        if (comment.userId !== userId && !isOwner) {
            throw new common_1.ForbiddenException('Not allowed to delete this comment');
        }
        const now = new Date();
        const deletedIds = await this.prisma.$transaction(async (tx) => {
            const rows = await tx.$queryRaw `
        WITH RECURSIVE comment_tree AS (
          SELECT id
          FROM comments
          WHERE id = ${commentId}

          UNION ALL

          SELECT child.id
          FROM comments child
          INNER JOIN comment_tree tree ON child.parent_id = tree.id
          WHERE child.deleted_at IS NULL
        )
        SELECT id FROM comment_tree
      `;
            const ids = rows.map((row) => row.id);
            if (ids.length === 0)
                throw new common_1.NotFoundException('Comment not found');
            await tx.comment.updateMany({
                where: { id: { in: ids }, deletedAt: null },
                data: { deletedAt: now },
            });
            await this.activity.log({
                workspaceId,
                entityType: 'comment',
                entityId: commentId,
                action: 'comment_deleted',
                oldValue: comment.content,
                metadata: this.buildActivityMetadata(await this.findTaskInWorkspaceOrThrow(workspaceId, comment.taskId, tx), {
                    commentId,
                    deletedIds: ids,
                    parentId: comment.parentId,
                }),
                performedBy: userId,
            }, tx);
            return ids;
        });
        this.sse.broadcast(comment.taskId, 'comment:deleted', { id: commentId, deletedIds });
    }
    async addReaction(workspaceId, userId, commentId, reactFace) {
        const comment = await this.prisma.comment.findFirst({
            where: {
                id: commentId,
                deletedAt: null,
                task: { deletedAt: null, list: { deletedAt: null, project: { workspaceId, deletedAt: null } } },
            },
            include: {
                task: {
                    select: {
                        id: true,
                        list: { select: { project: { select: { id: true } } } },
                    },
                },
            },
        });
        if (!comment)
            throw new common_1.NotFoundException('Comment not found');
        await this.projectSecurity.assertUnlocked(workspaceId, comment.task.list.project.id, userId);
        const member = await this.prisma.workspaceMember.findFirst({
            where: { workspaceId, userId, deletedAt: null },
            select: { id: true },
        });
        if (!member)
            throw new common_1.NotFoundException('Workspace member not found');
        const normalizedReactFace = reactFace.trim();
        const existing = await this.prisma.reaction.findUnique({
            where: {
                commentId_memberId_reactFace: {
                    commentId,
                    memberId: member.id,
                    reactFace: normalizedReactFace,
                },
            },
            include: {
                member: {
                    select: {
                        id: true,
                        userId: true,
                        role: true,
                        user: { select: { id: true, fullName: true, avatarUrl: true } },
                    },
                },
            },
        });
        if (existing)
            return existing;
        const reaction = await this.prisma.reaction.create({
            data: { commentId, memberId: member.id, reactFace: normalizedReactFace },
            include: {
                member: {
                    select: {
                        id: true,
                        userId: true,
                        role: true,
                        user: { select: { id: true, fullName: true, avatarUrl: true } },
                    },
                },
            },
        });
        this.sse.broadcast(comment.taskId, 'reaction:created', reaction);
        await this.notifications.notifyTaskAssignees(workspaceId, comment.taskId, userId, {
            type: 'reaction:created',
            title: 'New reaction on assigned task',
            message: reaction.reactFace,
        });
        return reaction;
    }
    async deleteReaction(workspaceId, userId, reactionId) {
        const reaction = await this.prisma.reaction.findFirst({
            where: {
                id: reactionId,
                comment: {
                    task: {
                        deletedAt: null,
                        list: { deletedAt: null, project: { workspaceId, deletedAt: null } },
                    },
                },
                member: { workspaceId, deletedAt: null },
            },
            include: {
                member: { select: { id: true, userId: true } },
                comment: {
                    select: {
                        id: true,
                        taskId: true,
                        task: {
                            select: {
                                list: { select: { project: { select: { id: true } } } },
                            },
                        },
                    },
                },
            },
        });
        if (!reaction)
            throw new common_1.NotFoundException('Reaction not found');
        await this.projectSecurity.assertUnlocked(workspaceId, reaction.comment.task.list.project.id, userId);
        if (reaction.member.userId !== userId) {
            throw new common_1.ForbiddenException('Only the reaction owner can delete it');
        }
        await this.prisma.reaction.delete({ where: { id: reactionId } });
        this.sse.broadcast(reaction.comment.taskId, 'reaction:deleted', {
            id: reactionId,
            commentId: reaction.comment.id,
        });
    }
    async updateReaction(workspaceId, userId, reactionId, reactFace) {
        const reaction = await this.prisma.reaction.findFirst({
            where: { id: reactionId },
            include: {
                member: true,
                comment: {
                    include: {
                        task: {
                            select: {
                                list: { select: { project: { select: { id: true, workspaceId: true } } } },
                            },
                        },
                    },
                },
            },
        });
        if (!reaction)
            throw new common_1.NotFoundException('Reaction not found');
        if (reaction.comment.task.list.project.workspaceId !== workspaceId) {
            throw new common_1.NotFoundException('Reaction not found');
        }
        await this.projectSecurity.assertUnlocked(workspaceId, reaction.comment.task.list.project.id, userId);
        const member = await this.prisma.workspaceMember.findFirst({ where: { id: reaction.memberId, deletedAt: null } });
        if (!member)
            throw new common_1.NotFoundException('Member for reaction not found');
        if (member.userId !== userId) {
            throw new common_1.ForbiddenException('Only the reaction owner can update it');
        }
        const updated = await this.prisma.reaction.update({
            where: { id: reactionId },
            data: { reactFace },
            include: { member: true },
        });
        const taskId = reaction.comment?.taskId ?? null;
        this.sse.broadcast(taskId, 'reaction:updated', updated);
        await this.notifications.notifyTaskAssignees(workspaceId, reaction.comment?.taskId ?? null, userId, {
            type: 'reaction:updated',
            title: 'Reaction updated',
            message: updated.reactFace,
        });
        return updated;
    }
    async findTaskInWorkspaceOrThrow(workspaceId, taskId, client = this.prisma) {
        const task = await client.task.findFirst({
            where: {
                id: taskId,
                deletedAt: null,
                list: { deletedAt: null, project: { workspaceId, deletedAt: null } },
            },
            select: {
                id: true,
                title: true,
                taskNumber: true,
                createdBy: true,
                list: {
                    select: {
                        id: true,
                        name: true,
                        project: { select: { id: true, name: true, workspaceId: true } },
                    },
                },
            },
        });
        if (!task) {
            this.logger.warn(`task not found in workspace - taskId=${taskId} workspaceId=${workspaceId}`);
            throw new common_1.NotFoundException('Task not found in workspace');
        }
        return task;
    }
    async resolveMentionedUsers(workspaceId, actorId, mentionedUserIds) {
        const uniqueIds = Array.from(new Set((mentionedUserIds ?? []).map((id) => id.trim()).filter(Boolean)));
        if (uniqueIds.length === 0)
            return [];
        const members = await this.prisma.workspaceMember.findMany({
            where: {
                workspaceId,
                deletedAt: null,
                userId: { in: uniqueIds },
                user: { deletedAt: null },
            },
            select: {
                userId: true,
                user: { select: { id: true, fullName: true } },
            },
        });
        if (members.length !== uniqueIds.length) {
            throw new common_1.BadRequestException('One or more mentioned users are not active members of this workspace');
        }
        return members
            .map((member) => ({
            userId: member.user.id,
            fullName: member.user.fullName,
        }))
            .filter((member) => member.userId !== actorId);
    }
    async notifyOnCommentCreated(workspaceId, actorId, task, commentId, content, mentionedUsers, parentId) {
        const mentionedUserIds = mentionedUsers.map((mentionedUser) => mentionedUser.userId);
        const excludedAssignees = Array.from(new Set([task.createdBy, ...mentionedUserIds]));
        await this.notifications.notifyTaskAssignees(workspaceId, task.id, actorId, {
            type: 'comment:created',
            title: 'New comment on assigned task',
            message: content,
            excludeUserIds: excludedAssignees,
        });
        if (task.createdBy !== actorId && !mentionedUserIds.includes(task.createdBy)) {
            await this.notifications.createNotification(workspaceId, task.createdBy, actorId, 'comment_added', `New comment on ${task.title}`, content, 'comment', commentId, false);
        }
        await this.notifyMentionedUsers(workspaceId, actorId, task, commentId, content, mentionedUsers);
        if (parentId) {
            const parent = await this.prisma.comment.findFirst({ where: { id: parentId, deletedAt: null }, select: { userId: true } });
            if (parent && parent.userId !== actorId) {
                await this.notifications.createNotification(workspaceId, parent.userId, actorId, 'comment:reply', `New reply to your comment on ${task.title}`, content, 'comment', commentId, false, { parentCommentId: parentId });
            }
        }
    }
    async notifyMentionedUsers(workspaceId, actorId, task, commentId, content, mentionedUsers) {
        for (const mentionedUser of mentionedUsers) {
            await this.notifications.createNotification(workspaceId, mentionedUser.userId, actorId, 'mentioned', `You were mentioned in ${task.title}`, content, 'comment', commentId, true);
        }
    }
    buildActivityMetadata(task, extra = {}) {
        return {
            taskId: task.id,
            taskTitle: task.title,
            taskNumber: task.taskNumber,
            projectId: task.list.project.id,
            projectName: task.list.project.name,
            listId: task.list.id,
            listName: task.list.name,
            ...extra,
        };
    }
};
exports.CommentsService = CommentsService;
exports.CommentsService = CommentsService = CommentsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_1.PrismaService,
        sse_service_1.SseService,
        activity_service_1.ActivityService,
        notifications_service_1.NotificationsService,
        project_security_service_1.ProjectSecurityService])
], CommentsService);
//# sourceMappingURL=comments.service.js.map