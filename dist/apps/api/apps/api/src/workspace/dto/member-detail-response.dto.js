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
exports.MemberDetailResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class MemberDetailResponseDto {
    id;
    workspaceMemberId;
    fullName;
    email;
    role;
    avatarUrl;
    avatarColor;
    designation;
    bio;
    isOnline;
    lastActive;
    timezone;
    notificationPreferences;
    invitedBy;
    invitedOn;
    inviteStatus;
    createdAt;
    updatedAt;
}
exports.MemberDetailResponseDto = MemberDetailResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'cc6c4f04-6cae-4d0a-a3cb-864d53f92f29' }),
    __metadata("design:type", String)
], MemberDetailResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '7f9c4f04-1a2b-4d0a-a3cb-864d53f92abc' }),
    __metadata("design:type", String)
], MemberDetailResponseDto.prototype, "workspaceMemberId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Shoaib Ahmed' }),
    __metadata("design:type", String)
], MemberDetailResponseDto.prototype, "fullName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'shoaib@example.com' }),
    __metadata("design:type", String)
], MemberDetailResponseDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'MEMBER', enum: ['OWNER', 'ADMIN', 'MEMBER'] }),
    __metadata("design:type", String)
], MemberDetailResponseDto.prototype, "role", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'https://cdn.example.com/avatar.png', nullable: true }),
    __metadata("design:type", Object)
], MemberDetailResponseDto.prototype, "avatarUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'blue', nullable: true }),
    __metadata("design:type", Object)
], MemberDetailResponseDto.prototype, "avatarColor", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Lead Backend Engineer', nullable: true }),
    __metadata("design:type", Object)
], MemberDetailResponseDto.prototype, "designation", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'I like to build distributed systems.', nullable: true }),
    __metadata("design:type", Object)
], MemberDetailResponseDto.prototype, "bio", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true }),
    __metadata("design:type", Boolean)
], MemberDetailResponseDto.prototype, "isOnline", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2026-04-13T16:20:59.000Z', format: 'date-time', nullable: true }),
    __metadata("design:type", Object)
], MemberDetailResponseDto.prototype, "lastActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Asia/Karachi', nullable: true }),
    __metadata("design:type", Object)
], MemberDetailResponseDto.prototype, "timezone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: {}, nullable: true }),
    __metadata("design:type", Object)
], MemberDetailResponseDto.prototype, "notificationPreferences", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Shoaib Ahmed', nullable: true }),
    __metadata("design:type", Object)
], MemberDetailResponseDto.prototype, "invitedBy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2026-04-10T12:35:41.000Z', format: 'date-time', nullable: true }),
    __metadata("design:type", Object)
], MemberDetailResponseDto.prototype, "invitedOn", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'PENDING', enum: ['PENDING', 'ACCEPTED', 'EXPIRED', 'REVOKED'], nullable: true }),
    __metadata("design:type", Object)
], MemberDetailResponseDto.prototype, "inviteStatus", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2026-04-13T16:20:59.000Z', format: 'date-time' }),
    __metadata("design:type", Date)
], MemberDetailResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2026-04-13T16:20:59.000Z', format: 'date-time' }),
    __metadata("design:type", Date)
], MemberDetailResponseDto.prototype, "updatedAt", void 0);
//# sourceMappingURL=member-detail-response.dto.js.map