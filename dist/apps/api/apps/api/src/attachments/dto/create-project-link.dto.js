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
exports.CreateProjectLinkDto = exports.CreateProjectLinkSchema = void 0;
const swagger_1 = require("@nestjs/swagger");
const nestjs_zod_1 = require("nestjs-zod");
const zod_1 = require("zod");
const httpUrl = zod_1.z
    .string()
    .trim()
    .url('linkUrl must be a valid URL')
    .max(2048)
    .refine((value) => /^https?:\/\//i.test(value), {
    message: 'linkUrl must start with http:// or https://',
});
exports.CreateProjectLinkSchema = zod_1.z.object({
    linkUrl: httpUrl,
    title: zod_1.z.string().trim().min(1).max(255),
    description: zod_1.z.string().trim().max(2000).optional(),
});
class CreateProjectLinkDto extends (0, nestjs_zod_1.createZodDto)(exports.CreateProjectLinkSchema) {
    linkUrl;
    title;
    description;
}
exports.CreateProjectLinkDto = CreateProjectLinkDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'https://www.figma.com/file/example', maxLength: 2048 }),
    __metadata("design:type", String)
], CreateProjectLinkDto.prototype, "linkUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Design file', maxLength: 255 }),
    __metadata("design:type", String)
], CreateProjectLinkDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'Main design reference for this project.',
        maxLength: 2000,
    }),
    __metadata("design:type", String)
], CreateProjectLinkDto.prototype, "description", void 0);
//# sourceMappingURL=create-project-link.dto.js.map