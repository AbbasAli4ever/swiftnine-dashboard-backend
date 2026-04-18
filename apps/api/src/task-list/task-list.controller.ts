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
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
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
import { TaskListService, type TaskListData } from './task-list.service';
import { CreateTaskListDto } from './dto/create-task-list.dto';
import { UpdateTaskListDto } from './dto/update-task-list.dto';
import { ReorderTaskListsDto } from './dto/reorder-task-lists.dto';

@ApiTags('task-lists')
@ApiBearerAuth()
@Controller('projects/:projectId/lists')
@UseGuards(JwtAuthGuard, WorkspaceGuard)
@ApiHeader({ name: 'x-workspace-id', required: true, description: 'Active workspace ID' })
export class TaskListController {
  constructor(private readonly taskListService: TaskListService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new task list inside a project' })
  @ApiResponse({ status: 201, description: 'Task list created' })
  async create(
    @Req() req: WorkspaceRequest,
    @Param('projectId') projectId: string,
    @Body() dto: CreateTaskListDto,
  ): Promise<ApiRes<TaskListData>> {
    const list = await this.taskListService.create(
      req.workspaceContext.workspaceId,
      req.user.id,
      projectId,
      dto,
    );
    return ok(list, 'Task list created successfully');
  }

  @Get()
  @ApiOperation({ summary: 'Get all task lists for a project (active by default)' })
  @ApiQuery({ name: 'includeArchived', required: false, type: Boolean })
  @ApiResponse({ status: 200, description: 'Task lists returned' })
  async findAll(
    @Req() req: WorkspaceRequest,
    @Param('projectId') projectId: string,
    @Query('includeArchived') includeArchived?: string,
  ): Promise<ApiRes<TaskListData[]>> {
    const lists = await this.taskListService.findAll(
      req.workspaceContext.workspaceId,
      projectId,
      includeArchived === 'true',
    );
    return ok(lists);
  }

  @Put('reorder')
  @ApiOperation({ summary: 'Reorder task lists using drag and drop' })
  @ApiResponse({ status: 200, description: 'Task lists reordered' })
  async reorder(
    @Req() req: WorkspaceRequest,
    @Param('projectId') projectId: string,
    @Body() dto: ReorderTaskListsDto,
  ): Promise<ApiRes<TaskListData[]>> {
    const lists = await this.taskListService.reorder(
      req.workspaceContext.workspaceId,
      req.user.id,
      projectId,
      dto,
    );
    return ok(lists, 'Task lists reordered successfully');
  }

  @Patch(':listId')
  @ApiOperation({ summary: 'Rename a task list' })
  @ApiResponse({ status: 200, description: 'Task list updated' })
  @ApiResponse({ status: 404, description: 'Task list not found' })
  async update(
    @Req() req: WorkspaceRequest,
    @Param('projectId') projectId: string,
    @Param('listId') listId: string,
    @Body() dto: UpdateTaskListDto,
  ): Promise<ApiRes<TaskListData>> {
    const list = await this.taskListService.update(
      req.workspaceContext.workspaceId,
      req.user.id,
      projectId,
      listId,
      dto,
    );
    return ok(list, 'Task list updated successfully');
  }

  @Patch(':listId/archive')
  @ApiOperation({ summary: 'Archive a task list' })
  @ApiResponse({ status: 200, description: 'Task list archived' })
  @ApiResponse({ status: 404, description: 'Task list not found' })
  async archive(
    @Req() req: WorkspaceRequest,
    @Param('projectId') projectId: string,
    @Param('listId') listId: string,
  ): Promise<ApiRes<TaskListData>> {
    const list = await this.taskListService.archive(
      req.workspaceContext.workspaceId,
      req.user.id,
      projectId,
      listId,
    );
    return ok(list, 'Task list archived successfully');
  }

  @Patch(':listId/restore')
  @ApiOperation({ summary: 'Restore an archived task list' })
  @ApiResponse({ status: 200, description: 'Task list restored' })
  @ApiResponse({ status: 404, description: 'Task list not found' })
  async restore(
    @Req() req: WorkspaceRequest,
    @Param('projectId') projectId: string,
    @Param('listId') listId: string,
  ): Promise<ApiRes<TaskListData>> {
    const list = await this.taskListService.restore(
      req.workspaceContext.workspaceId,
      req.user.id,
      projectId,
      listId,
    );
    return ok(list, 'Task list restored successfully');
  }

  @Delete(':listId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a task list (soft delete)' })
  @ApiResponse({ status: 200, description: 'Task list deleted' })
  @ApiResponse({ status: 404, description: 'Task list not found' })
  async remove(
    @Req() req: WorkspaceRequest,
    @Param('projectId') projectId: string,
    @Param('listId') listId: string,
  ): Promise<ApiRes<null>> {
    await this.taskListService.remove(
      req.workspaceContext.workspaceId,
      req.user.id,
      projectId,
      listId,
    );
    return ok(null, 'Task list deleted successfully');
  }
}
