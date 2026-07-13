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
exports.AiAttachmentListResponseDto = exports.AiAttachmentResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const ai_attachments_constants_1 = require("../ai-attachments.constants");
class AiAttachmentResponseDto {
    id;
    conversationId;
    messageId;
    fileName;
    mimeType;
    fileSize;
    attachmentType;
    url;
    createdAt;
}
exports.AiAttachmentResponseDto = AiAttachmentResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2f9c1b8a-3b4a-4f3d-9b2a-1234567890ab' }),
    __metadata("design:type", String)
], AiAttachmentResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ format: 'uuid' }),
    __metadata("design:type", String)
], AiAttachmentResponseDto.prototype, "conversationId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ format: 'uuid', nullable: true }),
    __metadata("design:type", Object)
], AiAttachmentResponseDto.prototype, "messageId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'requirements.pdf' }),
    __metadata("design:type", String)
], AiAttachmentResponseDto.prototype, "fileName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'application/pdf' }),
    __metadata("design:type", String)
], AiAttachmentResponseDto.prototype, "mimeType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 245000 }),
    __metadata("design:type", Number)
], AiAttachmentResponseDto.prototype, "fileSize", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ai_attachments_constants_1.WIRE_ATTACHMENT_TYPES }),
    __metadata("design:type", Object)
], AiAttachmentResponseDto.prototype, "attachmentType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'https://s3.example.com/signed-view-url', nullable: true }),
    __metadata("design:type", Object)
], AiAttachmentResponseDto.prototype, "url", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2026-05-13T10:30:00.000Z', format: 'date-time' }),
    __metadata("design:type", Date)
], AiAttachmentResponseDto.prototype, "createdAt", void 0);
class AiAttachmentListResponseDto {
    items;
    nextCursor;
    limit;
}
exports.AiAttachmentListResponseDto = AiAttachmentListResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: [AiAttachmentResponseDto] }),
    __metadata("design:type", Array)
], AiAttachmentListResponseDto.prototype, "items", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ nullable: true }),
    __metadata("design:type", Object)
], AiAttachmentListResponseDto.prototype, "nextCursor", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 50 }),
    __metadata("design:type", Number)
], AiAttachmentListResponseDto.prototype, "limit", void 0);
//# sourceMappingURL=ai-attachment-response.dto.js.map