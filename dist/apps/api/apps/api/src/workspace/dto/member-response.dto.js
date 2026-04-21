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
exports.MemberResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class MemberResponseDto {
    id;
    fullName;
    email;
    role;
    lastActive;
    invitedBy;
    invitedOn;
    inviteStatus;
}
exports.MemberResponseDto = MemberResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'cc6c4f04-6cae-4d0a-a3cb-864d53f92f29' }),
    __metadata("design:type", String)
], MemberResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Shoaib Ahmed' }),
    __metadata("design:type", String)
], MemberResponseDto.prototype, "fullName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'shoaib@example.com' }),
    __metadata("design:type", String)
], MemberResponseDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'MEMBER', enum: ['OWNER', 'MEMBER'] }),
    __metadata("design:type", String)
], MemberResponseDto.prototype, "role", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2026-04-13T16:20:59.000Z', format: 'date-time', nullable: true }),
    __metadata("design:type", Object)
], MemberResponseDto.prototype, "lastActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Shoaib Ahmed', nullable: true }),
    __metadata("design:type", Object)
], MemberResponseDto.prototype, "invitedBy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2026-04-10T12:35:41.000Z', format: 'date-time', nullable: true }),
    __metadata("design:type", Object)
], MemberResponseDto.prototype, "invitedOn", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'PENDING', enum: ['PENDING', 'ACCEPTED', 'EXPIRED', 'REVOKED'], nullable: true }),
    __metadata("design:type", Object)
], MemberResponseDto.prototype, "inviteStatus", void 0);
//# sourceMappingURL=member-response.dto.js.map