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
exports.AttachmentsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const attachments_service_1 = require("./attachments.service");
const presign_attachment_dto_1 = require("./dto/presign-attachment.dto");
const presign_response_dto_1 = require("./dto/presign-response.dto");
const common_2 = require("../../../../libs/common/src");
const create_attachment_dto_1 = require("./dto/create-attachment.dto");
const view_attachments_dto_1 = require("./dto/view-attachments.dto");
const delete_attachment_dto_1 = require("./dto/delete-attachment.dto");
const attachment_dto_1 = require("./dto/attachment.dto");
const view_attachment_response_dto_1 = require("./dto/view-attachment-response.dto");
const delete_attachment_response_dto_1 = require("./dto/delete-attachment-response.dto");
const swagger_2 = require("@nestjs/swagger");
const create_doc_attachment_dto_1 = require("./dto/create-doc-attachment.dto");
const view_doc_attachments_dto_1 = require("./dto/view-doc-attachments.dto");
const delete_doc_attachment_dto_1 = require("./dto/delete-doc-attachment.dto");
let AttachmentsController = class AttachmentsController {
    attachmentsService;
    constructor(attachmentsService) {
        this.attachmentsService = attachmentsService;
    }
    async presign(req, dto) {
        const result = await this.attachmentsService.presignUpload(req.user.id, dto);
        return (0, common_2.ok)(result, 'Presigned URL generated');
    }
    async create(req, dto) {
        const result = await this.attachmentsService.createAttachment(req.user.id, dto.taskId, dto.memberId, dto.s3Key, dto.fileName, dto.mimeType, dto.fileSize);
        return (0, common_2.ok)(result, 'Attachment created');
    }
    async createForDoc(req, dto) {
        const result = await this.attachmentsService.createAttachmentForDoc(req.user.id, dto.docId, dto.s3Key, dto.fileName, dto.mimeType, dto.fileSize);
        return (0, common_2.ok)(result, 'Attachment created');
    }
    async view(req, dto) {
        const result = await this.attachmentsService.listAttachmentsForTask(req.user.id, dto.taskId, dto.memberId);
        return (0, common_2.ok)(result, 'Attachments returned');
    }
    async viewForDoc(req, dto) {
        const result = await this.attachmentsService.listAttachmentsForDoc(req.user.id, dto.docId);
        return (0, common_2.ok)(result, 'Attachments returned');
    }
    async remove(req, dto) {
        const result = await this.attachmentsService.deleteAttachment(req.user.id, dto.taskId, dto.memberId, dto.s3Key);
        return (0, common_2.ok)(result, 'Attachment deleted');
    }
    async removeForDoc(req, dto) {
        const result = await this.attachmentsService.deleteAttachmentForDoc(req.user.id, dto.docId, dto.s3Key);
        return (0, common_2.ok)(result, 'Attachment deleted');
    }
};
exports.AttachmentsController = AttachmentsController;
__decorate([
    (0, common_1.Post)('presign'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a presigned S3 upload URL' }),
    (0, swagger_1.ApiBody)({ type: presign_attachment_dto_1.PresignAttachmentDto }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Presigned URL generated', type: presign_response_dto_1.PresignResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Authentication required' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, presign_attachment_dto_1.PresignAttachmentDto]),
    __metadata("design:returntype", Promise)
], AttachmentsController.prototype, "presign", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create attachment record after upload' }),
    (0, swagger_1.ApiBody)({ type: create_attachment_dto_1.CreateAttachmentDto }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Attachment recorded', type: attachment_dto_1.AttachmentDto }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Authentication required' }),
    (0, swagger_2.ApiNotFoundResponse)({ description: 'Task or member not found' }),
    (0, swagger_2.ApiForbiddenResponse)({ description: 'Actor mismatch' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_attachment_dto_1.CreateAttachmentDto]),
    __metadata("design:returntype", Promise)
], AttachmentsController.prototype, "create", null);
__decorate([
    (0, common_1.Post)('docs'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create attachment record for a document after upload' }),
    (0, swagger_1.ApiBody)({ type: create_doc_attachment_dto_1.CreateDocAttachmentDto }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Document attachment recorded', type: attachment_dto_1.AttachmentDto }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Authentication required' }),
    (0, swagger_2.ApiNotFoundResponse)({ description: 'Document not found' }),
    (0, swagger_2.ApiForbiddenResponse)({ description: 'Document edit access required' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_doc_attachment_dto_1.CreateDocAttachmentDto]),
    __metadata("design:returntype", Promise)
], AttachmentsController.prototype, "createForDoc", null);
__decorate([
    (0, common_1.Post)('view'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'List and get presigned view URLs for attachments on a task' }),
    (0, swagger_1.ApiBody)({ type: view_attachments_dto_1.ViewAttachmentsDto }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Attachment URLs returned', type: view_attachment_response_dto_1.ViewAttachmentResponseDto, isArray: true }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Authentication required' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, view_attachments_dto_1.ViewAttachmentsDto]),
    __metadata("design:returntype", Promise)
], AttachmentsController.prototype, "view", null);
__decorate([
    (0, common_1.Post)('docs/view'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'List and get presigned view URLs for attachments on a document' }),
    (0, swagger_1.ApiBody)({ type: view_doc_attachments_dto_1.ViewDocAttachmentsDto }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Document attachment URLs returned', type: view_attachment_response_dto_1.ViewAttachmentResponseDto, isArray: true }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Authentication required' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, view_doc_attachments_dto_1.ViewDocAttachmentsDto]),
    __metadata("design:returntype", Promise)
], AttachmentsController.prototype, "viewForDoc", null);
__decorate([
    (0, common_1.Delete)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Delete an attachment for a task' }),
    (0, swagger_1.ApiBody)({ type: delete_attachment_dto_1.DeleteAttachmentDto }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Attachment deleted', type: delete_attachment_response_dto_1.DeleteAttachmentResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Authentication required' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, delete_attachment_dto_1.DeleteAttachmentDto]),
    __metadata("design:returntype", Promise)
], AttachmentsController.prototype, "remove", null);
__decorate([
    (0, common_1.Delete)('docs'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Delete an attachment for a document' }),
    (0, swagger_1.ApiBody)({ type: delete_doc_attachment_dto_1.DeleteDocAttachmentDto }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Document attachment deleted', type: delete_attachment_response_dto_1.DeleteAttachmentResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Authentication required' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, delete_doc_attachment_dto_1.DeleteDocAttachmentDto]),
    __metadata("design:returntype", Promise)
], AttachmentsController.prototype, "removeForDoc", null);
exports.AttachmentsController = AttachmentsController = __decorate([
    (0, swagger_1.ApiTags)('attachments'),
    (0, common_1.Controller)('attachments'),
    __metadata("design:paramtypes", [attachments_service_1.AttachmentsService])
], AttachmentsController);
//# sourceMappingURL=attachments.controller.js.map