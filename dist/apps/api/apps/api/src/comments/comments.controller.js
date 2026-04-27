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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const workspace_guard_1 = require("../workspace/workspace.guard");
const comments_service_1 = require("./comments.service");
const sse_service_1 = require("./sse.service");
const create_comment_dto_1 = require("./dto/create-comment.dto");
const update_comment_dto_1 = require("./dto/update-comment.dto");
const create_reaction_dto_1 = require("./dto/create-reaction.dto");
const common_2 = require("../../../../libs/common/src");
let CommentsController = class CommentsController {
    commentsService;
    sse;
    constructor(commentsService, sse) {
        this.commentsService = commentsService;
        this.sse = sse;
    }
    async stream(req, taskId, res) {
        const comments = await this.commentsService.getCommentsForTask(req.workspaceContext.workspaceId, taskId);
        this.sse.registerClient(taskId, res);
        this.sse.sendToClient(res, 'comments:init', comments);
    }
    async create(req, taskId, dto) {
        const comment = await this.commentsService.createComment(req.workspaceContext.workspaceId, req.user.id, taskId, dto.content, dto.parentId, dto.mentionedUserIds);
        return (0, common_2.ok)(comment, 'Comment created');
    }
    async update(req, commentId, dto) {
        const updated = await this.commentsService.updateComment(req.workspaceContext.workspaceId, req.user.id, commentId, dto.content, dto.mentionedUserIds);
        return (0, common_2.ok)(updated, 'Comment updated');
    }
    async remove(req, commentId) {
        await this.commentsService.deleteComment(req.workspaceContext.workspaceId, req.user.id, commentId, req.workspaceContext.role);
        return (0, common_2.ok)(null, 'Comment deleted');
    }
    async addReaction(req, commentId, dto) {
        const reaction = await this.commentsService.addReaction(req.workspaceContext.workspaceId, req.user.id, commentId, dto.reactFace);
        return (0, common_2.ok)(reaction, 'Reaction created');
    }
    async updateReaction(req, reactionId, dto) {
        const updated = await this.commentsService.updateReaction(req.workspaceContext.workspaceId, req.user.id, reactionId, dto.reactFace);
        return (0, common_2.ok)(updated, 'Reaction updated');
    }
    async deleteReaction(req, reactionId) {
        await this.commentsService.deleteReaction(req.workspaceContext.workspaceId, req.user.id, reactionId);
        return (0, common_2.ok)(null, 'Reaction deleted');
    }
};
exports.CommentsController = CommentsController;
__decorate([
    (0, common_1.Get)('tasks/:taskId/comments/stream'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, workspace_guard_1.WorkspaceGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiHeader)({ name: 'x-workspace-id', required: true }),
    (0, swagger_1.ApiOperation)({ summary: 'Open SSE stream for a task comments and reactions' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('taskId')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], CommentsController.prototype, "stream", null);
__decorate([
    (0, common_1.Post)('tasks/:taskId/comments'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, workspace_guard_1.WorkspaceGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiHeader)({ name: 'x-workspace-id', required: true }),
    (0, swagger_1.ApiOperation)({ summary: 'Create a comment on a task' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Comment created' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('taskId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, create_comment_dto_1.CreateCommentDto]),
    __metadata("design:returntype", Promise)
], CommentsController.prototype, "create", null);
__decorate([
    (0, common_1.Put)('comments/:commentId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, workspace_guard_1.WorkspaceGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiHeader)({ name: 'x-workspace-id', required: true }),
    (0, swagger_1.ApiOperation)({ summary: 'Update a comment (allowed within 5 minutes of creation)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Comment updated' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('commentId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, update_comment_dto_1.UpdateCommentDto]),
    __metadata("design:returntype", Promise)
], CommentsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)('comments/:commentId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, workspace_guard_1.WorkspaceGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiHeader)({ name: 'x-workspace-id', required: true }),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a comment' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Comment deleted' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('commentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], CommentsController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)('comments/:commentId/reactions'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, workspace_guard_1.WorkspaceGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiHeader)({ name: 'x-workspace-id', required: true }),
    (0, swagger_1.ApiOperation)({ summary: 'Add a reaction to a comment' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Reaction created' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('commentId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, create_reaction_dto_1.CreateReactionDto]),
    __metadata("design:returntype", Promise)
], CommentsController.prototype, "addReaction", null);
__decorate([
    (0, common_1.Patch)('reactions/:reactionId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, workspace_guard_1.WorkspaceGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiHeader)({ name: 'x-workspace-id', required: true }),
    (0, swagger_1.ApiOperation)({ summary: 'Update a reaction on a comment' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Reaction updated' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('reactionId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, create_reaction_dto_1.CreateReactionDto]),
    __metadata("design:returntype", Promise)
], CommentsController.prototype, "updateReaction", null);
__decorate([
    (0, common_1.Delete)('reactions/:reactionId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, workspace_guard_1.WorkspaceGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiHeader)({ name: 'x-workspace-id', required: true }),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a reaction' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Reaction deleted' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('reactionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], CommentsController.prototype, "deleteReaction", null);
exports.CommentsController = CommentsController = __decorate([
    (0, swagger_1.ApiTags)('comments'),
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [comments_service_1.CommentsService, sse_service_1.SseService])
], CommentsController);
//# sourceMappingURL=comments.controller.js.map