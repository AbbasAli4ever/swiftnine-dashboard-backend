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
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiHeader, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { WorkspaceGuard } from '../workspace/workspace.guard';
import type { WorkspaceRequest } from '../workspace/workspace.types';
import { ok, type ApiResponse as ApiRes } from '@app/common';
import { AiConversationsService } from './ai-conversations.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { UpdateConversationDto } from './dto/update-conversation.dto';
import { CreateMessageDto } from './dto/create-message.dto';

@ApiTags('ai-conversations')
@ApiBearerAuth()
@Controller('ai-conversations')
@UseGuards(JwtAuthGuard, WorkspaceGuard)
@ApiHeader({ name: 'x-workspace-id', required: true, description: 'Active workspace ID' })
export class AiConversationsController {
  constructor(private readonly service: AiConversationsService) {}

  @Get()
  @ApiOperation({
    summary: "List the current user's AI conversations in this workspace, most recently updated first",
  })
  async findAll(@Req() req: WorkspaceRequest): Promise<ApiRes<unknown>> {
    const items = await this.service.findAll(req.workspaceContext.workspaceId, req.user.id);
    return ok(items);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new AI conversation' })
  async create(
    @Req() req: WorkspaceRequest,
    @Body() dto: CreateConversationDto,
  ): Promise<ApiRes<unknown>> {
    const conversation = await this.service.create(
      req.workspaceContext.workspaceId,
      req.user.id,
      dto,
    );
    return ok(conversation, 'Conversation created successfully');
  }

  @Get(':conversationId')
  @ApiOperation({ summary: 'Get a conversation with its full message list' })
  @ApiParam({ name: 'conversationId', description: 'Conversation UUID' })
  async findOne(
    @Req() req: WorkspaceRequest,
    @Param('conversationId') conversationId: string,
  ): Promise<ApiRes<unknown>> {
    const conversation = await this.service.findOne(
      req.workspaceContext.workspaceId,
      req.user.id,
      conversationId,
    );
    return ok(conversation);
  }

  @Patch(':conversationId')
  @ApiOperation({ summary: 'Rename a conversation' })
  @ApiParam({ name: 'conversationId', description: 'Conversation UUID' })
  async rename(
    @Req() req: WorkspaceRequest,
    @Param('conversationId') conversationId: string,
    @Body() dto: UpdateConversationDto,
  ): Promise<ApiRes<unknown>> {
    const conversation = await this.service.rename(
      req.workspaceContext.workspaceId,
      req.user.id,
      conversationId,
      dto,
    );
    return ok(conversation, 'Conversation renamed successfully');
  }

  @Delete(':conversationId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a conversation (soft delete)' })
  @ApiParam({ name: 'conversationId', description: 'Conversation UUID' })
  async remove(
    @Req() req: WorkspaceRequest,
    @Param('conversationId') conversationId: string,
  ): Promise<ApiRes<null>> {
    await this.service.remove(req.workspaceContext.workspaceId, req.user.id, conversationId);
    return ok(null, 'Conversation deleted successfully');
  }

  @Post(':conversationId/messages')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Append a message (user turn or assistant turn) to a conversation' })
  @ApiParam({ name: 'conversationId', description: 'Conversation UUID' })
  async addMessage(
    @Req() req: WorkspaceRequest,
    @Param('conversationId') conversationId: string,
    @Body() dto: CreateMessageDto,
  ): Promise<ApiRes<unknown>> {
    const message = await this.service.addMessage(
      req.workspaceContext.workspaceId,
      req.user.id,
      conversationId,
      dto,
    );
    return ok(message, 'Message added');
  }

  @Delete(':conversationId/messages/:messageId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a single message (used when regenerating a response)' })
  @ApiParam({ name: 'conversationId', description: 'Conversation UUID' })
  @ApiParam({ name: 'messageId', description: 'Message UUID' })
  async removeMessage(
    @Req() req: WorkspaceRequest,
    @Param('conversationId') conversationId: string,
    @Param('messageId') messageId: string,
  ): Promise<ApiRes<null>> {
    await this.service.removeMessage(
      req.workspaceContext.workspaceId,
      req.user.id,
      conversationId,
      messageId,
    );
    return ok(null, 'Message deleted');
  }
}
