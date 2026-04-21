import { TaskService, type TaskDetailData, type TaskListItemData } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { ReorderTasksDto } from './dto/reorder-tasks.dto';
import type { WorkspaceRequest } from '../workspace/workspace.types';
import { type ApiResponse as ApiRes } from "../../../../libs/common/src";
export declare class TaskListTasksController {
    private readonly taskService;
    constructor(taskService: TaskService);
    create(req: WorkspaceRequest, projectId: string, listId: string, dto: CreateTaskDto): Promise<ApiRes<TaskDetailData>>;
    findAll(req: WorkspaceRequest, projectId: string, listId: string): Promise<ApiRes<TaskListItemData[]>>;
    reorder(req: WorkspaceRequest, projectId: string, listId: string, dto: ReorderTasksDto): Promise<ApiRes<TaskListItemData[]>>;
}
