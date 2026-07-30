import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { PrismaService } from '@app/database';
import type OpenAI from 'openai';
import { AiTierService } from '../ai-tier/ai-tier.service';
import { ModelResolverService, STANDARD_CHAT_MODEL } from '../ai-tier/model-resolver.service';
import { OpenAiClientProvider } from '../ai-tier/openai-client.provider';
import { TokenCounterService, type TokenSource } from '../ai-tier/token-counter.service';
import { TokenQuotaService } from '../ai-tier/token-quota.service';
import { AiConversationsService } from './ai-conversations.service';
import { ChatContextBuilder } from './chat-context.builder';

export interface CompletionChunk {
  /** Incremental assistant text. */
  delta?: string;
  /** Emitted once at the end with the persisted message id and usage. */
  done?: {
    messageId: string;
    model: string;
    promptTokens: number;
    completionTokens: number;
    estimatedCostUsd: number | null;
    /** True when the premium budget was exhausted and the standard model answered. */
    usedFallbackModel: boolean;
  };
}

export interface StreamCompletionParams {
  workspaceId: string;
  userId: string;
  conversationId: string;
}

@Injectable()
export class AiCompletionsService {
  private readonly logger = new Logger(AiCompletionsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly openai: OpenAiClientProvider,
    private readonly conversations: AiConversationsService,
    private readonly tiers: AiTierService,
    private readonly models: ModelResolverService,
    private readonly context: ChatContextBuilder,
    private readonly quotas: TokenQuotaService,
    private readonly counter: TokenCounterService,
  ) {
    if (this.models.isPremiumRateMissing()) {
      this.logger.warn(
        `No cost rate configured for premium model "${this.models.getPremiumModel()}" — premium spend will be recorded as unmeasured.`,
      );
    }
  }

  /**
   * Streams an assistant turn for a conversation, then persists it with usage.
   *
   * The model is resolved from the caller's workspace tier — never from client
   * input — so a member cannot request a model they are not entitled to.
   */
  async *streamCompletion(
    params: StreamCompletionParams,
  ): AsyncGenerator<CompletionChunk, void, undefined> {
    const { workspaceId, userId, conversationId } = params;

    await this.conversations.assertOwned(workspaceId, userId, conversationId);

    const tier = await this.tiers.getTier(workspaceId, userId);

    // Throws TOKEN_LIMIT_EXCEEDED for a premium member with no budget left who
    // has not accepted the standard-model fallback. Standard tier is unmetered.
    const quota = await this.quotas.assertWithinQuota(workspaceId, userId, tier);

    // An exhausted member who opted into the fallback keeps chatting on the
    // standard model rather than being blocked.
    const usingFallback = quota.metered && quota.exhausted && quota.fallbackOptIn;
    const model = usingFallback ? STANDARD_CHAT_MODEL : this.models.resolve(tier);

    // Includes attachment context — extracted document text and signed image
    // URLs, under the same budget caps the frontend used to apply.
    const messages = await this.context.build(conversationId);

    // Counted before dispatch so the abort path has real figures: OpenAI only
    // reports usage in a final chunk that never arrives if the client
    // disconnects, yet input is billed the moment the request goes out.
    const countedPrompt = this.counter.countPromptTokens(model, messages);

    const client = this.openai.get();

    // No max_completion_tokens: replies are never truncated. A half-written
    // answer is unusable work the member has already paid for, so the budget is
    // deliberately soft — the in-flight reply finishes and the *next* request is
    // the one that gets blocked. Worst-case overshoot is one reply, which the
    // model itself caps at MAX_SINGLE_REPLY_TOKENS.
    let stream: Awaited<ReturnType<typeof client.chat.completions.create>>;
    try {
      stream = await client.chat.completions.create({
        model,
        messages,
        stream: true,
        stream_options: { include_usage: true },
      });
    } catch (err) {
      this.logger.error(`OpenAI request failed for model ${model}`, err as Error);
      throw new InternalServerErrorException('Chat completion failed');
    }

    let text = '';
    let promptTokens = 0;
    let completionTokens = 0;
    let cachedPromptTokens = 0;
    let cacheWritePromptTokens = 0;
    let completed = false;

    try {
      for await (const chunk of stream as AsyncIterable<OpenAI.Chat.ChatCompletionChunk>) {
        const delta = chunk.choices[0]?.delta?.content ?? '';
        if (delta) {
          text += delta;
          yield { delta };
        }

        if (chunk.usage) {
          promptTokens = chunk.usage.prompt_tokens;
          completionTokens = chunk.usage.completion_tokens;
          // Only the 5.6 family's usage response includes cache_write_tokens;
          // gpt-4o-mini omits the field entirely, so this stays 0 there.
          cachedPromptTokens = chunk.usage.prompt_tokens_details?.cached_tokens ?? 0;
          cacheWritePromptTokens = chunk.usage.prompt_tokens_details?.cache_write_tokens ?? 0;
        }
      }
      completed = true;
    } finally {
      // Runs on normal completion AND when the consumer stops early (client
      // disconnect / abort), because an abandoned generator is closed via
      // .return(). Without this, a stopped stream would lose the partial reply.
      if (text.length > 0 || completed) {
        // `usage` only arrives on a clean finish. Without it, fall back to the
        // pre-counted prompt plus the reply text actually received — the tokens
        // were spent either way, and a quota that ignored them would let anyone
        // chat for free by aborting.
        const measured = completed && promptTokens > 0;
        const message = await this.persistTurn({
          workspaceId,
          userId,
          // Fallback turns run on the unlimited standard model, so they must not
          // drain the premium allowance — otherwise the opt-in would keep
          // consuming the very budget it exists to work around.
          meterUsage: !usingFallback,
          conversationId,
          content: text,
          status: completed ? 'COMPLETE' : 'ABORTED',
          model,
          promptTokens: measured ? promptTokens : null,
          completionTokens: measured ? completionTokens : null,
          // Only meaningful when the real usage chunk arrived — the abort path
          // has no cache breakdown to report, same reasoning as promptTokens.
          cachedPromptTokens: measured ? cachedPromptTokens : null,
          cacheWritePromptTokens: measured ? cacheWritePromptTokens : null,
          estimatedPromptTokens: measured ? null : countedPrompt.tokens,
          estimatedCompletionTokens: measured
            ? null
            : this.counter.countTextTokens(model, text),
          tokenSource: measured ? 'MEASURED' : countedPrompt.source,
          imageCount: countedPrompt.imageCount,
        });

        // Only reaches the client on normal completion — after an abort nobody
        // is listening, but the row is already written.
        if (completed) {
          yield {
            done: {
              messageId: message.id,
              model,
              promptTokens: measured ? promptTokens : countedPrompt.tokens,
              completionTokens,
              estimatedCostUsd: message.estimatedCostUsd,
              usedFallbackModel: usingFallback,
            },
          };
        }
      }
    }
  }

  /**
   * Writes the assistant turn, bumps the conversation, and debits the member's
   * token allowance — all in one transaction, so the quota counter and the
   * message row it describes can never disagree.
   */
  private async persistTurn(params: {
    workspaceId: string;
    userId: string;
    /** False for standard-model fallback turns, which are unmetered. */
    meterUsage: boolean;
    conversationId: string;
    content: string;
    status: 'COMPLETE' | 'ABORTED';
    model: string;
    promptTokens: number | null;
    completionTokens: number | null;
    /** Subset of promptTokens billed at the cache-read discount. Null on the abort path. */
    cachedPromptTokens: number | null;
    /** Subset of promptTokens billed at the cache-write rate. Null on the abort path. */
    cacheWritePromptTokens: number | null;
    estimatedPromptTokens: number | null;
    estimatedCompletionTokens: number | null;
    tokenSource: TokenSource;
    imageCount: number;
  }): Promise<{ id: string; estimatedCostUsd: number | null }> {
    const {
      workspaceId,
      userId,
      meterUsage,
      conversationId,
      content,
      status,
      model,
      promptTokens,
      completionTokens,
      cachedPromptTokens,
      cacheWritePromptTokens,
      estimatedPromptTokens,
      estimatedCompletionTokens,
      tokenSource,
      imageCount,
    } = params;

    // Effective figures: measured when available, locally counted otherwise.
    const effectivePrompt = promptTokens ?? estimatedPromptTokens ?? 0;
    const effectiveCompletion = completionTokens ?? estimatedCompletionTokens ?? 0;
    const estimatedCostUsd = this.models.estimateCostUsd(
      model,
      effectivePrompt,
      effectiveCompletion,
      { cachedTokens: cachedPromptTokens ?? 0, cacheWriteTokens: cacheWritePromptTokens ?? 0 },
    );
    const estimatedPortion =
      promptTokens === null ? effectivePrompt + effectiveCompletion : 0;

    const created = await this.prisma.$transaction(async (tx) => {
      const row = await tx.aiConversationMessage.create({
        data: {
          conversationId,
          role: 'ASSISTANT',
          content,
          status,
          model,
          promptTokens,
          completionTokens,
          cachedPromptTokens,
          cacheWritePromptTokens,
          estimatedPromptTokens,
          estimatedCompletionTokens,
          tokenSource,
          imageCount,
          estimatedCostUsd,
        },
        select: { id: true },
      });

      await tx.aiConversation.update({
        where: { id: conversationId },
        data: { updatedAt: new Date() },
      });

      if (meterUsage) {
        await this.quotas.recordUsage(tx, {
          workspaceId,
          userId,
          totalTokens: effectivePrompt + effectiveCompletion,
          estimatedTokens: estimatedPortion,
          costUsd: estimatedCostUsd,
        });
      }

      return row;
    });

    return { id: created.id, estimatedCostUsd };
  }
}
