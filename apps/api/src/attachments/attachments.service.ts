import { Injectable, InternalServerErrorException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { S3Client, PutObjectCommand, GetObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { randomUUID } from 'node:crypto';
import type { PresignAttachmentDto } from './dto/presign-attachment.dto';
import { PrismaService } from '@app/database';
import { ActivityService } from '../activity/activity.service';

@Injectable()
export class AttachmentsService {
  private readonly s3: S3Client;

  constructor(
    private readonly prisma: PrismaService,
    private readonly activity: ActivityService,
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
    if (!bucket) throw new InternalServerErrorException('S3 bucket is not configured');

    const id = randomUUID();
    const ext = dto.fileName?.split('.').pop() ?? dto.mimeType.split('/').pop() ?? 'bin';
    const sanitizedFileName = (dto.fileName ?? `${id}.${ext}`).replace(/\s+/g, '_');
    const filename = `${id}-${sanitizedFileName}`;

    // Allow an optional base prefix (folder) inside the bucket, defaulting to swiftnine/docs/app
    const rawBasePrefix = process.env.AWS_S3_PREFIX ?? 'swiftnine/docs/app';
    const basePrefix = rawBasePrefix.replace(/^\/+|\/+$/g, '');

    const rawScopePrefix = dto.taskId
      ? `attachments/task-${dto.taskId}`
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

    return { uploadUrl, s3Key, expiresAt };
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
      where: { id: taskId, deletedAt: null, list: { deletedAt: null, project: { workspace: { deletedAt: null } } } },
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

    const bucket = process.env.AWS_S3_BUCKET;
    if (!bucket) throw new InternalServerErrorException('S3 bucket is not configured');

    // Resolve metadata from S3 when not provided by client
    let resolvedFileName: string = fileName ?? s3Key.split('/').pop() ?? s3Key;
    let resolvedMimeType: string = mimeType ?? 'application/octet-stream';
    let resolvedFileSize: bigint;

    if (fileSize !== undefined) {
      resolvedFileSize = BigInt(fileSize);
    } else {
      try {
        const head = await this.s3.send(new HeadObjectCommand({ Bucket: bucket, Key: s3Key }));
        if (head.ContentLength === undefined || head.ContentLength === null) {
          throw new InternalServerErrorException('Unable to determine file size from S3 metadata');
        }
        resolvedFileSize = BigInt(head.ContentLength);
        resolvedMimeType = head.ContentType ?? resolvedMimeType;
        // allow S3 object metadata to override filename if present
        if (!fileName && head.Metadata && Object.keys(head.Metadata).length > 0) {
          const possibleName = head.Metadata['filename'] || head.Metadata['file-name'] || head.Metadata['originalname'];
          if (possibleName) resolvedFileName = possibleName;
        }
      } catch (err) {
        // If HeadObject failed, surface a clear error
        throw new InternalServerErrorException('Failed to fetch S3 object metadata');
      }
    }

    const attachment = await this.prisma.attachment.create({
      data: {
        taskId,
        uploadedBy: member.userId,
        fileName: resolvedFileName,
        s3Key,
        mimeType: resolvedMimeType,
        fileSize: resolvedFileSize,
      },
      select: { id: true, s3Key: true, fileName: true, mimeType: true, fileSize: true, createdAt: true },
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

  async listAttachmentsForTask(actorId: string, taskId: string, memberId: string) {
    const task = await this.prisma.task.findFirst({
      where: { id: taskId, deletedAt: null, list: { deletedAt: null, project: { workspace: { deletedAt: null } } } },
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
      select: { id: true, fileName: true, mimeType: true, s3Key: true, fileSize: true },
      orderBy: { createdAt: 'asc' },
    });

    const results = await Promise.all(
      attachments.map(async (att) => {
        const cmd = new GetObjectCommand({ Bucket: process.env.AWS_S3_BUCKET, Key: att.s3Key });
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

  async deleteAttachment(actorId: string, taskId: string, memberId: string, s3Key: string) {
    const task = await this.prisma.task.findFirst({
      where: { id: taskId, deletedAt: null, list: { deletedAt: null, project: { workspace: { deletedAt: null } } } },
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
      select: { id: true, s3Key: true, fileName: true, mimeType: true, fileSize: true },
    });
    if (!attachment) throw new NotFoundException('Attachment not found');

    await this.prisma.attachment.update({ where: { id: attachment.id }, data: { deletedAt: new Date() } });

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
}
