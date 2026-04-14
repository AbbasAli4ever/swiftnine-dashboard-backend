import { PrismaService } from "../../../../libs/database/src";
import type { Prisma, Role } from "../../../../libs/database/src/generated/prisma/client";
import type { CreateWorkspaceDto } from './dto/create-workspace.dto';
import type { UpdateWorkspaceDto } from './dto/update-workspace.dto';
declare const WORKSPACE_SELECT: {
    id: true;
    name: true;
    logoUrl: true;
    createdBy: true;
    createdAt: true;
    updatedAt: true;
};
export type WorkspaceData = Prisma.WorkspaceGetPayload<{
    select: typeof WORKSPACE_SELECT;
}>;
export declare class WorkspaceService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(userId: string, dto: CreateWorkspaceDto): Promise<WorkspaceData>;
    findAllForUser(userId: string): Promise<WorkspaceData[]>;
    findOne(workspaceId: string, userId: string): Promise<WorkspaceData & {
        memberCount: number;
    }>;
    update(workspaceId: string, userId: string, role: Role, dto: UpdateWorkspaceDto): Promise<WorkspaceData>;
    remove(workspaceId: string, userId: string, role: Role): Promise<void>;
}
export {};
