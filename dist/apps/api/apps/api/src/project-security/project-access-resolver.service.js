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
exports.ProjectAccessResolverService = void 0;
const common_1 = require("@nestjs/common");
const database_1 = require("../../../../libs/database/src");
let ProjectAccessResolverService = class ProjectAccessResolverService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async resolveProjectIdFromTaskId(workspaceId, taskId) {
        const task = await this.prisma.task.findFirst({
            where: {
                id: taskId,
                deletedAt: null,
                list: { deletedAt: null, project: { workspaceId, deletedAt: null } },
            },
            select: { list: { select: { projectId: true } } },
        });
        if (!task)
            throw new common_1.NotFoundException('Task not found');
        return task.list.projectId;
    }
    async resolveProjectIdFromListId(workspaceId, listId) {
        const list = await this.prisma.taskList.findFirst({
            where: { id: listId, deletedAt: null, project: { workspaceId, deletedAt: null } },
            select: { projectId: true },
        });
        if (!list)
            throw new common_1.NotFoundException('Task list not found');
        return list.projectId;
    }
    async resolveProjectIdFromStatusId(workspaceId, statusId) {
        const status = await this.prisma.status.findFirst({
            where: { id: statusId, deletedAt: null, project: { workspaceId, deletedAt: null } },
            select: { projectId: true },
        });
        if (!status)
            throw new common_1.NotFoundException('Status not found');
        return status.projectId;
    }
    async resolveProjectIdFromCommentId(workspaceId, commentId) {
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
        if (!comment)
            throw new common_1.NotFoundException('Comment not found');
        return comment.task.list.projectId;
    }
    async resolveProjectIdFromTimeEntryId(workspaceId, timeEntryId) {
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
        if (!entry)
            throw new common_1.NotFoundException('Time entry not found');
        return entry.task.list.projectId;
    }
    async resolveProjectIdFromChannelId(workspaceId, channelId) {
        const channel = await this.prisma.channel.findFirst({
            where: { id: channelId, workspaceId },
            select: { projectId: true },
        });
        if (!channel)
            throw new common_1.NotFoundException('Channel not found');
        return channel.projectId;
    }
    async resolveProjectIdFromMessageId(workspaceId, messageId) {
        const message = await this.prisma.channelMessage.findFirst({
            where: { id: messageId, deletedAt: null, channel: { workspaceId } },
            select: { channel: { select: { projectId: true } } },
        });
        if (!message)
            throw new common_1.NotFoundException('Message not found');
        return message.channel.projectId;
    }
    async resolveProjectIdFromDocId(workspaceId, docId) {
        const doc = await this.prisma.doc.findFirst({
            where: { id: docId, workspaceId, deletedAt: null },
            select: { projectId: true },
        });
        if (!doc)
            throw new common_1.NotFoundException('Doc not found');
        return doc.projectId;
    }
    async resolveProjectRefFromAttachmentId(workspaceId, attachmentId) {
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
        if (!attachment)
            throw new common_1.NotFoundException('Attachment not found');
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
            throw new common_1.NotFoundException('Attachment not found');
        }
        return ref;
    }
};
exports.ProjectAccessResolverService = ProjectAccessResolverService;
exports.ProjectAccessResolverService = ProjectAccessResolverService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_1.PrismaService])
], ProjectAccessResolverService);
//# sourceMappingURL=project-access-resolver.service.js.map