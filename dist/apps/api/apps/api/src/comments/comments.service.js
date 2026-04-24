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
const sse_service_1 = require("./sse.service");
let CommentsService = CommentsService_1 = class CommentsService {
    prisma;
    sse;
    logger = new common_1.Logger(CommentsService_1.name);
    constructor(prisma, sse) {
        this.prisma = prisma;
        this.sse = sse;
    }
    async getCommentsForTask(workspaceId, taskId) {
        await this.assertTaskInWorkspaceOrThrow(workspaceId, taskId);
        const comments = await this.prisma.comment.findMany({
            where: { taskId, deletedAt: null },
            orderBy: { createdAt: 'asc' },
            include: { author: { select: { id: true, fullName: true, avatarUrl: true } }, reactions: true },
        });
        return comments;
    }
    async createComment(workspaceId, userId, taskId, content, parentId) {
        await this.assertTaskInWorkspaceOrThrow(workspaceId, taskId);
        if (parentId) {
            const parent = await this.prisma.comment.findFirst({ where: { id: parentId, taskId, deletedAt: null } });
            if (!parent)
                throw new common_1.BadRequestException('Parent comment not found or does not belong to this task');
        }
        const comment = await this.prisma.comment.create({
            data: { taskId, userId, parentId: parentId ?? null, content: content.trim() },
            include: { author: { select: { id: true, fullName: true, avatarUrl: true } }, reactions: true },
        });
        this.sse.broadcast(taskId, 'comment:created', comment);
        return comment;
    }
    async updateComment(workspaceId, userId, commentId, content) {
        const comment = await this.prisma.comment.findFirst({
            where: { id: commentId, deletedAt: null, task: { list: { project: { workspaceId, deletedAt: null } } } },
            include: { author: true },
        });
        if (!comment)
            throw new common_1.NotFoundException('Comment not found');
        if (comment.userId !== userId) {
            throw new common_1.ForbiddenException('Only the author can edit the comment');
        }
        const createdAt = new Date(comment.createdAt).getTime();
        const now = Date.now();
        const fiveMinutes = 5 * 60 * 1000;
        if (now - createdAt > fiveMinutes) {
            throw new common_1.ForbiddenException('Comment can only be edited within 5 minutes of creation');
        }
        const updated = await this.prisma.comment.update({
            where: { id: commentId },
            data: { content: content.trim(), isEdited: true },
            include: { author: { select: { id: true, fullName: true, avatarUrl: true } }, reactions: true },
        });
        const taskId = updated.taskId;
        this.sse.broadcast(taskId, 'comment:updated', updated);
        return updated;
    }
    async deleteComment(workspaceId, userId, commentId, requesterRole) {
        const comment = await this.prisma.comment.findFirst({
            where: { id: commentId, deletedAt: null, task: { list: { project: { workspaceId, deletedAt: null } } } },
        });
        if (!comment)
            throw new common_1.NotFoundException('Comment not found');
        const isOwner = requesterRole === 'OWNER';
        if (comment.userId !== userId && !isOwner) {
            throw new common_1.ForbiddenException('Not allowed to delete this comment');
        }
        const now = new Date();
        await this.prisma.comment.update({ where: { id: commentId }, data: { deletedAt: now } });
        this.sse.broadcast(comment.taskId, 'comment:deleted', { id: commentId });
    }
    async addReaction(workspaceId, userId, commentId, reactFace) {
        const comment = await this.prisma.comment.findFirst({
            where: { id: commentId, deletedAt: null, task: { list: { project: { workspaceId, deletedAt: null } } } },
        });
        if (!comment)
            throw new common_1.NotFoundException('Comment not found');
        const member = await this.prisma.workspaceMember.findFirst({
            where: { workspaceId, userId, deletedAt: null },
            select: { id: true },
        });
        if (!member)
            throw new common_1.NotFoundException('Workspace member not found');
        const reaction = await this.prisma.reaction.create({
            data: { commentId, memberId: member.id, reactFace },
            include: { member: true },
        });
        this.sse.broadcast(comment.taskId, 'reaction:created', reaction);
        return reaction;
    }
    async deleteReaction(workspaceId, userId, reactionId) {
        const reaction = await this.prisma.reaction.findFirst({
            where: { id: reactionId },
            include: { member: true, comment: true },
        });
        if (!reaction)
            throw new common_1.NotFoundException('Reaction not found');
        const member = await this.prisma.workspaceMember.findFirst({ where: { id: reaction.memberId, deletedAt: null } });
        if (!member)
            throw new common_1.NotFoundException('Member for reaction not found');
        if (member.userId !== userId) {
            throw new common_1.ForbiddenException('Only the reaction owner can delete it');
        }
        await this.prisma.reaction.delete({ where: { id: reactionId } });
        const taskId = reaction.comment?.taskId ?? null;
        this.sse.broadcast(taskId, 'reaction:deleted', { id: reactionId, commentId: reaction.commentId });
    }
    async assertTaskInWorkspaceOrThrow(workspaceId, taskId) {
        const task = await this.prisma.task.findFirst({
            where: { id: taskId, deletedAt: null },
            include: { list: { include: { project: true } } },
        });
        if (!task) {
            this.logger.warn(`assertTask: task not found or deleted - taskId=${taskId} workspaceId=${workspaceId}`);
            throw new common_1.NotFoundException('Task not found in workspace');
        }
        const project = task.list?.project;
        if (!project) {
            this.logger.warn(`assertTask: task has no project - taskId=${taskId} workspaceId=${workspaceId}`);
            throw new common_1.NotFoundException('Task not found in workspace');
        }
        if (project.deletedAt) {
            this.logger.warn(`assertTask: project deleted - projectId=${project.id} taskId=${taskId} workspaceId=${workspaceId}`);
            throw new common_1.NotFoundException('Task not found in workspace');
        }
        if (String(project.workspaceId).trim() !== String(workspaceId).trim()) {
            this.logger.warn(`assertTask: workspace mismatch - task workspace=${project.workspaceId} requested=${workspaceId} taskId=${taskId}`);
            throw new common_1.NotFoundException('Task not found in workspace');
        }
    }
};
exports.CommentsService = CommentsService;
exports.CommentsService = CommentsService = CommentsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_1.PrismaService, sse_service_1.SseService])
], CommentsService);
//# sourceMappingURL=comments.service.js.map