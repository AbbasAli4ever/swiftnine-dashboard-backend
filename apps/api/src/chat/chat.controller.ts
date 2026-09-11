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
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { WorkspaceGuard } from '../workspace/workspace.guard';
import type { WorkspaceRequest } from '../workspace/workspace.types';
import { AddReactionDto } from './dto/add-reaction.dto';
import { BulkDeleteMessagesDto } from './dto/bulk-delete-messages.dto';
import { ChannelAttachmentsResponseDto } from './dto/channel-attachments-response.dto';
import { CreateDmDto } from './dto/create-dm.dto';
import { EditMessageDto } from './dto/edit-message.dto';
import { ListDmsQueryDto, type ListDmsQuery } from './dto/list-dms-query.dto';
import {
  ListMessagesDto,
  type ListMessagesQuery,
} from './dto/list-messages.dto';
import {
  MessageContextDto,
  type MessageContextQuery,
} from './dto/message-context.dto';
import {
  BulkDeleteMessagesResponseDto,
  ChatArchiveStateResponseDto,
  ChatChannelResponseDto,
  ChatFavouriteStateResponseDto,
  ChatMessageContextResponseDto,
  ChatMessageListResponseDto,
  ChatMessageResponseDto,
  ChatMuteStateResponseDto,
  ChatReadStateResponseDto,
  GlobalSearchResponseDto,
} from './dto/message-response.dto';
import { GlobalSearchDto, type GlobalSearchQuery } from './dto/global-search.dto';
import { MarkReadDto } from './dto/mark-read.dto';
import {
  SearchMessagesDto,
  type SearchMessagesQuery,
} from './dto/search-messages.dto';
import { SendMessageDto } from './dto/send-message.dto';
import { ChatService } from './chat.service';

@ApiTags('chat')
@ApiBearerAuth()
@Controller('chat')
@UseGuards(JwtAuthGuard, WorkspaceGuard)
@ApiHeader({
  name: 'x-workspace-id',
  required: true,
  description: 'Active workspace ID',
})
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('channels/:channelId/messages')
  @ApiOperation({ summary: 'List channel messages, newest first' })
  @ApiParam({ name: 'channelId', description: 'Channel id' })
  @ApiResponse({ status: 200, type: ChatMessageListResponseDto })
  async listMessages(
    @Req() req: WorkspaceRequest,
    @Param('channelId') channelId: string,
    @Query() query: ListMessagesDto,
  ): Promise<ApiRes<any>> {
    const result = await this.chatService.listMessages(
      req.workspaceContext.workspaceId,
      req.user.id,
      channelId,
      query as ListMessagesQuery,
    );
    return ok(result);
  }

  @Get('channels/:channelId/messages/context')
  @ApiOperation({ summary: 'Load message context around a specific anchor message' })
  @ApiParam({ name: 'channelId', description: 'Channel id' })
  @ApiResponse({ status: 200, type: ChatMessageContextResponseDto })
  async getMessageContext(
    @Req() req: WorkspaceRequest,
    @Param('channelId') channelId: string,
    @Query() query: MessageContextDto,
  ): Promise<ApiRes<any>> {
    const result = await this.chatService.getMessageContext(
      req.workspaceContext.workspaceId,
      req.user.id,
      channelId,
      query as MessageContextQuery,
    );
    return ok(result);
  }

  @Get('channels/:channelId/messages/pinned')
  @ApiOperation({ summary: 'List pinned channel messages' })
  @ApiParam({ name: 'channelId', description: 'Channel id' })
  @ApiResponse({ status: 200, type: ChatMessageResponseDto, isArray: true })
  async listPinnedMessages(
    @Req() req: WorkspaceRequest,
    @Param('channelId') channelId: string,
  ): Promise<ApiRes<any>> {
    const result = await this.chatService.listPinnedMessages(
      req.workspaceContext.workspaceId,
      req.user.id,
      channelId,
    );
    return ok(result);
  }

  @Get('channels/:channelId/attachments')
  @ApiOperation({
    summary:
      'List every attachment ever shared in a channel or DM, grouped by type',
    description:
      "Scans the channel's entire message history — not one message. Each item's url is a signed S3 link generated fresh on this call, expiring in 15 minutes — re-call this endpoint to render attachments again rather than caching the returned URLs.",
  })
  @ApiParam({ name: 'channelId', description: 'Channel id' })
  @ApiResponse({ status: 200, type: ChannelAttachmentsResponseDto })
  async listChannelAttachments(
    @Req() req: WorkspaceRequest,
    @Param('channelId') channelId: string,
  ): Promise<ApiRes<any>> {
    const result = await this.chatService.listChannelAttachments(
      req.workspaceContext.workspaceId,
      req.user.id,
      channelId,
    );
    return ok(result);
  }

  @Post('channels/:channelId/messages')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Send a channel message' })
  @ApiParam({ name: 'channelId', description: 'Channel id' })
  @ApiBody({ type: SendMessageDto })
  @ApiResponse({ status: 201, type: ChatMessageResponseDto })
  async sendMessage(
    @Req() req: WorkspaceRequest,
    @Param('channelId') channelId: string,
    @Body() dto: SendMessageDto,
  ): Promise<ApiRes<any>> {
    const result = await this.chatService.sendMessage(
      req.workspaceContext.workspaceId,
      req.user.id,
      channelId,
      dto,
    );
    return ok(result, 'Message sent');
  }

  @Patch('messages/:messageId')
  @ApiOperation({ summary: 'Edit a channel message' })
  @ApiParam({ name: 'messageId', description: 'Message id' })
  @ApiBody({ type: EditMessageDto })
  @ApiResponse({ status: 200, type: ChatMessageResponseDto })
  async editMessage(
    @Req() req: WorkspaceRequest,
    @Param('messageId') messageId: string,
    @Body() dto: EditMessageDto,
  ): Promise<ApiRes<any>> {
    const result = await this.chatService.editMessage(
      req.workspaceContext.workspaceId,
      req.user.id,
      messageId,
      dto,
    );
    return ok(result, 'Message updated');
  }

  @Delete('messages/:messageId')
  @ApiOperation({ summary: 'Soft delete a channel message' })
  @ApiParam({ name: 'messageId', description: 'Message id' })
  @ApiResponse({ status: 200, type: ChatMessageResponseDto })
  async deleteMessage(
    @Req() req: WorkspaceRequest,
    @Param('messageId') messageId: string,
  ): Promise<ApiRes<any>> {
    const result = await this.chatService.deleteMessage(
      req.workspaceContext.workspaceId,
      req.user.id,
      messageId,
    );
    return ok(result, 'Message deleted');
  }

  @Delete('channels/:channelId/messages')
  @ApiOperation({
    summary: 'Bulk delete messages in a channel or DM',
    description:
      'Same rules as single delete (author, or channel OWNER/ADMIN; SYSTEM messages are ' +
      'immutable), applied per message rather than all-or-nothing — messages you cannot ' +
      'delete are skipped and reported in `failed` rather than failing the whole call. Works ' +
      'identically for DMs, which are just 2-member channels.',
  })
  @ApiParam({ name: 'channelId', description: 'Channel or DM id' })
  @ApiBody({ type: BulkDeleteMessagesDto })
  @ApiResponse({ status: 200, type: BulkDeleteMessagesResponseDto })
  async bulkDeleteMessages(
    @Req() req: WorkspaceRequest,
    @Param('channelId') channelId: string,
    @Body() dto: BulkDeleteMessagesDto,
  ): Promise<ApiRes<any>> {
    const result = await this.chatService.bulkDeleteMessages(
      req.workspaceContext.workspaceId,
      req.user.id,
      channelId,
      dto.messageIds,
    );
    return ok(result, 'Messages processed');
  }

  @Post('messages/:messageId/reactions')
  @ApiOperation({ summary: 'Toggle a message reaction' })
  @ApiParam({ name: 'messageId', description: 'Message id' })
  @ApiBody({ type: AddReactionDto })
  @ApiResponse({ status: 200, description: 'Reaction toggled' })
  async toggleReaction(
    @Req() req: WorkspaceRequest,
    @Param('messageId') messageId: string,
    @Body() dto: AddReactionDto,
  ): Promise<ApiRes<any>> {
    const result = await this.chatService.toggleReaction(
      req.workspaceContext.workspaceId,
      req.user.id,
      messageId,
      dto.emoji,
    );
    return ok(result, `Reaction ${result.action}`);
  }

  @Post('messages/:messageId/pin')
  @ApiOperation({ summary: 'Pin a message' })
  @ApiParam({ name: 'messageId', description: 'Message id' })
  @ApiResponse({ status: 200, type: ChatMessageResponseDto })
  async pinMessage(
    @Req() req: WorkspaceRequest,
    @Param('messageId') messageId: string,
  ): Promise<ApiRes<any>> {
    const result = await this.chatService.pinMessage(
      req.workspaceContext.workspaceId,
      req.user.id,
      messageId,
    );
    return ok(result, 'Message pinned');
  }

  @Delete('messages/:messageId/pin')
  @ApiOperation({ summary: 'Unpin a message' })
  @ApiParam({ name: 'messageId', description: 'Message id' })
  @ApiResponse({ status: 200, type: ChatMessageResponseDto })
  async unpinMessage(
    @Req() req: WorkspaceRequest,
    @Param('messageId') messageId: string,
  ): Promise<ApiRes<any>> {
    const result = await this.chatService.unpinMessage(
      req.workspaceContext.workspaceId,
      req.user.id,
      messageId,
    );
    return ok(result, 'Message unpinned');
  }

  @Post('channels/:channelId/read')
  @ApiOperation({ summary: 'Mark a channel as read up to a specific message' })
  @ApiParam({ name: 'channelId', description: 'Channel id' })
  @ApiBody({ type: MarkReadDto })
  @ApiResponse({ status: 200, type: ChatReadStateResponseDto })
  async markRead(
    @Req() req: WorkspaceRequest,
    @Param('channelId') channelId: string,
    @Body() dto: MarkReadDto,
  ): Promise<ApiRes<any>> {
    const result = await this.chatService.markRead(
      req.workspaceContext.workspaceId,
      req.user.id,
      channelId,
      dto,
    );
    return ok(result, 'Read state updated');
  }

  @Post('channels/:channelId/mute')
  @ApiOperation({ summary: 'Mute a channel for the current user' })
  @ApiParam({ name: 'channelId', description: 'Channel id' })
  @ApiResponse({ status: 200, type: ChatMuteStateResponseDto })
  async mute(
    @Req() req: WorkspaceRequest,
    @Param('channelId') channelId: string,
  ): Promise<ApiRes<any>> {
    const result = await this.chatService.setMute(
      req.workspaceContext.workspaceId,
      req.user.id,
      channelId,
      true,
    );
    return ok(result, 'Channel muted');
  }

  @Post('channels/:channelId/unmute')
  @ApiOperation({ summary: 'Unmute a channel for the current user' })
  @ApiParam({ name: 'channelId', description: 'Channel id' })
  @ApiResponse({ status: 200, type: ChatMuteStateResponseDto })
  async unmute(
    @Req() req: WorkspaceRequest,
    @Param('channelId') channelId: string,
  ): Promise<ApiRes<any>> {
    const result = await this.chatService.setMute(
      req.workspaceContext.workspaceId,
      req.user.id,
      channelId,
      false,
    );
    return ok(result, 'Channel unmuted');
  }

  @Post('channels/:channelId/archive')
  @ApiOperation({
    summary: 'Archive a channel/DM for the current user',
    description:
      "Per-person only — hides it from the caller's own list (see GET /chat/dms and its archived filter). Has no effect on any other member.",
  })
  @ApiParam({ name: 'channelId', description: 'Channel id' })
  @ApiResponse({ status: 200, type: ChatArchiveStateResponseDto })
  async archive(
    @Req() req: WorkspaceRequest,
    @Param('channelId') channelId: string,
  ): Promise<ApiRes<any>> {
    const result = await this.chatService.setArchived(
      req.workspaceContext.workspaceId,
      req.user.id,
      channelId,
      true,
    );
    return ok(result, 'Channel archived');
  }

  @Post('channels/:channelId/unarchive')
  @ApiOperation({ summary: 'Unarchive a channel/DM for the current user' })
  @ApiParam({ name: 'channelId', description: 'Channel id' })
  @ApiResponse({ status: 200, type: ChatArchiveStateResponseDto })
  async unarchive(
    @Req() req: WorkspaceRequest,
    @Param('channelId') channelId: string,
  ): Promise<ApiRes<any>> {
    const result = await this.chatService.setArchived(
      req.workspaceContext.workspaceId,
      req.user.id,
      channelId,
      false,
    );
    return ok(result, 'Channel unarchived');
  }

  @Post('channels/:channelId/favourite')
  @ApiOperation({
    summary: 'Favourite a channel/DM for the current user',
    description:
      "Per-person only — stars it in only the caller's own list. Has no effect on any other member.",
  })
  @ApiParam({ name: 'channelId', description: 'Channel id' })
  @ApiResponse({ status: 200, type: ChatFavouriteStateResponseDto })
  async favourite(
    @Req() req: WorkspaceRequest,
    @Param('channelId') channelId: string,
  ): Promise<ApiRes<any>> {
    const result = await this.chatService.setFavourite(
      req.workspaceContext.workspaceId,
      req.user.id,
      channelId,
      true,
    );
    return ok(result, 'Channel favourited');
  }

  @Post('channels/:channelId/unfavourite')
  @ApiOperation({ summary: 'Unfavourite a channel/DM for the current user' })
  @ApiParam({ name: 'channelId', description: 'Channel id' })
  @ApiResponse({ status: 200, type: ChatFavouriteStateResponseDto })
  async unfavourite(
    @Req() req: WorkspaceRequest,
    @Param('channelId') channelId: string,
  ): Promise<ApiRes<any>> {
    const result = await this.chatService.setFavourite(
      req.workspaceContext.workspaceId,
      req.user.id,
      channelId,
      false,
    );
    return ok(result, 'Channel unfavourited');
  }

  @Post('dm')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create or return an existing DM channel' })
  @ApiBody({ type: CreateDmDto })
  @ApiResponse({ status: 201, type: ChatChannelResponseDto })
  async createDm(
    @Req() req: WorkspaceRequest,
    @Body() dto: CreateDmDto,
  ): Promise<ApiRes<any>> {
    const result = await this.chatService.createDm(
      req.workspaceContext.workspaceId,
      req.user.id,
      dto,
    );
    return ok(result, 'DM ready');
  }

  @Get('dms')
  @ApiOperation({
    summary: 'List the caller’s DM channels in the workspace',
    description:
      "Defaults to the caller's active (non-archived) DMs. Pass archived=true to list only the ones they've archived instead — archiving is per-person, so this never reflects what any other member has archived.",
  })
  @ApiQuery({
    name: 'archived',
    required: false,
    description: 'true to list only archived DMs. Defaults to false.',
  })
  @ApiQuery({
    name: 'favourite',
    required: false,
    description:
      'true to list only favourited DMs, false to exclude them. Omit for no filtering.',
  })
  @ApiResponse({ status: 200, type: ChatChannelResponseDto, isArray: true })
  async listDms(
    @Req() req: WorkspaceRequest,
    @Query() query: ListDmsQueryDto,
  ): Promise<ApiRes<any>> {
    const typedQuery = query as ListDmsQuery;
    const result = await this.chatService.listDms(
      req.workspaceContext.workspaceId,
      req.user.id,
      typedQuery.archived,
      typedQuery.favourite,
    );
    return ok(result);
  }

  @Get('search/global')
  @ApiOperation({
    summary: 'Global sidebar search — matching DMs and matching messages',
    description:
      "Powers the sidebar's search box: returns people (DMs from the caller's " +
      'own DM list whose other participant matches the query) alongside ' +
      'matching messages across every channel/DM the caller belongs to. For ' +
      'the in-conversation search bar (search within one open DM/channel), ' +
      'use GET /chat/search?q=...&channelId=... instead.',
  })
  @ApiQuery({ name: 'q', required: true })
  @ApiQuery({ name: 'limit', required: false })
  @ApiResponse({ status: 200, type: GlobalSearchResponseDto })
  async searchGlobal(
    @Req() req: WorkspaceRequest,
    @Query() query: GlobalSearchDto,
  ): Promise<ApiRes<any>> {
    const typedQuery = query as GlobalSearchQuery;
    const result = await this.chatService.searchGlobal(
      req.workspaceContext.workspaceId,
      req.user.id,
      typedQuery.q,
      typedQuery.limit,
    );
    return ok(result);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search chat messages in the workspace' })
  @ApiQuery({ name: 'q', required: true })
  @ApiQuery({ name: 'channelId', required: false })
  @ApiQuery({ name: 'cursor', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiResponse({ status: 200, type: ChatMessageListResponseDto })
  async search(
    @Req() req: WorkspaceRequest,
    @Query() query: SearchMessagesDto,
  ): Promise<ApiRes<any>> {
    const result = await this.chatService.searchMessages(
      req.workspaceContext.workspaceId,
      req.user.id,
      query as SearchMessagesQuery,
    );
    return ok(result);
  }
}
