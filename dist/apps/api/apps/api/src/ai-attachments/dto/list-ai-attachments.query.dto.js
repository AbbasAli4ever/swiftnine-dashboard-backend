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
exports.ListAiAttachmentsQueryDto = exports.ListAiAttachmentsQuerySchema = void 0;
const swagger_1 = require("@nestjs/swagger");
const nestjs_zod_1 = require("nestjs-zod");
const zod_1 = require("zod");
const limit = zod_1.z.coerce.number().int().min(1).max(100).default(50);
exports.ListAiAttachmentsQuerySchema = zod_1.z.object({
    conversationId: zod_1.z.string().uuid().optional(),
    cursor: zod_1.z.string().trim().min(1).max(200).optional(),
    limit,
});
class ListAiAttachmentsQueryDto extends (0, nestjs_zod_1.createZodDto)(exports.ListAiAttachmentsQuerySchema) {
    conversationId;
    cursor;
    limit = 50;
}
exports.ListAiAttachmentsQueryDto = ListAiAttachmentsQueryDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ format: 'uuid' }),
    __metadata("design:type", String)
], ListAiAttachmentsQueryDto.prototype, "conversationId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '2026-05-13T10:30:00.000Z:attachment-id' }),
    __metadata("design:type", String)
], ListAiAttachmentsQueryDto.prototype, "cursor", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 50, minimum: 1, maximum: 100, default: 50 }),
    __metadata("design:type", Number)
], ListAiAttachmentsQueryDto.prototype, "limit", void 0);
//# sourceMappingURL=list-ai-attachments.query.dto.js.map