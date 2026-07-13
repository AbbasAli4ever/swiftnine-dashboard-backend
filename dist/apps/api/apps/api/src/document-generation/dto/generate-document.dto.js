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
exports.GenerateDocumentDto = exports.GenerateDocumentSchema = void 0;
const swagger_1 = require("@nestjs/swagger");
const nestjs_zod_1 = require("nestjs-zod");
const zod_1 = require("zod");
const MAX_SECTIONS = 30;
const MAX_HEADING_LENGTH = 200;
const MAX_BODY_LENGTH = 5000;
const MAX_BULLET_LENGTH = 500;
const MAX_BULLETS_PER_SECTION = 20;
const DocumentSectionSchema = zod_1.z
    .object({
    heading: zod_1.z.string().trim().max(MAX_HEADING_LENGTH).optional(),
    body: zod_1.z.string().trim().max(MAX_BODY_LENGTH).optional(),
    bullets: zod_1.z.array(zod_1.z.string().trim().max(MAX_BULLET_LENGTH)).max(MAX_BULLETS_PER_SECTION).optional(),
})
    .refine((s) => Boolean(s.body) || Boolean(s.bullets?.length), {
    message: 'Each section needs a body or at least one bullet',
});
exports.GenerateDocumentSchema = zod_1.z.object({
    conversationId: zod_1.z.string().uuid(),
    messageId: zod_1.z.string().uuid().optional(),
    title: zod_1.z.string().trim().min(1).max(300),
    fileName: zod_1.z.string().trim().min(1).max(255).optional(),
    sections: zod_1.z.array(DocumentSectionSchema).min(1).max(MAX_SECTIONS),
});
class GenerateDocumentDto extends (0, nestjs_zod_1.createZodDto)(exports.GenerateDocumentSchema) {
    conversationId;
    messageId;
    title;
    fileName;
    sections;
}
exports.GenerateDocumentDto = GenerateDocumentDto;
__decorate([
    (0, swagger_1.ApiProperty)({ format: 'uuid' }),
    __metadata("design:type", String)
], GenerateDocumentDto.prototype, "conversationId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ format: 'uuid' }),
    __metadata("design:type", String)
], GenerateDocumentDto.prototype, "messageId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Q3 Roadmap Summary', maxLength: 300 }),
    __metadata("design:type", String)
], GenerateDocumentDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'q3-roadmap-summary.pdf', maxLength: 255 }),
    __metadata("design:type", String)
], GenerateDocumentDto.prototype, "fileName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: 'array',
        items: {
            type: 'object',
            properties: {
                heading: { type: 'string', maxLength: MAX_HEADING_LENGTH },
                body: { type: 'string', maxLength: MAX_BODY_LENGTH },
                bullets: { type: 'array', items: { type: 'string', maxLength: MAX_BULLET_LENGTH } },
            },
        },
        minItems: 1,
        maxItems: MAX_SECTIONS,
    }),
    __metadata("design:type", Array)
], GenerateDocumentDto.prototype, "sections", void 0);
//# sourceMappingURL=generate-document.dto.js.map