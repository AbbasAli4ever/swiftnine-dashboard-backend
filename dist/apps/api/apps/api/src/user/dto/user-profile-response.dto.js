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
exports.UserProfileResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const profile_status_enum_1 = require("./profile-status.enum");
class UserProfileResponseDto {
    id;
    fullName;
    designation;
    email;
    profilePicture;
    status;
    bio;
    timezone;
    showLocalTime;
    localTime;
    createdAt;
    updatedAt;
}
exports.UserProfileResponseDto = UserProfileResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'cc6c4f04-6cae-4d0a-a3cb-864d53f92f29',
    }),
    __metadata("design:type", String)
], UserProfileResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Shoaib Ahmed',
    }),
    __metadata("design:type", String)
], UserProfileResponseDto.prototype, "fullName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Lead Backend Engineer',
        nullable: true,
    }),
    __metadata("design:type", Object)
], UserProfileResponseDto.prototype, "designation", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'shoaib@example.com',
    }),
    __metadata("design:type", String)
], UserProfileResponseDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'initials:SA',
    }),
    __metadata("design:type", String)
], UserProfileResponseDto.prototype, "profilePicture", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: profile_status_enum_1.UserPresenceStatus,
        example: profile_status_enum_1.UserPresenceStatus.ONLINE,
    }),
    __metadata("design:type", String)
], UserProfileResponseDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Building secure and scalable APIs.',
        nullable: true,
    }),
    __metadata("design:type", Object)
], UserProfileResponseDto.prototype, "bio", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Asia/Karachi',
        nullable: true,
    }),
    __metadata("design:type", Object)
], UserProfileResponseDto.prototype, "timezone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: true,
    }),
    __metadata("design:type", Boolean)
], UserProfileResponseDto.prototype, "showLocalTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '13/04/2026, 21:20:59',
        nullable: true,
    }),
    __metadata("design:type", Object)
], UserProfileResponseDto.prototype, "localTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '2026-04-10T12:35:41.000Z',
        format: 'date-time',
    }),
    __metadata("design:type", Date)
], UserProfileResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '2026-04-13T16:20:59.000Z',
        format: 'date-time',
    }),
    __metadata("design:type", Date)
], UserProfileResponseDto.prototype, "updatedAt", void 0);
//# sourceMappingURL=user-profile-response.dto.js.map