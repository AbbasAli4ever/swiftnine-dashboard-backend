import { PrismaService } from "../../../../libs/database/src";
import { ProjectSecurityService } from '../project-security/project-security.service';
export declare class FavoritesService {
    private readonly prisma;
    private readonly projectSecurity;
    constructor(prisma: PrismaService, projectSecurity: ProjectSecurityService);
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
    listProjectFavorites(workspaceId: string, userId: string, includeArchived?: boolean): Promise<({
        id: string;
        workspaceId: string;
        locked: boolean;
        isFavorite: boolean;
        favoritedAt: Date;
    } | {
        locked: boolean;
        isFavorite: boolean;
        favoritedAt: Date;
        description: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        _count: {
            taskLists: number;
        };
        name: string;
        createdBy: string;
        workspaceId: string;
        color: string;
        icon: string | null;
        taskIdPrefix: string;
        isArchived: boolean;
        passwordUpdatedAt: Date | null;
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
    })[]>;
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
        title: string;
        tags: {
            tag: {
                id: string;
                name: string;
                color: string;
            };
        }[];
        id: string;
        createdAt: Date;
        updatedAt: Date;
        _count: {
            children: number;
        };
        position: number;
        startDate: Date | null;
        priority: import("@app/database/generated/prisma/enums").Priority;
        depth: number;
        taskNumber: number;
        dueDate: Date | null;
        boardPosition: number;
        isCompleted: boolean;
        completedAt: Date | null;
        assignees: {
            user: {
                fullName: string;
                id: string;
                avatarUrl: string | null;
                avatarColor: string;
            };
            assignedBy: string;
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
