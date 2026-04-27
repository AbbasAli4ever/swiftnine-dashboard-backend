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
exports.ProjectDashboardResponseDto = exports.ProjectDashboardDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class DashboardProjectDto {
    id;
    name;
    color;
    icon;
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: '294cb5ed-807d-49f6-ae4a-b672a82707b8' }),
    __metadata("design:type", String)
], DashboardProjectDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'ClickUp Clone' }),
    __metadata("design:type", String)
], DashboardProjectDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '#2563eb' }),
    __metadata("design:type", String)
], DashboardProjectDto.prototype, "color", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'rocket', nullable: true }),
    __metadata("design:type", Object)
], DashboardProjectDto.prototype, "icon", void 0);
class DashboardStatusSummaryDto {
    statusId;
    name;
    color;
    group;
    position;
    count;
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: '9fa46c52-c13a-4088-89f8-1c321016862f' }),
    __metadata("design:type", String)
], DashboardStatusSummaryDto.prototype, "statusId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'In Progress' }),
    __metadata("design:type", String)
], DashboardStatusSummaryDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '#3b82f6' }),
    __metadata("design:type", String)
], DashboardStatusSummaryDto.prototype, "color", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ['NOT_STARTED', 'ACTIVE', 'DONE', 'CLOSED'], example: 'ACTIVE' }),
    __metadata("design:type", String)
], DashboardStatusSummaryDto.prototype, "group", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1000 }),
    __metadata("design:type", Number)
], DashboardStatusSummaryDto.prototype, "position", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 12 }),
    __metadata("design:type", Number)
], DashboardStatusSummaryDto.prototype, "count", void 0);
class DashboardListOwnerDto {
    id;
    fullName;
    avatarUrl;
    avatarColor;
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'f3387da6-3af5-4d9e-a004-6cc67b586b8a' }),
    __metadata("design:type", String)
], DashboardListOwnerDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Ayesha Khan' }),
    __metadata("design:type", String)
], DashboardListOwnerDto.prototype, "fullName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'https://cdn.example.com/avatar.png', nullable: true }),
    __metadata("design:type", Object)
], DashboardListOwnerDto.prototype, "avatarUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '#6366f1' }),
    __metadata("design:type", String)
], DashboardListOwnerDto.prototype, "avatarColor", void 0);
class DashboardListSummaryDto {
    id;
    name;
    position;
    startDate;
    endDate;
    ownerUserId;
    priority;
    owner;
    taskCount;
    completedCount;
    openCount;
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'f34f824e-9d99-40ec-b8f8-a9777c7ed3d6' }),
    __metadata("design:type", String)
], DashboardListSummaryDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Sprint Backlog' }),
    __metadata("design:type", String)
], DashboardListSummaryDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1000 }),
    __metadata("design:type", Number)
], DashboardListSummaryDto.prototype, "position", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '2026-04-27', nullable: true }),
    __metadata("design:type", Object)
], DashboardListSummaryDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '2026-05-03', nullable: true }),
    __metadata("design:type", Object)
], DashboardListSummaryDto.prototype, "endDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'f3387da6-3af5-4d9e-a004-6cc67b586b8a', nullable: true }),
    __metadata("design:type", Object)
], DashboardListSummaryDto.prototype, "ownerUserId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: ['URGENT', 'HIGH', 'NORMAL', 'LOW', 'NONE'], example: 'HIGH', nullable: true }),
    __metadata("design:type", Object)
], DashboardListSummaryDto.prototype, "priority", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: DashboardListOwnerDto, nullable: true }),
    __metadata("design:type", Object)
], DashboardListSummaryDto.prototype, "owner", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 8 }),
    __metadata("design:type", Number)
], DashboardListSummaryDto.prototype, "taskCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 3 }),
    __metadata("design:type", Number)
], DashboardListSummaryDto.prototype, "completedCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 5 }),
    __metadata("design:type", Number)
], DashboardListSummaryDto.prototype, "openCount", void 0);
class DashboardAttachmentUploaderDto {
    id;
    fullName;
    avatarUrl;
    avatarColor;
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'f3387da6-3af5-4d9e-a004-6cc67b586b8a' }),
    __metadata("design:type", String)
], DashboardAttachmentUploaderDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Ayesha Khan' }),
    __metadata("design:type", String)
], DashboardAttachmentUploaderDto.prototype, "fullName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'https://cdn.example.com/avatar.png', nullable: true }),
    __metadata("design:type", Object)
], DashboardAttachmentUploaderDto.prototype, "avatarUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '#6366f1' }),
    __metadata("design:type", String)
], DashboardAttachmentUploaderDto.prototype, "avatarColor", void 0);
class DashboardAttachmentDto {
    id;
    taskId;
    taskKey;
    taskTitle;
    listId;
    listName;
    fileName;
    mimeType;
    fileSize;
    createdAt;
    uploadedBy;
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: '1a685ded-8e4f-42c5-96de-c1df9cd1a7ff' }),
    __metadata("design:type", String)
], DashboardAttachmentDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'a843cde2-f8c4-49a1-916b-308941b56f34' }),
    __metadata("design:type", String)
], DashboardAttachmentDto.prototype, "taskId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'CU-104' }),
    __metadata("design:type", String)
], DashboardAttachmentDto.prototype, "taskKey", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Implement task search and filters' }),
    __metadata("design:type", String)
], DashboardAttachmentDto.prototype, "taskTitle", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'f34f824e-9d99-40ec-b8f8-a9777c7ed3d6' }),
    __metadata("design:type", String)
], DashboardAttachmentDto.prototype, "listId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Sprint Backlog' }),
    __metadata("design:type", String)
], DashboardAttachmentDto.prototype, "listName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'api-contract.pdf' }),
    __metadata("design:type", String)
], DashboardAttachmentDto.prototype, "fileName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'application/pdf' }),
    __metadata("design:type", String)
], DashboardAttachmentDto.prototype, "mimeType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 245760 }),
    __metadata("design:type", Number)
], DashboardAttachmentDto.prototype, "fileSize", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2026-04-24T09:30:00.000Z' }),
    __metadata("design:type", Date)
], DashboardAttachmentDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: DashboardAttachmentUploaderDto }),
    __metadata("design:type", DashboardAttachmentUploaderDto)
], DashboardAttachmentDto.prototype, "uploadedBy", void 0);
class ProjectDashboardDto {
    project;
    statusSummary;
    lists;
    attachments;
    docs;
}
exports.ProjectDashboardDto = ProjectDashboardDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: DashboardProjectDto }),
    __metadata("design:type", DashboardProjectDto)
], ProjectDashboardDto.prototype, "project", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [DashboardStatusSummaryDto] }),
    __metadata("design:type", Array)
], ProjectDashboardDto.prototype, "statusSummary", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [DashboardListSummaryDto] }),
    __metadata("design:type", Array)
], ProjectDashboardDto.prototype, "lists", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [DashboardAttachmentDto] }),
    __metadata("design:type", Array)
], ProjectDashboardDto.prototype, "attachments", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: 'array',
        items: { type: 'object' },
        example: [],
        description: 'Reserved for future project docs in the overview section.',
    }),
    __metadata("design:type", Array)
], ProjectDashboardDto.prototype, "docs", void 0);
class ProjectDashboardResponseDto {
    success;
    data;
    message;
}
exports.ProjectDashboardResponseDto = ProjectDashboardResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: true }),
    __metadata("design:type", Boolean)
], ProjectDashboardResponseDto.prototype, "success", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: ProjectDashboardDto }),
    __metadata("design:type", ProjectDashboardDto)
], ProjectDashboardResponseDto.prototype, "data", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: null, nullable: true }),
    __metadata("design:type", Object)
], ProjectDashboardResponseDto.prototype, "message", void 0);
//# sourceMappingURL=project-dashboard-response.dto.js.map