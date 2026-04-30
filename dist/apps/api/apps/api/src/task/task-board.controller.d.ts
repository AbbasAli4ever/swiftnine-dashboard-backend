import { type ApiResponse as ApiRes } from "../../../../libs/common/src";
import type { WorkspaceRequest } from '../workspace/workspace.types';
import { ListTasksQueryDto } from './dto/list-tasks-query.dto';
import { ReorderBoardTasksDto } from './dto/reorder-board-tasks.dto';
import { TaskService, type ProjectBoardData } from './task.service';
export declare class TaskBoardController {
    private readonly taskService;
    constructor(taskService: TaskService);
    getProjectBoard(req: WorkspaceRequest, projectId: string, query: ListTasksQueryDto): Promise<ApiRes<ProjectBoardData>>;
    reorderProjectBoard(req: WorkspaceRequest, projectId: string, dto: ReorderBoardTasksDto): Promise<ApiRes<ProjectBoardData>>;
}
