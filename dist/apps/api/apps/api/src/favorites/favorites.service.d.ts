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
        name: string;
        isArchived: boolean;
        createdBy: string;
        createdAt: Date;
        updatedAt: Date;
        _count: {
            taskLists: number;
        };
        workspaceId: string;
        description: string | null;
        color: string;
        icon: string | null;
        taskIdPrefix: string;
        statuses: {
            id: string;
            name: string;
            position: number;
            color: string;
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
        status: {
            id: string;
            name: string;
            color: string;
            group: import("@app/database/generated/prisma/enums").StatusGroup;
        };
        list: {
            project: {
                id: string;
                name: string;
                taskIdPrefix: string;
            };
            id: string;
            name: string;
        };
        id: string;
        position: number;
        startDate: Date | null;
        priority: import("@app/database/generated/prisma/enums").Priority;
        createdAt: Date;
        updatedAt: Date;
        _count: {
            children: number;
        };
        depth: number;
        title: string;
        taskNumber: number;
        dueDate: Date | null;
        boardPosition: number;
        isCompleted: boolean;
        completedAt: Date | null;
        assignees: {
            user: {
                id: string;
                fullName: string;
                avatarUrl: string | null;
                avatarColor: string;
            };
            assignedBy: string;
        }[];
        tags: {
            tag: {
                id: string;
                name: string;
                color: string;
            };
        }[];
    }[]>;
    projectFavoriteIds(userId: string, projectIds: string[]): Promise<Set<string>>;
    taskFavoriteIds(userId: string, taskIds: string[]): Promise<Set<string>>;
    private findProjectOrThrow;
    private findActiveProjectOrThrow;
    private findTaskOrThrow;
    private findActiveTaskOrThrow;
    private toTaskListItem;
}
