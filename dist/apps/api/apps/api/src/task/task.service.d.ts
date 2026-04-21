import { PrismaService } from "../../../../libs/database/src";
import type { Prisma, Role } from "../../../../libs/database/src/generated/prisma/client";
import { TASK_DETAIL_SELECT, TASK_LIST_ITEM_SELECT } from './task.constants';
import type { CreateTaskDto } from './dto/create-task.dto';
import type { UpdateTaskDto } from './dto/update-task.dto';
import type { CreateSubtaskDto } from './dto/create-subtask.dto';
import type { AddAssigneesDto } from './dto/add-assignees.dto';
import type { AddTagToTaskDto } from './dto/add-tag-to-task.dto';
import type { ReorderTasksDto } from './dto/reorder-tasks.dto';
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
export declare class TaskService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(workspaceId: string, userId: string, projectId: string, listId: string, dto: CreateTaskDto): Promise<TaskDetailData>;
    findAllByList(workspaceId: string, projectId: string, listId: string): Promise<TaskListItemData[]>;
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
    private findListOrThrow;
    private findStatusOrThrow;
    private findTaskMinimalOrThrow;
    private assertUsersAreMembers;
    private assertTagsInWorkspace;
    private getNextPosition;
    private getNextSubtaskPosition;
    private toDetail;
    private toListItem;
}
export {};
