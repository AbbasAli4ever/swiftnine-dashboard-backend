import { PrismaService } from "../../../../libs/database/src";
import type { Prisma, Role } from "../../../../libs/database/src/generated/prisma/client";
import type { CreateProjectDto } from './dto/create-project.dto';
import type { UpdateProjectDto } from './dto/update-project.dto';
import { PROJECT_SELECT, PROJECT_WITH_STATUSES_SELECT } from './project.constants';
import { FavoritesService } from '../favorites/favorites.service';
export type ProjectData = Prisma.ProjectGetPayload<{
    select: typeof PROJECT_SELECT;
}>;
type RawProjectWithDetails = Prisma.ProjectGetPayload<{
    select: typeof PROJECT_WITH_STATUSES_SELECT;
}>;
export type ProjectWithDetails = RawProjectWithDetails & {
    isFavorite: boolean;
};
export declare class ProjectService {
    private readonly prisma;
    private readonly favorites?;
    constructor(prisma: PrismaService, favorites?: FavoritesService | undefined);
    create(workspaceId: string, userId: string, dto: CreateProjectDto): Promise<ProjectWithDetails>;
    findAll(workspaceId: string, userId: string, includeArchived?: boolean): Promise<ProjectWithDetails[]>;
    findArchived(workspaceId: string, userId: string): Promise<ProjectWithDetails[]>;
    findOne(workspaceId: string, userId: string, projectId: string): Promise<ProjectWithDetails>;
    update(workspaceId: string, projectId: string, userId: string, dto: UpdateProjectDto): Promise<ProjectWithDetails>;
    archive(workspaceId: string, projectId: string, userId: string, role: Role): Promise<ProjectWithDetails>;
    restore(workspaceId: string, projectId: string, userId: string, role: Role): Promise<ProjectWithDetails>;
    remove(workspaceId: string, projectId: string, userId: string, role: Role): Promise<void>;
    private assertCanArchive;
    private withFavoriteState;
}
export {};
