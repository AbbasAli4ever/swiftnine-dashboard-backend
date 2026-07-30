import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { AiModelTier } from '@app/database/generated/prisma/client';

/**
 * Per-million-token USD rates, used to attribute spend per message.
 *
 * IMPORTANT: every model returned by resolve() must have an entry here, or
 * estimateCostUsd reports null and premium spend looks unmeasured. The
 * isPremiumRateMissing() check surfaces that at boot rather than at runtime.
 */
export interface ContextRate {
  inputPerMillion: number;
  outputPerMillion: number;
  /**
   * Rate for prompt tokens OpenAI reports as served from its prompt cache
   * (`prompt_tokens_details.cached_tokens`). Optional: gpt-4o-mini has no
   * cache-write tier in its pricing, so it only ever needs this one discount
   * rate, while the 5.6 family needs both this and cacheWritePerMillion.
   */
  cachedInputPerMillion?: number;
  /**
   * Rate for prompt tokens OpenAI reports as newly written to its prompt
   * cache this request (`prompt_tokens_details.cache_write_tokens`) — priced
   * higher than a plain cache miss because writing the cache costs more than
   * reading it. Confirmed present only on the 5.6 family's usage response;
   * gpt-4o-mini's response never includes this field.
   */
  cacheWritePerMillion?: number;
}

export interface ModelRate {
  /** Rate applied when promptTokens <= longContextThreshold (or always, if no long tier). */
  short: ContextRate;
  /**
   * Surcharge rate for large prompts. Omitted for models with flat pricing —
   * those bill `short` regardless of prompt size.
   */
  long?: ContextRate;
  /** Prompt-token count above which `long` applies. Required whenever `long` is set. */
  longContextThreshold?: number;
}

export const STANDARD_CHAT_MODEL = 'gpt-4o-mini';

/**
 * Premium model id, overridable via OPENAI_PREMIUM_MODEL without a redeploy.
 *
 * Note: there is no bare `gpt-5.6` model — the 5.6 generation ships only as the
 * named variants luna / sol / terra. Verified callable against this org's key.
 */
export const PREMIUM_CHAT_MODEL_DEFAULT = 'gpt-5.6-luna';

/**
 * Prompt-token count above which the 5.6 family bills the long-context rate.
 * Confirmed for gpt-5.6-luna: short context is $1/$6 per 1M, long is $2/$9.
 */
export const LONG_CONTEXT_THRESHOLD_TOKENS = 272_000;

const GPT_5_6_RATE: ModelRate = {
  short: {
    inputPerMillion: 1.0,
    outputPerMillion: 6.0,
    cachedInputPerMillion: 0.1,
    cacheWritePerMillion: 1.25,
  },
  long: {
    inputPerMillion: 2.0,
    outputPerMillion: 9.0,
    cachedInputPerMillion: 0.2,
    cacheWritePerMillion: 2.5,
  },
  longContextThreshold: LONG_CONTEXT_THRESHOLD_TOKENS,
};

export const MODEL_RATES: Record<string, ModelRate> = {
  // Flat pricing — no long-context surcharge tier. No cache-write tier either:
  // gpt-4o-mini's usage response never includes cache_write_tokens.
  'gpt-4o-mini': {
    short: { inputPerMillion: 0.15, outputPerMillion: 0.6, cachedInputPerMillion: 0.075 },
  },
  'gpt-4o': { short: { inputPerMillion: 2.5, outputPerMillion: 10 } },
  // sol/terra inherit luna's published rates; correct them if they diverge.
  'gpt-5.6-luna': GPT_5_6_RATE,
  'gpt-5.6-sol': GPT_5_6_RATE,
  'gpt-5.6-terra': GPT_5_6_RATE,
};

/**
 * Per-million-token USD rates for image generation. Distinct from ModelRate:
 * image billing has no prompt/completion split, and instead splits by whether
 * a token is text or image, on both the input and output side. Confirmed live
 * against OpenAI's /v1/images/generations usage response, which reports
 * `input_tokens_details.{text_tokens,image_tokens}` and
 * `output_tokens_details.{text_tokens,image_tokens}` — generateImage() only
 * ever sends a text prompt today, so imageInputPerMillion is unused in
 * practice (image_tokens on the input side is always 0) but is included for
 * correctness in case an image-edit/vision-input flow is added later.
 */
export interface ImageModelRate {
  textInputPerMillion: number;
  imageInputPerMillion: number;
  imageOutputPerMillion: number;
  /**
   * Discount rate for cached text-prompt input, per the published pricing
   * table. NOT currently applied by estimateImageCostUsd: verified live,
   * repeatedly, with identical long prompts against both gpt-image-1-mini and
   * gpt-image-2 — the /v1/images/generations usage response only ever
   * contains input_tokens_details.{text_tokens,image_tokens}, with no cache
   * breakdown at all (unlike chat completions, which does report
   * prompt_tokens_details.cached_tokens). Kept here for when/if OpenAI adds
   * that field to this endpoint; until then every image call is priced at the
   * full (uncached) input rate, which is a safe upper bound, never an
   * underestimate.
   */
  cachedTextInputPerMillion?: number;
}

export const STANDARD_IMAGE_MODEL = 'gpt-image-1-mini';

/** Overridable via OPENAI_PREMIUM_IMAGE_MODEL, same pattern as the chat model. */
export const PREMIUM_IMAGE_MODEL_DEFAULT = 'gpt-image-2';

export const IMAGE_MODEL_RATES: Record<string, ImageModelRate> = {
  'gpt-image-1-mini': {
    textInputPerMillion: 2.0,
    imageInputPerMillion: 2.5,
    imageOutputPerMillion: 8.0,
    cachedTextInputPerMillion: 0.2,
  },
  'gpt-image-2': {
    textInputPerMillion: 5.0,
    imageInputPerMillion: 8.0,
    imageOutputPerMillion: 30.0,
    cachedTextInputPerMillion: 1.25,
  },
};

@Injectable()
export class ModelResolverService {
  private readonly premiumModel: string;
  private readonly premiumImageModel: string;

  constructor(private readonly config: ConfigService) {
    this.premiumModel =
      this.config.get<string>('OPENAI_PREMIUM_MODEL')?.trim() || PREMIUM_CHAT_MODEL_DEFAULT;
    this.premiumImageModel =
      this.config.get<string>('OPENAI_PREMIUM_IMAGE_MODEL')?.trim() ||
      PREMIUM_IMAGE_MODEL_DEFAULT;
  }

  /** Maps an entitlement tier to the model id used for chat completions. */
  resolve(tier: AiModelTier): string {
    return tier === 'PREMIUM' ? this.premiumModel : STANDARD_CHAT_MODEL;
  }

  /** Maps an entitlement tier to the model id used for image generation. */
  resolveImage(tier: AiModelTier): string {
    return tier === 'PREMIUM' ? this.premiumImageModel : STANDARD_IMAGE_MODEL;
  }

  /**
   * Cost in USD for a completed request. Returns null — not 0 — when the rate
   * is unknown, so callers can distinguish "free" from "unmeasured".
   *
   * Models with a long-context tier switch rate once promptTokens exceeds the
   * threshold; the surcharge applies to the whole request, not just the excess.
   *
   * `promptTokens` is the total OpenAI reports (matches its own `prompt_tokens`
   * field) and is expected to already include cachedTokens/cacheWriteTokens as
   * a subset — confirmed live: a cache-hit response reports
   * prompt_tokens=1807 with cached_tokens=1804 for the SAME request that, on
   * its prior cache-miss call, reported prompt_tokens=1807 with
   * cache_write_tokens=1804. The remainder (prompt_tokens minus both) is
   * billed at the plain input rate.
   */
  estimateCostUsd(
    model: string,
    promptTokens: number,
    completionTokens: number,
    cacheUsage?: { cachedTokens?: number; cacheWriteTokens?: number },
  ): number | null {
    const rate = MODEL_RATES[model];
    if (!rate) return null;

    const tier =
      rate.long && rate.longContextThreshold !== undefined
        ? promptTokens > rate.longContextThreshold
          ? rate.long
          : rate.short
        : rate.short;

    const cachedTokens = cacheUsage?.cachedTokens ?? 0;
    const cacheWriteTokens = cacheUsage?.cacheWriteTokens ?? 0;
    // Whatever of the prompt wasn't served from or written to cache this call.
    const freshTokens = Math.max(0, promptTokens - cachedTokens - cacheWriteTokens);

    const cachedRate = tier.cachedInputPerMillion ?? tier.inputPerMillion;
    const cacheWriteRate = tier.cacheWritePerMillion ?? tier.inputPerMillion;

    return (
      (freshTokens / 1_000_000) * tier.inputPerMillion +
      (cachedTokens / 1_000_000) * cachedRate +
      (cacheWriteTokens / 1_000_000) * cacheWriteRate +
      (completionTokens / 1_000_000) * tier.outputPerMillion
    );
  }

  /**
   * Cost bounds for a token allowance, for the admin's assignment form.
   *
   * A single figure is impossible under a one-pool quota: the same token count
   * costs input-rate if spent on prompts and output-rate if spent on replies,
   * a ~6x spread on the 5.6 family. Callers should surface `maxCostUsd` as the
   * headline ("up to $X") with the range beneath.
   */
  quoteTokenCost(
    model: string,
    tokens: number,
  ): { minCostUsd: number; maxCostUsd: number } | null {
    const rate = MODEL_RATES[model];
    if (!rate) return null;

    // Worst case uses the long-context tier only if the allowance alone could
    // exceed the threshold in a single request.
    const worstTier =
      rate.long && rate.longContextThreshold !== undefined && tokens > rate.longContextThreshold
        ? rate.long
        : rate.short;

    return {
      minCostUsd: (tokens / 1_000_000) * rate.short.inputPerMillion,
      maxCostUsd: (tokens / 1_000_000) * worstTier.outputPerMillion,
    };
  }

  /**
   * Cost in USD for a completed image generation. Returns null — not 0 — when
   * the rate is unknown, matching estimateCostUsd's convention.
   */
  estimateImageCostUsd(
    model: string,
    usage: { textInputTokens: number; imageInputTokens: number; imageOutputTokens: number },
  ): number | null {
    const rate = IMAGE_MODEL_RATES[model];
    if (!rate) return null;

    return (
      (usage.textInputTokens / 1_000_000) * rate.textInputPerMillion +
      (usage.imageInputTokens / 1_000_000) * rate.imageInputPerMillion +
      (usage.imageOutputTokens / 1_000_000) * rate.imageOutputPerMillion
    );
  }

  /** True when the configured premium model has no rate entry — surfaced at boot. */
  isPremiumRateMissing(): boolean {
    return !MODEL_RATES[this.premiumModel];
  }

  /** True when the configured premium image model has no rate entry — surfaced at boot. */
  isPremiumImageRateMissing(): boolean {
    return !IMAGE_MODEL_RATES[this.premiumImageModel];
  }

  getPremiumModel(): string {
    return this.premiumModel;
  }

  getPremiumImageModel(): string {
    return this.premiumImageModel;
  }
}
