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
exports.PresignResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class PresignResponseDto {
    uploadUrl;
    s3Key;
    expiresAt;
    attachmentId;
}
exports.PresignResponseDto = PresignResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'https://s3.amazonaws.com/bucket/...' }),
    __metadata("design:type", String)
], PresignResponseDto.prototype, "uploadUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'attachments/task-uuid/abc123-screenshot.png' }),
    __metadata("design:type", String)
], PresignResponseDto.prototype, "s3Key", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2026-04-21T12:00:00.000Z', format: 'date-time' }),
    __metadata("design:type", Date)
], PresignResponseDto.prototype, "expiresAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '2f9c1b8a-3b4a-4f3d-9b2a-1234567890ab',
        required: false,
        nullable: true,
    }),
    __metadata("design:type", Object)
], PresignResponseDto.prototype, "attachmentId", void 0);
//# sourceMappingURL=presign-response.dto.js.map