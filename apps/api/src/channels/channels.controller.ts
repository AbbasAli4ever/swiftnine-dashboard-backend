import { Body, Controller, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { WorkspaceGuard } from '../workspace/workspace.guard';
import { CreateChannelDto } from './dto/create-channel.dto';
import { ChannelsService } from './channels.service';
import { ok, type ApiResponse as ApiRes } from '@app/common';
import type { WorkspaceRequest } from '../workspace/workspace.types';

@ApiTags('channels')
@ApiBearerAuth()
@Controller('channels')
@UseGuards(JwtAuthGuard, WorkspaceGuard)
@ApiHeader({ name: 'x-workspace-id', required: true, description: 'Active workspace ID' })
export class ChannelsController {
  constructor(private readonly channelsService: ChannelsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new channel in the workspace (optional project-scoped)' })
  @ApiResponse({ status: 201, description: 'Channel created' })
  async create(@Req() req: WorkspaceRequest, @Body() dto: CreateChannelDto): Promise<ApiRes<any>> {
    const channel = await this.channelsService.create(req.workspaceContext.workspaceId, req.user.id, dto);
    return ok(channel, 'Channel created');
  }
}
