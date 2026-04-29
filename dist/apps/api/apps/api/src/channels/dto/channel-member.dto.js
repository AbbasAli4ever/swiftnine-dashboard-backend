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
exports.BulkAddChannelMembersDto = exports.AddChannelMemberDto = void 0;
const nestjs_zod_1 = require("nestjs-zod");
const zod_1 = require("zod");
const swagger_1 = require("@nestjs/swagger");
const ChannelMemberSchema = zod_1.z.object({
    userId: zod_1.z.string().uuid('Invalid userId'),
    role: zod_1.z.enum(['admin', 'member']),
});
const BulkChannelMembersSchema = zod_1.z.object({
    members: zod_1.z.array(ChannelMemberSchema).min(1),
});
class AddChannelMemberDto extends (0, nestjs_zod_1.createZodDto)(ChannelMemberSchema) {
    userId = '';
    role = 'member';
}
exports.AddChannelMemberDto = AddChannelMemberDto;
__decorate([
    (0, swagger_1.ApiProperty)({ format: 'uuid', description: 'User id to add to channel' }),
    __metadata("design:type", Object)
], AddChannelMemberDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ['admin', 'member'], description: 'Role to assign in channel' }),
    __metadata("design:type", String)
], AddChannelMemberDto.prototype, "role", void 0);
class BulkAddChannelMembersDto extends (0, nestjs_zod_1.createZodDto)(BulkChannelMembersSchema) {
    members = [];
}
exports.BulkAddChannelMembersDto = BulkAddChannelMembersDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: AddChannelMemberDto, isArray: true }),
    __metadata("design:type", Array)
], BulkAddChannelMembersDto.prototype, "members", void 0);
//# sourceMappingURL=channel-member.dto.js.map