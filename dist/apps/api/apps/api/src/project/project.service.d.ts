import { PrismaService } from '@app/database';
import type { Prisma, Role } from '@app/database/generated/prisma/client';
import type { CreateProjectDto } from './dto/create-project.dto';
import type { UpdateProjectDto } from './dto/update-project.dto';
import { PROJECT_SELECT, PROJECT_WITH_STATUSES_SELECT } from './project.constants';
export type ProjectData = Prisma.ProjectGetPayload<{
    select: typeof PROJECT_SELECT;
}>;
export type ProjectWithDetails = Prisma.ProjectGetPayload<{
    select: typeof PROJECT_WITH_STATUSES_SELECT;
}>;
export declare class ProjectService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(workspaceId: string, userId: string, dto: CreateProjectDto): Promise<ProjectWithDetails>;
    findAll(workspaceId: string): Promise<ProjectWithDetails[]>;
    findOne(workspaceId: string, projectId: string): Promise<ProjectWithDetails>;
    update(workspaceId: string, projectId: string, userId: string, dto: UpdateProjectDto): Promise<ProjectWithDetails>;
    remove(workspaceId: string, projectId: string, userId: string, role: Role): Promise<void>;
}
