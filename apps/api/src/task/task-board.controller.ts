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
import { ProjectUnlockedGuard } from '../project-security/guards/project-unlocked.guard';
import type { WorkspaceRequest } from '../workspace/workspace.types';
import { ListTasksQueryDto, type ListTasksQuery } from './dto/list-tasks-query.dto';
import { ProjectBoardResponseDto } from './dto/project-board-response.dto';
import { ReorderBoardTasksDto } from './dto/reorder-board-tasks.dto';
import { TaskService, type ProjectBoardData } from './task.service';
import { TaskSearchSwaggerQueries } from './task-search.swagger';

@ApiTags('tasks')
@ApiBearerAuth()
@Controller('projects/:projectId/board/tasks')
@UseGuards(JwtAuthGuard, WorkspaceGuard, ProjectUnlockedGuard)
@ApiHeader({ name: 'x-workspace-id', required: true, description: 'Active workspace ID' })
export class TaskBoardController {
  constructor(private readonly taskService: TaskService) {}

  @Get()
  @ApiOperation({
    summary: 'Get project board tasks grouped by status',
    description:
      'Returns every active project status as a board column with filtered tasks from all lists in that project. Cards inside each column are ordered by the task `boardPosition` value.',
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
      'Use this endpoint for board drag/drop. Board order is independent from list order and is stored per status column. If `toStatusId` differs from the task status, the task status is changed. If `toListId` is provided, the task can also move to another list. After the board order is updated, the backend also rewrites `position` values inside affected lists so list view stays aligned with the relative board order for each list.',
  })
  @ApiBody({
    type: ReorderBoardTasksDto,
    description:
      '`orderedTaskIds` must contain every active top-level task in the destination status after the move, exactly once. This is the full destination column order after drag/drop, not only the visible cards the user touched.',
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
