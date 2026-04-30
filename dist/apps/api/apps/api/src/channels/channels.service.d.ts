import { PrismaService } from "../../../../libs/database/src";
import type { CreateChannelDto } from './dto/create-channel.dto';
export declare class ChannelsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(workspaceId: string, userId: string, dto: CreateChannelDto): Promise<({
        project: {
            description: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            workspaceId: string;
            deletedAt: Date | null;
            name: string;
            createdBy: string;
            isArchived: boolean;
            color: string;
            icon: string | null;
            taskIdPrefix: string;
            taskCounter: number;
        } | null;
        members: ({
            user: {
                id: string;
                fullName: string;
                avatarUrl: string | null;
            };
        } & {
            id: string;
            role: import("@app/database/generated/prisma/enums").Role;
            createdAt: Date;
            userId: string;
            channelId: string;
        })[];
    } & {
        description: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        workspaceId: string;
        name: string;
        createdBy: string;
        projectId: string | null;
        privacy: import("@app/database/generated/prisma/enums").ChannelPrivacy;
    }) | null>;
}
