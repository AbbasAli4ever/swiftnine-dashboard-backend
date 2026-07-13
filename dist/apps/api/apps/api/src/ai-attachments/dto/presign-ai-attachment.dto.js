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
exports.PresignAiAttachmentDto = exports.PresignAiAttachmentSchema = void 0;
const swagger_1 = require("@nestjs/swagger");
const nestjs_zod_1 = require("nestjs-zod");
const zod_1 = require("zod");
const ai_attachments_constants_1 = require("../ai-attachments.constants");
exports.PresignAiAttachmentSchema = zod_1.z.object({
    conversationId: zod_1.z.string().uuid(),
    fileName: zod_1.z.string().trim().min(1).max(255),
    mimeType: zod_1.z.string().trim().min(1).max(255),
    fileSize: zod_1.z.coerce.number().int().positive(),
    attachmentType: zod_1.z.enum(ai_attachments_constants_1.WIRE_ATTACHMENT_TYPES),
});
class PresignAiAttachmentDto extends (0, nestjs_zod_1.createZodDto)(exports.PresignAiAttachmentSchema) {
    conversationId;
    fileName;
    mimeType;
    fileSize;
    attachmentType;
}
exports.PresignAiAttachmentDto = PresignAiAttachmentDto;
__decorate([
    (0, swagger_1.ApiProperty)({ format: 'uuid' }),
    __metadata("design:type", String)
], PresignAiAttachmentDto.prototype, "conversationId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'requirements.pdf', maxLength: 255 }),
    __metadata("design:type", String)
], PresignAiAttachmentDto.prototype, "fileName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'application/pdf', maxLength: 255 }),
    __metadata("design:type", String)
], PresignAiAttachmentDto.prototype, "mimeType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 245000, minimum: 1 }),
    __metadata("design:type", Number)
], PresignAiAttachmentDto.prototype, "fileSize", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ai_attachments_constants_1.WIRE_ATTACHMENT_TYPES }),
    __metadata("design:type", Object)
], PresignAiAttachmentDto.prototype, "attachmentType", void 0);
//# sourceMappingURL=presign-ai-attachment.dto.js.map