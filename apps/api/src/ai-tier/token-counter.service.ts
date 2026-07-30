import { Injectable, Logger } from '@nestjs/common';
import { getEncoding, type Tiktoken } from 'js-tiktoken';
import type OpenAI from 'openai';

/**
 * How a token figure was arrived at. Recorded per message so the accuracy of
 * quota accounting is auditable, and so estimated consumption can be treated
 * differently from measured consumption when enforcing limits.
 */
export type TokenSource = 'MEASURED' | 'TOKENIZED_PROMPT' | 'HEURISTIC' | 'UNKNOWN';

/**
 * Fallback ratio when the tokenizer is unavailable. Calibrated on English
 * prose; it under-counts code, JSON and CJK significantly, which is why it is
 * only a last resort. Under-counting is the safe direction — it can never
 * wrongly block a user.
 */
const CHARS_PER_TOKEN_FALLBACK = 4;

/**
 * Per-message framing overhead the raw encoder does not model (role markers and
 * separators).
 */
const TOKENS_PER_MESSAGE_OVERHEAD = 4;

/**
 * Fixed per-request overhead, measured against live gpt-4o-mini responses: with
 * the per-message allowance above, counts came in exactly 3 tokens low across
 * 1-message, 2-message and 400-token prompts. Correcting it brings the estimate
 * to within ~0.1% on realistic prompts.
 */
const TOKENS_PER_REQUEST_OVERHEAD = 3;

/**
 * Model id -> encoding name.
 *
 * Deliberately explicit rather than js-tiktoken's encodingForModel(), which
 * throws "Unknown model" for ids newer than the library — including
 * gpt-5.6-luna, the premium path. A hardcoded map degrades to the default
 * instead of breaking chat.
 */
const MODEL_ENCODINGS: Record<string, 'o200k_base' | 'cl100k_base'> = {
  'gpt-4o': 'o200k_base',
  'gpt-4o-mini': 'o200k_base',
  'gpt-5.6-luna': 'o200k_base',
  'gpt-5.6-sol': 'o200k_base',
  'gpt-5.6-terra': 'o200k_base',
};

/** The 4o and 5.x families all use o200k_base; assume it for unknown ids. */
const DEFAULT_ENCODING = 'o200k_base' as const;

export interface PromptTokenCount {
  tokens: number;
  source: Extract<TokenSource, 'TOKENIZED_PROMPT' | 'HEURISTIC'>;
  /** Images cannot be tokenized from text; counted so the residual is measurable. */
  imageCount: number;
}

@Injectable()
export class TokenCounterService {
  private readonly logger = new Logger(TokenCounterService.name);

  /** Encodings are multi-MB rank tables — load each once, lazily. */
  private readonly encodings = new Map<string, Tiktoken>();

  /**
   * Counts the prompt tokens for a request that is about to be sent.
   *
   * Used for pre-flight quota debiting and for the abort path, where OpenAI's
   * usage chunk never arrives. Never throws: on any tokenizer failure it falls
   * back to a character heuristic and reports that in `source`.
   */
  countPromptTokens(
    model: string,
    messages: OpenAI.Chat.ChatCompletionMessageParam[],
  ): PromptTokenCount {
    const { text, imageCount } = this.flatten(messages);

    try {
      const encoding = this.getEncoding(model);
      const tokens =
        encoding.encode(text).length +
        messages.length * TOKENS_PER_MESSAGE_OVERHEAD +
        TOKENS_PER_REQUEST_OVERHEAD;
      return { tokens, source: 'TOKENIZED_PROMPT', imageCount };
    } catch (err) {
      this.logger.warn(
        `Tokenizer unavailable for model ${model}, falling back to heuristic: ${
          (err as Error).message
        }`,
      );
      return {
        tokens: this.heuristicTokens(text),
        source: 'HEURISTIC',
        imageCount,
      };
    }
  }

  /**
   * Estimates tokens for generated text — used only for a partial reply on the
   * abort path, where we hold the exact text but never received a usage chunk.
   */
  countTextTokens(model: string, text: string): number {
    if (!text) return 0;
    try {
      return this.getEncoding(model).encode(text).length;
    } catch {
      return this.heuristicTokens(text);
    }
  }

  private getEncoding(model: string): Tiktoken {
    const name = MODEL_ENCODINGS[model] ?? DEFAULT_ENCODING;
    const cached = this.encodings.get(name);
    if (cached) return cached;

    const encoding = getEncoding(name);
    this.encodings.set(name, encoding);
    return encoding;
  }

  /**
   * Reduces a message array to plain text plus an image count. Image parts are
   * billed by dimensions, which a text tokenizer cannot see, so they are
   * excluded from the text and counted separately.
   */
  private flatten(messages: OpenAI.Chat.ChatCompletionMessageParam[]): {
    text: string;
    imageCount: number;
  } {
    const parts: string[] = [];
    let imageCount = 0;

    for (const message of messages) {
      const content = (message as { content?: unknown }).content;

      if (typeof content === 'string') {
        parts.push(content);
        continue;
      }

      if (Array.isArray(content)) {
        for (const part of content as Array<{ type?: string; text?: string }>) {
          if (part.type === 'image_url') imageCount += 1;
          else if (typeof part.text === 'string') parts.push(part.text);
        }
      }
    }

    return { text: parts.join('\n'), imageCount };
  }

  private heuristicTokens(text: string): number {
    return Math.ceil(text.length / CHARS_PER_TOKEN_FALLBACK);
  }
}
