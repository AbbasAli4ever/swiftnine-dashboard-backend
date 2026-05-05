import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { randomUUID } from 'node:crypto';
import type { PresignAttachmentDto } from './dto/presign-attachment.dto';
import { PrismaService } from '@app/database';
import { ActivityService } from '../activity/activity.service';
import { DocPermissionsService } from '../docs/doc-permissions.service';

@Injectable()
export class AttachmentsService {
  private readonly s3: S3Client;

  constructor(
    private readonly prisma: PrismaService,
    private readonly activity: ActivityService,
    private readonly docPermissions: DocPermissionsService,
  ) {
    this.s3 = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? '',
      },
      // Keep presigned URLs free of optional checksum query params.
      // Some HTTP clients rewrite these params and invalidate signatures.
      requestChecksumCalculation: 'WHEN_REQUIRED',
      responseChecksumValidation: 'WHEN_REQUIRED',
    });
  }

  async presignUpload(userId: string, dto: PresignAttachmentDto) {
    const bucket = process.env.AWS_S3_BUCKET;
    if (!bucket)
      throw new InternalServerErrorException('S3 bucket is not configured');

    if (dto.scope && dto.scope !== 'channel-message') {
      throw new BadRequestException('Unsupported attachment scope');
    }
    if (dto.scope === 'channel-message' && !dto.channelId) {
      throw new BadRequestException(
        'channelId is required for channel-message uploads',
      );
    }

    const id = randomUUID();
    const ext =
      dto.fileName?.split('.').pop() ?? dto.mimeType.split('/').pop() ?? 'bin';
    const sanitizedFileName = (dto.fileName ?? `${id}.${ext}`).replace(
      /\s+/g,
      '_',
    );
    const filename = `${id}-${sanitizedFileName}`;

    // Allow an optional base prefix (folder) inside the bucket, defaulting to swiftnine/docs/app
    const rawBasePrefix = process.env.AWS_S3_PREFIX ?? 'swiftnine/docs/app';
    const basePrefix = rawBasePrefix.replace(/^\/+|\/+$/g, '');

    if (
      [dto.taskId, dto.docId, dto.workspaceId, dto.channelId].filter(Boolean)
        .length > 1
    ) {
      throw new BadRequestException('Only one upload scope can be provided');
    }

    if (dto.docId) {
      const doc = await this.findDocOrThrow(dto.docId);
      await this.docPermissions.assertCanEdit(userId, doc);
    }
    if (dto.channelId) {
      await this.findChannelMemberOrThrow(dto.channelId, userId);
    }

    const rawScopePrefix = dto.taskId
      ? `attachments/task-${dto.taskId}`
      : dto.docId
        ? `attachments/doc-${dto.docId}`
        : dto.channelId
          ? `attachments/channel-${dto.channelId}`
          : dto.workspaceId
            ? `attachments/workspace-${dto.workspaceId}`
            : `attachments/user-${userId}`;
    const scopePrefix = rawScopePrefix.replace(/^\/+|\/+$/g, '');

    const s3Key = `${basePrefix}/${scopePrefix}/${filename}`;

    // Do not include `ContentType` in the signed request to avoid signature
    // mismatches caused by the client sending a different Content-Type header.
    // The frontend should still set `Content-Type` when uploading; metadata
    // will be resolved later from S3 if needed.
    const cmd = new PutObjectCommand({ Bucket: bucket, Key: s3Key });

    const expiresIn = 60 * 15; // 15 minutes
    const uploadUrl = await getSignedUrl(this.s3, cmd, { expiresIn });

    const expiresAt = new Date(Date.now() + expiresIn * 1000);

    let attachmentId: string | null = null;

    if (dto.channelId) {
      const attachment = await this.prisma.attachment.create({
        data: {
          channelMessageId: null,
          uploadedBy: userId,
          fileName: dto.fileName ?? sanitizedFileName,
          s3Key,
          mimeType: dto.mimeType,
          fileSize: BigInt(dto.fileSize ?? 0),
        },
        select: { id: true },
      });
      attachmentId = attachment.id;
    }

    return { uploadUrl, s3Key, expiresAt, attachmentId };
  }

  async createAttachment(
    actorId: string,
    taskId: string,
    memberId: string,
    s3Key: string,
    fileName?: string,
    mimeType?: string,
    fileSize?: number,
  ) {
    // Ensure task exists and belongs to a workspace
    const task = await this.prisma.task.findFirst({
      where: {
        id: taskId,
        deletedAt: null,
        list: { deletedAt: null, project: { workspace: { deletedAt: null } } },
      },
      select: {
        id: true,
        title: true,
        taskNumber: true,
        list: {
          select: {
            id: true,
            name: true,
            project: { select: { id: true, name: true, workspaceId: true } },
          },
        },
      },
    });

    if (!task) throw new NotFoundException('Task not found');

    const workspaceId = task.list.project.workspaceId as string;

    const member = await this.resolveWorkspaceMember(workspaceId, memberId);

    if (!member) throw new NotFoundException('Member not found in workspace');

    if (actorId !== member.userId) {
      throw new ForbiddenException('Actor must be the same as member');
    }

    const metadata = await this.resolveUploadedFileMetadata(
      s3Key,
      fileName,
      mimeType,
      fileSize,
    );

    const attachment = await this.prisma.attachment.create({
      data: {
        taskId,
        uploadedBy: member.userId,
        fileName: metadata.fileName,
        s3Key,
        mimeType: metadata.mimeType,
        fileSize: metadata.fileSize,
      },
      select: {
        id: true,
        s3Key: true,
        fileName: true,
        mimeType: true,
        fileSize: true,
        createdAt: true,
      },
    });

    await this.activity.log({
      workspaceId,
      entityType: 'attachment',
      entityId: attachment.id,
      action: 'file_uploaded',
      metadata: {
        taskId,
        taskTitle: task.title,
        taskNumber: task.taskNumber,
        projectId: task.list.project.id,
        projectName: task.list.project.name,
        listId: task.list.id,
        listName: task.list.name,
        fileName: attachment.fileName,
        mimeType: attachment.mimeType,
        fileSize: Number(attachment.fileSize),
      },
      performedBy: actorId,
    });

    return {
      ...attachment,
      fileSize: Number(attachment.fileSize),
    };
  }

  async createAttachmentForDoc(
    actorId: string,
    docId: string,
    s3Key: string,
    fileName?: string,
    mimeType?: string,
    fileSize?: number,
  ) {
    const doc = await this.findDocOrThrow(docId);
    await this.docPermissions.assertCanEdit(actorId, doc);
    this.assertDocAttachmentKey(docId, s3Key);

    const metadata = await this.resolveUploadedFileMetadata(
      s3Key,
      fileName,
      mimeType,
      fileSize,
    );

    const attachment = await this.prisma.attachment.create({
      data: {
        docId,
        uploadedBy: actorId,
        fileName: metadata.fileName,
        s3Key,
        mimeType: metadata.mimeType,
        fileSize: metadata.fileSize,
      },
      select: {
        id: true,
        s3Key: true,
        fileName: true,
        mimeType: true,
        fileSize: true,
        createdAt: true,
      },
    });

    await this.activity.log({
      workspaceId: doc.workspaceId,
      entityType: 'attachment',
      entityId: attachment.id,
      action: 'file_uploaded',
      metadata: {
        docId,
        docTitle: doc.title,
        fileName: attachment.fileName,
        mimeType: attachment.mimeType,
        fileSize: Number(attachment.fileSize),
      },
      performedBy: actorId,
    });

    return {
      ...attachment,
      fileSize: Number(attachment.fileSize),
    };
  }

  async listAttachmentsForTask(
    actorId: string,
    taskId: string,
    memberId: string,
  ) {
    const task = await this.prisma.task.findFirst({
      where: {
        id: taskId,
        deletedAt: null,
        list: { deletedAt: null, project: { workspace: { deletedAt: null } } },
      },
      select: {
        id: true,
        title: true,
        taskNumber: true,
        list: {
          select: {
            id: true,
            name: true,
            project: { select: { id: true, name: true, workspaceId: true } },
          },
        },
      },
    });

    if (!task) throw new NotFoundException('Task not found');

    const workspaceId = task.list.project.workspaceId as string;

    const member = await this.resolveWorkspaceMember(workspaceId, memberId);
    if (!member) throw new NotFoundException('Member not found in workspace');

    const attachments = await this.prisma.attachment.findMany({
      where: { taskId, deletedAt: null },
      select: {
        id: true,
        fileName: true,
        mimeType: true,
        s3Key: true,
        fileSize: true,
      },
      orderBy: { createdAt: 'asc' },
    });

    const results = await Promise.all(
      attachments.map(async (att) => {
        const cmd = new GetObjectCommand({
          Bucket: process.env.AWS_S3_BUCKET,
          Key: att.s3Key,
        });
        const url = await getSignedUrl(this.s3, cmd, { expiresIn: 60 * 15 });
        return {
          ...att,
          fileSize: Number(att.fileSize),
          url,
          expiresAt: new Date(Date.now() + 15 * 60 * 1000),
        };
      }),
    );

    return results;
  }

  async listAttachmentsForDoc(actorId: string, docId: string) {
    const doc = await this.findDocOrThrow(docId);
    await this.docPermissions.assertCanView(actorId, doc);

    const attachments = await this.prisma.attachment.findMany({
      where: { docId, deletedAt: null },
      select: {
        id: true,
        fileName: true,
        mimeType: true,
        s3Key: true,
        fileSize: true,
      },
      orderBy: { createdAt: 'asc' },
    });

    return Promise.all(attachments.map((att) => this.toViewAttachment(att)));
  }

  async deleteAttachment(
    actorId: string,
    taskId: string,
    memberId: string,
    s3Key: string,
  ) {
    const task = await this.prisma.task.findFirst({
      where: {
        id: taskId,
        deletedAt: null,
        list: { deletedAt: null, project: { workspace: { deletedAt: null } } },
      },
      select: {
        id: true,
        title: true,
        taskNumber: true,
        list: {
          select: {
            id: true,
            name: true,
            project: { select: { id: true, name: true, workspaceId: true } },
          },
        },
      },
    });

    if (!task) throw new NotFoundException('Task not found');

    const workspaceId = task.list.project.workspaceId as string;

    const member = await this.resolveWorkspaceMember(workspaceId, memberId);
    if (!member) throw new NotFoundException('Member not found in workspace');

    if (actorId !== member.userId) {
      throw new ForbiddenException('Actor must be the same as member');
    }

    const attachment = await this.prisma.attachment.findFirst({
      where: { taskId, s3Key, deletedAt: null },
      select: {
        id: true,
        s3Key: true,
        fileName: true,
        mimeType: true,
        fileSize: true,
      },
    });
    if (!attachment) throw new NotFoundException('Attachment not found');

    await this.prisma.attachment.update({
      where: { id: attachment.id },
      data: { deletedAt: new Date() },
    });

    await this.activity.log({
      workspaceId,
      entityType: 'attachment',
      entityId: attachment.id,
      action: 'file_deleted',
      metadata: {
        taskId,
        taskTitle: task.title,
        taskNumber: task.taskNumber,
        projectId: task.list.project.id,
        projectName: task.list.project.name,
        listId: task.list.id,
        listName: task.list.name,
        fileName: attachment.fileName,
        mimeType: attachment.mimeType,
        fileSize: Number(attachment.fileSize),
      },
      performedBy: actorId,
    });

    return { id: attachment.id, s3Key };
  }

  async deleteAttachmentForDoc(actorId: string, docId: string, s3Key: string) {
    const doc = await this.findDocOrThrow(docId);
    await this.docPermissions.assertCanEdit(actorId, doc);
    this.assertDocAttachmentKey(docId, s3Key);

    const attachment = await this.prisma.attachment.findFirst({
      where: { docId, s3Key, deletedAt: null },
      select: {
        id: true,
        s3Key: true,
        fileName: true,
        mimeType: true,
        fileSize: true,
      },
    });
    if (!attachment) throw new NotFoundException('Attachment not found');

    await this.prisma.attachment.update({
      where: { id: attachment.id },
      data: { deletedAt: new Date() },
    });

    await this.activity.log({
      workspaceId: doc.workspaceId,
      entityType: 'attachment',
      entityId: attachment.id,
      action: 'file_deleted',
      metadata: {
        docId,
        docTitle: doc.title,
        fileName: attachment.fileName,
        mimeType: attachment.mimeType,
        fileSize: Number(attachment.fileSize),
      },
      performedBy: actorId,
    });

    return { id: attachment.id, s3Key };
  }

  private async resolveWorkspaceMember(workspaceId: string, memberId: string) {
    let member = await this.prisma.workspaceMember.findFirst({
      where: { id: memberId, workspaceId, deletedAt: null },
      select: { id: true, userId: true },
    });

    if (!member) {
      member = await this.prisma.workspaceMember.findFirst({
        where: { userId: memberId, workspaceId, deletedAt: null },
        select: { id: true, userId: true },
      });
    }

    return member;
  }

  private async findDocOrThrow(docId: string) {
    const doc = await this.prisma.doc.findFirst({
      where: { id: docId, deletedAt: null },
      select: {
        id: true,
        workspaceId: true,
        projectId: true,
        ownerId: true,
        scope: true,
        title: true,
      },
    });

    if (!doc) throw new NotFoundException('Document not found');
    return doc;
  }

  private async findChannelMemberOrThrow(channelId: string, userId: string) {
    const membership = await this.prisma.channelMember.findFirst({
      where: { channelId, userId },
      select: {
        id: true,
        channel: { select: { id: true, workspaceId: true } },
      },
    });

    if (!membership) {
      throw new ForbiddenException('Channel membership required');
    }

    return membership;
  }

  private async resolveUploadedFileMetadata(
    s3Key: string,
    fileName?: string,
    mimeType?: string,
    fileSize?: number,
  ): Promise<{ fileName: string; mimeType: string; fileSize: bigint }> {
    const bucket = process.env.AWS_S3_BUCKET;
    if (!bucket)
      throw new InternalServerErrorException('S3 bucket is not configured');

    let resolvedFileName: string = fileName ?? s3Key.split('/').pop() ?? s3Key;
    let resolvedMimeType: string = mimeType ?? 'application/octet-stream';
    let resolvedFileSize: bigint;

    if (fileSize !== undefined) {
      resolvedFileSize = BigInt(fileSize);
    } else {
      try {
        const head = await this.s3.send(
          new HeadObjectCommand({ Bucket: bucket, Key: s3Key }),
        );
        if (head.ContentLength === undefined || head.ContentLength === null) {
          throw new InternalServerErrorException(
            'Unable to determine file size from S3 metadata',
          );
        }
        resolvedFileSize = BigInt(head.ContentLength);
        resolvedMimeType = head.ContentType ?? resolvedMimeType;
        if (
          !fileName &&
          head.Metadata &&
          Object.keys(head.Metadata).length > 0
        ) {
          const possibleName =
            head.Metadata['filename'] ||
            head.Metadata['file-name'] ||
            head.Metadata['originalname'];
          if (possibleName) resolvedFileName = possibleName;
        }
      } catch {
        throw new InternalServerErrorException(
          'Failed to fetch S3 object metadata',
        );
      }
    }

    return {
      fileName: resolvedFileName,
      mimeType: resolvedMimeType,
      fileSize: resolvedFileSize,
    };
  }

  private assertDocAttachmentKey(docId: string, s3Key: string): void {
    const rawBasePrefix = process.env.AWS_S3_PREFIX ?? 'swiftnine/docs/app';
    const basePrefix = rawBasePrefix.replace(/^\/+|\/+$/g, '');
    const expectedPrefix = `${basePrefix}/attachments/doc-${docId}/`;

    if (!s3Key.startsWith(expectedPrefix)) {
      throw new BadRequestException('S3 key does not belong to this document');
    }
  }

  async toViewAttachment(att: {
    id: string;
    fileName: string;
    mimeType: string;
    s3Key: string;
    fileSize: bigint;
  }) {
    const cmd = new GetObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET,
      Key: att.s3Key,
    });
    const url = await getSignedUrl(this.s3, cmd, { expiresIn: 60 * 15 });
    return {
      ...att,
      fileSize: Number(att.fileSize),
      url,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000),
    };
  }
}
