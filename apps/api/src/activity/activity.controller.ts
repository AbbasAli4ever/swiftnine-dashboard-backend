import { Controller, Get, Param, Query, Req, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiHeader,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ok, type ApiResponse as ApiRes } from '@app/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { WorkspaceGuard } from '../workspace/workspace.guard';
import type { WorkspaceRequest } from '../workspace/workspace.types';
import { ActivityService, type ActivityFeedResult } from './activity.service';
import { ListActivityDto } from './dto/list-activity.dto';
import { ActivityFeedResponseDto } from './dto/activity-feed-item.dto';

@ApiTags('activity')
@ApiBearerAuth()
@Controller()
@UseGuards(JwtAuthGuard, WorkspaceGuard)
@ApiHeader({ name: 'x-workspace-id', required: true, description: 'Active workspace ID' })
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @Get('activity')
  @ApiOperation({
    summary: 'List workspace activity feed with ClickUp-style filters',
    description:
      'Returns a newest-first activity feed scoped to the active workspace. Supports ClickUp-style activity filters, search, Me Mode, location scoping, and cursor pagination. Use this for workspace/project/list activity views and dashboard activity cards.',
  })
  @ApiQuery({
    name: 'q',
    required: false,
    description: 'Search action, entity type, changed values, field name, actor name, or actor email.',
    example: 'status',
  })
  @ApiQuery({
    name: 'cursor',
    required: false,
    description: 'Activity row ID from `nextCursor`. Returns activity older than this row.',
    example: '4650c5ff-b89e-4988-9b51-2f6a184c2eba',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Page size. Defaults to 25, max 100.',
    example: 25,
  })
  @ApiQuery({
    name: 'entityType',
    required: false,
    description: 'Filter by producing entity type.',
    enum: [
      'workspace',
      'workspace_member',
      'workspace_invite',
      'project',
      'task_list',
      'status',
      'tag',
      'task',
      'comment',
      'attachment',
      'time_entry',
      'user',
    ],
  })
  @ApiQuery({
    name: 'entityId',
    required: false,
    description: 'Filter by a specific activity entity ID.',
    example: 'd766605b-7082-4680-b817-d8e4ea5b40fd',
  })
  @ApiQuery({
    name: 'projectId',
    required: false,
    description: 'Scope feed to a project and its lists/tasks/statuses.',
    example: 'b8fdbd0c-e00d-4770-ac71-3823c9355248',
  })
  @ApiQuery({
    name: 'listId',
    required: false,
    description: 'Scope feed to a task list and its tasks.',
    example: 'd65ad8c4-f17b-493a-8c81-12206b371589',
  })
  @ApiQuery({
    name: 'taskId',
    required: false,
    description: 'Scope feed to one task. Prefer `GET /tasks/:taskId/activity` for task side panel usage.',
    example: '5efb9b46-156c-43bb-b7e4-2b4fca537aa7',
  })
  @ApiQuery({
    name: 'actorIds',
    required: false,
    description: 'Comma-separated or repeated user IDs. Example: `actorIds=id1,id2`.',
    example: '3f6c6c5e-4a8f-4f55-8f49-f6e2d15e7f24,57a817db-e109-4eca-b3bf-eec1e56df1fa',
  })
  @ApiQuery({
    name: 'actions',
    required: false,
    description: 'Comma-separated or repeated action names. Example: `actions=status_changed,tag_added`.',
    example: 'status_changed,tag_added',
  })
  @ApiQuery({
    name: 'categories',
    required: false,
    description:
      'Comma-separated ClickUp-style categories. Common values: task_creation, name, description, status, priority, start_date, due_date, completion, assignee, tags, attachments, comments, time_tracked, list_moved, subtask, archived_deleted, reorder.',
    example: 'status,assignee,attachments',
  })
  @ApiQuery({
    name: 'includeSubtasks',
    required: false,
    description: 'Include subtask activity when scoping by task/list/project. Defaults to true.',
    example: true,
  })
  @ApiQuery({
    name: 'me',
    required: false,
    description: 'Me Mode: only return activity performed by the current user.',
    example: false,
  })
  @ApiQuery({
    name: 'from',
    required: false,
    description: 'ISO datetime lower bound for activity creation time.',
    example: '2026-04-01T00:00:00.000Z',
  })
  @ApiQuery({
    name: 'to',
    required: false,
    description: 'ISO datetime upper bound for activity creation time.',
    example: '2026-04-23T23:59:59.999Z',
  })
  @ApiResponse({ status: 200, description: 'Activity feed returned', type: ActivityFeedResponseDto })
  async listWorkspaceActivity(
    @Req() req: WorkspaceRequest,
    @Query() dto: ListActivityDto,
  ): Promise<ApiRes<ActivityFeedResult>> {
    const activity = await this.activityService.listWorkspaceActivity(
      req.workspaceContext.workspaceId,
      req.user.id,
      dto,
    );
    return ok(activity);
  }

  @Get('tasks/:taskId/activity')
  @ApiOperation({
    summary: 'List the task activity timeline',
    description:
      'Returns a newest-first task timeline suitable for the ClickUp-style task side panel. Includes task activity plus related attachment/time-entry rows. Comment rows will appear through the same shape once comment CRUD is enabled.',
  })
  @ApiQuery({
    name: 'q',
    required: false,
    description: 'Search within task activity values, actions, fields, and actor names/emails.',
    example: 'due date',
  })
  @ApiQuery({
    name: 'cursor',
    required: false,
    description: 'Activity row ID from `nextCursor`. Returns activity older than this row.',
    example: '4650c5ff-b89e-4988-9b51-2f6a184c2eba',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Page size. Defaults to 25, max 100.',
    example: 25,
  })
  @ApiQuery({
    name: 'actorIds',
    required: false,
    description: 'Comma-separated or repeated user IDs.',
    example: '3f6c6c5e-4a8f-4f55-8f49-f6e2d15e7f24',
  })
  @ApiQuery({
    name: 'actions',
    required: false,
    description: 'Comma-separated or repeated action names.',
    example: 'status_changed,file_uploaded',
  })
  @ApiQuery({
    name: 'categories',
    required: false,
    description:
      'Comma-separated task activity categories: task_creation, name, description, status, priority, start_date, due_date, completion, assignee, tags, attachments, comments, time_tracked, list_moved, subtask, archived_deleted, reorder.',
    example: 'status,comments,attachments',
  })
  @ApiQuery({
    name: 'includeSubtasks',
    required: false,
    description: 'Include activity for direct subtasks. Defaults to true.',
    example: true,
  })
  @ApiQuery({
    name: 'me',
    required: false,
    description: 'Only return activity performed by the current user.',
    example: false,
  })
  @ApiQuery({
    name: 'from',
    required: false,
    description: 'ISO datetime lower bound for activity creation time.',
    example: '2026-04-01T00:00:00.000Z',
  })
  @ApiQuery({
    name: 'to',
    required: false,
    description: 'ISO datetime upper bound for activity creation time.',
    example: '2026-04-23T23:59:59.999Z',
  })
  @ApiResponse({ status: 200, description: 'Task activity feed returned', type: ActivityFeedResponseDto })
  async listTaskActivity(
    @Req() req: WorkspaceRequest,
    @Param('taskId') taskId: string,
    @Query() dto: ListActivityDto,
  ): Promise<ApiRes<ActivityFeedResult>> {
    const activity = await this.activityService.listTaskActivity(
      req.workspaceContext.workspaceId,
      taskId,
      req.user.id,
      dto,
    );
    return ok(activity);
  }
}
