import { Body, Controller, Post, Req, UseGuards, Delete } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AttachmentsService } from './attachments.service';
import { PresignAttachmentDto } from './dto/presign-attachment.dto';
import { PresignResponseDto } from './dto/presign-response.dto';
import { ok } from '@app/common';
import type { Request } from 'express';
import type { AuthUser } from '../auth/auth.service';
import { CreateAttachmentDto } from './dto/create-attachment.dto';
import { ViewAttachmentsDto } from './dto/view-attachments.dto';
import { DeleteAttachmentDto } from './dto/delete-attachment.dto';
import { AttachmentDto } from './dto/attachment.dto';
import { ViewAttachmentResponseDto } from './dto/view-attachment-response.dto';
import { DeleteAttachmentResponseDto } from './dto/delete-attachment-response.dto';
import { ApiNotFoundResponse, ApiForbiddenResponse } from '@nestjs/swagger';
import { CreateDocAttachmentDto } from './dto/create-doc-attachment.dto';
import { ViewDocAttachmentsDto } from './dto/view-doc-attachments.dto';
import { DeleteDocAttachmentDto } from './dto/delete-doc-attachment.dto';

type AuthenticatedRequest = Request & { user: AuthUser };

@ApiTags('attachments')
@Controller('attachments')
export class AttachmentsController {
  constructor(private readonly attachmentsService: AttachmentsService) {}

  @Post('presign')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a presigned S3 upload URL' })
  @ApiBody({ type: PresignAttachmentDto })
  @ApiResponse({ status: 200, description: 'Presigned URL generated', type: PresignResponseDto })
  @ApiResponse({ status: 401, description: 'Authentication required' })
  async presign(@Req() req: AuthenticatedRequest, @Body() dto: PresignAttachmentDto) {
    const result = await this.attachmentsService.presignUpload(req.user.id, dto);
    return ok(result, 'Presigned URL generated');
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create attachment record after upload' })
  @ApiBody({ type: CreateAttachmentDto })
  @ApiResponse({ status: 200, description: 'Attachment recorded', type: AttachmentDto })
  @ApiResponse({ status: 401, description: 'Authentication required' })
  @ApiNotFoundResponse({ description: 'Task or member not found' })
  @ApiForbiddenResponse({ description: 'Actor mismatch' })
  async create(@Req() req: AuthenticatedRequest, @Body() dto: CreateAttachmentDto) {
    const result = await this.attachmentsService.createAttachment(
      req.user.id,
      dto.taskId,
      dto.memberId,
      dto.s3Key,
      dto.fileName,
      dto.mimeType,
      dto.fileSize,
    );
    return ok(result, 'Attachment created');
  }

  @Post('docs')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create attachment record for a document after upload' })
  @ApiBody({ type: CreateDocAttachmentDto })
  @ApiResponse({ status: 200, description: 'Document attachment recorded', type: AttachmentDto })
  @ApiResponse({ status: 401, description: 'Authentication required' })
  @ApiNotFoundResponse({ description: 'Document not found' })
  @ApiForbiddenResponse({ description: 'Document edit access required' })
  async createForDoc(@Req() req: AuthenticatedRequest, @Body() dto: CreateDocAttachmentDto) {
    const result = await this.attachmentsService.createAttachmentForDoc(
      req.user.id,
      dto.docId,
      dto.s3Key,
      dto.fileName,
      dto.mimeType,
      dto.fileSize,
    );
    return ok(result, 'Attachment created');
  }

  @Post('view')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List and get presigned view URLs for attachments on a task' })
  @ApiBody({ type: ViewAttachmentsDto })
  @ApiResponse({ status: 200, description: 'Attachment URLs returned', type: ViewAttachmentResponseDto, isArray: true })
  @ApiResponse({ status: 401, description: 'Authentication required' })
  async view(@Req() req: AuthenticatedRequest, @Body() dto: ViewAttachmentsDto) {
    const result = await this.attachmentsService.listAttachmentsForTask(req.user.id, dto.taskId, dto.memberId);
    return ok(result, 'Attachments returned');
  }

  @Post('docs/view')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List and get presigned view URLs for attachments on a document' })
  @ApiBody({ type: ViewDocAttachmentsDto })
  @ApiResponse({ status: 200, description: 'Document attachment URLs returned', type: ViewAttachmentResponseDto, isArray: true })
  @ApiResponse({ status: 401, description: 'Authentication required' })
  async viewForDoc(@Req() req: AuthenticatedRequest, @Body() dto: ViewDocAttachmentsDto) {
    const result = await this.attachmentsService.listAttachmentsForDoc(req.user.id, dto.docId);
    return ok(result, 'Attachments returned');
  }

  @Delete()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete an attachment for a task' })
  @ApiBody({ type: DeleteAttachmentDto })
  @ApiResponse({ status: 200, description: 'Attachment deleted', type: DeleteAttachmentResponseDto })
  @ApiResponse({ status: 401, description: 'Authentication required' })
  async remove(@Req() req: AuthenticatedRequest, @Body() dto: DeleteAttachmentDto) {
    const result = await this.attachmentsService.deleteAttachment(req.user.id, dto.taskId, dto.memberId, dto.s3Key);
    return ok(result, 'Attachment deleted');
  }

  @Delete('docs')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete an attachment for a document' })
  @ApiBody({ type: DeleteDocAttachmentDto })
  @ApiResponse({ status: 200, description: 'Document attachment deleted', type: DeleteAttachmentResponseDto })
  @ApiResponse({ status: 401, description: 'Authentication required' })
  async removeForDoc(@Req() req: AuthenticatedRequest, @Body() dto: DeleteDocAttachmentDto) {
    const result = await this.attachmentsService.deleteAttachmentForDoc(req.user.id, dto.docId, dto.s3Key);
    return ok(result, 'Attachment deleted');
  }
}
