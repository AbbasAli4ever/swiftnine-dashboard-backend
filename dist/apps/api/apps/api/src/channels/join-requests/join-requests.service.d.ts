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
            fullName: string;
            id: string;
            avatarUrl: string | null;
        };
        decidedBy: {
            fullName: string;
            id: string;
            avatarUrl: string | null;
        } | null;
    } & {
        status: ChannelJoinRequestStatus;
        id: string;
        userId: string;
        channelId: string;
        requestedAt: Date;
        decidedAt: Date | null;
        decidedById: string | null;
    }>;
    listRequests(workspaceId: string, channelId: string, callerUserId: string, status?: string): Promise<({
        user: {
            fullName: string;
            id: string;
            avatarUrl: string | null;
        };
        decidedBy: {
            fullName: string;
            id: string;
            avatarUrl: string | null;
        } | null;
    } & {
        status: ChannelJoinRequestStatus;
        id: string;
        userId: string;
        channelId: string;
        requestedAt: Date;
        decidedAt: Date | null;
        decidedById: string | null;
    })[]>;
    getMyRequestStatus(workspaceId: string, channelId: string, userId: string): Promise<({
        user: {
            fullName: string;
            id: string;
            avatarUrl: string | null;
        };
        decidedBy: {
            fullName: string;
            id: string;
            avatarUrl: string | null;
        } | null;
    } & {
        status: ChannelJoinRequestStatus;
        id: string;
        userId: string;
        channelId: string;
        requestedAt: Date;
        decidedAt: Date | null;
        decidedById: string | null;
    }) | null>;
    decideRequest(workspaceId: string, channelId: string, requestId: string, callerUserId: string, decision: 'approve' | 'reject'): Promise<{
        user: {
            fullName: string;
            id: string;
            avatarUrl: string | null;
        };
        decidedBy: {
            fullName: string;
            id: string;
            avatarUrl: string | null;
        } | null;
    } & {
        status: ChannelJoinRequestStatus;
        id: string;
        userId: string;
        channelId: string;
        requestedAt: Date;
        decidedAt: Date | null;
        decidedById: string | null;
    }>;
}
