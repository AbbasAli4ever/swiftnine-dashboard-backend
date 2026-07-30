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
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiHeader, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import type { Response } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { WorkspaceGuard } from '../workspace/workspace.guard';
import type { WorkspaceRequest } from '../workspace/workspace.types';
import { ok, type ApiResponse as ApiRes } from '@app/common';
import { AiTierService } from '../ai-tier/ai-tier.service';
import { ModelResolverService, STANDARD_CHAT_MODEL } from '../ai-tier/model-resolver.service';
import { TokenQuotaService, type QuotaStatus } from '../ai-tier/token-quota.service';
import { AiConversationsService } from './ai-conversations.service';
import { AiCompletionsService } from './ai-completions.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { UpdateConversationDto } from './dto/update-conversation.dto';
import { CreateMessageDto } from './dto/create-message.dto';

@ApiTags('ai-conversations')
@ApiBearerAuth()
@Controller('ai-conversations')
@UseGuards(JwtAuthGuard, WorkspaceGuard)
@ApiHeader({ name: 'x-workspace-id', required: true, description: 'Active workspace ID' })
export class AiConversationsController {
  constructor(
    private readonly service: AiConversationsService,
    private readonly completions: AiCompletionsService,
    private readonly tiers: AiTierService,
    private readonly models: ModelResolverService,
    private readonly quotas: TokenQuotaService,
  ) {}

  @Get('model-info')
  @ApiOperation({
    summary: "The AI model this workspace member's chats will use, plus quota state",
    description:
      'Read-only. Resolved server-side from the tier so the client never has to map tier to model id — the premium model is env-overridable and a duplicated mapping would drift. Includes quota so the composer needs one request, not two.',
  })
  async getModelInfo(
    @Req() req: WorkspaceRequest,
  ): Promise<ApiRes<{ tier: string; model: string; quota: QuotaStatus }>> {
    const { workspaceId } = req.workspaceContext;
    const tier = await this.tiers.getTier(workspaceId, req.user.id);
    const quota = await this.quotas.getStatus(workspaceId, req.user.id, tier);

    // An exhausted member who accepted the fallback is really talking to the
    // standard model, so report that rather than the entitled one.
    const usingFallback = quota.metered && quota.exhausted && quota.fallbackOptIn;
    const model = usingFallback ? STANDARD_CHAT_MODEL : this.models.resolve(tier);

    return ok({ tier, model, quota });
  }

  @Post('quota/fallback-opt-in')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Accept the standard model for the rest of this period',
    description:
      'Called when a member whose premium allowance is exhausted chooses to keep chatting on the standard model. Cleared automatically on the weekly reset.',
  })
  async optIntoFallback(@Req() req: WorkspaceRequest): Promise<ApiRes<{ model: string }>> {
    await this.quotas.setFallbackOptIn(req.workspaceContext.workspaceId, req.user.id, true);
    return ok({ model: STANDARD_CHAT_MODEL }, 'Continuing on the standard model');
  }

  @Post(':conversationId/completions')
  @ApiOperation({
    summary: 'Stream an assistant turn for a conversation',
    description:
      "The model is chosen from the caller's workspace AI tier and cannot be set by the client. Streams newline-delimited SSE frames; the final `done` frame carries the persisted message id and token usage.",
  })
  @ApiParam({ name: 'conversationId', description: 'Conversation UUID' })
  async streamCompletion(
    @Req() req: WorkspaceRequest,
    @Param('conversationId') conversationId: string,
    @Res() res: Response,
  ): Promise<void> {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    // Disable proxy buffering so tokens reach the browser as they are produced.
    res.setHeader('X-Accel-Buffering', 'no');
    res.flushHeaders();

    const stream = this.completions.streamCompletion({
      workspaceId: req.workspaceContext.workspaceId,
      userId: req.user.id,
      conversationId,
    });

    // A browser abort() closes the socket without ending the response, so
    // res.writableEnded stays false and the loop would keep pulling from
    // OpenAI. Track it explicitly and break out, which closes the generator
    // and lets its finally block persist the partial turn as ABORTED.
    let clientGone = false;
    req.on('close', () => {
      clientGone = true;
    });

    try {
      for await (const chunk of stream) {
        if (clientGone || res.writableEnded) break;
        res.write(`data: ${JSON.stringify(chunk)}\n\n`);
      }
    } catch (err) {
      // Headers are already sent, so surface the failure as a stream event
      // rather than letting Nest attempt a JSON error response.
      const message = err instanceof Error ? err.message : 'Chat completion failed';
      if (!clientGone && !res.writableEnded) {
        res.write(`event: error\ndata: ${JSON.stringify({ message })}\n\n`);
      }
    } finally {
      if (!res.writableEnded) res.end();
    }
  }

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
