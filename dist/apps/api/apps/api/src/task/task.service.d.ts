import { PrismaService } from "../../../../libs/database/src";
import type { Prisma, Role } from "../../../../libs/database/src/generated/prisma/client";
import { TASK_DETAIL_SELECT, TASK_LIST_ITEM_SELECT } from './task.constants';
import type { CreateTaskDto } from './dto/create-task.dto';
import type { UpdateTaskDto } from './dto/update-task.dto';
import type { CreateSubtaskDto } from './dto/create-subtask.dto';
import type { AddAssigneesDto } from './dto/add-assignees.dto';
import type { AddTagToTaskDto } from './dto/add-tag-to-task.dto';
import type { ReorderTasksDto } from './dto/reorder-tasks.dto';
import type { ListTasksQuery } from './dto/list-tasks-query.dto';
import type { ReorderBoardTasksDto } from './dto/reorder-board-tasks.dto';
import { ActivityService } from '../activity/activity.service';
import { NotificationsService } from '../notifications/notifications.service';
type RawTaskDetail = Prisma.TaskGetPayload<{
    select: typeof TASK_DETAIL_SELECT;
}>;
type RawTaskListItem = Prisma.TaskGetPayload<{
    select: typeof TASK_LIST_ITEM_SELECT;
}>;
export type TaskDetailData = RawTaskDetail & {
    taskId: string;
    totalTimeLogged: number;
};
export type TaskListItemData = RawTaskListItem & {
    taskId: string;
};
export type ProjectBoardColumnData = {
    status: {
        id: string;
        name: string;
        color: string;
        group: string;
        position: number;
        isDefault: boolean;
        isProtected: boolean;
        isClosed: boolean;
    };
    tasks: TaskListItemData[];
    total: number;
};
export type ProjectBoardData = {
    groupBy: 'status';
    projectId: string;
    columns: ProjectBoardColumnData[];
    total: number;
};
export type TaskSearchResult = {
    items: TaskListItemData[];
    total: number;
    page: number;
    limit: number;
};
export declare class TaskService {
    private readonly prisma;
    private readonly activity;
    private readonly notifications;
    constructor(prisma: PrismaService, activity: ActivityService, notifications: NotificationsService);
    create(workspaceId: string, userId: string, projectId: string, listId: string, dto: CreateTaskDto): Promise<TaskDetailData>;
    findAllByList(workspaceId: string, projectId: string, listId: string): Promise<TaskListItemData[]>;
    findTasksByList(workspaceId: string, userId: string, projectId: string, listId: string, query: ListTasksQuery): Promise<TaskSearchResult>;
    findTasksByProject(workspaceId: string, userId: string, projectId: string, query: ListTasksQuery): Promise<TaskSearchResult>;
    findTasksByWorkspace(workspaceId: string, userId: string, query: ListTasksQuery): Promise<TaskSearchResult>;
    getProjectBoard(workspaceId: string, userId: string, projectId: string, query: ListTasksQuery): Promise<ProjectBoardData>;
    findOne(workspaceId: string, taskId: string): Promise<TaskDetailData>;
    update(workspaceId: string, userId: string, taskId: string, dto: UpdateTaskDto): Promise<TaskDetailData>;
    remove(workspaceId: string, userId: string, taskId: string, role: Role): Promise<void>;
    complete(workspaceId: string, userId: string, taskId: string): Promise<TaskDetailData>;
    uncomplete(workspaceId: string, userId: string, taskId: string): Promise<TaskDetailData>;
    createSubtask(workspaceId: string, userId: string, parentTaskId: string, dto: CreateSubtaskDto): Promise<TaskDetailData>;
    findSubtasks(workspaceId: string, parentTaskId: string): Promise<TaskListItemData[]>;
    addAssignees(workspaceId: string, userId: string, taskId: string, dto: AddAssigneesDto): Promise<TaskDetailData>;
    removeAssignee(workspaceId: string, userId: string, taskId: string, targetUserId: string): Promise<TaskDetailData>;
    addTag(workspaceId: string, userId: string, taskId: string, dto: AddTagToTaskDto): Promise<TaskDetailData>;
    removeTag(workspaceId: string, userId: string, taskId: string, tagId: string): Promise<TaskDetailData>;
    reorder(workspaceId: string, userId: string, projectId: string, listId: string, dto: ReorderTasksDto): Promise<TaskListItemData[]>;
    reorderProjectBoard(workspaceId: string, userId: string, projectId: string, dto: ReorderBoardTasksDto): Promise<ProjectBoardData>;
    private searchTasks;
    private buildTaskSearchWhere;
    private buildTaskSearchOrderBy;
    private buildDueDateFilter;
    private buildAssigneeFilter;
    private buildTagFilter;
    private pushDateRangeFilter;
    private getDueDatePresetRange;
    private parseDateBoundary;
    private startOfUtcDay;
    private startOfUtcWeek;
    private addUtcDays;
    private extractTaskNumber;
    private findListOrThrow;
    private findListForProjectOrThrow;
    private findProjectOrThrow;
    private findStatusOrThrow;
    private findTaskMinimalOrThrow;
    private dateString;
    private assertUsersAreMembers;
    private assertTagsInWorkspace;
    private getNextPosition;
    private getNextBoardPosition;
    private getNextSubtaskPosition;
    private toDetail;
    private toListItem;
    private defaultBoardQuery;
    private syncListsFromBoardOrder;
}
export {};
