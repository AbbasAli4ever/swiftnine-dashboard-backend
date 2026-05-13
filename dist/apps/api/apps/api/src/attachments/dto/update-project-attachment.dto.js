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
exports.UpdateProjectAttachmentDto = exports.UpdateProjectAttachmentSchema = void 0;
const swagger_1 = require("@nestjs/swagger");
const nestjs_zod_1 = require("nestjs-zod");
const zod_1 = require("zod");
exports.UpdateProjectAttachmentSchema = zod_1.z
    .object({
    title: zod_1.z.string().trim().min(1).max(255).nullable().optional(),
    description: zod_1.z.string().trim().max(2000).nullable().optional(),
})
    .refine((value) => Object.prototype.hasOwnProperty.call(value, 'title') ||
    Object.prototype.hasOwnProperty.call(value, 'description'), { message: 'At least one field must be provided' });
class UpdateProjectAttachmentDto extends (0, nestjs_zod_1.createZodDto)(exports.UpdateProjectAttachmentSchema) {
    title;
    description;
}
exports.UpdateProjectAttachmentDto = UpdateProjectAttachmentDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'Updated reference title',
        nullable: true,
        maxLength: 255,
    }),
    __metadata("design:type", Object)
], UpdateProjectAttachmentDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'Updated description for the resource.',
        nullable: true,
        maxLength: 2000,
    }),
    __metadata("design:type", Object)
], UpdateProjectAttachmentDto.prototype, "description", void 0);
//# sourceMappingURL=update-project-attachment.dto.js.map