import { Controller, Delete, Get, Param, Put, Query, Req, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiHeader,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ok, type ApiResponse as ApiRes } from '@app/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { WorkspaceGuard } from '../workspace/workspace.guard';
import type { WorkspaceRequest } from '../workspace/workspace.types';
import { FavoritesService } from './favorites.service';

@ApiTags('favorites')
@ApiBearerAuth()
@Controller()
@UseGuards(JwtAuthGuard, WorkspaceGuard)
@ApiHeader({ name: 'x-workspace-id', required: true, description: 'Active workspace ID' })
export class FavoritesController {
  constructor(private readonly favorites: FavoritesService) {}

  @Get('favorites/projects')
  @ApiOperation({ summary: 'List favorite projects for the current user' })
  @ApiQuery({ name: 'includeArchived', required: false, type: Boolean })
  @ApiResponse({ status: 200, description: 'Favorite projects returned' })
  @ApiResponse({ status: 401, description: 'Authentication required' })
  async listFavoriteProjects(
    @Req() req: WorkspaceRequest,
    @Query('includeArchived') includeArchived?: string,
  ): Promise<ApiRes<unknown[]>> {
    const projects = await this.favorites.listProjectFavorites(
      req.workspaceContext.workspaceId,
      req.user.id,
      includeArchived === 'true',
    );
    return ok(projects);
  }

  @Get('favorites/tasks')
  @ApiOperation({ summary: 'List favorite tasks for the current user' })
  @ApiQuery({ name: 'includeArchived', required: false, type: Boolean })
  @ApiResponse({ status: 200, description: 'Favorite tasks returned' })
  @ApiResponse({ status: 401, description: 'Authentication required' })
  async listFavoriteTasks(
    @Req() req: WorkspaceRequest,
    @Query('includeArchived') includeArchived?: string,
  ): Promise<ApiRes<unknown[]>> {
    const tasks = await this.favorites.listTaskFavorites(
      req.workspaceContext.workspaceId,
      req.user.id,
      includeArchived === 'true',
    );
    return ok(tasks);
  }

  @Put('projects/:projectId/favorite')
  @ApiOperation({ summary: 'Mark a project as favorite for the current user' })
  @ApiParam({ name: 'projectId', description: 'Project UUID' })
  @ApiResponse({ status: 200, description: 'Project favorited' })
  @ApiResponse({ status: 401, description: 'Authentication required' })
  @ApiResponse({ status: 404, description: 'Project not found' })
  async favoriteProject(
    @Req() req: WorkspaceRequest,
    @Param('projectId') projectId: string,
  ): Promise<ApiRes<{ isFavorite: boolean }>> {
    const result = await this.favorites.favoriteProject(
      req.workspaceContext.workspaceId,
      req.user.id,
      projectId,
    );
    return ok(result, 'Project favorited successfully');
  }

  @Delete('projects/:projectId/favorite')
  @ApiOperation({ summary: 'Remove a project from favorites for the current user' })
  @ApiParam({ name: 'projectId', description: 'Project UUID' })
  @ApiResponse({ status: 200, description: 'Project unfavorited' })
  @ApiResponse({ status: 401, description: 'Authentication required' })
  @ApiResponse({ status: 404, description: 'Project not found' })
  async unfavoriteProject(
    @Req() req: WorkspaceRequest,
    @Param('projectId') projectId: string,
  ): Promise<ApiRes<{ isFavorite: boolean }>> {
    const result = await this.favorites.unfavoriteProject(
      req.workspaceContext.workspaceId,
      req.user.id,
      projectId,
    );
    return ok(result, 'Project unfavorited successfully');
  }

  @Put('tasks/:taskId/favorite')
  @ApiOperation({ summary: 'Mark a task as favorite for the current user' })
  @ApiParam({ name: 'taskId', description: 'Task UUID' })
  @ApiResponse({ status: 200, description: 'Task favorited' })
  @ApiResponse({ status: 401, description: 'Authentication required' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  async favoriteTask(
    @Req() req: WorkspaceRequest,
    @Param('taskId') taskId: string,
  ): Promise<ApiRes<{ isFavorite: boolean }>> {
    const result = await this.favorites.favoriteTask(
      req.workspaceContext.workspaceId,
      req.user.id,
      taskId,
    );
    return ok(result, 'Task favorited successfully');
  }

  @Delete('tasks/:taskId/favorite')
  @ApiOperation({ summary: 'Remove a task from favorites for the current user' })
  @ApiParam({ name: 'taskId', description: 'Task UUID' })
  @ApiResponse({ status: 200, description: 'Task unfavorited' })
  @ApiResponse({ status: 401, description: 'Authentication required' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  async unfavoriteTask(
    @Req() req: WorkspaceRequest,
    @Param('taskId') taskId: string,
  ): Promise<ApiRes<{ isFavorite: boolean }>> {
    const result = await this.favorites.unfavoriteTask(
      req.workspaceContext.workspaceId,
      req.user.id,
      taskId,
    );
    return ok(result, 'Task unfavorited successfully');
  }
}
