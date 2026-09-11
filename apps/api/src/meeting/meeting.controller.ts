import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiHeader, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { WorkspaceGuard } from '../workspace/workspace.guard';
import { Roles } from '../roles/roles.decorator';
import { RolesGuard } from '../roles/roles.guard';
import { MeetingService, type MeetingDetailData, type MeetingListItemData } from './meeting.service';
import { CreateMeetingDto } from './dto/create-meeting.dto';
import { UpdateMeetingDto } from './dto/update-meeting.dto';
import { ListMeetingsDto, type ListMeetingsQuery } from './dto/list-meetings.dto';
import type { WorkspaceRequest } from '../workspace/workspace.types';
import { ok, paginated, type ApiResponse as ApiRes, type PaginatedApiResponse } from '@app/common';

@ApiTags('meetings')
@ApiBearerAuth()
@Controller('meetings')
@UseGuards(JwtAuthGuard, WorkspaceGuard, RolesGuard)
@Roles('OWNER', 'MANAGER')
@ApiHeader({ name: 'x-workspace-id', required: true, description: 'Active workspace ID' })
export class MeetingController {
  constructor(private readonly meetingService: MeetingService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create a Minutes of Meeting (MoM)',
    description:
      'Records a meeting with its participants, discussion summary, optional decisions, ' +
      'and optional follow-up tasks. Each follow-up task picks a project and an assignee ' +
      '(both dropdowns come from GET /projects and GET /workspaces/:workspaceId/members) ' +
      'and lands in that project\'s default task list, in its "To Do" status column.',
  })
  @ApiResponse({ status: 201, description: 'Meeting created' })
  @ApiResponse({ status: 400, description: 'Invalid participant/assignee, or a selected project has no list/To Do status' })
  @ApiResponse({ status: 401, description: 'Authentication required' })
  @ApiResponse({ status: 403, description: 'Only workspace OWNER or MANAGER can use MoM' })
  @ApiResponse({ status: 404, description: 'A selected project was not found' })
  async create(
    @Req() req: WorkspaceRequest,
    @Body() dto: CreateMeetingDto,
  ): Promise<ApiRes<MeetingDetailData>> {
    const meeting = await this.meetingService.create(
      req.workspaceContext.workspaceId,
      req.user.id,
      dto,
    );
    return ok(meeting, 'Meeting created successfully');
  }

  @Get()
  @ApiOperation({
    summary: 'List Minutes of Meeting (MoM) in the workspace',
    description:
      'Lightweight rows for a "Recent meetings" list — title, date, creator, participants, ' +
      'and task counts, but not the full task array/summary/decisions. Use GET /meetings/:id ' +
      'for the full detail of one meeting.',
  })
  @ApiQuery({ name: 'page', required: false, description: 'Default 1' })
  @ApiQuery({ name: 'limit', required: false, description: 'Default 20, max 100' })
  @ApiResponse({ status: 200, description: 'Meetings returned' })
  @ApiResponse({ status: 401, description: 'Authentication required' })
  @ApiResponse({ status: 403, description: 'Only workspace OWNER or MANAGER can use MoM' })
  async findAll(
    @Req() req: WorkspaceRequest,
    @Query() query: ListMeetingsDto,
  ): Promise<PaginatedApiResponse<MeetingListItemData>> {
    const result = await this.meetingService.findAll(
      req.workspaceContext.workspaceId,
      query as ListMeetingsQuery,
    );
    return paginated(result.items, result.total, result.page, result.limit);
  }

  @Get(':meetingId')
  @ApiOperation({ summary: 'Get a single Minutes of Meeting (MoM) by id' })
  @ApiParam({ name: 'meetingId', description: 'Meeting UUID' })
  @ApiResponse({ status: 200, description: 'Meeting returned' })
  @ApiResponse({ status: 401, description: 'Authentication required' })
  @ApiResponse({ status: 403, description: 'Only workspace OWNER or MANAGER can use MoM' })
  @ApiResponse({ status: 404, description: 'Meeting not found' })
  async findOne(
    @Req() req: WorkspaceRequest,
    @Param('meetingId') meetingId: string,
  ): Promise<ApiRes<MeetingDetailData>> {
    const meeting = await this.meetingService.findOne(
      req.workspaceContext.workspaceId,
      meetingId,
    );
    return ok(meeting);
  }

  @Patch(':meetingId')
  @ApiOperation({
    summary: 'Update a Minutes of Meeting (MoM) — creator only',
    description:
      'Updates title, meetingDate, summary, decisions, and/or participants. Follow-up tasks ' +
      "aren't editable through this endpoint — manage them through the normal task endpoints " +
      'once created.',
  })
  @ApiParam({ name: 'meetingId', description: 'Meeting UUID' })
  @ApiResponse({ status: 200, description: 'Meeting updated' })
  @ApiResponse({ status: 400, description: 'No fields provided, or an invalid participant id' })
  @ApiResponse({ status: 401, description: 'Authentication required' })
  @ApiResponse({ status: 403, description: 'Only workspace OWNER/MANAGER can use MoM, and only the meeting creator can update it' })
  @ApiResponse({ status: 404, description: 'Meeting not found' })
  async update(
    @Req() req: WorkspaceRequest,
    @Param('meetingId') meetingId: string,
    @Body() dto: UpdateMeetingDto,
  ): Promise<ApiRes<MeetingDetailData>> {
    const meeting = await this.meetingService.update(
      req.workspaceContext.workspaceId,
      req.user.id,
      meetingId,
      dto,
    );
    return ok(meeting, 'Meeting updated successfully');
  }

  @Delete(':meetingId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Delete a Minutes of Meeting (MoM) — creator only',
    description:
      'Soft-deletes the meeting. Every task that was linked to it is kept exactly as-is — ' +
      'same title, status, assignee, progress — it just loses its link back to this meeting.',
  })
  @ApiParam({ name: 'meetingId', description: 'Meeting UUID' })
  @ApiResponse({ status: 200, description: 'Meeting deleted' })
  @ApiResponse({ status: 401, description: 'Authentication required' })
  @ApiResponse({ status: 403, description: 'Only workspace OWNER/MANAGER can use MoM, and only the meeting creator can delete it' })
  @ApiResponse({ status: 404, description: 'Meeting not found' })
  async remove(
    @Req() req: WorkspaceRequest,
    @Param('meetingId') meetingId: string,
  ): Promise<ApiRes<null>> {
    await this.meetingService.remove(
      req.workspaceContext.workspaceId,
      req.user.id,
      meetingId,
    );
    return ok(null, 'Meeting deleted successfully');
  }
}
