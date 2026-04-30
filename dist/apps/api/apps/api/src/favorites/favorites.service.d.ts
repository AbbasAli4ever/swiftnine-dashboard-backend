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
    listProjectFavorites(workspaceId: string, userId: string, includeArchived?: boolean): Promise<{
        isFavorite: boolean;
        favoritedAt: Date;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        createdBy: string;
        workspaceId: string;
        description: string | null;
        color: string;
        icon: string | null;
        taskIdPrefix: string;
        isArchived: boolean;
        _count: {
            taskLists: number;
        };
        statuses: {
            id: string;
            name: string;
            color: string;
            position: number;
            group: import("@app/database/generated/prisma/enums").StatusGroup;
            isDefault: boolean;
            isProtected: boolean;
            isClosed: boolean;
        }[];
    }[]>;
    listTaskFavorites(workspaceId: string, userId: string, includeArchived?: boolean): Promise<{
        isFavorite: boolean;
        favoritedAt: Date;
        taskId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: {
            id: string;
            name: string;
            color: string;
            group: import("@app/database/generated/prisma/enums").StatusGroup;
        };
        position: number;
        startDate: Date | null;
        priority: import("@app/database/generated/prisma/enums").Priority;
        depth: number;
        title: string;
        taskNumber: number;
        dueDate: Date | null;
        boardPosition: number;
        isCompleted: boolean;
        completedAt: Date | null;
        list: {
            id: string;
            name: string;
            project: {
                id: string;
                name: string;
                taskIdPrefix: string;
            };
        };
        assignees: {
            assignedBy: string;
            user: {
                id: string;
                fullName: string;
                avatarUrl: string | null;
                avatarColor: string;
            };
        }[];
        tags: {
            tag: {
                id: string;
                name: string;
                color: string;
            };
        }[];
        _count: {
            children: number;
        };
    }[]>;
    projectFavoriteIds(userId: string, projectIds: string[]): Promise<Set<string>>;
    taskFavoriteIds(userId: string, taskIds: string[]): Promise<Set<string>>;
    private findProjectOrThrow;
    private findActiveProjectOrThrow;
    private findTaskOrThrow;
    private findActiveTaskOrThrow;
    private toTaskListItem;
}
