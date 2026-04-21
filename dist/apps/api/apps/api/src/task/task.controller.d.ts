import { TaskService, type TaskDetailData, type TaskListItemData } from './task.service';
import { UpdateTaskDto } from './dto/update-task.dto';
import { CreateSubtaskDto } from './dto/create-subtask.dto';
import { AddAssigneesDto } from './dto/add-assignees.dto';
import { AddTagToTaskDto } from './dto/add-tag-to-task.dto';
import type { WorkspaceRequest } from '../workspace/workspace.types';
import { type ApiResponse as ApiRes } from "../../../../libs/common/src";
export declare class TaskController {
    private readonly taskService;
    constructor(taskService: TaskService);
    findOne(req: WorkspaceRequest, taskId: string): Promise<ApiRes<TaskDetailData>>;
    update(req: WorkspaceRequest, taskId: string, dto: UpdateTaskDto): Promise<ApiRes<TaskDetailData>>;
    remove(req: WorkspaceRequest, taskId: string): Promise<ApiRes<null>>;
    complete(req: WorkspaceRequest, taskId: string): Promise<ApiRes<TaskDetailData>>;
    uncomplete(req: WorkspaceRequest, taskId: string): Promise<ApiRes<TaskDetailData>>;
    createSubtask(req: WorkspaceRequest, taskId: string, dto: CreateSubtaskDto): Promise<ApiRes<TaskDetailData>>;
    findSubtasks(req: WorkspaceRequest, taskId: string): Promise<ApiRes<TaskListItemData[]>>;
    addAssignees(req: WorkspaceRequest, taskId: string, dto: AddAssigneesDto): Promise<ApiRes<TaskDetailData>>;
    removeAssignee(req: WorkspaceRequest, taskId: string, targetUserId: string): Promise<ApiRes<TaskDetailData>>;
    addTag(req: WorkspaceRequest, taskId: string, dto: AddTagToTaskDto): Promise<ApiRes<TaskDetailData>>;
    removeTag(req: WorkspaceRequest, taskId: string, tagId: string): Promise<ApiRes<TaskDetailData>>;
}
