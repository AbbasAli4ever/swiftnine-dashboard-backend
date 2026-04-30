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
exports.UpdateChannelDto = void 0;
const nestjs_zod_1 = require("nestjs-zod");
const zod_1 = require("zod");
const swagger_1 = require("@nestjs/swagger");
const UpdateChannelSchema = zod_1.z
    .object({
    name: zod_1.z.string().min(1, 'Name is required').max(255).optional(),
    description: zod_1.z.union([zod_1.z.string().max(10000), zod_1.z.null()]).optional(),
    privacy: zod_1.z.enum(['PUBLIC', 'PRIVATE']).optional(),
})
    .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided',
});
class UpdateChannelDto extends (0, nestjs_zod_1.createZodDto)(UpdateChannelSchema) {
    name;
    description;
    privacy;
}
exports.UpdateChannelDto = UpdateChannelDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String, description: 'Channel name', minLength: 1, maxLength: 255 }),
    __metadata("design:type", String)
], UpdateChannelDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: String, description: 'Channel description (use null to clear)' }),
    __metadata("design:type", Object)
], UpdateChannelDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: ['PUBLIC', 'PRIVATE'], description: 'Channel privacy' }),
    __metadata("design:type", String)
], UpdateChannelDto.prototype, "privacy", void 0);
//# sourceMappingURL=update-channel.dto.js.map