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
    listByWorkspace(workspaceId: string, userId: string): Promise<({
        project: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            name: string;
            createdBy: string;
            workspaceId: string;
            description: string | null;
            color: string;
            icon: string | null;
            taskIdPrefix: string;
            taskCounter: number;
            isArchived: boolean;
        } | null;
        members: ({
            user: {
                id: string;
                fullName: string;
                avatarUrl: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            userId: string;
            role: Role;
            channelId: string;
            isMuted: boolean;
            lastReadMessageId: string | null;
            unreadCount: number;
            joinedAt: Date;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string | null;
        createdBy: string;
        workspaceId: string;
        description: string | null;
        projectId: string | null;
        kind: import("@app/database/generated/prisma/enums").ChannelKind;
        privacy: import("@app/database/generated/prisma/enums").ChannelPrivacy;
    })[]>;
    listByProject(workspaceId: string, projectId: string, userId: string): Promise<({
        project: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            name: string;
            createdBy: string;
            workspaceId: string;
            description: string | null;
            color: string;
            icon: string | null;
            taskIdPrefix: string;
            taskCounter: number;
            isArchived: boolean;
        } | null;
        members: ({
            user: {
                id: string;
                fullName: string;
                avatarUrl: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            userId: string;
            role: Role;
            channelId: string;
            isMuted: boolean;
            lastReadMessageId: string | null;
            unreadCount: number;
            joinedAt: Date;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string | null;
        createdBy: string;
        workspaceId: string;
        description: string | null;
        projectId: string | null;
        kind: import("@app/database/generated/prisma/enums").ChannelKind;
        privacy: import("@app/database/generated/prisma/enums").ChannelPrivacy;
    })[]>;
    create(workspaceId: string, userId: string, dto: CreateChannelDto): Promise<({
        project: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            name: string;
            createdBy: string;
            workspaceId: string;
            description: string | null;
            color: string;
            icon: string | null;
            taskIdPrefix: string;
            taskCounter: number;
            isArchived: boolean;
        } | null;
        members: ({
            user: {
                id: string;
                fullName: string;
                avatarUrl: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            userId: string;
            role: Role;
            channelId: string;
            isMuted: boolean;
            lastReadMessageId: string | null;
            unreadCount: number;
            joinedAt: Date;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string | null;
        createdBy: string;
        workspaceId: string;
        description: string | null;
        projectId: string | null;
        kind: import("@app/database/generated/prisma/enums").ChannelKind;
        privacy: import("@app/database/generated/prisma/enums").ChannelPrivacy;
    }) | null>;
    updateChannel(workspaceId: string, channelId: string, callerUserId: string, dto: UpdateChannelDto): Promise<{
        project: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            name: string;
            createdBy: string;
            workspaceId: string;
            description: string | null;
            color: string;
            icon: string | null;
            taskIdPrefix: string;
            taskCounter: number;
            isArchived: boolean;
        } | null;
        members: ({
            user: {
                id: string;
                fullName: string;
                avatarUrl: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            userId: string;
            role: Role;
            channelId: string;
            isMuted: boolean;
            lastReadMessageId: string | null;
            unreadCount: number;
            joinedAt: Date;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string | null;
        createdBy: string;
        workspaceId: string;
        description: string | null;
        projectId: string | null;
        kind: import("@app/database/generated/prisma/enums").ChannelKind;
        privacy: import("@app/database/generated/prisma/enums").ChannelPrivacy;
    }>;
    private mapRoleInput;
    addChannelMember(workspaceId: string, channelId: string, callerUserId: string, userId: string, roleInput: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        role: Role;
        channelId: string;
        isMuted: boolean;
        lastReadMessageId: string | null;
        unreadCount: number;
        joinedAt: Date;
    }>;
    addChannelMembersBulk(workspaceId: string, channelId: string, callerUserId: string, members: Array<{
        userId: string;
        role: string;
    }>): Promise<any[]>;
    removeChannelMember(workspaceId: string, channelId: string, callerUserId: string, channelMemberId: string): Promise<boolean>;
}
