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
exports.TaskListAttachmentsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const common_2 = require("../../../../libs/common/src");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const workspace_guard_1 = require("../workspace/workspace.guard");
const attachments_service_1 = require("./attachments.service");
const confirm_task_list_attachment_dto_1 = require("./dto/confirm-task-list-attachment.dto");
const create_task_list_link_dto_1 = require("./dto/create-task-list-link.dto");
const delete_attachment_response_dto_1 = require("./dto/delete-attachment-response.dto");
const list_task_list_attachments_query_dto_1 = require("./dto/list-task-list-attachments.query.dto");
const presign_task_list_attachment_dto_1 = require("./dto/presign-task-list-attachment.dto");
const presign_response_dto_1 = require("./dto/presign-response.dto");
const task_list_attachment_response_dto_1 = require("./dto/task-list-attachment-response.dto");
const update_project_attachment_dto_1 = require("./dto/update-project-attachment.dto");
let TaskListAttachmentsController = class TaskListAttachmentsController {
    attachmentsService;
    constructor(attachmentsService) {
        this.attachmentsService = attachmentsService;
    }
    async presignTaskListAttachment(req, listId, dto) {
        const result = await this.attachmentsService.presignTaskListUpload(req.user.id, req.workspaceContext.workspaceId, listId, dto);
        return (0, common_2.ok)(result, 'Presigned URL generated');
    }
    async confirmTaskListAttachment(req, listId, dto) {
        const result = await this.attachmentsService.confirmTaskListUpload(req.user.id, req.workspaceContext.workspaceId, listId, dto);
        return (0, common_2.ok)(result, 'Attachment created');
    }
    async createTaskListLink(req, listId, dto) {
        const result = await this.attachmentsService.createTaskListLink(req.user.id, req.workspaceContext.workspaceId, listId, dto);
        return (0, common_2.ok)(result, 'Attachment link created');
    }
    async listTaskListAttachments(req, listId, query) {
        const result = await this.attachmentsService.listTaskListAttachments(req.user.id, req.workspaceContext.workspaceId, listId, query);
        return (0, common_2.ok)(result, 'Attachments returned');
    }
    async getTaskListAttachment(req, listId, attachmentId) {
        const result = await this.attachmentsService.getTaskListAttachment(req.user.id, req.workspaceContext.workspaceId, listId, attachmentId);
        return (0, common_2.ok)(result, 'Attachment returned');
    }
    async updateTaskListAttachment(req, listId, attachmentId, dto) {
        const result = await this.attachmentsService.updateTaskListAttachment(req.user.id, req.workspaceContext.workspaceId, req.workspaceContext.role, listId, attachmentId, dto);
        return (0, common_2.ok)(result, 'Attachment updated');
    }
    async deleteTaskListAttachment(req, listId, attachmentId) {
        const result = await this.attachmentsService.deleteTaskListAttachment(req.user.id, req.workspaceContext.workspaceId, req.workspaceContext.role, listId, attachmentId);
        return (0, common_2.ok)(result, 'Attachment deleted');
    }
};
exports.TaskListAttachmentsController = TaskListAttachmentsController;
__decorate([
    (0, common_1.Post)('presign'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a presigned S3 upload URL for a task list file' }),
    (0, swagger_1.ApiParam)({ name: 'listId', format: 'uuid' }),
    (0, swagger_1.ApiBody)({ type: presign_task_list_attachment_dto_1.PresignTaskListAttachmentDto }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Presigned URL generated',
        type: presign_response_dto_1.PresignResponseDto,
    }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('listId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, presign_task_list_attachment_dto_1.PresignTaskListAttachmentDto]),
    __metadata("design:returntype", Promise)
], TaskListAttachmentsController.prototype, "presignTaskListAttachment", null);
__decorate([
    (0, common_1.Post)('confirm'),
    (0, swagger_1.ApiOperation)({ summary: 'Confirm task list file upload and create attachment' }),
    (0, swagger_1.ApiParam)({ name: 'listId', format: 'uuid' }),
    (0, swagger_1.ApiBody)({ type: confirm_task_list_attachment_dto_1.ConfirmTaskListAttachmentDto }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Task list file attachment created',
        type: task_list_attachment_response_dto_1.TaskListAttachmentResponseDto,
    }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('listId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, confirm_task_list_attachment_dto_1.ConfirmTaskListAttachmentDto]),
    __metadata("design:returntype", Promise)
], TaskListAttachmentsController.prototype, "confirmTaskListAttachment", null);
__decorate([
    (0, common_1.Post)('links'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a task list link attachment' }),
    (0, swagger_1.ApiParam)({ name: 'listId', format: 'uuid' }),
    (0, swagger_1.ApiBody)({ type: create_task_list_link_dto_1.CreateTaskListLinkDto }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Task list link attachment created',
        type: task_list_attachment_response_dto_1.TaskListAttachmentResponseDto,
    }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('listId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, create_task_list_link_dto_1.CreateTaskListLinkDto]),
    __metadata("design:returntype", Promise)
], TaskListAttachmentsController.prototype, "createTaskListLink", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'List task list attachments' }),
    (0, swagger_1.ApiParam)({ name: 'listId', format: 'uuid' }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Task list attachments returned',
        type: task_list_attachment_response_dto_1.TaskListAttachmentListResponseDto,
    }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('listId')),
    __param(2, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, list_task_list_attachments_query_dto_1.ListTaskListAttachmentsQueryDto]),
    __metadata("design:returntype", Promise)
], TaskListAttachmentsController.prototype, "listTaskListAttachments", null);
__decorate([
    (0, common_1.Get)(':attachmentId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a task list attachment' }),
    (0, swagger_1.ApiParam)({ name: 'listId', format: 'uuid' }),
    (0, swagger_1.ApiParam)({ name: 'attachmentId', format: 'uuid' }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Task list attachment returned',
        type: task_list_attachment_response_dto_1.TaskListAttachmentResponseDto,
    }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('listId')),
    __param(2, (0, common_1.Param)('attachmentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], TaskListAttachmentsController.prototype, "getTaskListAttachment", null);
__decorate([
    (0, common_1.Patch)(':attachmentId'),
    (0, swagger_1.ApiOperation)({ summary: 'Update task list attachment metadata' }),
    (0, swagger_1.ApiParam)({ name: 'listId', format: 'uuid' }),
    (0, swagger_1.ApiParam)({ name: 'attachmentId', format: 'uuid' }),
    (0, swagger_1.ApiBody)({ type: update_project_attachment_dto_1.UpdateProjectAttachmentDto }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Task list attachment updated',
        type: task_list_attachment_response_dto_1.TaskListAttachmentResponseDto,
    }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('listId')),
    __param(2, (0, common_1.Param)('attachmentId')),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, update_project_attachment_dto_1.UpdateProjectAttachmentDto]),
    __metadata("design:returntype", Promise)
], TaskListAttachmentsController.prototype, "updateTaskListAttachment", null);
__decorate([
    (0, common_1.Delete)(':attachmentId'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a task list attachment' }),
    (0, swagger_1.ApiParam)({ name: 'listId', format: 'uuid' }),
    (0, swagger_1.ApiParam)({ name: 'attachmentId', format: 'uuid' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Task list attachment deleted',
        type: delete_attachment_response_dto_1.DeleteAttachmentResponseDto,
    }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('listId')),
    __param(2, (0, common_1.Param)('attachmentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], TaskListAttachmentsController.prototype, "deleteTaskListAttachment", null);
exports.TaskListAttachmentsController = TaskListAttachmentsController = __decorate([
    (0, swagger_1.ApiTags)('task list attachments'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiHeader)({
        name: 'x-workspace-id',
        required: true,
        description: 'Active workspace ID',
    }),
    (0, common_1.Controller)('task-lists/:listId/attachments'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, workspace_guard_1.WorkspaceGuard),
    __metadata("design:paramtypes", [attachments_service_1.AttachmentsService])
], TaskListAttachmentsController);
//# sourceMappingURL=task-list-attachments.controller.js.map