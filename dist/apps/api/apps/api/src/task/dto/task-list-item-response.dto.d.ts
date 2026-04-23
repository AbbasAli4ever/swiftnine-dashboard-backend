declare const TASK_RESPONSE_PRIORITY_VALUES: readonly ["URGENT", "HIGH", "NORMAL", "LOW", "NONE"];
declare const TASK_RESPONSE_STATUS_GROUP_VALUES: readonly ["NOT_STARTED", "ACTIVE", "DONE", "CLOSED"];
type TaskResponsePriority = (typeof TASK_RESPONSE_PRIORITY_VALUES)[number];
type TaskResponseStatusGroup = (typeof TASK_RESPONSE_STATUS_GROUP_VALUES)[number];
declare class TaskUserBriefDto {
    id: string;
    fullName: string;
    avatarUrl: string | null;
    avatarColor: string;
}
declare class TaskAssigneeResponseDto {
    user: TaskUserBriefDto;
    assignedBy: string;
}
declare class TaskStatusBriefDto {
    id: string;
    name: string;
    color: string;
    group: TaskResponseStatusGroup;
}
declare class TaskTagBriefDto {
    id: string;
    name: string;
    color: string;
}
declare class TaskTagResponseDto {
    tag: TaskTagBriefDto;
}
declare class TaskProjectBriefDto {
    id: string;
    name: string;
    taskIdPrefix: string;
}
declare class TaskListBriefDto {
    id: string;
    name: string;
    project: TaskProjectBriefDto;
}
declare class TaskChildrenCountDto {
    children: number;
}
export declare class TaskListItemResponseDto {
    id: string;
    taskId: string;
    taskNumber: number;
    title: string;
    priority: TaskResponsePriority;
    startDate: Date | null;
    dueDate: Date | null;
    position: number;
    depth: number;
    isCompleted: boolean;
    completedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
    status: TaskStatusBriefDto;
    assignees: TaskAssigneeResponseDto[];
    tags: TaskTagResponseDto[];
    list: TaskListBriefDto;
    _count: TaskChildrenCountDto;
}
declare class PaginationMetaDto {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
    has_next: boolean;
    has_prev: boolean;
}
export declare class PaginatedTasksResponseDto {
    success: true;
    data: TaskListItemResponseDto[];
    meta: PaginationMetaDto;
    message: string | null;
}
export {};
