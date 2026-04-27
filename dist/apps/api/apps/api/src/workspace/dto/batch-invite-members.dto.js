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
exports.BatchInviteResponseDto = exports.BatchInviteSummaryDto = exports.BatchInviteMemberResultDto = exports.BatchInviteMembersDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const nestjs_zod_1 = require("nestjs-zod");
const zod_1 = require("zod");
const BatchInviteMembersSchema = zod_1.z.object({
    emails: zod_1.z
        .array(zod_1.z.string().email('Invalid email address'))
        .min(1, 'At least one email is required')
        .max(50, 'You can invite at most 50 emails per request'),
    role: zod_1.z.enum(['OWNER', 'MEMBER']).default('MEMBER'),
});
class BatchInviteMembersDto extends (0, nestjs_zod_1.createZodDto)(BatchInviteMembersSchema) {
}
exports.BatchInviteMembersDto = BatchInviteMembersDto;
class BatchInviteMemberResultDto {
    email;
    status;
    message;
}
exports.BatchInviteMemberResultDto = BatchInviteMemberResultDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'jane@example.com' }),
    __metadata("design:type", String)
], BatchInviteMemberResultDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'invited', enum: ['invited', 'already_member', 'failed'] }),
    __metadata("design:type", String)
], BatchInviteMemberResultDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: null, nullable: true }),
    __metadata("design:type", Object)
], BatchInviteMemberResultDto.prototype, "message", void 0);
class BatchInviteSummaryDto {
    total;
    invited;
    alreadyMember;
    failed;
}
exports.BatchInviteSummaryDto = BatchInviteSummaryDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 3 }),
    __metadata("design:type", Number)
], BatchInviteSummaryDto.prototype, "total", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 2 }),
    __metadata("design:type", Number)
], BatchInviteSummaryDto.prototype, "invited", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    __metadata("design:type", Number)
], BatchInviteSummaryDto.prototype, "alreadyMember", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 0 }),
    __metadata("design:type", Number)
], BatchInviteSummaryDto.prototype, "failed", void 0);
class BatchInviteResponseDto {
    results;
    summary;
}
exports.BatchInviteResponseDto = BatchInviteResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: [BatchInviteMemberResultDto] }),
    __metadata("design:type", Array)
], BatchInviteResponseDto.prototype, "results", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: BatchInviteSummaryDto }),
    __metadata("design:type", BatchInviteSummaryDto)
], BatchInviteResponseDto.prototype, "summary", void 0);
//# sourceMappingURL=batch-invite-members.dto.js.map