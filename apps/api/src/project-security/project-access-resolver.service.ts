import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@app/database';

type ProjectRef = {
  projectId: string | null;
  workspaceId: string;
};

@Injectable()
export class ProjectAccessResolverService {
  constructor(private readonly prisma: PrismaService) {}

  async resolveProjectIdFromTaskId(workspaceId: string, taskId: string): Promise<string> {
    const task = await this.prisma.task.findFirst({
      where: {
        id: taskId,
        deletedAt: null,
        list: { deletedAt: null, project: { workspaceId, deletedAt: null } },
      },
      select: { list: { select: { projectId: true } } },
    });

    if (!task) throw new NotFoundException('Task not found');
    return task.list.projectId;
  }

  async resolveProjectIdFromListId(workspaceId: string, listId: string): Promise<string> {
    const list = await this.prisma.taskList.findFirst({
      where: { id: listId, deletedAt: null, project: { workspaceId, deletedAt: null } },
      select: { projectId: true },
    });

    if (!list) throw new NotFoundException('Task list not found');
    return list.projectId;
  }

  async resolveProjectIdFromStatusId(workspaceId: string, statusId: string): Promise<string> {
    const status = await this.prisma.status.findFirst({
      where: { id: statusId, deletedAt: null, project: { workspaceId, deletedAt: null } },
      select: { projectId: true },
    });

    if (!status) throw new NotFoundException('Status not found');
    return status.projectId;
  }

  async resolveProjectIdFromCommentId(workspaceId: string, commentId: string): Promise<string> {
    const comment = await this.prisma.comment.findFirst({
      where: {
        id: commentId,
        deletedAt: null,
        task: {
          deletedAt: null,
          list: { deletedAt: null, project: { workspaceId, deletedAt: null } },
        },
      },
      select: { task: { select: { list: { select: { projectId: true } } } } },
    });

    if (!comment) throw new NotFoundException('Comment not found');
    return comment.task.list.projectId;
  }

  async resolveProjectIdFromTimeEntryId(workspaceId: string, timeEntryId: string): Promise<string> {
    const entry = await this.prisma.timeEntry.findFirst({
      where: {
        id: timeEntryId,
        deletedAt: null,
        task: {
          deletedAt: null,
          list: { deletedAt: null, project: { workspaceId, deletedAt: null } },
        },
      },
      select: { task: { select: { list: { select: { projectId: true } } } } },
    });

    if (!entry) throw new NotFoundException('Time entry not found');
    return entry.task.list.projectId;
  }

  async resolveProjectIdFromChannelId(workspaceId: string, channelId: string): Promise<string | null> {
    const channel = await this.prisma.channel.findFirst({
      where: { id: channelId, workspaceId },
      select: { projectId: true },
    });

    if (!channel) throw new NotFoundException('Channel not found');
    return channel.projectId;
  }

  async resolveProjectIdFromMessageId(workspaceId: string, messageId: string): Promise<string | null> {
    const message = await this.prisma.channelMessage.findFirst({
      where: { id: messageId, deletedAt: null, channel: { workspaceId } },
      select: { channel: { select: { projectId: true } } },
    });

    if (!message) throw new NotFoundException('Message not found');
    return message.channel.projectId;
  }

  async resolveProjectIdFromDocId(workspaceId: string, docId: string): Promise<string | null> {
    const doc = await this.prisma.doc.findFirst({
      where: { id: docId, workspaceId, deletedAt: null },
      select: { projectId: true },
    });

    if (!doc) throw new NotFoundException('Doc not found');
    return doc.projectId;
  }

  async resolveProjectRefFromAttachmentId(
    workspaceId: string,
    attachmentId: string,
  ): Promise<ProjectRef> {
    const attachment = await this.prisma.attachment.findFirst({
      where: { id: attachmentId, deletedAt: null },
      select: {
        task: {
          select: {
            list: {
              select: {
                projectId: true,
                project: { select: { workspaceId: true } },
              },
            },
          },
        },
        doc: { select: { projectId: true, workspaceId: true } },
        channelMessage: {
          select: {
            channel: { select: { projectId: true, workspaceId: true } },
          },
        },
      },
    });

    if (!attachment) throw new NotFoundException('Attachment not found');

    const ref = attachment.task
      ? {
          projectId: attachment.task.list.projectId,
          workspaceId: attachment.task.list.project.workspaceId,
        }
      : attachment.doc
        ? { projectId: attachment.doc.projectId, workspaceId: attachment.doc.workspaceId }
        : attachment.channelMessage
          ? {
              projectId: attachment.channelMessage.channel.projectId,
              workspaceId: attachment.channelMessage.channel.workspaceId,
            }
          : null;

    if (!ref || ref.workspaceId !== workspaceId) {
      throw new NotFoundException('Attachment not found');
    }

    return ref;
  }
}
