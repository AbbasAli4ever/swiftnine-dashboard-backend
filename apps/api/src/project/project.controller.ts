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
  ApiHeader,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { WorkspaceGuard } from '../workspace/workspace.guard';
import { Roles } from '../roles/roles.decorator';
import { RolesGuard } from '../roles/roles.guard';
import { ProjectService, type ProjectWithDetails } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import type { WorkspaceRequest } from '../workspace/workspace.types';
import { ok, type ApiResponse as ApiRes } from '@app/common';

@ApiTags('projects')
@ApiBearerAuth()
@Controller('projects')
@UseGuards(JwtAuthGuard, WorkspaceGuard)
@ApiHeader({ name: 'x-workspace-id', required: true, description: 'Active workspace ID' })
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new project in the workspace' })
  @ApiResponse({ status: 201, description: 'Project created with grouped default statuses' })
  @ApiResponse({ status: 409, description: 'Task ID prefix already taken in this workspace' })
  async create(
    @Req() req: WorkspaceRequest,
    @Body() dto: CreateProjectDto,
  ): Promise<ApiRes<ProjectWithDetails>> {
    const project = await this.projectService.create(
      req.workspaceContext.workspaceId,
      req.user.id,
      dto,
    );
    return ok(project, 'Project created successfully');
  }

  @Get()
  @ApiOperation({ summary: 'List all active (non-archived) projects in the workspace' })
  @ApiQuery({ name: 'includeArchived', required: false, type: Boolean })
  @ApiResponse({ status: 200, description: 'Projects returned' })
  async findAll(
    @Req() req: WorkspaceRequest,
    @Query('includeArchived') includeArchived?: string,
  ): Promise<ApiRes<ProjectWithDetails[]>> {
    const projects = await this.projectService.findAll(
      req.workspaceContext.workspaceId,
      req.user.id,
      includeArchived === 'true',
    );
    return ok(projects);
  }

  @Get('archived')
  @ApiOperation({ summary: 'List archived projects in the workspace' })
  @ApiResponse({ status: 200, description: 'Archived projects returned' })
  @ApiResponse({ status: 401, description: 'Authentication required' })
  async findArchived(@Req() req: WorkspaceRequest): Promise<ApiRes<ProjectWithDetails[]>> {
    const projects = await this.projectService.findArchived(
      req.workspaceContext.workspaceId,
      req.user.id,
    );
    return ok(projects);
  }

  @Get(':projectId')
  @ApiOperation({ summary: 'Get a single project with its statuses' })
  @ApiResponse({ status: 200, description: 'Project returned' })
  @ApiResponse({ status: 404, description: 'Project not found' })
  async findOne(
    @Req() req: WorkspaceRequest,
    @Param('projectId') projectId: string,
  ): Promise<ApiRes<ProjectWithDetails>> {
    const project = await this.projectService.findOne(
      req.workspaceContext.workspaceId,
      req.user.id,
      projectId,
    );
    return ok(project);
  }

  @Patch(':projectId/archive')
  @UseGuards(JwtAuthGuard, WorkspaceGuard, RolesGuard)
  @Roles('OWNER', 'ADMIN')
  @ApiOperation({ summary: 'Archive a project without deleting its data' })
  @ApiParam({ name: 'projectId', description: 'Project UUID' })
  @ApiResponse({ status: 200, description: 'Project archived' })
  @ApiResponse({ status: 401, description: 'Authentication required' })
  @ApiResponse({ status: 403, description: 'Only OWNER or ADMIN can archive projects' })
  @ApiResponse({ status: 404, description: 'Project not found' })
  async archive(
    @Req() req: WorkspaceRequest,
    @Param('projectId') projectId: string,
  ): Promise<ApiRes<ProjectWithDetails>> {
    const project = await this.projectService.archive(
      req.workspaceContext.workspaceId,
      projectId,
      req.user.id,
      req.workspaceContext.role,
    );
    return ok(project, 'Project archived successfully');
  }

  @Patch(':projectId/restore')
  @UseGuards(JwtAuthGuard, WorkspaceGuard, RolesGuard)
  @Roles('OWNER', 'ADMIN')
  @ApiOperation({ summary: 'Restore an archived project' })
  @ApiParam({ name: 'projectId', description: 'Project UUID' })
  @ApiResponse({ status: 200, description: 'Project restored' })
  @ApiResponse({ status: 401, description: 'Authentication required' })
  @ApiResponse({ status: 403, description: 'Only OWNER or ADMIN can restore projects' })
  @ApiResponse({ status: 404, description: 'Project not found' })
  async restore(
    @Req() req: WorkspaceRequest,
    @Param('projectId') projectId: string,
  ): Promise<ApiRes<ProjectWithDetails>> {
    const project = await this.projectService.restore(
      req.workspaceContext.workspaceId,
      projectId,
      req.user.id,
      req.workspaceContext.role,
    );
    return ok(project, 'Project restored successfully');
  }

  @Patch(':projectId')
  @ApiOperation({ summary: 'Update project name, description, color, or icon' })
  @ApiResponse({ status: 200, description: 'Project updated' })
  @ApiResponse({ status: 404, description: 'Project not found' })
  async update(
    @Req() req: WorkspaceRequest,
    @Param('projectId') projectId: string,
    @Body() dto: UpdateProjectDto,
  ): Promise<ApiRes<ProjectWithDetails>> {
    const project = await this.projectService.update(
      req.workspaceContext.workspaceId,
      projectId,
      req.user.id,
      dto,
    );
    return ok(project, 'Project updated successfully');
  }

  @Delete(':projectId')
  @UseGuards(JwtAuthGuard, WorkspaceGuard, RolesGuard)
  @Roles('OWNER')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Soft delete a project and all its data (OWNER only)' })
  @ApiResponse({ status: 200, description: 'Project deleted' })
  @ApiResponse({ status: 403, description: 'Only workspace owner can delete projects' })
  @ApiResponse({ status: 404, description: 'Project not found' })
  async remove(
    @Req() req: WorkspaceRequest,
    @Param('projectId') projectId: string,
  ): Promise<ApiRes<null>> {
    await this.projectService.remove(
      req.workspaceContext.workspaceId,
      projectId,
      req.user.id,
      req.workspaceContext.role,
    );
    return ok(null, 'Project deleted successfully');
  }
}
