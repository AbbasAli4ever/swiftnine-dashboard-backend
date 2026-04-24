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
exports.ProjectBoardResponseDto = exports.ProjectBoardDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const task_list_item_response_dto_1 = require("./task-list-item-response.dto");
class BoardStatusDto {
    id;
    name;
    color;
    group;
    position;
    isDefault;
    isProtected;
    isClosed;
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: '9fa46c52-c13a-4088-89f8-1c321016862f' }),
    __metadata("design:type", String)
], BoardStatusDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'In Progress' }),
    __metadata("design:type", String)
], BoardStatusDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '#3b82f6' }),
    __metadata("design:type", String)
], BoardStatusDto.prototype, "color", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ['NOT_STARTED', 'ACTIVE', 'DONE', 'CLOSED'], example: 'ACTIVE' }),
    __metadata("design:type", String)
], BoardStatusDto.prototype, "group", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 2000 }),
    __metadata("design:type", Number)
], BoardStatusDto.prototype, "position", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: false }),
    __metadata("design:type", Boolean)
], BoardStatusDto.prototype, "isDefault", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: false }),
    __metadata("design:type", Boolean)
], BoardStatusDto.prototype, "isProtected", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: false }),
    __metadata("design:type", Boolean)
], BoardStatusDto.prototype, "isClosed", void 0);
class ProjectBoardColumnDto {
    status;
    tasks;
    total;
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: BoardStatusDto }),
    __metadata("design:type", BoardStatusDto)
], ProjectBoardColumnDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [task_list_item_response_dto_1.TaskListItemResponseDto] }),
    __metadata("design:type", Array)
], ProjectBoardColumnDto.prototype, "tasks", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 12 }),
    __metadata("design:type", Number)
], ProjectBoardColumnDto.prototype, "total", void 0);
class ProjectBoardDto {
    groupBy;
    projectId;
    columns;
    total;
}
exports.ProjectBoardDto = ProjectBoardDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'status' }),
    __metadata("design:type", String)
], ProjectBoardDto.prototype, "groupBy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '294cb5ed-807d-49f6-ae4a-b672a82707b8' }),
    __metadata("design:type", String)
], ProjectBoardDto.prototype, "projectId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [ProjectBoardColumnDto] }),
    __metadata("design:type", Array)
], ProjectBoardDto.prototype, "columns", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 47 }),
    __metadata("design:type", Number)
], ProjectBoardDto.prototype, "total", void 0);
class ProjectBoardResponseDto {
    success;
    data;
    message;
}
exports.ProjectBoardResponseDto = ProjectBoardResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: true }),
    __metadata("design:type", Boolean)
], ProjectBoardResponseDto.prototype, "success", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: ProjectBoardDto }),
    __metadata("design:type", ProjectBoardDto)
], ProjectBoardResponseDto.prototype, "data", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: null, nullable: true }),
    __metadata("design:type", Object)
], ProjectBoardResponseDto.prototype, "message", void 0);
//# sourceMappingURL=project-board-response.dto.js.map