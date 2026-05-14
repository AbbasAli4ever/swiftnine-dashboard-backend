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
import { AttachmentKind, type Role } from '@app/database/generated/prisma/client';
import { ActivityService } from '../activity/activity.service';
import { DocPermissionsService } from '../docs/doc-permissions.service';
import { ProjectSecurityService } from '../project-security/project-security.service';
import type { ConfirmProjectAttachmentInput } from './dto/confirm-project-attachment.dto';
import type { CreateProjectLinkInput } from './dto/create-project-link.dto';
import type { ListProjectAttachmentsQuery } from './dto/list-project-attachments.query.dto';
import type { PresignProjectAttachmentInput } from './dto/presign-project-attachment.dto';
import type {
  ProjectAttachmentListResponseDto,
  ProjectAttachmentResponseDto,
} from './dto/project-attachment-response.dto';
import type { ProjectAttachmentSearchResponseDto } from './dto/project-attachment-search-response.dto';
import type { UpdateProjectAttachmentInput } from './dto/update-project-attachment.dto';

@Injectable()
export class AttachmentsService {
  private readonly s3: S3Client;

  constructor(
    private readonly prisma: PrismaService,
    private readonly activity: ActivityService,
    private readonly docPermissions: DocPermissionsService,
    private readonly projectSecurity: ProjectSecurityService,
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
      if (doc.projectId) {
        await this.projectSecurity.assertUnlocked(doc.workspaceId, doc.projectId, userId);
      }
    }
    if (dto.channelId) {
      const membership = await this.findChannelMemberOrThrow(dto.channelId, userId);
      if (membership.channel.projectId) {
        await this.projectSecurity.assertUnlocked(
          membership.channel.workspaceId,
          membership.channel.projectId,
          userId,
        );
      }
    }
    if (dto.taskId) {
      await this.assertTaskUnlocked(userId, dto.taskId);
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

  async presignProjectUpload(
    userId: string,
    workspaceId: string,
    projectId: string,
    dto: PresignProjectAttachmentInput,
  ): Promise<{
    uploadUrl: string;
    s3Key: string;
    expiresAt: Date;
    attachmentId: null;
  }> {
    await this.findProjectForAttachmentOrThrow(workspaceId, projectId);

    const bucket = process.env.AWS_S3_BUCKET;
    if (!bucket)
      throw new InternalServerErrorException('S3 bucket is not configured');

    const id = randomUUID();
    const ext =
      dto.fileName?.split('.').pop() ?? dto.mimeType.split('/').pop() ?? 'bin';
    const sanitizedFileName = (dto.fileName ?? `${id}.${ext}`).replace(
      /\s+/g,
      '_',
    );
    const s3Key = `${this.projectAttachmentPrefix(projectId)}/${id}-${sanitizedFileName}`;
    const expiresIn = 60 * 15;
    const uploadUrl = await getSignedUrl(
      this.s3,
      new PutObjectCommand({ Bucket: bucket, Key: s3Key }),
      { expiresIn },
    );

    void userId;
    return {
      uploadUrl,
      s3Key,
      expiresAt: new Date(Date.now() + expiresIn * 1000),
      attachmentId: null,
    };
  }

  async confirmProjectUpload(
    userId: string,
    workspaceId: string,
    projectId: string,
    dto: ConfirmProjectAttachmentInput,
  ): Promise<ProjectAttachmentResponseDto> {
    const project = await this.findProjectForAttachmentOrThrow(
      workspaceId,
      projectId,
    );
    this.assertProjectAttachmentKey(projectId, dto.s3Key);
    const metadata = await this.resolveUploadedFileMetadata(
      dto.s3Key,
      dto.fileName,
      dto.mimeType,
      dto.fileSize,
    );

    const attachment = await this.prisma.attachment.create({
      data: {
        projectId,
        uploadedBy: userId,
        kind: AttachmentKind.FILE,
        fileName: metadata.fileName,
        s3Key: dto.s3Key,
        mimeType: metadata.mimeType,
        fileSize: metadata.fileSize,
        linkUrl: null,
        title: dto.title ?? null,
        description: dto.description ?? null,
      },
      select: this.projectAttachmentSelect(),
    });

    await this.activity.log({
      workspaceId,
      entityType: 'attachment',
      entityId: attachment.id,
      action: 'attachment_uploaded',
      metadata: {
        projectId,
        projectName: project.name,
        kind: AttachmentKind.FILE,
        fileName: attachment.fileName,
        mimeType: attachment.mimeType,
        fileSize: Number(attachment.fileSize),
      },
      performedBy: userId,
    });

    return this.toProjectAttachmentResponse(attachment);
  }

  async createProjectLink(
    userId: string,
    workspaceId: string,
    projectId: string,
    dto: CreateProjectLinkInput,
  ): Promise<ProjectAttachmentResponseDto> {
    const project = await this.findProjectForAttachmentOrThrow(
      workspaceId,
      projectId,
    );

    const attachment = await this.prisma.attachment.create({
      data: {
        projectId,
        uploadedBy: userId,
        kind: AttachmentKind.LINK,
        fileName: dto.title,
        s3Key: null,
        mimeType: null,
        fileSize: null,
        linkUrl: dto.linkUrl,
        title: dto.title,
        description: dto.description ?? null,
      },
      select: this.projectAttachmentSelect(),
    });

    await this.activity.log({
      workspaceId,
      entityType: 'attachment',
      entityId: attachment.id,
      action: 'attachment_linked',
      metadata: {
        projectId,
        projectName: project.name,
        kind: AttachmentKind.LINK,
        linkUrl: attachment.linkUrl,
        title: attachment.title,
      },
      performedBy: userId,
    });

    return this.toProjectAttachmentResponse(attachment);
  }

  async listProjectAttachments(
    userId: string,
    workspaceId: string,
    projectId: string,
    query: ListProjectAttachmentsQuery,
  ): Promise<ProjectAttachmentListResponseDto> {
    await this.findProjectForAttachmentOrThrow(workspaceId, projectId);
    const cursor = this.decodeProjectAttachmentCursor(query.cursor);
    const limit = this.normalizeProjectAttachmentLimit(query.limit);
    const attachments = await this.prisma.attachment.findMany({
      where: {
        projectId,
        deletedAt: null,
        ...(query.kind ? { kind: query.kind } : {}),
        ...(query.uploadedBy ? { uploadedBy: query.uploadedBy } : {}),
        ...(query.q
          ? {
              OR: [
                { fileName: { contains: query.q, mode: 'insensitive' } },
                { title: { contains: query.q, mode: 'insensitive' } },
                { description: { contains: query.q, mode: 'insensitive' } },
                { linkUrl: { contains: query.q, mode: 'insensitive' } },
              ],
            }
          : {}),
        ...(cursor
          ? {
              OR: [
                { createdAt: { lt: cursor.createdAt } },
                { createdAt: cursor.createdAt, id: { lt: cursor.id } },
              ],
            }
          : {}),
      },
      select: this.projectAttachmentSelect(),
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      take: limit + 1,
    });
    const hasNext = attachments.length > limit;
    const items = hasNext ? attachments.slice(0, limit) : attachments;

    void userId;
    return {
      items: await Promise.all(
        items.map((attachment) => this.toProjectAttachmentResponse(attachment)),
      ),
      nextCursor: hasNext
        ? this.encodeProjectAttachmentCursor(items[items.length - 1])
        : null,
      limit,
    };
  }

  async getProjectAttachment(
    userId: string,
    workspaceId: string,
    projectId: string,
    attachmentId: string,
  ): Promise<ProjectAttachmentResponseDto> {
    await this.findProjectForAttachmentOrThrow(workspaceId, projectId);
    const attachment = await this.prisma.attachment.findFirst({
      where: { id: attachmentId, projectId, deletedAt: null },
      select: this.projectAttachmentSelect(),
    });
    if (!attachment) throw new NotFoundException('Attachment not found');

    void userId;
    return this.toProjectAttachmentResponse(attachment);
  }

  async searchProjectAttachments(
    userId: string,
    workspaceId: string,
    query: { q: string; projectId?: string; limit?: number },
  ): Promise<ProjectAttachmentSearchResponseDto[]> {
    const q = query.q.trim();
    if (!q) return [];

    const limit = Math.min(Math.max(query.limit ?? 50, 1), 50);

    if (query.projectId) {
      await this.projectSecurity.assertUnlocked(
        workspaceId,
        query.projectId,
        userId,
      );
    }

    const unlockedProjectIds = query.projectId
      ? new Set<string>()
      : await this.projectSecurity.activeUnlockedWorkspaceProjectIds(
          workspaceId,
          userId,
        );

    const attachments = await this.prisma.attachment.findMany({
      where: {
        projectId: { not: null },
        deletedAt: null,
        ...(query.projectId ? { projectId: query.projectId } : {}),
        project: {
          workspaceId,
          deletedAt: null,
          ...(query.projectId
            ? {}
            : {
                OR: [
                  { passwordHash: null },
                  { id: { in: Array.from(unlockedProjectIds) } },
                ],
              }),
        },
        OR: [
          { fileName: { contains: q, mode: 'insensitive' } },
          { title: { contains: q, mode: 'insensitive' } },
          { description: { contains: q, mode: 'insensitive' } },
          { linkUrl: { contains: q, mode: 'insensitive' } },
        ],
      },
      select: this.projectAttachmentSearchSelect(),
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      take: limit,
    });

    return attachments.map((attachment) =>
      this.toProjectAttachmentSearchResponse(attachment),
    );
  }

  async updateProjectAttachment(
    userId: string,
    workspaceId: string,
    role: Role,
    projectId: string,
    attachmentId: string,
    dto: UpdateProjectAttachmentInput,
  ): Promise<ProjectAttachmentResponseDto> {
    const project = await this.findProjectForAttachmentOrThrow(
      workspaceId,
      projectId,
    );
    const attachment = await this.prisma.attachment.findFirst({
      where: { id: attachmentId, projectId, deletedAt: null },
      select: {
        id: true,
        uploadedBy: true,
        kind: true,
        title: true,
        description: true,
      },
    });
    if (!attachment) throw new NotFoundException('Attachment not found');
    this.assertCanManageProjectAttachment(userId, role, attachment);

    const data: {
      title?: string | null;
      description?: string | null;
      fileName?: string;
    } = {};
    if (Object.prototype.hasOwnProperty.call(dto, 'title')) {
      data.title = dto.title ?? null;
      if (attachment.kind === AttachmentKind.LINK && dto.title) {
        data.fileName = dto.title;
      }
    }
    if (Object.prototype.hasOwnProperty.call(dto, 'description')) {
      data.description = dto.description ?? null;
    }

    const updated = await this.prisma.attachment.update({
      where: { id: attachment.id },
      data,
      select: this.projectAttachmentSelect(),
    });

    const changedFields = Object.keys(data).filter(
      (field) => field !== 'fileName',
    );
    await this.activity.log({
      workspaceId,
      entityType: 'attachment',
      entityId: attachment.id,
      action: 'attachment_updated',
      metadata: {
        projectId,
        projectName: project.name,
        kind: attachment.kind,
        changedFields,
        old: {
          title: attachment.title,
          description: attachment.description,
        },
        new: {
          title: updated.title,
          description: updated.description,
        },
      },
      performedBy: userId,
    });

    return this.toProjectAttachmentResponse(updated);
  }

  async deleteProjectAttachment(
    userId: string,
    workspaceId: string,
    role: Role,
    projectId: string,
    attachmentId: string,
  ): Promise<{ id: string; s3Key: string | null }> {
    const project = await this.findProjectForAttachmentOrThrow(
      workspaceId,
      projectId,
    );
    const attachment = await this.prisma.attachment.findFirst({
      where: { id: attachmentId, projectId, deletedAt: null },
      select: {
        id: true,
        uploadedBy: true,
        kind: true,
        fileName: true,
        mimeType: true,
        fileSize: true,
        s3Key: true,
        linkUrl: true,
      },
    });
    if (!attachment) throw new NotFoundException('Attachment not found');
    this.assertCanManageProjectAttachment(userId, role, attachment);

    await this.prisma.attachment.update({
      where: { id: attachment.id },
      data: { deletedAt: new Date() },
    });

    await this.activity.log({
      workspaceId,
      entityType: 'attachment',
      entityId: attachment.id,
      action: 'attachment_deleted',
      metadata: {
        projectId,
        projectName: project.name,
        kind: attachment.kind,
        fileName: attachment.fileName,
        mimeType: attachment.mimeType,
        fileSize: attachment.fileSize === null ? null : Number(attachment.fileSize),
        linkUrl: attachment.linkUrl,
      },
      performedBy: userId,
    });

    return { id: attachment.id, s3Key: attachment.s3Key };
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
    await this.projectSecurity.assertUnlocked(workspaceId, task.list.project.id, actorId);

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
    if (doc.projectId) {
      await this.projectSecurity.assertUnlocked(doc.workspaceId, doc.projectId, actorId);
    }
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
    await this.projectSecurity.assertUnlocked(workspaceId, task.list.project.id, actorId);

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

    return Promise.all(attachments.map((att) => this.toViewAttachment(att)));
  }

  async listAttachmentsForDoc(actorId: string, docId: string) {
    const doc = await this.findDocOrThrow(docId);
    await this.docPermissions.assertCanView(actorId, doc);
    if (doc.projectId) {
      await this.projectSecurity.assertUnlocked(doc.workspaceId, doc.projectId, actorId);
    }

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
    await this.projectSecurity.assertUnlocked(workspaceId, task.list.project.id, actorId);

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
    if (doc.projectId) {
      await this.projectSecurity.assertUnlocked(doc.workspaceId, doc.projectId, actorId);
    }
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
        channel: { select: { id: true, workspaceId: true, projectId: true } },
      },
    });

    if (!membership) {
      throw new ForbiddenException('Channel membership required');
    }

    return membership;
  }

  private async assertTaskUnlocked(userId: string, taskId: string): Promise<void> {
    const task = await this.prisma.task.findFirst({
      where: {
        id: taskId,
        deletedAt: null,
        list: { deletedAt: null, project: { deletedAt: null } },
      },
      select: {
        list: { select: { project: { select: { id: true, workspaceId: true } } } },
      },
    });

    if (!task) throw new NotFoundException('Task not found');

    await this.projectSecurity.assertUnlocked(
      task.list.project.workspaceId,
      task.list.project.id,
      userId,
    );
  }

  private async findProjectForAttachmentOrThrow(
    workspaceId: string,
    projectId: string,
  ) {
    const project = await this.prisma.project.findFirst({
      where: { id: projectId, workspaceId, deletedAt: null },
      select: { id: true, name: true, workspaceId: true },
    });

    if (!project) throw new NotFoundException('Project not found');
    return project;
  }

  private projectAttachmentPrefix(projectId: string): string {
    const rawBasePrefix = process.env.AWS_S3_PREFIX ?? 'swiftnine/docs/app';
    const basePrefix = rawBasePrefix.replace(/^\/+|\/+$/g, '');
    return `${basePrefix}/attachments/project-${projectId}`;
  }

  private assertProjectAttachmentKey(projectId: string, s3Key: string): void {
    const expectedPrefix = `${this.projectAttachmentPrefix(projectId)}/`;
    if (!s3Key.startsWith(expectedPrefix)) {
      throw new BadRequestException('S3 key does not belong to this project');
    }
  }

  private normalizeProjectAttachmentLimit(limit: number | undefined): number {
    return Math.min(Math.max(limit ?? 50, 1), 100);
  }

  private decodeProjectAttachmentCursor(
    cursor?: string,
  ): { createdAt: Date; id: string } | null {
    if (!cursor) return null;

    const separatorIndex = cursor.lastIndexOf(':');
    if (separatorIndex <= 0 || separatorIndex === cursor.length - 1) {
      throw new BadRequestException('Invalid cursor');
    }

    const createdAt = new Date(cursor.slice(0, separatorIndex));
    const id = cursor.slice(separatorIndex + 1);
    if (Number.isNaN(createdAt.getTime()) || !id) {
      throw new BadRequestException('Invalid cursor');
    }

    return { createdAt, id };
  }

  private encodeProjectAttachmentCursor(attachment?: {
    id: string;
    createdAt: Date;
  }): string | null {
    if (!attachment) return null;
    return `${attachment.createdAt.toISOString()}:${attachment.id}`;
  }

  private assertCanManageProjectAttachment(
    userId: string,
    role: Role,
    attachment: { uploadedBy: string },
  ): void {
    if (attachment.uploadedBy === userId || role === 'OWNER' || role === 'ADMIN') {
      return;
    }
    throw new ForbiddenException('Only the uploader or workspace admins can manage this attachment');
  }

  private projectAttachmentSelect() {
    return {
      id: true,
      kind: true,
      title: true,
      description: true,
      fileName: true,
      mimeType: true,
      fileSize: true,
      s3Key: true,
      linkUrl: true,
      uploadedBy: true,
      createdAt: true,
      uploader: {
        select: {
          id: true,
          fullName: true,
          avatarUrl: true,
        },
      },
    } as const;
  }

  private projectAttachmentSearchSelect() {
    return {
      id: true,
      projectId: true,
      kind: true,
      title: true,
      description: true,
      fileName: true,
      linkUrl: true,
      createdAt: true,
      uploader: {
        select: {
          id: true,
          fullName: true,
          avatarUrl: true,
        },
      },
    } as const;
  }

  private async toProjectAttachmentResponse(attachment: {
    id: string;
    kind: AttachmentKind;
    title: string | null;
    description: string | null;
    fileName: string | null;
    mimeType: string | null;
    fileSize: bigint | null;
    s3Key: string | null;
    linkUrl: string | null;
    createdAt: Date;
    uploader: {
      id: string;
      fullName: string;
      avatarUrl: string | null;
    };
  }): Promise<ProjectAttachmentResponseDto> {
    const base: ProjectAttachmentResponseDto = {
      id: attachment.id,
      kind: attachment.kind,
      title: attachment.title,
      description: attachment.description,
      uploadedBy: {
        id: attachment.uploader.id,
        name: attachment.uploader.fullName,
        avatarUrl: attachment.uploader.avatarUrl,
      },
      createdAt: attachment.createdAt,
    };

    if (attachment.kind === AttachmentKind.LINK) {
      return {
        ...base,
        linkUrl: attachment.linkUrl ?? undefined,
      };
    }

    this.assertFileAttachmentMetadata(attachment);
    const viewUrl = await getSignedUrl(
      this.s3,
      new GetObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET,
        Key: attachment.s3Key,
      }),
      { expiresIn: 60 * 15 },
    );

    return {
      ...base,
      fileName: attachment.fileName,
      mimeType: attachment.mimeType,
      fileSize: Number(attachment.fileSize),
      viewUrl,
    };
  }

  private toProjectAttachmentSearchResponse(attachment: {
    id: string;
    projectId: string | null;
    kind: AttachmentKind;
    title: string | null;
    description: string | null;
    fileName: string | null;
    linkUrl: string | null;
    createdAt: Date;
    uploader: {
      id: string;
      fullName: string;
      avatarUrl: string | null;
    };
  }): ProjectAttachmentSearchResponseDto {
    if (!attachment.projectId) {
      throw new InternalServerErrorException(
        'Project attachment search row is missing a project id',
      );
    }

    return {
      id: attachment.id,
      entityType: 'project_attachment',
      projectId: attachment.projectId,
      kind: attachment.kind,
      title: attachment.title,
      fileName: attachment.fileName,
      description: attachment.description,
      linkUrl: attachment.linkUrl,
      createdAt: attachment.createdAt,
      uploadedBy: {
        id: attachment.uploader.id,
        name: attachment.uploader.fullName,
        avatarUrl: attachment.uploader.avatarUrl,
      },
    };
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
    fileName: string | null;
    mimeType: string | null;
    s3Key: string | null;
    fileSize: bigint | null;
  }) {
    this.assertFileAttachmentMetadata(att);

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

  private assertFileAttachmentMetadata(att: {
    id: string;
    fileName: string | null;
    s3Key: string | null;
    mimeType: string | null;
    fileSize: bigint | null;
  }): asserts att is {
    id: string;
    fileName: string;
    s3Key: string;
    mimeType: string;
    fileSize: bigint;
  } {
    if (!att.fileName || !att.s3Key || !att.mimeType || att.fileSize === null) {
      throw new InternalServerErrorException(
        `Attachment ${att.id} is missing file metadata`,
      );
    }
  }
}
