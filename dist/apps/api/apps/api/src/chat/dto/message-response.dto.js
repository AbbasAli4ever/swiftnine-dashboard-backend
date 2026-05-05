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
exports.ChatChannelResponseDto = exports.ChatChannelMemberDto = exports.ChatMuteStateResponseDto = exports.ChatReadStateResponseDto = exports.ChatMessageContextResponseDto = exports.ChatMessageListResponseDto = exports.ChatMessageResponseDto = exports.ChatChannelSummaryDto = exports.ChatReplyPreviewDto = exports.ChatReactionDto = exports.ChatUserSummaryDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const attachment_dto_1 = require("../../attachments/dto/attachment.dto");
class ChatUserSummaryDto {
    id;
    fullName;
    avatarUrl;
}
exports.ChatUserSummaryDto = ChatUserSummaryDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ChatUserSummaryDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ChatUserSummaryDto.prototype, "fullName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ nullable: true }),
    __metadata("design:type", Object)
], ChatUserSummaryDto.prototype, "avatarUrl", void 0);
class ChatReactionDto {
    id;
    messageId;
    userId;
    emoji;
    createdAt;
    user;
}
exports.ChatReactionDto = ChatReactionDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ChatReactionDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ChatReactionDto.prototype, "messageId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ChatReactionDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ChatReactionDto.prototype, "emoji", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], ChatReactionDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: ChatUserSummaryDto }),
    __metadata("design:type", ChatUserSummaryDto)
], ChatReactionDto.prototype, "user", void 0);
class ChatReplyPreviewDto {
    id;
    senderId;
    kind;
    plaintext;
    deletedAt;
    sender;
}
exports.ChatReplyPreviewDto = ChatReplyPreviewDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ChatReplyPreviewDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ nullable: true }),
    __metadata("design:type", Object)
], ChatReplyPreviewDto.prototype, "senderId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ['USER', 'SYSTEM'] }),
    __metadata("design:type", String)
], ChatReplyPreviewDto.prototype, "kind", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ChatReplyPreviewDto.prototype, "plaintext", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ nullable: true }),
    __metadata("design:type", Object)
], ChatReplyPreviewDto.prototype, "deletedAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: ChatUserSummaryDto, nullable: true }),
    __metadata("design:type", Object)
], ChatReplyPreviewDto.prototype, "sender", void 0);
class ChatChannelSummaryDto {
    id;
    workspaceId;
    kind;
    privacy;
    name;
}
exports.ChatChannelSummaryDto = ChatChannelSummaryDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ChatChannelSummaryDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ChatChannelSummaryDto.prototype, "workspaceId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ['CHANNEL', 'DM'] }),
    __metadata("design:type", String)
], ChatChannelSummaryDto.prototype, "kind", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ['PUBLIC', 'PRIVATE'] }),
    __metadata("design:type", String)
], ChatChannelSummaryDto.prototype, "privacy", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ nullable: true }),
    __metadata("design:type", Object)
], ChatChannelSummaryDto.prototype, "name", void 0);
class ChatMessageResponseDto {
    id;
    channelId;
    senderId;
    kind;
    contentJson;
    plaintext;
    replyToMessageId;
    isEdited;
    editedAt;
    isPinned;
    pinnedAt;
    pinnedById;
    createdAt;
    updatedAt;
    deletedAt;
    sender;
    pinnedBy;
    mentions;
    reactions;
    attachments;
    replyTo;
    channel;
}
exports.ChatMessageResponseDto = ChatMessageResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ChatMessageResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ChatMessageResponseDto.prototype, "channelId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ nullable: true }),
    __metadata("design:type", Object)
], ChatMessageResponseDto.prototype, "senderId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ['USER', 'SYSTEM'] }),
    __metadata("design:type", String)
], ChatMessageResponseDto.prototype, "kind", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Object }),
    __metadata("design:type", Object)
], ChatMessageResponseDto.prototype, "contentJson", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ChatMessageResponseDto.prototype, "plaintext", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ nullable: true }),
    __metadata("design:type", Object)
], ChatMessageResponseDto.prototype, "replyToMessageId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], ChatMessageResponseDto.prototype, "isEdited", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ nullable: true }),
    __metadata("design:type", Object)
], ChatMessageResponseDto.prototype, "editedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], ChatMessageResponseDto.prototype, "isPinned", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ nullable: true }),
    __metadata("design:type", Object)
], ChatMessageResponseDto.prototype, "pinnedAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ nullable: true }),
    __metadata("design:type", Object)
], ChatMessageResponseDto.prototype, "pinnedById", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], ChatMessageResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], ChatMessageResponseDto.prototype, "updatedAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ nullable: true }),
    __metadata("design:type", Object)
], ChatMessageResponseDto.prototype, "deletedAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: ChatUserSummaryDto, nullable: true }),
    __metadata("design:type", Object)
], ChatMessageResponseDto.prototype, "sender", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: ChatUserSummaryDto, nullable: true }),
    __metadata("design:type", Object)
], ChatMessageResponseDto.prototype, "pinnedBy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: ChatUserSummaryDto, isArray: true }),
    __metadata("design:type", Array)
], ChatMessageResponseDto.prototype, "mentions", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: ChatReactionDto, isArray: true }),
    __metadata("design:type", Array)
], ChatMessageResponseDto.prototype, "reactions", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: attachment_dto_1.AttachmentDto, isArray: true }),
    __metadata("design:type", Array)
], ChatMessageResponseDto.prototype, "attachments", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: ChatReplyPreviewDto, nullable: true }),
    __metadata("design:type", Object)
], ChatMessageResponseDto.prototype, "replyTo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: ChatChannelSummaryDto }),
    __metadata("design:type", ChatChannelSummaryDto)
], ChatMessageResponseDto.prototype, "channel", void 0);
class ChatMessageListResponseDto {
    items;
    nextCursor;
}
exports.ChatMessageListResponseDto = ChatMessageListResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: ChatMessageResponseDto, isArray: true }),
    __metadata("design:type", Array)
], ChatMessageListResponseDto.prototype, "items", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ nullable: true }),
    __metadata("design:type", Object)
], ChatMessageListResponseDto.prototype, "nextCursor", void 0);
class ChatMessageContextResponseDto {
    items;
    anchorMessageId;
    hasBefore;
    hasAfter;
}
exports.ChatMessageContextResponseDto = ChatMessageContextResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: ChatMessageResponseDto, isArray: true }),
    __metadata("design:type", Array)
], ChatMessageContextResponseDto.prototype, "items", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ChatMessageContextResponseDto.prototype, "anchorMessageId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], ChatMessageContextResponseDto.prototype, "hasBefore", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], ChatMessageContextResponseDto.prototype, "hasAfter", void 0);
class ChatReadStateResponseDto {
    channelId;
    userId;
    lastReadMessageId;
    unreadCount;
    readAt;
}
exports.ChatReadStateResponseDto = ChatReadStateResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ChatReadStateResponseDto.prototype, "channelId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ChatReadStateResponseDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ChatReadStateResponseDto.prototype, "lastReadMessageId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ChatReadStateResponseDto.prototype, "unreadCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], ChatReadStateResponseDto.prototype, "readAt", void 0);
class ChatMuteStateResponseDto {
    channelId;
    userId;
    isMuted;
}
exports.ChatMuteStateResponseDto = ChatMuteStateResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ChatMuteStateResponseDto.prototype, "channelId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ChatMuteStateResponseDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], ChatMuteStateResponseDto.prototype, "isMuted", void 0);
class ChatChannelMemberDto {
    id;
    userId;
    role;
    isMuted;
    unreadCount;
    lastReadMessageId;
    joinedAt;
    user;
}
exports.ChatChannelMemberDto = ChatChannelMemberDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ChatChannelMemberDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ChatChannelMemberDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ['OWNER', 'ADMIN', 'MEMBER'] }),
    __metadata("design:type", String)
], ChatChannelMemberDto.prototype, "role", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], ChatChannelMemberDto.prototype, "isMuted", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ChatChannelMemberDto.prototype, "unreadCount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ nullable: true }),
    __metadata("design:type", Object)
], ChatChannelMemberDto.prototype, "lastReadMessageId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], ChatChannelMemberDto.prototype, "joinedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: ChatUserSummaryDto }),
    __metadata("design:type", ChatUserSummaryDto)
], ChatChannelMemberDto.prototype, "user", void 0);
class ChatChannelResponseDto {
    id;
    workspaceId;
    kind;
    privacy;
    name;
    description;
    projectId;
    createdBy;
    createdAt;
    updatedAt;
    isMuted;
    unreadCount;
    lastReadMessageId;
    members;
}
exports.ChatChannelResponseDto = ChatChannelResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ChatChannelResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ChatChannelResponseDto.prototype, "workspaceId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ['CHANNEL', 'DM'] }),
    __metadata("design:type", String)
], ChatChannelResponseDto.prototype, "kind", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ['PUBLIC', 'PRIVATE'] }),
    __metadata("design:type", String)
], ChatChannelResponseDto.prototype, "privacy", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ nullable: true }),
    __metadata("design:type", Object)
], ChatChannelResponseDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ nullable: true }),
    __metadata("design:type", Object)
], ChatChannelResponseDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ nullable: true }),
    __metadata("design:type", Object)
], ChatChannelResponseDto.prototype, "projectId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ChatChannelResponseDto.prototype, "createdBy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], ChatChannelResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], ChatChannelResponseDto.prototype, "updatedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], ChatChannelResponseDto.prototype, "isMuted", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ChatChannelResponseDto.prototype, "unreadCount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ nullable: true }),
    __metadata("design:type", Object)
], ChatChannelResponseDto.prototype, "lastReadMessageId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: ChatChannelMemberDto, isArray: true }),
    __metadata("design:type", Array)
], ChatChannelResponseDto.prototype, "members", void 0);
//# sourceMappingURL=message-response.dto.js.map