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
exports.CreateCommentDto = void 0;
const nestjs_zod_1 = require("nestjs-zod");
const zod_1 = require("zod");
const swagger_1 = require("@nestjs/swagger");
const CreateCommentSchema = zod_1.z.object({
    content: zod_1.z.string().min(1, 'Content is required').max(10000),
    parentId: zod_1.z.string().uuid('Invalid parentId').optional(),
    mentions: zod_1.z.array(zod_1.z.string().uuid('Invalid member id')).optional(),
});
class CreateCommentDto extends (0, nestjs_zod_1.createZodDto)(CreateCommentSchema) {
    content = '';
    parentId;
    mentions;
}
exports.CreateCommentDto = CreateCommentDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, description: 'Comment content', minLength: 1, maxLength: 10000 }),
    __metadata("design:type", String)
], CreateCommentDto.prototype, "content", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, description: 'Parent comment id (optional)', required: false, format: 'uuid' }),
    __metadata("design:type", String)
], CreateCommentDto.prototype, "parentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [String], description: 'Mentioned workspace member ids or user ids', required: false }),
    __metadata("design:type", Array)
], CreateCommentDto.prototype, "mentions", void 0);
//# sourceMappingURL=create-comment.dto.js.map