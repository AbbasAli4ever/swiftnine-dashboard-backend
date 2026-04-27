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
const activity_service_1 = require("../activity/activity.service");
let AttachmentsService = class AttachmentsService {
    prisma;
    activity;
    s3;
    constructor(prisma, activity) {
        this.prisma = prisma;
        this.activity = activity;
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
        const id = (0, node_crypto_1.randomUUID)();
        const ext = dto.fileName?.split('.').pop() ?? dto.mimeType.split('/').pop() ?? 'bin';
        const sanitizedFileName = (dto.fileName ?? `${id}.${ext}`).replace(/\s+/g, '_');
        const filename = `${id}-${sanitizedFileName}`;
        const rawBasePrefix = process.env.AWS_S3_PREFIX ?? 'swiftnine/docs/app';
        const basePrefix = rawBasePrefix.replace(/^\/+|\/+$/g, '');
        const rawScopePrefix = dto.taskId
            ? `attachments/task-${dto.taskId}`
            : dto.workspaceId
                ? `attachments/workspace-${dto.workspaceId}`
                : `attachments/user-${userId}`;
        const scopePrefix = rawScopePrefix.replace(/^\/+|\/+$/g, '');
        const s3Key = `${basePrefix}/${scopePrefix}/${filename}`;
        const cmd = new client_s3_1.PutObjectCommand({ Bucket: bucket, Key: s3Key });
        const expiresIn = 60 * 15;
        const uploadUrl = await (0, s3_request_presigner_1.getSignedUrl)(this.s3, cmd, { expiresIn });
        const expiresAt = new Date(Date.now() + expiresIn * 1000);
        return { uploadUrl, s3Key, expiresAt };
    }
    async createAttachment(actorId, taskId, memberId, s3Key, fileName, mimeType, fileSize) {
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
        if (!task)
            throw new common_1.NotFoundException('Task not found');
        const workspaceId = task.list.project.workspaceId;
        const member = await this.resolveWorkspaceMember(workspaceId, memberId);
        if (!member)
            throw new common_1.NotFoundException('Member not found in workspace');
        if (actorId !== member.userId) {
            throw new common_1.ForbiddenException('Actor must be the same as member');
        }
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
                if (!fileName && head.Metadata && Object.keys(head.Metadata).length > 0) {
                    const possibleName = head.Metadata['filename'] || head.Metadata['file-name'] || head.Metadata['originalname'];
                    if (possibleName)
                        resolvedFileName = possibleName;
                }
            }
            catch (err) {
                throw new common_1.InternalServerErrorException('Failed to fetch S3 object metadata');
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
    async listAttachmentsForTask(actorId, taskId, memberId) {
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
        if (!task)
            throw new common_1.NotFoundException('Task not found');
        const workspaceId = task.list.project.workspaceId;
        const member = await this.resolveWorkspaceMember(workspaceId, memberId);
        if (!member)
            throw new common_1.NotFoundException('Member not found in workspace');
        const attachments = await this.prisma.attachment.findMany({
            where: { taskId, deletedAt: null },
            select: { id: true, fileName: true, mimeType: true, s3Key: true, fileSize: true },
            orderBy: { createdAt: 'asc' },
        });
        const results = await Promise.all(attachments.map(async (att) => {
            const cmd = new client_s3_1.GetObjectCommand({ Bucket: process.env.AWS_S3_BUCKET, Key: att.s3Key });
            const url = await (0, s3_request_presigner_1.getSignedUrl)(this.s3, cmd, { expiresIn: 60 * 15 });
            return {
                ...att,
                fileSize: Number(att.fileSize),
                url,
                expiresAt: new Date(Date.now() + 15 * 60 * 1000),
            };
        }));
        return results;
    }
    async deleteAttachment(actorId, taskId, memberId, s3Key) {
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
        if (!task)
            throw new common_1.NotFoundException('Task not found');
        const workspaceId = task.list.project.workspaceId;
        const member = await this.resolveWorkspaceMember(workspaceId, memberId);
        if (!member)
            throw new common_1.NotFoundException('Member not found in workspace');
        if (actorId !== member.userId) {
            throw new common_1.ForbiddenException('Actor must be the same as member');
        }
        const attachment = await this.prisma.attachment.findFirst({
            where: { taskId, s3Key, deletedAt: null },
            select: { id: true, s3Key: true, fileName: true, mimeType: true, fileSize: true },
        });
        if (!attachment)
            throw new common_1.NotFoundException('Attachment not found');
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
};
exports.AttachmentsService = AttachmentsService;
exports.AttachmentsService = AttachmentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_1.PrismaService,
        activity_service_1.ActivityService])
], AttachmentsService);
//# sourceMappingURL=attachments.service.js.map