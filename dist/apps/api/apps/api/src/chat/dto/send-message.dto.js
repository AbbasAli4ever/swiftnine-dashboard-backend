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
exports.SendMessageDto = void 0;
const nestjs_zod_1 = require("nestjs-zod");
const zod_1 = require("zod");
const swagger_1 = require("@nestjs/swagger");
const JsonObjectSchema = zod_1.z.object({}).passthrough();
const SendMessageSchema = zod_1.z
    .object({
    contentJson: JsonObjectSchema,
    replyToMessageId: zod_1.z.string().uuid().optional(),
    mentionedUserIds: zod_1.z.array(zod_1.z.string().uuid()).optional().default([]),
    attachmentIds: zod_1.z.array(zod_1.z.string().uuid()).optional().default([]),
})
    .transform((data) => ({
    ...data,
    mentionedUserIds: Array.from(new Set(data.mentionedUserIds ?? [])),
    attachmentIds: Array.from(new Set(data.attachmentIds ?? [])),
}));
class SendMessageDto extends (0, nestjs_zod_1.createZodDto)(SendMessageSchema) {
    contentJson;
    replyToMessageId;
    mentionedUserIds = [];
    attachmentIds = [];
}
exports.SendMessageDto = SendMessageDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: Object, description: 'Rich JSON message payload' }),
    __metadata("design:type", Object)
], SendMessageDto.prototype, "contentJson", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ format: 'uuid' }),
    __metadata("design:type", String)
], SendMessageDto.prototype, "replyToMessageId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [String], format: 'uuid' }),
    __metadata("design:type", Array)
], SendMessageDto.prototype, "mentionedUserIds", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [String], format: 'uuid' }),
    __metadata("design:type", Array)
], SendMessageDto.prototype, "attachmentIds", void 0);
//# sourceMappingURL=send-message.dto.js.map