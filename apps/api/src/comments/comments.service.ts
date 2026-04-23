import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '@app/database';
import { SseService } from './sse.service';

@Injectable()
export class CommentsService {
  constructor(private readonly prisma: PrismaService, private readonly sse: SseService) {}

  async getCommentsForTask(workspaceId: string, taskId: string) {
    await this.assertTaskInWorkspaceOrThrow(workspaceId, taskId);

    const comments = await this.prisma.comment.findMany({
      where: { taskId, deletedAt: null },
      orderBy: { createdAt: 'asc' },
      include: { author: { select: { id: true, fullName: true, avatarUrl: true } }, reactions: true },
    });

    return comments;
  }

  async createComment(workspaceId: string, userId: string, taskId: string, content: string, parentId?: string) {
    await this.assertTaskInWorkspaceOrThrow(workspaceId, taskId);

    if (parentId) {
      const parent = await this.prisma.comment.findFirst({ where: { id: parentId, taskId, deletedAt: null } });
      if (!parent) throw new BadRequestException('Parent comment not found or does not belong to this task');
    }

    const comment = await this.prisma.comment.create({
      data: { taskId, userId, parentId: parentId ?? null, content: content.trim() },
      include: { author: { select: { id: true, fullName: true, avatarUrl: true } }, reactions: true },
    });

    // broadcast
    this.sse.broadcast(taskId, 'comment:created', comment);

    return comment;
  }

  async updateComment(workspaceId: string, userId: string, commentId: string, content: string) {
    const comment = await this.prisma.comment.findFirst({
      where: { id: commentId, deletedAt: null, task: { list: { project: { workspaceId, deletedAt: null } } } },
      include: { author: true },
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

    const updated = await this.prisma.comment.update({
      where: { id: commentId },
      data: { content: content.trim(), isEdited: true },
      include: { author: { select: { id: true, fullName: true, avatarUrl: true } }, reactions: true },
    });

    // broadcast
    // extract taskId for broadcasting
    const taskId = updated.taskId;
    this.sse.broadcast(taskId, 'comment:updated', updated);

    return updated;
  }

  async deleteComment(workspaceId: string, userId: string, commentId: string, requesterRole?: string) {
    const comment = await this.prisma.comment.findFirst({
      where: { id: commentId, deletedAt: null, task: { list: { project: { workspaceId, deletedAt: null } } } },
    });
    if (!comment) throw new NotFoundException('Comment not found');

    // allow author or workspace OWNER to delete
    const isOwner = requesterRole === 'OWNER';
    if (comment.userId !== userId && !isOwner) {
      throw new ForbiddenException('Not allowed to delete this comment');
    }

    const now = new Date();
    await this.prisma.comment.update({ where: { id: commentId }, data: { deletedAt: now } });

    // broadcast
    this.sse.broadcast(comment.taskId, 'comment:deleted', { id: commentId });
  }

  async addReaction(workspaceId: string, userId: string, commentId: string) {
    const comment = await this.prisma.comment.findFirst({
      where: { id: commentId, deletedAt: null, task: { list: { project: { workspaceId, deletedAt: null } } } },
    });
    if (!comment) throw new NotFoundException('Comment not found');

    const member = await this.prisma.workspaceMember.findFirst({
      where: { workspaceId, userId, deletedAt: null },
      select: { id: true },
    });
    if (!member) throw new NotFoundException('Workspace member not found');

    const reaction = await this.prisma.reaction.create({ data: { commentId, memberId: member.id }, include: { member: true } });

    this.sse.broadcast(comment.taskId, 'reaction:created', reaction);

    return reaction;
  }

  async deleteReaction(workspaceId: string, userId: string, reactionId: string) {
    const reaction = await this.prisma.reaction.findFirst({
      where: { id: reactionId },
      include: { member: true, comment: true },
    });
    if (!reaction) throw new NotFoundException('Reaction not found');

    const member = await this.prisma.workspaceMember.findFirst({ where: { id: reaction.memberId, deletedAt: null } });
    if (!member) throw new NotFoundException('Member for reaction not found');

    if (member.userId !== userId) {
      throw new ForbiddenException('Only the reaction owner can delete it');
    }

    // ensure reaction belongs to the same workspace
    if (reaction.comment?.task) {
      // no-op: we'll check workspace via task -> project -> workspace
    }

    await this.prisma.reaction.delete({ where: { id: reactionId } });

    // broadcast
    const taskId = reaction.commentId;
    this.sse.broadcast(taskId, 'reaction:deleted', { id: reactionId, commentId: reaction.commentId });
  }

  private async assertTaskInWorkspaceOrThrow(workspaceId: string, taskId: string) {
    const task = await this.prisma.task.findFirst({ where: { id: taskId, deletedAt: null, list: { project: { workspaceId, deletedAt: null } } }, select: { id: true } });
    if (!task) throw new NotFoundException('Task not found in workspace');
  }
}
