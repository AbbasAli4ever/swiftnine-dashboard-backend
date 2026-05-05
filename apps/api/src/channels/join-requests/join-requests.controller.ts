import {
  Body,
  Controller,
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
  ApiBody,
  ApiHeader,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ok, type ApiResponse as ApiRes } from '@app/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { WorkspaceGuard } from '../../workspace/workspace.guard';
import type { WorkspaceRequest } from '../../workspace/workspace.types';
import { DecideJoinRequestDto } from './dto/decide-join-request.dto';
import { JoinRequestsService } from './join-requests.service';

@ApiTags('channels')
@ApiBearerAuth()
@Controller('channels')
@UseGuards(JwtAuthGuard, WorkspaceGuard)
@ApiHeader({
  name: 'x-workspace-id',
  required: true,
  description: 'Active workspace ID',
})
export class JoinRequestsController {
  constructor(private readonly joinRequestsService: JoinRequestsService) {}

  @Post(':id/join-requests')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Request to join a public channel' })
  @ApiParam({ name: 'id', description: 'Channel id' })
  @ApiResponse({ status: 201, description: 'Join request created' })
  async createRequest(
    @Req() req: WorkspaceRequest,
    @Param('id') channelId: string,
  ): Promise<ApiRes<any>> {
    const request = await this.joinRequestsService.createRequest(
      req.workspaceContext.workspaceId,
      channelId,
      req.user.id,
    );
    return ok(request, 'Join request created');
  }

  @Get(':id/join-requests')
  @ApiOperation({ summary: 'List channel join requests (channel admin only)' })
  @ApiParam({ name: 'id', description: 'Channel id' })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: ['PENDING', 'APPROVED', 'REJECTED'],
  })
  @ApiResponse({ status: 200, description: 'Join requests returned' })
  async listRequests(
    @Req() req: WorkspaceRequest,
    @Param('id') channelId: string,
    @Query('status') status?: string,
  ): Promise<ApiRes<any>> {
    const requests = await this.joinRequestsService.listRequests(
      req.workspaceContext.workspaceId,
      channelId,
      req.user.id,
      status,
    );
    return ok(requests);
  }

  @Get(':id/join-requests/me')
  @ApiOperation({
    summary: "Get the caller's latest join request status for a channel",
  })
  @ApiParam({ name: 'id', description: 'Channel id' })
  @ApiResponse({ status: 200, description: 'Join request status returned' })
  async getMyRequestStatus(
    @Req() req: WorkspaceRequest,
    @Param('id') channelId: string,
  ): Promise<ApiRes<any>> {
    const request = await this.joinRequestsService.getMyRequestStatus(
      req.workspaceContext.workspaceId,
      channelId,
      req.user.id,
    );
    return ok(request);
  }

  @Patch(':id/join-requests/:reqId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Approve or reject a channel join request (channel admin only)',
  })
  @ApiParam({ name: 'id', description: 'Channel id' })
  @ApiParam({ name: 'reqId', description: 'Join request id' })
  @ApiBody({ type: DecideJoinRequestDto })
  @ApiResponse({ status: 200, description: 'Join request updated' })
  async decideRequest(
    @Req() req: WorkspaceRequest,
    @Param('id') channelId: string,
    @Param('reqId') requestId: string,
    @Body() dto: DecideJoinRequestDto,
  ): Promise<ApiRes<any>> {
    const request = await this.joinRequestsService.decideRequest(
      req.workspaceContext.workspaceId,
      channelId,
      requestId,
      req.user.id,
      dto.decision,
    );
    return ok(request, `Join request ${dto.decision}d`);
  }
}
