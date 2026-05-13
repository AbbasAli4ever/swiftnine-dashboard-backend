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
exports.ProjectAttachmentSearchResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class ProjectAttachmentSearchUploaderDto {
    id;
    name;
    avatarUrl;
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'cc6c4f04-6cae-4d0a-a3cb-864d53f92f29' }),
    __metadata("design:type", String)
], ProjectAttachmentSearchUploaderDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Jane Doe', nullable: true }),
    __metadata("design:type", Object)
], ProjectAttachmentSearchUploaderDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'https://cdn.example.com/avatar.png',
        nullable: true,
    }),
    __metadata("design:type", Object)
], ProjectAttachmentSearchUploaderDto.prototype, "avatarUrl", void 0);
class ProjectAttachmentSearchResponseDto {
    id;
    entityType;
    projectId;
    kind;
    title;
    fileName;
    description;
    linkUrl;
    createdAt;
    uploadedBy;
}
exports.ProjectAttachmentSearchResponseDto = ProjectAttachmentSearchResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2f9c1b8a-3b4a-4f3d-9b2a-1234567890ab' }),
    __metadata("design:type", String)
], ProjectAttachmentSearchResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'project_attachment' }),
    __metadata("design:type", String)
], ProjectAttachmentSearchResponseDto.prototype, "entityType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '6f9c1b8a-3b4a-4f3d-9b2a-1234567890ab' }),
    __metadata("design:type", String)
], ProjectAttachmentSearchResponseDto.prototype, "projectId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ['FILE', 'LINK'], example: 'LINK' }),
    __metadata("design:type", String)
], ProjectAttachmentSearchResponseDto.prototype, "kind", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Design file', nullable: true }),
    __metadata("design:type", Object)
], ProjectAttachmentSearchResponseDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'requirements.pdf', nullable: true }),
    __metadata("design:type", Object)
], ProjectAttachmentSearchResponseDto.prototype, "fileName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Project reference material', nullable: true }),
    __metadata("design:type", Object)
], ProjectAttachmentSearchResponseDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'https://www.figma.com/file/example',
        nullable: true,
    }),
    __metadata("design:type", Object)
], ProjectAttachmentSearchResponseDto.prototype, "linkUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2026-05-13T10:30:00.000Z', format: 'date-time' }),
    __metadata("design:type", Date)
], ProjectAttachmentSearchResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: ProjectAttachmentSearchUploaderDto }),
    __metadata("design:type", ProjectAttachmentSearchUploaderDto)
], ProjectAttachmentSearchResponseDto.prototype, "uploadedBy", void 0);
//# sourceMappingURL=project-attachment-search-response.dto.js.map