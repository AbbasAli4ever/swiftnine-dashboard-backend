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
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiHeader,
  ApiOperation,
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
import type { WorkspaceRequest } from '../workspace/workspace.types';
import { ok, type ApiResponse as ApiRes } from '@app/common';

@ApiTags('tasks')
@ApiBearerAuth()
@Controller('tasks')
@UseGuards(JwtAuthGuard, WorkspaceGuard)
@ApiHeader({ name: 'x-workspace-id', required: true, description: 'Active workspace ID' })
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  // ─── Task CRUD ─────────────────────────────────────────────────────────────

  @Get(':taskId')
  @ApiOperation({ summary: 'Get full task detail (assignees, tags, subtasks, time entries)' })
  @ApiResponse({ status: 200, description: 'Task detail returned' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  async findOne(
    @Req() req: WorkspaceRequest,
    @Param('taskId') taskId: string,
  ): Promise<ApiRes<TaskDetailData>> {
    const task = await this.taskService.findOne(req.workspaceContext.workspaceId, taskId);
    return ok(task);
  }

  @Patch(':taskId')
  @ApiOperation({ summary: 'Update task fields (title, status, priority, dates, or move to another list)' })
  @ApiResponse({ status: 200, description: 'Task updated' })
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
  @ApiResponse({ status: 200, description: 'Task deleted' })
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
  @ApiResponse({ status: 200, description: 'Task marked complete' })
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
  @ApiResponse({ status: 200, description: 'Task marked incomplete' })
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
  @ApiResponse({ status: 201, description: 'Subtask created' })
  @ApiResponse({ status: 400, description: 'Subtask nesting limit reached' })
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
  @ApiResponse({ status: 200, description: 'Subtasks returned' })
  async findSubtasks(
    @Req() req: WorkspaceRequest,
    @Param('taskId') taskId: string,
  ): Promise<ApiRes<TaskListItemData[]>> {
    const subtasks = await this.taskService.findSubtasks(
      req.workspaceContext.workspaceId,
      taskId,
    );
    return ok(subtasks);
  }

  // ─── Assignees ─────────────────────────────────────────────────────────────

  @Post(':taskId/assignees')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Add assignees to a task' })
  @ApiResponse({ status: 200, description: 'Assignees added (duplicates silently skipped)' })
  @ApiResponse({ status: 400, description: 'One or more users are not workspace members' })
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
  @ApiResponse({ status: 200, description: 'Assignee removed' })
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
  @ApiResponse({ status: 200, description: 'Tag added' })
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
  @ApiResponse({ status: 200, description: 'Tag removed' })
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
