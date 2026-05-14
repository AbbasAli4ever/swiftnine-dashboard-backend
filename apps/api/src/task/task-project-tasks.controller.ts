import { Controller, Get, Param, Query, Req, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiHeader,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import {
  paginated,
  type PaginatedApiResponse,
} from '@app/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { WorkspaceGuard } from '../workspace/workspace.guard';
import { ProjectUnlockedGuard } from '../project-security/guards/project-unlocked.guard';
import type { WorkspaceRequest } from '../workspace/workspace.types';
import { ListTasksQueryDto, type ListTasksQuery } from './dto/list-tasks-query.dto';
import { PaginatedTasksResponseDto } from './dto/task-list-item-response.dto';
import { TaskService, type TaskListItemData } from './task.service';
import { TaskSearchSwaggerQueries } from './task-search.swagger';

@ApiTags('tasks')
@ApiBearerAuth()
@Controller('projects/:projectId/tasks')
@UseGuards(JwtAuthGuard, WorkspaceGuard, ProjectUnlockedGuard)
@ApiHeader({ name: 'x-workspace-id', required: true, description: 'Active workspace ID' })
export class TaskProjectTasksController {
  constructor(private readonly taskService: TaskService) {}

  @Get()
  @ApiOperation({
    summary: 'Search and filter tasks across a project',
    description:
      'Project-scoped ClickUp-style task query endpoint. Searches across all active lists in the project and supports the same filters as list and workspace task search.',
  })
  @TaskSearchSwaggerQueries()
  @ApiOkResponse({ description: 'Paginated project tasks returned', type: PaginatedTasksResponseDto })
  async findProjectTasks(
    @Req() req: WorkspaceRequest,
    @Param('projectId') projectId: string,
    @Query() query: ListTasksQueryDto,
  ): Promise<PaginatedApiResponse<TaskListItemData>> {
    const result = await this.taskService.findTasksByProject(
      req.workspaceContext.workspaceId,
      req.user.id,
      projectId,
      query as ListTasksQuery,
    );
    return paginated(result.items, result.total, result.page, result.limit);
  }
}
