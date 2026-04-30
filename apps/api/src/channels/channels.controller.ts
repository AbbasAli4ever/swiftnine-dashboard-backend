import { Body, Controller, Delete, HttpCode, HttpStatus, Post, Req, UseGuards, Param, Get, ForbiddenException, Patch } from '@nestjs/common';
import { ApiBearerAuth, ApiHeader, ApiOperation, ApiResponse, ApiTags, ApiBody, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { WorkspaceGuard } from '../workspace/workspace.guard';
import { CreateChannelDto } from './dto/create-channel.dto';
import { ChannelsService } from './channels.service';
import { AddChannelMemberDto, BulkAddChannelMembersDto } from './dto/channel-member.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';
import { ChannelResponseDto } from './dto/channel-response.dto';
import { ok, type ApiResponse as ApiRes } from '@app/common';
import type { WorkspaceRequest } from '../workspace/workspace.types';

@ApiTags('channels')
@ApiBearerAuth()
@Controller('channels')
@UseGuards(JwtAuthGuard, WorkspaceGuard)
@ApiHeader({ name: 'x-workspace-id', required: true, description: 'Active workspace ID' })
export class ChannelsController {
  constructor(private readonly channelsService: ChannelsService) {}

  private assertWorkspaceMatch(req: WorkspaceRequest, workspaceId: string) {
    if (req.workspaceContext.workspaceId !== workspaceId) {
      throw new ForbiddenException('Workspace mismatch');
    }
  }

  @Get('workspaces/:workspaceId')
  @ApiOperation({ summary: 'List channels in a workspace (privacy-aware)' })
  @ApiParam({ name: 'workspaceId', description: 'Workspace UUID' })
  @ApiResponse({ status: 200, description: 'Channels returned', type: [ChannelResponseDto] })
  @ApiResponse({ status: 403, description: 'Not a member of the workspace' })
  async listByWorkspace(
    @Req() req: WorkspaceRequest,
    @Param('workspaceId') workspaceId: string,
  ): Promise<ApiRes<any>> {
    this.assertWorkspaceMatch(req, workspaceId);
    const channels = await this.channelsService.listByWorkspace(workspaceId, req.user.id);
    return ok(channels);
  }

  @Get('workspaces/:workspaceId/projects/:projectId')
  @ApiOperation({ summary: 'List channels in a project (privacy-aware)' })
  @ApiParam({ name: 'workspaceId', description: 'Workspace UUID' })
  @ApiParam({ name: 'projectId', description: 'Project UUID' })
  @ApiResponse({ status: 200, description: 'Channels returned', type: [ChannelResponseDto] })
  @ApiResponse({ status: 403, description: 'Not a member of the workspace' })
  @ApiResponse({ status: 404, description: 'Project not found in workspace' })
  async listByProject(
    @Req() req: WorkspaceRequest,
    @Param('workspaceId') workspaceId: string,
    @Param('projectId') projectId: string,
  ): Promise<ApiRes<any>> {
    this.assertWorkspaceMatch(req, workspaceId);
    const channels = await this.channelsService.listByProject(workspaceId, projectId, req.user.id);
    return ok(channels);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new channel in the workspace (optional project-scoped)' })
  @ApiResponse({ status: 201, description: 'Channel created', type: ChannelResponseDto })
  async create(@Req() req: WorkspaceRequest, @Body() dto: CreateChannelDto): Promise<ApiRes<any>> {
    const channel = await this.channelsService.create(req.workspaceContext.workspaceId, req.user.id, dto);
    return ok(channel, 'Channel created');
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update a channel (admin/owner only)' })
  @ApiParam({ name: 'id', description: 'Channel id', example: 'cc6c4f04-6cae-4d0a-a3cb-864d53f92f29' })
  @ApiBody({ type: UpdateChannelDto })
  @ApiResponse({ status: 200, description: 'Channel updated', type: ChannelResponseDto })
  @ApiResponse({ status: 400, description: 'At least one field must be provided' })
  @ApiResponse({ status: 403, description: 'Only channel admins can update the channel' })
  @ApiResponse({ status: 404, description: 'Channel not found in workspace' })
  async update(
    @Req() req: WorkspaceRequest,
    @Param('id') channelId: string,
    @Body() dto: UpdateChannelDto,
  ): Promise<ApiRes<any>> {
    const channel = await this.channelsService.updateChannel(
      req.workspaceContext.workspaceId,
      channelId,
      req.user.id,
      dto,
    );
    return ok(channel, 'Channel updated');
  }

  @Post(':id/members')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Add a member to a channel (channel admin only)' })
  @ApiParam({ name: 'id', description: 'Channel id', example: 'cc6c4f04-6cae-4d0a-a3cb-864d53f92f29' })
  @ApiBody({ type: AddChannelMemberDto })
  @ApiResponse({ status: 201, description: 'Member added to channel' })
  async addMember(@Req() req: WorkspaceRequest, @Param('id') channelId: string, @Body() dto: AddChannelMemberDto): Promise<ApiRes<any>> {
    const member = await this.channelsService.addChannelMember(req.workspaceContext.workspaceId, channelId, req.user.id, dto.userId, dto.role);
    return ok(member, 'Member added to channel');
  }

  @Post(':id/members/bulk')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Bulk add members to a channel (channel admin only)' })
  @ApiParam({ name: 'id', description: 'Channel id', example: 'cc6c4f04-6cae-4d0a-a3cb-864d53f92f29' })
  @ApiBody({ type: BulkAddChannelMembersDto })
  @ApiResponse({ status: 200, description: 'Members added/updated' })
  async addMembersBulk(@Req() req: WorkspaceRequest, @Param('id') channelId: string, @Body() dto: BulkAddChannelMembersDto): Promise<ApiRes<any>> {
    const members = await this.channelsService.addChannelMembersBulk(req.workspaceContext.workspaceId, channelId, req.user.id, dto.members.map((m) => ({ userId: m.userId, role: m.role })));
    return ok(members, 'Members processed');
  }

  @Delete(':id/members/:memberId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Remove a member from a channel (channel admin only)' })
  @ApiParam({ name: 'id', description: 'Channel id', example: 'cc6c4f04-6cae-4d0a-a3cb-864d53f92f29' })
  @ApiParam({ name: 'memberId', description: 'Channel member id (channel_members.id)', example: '2f9c1b8a-3b4a-4f3d-9b2a-1234567890ab' })
  @ApiResponse({ status: 200, description: 'Member removed from channel' })
  async removeMember(@Req() req: WorkspaceRequest, @Param('id') channelId: string, @Param('memberId') memberId: string): Promise<ApiRes<any>> {
    await this.channelsService.removeChannelMember(req.workspaceContext.workspaceId, channelId, req.user.id, memberId);
    return ok(null, 'Member removed from channel');
  }
}
