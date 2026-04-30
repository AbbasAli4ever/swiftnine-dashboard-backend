import { type PaginatedApiResponse } from '@app/common';
import type { WorkspaceRequest } from '../workspace/workspace.types';
import { ListTasksQueryDto } from './dto/list-tasks-query.dto';
import { TaskService, type TaskListItemData } from './task.service';
export declare class TaskProjectTasksController {
    private readonly taskService;
    constructor(taskService: TaskService);
    findProjectTasks(req: WorkspaceRequest, projectId: string, query: ListTasksQueryDto): Promise<PaginatedApiResponse<TaskListItemData>>;
}
