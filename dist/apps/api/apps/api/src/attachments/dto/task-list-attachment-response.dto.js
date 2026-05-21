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
exports.TaskListAttachmentListResponseDto = exports.TaskListAttachmentResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class TaskListAttachmentUploaderDto {
    id;
    name;
    avatarUrl;
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'cc6c4f04-6cae-4d0a-a3cb-864d53f92f29' }),
    __metadata("design:type", String)
], TaskListAttachmentUploaderDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Jane Doe', nullable: true }),
    __metadata("design:type", Object)
], TaskListAttachmentUploaderDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'https://cdn.example.com/avatar.png',
        nullable: true,
    }),
    __metadata("design:type", Object)
], TaskListAttachmentUploaderDto.prototype, "avatarUrl", void 0);
class TaskListAttachmentResponseDto {
    id;
    kind;
    title;
    description;
    uploadedBy;
    createdAt;
    fileName;
    mimeType;
    fileSize;
    viewUrl;
    linkUrl;
}
exports.TaskListAttachmentResponseDto = TaskListAttachmentResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2f9c1b8a-3b4a-4f3d-9b2a-1234567890ab' }),
    __metadata("design:type", String)
], TaskListAttachmentResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ['FILE', 'LINK'], example: 'FILE' }),
    __metadata("design:type", String)
], TaskListAttachmentResponseDto.prototype, "kind", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'List requirements', nullable: true }),
    __metadata("design:type", Object)
], TaskListAttachmentResponseDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'Reference material for this list.',
        nullable: true,
    }),
    __metadata("design:type", Object)
], TaskListAttachmentResponseDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: TaskListAttachmentUploaderDto }),
    __metadata("design:type", TaskListAttachmentUploaderDto)
], TaskListAttachmentResponseDto.prototype, "uploadedBy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2026-05-21T10:30:00.000Z', format: 'date-time' }),
    __metadata("design:type", Date)
], TaskListAttachmentResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'requirements.pdf' }),
    __metadata("design:type", String)
], TaskListAttachmentResponseDto.prototype, "fileName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'application/pdf' }),
    __metadata("design:type", String)
], TaskListAttachmentResponseDto.prototype, "mimeType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 245000 }),
    __metadata("design:type", Number)
], TaskListAttachmentResponseDto.prototype, "fileSize", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'https://s3.example.com/signed-view-url' }),
    __metadata("design:type", String)
], TaskListAttachmentResponseDto.prototype, "viewUrl", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'https://www.figma.com/file/example' }),
    __metadata("design:type", String)
], TaskListAttachmentResponseDto.prototype, "linkUrl", void 0);
class TaskListAttachmentListResponseDto {
    items;
    nextCursor;
    limit;
}
exports.TaskListAttachmentListResponseDto = TaskListAttachmentListResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: [TaskListAttachmentResponseDto] }),
    __metadata("design:type", Array)
], TaskListAttachmentListResponseDto.prototype, "items", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: '2026-05-21T10:30:00.000Z:2f9c1b8a-3b4a-4f3d-9b2a-1234567890ab',
        nullable: true,
    }),
    __metadata("design:type", Object)
], TaskListAttachmentListResponseDto.prototype, "nextCursor", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 50 }),
    __metadata("design:type", Number)
], TaskListAttachmentListResponseDto.prototype, "limit", void 0);
//# sourceMappingURL=task-list-attachment-response.dto.js.map