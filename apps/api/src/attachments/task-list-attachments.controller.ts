import {
  Body,
  Controller,
  Delete,
  Get,
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
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiResponse as SwaggerApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ok, type ApiResponse } from '@app/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { WorkspaceGuard } from '../workspace/workspace.guard';
import type { WorkspaceRequest } from '../workspace/workspace.types';
import { AttachmentsService } from './attachments.service';
import {
  ConfirmTaskListAttachmentDto,
  type ConfirmTaskListAttachmentInput,
} from './dto/confirm-task-list-attachment.dto';
import {
  CreateTaskListLinkDto,
  type CreateTaskListLinkInput,
} from './dto/create-task-list-link.dto';
import { DeleteAttachmentResponseDto } from './dto/delete-attachment-response.dto';
import {
  ListTaskListAttachmentsQueryDto,
  type ListTaskListAttachmentsQuery,
} from './dto/list-task-list-attachments.query.dto';
import {
  PresignTaskListAttachmentDto,
  type PresignTaskListAttachmentInput,
} from './dto/presign-task-list-attachment.dto';
import { PresignResponseDto } from './dto/presign-response.dto';
import {
  TaskListAttachmentListResponseDto,
  TaskListAttachmentResponseDto,
} from './dto/task-list-attachment-response.dto';
import {
  UpdateProjectAttachmentDto,
  type UpdateProjectAttachmentInput,
} from './dto/update-project-attachment.dto';

@ApiTags('task list attachments')
@ApiBearerAuth()
@ApiHeader({
  name: 'x-workspace-id',
  required: true,
  description: 'Active workspace ID',
})
@Controller('task-lists/:listId/attachments')
@UseGuards(JwtAuthGuard, WorkspaceGuard)
export class TaskListAttachmentsController {
  constructor(private readonly attachmentsService: AttachmentsService) {}

  @Post('presign')
  @ApiOperation({ summary: 'Create a presigned S3 upload URL for a task list file' })
  @ApiParam({ name: 'listId', format: 'uuid' })
  @ApiBody({ type: PresignTaskListAttachmentDto })
  @ApiOkResponse({
    description: 'Presigned URL generated',
    type: PresignResponseDto,
  })
  async presignTaskListAttachment(
    @Req() req: WorkspaceRequest,
    @Param('listId') listId: string,
    @Body() dto: PresignTaskListAttachmentDto,
  ) {
    const result = await this.attachmentsService.presignTaskListUpload(
      req.user.id,
      req.workspaceContext.workspaceId,
      listId,
      dto as PresignTaskListAttachmentInput,
    );
    return ok(result, 'Presigned URL generated');
  }

  @Post('confirm')
  @ApiOperation({ summary: 'Confirm task list file upload and create attachment' })
  @ApiParam({ name: 'listId', format: 'uuid' })
  @ApiBody({ type: ConfirmTaskListAttachmentDto })
  @ApiOkResponse({
    description: 'Task list file attachment created',
    type: TaskListAttachmentResponseDto,
  })
  async confirmTaskListAttachment(
    @Req() req: WorkspaceRequest,
    @Param('listId') listId: string,
    @Body() dto: ConfirmTaskListAttachmentDto,
  ): Promise<ApiResponse<TaskListAttachmentResponseDto>> {
    const result = await this.attachmentsService.confirmTaskListUpload(
      req.user.id,
      req.workspaceContext.workspaceId,
      listId,
      dto as ConfirmTaskListAttachmentInput,
    );
    return ok(result, 'Attachment created');
  }

  @Post('links')
  @ApiOperation({ summary: 'Create a task list link attachment' })
  @ApiParam({ name: 'listId', format: 'uuid' })
  @ApiBody({ type: CreateTaskListLinkDto })
  @ApiOkResponse({
    description: 'Task list link attachment created',
    type: TaskListAttachmentResponseDto,
  })
  async createTaskListLink(
    @Req() req: WorkspaceRequest,
    @Param('listId') listId: string,
    @Body() dto: CreateTaskListLinkDto,
  ): Promise<ApiResponse<TaskListAttachmentResponseDto>> {
    const result = await this.attachmentsService.createTaskListLink(
      req.user.id,
      req.workspaceContext.workspaceId,
      listId,
      dto as CreateTaskListLinkInput,
    );
    return ok(result, 'Attachment link created');
  }

  @Get()
  @ApiOperation({ summary: 'List task list attachments' })
  @ApiParam({ name: 'listId', format: 'uuid' })
  @ApiOkResponse({
    description: 'Task list attachments returned',
    type: TaskListAttachmentListResponseDto,
  })
  async listTaskListAttachments(
    @Req() req: WorkspaceRequest,
    @Param('listId') listId: string,
    @Query() query: ListTaskListAttachmentsQueryDto,
  ): Promise<ApiResponse<TaskListAttachmentListResponseDto>> {
    const result = await this.attachmentsService.listTaskListAttachments(
      req.user.id,
      req.workspaceContext.workspaceId,
      listId,
      query as ListTaskListAttachmentsQuery,
    );
    return ok(result, 'Attachments returned');
  }

  @Get(':attachmentId')
  @ApiOperation({ summary: 'Get a task list attachment' })
  @ApiParam({ name: 'listId', format: 'uuid' })
  @ApiParam({ name: 'attachmentId', format: 'uuid' })
  @ApiOkResponse({
    description: 'Task list attachment returned',
    type: TaskListAttachmentResponseDto,
  })
  async getTaskListAttachment(
    @Req() req: WorkspaceRequest,
    @Param('listId') listId: string,
    @Param('attachmentId') attachmentId: string,
  ): Promise<ApiResponse<TaskListAttachmentResponseDto>> {
    const result = await this.attachmentsService.getTaskListAttachment(
      req.user.id,
      req.workspaceContext.workspaceId,
      listId,
      attachmentId,
    );
    return ok(result, 'Attachment returned');
  }

  @Patch(':attachmentId')
  @ApiOperation({ summary: 'Update task list attachment metadata' })
  @ApiParam({ name: 'listId', format: 'uuid' })
  @ApiParam({ name: 'attachmentId', format: 'uuid' })
  @ApiBody({ type: UpdateProjectAttachmentDto })
  @ApiOkResponse({
    description: 'Task list attachment updated',
    type: TaskListAttachmentResponseDto,
  })
  async updateTaskListAttachment(
    @Req() req: WorkspaceRequest,
    @Param('listId') listId: string,
    @Param('attachmentId') attachmentId: string,
    @Body() dto: UpdateProjectAttachmentDto,
  ): Promise<ApiResponse<TaskListAttachmentResponseDto>> {
    const result = await this.attachmentsService.updateTaskListAttachment(
      req.user.id,
      req.workspaceContext.workspaceId,
      req.workspaceContext.role,
      listId,
      attachmentId,
      dto as UpdateProjectAttachmentInput,
    );
    return ok(result, 'Attachment updated');
  }

  @Delete(':attachmentId')
  @ApiOperation({ summary: 'Delete a task list attachment' })
  @ApiParam({ name: 'listId', format: 'uuid' })
  @ApiParam({ name: 'attachmentId', format: 'uuid' })
  @SwaggerApiResponse({
    status: 200,
    description: 'Task list attachment deleted',
    type: DeleteAttachmentResponseDto,
  })
  async deleteTaskListAttachment(
    @Req() req: WorkspaceRequest,
    @Param('listId') listId: string,
    @Param('attachmentId') attachmentId: string,
  ) {
    const result = await this.attachmentsService.deleteTaskListAttachment(
      req.user.id,
      req.workspaceContext.workspaceId,
      req.workspaceContext.role,
      listId,
      attachmentId,
    );
    return ok(result, 'Attachment deleted');
  }
}
