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
exports.AttachmentDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class AttachmentDto {
    id;
    s3Key;
    fileName;
    mimeType;
    fileSize;
    createdAt;
}
exports.AttachmentDto = AttachmentDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2f9c1b8a-3b4a-4f3d-9b2a-1234567890ab' }),
    __metadata("design:type", String)
], AttachmentDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'attachments/task-uuid/abc123-screenshot.png' }),
    __metadata("design:type", String)
], AttachmentDto.prototype, "s3Key", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'screenshot.png', required: false }),
    __metadata("design:type", String)
], AttachmentDto.prototype, "fileName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'image/png', required: false }),
    __metadata("design:type", String)
], AttachmentDto.prototype, "mimeType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 245000, required: false }),
    __metadata("design:type", Number)
], AttachmentDto.prototype, "fileSize", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2026-04-21T12:00:00.000Z', format: 'date-time' }),
    __metadata("design:type", Date)
], AttachmentDto.prototype, "createdAt", void 0);
//# sourceMappingURL=attachment.dto.js.map