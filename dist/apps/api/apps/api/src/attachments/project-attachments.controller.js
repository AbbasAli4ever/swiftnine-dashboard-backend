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
exports.ProjectAttachmentsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const common_2 = require("../../../../libs/common/src");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const project_unlocked_guard_1 = require("../project-security/guards/project-unlocked.guard");
const workspace_guard_1 = require("../workspace/workspace.guard");
const attachments_service_1 = require("./attachments.service");
const confirm_project_attachment_dto_1 = require("./dto/confirm-project-attachment.dto");
const create_project_link_dto_1 = require("./dto/create-project-link.dto");
const list_project_attachments_query_dto_1 = require("./dto/list-project-attachments.query.dto");
const presign_project_attachment_dto_1 = require("./dto/presign-project-attachment.dto");
const project_attachment_response_dto_1 = require("./dto/project-attachment-response.dto");
const update_project_attachment_dto_1 = require("./dto/update-project-attachment.dto");
const presign_response_dto_1 = require("./dto/presign-response.dto");
const delete_attachment_response_dto_1 = require("./dto/delete-attachment-response.dto");
let ProjectAttachmentsController = class ProjectAttachmentsController {
    attachmentsService;
    constructor(attachmentsService) {
        this.attachmentsService = attachmentsService;
    }
    async presignProjectAttachment(req, projectId, dto) {
        const result = await this.attachmentsService.presignProjectUpload(req.user.id, req.workspaceContext.workspaceId, projectId, dto);
        return (0, common_2.ok)(result, 'Presigned URL generated');
    }
    async confirmProjectAttachment(req, projectId, dto) {
        const result = await this.attachmentsService.confirmProjectUpload(req.user.id, req.workspaceContext.workspaceId, projectId, dto);
        return (0, common_2.ok)(result, 'Attachment created');
    }
    async createProjectLink(req, projectId, dto) {
        const result = await this.attachmentsService.createProjectLink(req.user.id, req.workspaceContext.workspaceId, projectId, dto);
        return (0, common_2.ok)(result, 'Attachment link created');
    }
    async listProjectAttachments(req, projectId, query) {
        const result = await this.attachmentsService.listProjectAttachments(req.user.id, req.workspaceContext.workspaceId, projectId, query);
        return (0, common_2.ok)(result, 'Attachments returned');
    }
    async getProjectAttachment(req, projectId, attachmentId) {
        const result = await this.attachmentsService.getProjectAttachment(req.user.id, req.workspaceContext.workspaceId, projectId, attachmentId);
        return (0, common_2.ok)(result, 'Attachment returned');
    }
    async updateProjectAttachment(req, projectId, attachmentId, dto) {
        const result = await this.attachmentsService.updateProjectAttachment(req.user.id, req.workspaceContext.workspaceId, req.workspaceContext.role, projectId, attachmentId, dto);
        return (0, common_2.ok)(result, 'Attachment updated');
    }
    async deleteProjectAttachment(req, projectId, attachmentId) {
        const result = await this.attachmentsService.deleteProjectAttachment(req.user.id, req.workspaceContext.workspaceId, req.workspaceContext.role, projectId, attachmentId);
        return (0, common_2.ok)(result, 'Attachment deleted');
    }
};
exports.ProjectAttachmentsController = ProjectAttachmentsController;
__decorate([
    (0, common_1.Post)('presign'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a presigned S3 upload URL for a project file' }),
    (0, swagger_1.ApiParam)({ name: 'projectId', format: 'uuid' }),
    (0, swagger_1.ApiBody)({ type: presign_project_attachment_dto_1.PresignProjectAttachmentDto }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Presigned URL generated',
        type: presign_response_dto_1.PresignResponseDto,
    }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('projectId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, presign_project_attachment_dto_1.PresignProjectAttachmentDto]),
    __metadata("design:returntype", Promise)
], ProjectAttachmentsController.prototype, "presignProjectAttachment", null);
__decorate([
    (0, common_1.Post)('confirm'),
    (0, swagger_1.ApiOperation)({ summary: 'Confirm project file upload and create attachment' }),
    (0, swagger_1.ApiParam)({ name: 'projectId', format: 'uuid' }),
    (0, swagger_1.ApiBody)({ type: confirm_project_attachment_dto_1.ConfirmProjectAttachmentDto }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Project file attachment created',
        type: project_attachment_response_dto_1.ProjectAttachmentResponseDto,
    }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('projectId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, confirm_project_attachment_dto_1.ConfirmProjectAttachmentDto]),
    __metadata("design:returntype", Promise)
], ProjectAttachmentsController.prototype, "confirmProjectAttachment", null);
__decorate([
    (0, common_1.Post)('links'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a project link attachment' }),
    (0, swagger_1.ApiParam)({ name: 'projectId', format: 'uuid' }),
    (0, swagger_1.ApiBody)({ type: create_project_link_dto_1.CreateProjectLinkDto }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Project link attachment created',
        type: project_attachment_response_dto_1.ProjectAttachmentResponseDto,
    }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('projectId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, create_project_link_dto_1.CreateProjectLinkDto]),
    __metadata("design:returntype", Promise)
], ProjectAttachmentsController.prototype, "createProjectLink", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'List project attachments' }),
    (0, swagger_1.ApiParam)({ name: 'projectId', format: 'uuid' }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Project attachments returned',
        type: project_attachment_response_dto_1.ProjectAttachmentListResponseDto,
    }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('projectId')),
    __param(2, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, list_project_attachments_query_dto_1.ListProjectAttachmentsQueryDto]),
    __metadata("design:returntype", Promise)
], ProjectAttachmentsController.prototype, "listProjectAttachments", null);
__decorate([
    (0, common_1.Get)(':attachmentId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a project attachment' }),
    (0, swagger_1.ApiParam)({ name: 'projectId', format: 'uuid' }),
    (0, swagger_1.ApiParam)({ name: 'attachmentId', format: 'uuid' }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Project attachment returned',
        type: project_attachment_response_dto_1.ProjectAttachmentResponseDto,
    }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('projectId')),
    __param(2, (0, common_1.Param)('attachmentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], ProjectAttachmentsController.prototype, "getProjectAttachment", null);
__decorate([
    (0, common_1.Patch)(':attachmentId'),
    (0, swagger_1.ApiOperation)({ summary: 'Update project attachment metadata' }),
    (0, swagger_1.ApiParam)({ name: 'projectId', format: 'uuid' }),
    (0, swagger_1.ApiParam)({ name: 'attachmentId', format: 'uuid' }),
    (0, swagger_1.ApiBody)({ type: update_project_attachment_dto_1.UpdateProjectAttachmentDto }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Project attachment updated',
        type: project_attachment_response_dto_1.ProjectAttachmentResponseDto,
    }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('projectId')),
    __param(2, (0, common_1.Param)('attachmentId')),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, update_project_attachment_dto_1.UpdateProjectAttachmentDto]),
    __metadata("design:returntype", Promise)
], ProjectAttachmentsController.prototype, "updateProjectAttachment", null);
__decorate([
    (0, common_1.Delete)(':attachmentId'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a project attachment' }),
    (0, swagger_1.ApiParam)({ name: 'projectId', format: 'uuid' }),
    (0, swagger_1.ApiParam)({ name: 'attachmentId', format: 'uuid' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Project attachment deleted',
        type: delete_attachment_response_dto_1.DeleteAttachmentResponseDto,
    }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('projectId')),
    __param(2, (0, common_1.Param)('attachmentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], ProjectAttachmentsController.prototype, "deleteProjectAttachment", null);
exports.ProjectAttachmentsController = ProjectAttachmentsController = __decorate([
    (0, swagger_1.ApiTags)('project attachments'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiHeader)({
        name: 'x-workspace-id',
        required: true,
        description: 'Active workspace ID',
    }),
    (0, common_1.Controller)('projects/:projectId/attachments'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, workspace_guard_1.WorkspaceGuard, project_unlocked_guard_1.ProjectUnlockedGuard),
    __metadata("design:paramtypes", [attachments_service_1.AttachmentsService])
], ProjectAttachmentsController);
//# sourceMappingURL=project-attachments.controller.js.map