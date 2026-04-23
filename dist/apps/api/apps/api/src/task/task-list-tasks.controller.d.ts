import { TaskService, type TaskDetailData, type TaskListItemData } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { ReorderTasksDto } from './dto/reorder-tasks.dto';
import { ListTasksQueryDto } from './dto/list-tasks-query.dto';
import type { WorkspaceRequest } from '../workspace/workspace.types';
import { type ApiResponse as ApiRes, type PaginatedApiResponse } from "../../../../libs/common/src";
export declare class TaskListTasksController {
    private readonly taskService;
    constructor(taskService: TaskService);
    create(req: WorkspaceRequest, projectId: string, listId: string, dto: CreateTaskDto): Promise<ApiRes<TaskDetailData>>;
    findAll(req: WorkspaceRequest, projectId: string, listId: string, query: ListTasksQueryDto): Promise<PaginatedApiResponse<TaskListItemData>>;
    reorder(req: WorkspaceRequest, projectId: string, listId: string, dto: ReorderTasksDto): Promise<ApiRes<TaskListItemData[]>>;
}
