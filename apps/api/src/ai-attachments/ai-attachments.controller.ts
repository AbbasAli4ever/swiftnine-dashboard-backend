import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiHeader, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { ok, type ApiResponse as ApiRes } from '@app/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { WorkspaceGuard } from '../workspace/workspace.guard';
import type { WorkspaceRequest } from '../workspace/workspace.types';
import { AiAttachmentsService } from './ai-attachments.service';
import { ConfirmAiAttachmentDto, type ConfirmAiAttachmentInput } from './dto/confirm-ai-attachment.dto';
import { ListAiAttachmentsQueryDto, type ListAiAttachmentsQuery } from './dto/list-ai-attachments.query.dto';
import { PresignAiAttachmentDto, type PresignAiAttachmentInput } from './dto/presign-ai-attachment.dto';

@ApiTags('ai-attachments')
@ApiBearerAuth()
@ApiHeader({ name: 'x-workspace-id', required: true, description: 'Active workspace ID' })
@Controller()
@UseGuards(JwtAuthGuard, WorkspaceGuard)
export class AiAttachmentsController {
  constructor(private readonly service: AiAttachmentsService) {}

  @Post('ai-attachments/presign')
  @ApiOperation({ summary: 'Create a presigned S3 upload URL for a SwiftBot chat attachment' })
  async presign(
    @Req() req: WorkspaceRequest,
    @Body() dto: PresignAiAttachmentDto,
  ): Promise<ApiRes<unknown>> {
    const result = await this.service.presign(
      req.user.id,
      req.workspaceContext.workspaceId,
      dto as PresignAiAttachmentInput,
    );
    return ok(result, 'Presigned URL generated');
  }

  @Post('ai-attachments/:id/confirm')
  @ApiOperation({ summary: 'Confirm a SwiftBot attachment upload and optionally link it to a message' })
  @ApiParam({ name: 'id', format: 'uuid' })
  async confirm(
    @Req() req: WorkspaceRequest,
    @Param('id') id: string,
    @Body() dto: ConfirmAiAttachmentDto,
  ): Promise<ApiRes<unknown>> {
    const result = await this.service.confirm(
      req.user.id,
      req.workspaceContext.workspaceId,
      id,
      dto as ConfirmAiAttachmentInput,
    );
    return ok(result, 'Attachment confirmed');
  }

  @Get('ai-attachments')
  @ApiOperation({ summary: 'List SwiftBot attachments, optionally filtered by conversation' })
  async list(
    @Req() req: WorkspaceRequest,
    @Query() query: ListAiAttachmentsQueryDto,
  ): Promise<ApiRes<unknown>> {
    const result = await this.service.list(
      req.user.id,
      req.workspaceContext.workspaceId,
      query as ListAiAttachmentsQuery,
    );
    return ok(result);
  }

  @Get('ai-attachments/:id')
  @ApiOperation({ summary: 'Get a single SwiftBot attachment' })
  @ApiParam({ name: 'id', format: 'uuid' })
  async getOne(@Req() req: WorkspaceRequest, @Param('id') id: string): Promise<ApiRes<unknown>> {
    const result = await this.service.getOne(req.user.id, req.workspaceContext.workspaceId, id);
    return ok(result);
  }

  @Delete('ai-attachments/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a SwiftBot attachment (soft delete)' })
  @ApiParam({ name: 'id', format: 'uuid' })
  async remove(@Req() req: WorkspaceRequest, @Param('id') id: string): Promise<ApiRes<unknown>> {
    const result = await this.service.remove(req.user.id, req.workspaceContext.workspaceId, id);
    return ok(result, 'Attachment deleted');
  }

  @Get('ai-conversations/:conversationId/attachments')
  @ApiOperation({ summary: 'List attachments for a conversation' })
  @ApiParam({ name: 'conversationId', format: 'uuid' })
  async listForConversation(
    @Req() req: WorkspaceRequest,
    @Param('conversationId') conversationId: string,
  ): Promise<ApiRes<unknown>> {
    const result = await this.service.listForConversation(
      req.user.id,
      req.workspaceContext.workspaceId,
      conversationId,
    );
    return ok(result);
  }
}
