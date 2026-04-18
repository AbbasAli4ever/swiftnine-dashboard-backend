import { type ApiResponse as ApiRes } from "../../../../libs/common/src";
import type { WorkspaceRequest } from '../workspace/workspace.types';
import { TaskListService, type TaskListData } from './task-list.service';
import { CreateTaskListDto } from './dto/create-task-list.dto';
import { UpdateTaskListDto } from './dto/update-task-list.dto';
import { ReorderTaskListsDto } from './dto/reorder-task-lists.dto';
export declare class TaskListController {
    private readonly taskListService;
    constructor(taskListService: TaskListService);
    create(req: WorkspaceRequest, projectId: string, dto: CreateTaskListDto): Promise<ApiRes<TaskListData>>;
    findAll(req: WorkspaceRequest, projectId: string, includeArchived?: string): Promise<ApiRes<TaskListData[]>>;
    reorder(req: WorkspaceRequest, projectId: string, dto: ReorderTaskListsDto): Promise<ApiRes<TaskListData[]>>;
    update(req: WorkspaceRequest, projectId: string, listId: string, dto: UpdateTaskListDto): Promise<ApiRes<TaskListData>>;
    archive(req: WorkspaceRequest, projectId: string, listId: string): Promise<ApiRes<TaskListData>>;
    restore(req: WorkspaceRequest, projectId: string, listId: string): Promise<ApiRes<TaskListData>>;
    remove(req: WorkspaceRequest, projectId: string, listId: string): Promise<ApiRes<null>>;
}
