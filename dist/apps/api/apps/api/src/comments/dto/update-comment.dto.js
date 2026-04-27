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
exports.UpdateCommentDto = void 0;
const nestjs_zod_1 = require("nestjs-zod");
const zod_1 = require("zod");
const swagger_1 = require("@nestjs/swagger");
const UpdateCommentSchema = zod_1.z.object({
    content: zod_1.z.string().trim().min(1, 'Content is required').max(10000),
    mentionedUserIds: zod_1.z.array(zod_1.z.string().uuid('Invalid mentioned user id')).max(100).optional(),
});
class UpdateCommentDto extends (0, nestjs_zod_1.createZodDto)(UpdateCommentSchema) {
    content = '';
    mentionedUserIds;
}
exports.UpdateCommentDto = UpdateCommentDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, description: 'Comment content', minLength: 1, maxLength: 10000 }),
    __metadata("design:type", String)
], UpdateCommentDto.prototype, "content", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: [String],
        description: 'Mentioned workspace user ids. When omitted, existing mentions are preserved.',
        example: ['cc6c4f04-6cae-4d0a-a3cb-864d53f92f29'],
    }),
    __metadata("design:type", Array)
], UpdateCommentDto.prototype, "mentionedUserIds", void 0);
//# sourceMappingURL=update-comment.dto.js.map