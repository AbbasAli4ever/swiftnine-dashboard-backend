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
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiHeader,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiParam,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { WorkspaceGuard } from './workspace.guard';
import { Roles } from '../roles/roles.decorator';
import { RolesGuard } from '../roles/roles.guard';
import { WorkspaceService } from './workspace.service';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';
import { InviteMemberDto } from './dto/invite-member.dto';
import { AcceptInviteDto } from './dto/accept-invite.dto';
import {
  BatchInviteMembersDto,
  BatchInviteResponseDto,
} from './dto/batch-invite-members.dto';
import { AddMemberDto } from './dto/add-member.dto';
import { BatchAddMembersDto, BatchAddResponseDto } from './dto/batch-add-members.dto';
import {
  ClaimInviteDto,
  ClaimInviteResponseDto,
} from './dto/claim-invite.dto';
import { MemberResponseDto } from './dto/member-response.dto';
import { MemberDetailResponseDto } from './dto/member-detail-response.dto';
import type { WorkspaceRequest } from './workspace.types';
import type { AuthUser } from '../auth/auth.service';
import type { Request, Response } from 'express';
import { ok, type ApiResponse as ApiRes } from '@app/common';
import type {
  BatchInviteResult,
  BatchAddResult,
  InviteClaimResult,
  InviteNextStep,
  WorkspaceData,
} from './workspace.service';
import { buildRefreshCookieOptions } from '../auth/auth.cookies';

type AuthenticatedRequest = Request & { user: AuthUser };

@ApiTags('workspaces')
@Controller('workspaces')
export class WorkspaceController {
  constructor(private readonly workspaceService: WorkspaceService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new workspace with onboarding metadata' })
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
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List all workspaces the current user belongs to' })
  @ApiResponse({ status: 200, description: 'Workspaces returned' })
  async findAll(@Req() req: AuthenticatedRequest): Promise<ApiRes<WorkspaceData[]>> {
    const workspaces = await this.workspaceService.findAllForUser(req.user.id);
    return ok(workspaces);
  }

  @Get(':workspaceId')
  @UseGuards(JwtAuthGuard, WorkspaceGuard)
  @ApiBearerAuth()
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

  @Get(':workspaceId/members')
  @UseGuards(JwtAuthGuard, WorkspaceGuard)
  @ApiBearerAuth()
  @ApiHeader({ name: 'x-workspace-id', required: true })
  @ApiOperation({ summary: 'List members in a workspace' })
  @ApiResponse({ status: 200, description: 'Members returned', type: [MemberResponseDto] })
  @ApiResponse({ status: 403, description: 'Not a member' })
  @ApiResponse({ status: 404, description: 'Workspace not found' })
  async listMembers(@Req() req: WorkspaceRequest): Promise<ApiRes<MemberResponseDto[]>> {
    const members = await this.workspaceService.listMembers(req.workspaceContext.workspaceId);
    return ok(members, 'Members returned successfully');
  }

  @Get(':workspaceId/members/:memberId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a single workspace member by id (protected by JWT)' })
  @ApiParam({ name: 'workspaceId', description: 'Workspace UUID' })
  @ApiParam({ name: 'memberId', description: 'Workspace member id or user id' })
  @ApiResponse({ status: 200, description: 'Member returned', type: MemberDetailResponseDto })
  @ApiResponse({ status: 401, description: 'Authentication required' })
  @ApiResponse({ status: 404, description: 'Member not found' })
  async getMember(
    @Param('workspaceId') workspaceId: string,
    @Param('memberId') memberId: string,
  ): Promise<ApiRes<MemberDetailResponseDto>> {
    const member = await this.workspaceService.getMember(workspaceId, memberId);
    return ok(member, 'Member returned successfully');
  }

  @Patch(':workspaceId')
  @UseGuards(JwtAuthGuard, WorkspaceGuard, RolesGuard)
  @Roles('OWNER')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update workspace settings (OWNER only)' })
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
  @UseGuards(JwtAuthGuard, WorkspaceGuard, RolesGuard)
  @Roles('OWNER')
  @ApiBearerAuth()
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
  @UseGuards(JwtAuthGuard, WorkspaceGuard, RolesGuard)
  @Roles('OWNER')
  @ApiBearerAuth()
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

  @Post(':workspaceId/invites')
  @UseGuards(JwtAuthGuard, WorkspaceGuard, RolesGuard)
  @Roles('OWNER')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Send workspace invite emails in bulk (OWNER only)' })
  @ApiHeader({ name: 'x-workspace-id', required: true })
  @ApiResponse({
    status: 200,
    type: BatchInviteResponseDto,
    description: 'Batch invite processed',
  })
  @ApiResponse({ status: 403, description: 'Not a member or not an owner' })
  @ApiResponse({ status: 404, description: 'Workspace not found' })
  @ApiResponse({ status: 422, description: 'Validation failed' })
  async sendBatchInvites(
    @Req() req: WorkspaceRequest,
    @Body() dto: BatchInviteMembersDto,
  ): Promise<ApiRes<BatchInviteResult>> {
    const result = await this.workspaceService.sendBatchInvites(
      req.workspaceContext.workspaceId,
      req.user.id,
      req.workspaceContext.role,
      dto,
    );
    return ok(result, 'Batch invite processed');
  }

  @Post(':workspaceId/members')
  @UseGuards(JwtAuthGuard, WorkspaceGuard, RolesGuard)
  @Roles('OWNER')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Add an existing user to a workspace (OWNER only)' })
  @ApiHeader({ name: 'x-workspace-id', required: true })
  @ApiResponse({ status: 200, description: 'Member added' })
  @ApiResponse({ status: 403, description: 'Not a member or not an owner' })
  @ApiResponse({ status: 404, description: 'Workspace or user not found' })
  async addMember(
    @Req() req: WorkspaceRequest,
    @Body() dto: AddMemberDto,
  ): Promise<ApiRes<null>> {
    await this.workspaceService.addMemberByUserId(
      req.workspaceContext.workspaceId,
      dto.userId,
      dto.role,
      req.user.id,
    );
    return ok(null, 'Member added successfully');
  }

  @Post(':workspaceId/members/batch')
  @UseGuards(JwtAuthGuard, WorkspaceGuard, RolesGuard)
  @Roles('OWNER')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Add multiple existing users to a workspace (OWNER only)' })
  @ApiHeader({ name: 'x-workspace-id', required: true })
  @ApiResponse({
    status: 200,
    type: BatchAddResponseDto,
    description: 'Batch add processed',
  })
  @ApiResponse({ status: 403, description: 'Not a member or not an owner' })
  @ApiResponse({ status: 404, description: 'Workspace not found' })
  @ApiResponse({ status: 422, description: 'Validation failed' })
  async addMembersBatch(
    @Req() req: WorkspaceRequest,
    @Body() dto: BatchAddMembersDto,
  ): Promise<ApiRes<BatchAddResult>> {
    const result = await this.workspaceService.addMembersByUserIds(
      req.workspaceContext.workspaceId,
      dto.userIds,
      dto.role,
      req.user.id,
    );
    return ok(result, 'Batch members processed');
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
    nextStep: InviteNextStep;
  }>> {
    const details = await this.workspaceService.getInviteDetails(token);
    return ok(details);
  }

  @Post('invite/claim')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Create an account from a workspace invite and join immediately',
    description:
      'Public endpoint for invite recipients. Validates the invite token, creates or upgrades the invited account without OTP, signs the user in, and accepts the invite.',
  })
  @ApiResponse({
    status: 200,
    type: ClaimInviteResponseDto,
    description: 'Invite claimed successfully and auth tokens issued',
  })
  @ApiResponse({
    status: 404,
    description: 'Invite not found, already used, or expired',
  })
  @ApiResponse({
    status: 409,
    description: 'A verified account already exists for the invite email',
  })
  @ApiResponse({ status: 422, description: 'Validation failed' })
  async claimInvite(
    @Body() dto: ClaimInviteDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<ApiRes<Omit<InviteClaimResult, 'refreshToken'>>> {
    const { refreshToken, ...result } = await this.workspaceService.claimInvite(dto);
    this.setRefreshCookie(res, refreshToken);
    return ok(result, 'Invite claimed successfully');
  }

  @Post('invite/accept')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
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

  private setRefreshCookie(res: Response, token: string): void {
    res.cookie('refresh_token', token, buildRefreshCookieOptions());
  }
}
