import { PrismaService } from "../../../../libs/database/src";
import type { CreateChannelDto } from './dto/create-channel.dto';
import type { UpdateChannelDto } from './dto/update-channel.dto';
import { NotificationsService } from '../notifications/notifications.service';
import type { Role } from "../../../../libs/database/src/generated/prisma/client";
import { ChatSystemService } from '../chat/chat-system.service';
export declare class ChannelsService {
    private readonly prisma;
    private readonly notifications;
    private readonly chatSystem;
    constructor(prisma: PrismaService, notifications: NotificationsService, chatSystem: ChatSystemService);
    private channelLabel;
    private channelInclude;
    private mapChannel;
    listByWorkspace(workspaceId: string, userId: string): Promise<any[]>;
    listByProject(workspaceId: string, projectId: string, userId: string): Promise<any[]>;
    create(workspaceId: string, userId: string, dto: CreateChannelDto): Promise<any>;
    updateChannel(workspaceId: string, channelId: string, callerUserId: string, dto: UpdateChannelDto): Promise<any>;
    private mapRoleInput;
    addChannelMember(workspaceId: string, channelId: string, callerUserId: string, userId: string, roleInput: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        role: Role;
        isMuted: boolean;
        lastReadMessageId: string | null;
        unreadCount: number;
        joinedAt: Date;
        channelId: string;
    }>;
    addChannelMembersBulk(workspaceId: string, channelId: string, callerUserId: string, members: Array<{
        userId: string;
        role: string;
    }>): Promise<any[]>;
    removeChannelMember(workspaceId: string, channelId: string, callerUserId: string, channelMemberId: string): Promise<boolean>;
}
