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
import { WorkspaceGuard } from './workspace.guard';
import { WorkspaceService } from './workspace.service';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';
import { InviteMemberDto } from './dto/invite-member.dto';
import { AcceptInviteDto } from './dto/accept-invite.dto';
import type { WorkspaceRequest } from './workspace.types';
import type { AuthUser } from '../auth/auth.service';
import type { Request } from 'express';
import { ok, type ApiResponse as ApiRes } from '@app/common';
import type { WorkspaceData } from './workspace.service';

type AuthenticatedRequest = Request & { user: AuthUser };

@ApiTags('workspaces')
@ApiBearerAuth()
@Controller('workspaces')
@UseGuards(JwtAuthGuard)
export class WorkspaceController {
  constructor(private readonly workspaceService: WorkspaceService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new workspace' })
  @ApiResponse({ status: 201, description: 'Workspace created successfully' })
  @ApiResponse({ status: 401, description: 'Authentication required' })
  async create(
    @Body() dto: CreateWorkspaceDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<ApiRes<WorkspaceData>> {
    const workspace = await this.workspaceService.create(req.user.id, dto);
    return ok(workspace, 'Workspace created successfully');
  }

  @Get()
  @ApiOperation({ summary: 'List all workspaces the current user belongs to' })
  @ApiResponse({ status: 200, description: 'Workspaces returned' })
  async findAll(@Req() req: AuthenticatedRequest): Promise<ApiRes<WorkspaceData[]>> {
    const workspaces = await this.workspaceService.findAllForUser(req.user.id);
    return ok(workspaces);
  }

  @Get(':workspaceId')
  @UseGuards(WorkspaceGuard)
  @ApiOperation({ summary: 'Get a single workspace' })
  @ApiHeader({ name: 'x-workspace-id', required: true })
  @ApiResponse({ status: 200, description: 'Workspace returned' })
  @ApiResponse({ status: 403, description: 'Not a member' })
  @ApiResponse({ status: 404, description: 'Workspace not found' })
  async findOne(@Req() req: WorkspaceRequest): Promise<ApiRes<WorkspaceData & { memberCount: number }>> {
    const workspace = await this.workspaceService.findOne(
      req.workspaceContext.workspaceId,
      req.user.id,
    );
    return ok(workspace);
  }

  @Patch(':workspaceId')
  @UseGuards(WorkspaceGuard)
  @ApiOperation({ summary: 'Update workspace name or logo (OWNER only)' })
  @ApiHeader({ name: 'x-workspace-id', required: true })
  @ApiResponse({ status: 200, description: 'Workspace updated' })
  @ApiResponse({ status: 403, description: 'Not a member or not an owner' })
  @ApiResponse({ status: 404, description: 'Workspace not found' })
  async update(
    @Req() req: WorkspaceRequest,
    @Body() dto: UpdateWorkspaceDto,
  ): Promise<ApiRes<WorkspaceData>> {
    const workspace = await this.workspaceService.update(
      req.workspaceContext.workspaceId,
      req.user.id,
      req.workspaceContext.role,
      dto,
    );
    return ok(workspace, 'Workspace updated successfully');
  }

  @Delete(':workspaceId')
  @UseGuards(WorkspaceGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Soft delete a workspace (OWNER only)' })
  @ApiHeader({ name: 'x-workspace-id', required: true })
  @ApiResponse({ status: 200, description: 'Workspace deleted' })
  @ApiResponse({ status: 403, description: 'Not a member or not an owner' })
  @ApiResponse({ status: 404, description: 'Workspace not found' })
  async remove(@Req() req: WorkspaceRequest): Promise<ApiRes<null>> {
    await this.workspaceService.remove(
      req.workspaceContext.workspaceId,
      req.user.id,
      req.workspaceContext.role,
    );
    return ok(null, 'Workspace deleted successfully');
  }

  // ─── Invite ─────────────────────────────────────────────────────────────────

  @Post(':workspaceId/invite')
  @UseGuards(WorkspaceGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Send a workspace invite email (OWNER only)' })
  @ApiHeader({ name: 'x-workspace-id', required: true })
  @ApiResponse({ status: 200, description: 'Invite sent' })
  @ApiResponse({ status: 403, description: 'Not a member or not an owner' })
  @ApiResponse({ status: 404, description: 'Workspace not found' })
  async sendInvite(
    @Req() req: WorkspaceRequest,
    @Body() dto: InviteMemberDto,
  ): Promise<ApiRes<null>> {
    await this.workspaceService.sendInvite(
      req.workspaceContext.workspaceId,
      req.user.id,
      req.workspaceContext.role,
      dto,
    );
    return ok(null, 'Invite sent successfully');
  }

  @Get('invite/:token')
  @ApiOperation({ summary: 'Peek at invite details without consuming it (public)' })
  @ApiResponse({ status: 200, description: 'Invite details returned' })
  @ApiResponse({ status: 404, description: 'Invite not found, used, or expired' })
  async getInviteDetails(
    @Param('token') token: string,
  ): Promise<ApiRes<{
    workspaceId: string;
    workspaceName: string;
    invitedEmail: string;
    role: string;
    inviterName: string;
  }>> {
    const details = await this.workspaceService.getInviteDetails(token);
    return ok(details);
  }

  @Post('invite/accept')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Accept a workspace invite (authenticated)',
    description:
      'User must be logged in. The logged-in email must match the invited email.',
  })
  @ApiResponse({ status: 200, description: 'Invite accepted, added to workspace' })
  @ApiResponse({ status: 400, description: 'Invite was sent to a different email' })
  @ApiResponse({ status: 401, description: 'Not authenticated' })
  @ApiResponse({ status: 404, description: 'Invite not found, used, or expired' })
  async acceptInvite(
    @Req() req: AuthenticatedRequest,
    @Body() dto: AcceptInviteDto,
  ): Promise<ApiRes<{ workspaceId: string }>> {
    const result = await this.workspaceService.acceptInvite(
      dto.token,
      req.user.id,
      req.user.email,
    );
    return ok(result, 'Invite accepted successfully');
  }
}
