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
exports.PaginatedTasksResponseDto = exports.TaskListItemResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const TASK_RESPONSE_PRIORITY_VALUES = ['URGENT', 'HIGH', 'NORMAL', 'LOW', 'NONE'];
const TASK_RESPONSE_STATUS_GROUP_VALUES = ['NOT_STARTED', 'ACTIVE', 'DONE', 'CLOSED'];
class TaskUserBriefDto {
    id;
    fullName;
    avatarUrl;
    avatarColor;
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'f3387da6-3af5-4d9e-a004-6cc67b586b8a' }),
    __metadata("design:type", String)
], TaskUserBriefDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Ayesha Khan' }),
    __metadata("design:type", String)
], TaskUserBriefDto.prototype, "fullName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'https://cdn.example.com/avatar.png', nullable: true }),
    __metadata("design:type", Object)
], TaskUserBriefDto.prototype, "avatarUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '#6366f1' }),
    __metadata("design:type", String)
], TaskUserBriefDto.prototype, "avatarColor", void 0);
class TaskAssigneeResponseDto {
    user;
    assignedBy;
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: TaskUserBriefDto }),
    __metadata("design:type", TaskUserBriefDto)
], TaskAssigneeResponseDto.prototype, "user", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User ID that assigned this member to the task.',
        example: '6c186a98-9ce2-4ddf-91ec-1184139a0f44',
    }),
    __metadata("design:type", String)
], TaskAssigneeResponseDto.prototype, "assignedBy", void 0);
class TaskStatusBriefDto {
    id;
    name;
    color;
    group;
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: '9fa46c52-c13a-4088-89f8-1c321016862f' }),
    __metadata("design:type", String)
], TaskStatusBriefDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'In Progress' }),
    __metadata("design:type", String)
], TaskStatusBriefDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '#3b82f6' }),
    __metadata("design:type", String)
], TaskStatusBriefDto.prototype, "color", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: TASK_RESPONSE_STATUS_GROUP_VALUES, example: 'ACTIVE' }),
    __metadata("design:type", String)
], TaskStatusBriefDto.prototype, "group", void 0);
class TaskTagBriefDto {
    id;
    name;
    color;
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'e0aa9215-1d22-4724-9ef2-c69fa92698f6' }),
    __metadata("design:type", String)
], TaskTagBriefDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Backend' }),
    __metadata("design:type", String)
], TaskTagBriefDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '#10b981' }),
    __metadata("design:type", String)
], TaskTagBriefDto.prototype, "color", void 0);
class TaskTagResponseDto {
    tag;
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: TaskTagBriefDto }),
    __metadata("design:type", TaskTagBriefDto)
], TaskTagResponseDto.prototype, "tag", void 0);
class TaskProjectBriefDto {
    id;
    name;
    taskIdPrefix;
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: '294cb5ed-807d-49f6-ae4a-b672a82707b8' }),
    __metadata("design:type", String)
], TaskProjectBriefDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'ClickUp Clone' }),
    __metadata("design:type", String)
], TaskProjectBriefDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'CU' }),
    __metadata("design:type", String)
], TaskProjectBriefDto.prototype, "taskIdPrefix", void 0);
class TaskListBriefDto {
    id;
    name;
    project;
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'f34f824e-9d99-40ec-b8f8-a9777c7ed3d6' }),
    __metadata("design:type", String)
], TaskListBriefDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Sprint Backlog' }),
    __metadata("design:type", String)
], TaskListBriefDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: TaskProjectBriefDto }),
    __metadata("design:type", TaskProjectBriefDto)
], TaskListBriefDto.prototype, "project", void 0);
class TaskChildrenCountDto {
    children;
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: 3 }),
    __metadata("design:type", Number)
], TaskChildrenCountDto.prototype, "children", void 0);
class TaskListItemResponseDto {
    id;
    taskId;
    taskNumber;
    title;
    priority;
    startDate;
    dueDate;
    position;
    depth;
    isCompleted;
    completedAt;
    createdAt;
    updatedAt;
    status;
    assignees;
    tags;
    list;
    _count;
}
exports.TaskListItemResponseDto = TaskListItemResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'a843cde2-f8c4-49a1-916b-308941b56f34' }),
    __metadata("design:type", String)
], TaskListItemResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Human-readable task key composed from the project prefix and task number.',
        example: 'CU-104',
    }),
    __metadata("design:type", String)
], TaskListItemResponseDto.prototype, "taskId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 104 }),
    __metadata("design:type", Number)
], TaskListItemResponseDto.prototype, "taskNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Implement task search and filters' }),
    __metadata("design:type", String)
], TaskListItemResponseDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: TASK_RESPONSE_PRIORITY_VALUES, example: 'HIGH' }),
    __metadata("design:type", String)
], TaskListItemResponseDto.prototype, "priority", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '2026-04-23T00:00:00.000Z', nullable: true }),
    __metadata("design:type", Object)
], TaskListItemResponseDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '2026-04-30T18:00:00.000Z', nullable: true }),
    __metadata("design:type", Object)
], TaskListItemResponseDto.prototype, "dueDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 2000 }),
    __metadata("design:type", Number)
], TaskListItemResponseDto.prototype, "position", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 0, description: '0 for top-level tasks; greater than 0 for subtasks.' }),
    __metadata("design:type", Number)
], TaskListItemResponseDto.prototype, "depth", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: false }),
    __metadata("design:type", Boolean)
], TaskListItemResponseDto.prototype, "isCompleted", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: null, nullable: true }),
    __metadata("design:type", Object)
], TaskListItemResponseDto.prototype, "completedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2026-04-23T10:00:00.000Z' }),
    __metadata("design:type", Date)
], TaskListItemResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2026-04-23T11:30:00.000Z' }),
    __metadata("design:type", Date)
], TaskListItemResponseDto.prototype, "updatedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: TaskStatusBriefDto }),
    __metadata("design:type", TaskStatusBriefDto)
], TaskListItemResponseDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [TaskAssigneeResponseDto] }),
    __metadata("design:type", Array)
], TaskListItemResponseDto.prototype, "assignees", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [TaskTagResponseDto] }),
    __metadata("design:type", Array)
], TaskListItemResponseDto.prototype, "tags", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: TaskListBriefDto }),
    __metadata("design:type", TaskListBriefDto)
], TaskListItemResponseDto.prototype, "list", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: TaskChildrenCountDto }),
    __metadata("design:type", TaskChildrenCountDto)
], TaskListItemResponseDto.prototype, "_count", void 0);
class PaginationMetaDto {
    page;
    limit;
    total;
    total_pages;
    has_next;
    has_prev;
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    __metadata("design:type", Number)
], PaginationMetaDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 20 }),
    __metadata("design:type", Number)
], PaginationMetaDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 57 }),
    __metadata("design:type", Number)
], PaginationMetaDto.prototype, "total", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 3 }),
    __metadata("design:type", Number)
], PaginationMetaDto.prototype, "total_pages", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true }),
    __metadata("design:type", Boolean)
], PaginationMetaDto.prototype, "has_next", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: false }),
    __metadata("design:type", Boolean)
], PaginationMetaDto.prototype, "has_prev", void 0);
class PaginatedTasksResponseDto {
    success;
    data;
    meta;
    message;
}
exports.PaginatedTasksResponseDto = PaginatedTasksResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: true }),
    __metadata("design:type", Boolean)
], PaginatedTasksResponseDto.prototype, "success", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [TaskListItemResponseDto] }),
    __metadata("design:type", Array)
], PaginatedTasksResponseDto.prototype, "data", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: PaginationMetaDto }),
    __metadata("design:type", PaginationMetaDto)
], PaginatedTasksResponseDto.prototype, "meta", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: null, nullable: true }),
    __metadata("design:type", Object)
], PaginatedTasksResponseDto.prototype, "message", void 0);
//# sourceMappingURL=task-list-item-response.dto.js.map