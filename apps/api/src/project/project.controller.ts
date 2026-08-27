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
import { ProjectService, type ProjectListItem, type ProjectWithDetails } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { UpdateProjectVisibilityDto } from './dto/update-project-visibility.dto';
import { InviteProjectMemberDto } from './dto/invite-project-member.dto';
import {
  BatchInviteProjectMembersDto,
  BatchInviteProjectMembersResponseDto,
} from './dto/batch-invite-project-members.dto';
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
  ): Promise<ApiRes<ProjectListItem[]>> {
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
  async findArchived(@Req() req: WorkspaceRequest): Promise<ApiRes<ProjectListItem[]>> {
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

  @Patch(':projectId/visibility')
  @ApiOperation({
    summary: 'Change a project between PUBLIC and PRIVATE',
    description:
      'Creator only — no OWNER override. PUBLIC: every workspace member can see and act on the project. PRIVATE: visible only to the creator and invited ProjectMembers; switching to PRIVATE automatically grandfathers in every current task assignee, and clears any existing project password (private replaces the need for one).',
  })
  @ApiParam({ name: 'projectId', description: 'Project UUID' })
  @ApiResponse({ status: 200, description: 'Visibility updated' })
  @ApiResponse({
    status: 403,
    description: 'Only the project creator can change visibility',
  })
  @ApiResponse({ status: 404, description: 'Project not found' })
  async updateVisibility(
    @Req() req: WorkspaceRequest,
    @Param('projectId') projectId: string,
    @Body() dto: UpdateProjectVisibilityDto,
  ): Promise<ApiRes<ProjectWithDetails>> {
    const project = await this.projectService.updateVisibility(
      req.workspaceContext.workspaceId,
      projectId,
      req.user.id,
      dto.visibility,
    );
    return ok(project, 'Project visibility updated successfully');
  }

  @Get(':projectId/members')
  @ApiOperation({
    summary: "List a project's members (creator + invited users)",
  })
  @ApiParam({ name: 'projectId', description: 'Project UUID' })
  @ApiResponse({ status: 200, description: 'Members returned' })
  @ApiResponse({ status: 404, description: 'Project not found' })
  async listMembers(
    @Req() req: WorkspaceRequest,
    @Param('projectId') projectId: string,
  ): Promise<ApiRes<Awaited<ReturnType<ProjectService['listMembers']>>>> {
    const members = await this.projectService.listMembers(
      req.workspaceContext.workspaceId,
      projectId,
      req.user.id,
    );
    return ok(members);
  }

  @Get(':projectId/members/candidates')
  @ApiOperation({
    summary: 'List every workspace member, flagged with project access',
    description:
      'Creator only. Returns every workspace member annotated with isProjectMember and isCreator, for building an invite picker in one call instead of cross-referencing GET /workspaces/:workspaceId/members and GET /projects/:projectId/members yourself.',
  })
  @ApiParam({ name: 'projectId', description: 'Project UUID' })
  @ApiResponse({ status: 200, description: 'Candidates returned' })
  @ApiResponse({
    status: 403,
    description: 'Only the project creator can view invite candidates',
  })
  @ApiResponse({ status: 404, description: 'Project not found' })
  async listMemberCandidates(
    @Req() req: WorkspaceRequest,
    @Param('projectId') projectId: string,
  ): Promise<
    ApiRes<Awaited<ReturnType<ProjectService['listMemberCandidates']>>>
  > {
    const candidates = await this.projectService.listMemberCandidates(
      req.workspaceContext.workspaceId,
      projectId,
      req.user.id,
    );
    return ok(candidates);
  }

  @Post(':projectId/members/batch')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Invite multiple workspace members to a PRIVATE project at once',
    description:
      'Creator only. Only valid on a PRIVATE project. Each userId is processed independently — one bad id (not a workspace member, already invited) does not fail the rest.',
  })
  @ApiParam({ name: 'projectId', description: 'Project UUID' })
  @ApiResponse({
    status: 201,
    description: 'Batch processed',
    type: BatchInviteProjectMembersResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Project is PUBLIC',
  })
  @ApiResponse({
    status: 403,
    description: 'Only the project creator can invite members',
  })
  @ApiResponse({ status: 404, description: 'Project not found' })
  async inviteMembersBatch(
    @Req() req: WorkspaceRequest,
    @Param('projectId') projectId: string,
    @Body() dto: BatchInviteProjectMembersDto,
  ): Promise<ApiRes<BatchInviteProjectMembersResponseDto>> {
    const result = await this.projectService.inviteMembersBatch(
      req.workspaceContext.workspaceId,
      projectId,
      req.user.id,
      dto.userIds,
    );
    return ok(result, 'Batch invite processed');
  }

  @Post(':projectId/members')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Invite a workspace member to a PRIVATE project',
    description:
      'Creator only. Only valid on a PRIVATE project — a PUBLIC one already grants everyone access.',
  })
  @ApiParam({ name: 'projectId', description: 'Project UUID' })
  @ApiResponse({ status: 201, description: 'Member invited' })
  @ApiResponse({
    status: 400,
    description: 'Project is PUBLIC, or user is not a workspace member',
  })
  @ApiResponse({
    status: 403,
    description: 'Only the project creator can invite members',
  })
  @ApiResponse({ status: 404, description: 'Project not found' })
  @ApiResponse({
    status: 409,
    description: 'User is already a member of this project',
  })
  async inviteMember(
    @Req() req: WorkspaceRequest,
    @Param('projectId') projectId: string,
    @Body() dto: InviteProjectMemberDto,
  ): Promise<ApiRes<null>> {
    await this.projectService.inviteMember(
      req.workspaceContext.workspaceId,
      projectId,
      req.user.id,
      dto.userId,
    );
    return ok(null, 'Member invited successfully');
  }

  @Delete(':projectId/members/:userId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Remove a member from a PRIVATE project's invite list",
    description:
      "Creator only. The creator themselves can't be removed. Also strips the removed user as an assignee from every task in the project, since they can no longer open it.",
  })
  @ApiParam({ name: 'projectId', description: 'Project UUID' })
  @ApiParam({ name: 'userId', description: 'User UUID to remove' })
  @ApiResponse({ status: 200, description: 'Member removed' })
  @ApiResponse({
    status: 400,
    description: "Cannot remove the project's creator",
  })
  @ApiResponse({
    status: 403,
    description: 'Only the project creator can remove members',
  })
  @ApiResponse({ status: 404, description: 'Project or member not found' })
  async removeMember(
    @Req() req: WorkspaceRequest,
    @Param('projectId') projectId: string,
    @Param('userId') userId: string,
  ): Promise<ApiRes<null>> {
    await this.projectService.removeMember(
      req.workspaceContext.workspaceId,
      projectId,
      req.user.id,
      userId,
    );
    return ok(null, 'Member removed successfully');
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
