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
exports.BatchAddResponseDto = exports.BatchAddSummaryDto = exports.BatchAddMemberResultDto = exports.BatchAddMembersDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const nestjs_zod_1 = require("nestjs-zod");
const zod_1 = require("zod");
const BatchAddMembersSchema = zod_1.z.object({
    userIds: zod_1.z
        .array(zod_1.z.string().uuid('Invalid user id'))
        .min(1, 'At least one user id is required')
        .max(50, 'You can add at most 50 users per request'),
    role: zod_1.z.enum(['OWNER', 'MEMBER']).default('MEMBER'),
});
class BatchAddMembersDto extends (0, nestjs_zod_1.createZodDto)(BatchAddMembersSchema) {
}
exports.BatchAddMembersDto = BatchAddMembersDto;
class BatchAddMemberResultDto {
    userId;
    status;
    message;
}
exports.BatchAddMemberResultDto = BatchAddMemberResultDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '6a1f4e9a-...' }),
    __metadata("design:type", String)
], BatchAddMemberResultDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'added', enum: ['added', 'already_member', 'failed'] }),
    __metadata("design:type", String)
], BatchAddMemberResultDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: null, nullable: true }),
    __metadata("design:type", Object)
], BatchAddMemberResultDto.prototype, "message", void 0);
class BatchAddSummaryDto {
    total;
    added;
    alreadyMember;
    failed;
}
exports.BatchAddSummaryDto = BatchAddSummaryDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 3 }),
    __metadata("design:type", Number)
], BatchAddSummaryDto.prototype, "total", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 2 }),
    __metadata("design:type", Number)
], BatchAddSummaryDto.prototype, "added", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    __metadata("design:type", Number)
], BatchAddSummaryDto.prototype, "alreadyMember", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 0 }),
    __metadata("design:type", Number)
], BatchAddSummaryDto.prototype, "failed", void 0);
class BatchAddResponseDto {
    results;
    summary;
}
exports.BatchAddResponseDto = BatchAddResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: [BatchAddMemberResultDto] }),
    __metadata("design:type", Array)
], BatchAddResponseDto.prototype, "results", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: BatchAddSummaryDto }),
    __metadata("design:type", BatchAddSummaryDto)
], BatchAddResponseDto.prototype, "summary", void 0);
//# sourceMappingURL=batch-add-members.dto.js.map