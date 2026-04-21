import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
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
import { CreateTaskDto } from './dto/create-task.dto';
import { ReorderTasksDto } from './dto/reorder-tasks.dto';
import type { WorkspaceRequest } from '../workspace/workspace.types';
import { ok, type ApiResponse as ApiRes } from '@app/common';

@ApiTags('tasks')
@ApiBearerAuth()
@Controller('projects/:projectId/lists/:listId/tasks')
@UseGuards(JwtAuthGuard, WorkspaceGuard)
@ApiHeader({ name: 'x-workspace-id', required: true, description: 'Active workspace ID' })
export class TaskListTasksController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a task inside a list' })
  @ApiResponse({ status: 201, description: 'Task created with auto-incremented task ID (e.g. FH-101)' })
  @ApiResponse({ status: 404, description: 'Project, list, or status not found' })
  async create(
    @Req() req: WorkspaceRequest,
    @Param('projectId') projectId: string,
    @Param('listId') listId: string,
    @Body() dto: CreateTaskDto,
  ): Promise<ApiRes<TaskDetailData>> {
    const task = await this.taskService.create(
      req.workspaceContext.workspaceId,
      req.user.id,
      projectId,
      listId,
      dto,
    );
    return ok(task, 'Task created successfully');
  }

  @Get()
  @ApiOperation({ summary: 'List all top-level tasks in a list (excludes subtasks)' })
  @ApiResponse({ status: 200, description: 'Tasks returned ordered by position' })
  async findAll(
    @Req() req: WorkspaceRequest,
    @Param('projectId') projectId: string,
    @Param('listId') listId: string,
  ): Promise<ApiRes<TaskListItemData[]>> {
    const tasks = await this.taskService.findAllByList(
      req.workspaceContext.workspaceId,
      projectId,
      listId,
    );
    return ok(tasks);
  }

  @Put('reorder')
  @ApiOperation({ summary: 'Reorder tasks in a list via drag and drop' })
  @ApiResponse({ status: 200, description: 'Tasks reordered' })
  @ApiResponse({ status: 400, description: 'Payload must include every active task exactly once' })
  async reorder(
    @Req() req: WorkspaceRequest,
    @Param('projectId') projectId: string,
    @Param('listId') listId: string,
    @Body() dto: ReorderTasksDto,
  ): Promise<ApiRes<TaskListItemData[]>> {
    const tasks = await this.taskService.reorder(
      req.workspaceContext.workspaceId,
      req.user.id,
      projectId,
      listId,
      dto,
    );
    return ok(tasks, 'Tasks reordered successfully');
  }
}
