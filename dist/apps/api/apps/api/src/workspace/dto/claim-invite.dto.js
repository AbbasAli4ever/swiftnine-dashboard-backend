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
exports.ClaimInviteResponseDto = exports.ClaimInviteDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const nestjs_zod_1 = require("nestjs-zod");
const zod_1 = require("zod");
const auth_response_dto_1 = require("../../auth/dto/auth-response.dto");
const ClaimInviteSchema = zod_1.z.object({
    token: zod_1.z.string().uuid('Invalid invite token'),
    fullName: zod_1.z
        .string()
        .min(2, 'Full name must be at least 2 characters')
        .max(100),
    password: zod_1.z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Must contain at least one number')
        .regex(/[^A-Za-z0-9]/, 'Must contain at least one special character'),
});
class ClaimInviteDto extends (0, nestjs_zod_1.createZodDto)(ClaimInviteSchema) {
}
exports.ClaimInviteDto = ClaimInviteDto;
class ClaimInviteResponseDto {
    user;
    accessToken;
    workspaceId;
}
exports.ClaimInviteResponseDto = ClaimInviteResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: auth_response_dto_1.AuthUserDto }),
    __metadata("design:type", auth_response_dto_1.AuthUserDto)
], ClaimInviteResponseDto.prototype, "user", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' }),
    __metadata("design:type", String)
], ClaimInviteResponseDto.prototype, "accessToken", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' }),
    __metadata("design:type", String)
], ClaimInviteResponseDto.prototype, "workspaceId", void 0);
//# sourceMappingURL=claim-invite.dto.js.map