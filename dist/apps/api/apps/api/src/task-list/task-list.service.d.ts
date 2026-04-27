import { PrismaService } from "../../../../libs/database/src";
import type { Prisma } from "../../../../libs/database/src/generated/prisma/client";
import { TASK_LIST_SELECT } from './task-list.constants';
import type { CreateTaskListDto } from './dto/create-task-list.dto';
import type { UpdateTaskListDto } from './dto/update-task-list.dto';
import type { ReorderTaskListsDto } from './dto/reorder-task-lists.dto';
export type TaskListData = Prisma.TaskListGetPayload<{
    select: typeof TASK_LIST_SELECT;
}>;
export declare class TaskListService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(workspaceId: string, userId: string, projectId: string, dto: CreateTaskListDto): Promise<TaskListData>;
    findAll(workspaceId: string, projectId: string, includeArchived: boolean): Promise<TaskListData[]>;
    update(workspaceId: string, userId: string, projectId: string, listId: string, dto: UpdateTaskListDto): Promise<TaskListData>;
    remove(workspaceId: string, userId: string, projectId: string, listId: string): Promise<void>;
    reorder(workspaceId: string, userId: string, projectId: string, dto: ReorderTaskListsDto): Promise<TaskListData[]>;
    archive(workspaceId: string, userId: string, projectId: string, listId: string): Promise<TaskListData>;
    restore(workspaceId: string, userId: string, projectId: string, listId: string): Promise<TaskListData>;
    private findProjectOrThrow;
    private findListOrThrow;
    private assertUniqueName;
    private getNextPosition;
}
