import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { WorkspaceGuard } from '../workspace/workspace.guard';
import { CommentsService } from './comments.service';
import { SseService } from './sse.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { CreateReactionDto } from './dto/create-reaction.dto';
import { ok, type ApiResponse as ApiRes } from '@app/common';
import type { WorkspaceRequest } from '../workspace/workspace.types';
import type { Response } from 'express';

@ApiTags('comments')
@Controller()
export class CommentsController {
  constructor(private readonly commentsService: CommentsService, private readonly sse: SseService) {}

  @Get('tasks/:taskId/comments/stream')
  @UseGuards(JwtAuthGuard, WorkspaceGuard)
  @ApiBearerAuth()
  @ApiHeader({ name: 'x-workspace-id', required: true })
  @ApiOperation({ summary: 'Open SSE stream for a task comments and reactions' })
  async stream(
    @Req() req: WorkspaceRequest,
    @Param('taskId') taskId: string,
    @Res() res: Response,
  ) {
    const comments = await this.commentsService.getCommentsForTask(req.workspaceContext.workspaceId, taskId);

    this.sse.registerClient(taskId, res);
    this.sse.sendToClient(res, 'comments:init', comments);
  }

  @Post('tasks/:taskId/comments')
  @UseGuards(JwtAuthGuard, WorkspaceGuard)
  @ApiBearerAuth()
  @ApiHeader({ name: 'x-workspace-id', required: true })
  @ApiOperation({ summary: 'Create a comment on a task' })
  @ApiResponse({ status: 201, description: 'Comment created' })
  async create(
    @Req() req: WorkspaceRequest,
    @Param('taskId') taskId: string,
    @Body() dto: CreateCommentDto,
  ): Promise<ApiRes<any>> {
    const comment = await this.commentsService.createComment(
      req.workspaceContext.workspaceId,
      req.user.id,
      taskId,
      dto.content,
      dto.parentId,
      dto.mentionedUserIds,
    );
    return ok(comment, 'Comment created');
  }

  @Put('comments/:commentId')
  @UseGuards(JwtAuthGuard, WorkspaceGuard)
  @ApiBearerAuth()
  @ApiHeader({ name: 'x-workspace-id', required: true })
  @ApiOperation({ summary: 'Update a comment (allowed within 5 minutes of creation)' })
  @ApiResponse({ status: 200, description: 'Comment updated' })
  async update(
    @Req() req: WorkspaceRequest,
    @Param('commentId') commentId: string,
    @Body() dto: UpdateCommentDto,
  ): Promise<ApiRes<any>> {
    const updated = await this.commentsService.updateComment(
      req.workspaceContext.workspaceId,
      req.user.id,
      commentId,
      dto.content,
      dto.mentionedUserIds,
    );
    return ok(updated, 'Comment updated');
  }

  @Delete('comments/:commentId')
  @UseGuards(JwtAuthGuard, WorkspaceGuard)
  @ApiBearerAuth()
  @ApiHeader({ name: 'x-workspace-id', required: true })
  @ApiOperation({ summary: 'Delete a comment' })
  @ApiResponse({ status: 200, description: 'Comment deleted' })
  async remove(@Req() req: WorkspaceRequest, @Param('commentId') commentId: string): Promise<ApiRes<null>> {
    await this.commentsService.deleteComment(
      req.workspaceContext.workspaceId,
      req.user.id,
      commentId,
      req.workspaceContext.role,
    );
    return ok(null, 'Comment deleted');
  }

  @Post('comments/:commentId/reactions')
  @UseGuards(JwtAuthGuard, WorkspaceGuard)
  @ApiBearerAuth()
  @ApiHeader({ name: 'x-workspace-id', required: true })
  @ApiOperation({ summary: 'Add a reaction to a comment' })
  @ApiResponse({ status: 201, description: 'Reaction created' })
  async addReaction(
    @Req() req: WorkspaceRequest,
    @Param('commentId') commentId: string,
    @Body() dto: CreateReactionDto,
  ) {
    const reaction = await this.commentsService.addReaction(
      req.workspaceContext.workspaceId,
      req.user.id,
      commentId,
      dto.reactFace,
    );
    return ok(reaction, 'Reaction created');
  }

  @Patch('reactions/:reactionId')
  @UseGuards(JwtAuthGuard, WorkspaceGuard)
  @ApiBearerAuth()
  @ApiHeader({ name: 'x-workspace-id', required: true })
  @ApiOperation({ summary: 'Update a reaction on a comment' })
  @ApiResponse({ status: 200, description: 'Reaction updated' })
  async updateReaction(
    @Req() req: WorkspaceRequest,
    @Param('reactionId') reactionId: string,
    @Body() dto: CreateReactionDto,
  ) {
    const updated = await this.commentsService.updateReaction(
      req.workspaceContext.workspaceId,
      req.user.id,
      reactionId,
      dto.reactFace,
    );
    return ok(updated, 'Reaction updated');
  }

  @Delete('reactions/:reactionId')
  @UseGuards(JwtAuthGuard, WorkspaceGuard)
  @ApiBearerAuth()
  @ApiHeader({ name: 'x-workspace-id', required: true })
  @ApiOperation({ summary: 'Delete a reaction' })
  @ApiResponse({ status: 200, description: 'Reaction deleted' })
  async deleteReaction(@Req() req: WorkspaceRequest, @Param('reactionId') reactionId: string) {
    await this.commentsService.deleteReaction(req.workspaceContext.workspaceId, req.user.id, reactionId);
    return ok(null, 'Reaction deleted');
  }
}
