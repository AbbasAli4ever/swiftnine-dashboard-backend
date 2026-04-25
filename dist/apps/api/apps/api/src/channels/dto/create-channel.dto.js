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
exports.CreateChannelDto = void 0;
const nestjs_zod_1 = require("nestjs-zod");
const zod_1 = require("zod");
const swagger_1 = require("@nestjs/swagger");
const CreateChannelSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Name is required').max(255),
    description: zod_1.z.string().max(10000).optional(),
    privacy: zod_1.z.enum(['PUBLIC', 'PRIVATE']).optional(),
    projectId: zod_1.z.string().uuid('Invalid projectId').optional(),
});
class CreateChannelDto extends (0, nestjs_zod_1.createZodDto)(CreateChannelSchema) {
    name = '';
    description;
    privacy;
    projectId;
}
exports.CreateChannelDto = CreateChannelDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, description: 'Channel name', minLength: 1, maxLength: 255 }),
    __metadata("design:type", String)
], CreateChannelDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, description: 'Channel description', required: false }),
    __metadata("design:type", String)
], CreateChannelDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ['PUBLIC', 'PRIVATE'], required: false, description: 'Channel privacy' }),
    __metadata("design:type", String)
], CreateChannelDto.prototype, "privacy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, format: 'uuid', required: false, description: 'Optional project id to scope the channel' }),
    __metadata("design:type", String)
], CreateChannelDto.prototype, "projectId", void 0);
//# sourceMappingURL=create-channel.dto.js.map