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
exports.ListProjectAttachmentsQueryDto = exports.ListProjectAttachmentsQuerySchema = void 0;
const swagger_1 = require("@nestjs/swagger");
const nestjs_zod_1 = require("nestjs-zod");
const zod_1 = require("zod");
const limit = zod_1.z.coerce.number().int().min(1).max(100).default(50);
exports.ListProjectAttachmentsQuerySchema = zod_1.z.object({
    kind: zod_1.z.enum(['FILE', 'LINK']).optional(),
    uploadedBy: zod_1.z.string().uuid('Invalid uploader id').optional(),
    q: zod_1.z.string().trim().min(1).max(200).optional(),
    cursor: zod_1.z.string().trim().min(1).max(200).optional(),
    limit,
});
class ListProjectAttachmentsQueryDto extends (0, nestjs_zod_1.createZodDto)(exports.ListProjectAttachmentsQuerySchema) {
    kind;
    uploadedBy;
    q;
    cursor;
    limit = 50;
}
exports.ListProjectAttachmentsQueryDto = ListProjectAttachmentsQueryDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: ['FILE', 'LINK'] }),
    __metadata("design:type", String)
], ListProjectAttachmentsQueryDto.prototype, "kind", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'cc6c4f04-6cae-4d0a-a3cb-864d53f92f29',
        format: 'uuid',
    }),
    __metadata("design:type", String)
], ListProjectAttachmentsQueryDto.prototype, "uploadedBy", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'requirements', maxLength: 200 }),
    __metadata("design:type", String)
], ListProjectAttachmentsQueryDto.prototype, "q", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '2026-05-13T10:30:00.000Z:attachment-id' }),
    __metadata("design:type", String)
], ListProjectAttachmentsQueryDto.prototype, "cursor", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 50, minimum: 1, maximum: 100, default: 50 }),
    __metadata("design:type", Number)
], ListProjectAttachmentsQueryDto.prototype, "limit", void 0);
//# sourceMappingURL=list-project-attachments.query.dto.js.map