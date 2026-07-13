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
exports.AiAttachmentsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const common_2 = require("../../../../libs/common/src");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const workspace_guard_1 = require("../workspace/workspace.guard");
const ai_attachments_service_1 = require("./ai-attachments.service");
const confirm_ai_attachment_dto_1 = require("./dto/confirm-ai-attachment.dto");
const list_ai_attachments_query_dto_1 = require("./dto/list-ai-attachments.query.dto");
const presign_ai_attachment_dto_1 = require("./dto/presign-ai-attachment.dto");
let AiAttachmentsController = class AiAttachmentsController {
    service;
    constructor(service) {
        this.service = service;
    }
    async presign(req, dto) {
        const result = await this.service.presign(req.user.id, req.workspaceContext.workspaceId, dto);
        return (0, common_2.ok)(result, 'Presigned URL generated');
    }
    async confirm(req, id, dto) {
        const result = await this.service.confirm(req.user.id, req.workspaceContext.workspaceId, id, dto);
        return (0, common_2.ok)(result, 'Attachment confirmed');
    }
    async list(req, query) {
        const result = await this.service.list(req.user.id, req.workspaceContext.workspaceId, query);
        return (0, common_2.ok)(result);
    }
    async getOne(req, id) {
        const result = await this.service.getOne(req.user.id, req.workspaceContext.workspaceId, id);
        return (0, common_2.ok)(result);
    }
    async remove(req, id) {
        const result = await this.service.remove(req.user.id, req.workspaceContext.workspaceId, id);
        return (0, common_2.ok)(result, 'Attachment deleted');
    }
    async listForConversation(req, conversationId) {
        const result = await this.service.listForConversation(req.user.id, req.workspaceContext.workspaceId, conversationId);
        return (0, common_2.ok)(result);
    }
};
exports.AiAttachmentsController = AiAttachmentsController;
__decorate([
    (0, common_1.Post)('ai-attachments/presign'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a presigned S3 upload URL for a SwiftBot chat attachment' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, presign_ai_attachment_dto_1.PresignAiAttachmentDto]),
    __metadata("design:returntype", Promise)
], AiAttachmentsController.prototype, "presign", null);
__decorate([
    (0, common_1.Post)('ai-attachments/:id/confirm'),
    (0, swagger_1.ApiOperation)({ summary: 'Confirm a SwiftBot attachment upload and optionally link it to a message' }),
    (0, swagger_1.ApiParam)({ name: 'id', format: 'uuid' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, confirm_ai_attachment_dto_1.ConfirmAiAttachmentDto]),
    __metadata("design:returntype", Promise)
], AiAttachmentsController.prototype, "confirm", null);
__decorate([
    (0, common_1.Get)('ai-attachments'),
    (0, swagger_1.ApiOperation)({ summary: 'List SwiftBot attachments, optionally filtered by conversation' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, list_ai_attachments_query_dto_1.ListAiAttachmentsQueryDto]),
    __metadata("design:returntype", Promise)
], AiAttachmentsController.prototype, "list", null);
__decorate([
    (0, common_1.Get)('ai-attachments/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a single SwiftBot attachment' }),
    (0, swagger_1.ApiParam)({ name: 'id', format: 'uuid' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], AiAttachmentsController.prototype, "getOne", null);
__decorate([
    (0, common_1.Delete)('ai-attachments/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a SwiftBot attachment (soft delete)' }),
    (0, swagger_1.ApiParam)({ name: 'id', format: 'uuid' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], AiAttachmentsController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)('ai-conversations/:conversationId/attachments'),
    (0, swagger_1.ApiOperation)({ summary: 'List attachments for a conversation' }),
    (0, swagger_1.ApiParam)({ name: 'conversationId', format: 'uuid' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('conversationId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], AiAttachmentsController.prototype, "listForConversation", null);
exports.AiAttachmentsController = AiAttachmentsController = __decorate([
    (0, swagger_1.ApiTags)('ai-attachments'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiHeader)({ name: 'x-workspace-id', required: true, description: 'Active workspace ID' }),
    (0, common_1.Controller)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, workspace_guard_1.WorkspaceGuard),
    __metadata("design:paramtypes", [ai_attachments_service_1.AiAttachmentsService])
], AiAttachmentsController);
//# sourceMappingURL=ai-attachments.controller.js.map