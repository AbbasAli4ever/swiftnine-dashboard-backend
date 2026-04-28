import { PrismaService } from "../../../../libs/database/src";
import type { CreateChannelDto } from './dto/create-channel.dto';
export declare class ChannelsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
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
            role: import("@app/database/generated/prisma/enums").Role;
            channelId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        createdBy: string;
        workspaceId: string;
        description: string | null;
        projectId: string | null;
        privacy: import("@app/database/generated/prisma/enums").ChannelPrivacy;
    }) | null>;
}
