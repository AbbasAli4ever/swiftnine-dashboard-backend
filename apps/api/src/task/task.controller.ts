import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiHeader,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { WorkspaceGuard } from '../workspace/workspace.guard';
import { TaskService, type TaskDetailData, type TaskListItemData } from './task.service';
import { UpdateTaskDto } from './dto/update-task.dto';
import { CreateSubtaskDto } from './dto/create-subtask.dto';
import { AddAssigneesDto } from './dto/add-assignees.dto';
import { AddTagToTaskDto } from './dto/add-tag-to-task.dto';
import { ListTasksQueryDto, type ListTasksQuery } from './dto/list-tasks-query.dto';
import { PaginatedTasksResponseDto } from './dto/task-list-item-response.dto';
import { TaskSearchSwaggerQueries } from './task-search.swagger';
import type { WorkspaceRequest } from '../workspace/workspace.types';
import {
  ok,
  paginated,
  type ApiResponse as ApiRes,
  type PaginatedApiResponse,
} from '@app/common';

@ApiTags('tasks')
@ApiBearerAuth()
@Controller('tasks')
@UseGuards(JwtAuthGuard, WorkspaceGuard)
@ApiHeader({ name: 'x-workspace-id', required: true, description: 'Active workspace ID' })
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  // ─── Task CRUD ─────────────────────────────────────────────────────────────

  @Get()
  @ApiOperation({
    summary: 'Search and filter tasks across the active workspace',
    description:
      'Workspace-wide ClickUp-style task search. Use this for global task search, My Tasks, dashboard task widgets, and assignee-focused task views.',
  })
  @TaskSearchSwaggerQueries()
  @ApiOkResponse({ description: 'Paginated workspace tasks returned', type: PaginatedTasksResponseDto })
  async findWorkspaceTasks(
    @Req() req: WorkspaceRequest,
    @Query() query: ListTasksQueryDto,
  ): Promise<PaginatedApiResponse<TaskListItemData>> {
    const result = await this.taskService.findTasksByWorkspace(
      req.workspaceContext.workspaceId,
      req.user.id,
      query as ListTasksQuery,
    );
    return paginated(result.items, result.total, result.page, result.limit);
  }

  @Get(':taskId')
  @ApiOperation({ summary: 'Get full task detail (assignees, tags, subtasks, time entries)' })
  @ApiParam({ name: 'taskId', description: 'Task UUID' })
  @ApiResponse({ status: 200, description: 'Task detail returned' })
  @ApiResponse({ status: 401, description: 'Authentication required' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  async findOne(
    @Req() req: WorkspaceRequest,
    @Param('taskId') taskId: string,
  ): Promise<ApiRes<TaskDetailData>> {
    const task = await this.taskService.findOne(
      req.workspaceContext.workspaceId,
      req.user.id,
      taskId,
    );
    return ok(task);
  }

  @Patch(':taskId')
  @ApiOperation({
    summary: 'Update task fields',
    description: 'Patch any combination of title, description (plain or rich JSON), status, priority, dates, or list. Only provided fields are updated.',
  })
  @ApiParam({ name: 'taskId', description: 'Task UUID' })
  @ApiBody({
    schema: {
      example: {
        title: 'Updated title',
        descriptionJson: {
          type: 'doc',
          content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Rich text content.' }] }],
        },
        priority: 'HIGH',
        statusId: 'uuid-here',
        dueDate: '2026-05-15T00:00:00.000Z',
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Task updated' })
  @ApiResponse({ status: 401, description: 'Authentication required' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  async update(
    @Req() req: WorkspaceRequest,
    @Param('taskId') taskId: string,
    @Body() dto: UpdateTaskDto,
  ): Promise<ApiRes<TaskDetailData>> {
    const task = await this.taskService.update(
      req.workspaceContext.workspaceId,
      req.user.id,
      taskId,
      dto,
    );
    return ok(task, 'Task updated successfully');
  }

  @Delete(':taskId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Soft delete a task (task creator or workspace OWNER only)' })
  @ApiParam({ name: 'taskId', description: 'Task UUID' })
  @ApiResponse({ status: 200, description: 'Task deleted' })
  @ApiResponse({ status: 401, description: 'Authentication required' })
  @ApiResponse({ status: 403, description: 'Only the task creator or workspace owner can delete' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  async remove(
    @Req() req: WorkspaceRequest,
    @Param('taskId') taskId: string,
  ): Promise<ApiRes<null>> {
    await this.taskService.remove(
      req.workspaceContext.workspaceId,
      req.user.id,
      taskId,
      req.workspaceContext.role,
    );
    return ok(null, 'Task deleted successfully');
  }

  @Patch(':taskId/complete')
  @ApiOperation({ summary: 'Mark task as completed' })
  @ApiParam({ name: 'taskId', description: 'Task UUID' })
  @ApiResponse({ status: 200, description: 'Task marked complete' })
  @ApiResponse({ status: 401, description: 'Authentication required' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  async complete(
    @Req() req: WorkspaceRequest,
    @Param('taskId') taskId: string,
  ): Promise<ApiRes<TaskDetailData>> {
    const task = await this.taskService.complete(
      req.workspaceContext.workspaceId,
      req.user.id,
      taskId,
    );
    return ok(task, 'Task marked as complete');
  }

  @Patch(':taskId/uncomplete')
  @ApiOperation({ summary: 'Mark task as incomplete' })
  @ApiParam({ name: 'taskId', description: 'Task UUID' })
  @ApiResponse({ status: 200, description: 'Task marked incomplete' })
  @ApiResponse({ status: 401, description: 'Authentication required' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  async uncomplete(
    @Req() req: WorkspaceRequest,
    @Param('taskId') taskId: string,
  ): Promise<ApiRes<TaskDetailData>> {
    const task = await this.taskService.uncomplete(
      req.workspaceContext.workspaceId,
      req.user.id,
      taskId,
    );
    return ok(task, 'Task marked as incomplete');
  }

  // ─── Subtasks ──────────────────────────────────────────────────────────────

  @Post(':taskId/subtasks')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a subtask under a task (max depth 2)' })
  @ApiParam({ name: 'taskId', description: 'Parent task UUID' })
  @ApiResponse({ status: 201, description: 'Subtask created' })
  @ApiResponse({ status: 400, description: 'Subtask nesting limit reached' })
  @ApiResponse({ status: 401, description: 'Authentication required' })
  @ApiResponse({ status: 404, description: 'Parent task not found' })
  async createSubtask(
    @Req() req: WorkspaceRequest,
    @Param('taskId') taskId: string,
    @Body() dto: CreateSubtaskDto,
  ): Promise<ApiRes<TaskDetailData>> {
    const subtask = await this.taskService.createSubtask(
      req.workspaceContext.workspaceId,
      req.user.id,
      taskId,
      dto,
    );
    return ok(subtask, 'Subtask created successfully');
  }

  @Get(':taskId/subtasks')
  @ApiOperation({ summary: 'List all subtasks of a task' })
  @ApiParam({ name: 'taskId', description: 'Parent task UUID' })
  @ApiResponse({ status: 200, description: 'Subtasks returned' })
  @ApiResponse({ status: 401, description: 'Authentication required' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  async findSubtasks(
    @Req() req: WorkspaceRequest,
    @Param('taskId') taskId: string,
  ): Promise<ApiRes<TaskListItemData[]>> {
    const subtasks = await this.taskService.findSubtasks(
      req.workspaceContext.workspaceId,
      req.user.id,
      taskId,
    );
    return ok(subtasks);
  }

  // ─── Assignees ─────────────────────────────────────────────────────────────

  @Post(':taskId/assignees')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Add assignees to a task' })
  @ApiParam({ name: 'taskId', description: 'Task UUID' })
  @ApiResponse({ status: 200, description: 'Assignees added (duplicates silently skipped)' })
  @ApiResponse({ status: 400, description: 'One or more users are not workspace members' })
  @ApiResponse({ status: 401, description: 'Authentication required' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  async addAssignees(
    @Req() req: WorkspaceRequest,
    @Param('taskId') taskId: string,
    @Body() dto: AddAssigneesDto,
  ): Promise<ApiRes<TaskDetailData>> {
    const task = await this.taskService.addAssignees(
      req.workspaceContext.workspaceId,
      req.user.id,
      taskId,
      dto,
    );
    return ok(task, 'Assignees added successfully');
  }

  @Delete(':taskId/assignees/:userId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Remove an assignee from a task' })
  @ApiParam({ name: 'taskId', description: 'Task UUID' })
  @ApiParam({ name: 'userId', description: 'User UUID to remove' })
  @ApiResponse({ status: 200, description: 'Assignee removed' })
  @ApiResponse({ status: 401, description: 'Authentication required' })
  @ApiResponse({ status: 404, description: 'Task or assignee not found' })
  async removeAssignee(
    @Req() req: WorkspaceRequest,
    @Param('taskId') taskId: string,
    @Param('userId') targetUserId: string,
  ): Promise<ApiRes<TaskDetailData>> {
    const task = await this.taskService.removeAssignee(
      req.workspaceContext.workspaceId,
      req.user.id,
      taskId,
      targetUserId,
    );
    return ok(task, 'Assignee removed successfully');
  }

  // ─── Tags ──────────────────────────────────────────────────────────────────

  @Post(':taskId/tags')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Add a tag to a task' })
  @ApiParam({ name: 'taskId', description: 'Task UUID' })
  @ApiResponse({ status: 200, description: 'Tag added' })
  @ApiResponse({ status: 401, description: 'Authentication required' })
  @ApiResponse({ status: 404, description: 'Task or tag not found' })
  @ApiResponse({ status: 409, description: 'Tag already on this task' })
  async addTag(
    @Req() req: WorkspaceRequest,
    @Param('taskId') taskId: string,
    @Body() dto: AddTagToTaskDto,
  ): Promise<ApiRes<TaskDetailData>> {
    const task = await this.taskService.addTag(
      req.workspaceContext.workspaceId,
      req.user.id,
      taskId,
      dto,
    );
    return ok(task, 'Tag added successfully');
  }

  @Delete(':taskId/tags/:tagId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Remove a tag from a task' })
  @ApiParam({ name: 'taskId', description: 'Task UUID' })
  @ApiParam({ name: 'tagId', description: 'Tag UUID' })
  @ApiResponse({ status: 200, description: 'Tag removed' })
  @ApiResponse({ status: 401, description: 'Authentication required' })
  @ApiResponse({ status: 404, description: 'Tag not on this task' })
  async removeTag(
    @Req() req: WorkspaceRequest,
    @Param('taskId') taskId: string,
    @Param('tagId') tagId: string,
  ): Promise<ApiRes<TaskDetailData>> {
    const task = await this.taskService.removeTag(
      req.workspaceContext.workspaceId,
      req.user.id,
      taskId,
      tagId,
    );
    return ok(task, 'Tag removed successfully');
  }
}
