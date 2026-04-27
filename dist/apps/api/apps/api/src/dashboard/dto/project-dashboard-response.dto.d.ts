declare class DashboardProjectDto {
    id: string;
    name: string;
    color: string;
    icon: string | null;
}
declare class DashboardStatusSummaryDto {
    statusId: string;
    name: string;
    color: string;
    group: 'NOT_STARTED' | 'ACTIVE' | 'DONE' | 'CLOSED';
    position: number;
    count: number;
}
declare class DashboardListSummaryDto {
    id: string;
    name: string;
    position: number;
    startDate: string | null;
    endDate: string | null;
    ownerUserId: string | null;
    priority: 'URGENT' | 'HIGH' | 'NORMAL' | 'LOW' | 'NONE' | null;
    owner: {
        id: string;
        fullName: string;
        avatarUrl: string | null;
        avatarColor: string;
    } | null;
    taskCount: number;
    completedCount: number;
    openCount: number;
}
declare class DashboardAttachmentUploaderDto {
    id: string;
    fullName: string;
    avatarUrl: string | null;
    avatarColor: string;
}
declare class DashboardAttachmentDto {
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
    uploadedBy: DashboardAttachmentUploaderDto;
}
export declare class ProjectDashboardDto {
    project: DashboardProjectDto;
    statusSummary: DashboardStatusSummaryDto[];
    lists: DashboardListSummaryDto[];
    attachments: DashboardAttachmentDto[];
    docs: Record<string, never>[];
}
export declare class ProjectDashboardResponseDto {
    success: true;
    data: ProjectDashboardDto;
    message: string | null;
}
export {};
