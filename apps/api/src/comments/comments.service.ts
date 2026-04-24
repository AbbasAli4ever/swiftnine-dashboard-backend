import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@app/database';
import type { Prisma } from '@app/database/generated/prisma/client';
import { ActivityService } from '../activity/activity.service';
import { NotificationsService } from '../notifications/notifications.service';
import { SseService } from './sse.service';

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
} satisfies Prisma.CommentInclude;

type TxClient = Prisma.TransactionClient;

type TaskSummary = {
  id: string;
  title: string;
  taskNumber: number;
  createdBy: string;
  list: {
    id: string;
    name: string;
    project: {
      id: string;
      name: string;
      workspaceId: string;
    };
  };
};

type MentionedUser = {
  userId: string;
  fullName: string;
};

@Injectable()
export class CommentsService {
  private readonly logger = new Logger(CommentsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly sse: SseService,
    private readonly activity: ActivityService,
    private readonly notifications: NotificationsService,
  ) {}

  async getCommentsForTask(workspaceId: string, taskId: string) {
    await this.findTaskInWorkspaceOrThrow(workspaceId, taskId);

    return this.prisma.comment.findMany({
      where: { taskId, deletedAt: null },
      orderBy: { createdAt: 'asc' },
      include: COMMENT_INCLUDE,
    });
  }

  async createComment(
    workspaceId: string,
    userId: string,
    taskId: string,
    content: string,
    parentId?: string,
    mentionedUserIds?: string[],
  ) {
    const task = await this.findTaskInWorkspaceOrThrow(workspaceId, taskId);

    if (parentId) {
      const parent = await this.prisma.comment.findFirst({
        where: { id: parentId, taskId, deletedAt: null },
      });
      if (!parent) {
        throw new BadRequestException('Parent comment not found or does not belong to this task');
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

      await this.activity.log(
        {
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
        },
        tx,
      );

      return tx.comment.findUniqueOrThrow({
        where: { id: created.id },
        include: COMMENT_INCLUDE,
      });
    });

    this.sse.broadcast(taskId, 'comment:created', comment);
    await this.notifyOnCommentCreated(workspaceId, userId, task, comment.id, normalizedContent, mentionedUsers);

    return comment;
  }

  async updateComment(
    workspaceId: string,
    userId: string,
    commentId: string,
    content: string,
    mentionedUserIds?: string[],
  ) {
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
    if (!comment) throw new NotFoundException('Comment not found');

    if (comment.userId !== userId) {
      throw new ForbiddenException('Only the author can edit the comment');
    }

    const createdAt = new Date(comment.createdAt).getTime();
    const now = Date.now();
    const fiveMinutes = 5 * 60 * 1000;
    if (now - createdAt > fiveMinutes) {
      throw new ForbiddenException('Comment can only be edited within 5 minutes of creation');
    }

    const normalizedContent = content.trim();
    const mentionedUsers =
      mentionedUserIds === undefined
        ? undefined
        : await this.resolveMentionedUsers(workspaceId, userId, mentionedUserIds);

    let newMentionedUsers: MentionedUser[] = [];

    const updated = await this.prisma.$transaction(async (tx) => {
      const previousMentionIds = mentionedUsers
        ? (
            await tx.mention.findMany({
              where: { commentId },
              select: { mentionedUserId: true },
            })
          ).map((mention) => mention.mentionedUserId)
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

        newMentionedUsers = mentionedUsers.filter(
          (mentionedUser) => !previousMentionIds.includes(mentionedUser.userId),
        );
      }

      await this.activity.log(
        {
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
        },
        tx,
      );

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

  async deleteComment(workspaceId: string, userId: string, commentId: string, requesterRole?: string) {
    const comment = await this.prisma.comment.findFirst({
      where: {
        id: commentId,
        deletedAt: null,
        task: { deletedAt: null, list: { deletedAt: null, project: { workspaceId, deletedAt: null } } },
      },
    });
    if (!comment) throw new NotFoundException('Comment not found');

    const isOwner = requesterRole === 'OWNER';
    if (comment.userId !== userId && !isOwner) {
      throw new ForbiddenException('Not allowed to delete this comment');
    }

    const now = new Date();
    const deletedIds = await this.prisma.$transaction(async (tx) => {
      const rows = await tx.$queryRaw<Array<{ id: string }>>`
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
      if (ids.length === 0) throw new NotFoundException('Comment not found');

      await tx.comment.updateMany({
        where: { id: { in: ids }, deletedAt: null },
        data: { deletedAt: now },
      });

      await this.activity.log(
        {
          workspaceId,
          entityType: 'comment',
          entityId: commentId,
          action: 'comment_deleted',
          oldValue: comment.content,
          metadata: this.buildActivityMetadata(
            await this.findTaskInWorkspaceOrThrow(workspaceId, comment.taskId, tx),
            {
              commentId,
              deletedIds: ids,
              parentId: comment.parentId,
            },
          ),
          performedBy: userId,
        },
        tx,
      );

      return ids;
    });

    this.sse.broadcast(comment.taskId, 'comment:deleted', { id: commentId, deletedIds });
  }

  async addReaction(workspaceId: string, userId: string, commentId: string, reactFace: string) {
    const comment = await this.prisma.comment.findFirst({
      where: {
        id: commentId,
        deletedAt: null,
        task: { deletedAt: null, list: { deletedAt: null, project: { workspaceId, deletedAt: null } } },
      },
    });
    if (!comment) throw new NotFoundException('Comment not found');

    const member = await this.prisma.workspaceMember.findFirst({
      where: { workspaceId, userId, deletedAt: null },
      select: { id: true },
    });
    if (!member) throw new NotFoundException('Workspace member not found');

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
    if (existing) return existing;

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

  async deleteReaction(workspaceId: string, userId: string, reactionId: string) {
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
        comment: { select: { id: true, taskId: true } },
      },
    });
    if (!reaction) throw new NotFoundException('Reaction not found');

    if (reaction.member.userId !== userId) {
      throw new ForbiddenException('Only the reaction owner can delete it');
    }

    await this.prisma.reaction.delete({ where: { id: reactionId } });

    this.sse.broadcast(reaction.comment.taskId, 'reaction:deleted', {
      id: reactionId,
      commentId: reaction.comment.id,
    });
  }

  private async findTaskInWorkspaceOrThrow(
    workspaceId: string,
    taskId: string,
    client: Pick<PrismaService, 'task'> | TxClient = this.prisma,
  ): Promise<TaskSummary> {
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
      throw new NotFoundException('Task not found in workspace');
    }

    return task;
  }

  private async resolveMentionedUsers(
    workspaceId: string,
    actorId: string,
    mentionedUserIds?: string[],
  ): Promise<MentionedUser[]> {
    const uniqueIds = Array.from(new Set((mentionedUserIds ?? []).map((id) => id.trim()).filter(Boolean)));
    if (uniqueIds.length === 0) return [];

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
      throw new BadRequestException('One or more mentioned users are not active members of this workspace');
    }

    return members
      .map((member) => ({
        userId: member.user.id,
        fullName: member.user.fullName,
      }))
      .filter((member) => member.userId !== actorId);
  }

  private async notifyOnCommentCreated(
    workspaceId: string,
    actorId: string,
    task: TaskSummary,
    commentId: string,
    content: string,
    mentionedUsers: MentionedUser[],
  ) {
    const mentionedUserIds = mentionedUsers.map((mentionedUser) => mentionedUser.userId);
    const excludedAssignees = Array.from(new Set([task.createdBy, ...mentionedUserIds]));

    await this.notifications.notifyTaskAssignees(workspaceId, task.id, actorId, {
      type: 'comment:created',
      title: 'New comment on assigned task',
      message: content,
      excludeUserIds: excludedAssignees,
    });

    if (task.createdBy !== actorId && !mentionedUserIds.includes(task.createdBy)) {
      await this.notifications.createNotification(
        workspaceId,
        task.createdBy,
        actorId,
        'comment_added',
        `New comment on ${task.title}`,
        content,
        'comment',
        commentId,
      );
    }

    await this.notifyMentionedUsers(workspaceId, actorId, task, commentId, content, mentionedUsers);
  }

  private async notifyMentionedUsers(
    workspaceId: string,
    actorId: string,
    task: TaskSummary,
    commentId: string,
    content: string,
    mentionedUsers: MentionedUser[],
  ) {
    for (const mentionedUser of mentionedUsers) {
      await this.notifications.createNotification(
        workspaceId,
        mentionedUser.userId,
        actorId,
        'mentioned',
        `You were mentioned in ${task.title}`,
        content,
        'comment',
        commentId,
      );
    }
  }

  private buildActivityMetadata(
    task: TaskSummary,
    extra: Record<string, unknown> = {},
  ): Prisma.InputJsonValue {
    return {
      taskId: task.id,
      taskTitle: task.title,
      taskNumber: task.taskNumber,
      projectId: task.list.project.id,
      projectName: task.list.project.name,
      listId: task.list.id,
      listName: task.list.name,
      ...extra,
    } as Prisma.InputJsonValue;
  }
}
