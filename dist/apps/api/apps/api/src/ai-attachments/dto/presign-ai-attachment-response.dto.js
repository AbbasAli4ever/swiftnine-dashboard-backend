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
exports.PresignAiAttachmentResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class PresignAiAttachmentResponseDto {
    attachmentId;
    uploadUrl;
    s3Key;
    expiresIn;
}
exports.PresignAiAttachmentResponseDto = PresignAiAttachmentResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2f9c1b8a-3b4a-4f3d-9b2a-1234567890ab' }),
    __metadata("design:type", String)
], PresignAiAttachmentResponseDto.prototype, "attachmentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'https://s3.amazonaws.com/bucket/...' }),
    __metadata("design:type", String)
], PresignAiAttachmentResponseDto.prototype, "uploadUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'swiftnine/docs/app/ai-attachments/conversation-uuid/abc123-file.pdf' }),
    __metadata("design:type", String)
], PresignAiAttachmentResponseDto.prototype, "s3Key", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 900 }),
    __metadata("design:type", Number)
], PresignAiAttachmentResponseDto.prototype, "expiresIn", void 0);
//# sourceMappingURL=presign-ai-attachment-response.dto.js.map