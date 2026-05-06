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
exports.ChatFanoutService = void 0;
const common_1 = require("@nestjs/common");
const database_1 = require("../../../../libs/database/src");
const notifications_service_1 = require("../notifications/notifications.service");
let ChatFanoutService = class ChatFanoutService {
    prisma;
    notifications;
    constructor(prisma, notifications) {
        this.prisma = prisma;
        this.notifications = notifications;
    }
    async incrementUnreadCounts(channelId, senderUserId, db = this.prisma) {
        await db.$executeRaw `
      UPDATE "channel_members"
      SET "unread_count" = "unread_count" + 1
      WHERE "channel_id" = ${channelId}
        AND "user_id" <> ${senderUserId}
    `;
    }
    async notifyMessageCreated(input) {
        const preview = input.plaintext || 'Sent an attachment';
        const channelLabel = input.channelKind === 'DM'
            ? 'direct message'
            : input.channelName?.trim() || 'this channel';
        const mentioned = new Set(input.mentionedUserIds);
        for (const recipient of input.recipients) {
            if (recipient.userId === input.senderUserId)
                continue;
            const isMentioned = mentioned.has(recipient.userId);
            const isDm = input.channelKind === 'DM';
            if (recipient.isMuted && !isMentioned && !isDm)
                continue;
            const type = isMentioned || isDm ? 'chat:mention' : 'chat:message';
            const title = isDm
                ? `New direct message from ${input.senderName}`
                : isMentioned
                    ? `You were mentioned in ${channelLabel}`
                    : `New message in ${channelLabel}`;
            await this.notifications.createNotification(input.workspaceId, recipient.userId, input.senderUserId, type, title, preview, 'channel_message', input.messageId, false);
        }
    }
};
exports.ChatFanoutService = ChatFanoutService;
exports.ChatFanoutService = ChatFanoutService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_1.PrismaService,
        notifications_service_1.NotificationsService])
], ChatFanoutService);
//# sourceMappingURL=chat-fanout.service.js.map