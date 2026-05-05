import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from "../../../../libs/database/src";
import type { AuthUser } from '../auth/auth.service';
import { AuthService } from '../auth/auth.service';
import { PresenceService } from '../presence/presence.service';
import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import type { Socket } from 'socket.io';
type ChatSocketData = {
    user?: AuthUser;
};
type ChatSocket = Socket & {
    data: ChatSocketData;
};
type ChannelIdPayload = {
    channelId?: unknown;
};
type ChatMessagePayload = {
    id: string;
    channelId: string;
    kind: 'USER' | 'SYSTEM';
    pinnedById?: string | null;
    pinnedAt?: Date | null;
};
type ChatReactionPayload = {
    action: 'added' | 'removed';
    messageId: string;
    userId: string;
    emoji: string;
};
type ChatReadPayload = {
    channelId: string;
    userId: string;
    lastReadMessageId: string;
    unreadCount: number;
    readAt: Date;
};
export declare class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private readonly prisma;
    private readonly jwt;
    private readonly auth;
    private readonly presence;
    private server;
    private readonly logger;
    constructor(prisma: PrismaService, jwt: JwtService, auth: AuthService, presence: PresenceService, config: ConfigService);
    handleConnection(client: ChatSocket): Promise<void>;
    handleDisconnect(client: ChatSocket): Promise<void>;
    handleJoin(client: ChatSocket, payload: ChannelIdPayload): Promise<void>;
    handleLeave(client: ChatSocket, payload: ChannelIdPayload): Promise<void>;
    handleTypingStart(client: ChatSocket, payload: ChannelIdPayload): Promise<void>;
    handleTypingStop(client: ChatSocket, payload: ChannelIdPayload): Promise<void>;
    emitMessageCreated(message: ChatMessagePayload & Record<string, unknown>): void;
    emitMessageEdited(message: ChatMessagePayload & Record<string, unknown>): void;
    emitMessageDeleted(channelId: string, messageId: string, deletedAt: Date | null | undefined): void;
    emitMessagePinned(message: ChatMessagePayload & Record<string, unknown>): void;
    emitMessageUnpinned(channelId: string, messageId: string): void;
    emitReaction(channelId: string, payload: ChatReactionPayload): void;
    emitMemberRead(payload: ChatReadPayload): void;
    private emitToChannel;
    private authenticate;
    private requireUser;
    private requireString;
    private requireJoinedChannel;
    private assertChannelMember;
    private roomName;
}
export {};
