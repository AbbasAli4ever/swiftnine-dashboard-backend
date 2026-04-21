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
exports.CreateAttachmentDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateAttachmentDto {
    taskId;
    memberId;
    s3Key;
    fileName;
    mimeType;
    fileSize;
}
exports.CreateAttachmentDto = CreateAttachmentDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2f9c1b8a-3b4a-4f3d-9b2a-1234567890ab' }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateAttachmentDto.prototype, "taskId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'cc6c4f04-6cae-4d0a-a3cb-864d53f92f29' }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateAttachmentDto.prototype, "memberId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'attachments/task-uuid/abc123-screenshot.png' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAttachmentDto.prototype, "s3Key", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'screenshot.png', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAttachmentDto.prototype, "fileName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'image/png', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAttachmentDto.prototype, "mimeType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 245000, required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateAttachmentDto.prototype, "fileSize", void 0);
//# sourceMappingURL=create-attachment.dto.js.map