import { PrismaService } from "../../../../libs/database/src";
export declare class FavoritesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    favoriteProject(workspaceId: string, userId: string, projectId: string): Promise<{
        isFavorite: boolean;
    }>;
    unfavoriteProject(workspaceId: string, userId: string, projectId: string): Promise<{
        isFavorite: boolean;
    }>;
    favoriteTask(workspaceId: string, userId: string, taskId: string): Promise<{
        isFavorite: boolean;
    }>;
    unfavoriteTask(workspaceId: string, userId: string, taskId: string): Promise<{
        isFavorite: boolean;
    }>;
    listProjectFavorites(workspaceId: string, userId: string, includeArchived?: boolean): Promise<any>;
    listTaskFavorites(workspaceId: string, userId: string, includeArchived?: boolean): Promise<any>;
    projectFavoriteIds(userId: string, projectIds: string[]): Promise<Set<unknown>>;
    taskFavoriteIds(userId: string, taskIds: string[]): Promise<Set<unknown>>;
    private findProjectOrThrow;
    private findActiveProjectOrThrow;
    private findTaskOrThrow;
    private findActiveTaskOrThrow;
    private toTaskListItem;
}
