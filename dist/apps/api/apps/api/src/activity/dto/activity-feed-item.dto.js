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
exports.ActivityFeedResponseDto = exports.ActivityFeedItemDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class ActivityActorDto {
    id;
    fullName;
    email;
    avatarUrl;
    avatarColor;
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: '3f6c6c5e-4a8f-4f55-8f49-f6e2d15e7f24' }),
    __metadata("design:type", String)
], ActivityActorDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Ayesha Khan' }),
    __metadata("design:type", String)
], ActivityActorDto.prototype, "fullName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ nullable: true, example: 'ayesha@example.com' }),
    __metadata("design:type", Object)
], ActivityActorDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ nullable: true, example: 'https://cdn.example.com/avatar.png' }),
    __metadata("design:type", Object)
], ActivityActorDto.prototype, "avatarUrl", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '#6366f1' }),
    __metadata("design:type", String)
], ActivityActorDto.prototype, "avatarColor", void 0);
class ActivityFeedItemDto {
    id;
    kind;
    category;
    entityType;
    entityId;
    action;
    fieldName;
    oldValue;
    newValue;
    metadata;
    actor;
    displayText;
    createdAt;
}
exports.ActivityFeedItemDto = ActivityFeedItemDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Activity log row ID. Use the last returned ID as `cursor` to load older activity.',
        example: '4650c5ff-b89e-4988-9b51-2f6a184c2eba',
    }),
    __metadata("design:type", String)
], ActivityFeedItemDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: ['activity', 'comment'],
        description: '`comment` is reserved for comment timeline rows once comment CRUD is enabled.',
        example: 'activity',
    }),
    __metadata("design:type", String)
], ActivityFeedItemDto.prototype, "kind", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ClickUp-style activity filter category.',
        example: 'status',
    }),
    __metadata("design:type", String)
], ActivityFeedItemDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Entity type that produced the activity.',
        example: 'task',
    }),
    __metadata("design:type", String)
], ActivityFeedItemDto.prototype, "entityType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID of the entity that produced the activity.',
        example: 'd766605b-7082-4680-b817-d8e4ea5b40fd',
    }),
    __metadata("design:type", String)
], ActivityFeedItemDto.prototype, "entityId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Normalized activity action.',
        example: 'status_changed',
    }),
    __metadata("design:type", String)
], ActivityFeedItemDto.prototype, "action", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        nullable: true,
        description: 'Field name when this row represents a field-level change.',
        example: 'status',
    }),
    __metadata("design:type", Object)
], ActivityFeedItemDto.prototype, "fieldName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        nullable: true,
        description: 'Previous value, stringified for display/filtering.',
        example: 'To Do',
    }),
    __metadata("design:type", Object)
], ActivityFeedItemDto.prototype, "oldValue", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        nullable: true,
        description: 'New value, stringified for display/filtering.',
        example: 'In Progress',
    }),
    __metadata("design:type", Object)
], ActivityFeedItemDto.prototype, "newValue", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Object,
        description: 'Denormalized context for rendering without extra lookups.',
        example: {
            taskTitle: 'Build activity feed',
            taskNumber: 42,
            projectName: 'Backend',
            listName: 'Sprint',
            oldStatusId: '0cfb5a62-6db7-4203-8391-e82ad3f6ed22',
            newStatusId: '76024116-3fa6-4c8f-8ec6-f8b8561a9757',
        },
    }),
    __metadata("design:type", Object)
], ActivityFeedItemDto.prototype, "metadata", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: ActivityActorDto, description: 'User who performed the activity.' }),
    __metadata("design:type", ActivityActorDto)
], ActivityFeedItemDto.prototype, "actor", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Human-readable fallback text. Frontend can render richer UI from structured fields.',
        example: 'Ayesha Khan changed status from To Do to In Progress',
    }),
    __metadata("design:type", String)
], ActivityFeedItemDto.prototype, "displayText", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2026-04-23T09:30:00.000Z' }),
    __metadata("design:type", Date)
], ActivityFeedItemDto.prototype, "createdAt", void 0);
class ActivityFeedResponseDto {
    items;
    nextCursor;
}
exports.ActivityFeedResponseDto = ActivityFeedResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: ActivityFeedItemDto, isArray: true }),
    __metadata("design:type", Array)
], ActivityFeedResponseDto.prototype, "items", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        nullable: true,
        description: 'Pass this value as `cursor` to fetch the next page of older activity.',
        example: '4650c5ff-b89e-4988-9b51-2f6a184c2eba',
    }),
    __metadata("design:type", Object)
], ActivityFeedResponseDto.prototype, "nextCursor", void 0);
//# sourceMappingURL=activity-feed-item.dto.js.map