import { Body, Controller, Get, Param, Put, Query, Req, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiHeader,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ok, type ApiResponse as ApiRes } from '@app/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { WorkspaceGuard } from '../workspace/workspace.guard';
import type { WorkspaceRequest } from '../workspace/workspace.types';
import { ListTasksQueryDto, type ListTasksQuery } from './dto/list-tasks-query.dto';
import { ProjectBoardResponseDto } from './dto/project-board-response.dto';
import { ReorderBoardTasksDto } from './dto/reorder-board-tasks.dto';
import { TaskService, type ProjectBoardData } from './task.service';
import { TaskSearchSwaggerQueries } from './task-search.swagger';

@ApiTags('tasks')
@ApiBearerAuth()
@Controller('projects/:projectId/board/tasks')
@UseGuards(JwtAuthGuard, WorkspaceGuard)
@ApiHeader({ name: 'x-workspace-id', required: true, description: 'Active workspace ID' })
export class TaskBoardController {
  constructor(private readonly taskService: TaskService) {}

  @Get()
  @ApiOperation({
    summary: 'Get project board tasks grouped by status',
    description:
      'Returns every active project status as a board column with filtered tasks from all lists in that project. Board order is derived from project list order and each task list position.',
  })
  @TaskSearchSwaggerQueries()
  @ApiOkResponse({ description: 'Project board returned', type: ProjectBoardResponseDto })
  async getProjectBoard(
    @Req() req: WorkspaceRequest,
    @Param('projectId') projectId: string,
    @Query() query: ListTasksQueryDto,
  ): Promise<ApiRes<ProjectBoardData>> {
    const board = await this.taskService.getProjectBoard(
      req.workspaceContext.workspaceId,
      req.user.id,
      projectId,
      query as ListTasksQuery,
    );
    return ok(board);
  }

  @Put('reorder')
  @ApiOperation({
    summary: 'Reorder or move a task on the project board',
    description:
      'Use this endpoint for board drag/drop. Board order is canonical list order: project list position first, then task position. If `toStatusId` differs from the task status, the task status is changed. If `toListId` is provided, the task can also move to another list. The backend rewrites affected list positions so list view and board view stay in sync.',
  })
  @ApiBody({
    type: ReorderBoardTasksDto,
    description:
      '`orderedTaskIds` must contain every active top-level task in the destination status after the move, exactly once. The order must be possible under project list order; a task cannot appear above tasks from an earlier list unless it moves to that earlier list or the lists are reordered.',
    examples: {
      moveAcrossStatuses: {
        summary: 'Move card to another status column',
        value: {
          mode: 'manual',
          taskId: 'a843cde2-f8c4-49a1-916b-308941b56f34',
          toStatusId: '9fa46c52-c13a-4088-89f8-1c321016862f',
          orderedTaskIds: [
            '11111111-1111-4111-8111-111111111111',
            'a843cde2-f8c4-49a1-916b-308941b56f34',
            '22222222-2222-4222-8222-222222222222',
          ],
        },
      },
      moveAcrossListsToo: {
        summary: 'Move card to another status and list',
        value: {
          mode: 'manual',
          taskId: 'a843cde2-f8c4-49a1-916b-308941b56f34',
          toStatusId: '9fa46c52-c13a-4088-89f8-1c321016862f',
          toListId: 'f34f824e-9d99-40ec-b8f8-a9777c7ed3d6',
          orderedTaskIds: [
            'a843cde2-f8c4-49a1-916b-308941b56f34',
            '22222222-2222-4222-8222-222222222222',
          ],
        },
      },
    },
  })
  @ApiOkResponse({ description: 'Project board reordered and returned', type: ProjectBoardResponseDto })
  @ApiResponse({ status: 400, description: 'Invalid board reorder payload or subtask drag attempted' })
  @ApiResponse({ status: 404, description: 'Task, project, status, or list not found' })
  async reorderProjectBoard(
    @Req() req: WorkspaceRequest,
    @Param('projectId') projectId: string,
    @Body() dto: ReorderBoardTasksDto,
  ): Promise<ApiRes<ProjectBoardData>> {
    const board = await this.taskService.reorderProjectBoard(
      req.workspaceContext.workspaceId,
      req.user.id,
      projectId,
      dto,
    );
    return ok(board, 'Project board reordered successfully');
  }
}
