import { PrismaService } from "../../../../libs/database/src";
import type { Priority, StatusGroup } from "../../../../libs/database/src/generated/prisma/client";
export type ProjectDashboardData = {
    project: {
        id: string;
        name: string;
        color: string;
        icon: string | null;
    };
    statusSummary: Array<{
        statusId: string;
        name: string;
        color: string;
        group: StatusGroup;
        position: number;
        count: number;
    }>;
    lists: Array<{
        id: string;
        name: string;
        position: number;
        startDate: string | null;
        endDate: string | null;
        ownerUserId: string | null;
        priority: Priority | null;
        owner: {
            id: string;
            fullName: string;
            avatarUrl: string | null;
            avatarColor: string;
        } | null;
        taskCount: number;
        completedCount: number;
        openCount: number;
    }>;
    attachments: Array<{
        id: string;
        taskId: string;
        taskKey: string;
        taskTitle: string;
        listId: string;
        listName: string;
        fileName: string;
        mimeType: string;
        fileSize: number;
        createdAt: Date;
        uploadedBy: {
            id: string;
            fullName: string;
            avatarUrl: string | null;
            avatarColor: string;
        };
    }>;
    docs: Record<string, never>[];
};
export declare class DashboardService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getProjectDashboard(workspaceId: string, projectId: string): Promise<ProjectDashboardData>;
    private buildStatusSummary;
    private buildListSummary;
    private buildAttachments;
    private formatDateOnly;
    private findProjectOrThrow;
}
