import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
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
import { ProjectUnlockedGuard } from '../project-security/guards/project-unlocked.guard';
import { TaskService, type TaskDetailData, type TaskListItemData } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { ReorderTasksDto } from './dto/reorder-tasks.dto';
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
@Controller('projects/:projectId/lists/:listId/tasks')
@UseGuards(JwtAuthGuard, WorkspaceGuard, ProjectUnlockedGuard)
@ApiHeader({ name: 'x-workspace-id', required: true, description: 'Active workspace ID' })
export class TaskListTasksController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a task inside a list' })
  @ApiParam({ name: 'projectId', description: 'Project UUID' })
  @ApiParam({ name: 'listId', description: 'Task list UUID' })
  @ApiBody({
    schema: {
      example: {
        title: 'Implement login page',
        statusId: 'uuid-here',
        priority: 'HIGH',
        descriptionJson: {
          type: 'doc',
          content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Rich text description here.' }] }],
        },
        assigneeIds: [],
        tagIds: [],
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Task created with auto-incremented task ID (e.g. FH-101)' })
  @ApiResponse({ status: 401, description: 'Authentication required' })
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
  @ApiOperation({
    summary: 'Search and filter tasks in a list',
    description:
      'ClickUp-style list view query endpoint. Supports instant keyword search, stacked filters, Me Mode, subtasks-as-separate-tasks, sorting, and pagination.',
  })
  @TaskSearchSwaggerQueries()
  @ApiOkResponse({ description: 'Paginated tasks returned', type: PaginatedTasksResponseDto })
  async findAll(
    @Req() req: WorkspaceRequest,
    @Param('projectId') projectId: string,
    @Param('listId') listId: string,
    @Query() query: ListTasksQueryDto,
  ): Promise<PaginatedApiResponse<TaskListItemData>> {
    const result = await this.taskService.findTasksByList(
      req.workspaceContext.workspaceId,
      req.user.id,
      projectId,
      listId,
      query as ListTasksQuery,
    );
    return paginated(result.items, result.total, result.page, result.limit);
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
