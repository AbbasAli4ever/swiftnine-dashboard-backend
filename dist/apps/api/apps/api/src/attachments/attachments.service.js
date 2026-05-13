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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttachmentsService = void 0;
const common_1 = require("@nestjs/common");
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const node_crypto_1 = require("node:crypto");
const database_1 = require("../../../../libs/database/src");
const client_1 = require("../../../../libs/database/src/generated/prisma/client");
const activity_service_1 = require("../activity/activity.service");
const doc_permissions_service_1 = require("../docs/doc-permissions.service");
const project_security_service_1 = require("../project-security/project-security.service");
let AttachmentsService = class AttachmentsService {
    prisma;
    activity;
    docPermissions;
    projectSecurity;
    s3;
    constructor(prisma, activity, docPermissions, projectSecurity) {
        this.prisma = prisma;
        this.activity = activity;
        this.docPermissions = docPermissions;
        this.projectSecurity = projectSecurity;
        this.s3 = new client_s3_1.S3Client({
            region: process.env.AWS_REGION,
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? '',
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? '',
            },
            requestChecksumCalculation: 'WHEN_REQUIRED',
            responseChecksumValidation: 'WHEN_REQUIRED',
        });
    }
    async presignUpload(userId, dto) {
        const bucket = process.env.AWS_S3_BUCKET;
        if (!bucket)
            throw new common_1.InternalServerErrorException('S3 bucket is not configured');
        if (dto.scope && dto.scope !== 'channel-message') {
            throw new common_1.BadRequestException('Unsupported attachment scope');
        }
        if (dto.scope === 'channel-message' && !dto.channelId) {
            throw new common_1.BadRequestException('channelId is required for channel-message uploads');
        }
        const id = (0, node_crypto_1.randomUUID)();
        const ext = dto.fileName?.split('.').pop() ?? dto.mimeType.split('/').pop() ?? 'bin';
        const sanitizedFileName = (dto.fileName ?? `${id}.${ext}`).replace(/\s+/g, '_');
        const filename = `${id}-${sanitizedFileName}`;
        const rawBasePrefix = process.env.AWS_S3_PREFIX ?? 'swiftnine/docs/app';
        const basePrefix = rawBasePrefix.replace(/^\/+|\/+$/g, '');
        if ([dto.taskId, dto.docId, dto.workspaceId, dto.channelId].filter(Boolean)
            .length > 1) {
            throw new common_1.BadRequestException('Only one upload scope can be provided');
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
                await this.projectSecurity.assertUnlocked(membership.channel.workspaceId, membership.channel.projectId, userId);
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
        const cmd = new client_s3_1.PutObjectCommand({ Bucket: bucket, Key: s3Key });
        const expiresIn = 60 * 15;
        const uploadUrl = await (0, s3_request_presigner_1.getSignedUrl)(this.s3, cmd, { expiresIn });
        const expiresAt = new Date(Date.now() + expiresIn * 1000);
        let attachmentId = null;
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
    async presignProjectUpload(userId, workspaceId, projectId, dto) {
        await this.findProjectForAttachmentOrThrow(workspaceId, projectId);
        const bucket = process.env.AWS_S3_BUCKET;
        if (!bucket)
            throw new common_1.InternalServerErrorException('S3 bucket is not configured');
        const id = (0, node_crypto_1.randomUUID)();
        const ext = dto.fileName?.split('.').pop() ?? dto.mimeType.split('/').pop() ?? 'bin';
        const sanitizedFileName = (dto.fileName ?? `${id}.${ext}`).replace(/\s+/g, '_');
        const s3Key = `${this.projectAttachmentPrefix(projectId)}/${id}-${sanitizedFileName}`;
        const expiresIn = 60 * 15;
        const uploadUrl = await (0, s3_request_presigner_1.getSignedUrl)(this.s3, new client_s3_1.PutObjectCommand({ Bucket: bucket, Key: s3Key }), { expiresIn });
        void userId;
        return {
            uploadUrl,
            s3Key,
            expiresAt: new Date(Date.now() + expiresIn * 1000),
            attachmentId: null,
        };
    }
    async confirmProjectUpload(userId, workspaceId, projectId, dto) {
        const project = await this.findProjectForAttachmentOrThrow(workspaceId, projectId);
        this.assertProjectAttachmentKey(projectId, dto.s3Key);
        const metadata = await this.resolveUploadedFileMetadata(dto.s3Key, dto.fileName, dto.mimeType, dto.fileSize);
        const attachment = await this.prisma.attachment.create({
            data: {
                projectId,
                uploadedBy: userId,
                kind: client_1.AttachmentKind.FILE,
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
                kind: client_1.AttachmentKind.FILE,
                fileName: attachment.fileName,
                mimeType: attachment.mimeType,
                fileSize: Number(attachment.fileSize),
            },
            performedBy: userId,
        });
        return this.toProjectAttachmentResponse(attachment);
    }
    async createProjectLink(userId, workspaceId, projectId, dto) {
        const project = await this.findProjectForAttachmentOrThrow(workspaceId, projectId);
        const attachment = await this.prisma.attachment.create({
            data: {
                projectId,
                uploadedBy: userId,
                kind: client_1.AttachmentKind.LINK,
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
                kind: client_1.AttachmentKind.LINK,
                linkUrl: attachment.linkUrl,
                title: attachment.title,
            },
            performedBy: userId,
        });
        return this.toProjectAttachmentResponse(attachment);
    }
    async listProjectAttachments(userId, workspaceId, projectId, query) {
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
            items: await Promise.all(items.map((attachment) => this.toProjectAttachmentResponse(attachment))),
            nextCursor: hasNext
                ? this.encodeProjectAttachmentCursor(items[items.length - 1])
                : null,
            limit,
        };
    }
    async getProjectAttachment(userId, workspaceId, projectId, attachmentId) {
        await this.findProjectForAttachmentOrThrow(workspaceId, projectId);
        const attachment = await this.prisma.attachment.findFirst({
            where: { id: attachmentId, projectId, deletedAt: null },
            select: this.projectAttachmentSelect(),
        });
        if (!attachment)
            throw new common_1.NotFoundException('Attachment not found');
        void userId;
        return this.toProjectAttachmentResponse(attachment);
    }
    async searchProjectAttachments(userId, workspaceId, query) {
        const q = query.q.trim();
        if (!q)
            return [];
        const limit = Math.min(Math.max(query.limit ?? 50, 1), 50);
        if (query.projectId) {
            await this.projectSecurity.assertUnlocked(workspaceId, query.projectId, userId);
        }
        const unlockedProjectIds = query.projectId
            ? new Set()
            : await this.projectSecurity.activeUnlockedWorkspaceProjectIds(workspaceId, userId);
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
        return attachments.map((attachment) => this.toProjectAttachmentSearchResponse(attachment));
    }
    async updateProjectAttachment(userId, workspaceId, role, projectId, attachmentId, dto) {
        const project = await this.findProjectForAttachmentOrThrow(workspaceId, projectId);
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
        if (!attachment)
            throw new common_1.NotFoundException('Attachment not found');
        this.assertCanManageProjectAttachment(userId, role, attachment);
        const data = {};
        if (Object.prototype.hasOwnProperty.call(dto, 'title')) {
            data.title = dto.title ?? null;
            if (attachment.kind === client_1.AttachmentKind.LINK && dto.title) {
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
        const changedFields = Object.keys(data).filter((field) => field !== 'fileName');
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
    async deleteProjectAttachment(userId, workspaceId, role, projectId, attachmentId) {
        const project = await this.findProjectForAttachmentOrThrow(workspaceId, projectId);
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
        if (!attachment)
            throw new common_1.NotFoundException('Attachment not found');
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
    async createAttachment(actorId, taskId, memberId, s3Key, fileName, mimeType, fileSize) {
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
        if (!task)
            throw new common_1.NotFoundException('Task not found');
        const workspaceId = task.list.project.workspaceId;
        await this.projectSecurity.assertUnlocked(workspaceId, task.list.project.id, actorId);
        const member = await this.resolveWorkspaceMember(workspaceId, memberId);
        if (!member)
            throw new common_1.NotFoundException('Member not found in workspace');
        if (actorId !== member.userId) {
            throw new common_1.ForbiddenException('Actor must be the same as member');
        }
        const metadata = await this.resolveUploadedFileMetadata(s3Key, fileName, mimeType, fileSize);
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
    async createAttachmentForDoc(actorId, docId, s3Key, fileName, mimeType, fileSize) {
        const doc = await this.findDocOrThrow(docId);
        await this.docPermissions.assertCanEdit(actorId, doc);
        if (doc.projectId) {
            await this.projectSecurity.assertUnlocked(doc.workspaceId, doc.projectId, actorId);
        }
        this.assertDocAttachmentKey(docId, s3Key);
        const metadata = await this.resolveUploadedFileMetadata(s3Key, fileName, mimeType, fileSize);
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
    async listAttachmentsForTask(actorId, taskId, memberId) {
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
        if (!task)
            throw new common_1.NotFoundException('Task not found');
        const workspaceId = task.list.project.workspaceId;
        await this.projectSecurity.assertUnlocked(workspaceId, task.list.project.id, actorId);
        const member = await this.resolveWorkspaceMember(workspaceId, memberId);
        if (!member)
            throw new common_1.NotFoundException('Member not found in workspace');
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
    async listAttachmentsForDoc(actorId, docId) {
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
    async deleteAttachment(actorId, taskId, memberId, s3Key) {
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
        if (!task)
            throw new common_1.NotFoundException('Task not found');
        const workspaceId = task.list.project.workspaceId;
        await this.projectSecurity.assertUnlocked(workspaceId, task.list.project.id, actorId);
        const member = await this.resolveWorkspaceMember(workspaceId, memberId);
        if (!member)
            throw new common_1.NotFoundException('Member not found in workspace');
        if (actorId !== member.userId) {
            throw new common_1.ForbiddenException('Actor must be the same as member');
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
        if (!attachment)
            throw new common_1.NotFoundException('Attachment not found');
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
    async deleteAttachmentForDoc(actorId, docId, s3Key) {
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
        if (!attachment)
            throw new common_1.NotFoundException('Attachment not found');
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
    async resolveWorkspaceMember(workspaceId, memberId) {
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
    async findDocOrThrow(docId) {
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
        if (!doc)
            throw new common_1.NotFoundException('Document not found');
        return doc;
    }
    async findChannelMemberOrThrow(channelId, userId) {
        const membership = await this.prisma.channelMember.findFirst({
            where: { channelId, userId },
            select: {
                id: true,
                channel: { select: { id: true, workspaceId: true, projectId: true } },
            },
        });
        if (!membership) {
            throw new common_1.ForbiddenException('Channel membership required');
        }
        return membership;
    }
    async assertTaskUnlocked(userId, taskId) {
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
        if (!task)
            throw new common_1.NotFoundException('Task not found');
        await this.projectSecurity.assertUnlocked(task.list.project.workspaceId, task.list.project.id, userId);
    }
    async findProjectForAttachmentOrThrow(workspaceId, projectId) {
        const project = await this.prisma.project.findFirst({
            where: { id: projectId, workspaceId, deletedAt: null },
            select: { id: true, name: true, workspaceId: true },
        });
        if (!project)
            throw new common_1.NotFoundException('Project not found');
        return project;
    }
    projectAttachmentPrefix(projectId) {
        const rawBasePrefix = process.env.AWS_S3_PREFIX ?? 'swiftnine/docs/app';
        const basePrefix = rawBasePrefix.replace(/^\/+|\/+$/g, '');
        return `${basePrefix}/attachments/project-${projectId}`;
    }
    assertProjectAttachmentKey(projectId, s3Key) {
        const expectedPrefix = `${this.projectAttachmentPrefix(projectId)}/`;
        if (!s3Key.startsWith(expectedPrefix)) {
            throw new common_1.BadRequestException('S3 key does not belong to this project');
        }
    }
    normalizeProjectAttachmentLimit(limit) {
        return Math.min(Math.max(limit ?? 50, 1), 100);
    }
    decodeProjectAttachmentCursor(cursor) {
        if (!cursor)
            return null;
        const separatorIndex = cursor.lastIndexOf(':');
        if (separatorIndex <= 0 || separatorIndex === cursor.length - 1) {
            throw new common_1.BadRequestException('Invalid cursor');
        }
        const createdAt = new Date(cursor.slice(0, separatorIndex));
        const id = cursor.slice(separatorIndex + 1);
        if (Number.isNaN(createdAt.getTime()) || !id) {
            throw new common_1.BadRequestException('Invalid cursor');
        }
        return { createdAt, id };
    }
    encodeProjectAttachmentCursor(attachment) {
        if (!attachment)
            return null;
        return `${attachment.createdAt.toISOString()}:${attachment.id}`;
    }
    assertCanManageProjectAttachment(userId, role, attachment) {
        if (attachment.uploadedBy === userId || role === 'OWNER' || role === 'ADMIN') {
            return;
        }
        throw new common_1.ForbiddenException('Only the uploader or workspace admins can manage this attachment');
    }
    projectAttachmentSelect() {
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
        };
    }
    projectAttachmentSearchSelect() {
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
        };
    }
    async toProjectAttachmentResponse(attachment) {
        const base = {
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
        if (attachment.kind === client_1.AttachmentKind.LINK) {
            return {
                ...base,
                linkUrl: attachment.linkUrl ?? undefined,
            };
        }
        this.assertFileAttachmentMetadata(attachment);
        const viewUrl = await (0, s3_request_presigner_1.getSignedUrl)(this.s3, new client_s3_1.GetObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET,
            Key: attachment.s3Key,
        }), { expiresIn: 60 * 15 });
        return {
            ...base,
            fileName: attachment.fileName,
            mimeType: attachment.mimeType,
            fileSize: Number(attachment.fileSize),
            viewUrl,
        };
    }
    toProjectAttachmentSearchResponse(attachment) {
        if (!attachment.projectId) {
            throw new common_1.InternalServerErrorException('Project attachment search row is missing a project id');
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
    async resolveUploadedFileMetadata(s3Key, fileName, mimeType, fileSize) {
        const bucket = process.env.AWS_S3_BUCKET;
        if (!bucket)
            throw new common_1.InternalServerErrorException('S3 bucket is not configured');
        let resolvedFileName = fileName ?? s3Key.split('/').pop() ?? s3Key;
        let resolvedMimeType = mimeType ?? 'application/octet-stream';
        let resolvedFileSize;
        if (fileSize !== undefined) {
            resolvedFileSize = BigInt(fileSize);
        }
        else {
            try {
                const head = await this.s3.send(new client_s3_1.HeadObjectCommand({ Bucket: bucket, Key: s3Key }));
                if (head.ContentLength === undefined || head.ContentLength === null) {
                    throw new common_1.InternalServerErrorException('Unable to determine file size from S3 metadata');
                }
                resolvedFileSize = BigInt(head.ContentLength);
                resolvedMimeType = head.ContentType ?? resolvedMimeType;
                if (!fileName &&
                    head.Metadata &&
                    Object.keys(head.Metadata).length > 0) {
                    const possibleName = head.Metadata['filename'] ||
                        head.Metadata['file-name'] ||
                        head.Metadata['originalname'];
                    if (possibleName)
                        resolvedFileName = possibleName;
                }
            }
            catch {
                throw new common_1.InternalServerErrorException('Failed to fetch S3 object metadata');
            }
        }
        return {
            fileName: resolvedFileName,
            mimeType: resolvedMimeType,
            fileSize: resolvedFileSize,
        };
    }
    assertDocAttachmentKey(docId, s3Key) {
        const rawBasePrefix = process.env.AWS_S3_PREFIX ?? 'swiftnine/docs/app';
        const basePrefix = rawBasePrefix.replace(/^\/+|\/+$/g, '');
        const expectedPrefix = `${basePrefix}/attachments/doc-${docId}/`;
        if (!s3Key.startsWith(expectedPrefix)) {
            throw new common_1.BadRequestException('S3 key does not belong to this document');
        }
    }
    async toViewAttachment(att) {
        this.assertFileAttachmentMetadata(att);
        const cmd = new client_s3_1.GetObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET,
            Key: att.s3Key,
        });
        const url = await (0, s3_request_presigner_1.getSignedUrl)(this.s3, cmd, { expiresIn: 60 * 15 });
        return {
            ...att,
            fileSize: Number(att.fileSize),
            url,
            expiresAt: new Date(Date.now() + 15 * 60 * 1000),
        };
    }
    assertFileAttachmentMetadata(att) {
        if (!att.fileName || !att.s3Key || !att.mimeType || att.fileSize === null) {
            throw new common_1.InternalServerErrorException(`Attachment ${att.id} is missing file metadata`);
        }
    }
};
exports.AttachmentsService = AttachmentsService;
exports.AttachmentsService = AttachmentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_1.PrismaService,
        activity_service_1.ActivityService,
        doc_permissions_service_1.DocPermissionsService,
        project_security_service_1.ProjectSecurityService])
], AttachmentsService);
//# sourceMappingURL=attachments.service.js.map