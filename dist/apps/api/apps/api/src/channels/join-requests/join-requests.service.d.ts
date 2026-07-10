import { PrismaService } from "../../../../../libs/database/src";
import type { ChannelJoinRequestStatus } from "../../../../../libs/database/src/generated/prisma/client";
import { ChatSystemService } from '../../chat/chat-system.service';
import { NotificationsService } from '../../notifications/notifications.service';
export declare class JoinRequestsService {
    private readonly prisma;
    private readonly chatSystem;
    private readonly notifications;
    constructor(prisma: PrismaService, chatSystem: ChatSystemService, notifications: NotificationsService);
    private channelLabel;
    private joinRequestInclude;
    private getChannelOrThrow;
    private assertChannelAdmin;
    createRequest(workspaceId: string, channelId: string, requesterUserId: string): Promise<{
        user: {
            id: string;
            fullName: string;
            avatarUrl: string | null;
        };
        decidedBy: {
            id: string;
            fullName: string;
            avatarUrl: string | null;
        } | null;
    } & {
        id: string;
        userId: string;
        status: ChannelJoinRequestStatus;
        channelId: string;
        requestedAt: Date;
        decidedById: string | null;
        decidedAt: Date | null;
    }>;
    listRequests(workspaceId: string, channelId: string, callerUserId: string, status?: string): Promise<({
        user: {
            id: string;
            fullName: string;
            avatarUrl: string | null;
        };
        decidedBy: {
            id: string;
            fullName: string;
            avatarUrl: string | null;
        } | null;
    } & {
        id: string;
        userId: string;
        status: ChannelJoinRequestStatus;
        channelId: string;
        requestedAt: Date;
        decidedById: string | null;
        decidedAt: Date | null;
    })[]>;
    getMyRequestStatus(workspaceId: string, channelId: string, userId: string): Promise<({
        user: {
            id: string;
            fullName: string;
            avatarUrl: string | null;
        };
        decidedBy: {
            id: string;
            fullName: string;
            avatarUrl: string | null;
        } | null;
    } & {
        id: string;
        userId: string;
        status: ChannelJoinRequestStatus;
        channelId: string;
        requestedAt: Date;
        decidedById: string | null;
        decidedAt: Date | null;
    }) | null>;
    decideRequest(workspaceId: string, channelId: string, requestId: string, callerUserId: string, decision: 'approve' | 'reject'): Promise<{
        user: {
            id: string;
            fullName: string;
            avatarUrl: string | null;
        };
        decidedBy: {
            id: string;
            fullName: string;
            avatarUrl: string | null;
        } | null;
    } & {
        id: string;
        userId: string;
        status: ChannelJoinRequestStatus;
        channelId: string;
        requestedAt: Date;
        decidedById: string | null;
        decidedAt: Date | null;
    }>;
}
