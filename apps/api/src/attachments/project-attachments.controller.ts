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
import { ProjectUnlockedGuard } from '../project-security/guards/project-unlocked.guard';
import { WorkspaceGuard } from '../workspace/workspace.guard';
import type { WorkspaceRequest } from '../workspace/workspace.types';
import { AttachmentsService } from './attachments.service';
import {
  ConfirmProjectAttachmentDto,
  type ConfirmProjectAttachmentInput,
} from './dto/confirm-project-attachment.dto';
import {
  CreateProjectLinkDto,
  type CreateProjectLinkInput,
} from './dto/create-project-link.dto';
import {
  ListProjectAttachmentsQueryDto,
  type ListProjectAttachmentsQuery,
} from './dto/list-project-attachments.query.dto';
import {
  PresignProjectAttachmentDto,
  type PresignProjectAttachmentInput,
} from './dto/presign-project-attachment.dto';
import {
  ProjectAttachmentListResponseDto,
  ProjectAttachmentResponseDto,
} from './dto/project-attachment-response.dto';
import {
  UpdateProjectAttachmentDto,
  type UpdateProjectAttachmentInput,
} from './dto/update-project-attachment.dto';
import { PresignResponseDto } from './dto/presign-response.dto';
import { DeleteAttachmentResponseDto } from './dto/delete-attachment-response.dto';

@ApiTags('project attachments')
@ApiBearerAuth()
@ApiHeader({
  name: 'x-workspace-id',
  required: true,
  description: 'Active workspace ID',
})
@Controller('projects/:projectId/attachments')
@UseGuards(JwtAuthGuard, WorkspaceGuard, ProjectUnlockedGuard)
export class ProjectAttachmentsController {
  constructor(private readonly attachmentsService: AttachmentsService) {}

  @Post('presign')
  @ApiOperation({ summary: 'Create a presigned S3 upload URL for a project file' })
  @ApiParam({ name: 'projectId', format: 'uuid' })
  @ApiBody({ type: PresignProjectAttachmentDto })
  @ApiOkResponse({
    description: 'Presigned URL generated',
    type: PresignResponseDto,
  })
  async presignProjectAttachment(
    @Req() req: WorkspaceRequest,
    @Param('projectId') projectId: string,
    @Body() dto: PresignProjectAttachmentDto,
  ) {
    const result = await this.attachmentsService.presignProjectUpload(
      req.user.id,
      req.workspaceContext.workspaceId,
      projectId,
      dto as PresignProjectAttachmentInput,
    );
    return ok(result, 'Presigned URL generated');
  }

  @Post('confirm')
  @ApiOperation({ summary: 'Confirm project file upload and create attachment' })
  @ApiParam({ name: 'projectId', format: 'uuid' })
  @ApiBody({ type: ConfirmProjectAttachmentDto })
  @ApiOkResponse({
    description: 'Project file attachment created',
    type: ProjectAttachmentResponseDto,
  })
  async confirmProjectAttachment(
    @Req() req: WorkspaceRequest,
    @Param('projectId') projectId: string,
    @Body() dto: ConfirmProjectAttachmentDto,
  ): Promise<ApiResponse<ProjectAttachmentResponseDto>> {
    const result = await this.attachmentsService.confirmProjectUpload(
      req.user.id,
      req.workspaceContext.workspaceId,
      projectId,
      dto as ConfirmProjectAttachmentInput,
    );
    return ok(result, 'Attachment created');
  }

  @Post('links')
  @ApiOperation({ summary: 'Create a project link attachment' })
  @ApiParam({ name: 'projectId', format: 'uuid' })
  @ApiBody({ type: CreateProjectLinkDto })
  @ApiOkResponse({
    description: 'Project link attachment created',
    type: ProjectAttachmentResponseDto,
  })
  async createProjectLink(
    @Req() req: WorkspaceRequest,
    @Param('projectId') projectId: string,
    @Body() dto: CreateProjectLinkDto,
  ): Promise<ApiResponse<ProjectAttachmentResponseDto>> {
    const result = await this.attachmentsService.createProjectLink(
      req.user.id,
      req.workspaceContext.workspaceId,
      projectId,
      dto as CreateProjectLinkInput,
    );
    return ok(result, 'Attachment link created');
  }

  @Get()
  @ApiOperation({ summary: 'List project attachments' })
  @ApiParam({ name: 'projectId', format: 'uuid' })
  @ApiOkResponse({
    description: 'Project attachments returned',
    type: ProjectAttachmentListResponseDto,
  })
  async listProjectAttachments(
    @Req() req: WorkspaceRequest,
    @Param('projectId') projectId: string,
    @Query() query: ListProjectAttachmentsQueryDto,
  ): Promise<ApiResponse<ProjectAttachmentListResponseDto>> {
    const result = await this.attachmentsService.listProjectAttachments(
      req.user.id,
      req.workspaceContext.workspaceId,
      projectId,
      query as ListProjectAttachmentsQuery,
    );
    return ok(result, 'Attachments returned');
  }

  @Get(':attachmentId')
  @ApiOperation({ summary: 'Get a project attachment' })
  @ApiParam({ name: 'projectId', format: 'uuid' })
  @ApiParam({ name: 'attachmentId', format: 'uuid' })
  @ApiOkResponse({
    description: 'Project attachment returned',
    type: ProjectAttachmentResponseDto,
  })
  async getProjectAttachment(
    @Req() req: WorkspaceRequest,
    @Param('projectId') projectId: string,
    @Param('attachmentId') attachmentId: string,
  ): Promise<ApiResponse<ProjectAttachmentResponseDto>> {
    const result = await this.attachmentsService.getProjectAttachment(
      req.user.id,
      req.workspaceContext.workspaceId,
      projectId,
      attachmentId,
    );
    return ok(result, 'Attachment returned');
  }

  @Patch(':attachmentId')
  @ApiOperation({ summary: 'Update project attachment metadata' })
  @ApiParam({ name: 'projectId', format: 'uuid' })
  @ApiParam({ name: 'attachmentId', format: 'uuid' })
  @ApiBody({ type: UpdateProjectAttachmentDto })
  @ApiOkResponse({
    description: 'Project attachment updated',
    type: ProjectAttachmentResponseDto,
  })
  async updateProjectAttachment(
    @Req() req: WorkspaceRequest,
    @Param('projectId') projectId: string,
    @Param('attachmentId') attachmentId: string,
    @Body() dto: UpdateProjectAttachmentDto,
  ): Promise<ApiResponse<ProjectAttachmentResponseDto>> {
    const result = await this.attachmentsService.updateProjectAttachment(
      req.user.id,
      req.workspaceContext.workspaceId,
      req.workspaceContext.role,
      projectId,
      attachmentId,
      dto as UpdateProjectAttachmentInput,
    );
    return ok(result, 'Attachment updated');
  }

  @Delete(':attachmentId')
  @ApiOperation({ summary: 'Delete a project attachment' })
  @ApiParam({ name: 'projectId', format: 'uuid' })
  @ApiParam({ name: 'attachmentId', format: 'uuid' })
  @SwaggerApiResponse({
    status: 200,
    description: 'Project attachment deleted',
    type: DeleteAttachmentResponseDto,
  })
  async deleteProjectAttachment(
    @Req() req: WorkspaceRequest,
    @Param('projectId') projectId: string,
    @Param('attachmentId') attachmentId: string,
  ) {
    const result = await this.attachmentsService.deleteProjectAttachment(
      req.user.id,
      req.workspaceContext.workspaceId,
      req.workspaceContext.role,
      projectId,
      attachmentId,
    );
    return ok(result, 'Attachment deleted');
  }
}
