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
exports.PresignProjectAttachmentDto = exports.PresignProjectAttachmentSchema = void 0;
const swagger_1 = require("@nestjs/swagger");
const nestjs_zod_1 = require("nestjs-zod");
const zod_1 = require("zod");
exports.PresignProjectAttachmentSchema = zod_1.z.object({
    fileName: zod_1.z.string().trim().min(1).max(255).optional(),
    mimeType: zod_1.z.string().trim().min(1).max(255),
    fileSize: zod_1.z.coerce.number().int().nonnegative().optional(),
});
class PresignProjectAttachmentDto extends (0, nestjs_zod_1.createZodDto)(exports.PresignProjectAttachmentSchema) {
    fileName;
    mimeType;
    fileSize;
}
exports.PresignProjectAttachmentDto = PresignProjectAttachmentDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'requirements.pdf', maxLength: 255 }),
    __metadata("design:type", String)
], PresignProjectAttachmentDto.prototype, "fileName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'application/pdf', maxLength: 255 }),
    __metadata("design:type", String)
], PresignProjectAttachmentDto.prototype, "mimeType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 245000, minimum: 0 }),
    __metadata("design:type", Number)
], PresignProjectAttachmentDto.prototype, "fileSize", void 0);
//# sourceMappingURL=presign-project-attachment.dto.js.map