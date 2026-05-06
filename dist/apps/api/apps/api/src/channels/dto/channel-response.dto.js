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
exports.ChannelResponseDto = exports.ChannelProjectSummaryDto = exports.ChannelMemberResponseDto = exports.ChannelUserSummaryDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class ChannelUserSummaryDto {
    id;
    fullName;
    avatarUrl;
}
exports.ChannelUserSummaryDto = ChannelUserSummaryDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: String }),
    __metadata("design:type", String)
], ChannelUserSummaryDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String }),
    __metadata("design:type", String)
], ChannelUserSummaryDto.prototype, "fullName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, required: false, nullable: true }),
    __metadata("design:type", Object)
], ChannelUserSummaryDto.prototype, "avatarUrl", void 0);
class ChannelMemberResponseDto {
    id;
    channelId;
    userId;
    role;
    isMuted;
    unreadCount;
    lastReadMessageId;
    joinedAt;
    createdAt;
    user;
}
exports.ChannelMemberResponseDto = ChannelMemberResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: String }),
    __metadata("design:type", String)
], ChannelMemberResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String }),
    __metadata("design:type", String)
], ChannelMemberResponseDto.prototype, "channelId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String }),
    __metadata("design:type", String)
], ChannelMemberResponseDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ['OWNER', 'ADMIN', 'MEMBER'] }),
    __metadata("design:type", String)
], ChannelMemberResponseDto.prototype, "role", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Boolean }),
    __metadata("design:type", Boolean)
], ChannelMemberResponseDto.prototype, "isMuted", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number }),
    __metadata("design:type", Number)
], ChannelMemberResponseDto.prototype, "unreadCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, required: false, nullable: true }),
    __metadata("design:type", Object)
], ChannelMemberResponseDto.prototype, "lastReadMessageId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, format: 'date-time' }),
    __metadata("design:type", Date)
], ChannelMemberResponseDto.prototype, "joinedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, format: 'date-time' }),
    __metadata("design:type", Date)
], ChannelMemberResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: ChannelUserSummaryDto }),
    __metadata("design:type", ChannelUserSummaryDto)
], ChannelMemberResponseDto.prototype, "user", void 0);
class ChannelProjectSummaryDto {
    id;
    workspaceId;
    name;
    description;
    color;
    icon;
    taskIdPrefix;
    taskCounter;
    isArchived;
    createdBy;
    createdAt;
    updatedAt;
    deletedAt;
}
exports.ChannelProjectSummaryDto = ChannelProjectSummaryDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: String }),
    __metadata("design:type", String)
], ChannelProjectSummaryDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String }),
    __metadata("design:type", String)
], ChannelProjectSummaryDto.prototype, "workspaceId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, required: false, nullable: true }),
    __metadata("design:type", Object)
], ChannelProjectSummaryDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, required: false, nullable: true }),
    __metadata("design:type", Object)
], ChannelProjectSummaryDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String }),
    __metadata("design:type", String)
], ChannelProjectSummaryDto.prototype, "color", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, required: false, nullable: true }),
    __metadata("design:type", Object)
], ChannelProjectSummaryDto.prototype, "icon", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String }),
    __metadata("design:type", String)
], ChannelProjectSummaryDto.prototype, "taskIdPrefix", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number }),
    __metadata("design:type", Number)
], ChannelProjectSummaryDto.prototype, "taskCounter", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Boolean }),
    __metadata("design:type", Boolean)
], ChannelProjectSummaryDto.prototype, "isArchived", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String }),
    __metadata("design:type", String)
], ChannelProjectSummaryDto.prototype, "createdBy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, format: 'date-time' }),
    __metadata("design:type", Date)
], ChannelProjectSummaryDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, format: 'date-time' }),
    __metadata("design:type", Date)
], ChannelProjectSummaryDto.prototype, "updatedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, format: 'date-time', required: false, nullable: true }),
    __metadata("design:type", Object)
], ChannelProjectSummaryDto.prototype, "deletedAt", void 0);
class ChannelResponseDto {
    id;
    workspaceId;
    projectId;
    name;
    description;
    privacy;
    createdBy;
    createdAt;
    updatedAt;
    members;
    isMember;
    isMuted;
    unreadCount;
    lastReadMessageId;
    viewerMembership;
    project;
}
exports.ChannelResponseDto = ChannelResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: String }),
    __metadata("design:type", String)
], ChannelResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String }),
    __metadata("design:type", String)
], ChannelResponseDto.prototype, "workspaceId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, required: false, nullable: true }),
    __metadata("design:type", Object)
], ChannelResponseDto.prototype, "projectId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String }),
    __metadata("design:type", String)
], ChannelResponseDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, required: false, nullable: true }),
    __metadata("design:type", Object)
], ChannelResponseDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ['PUBLIC', 'PRIVATE'] }),
    __metadata("design:type", String)
], ChannelResponseDto.prototype, "privacy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String }),
    __metadata("design:type", String)
], ChannelResponseDto.prototype, "createdBy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, format: 'date-time' }),
    __metadata("design:type", Date)
], ChannelResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, format: 'date-time' }),
    __metadata("design:type", Date)
], ChannelResponseDto.prototype, "updatedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: ChannelMemberResponseDto, isArray: true }),
    __metadata("design:type", Array)
], ChannelResponseDto.prototype, "members", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Boolean }),
    __metadata("design:type", Boolean)
], ChannelResponseDto.prototype, "isMember", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Boolean }),
    __metadata("design:type", Boolean)
], ChannelResponseDto.prototype, "isMuted", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number }),
    __metadata("design:type", Number)
], ChannelResponseDto.prototype, "unreadCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, required: false, nullable: true }),
    __metadata("design:type", Object)
], ChannelResponseDto.prototype, "lastReadMessageId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: ChannelMemberResponseDto, required: false, nullable: true }),
    __metadata("design:type", Object)
], ChannelResponseDto.prototype, "viewerMembership", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: ChannelProjectSummaryDto, required: false, nullable: true }),
    __metadata("design:type", Object)
], ChannelResponseDto.prototype, "project", void 0);
//# sourceMappingURL=channel-response.dto.js.map