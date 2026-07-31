import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { PrismaService } from '@app/database';
import { AiTierService } from '../ai-tier/ai-tier.service';
import {
  ModelResolverService,
  STANDARD_CHAT_MODEL,
  STANDARD_IMAGE_MODEL,
} from '../ai-tier/model-resolver.service';
import { OpenAiClientProvider } from '../ai-tier/openai-client.provider';
import { TokenQuotaService } from '../ai-tier/token-quota.service';
import {
  DOCUMENT_SYSTEM_PROMPT,
  MAX_DOCUMENT_SECTIONS,
  MAX_DECK_SLIDES,
  PRESENTATION_SYSTEM_PROMPT,
  invalidDraftJsonException,
  noDraftContentException,
  noImageReturnedException,
  unexpectedDraftShapeException,
} from './ai-generation.constants';

export interface DocumentSection {
  heading?: string;
  body?: string;
  bullets?: string[];
}

export interface DraftedDocument {
  title: string;
  sections: DocumentSection[];
}

export interface DraftedPresentationTheme {
  accentColor: string;
  headFont: string;
  bodyFont: string;
}

export interface DraftedPresentation {
  title: string;
  subtitle?: string;
  theme: DraftedPresentationTheme;
  slides: Record<string, unknown>[];
}

export interface GeneratedImage {
  b64Json: string;
  mimeType: string;
  model: string;
  estimatedCostUsd: number | null;
}

@Injectable()
export class AiGenerationService {
  private readonly logger = new Logger(AiGenerationService.name);

  constructor(
    private readonly openai: OpenAiClientProvider,
    private readonly tiers: AiTierService,
    private readonly models: ModelResolverService,
    private readonly quotas: TokenQuotaService,
    private readonly prisma: PrismaService,
  ) {
    if (this.models.isPremiumImageRateMissing()) {
      this.logger.warn(
        `No cost rate configured for premium image model "${this.models.getPremiumImageModel()}" — premium image spend will be recorded as unmeasured.`,
      );
    }
  }

  /**
   * Drafts structured document content. The drafting model follows the caller's
   * workspace tier, so premium members get the better model here too — which
   * means this call is metered exactly like a chat turn, on the same weekly
   * allowance, since it resolves to the same underlying model.
   *
   * `format` selects which system prompt and response shape to draft against —
   * "pdf" (default) produces the flat {title, sections} shape both PDF and the
   * old-style PPT render use, "ppt" produces the themed {theme, slides} shape
   * the presentation renderer expects.
   */
  async draftDocument(
    workspaceId: string,
    userId: string,
    prompt: string,
    format: 'pdf' | 'ppt' = 'pdf',
  ): Promise<DraftedDocument | DraftedPresentation> {
    const tier = await this.tiers.getTier(workspaceId, userId);

    // Throws TOKEN_LIMIT_EXCEEDED for a premium member with no budget left who
    // has not accepted the standard-model fallback. Mirrors the chat pre-flight
    // check — this call bills the same model, so it must respect the same quota.
    const quota = await this.quotas.assertWithinQuota(workspaceId, userId, tier);

    // fallbackOptIn is a per-member weekly setting, not per-conversation, so a
    // member who already opted into the standard model for chat gets it here too.
    const usingFallback = quota.metered && quota.exhausted && quota.fallbackOptIn;
    const model = usingFallback ? STANDARD_CHAT_MODEL : this.models.resolve(tier);

    let raw: string | null | undefined;
    let promptTokens = 0;
    let completionTokens = 0;
    let cachedPromptTokens = 0;
    let cacheWritePromptTokens = 0;

    try {
      const completion = await this.openai.get().chat.completions.create({
        model,
        response_format: { type: 'json_object' },
        messages: [
          {
            role: 'system',
            content: format === 'ppt' ? PRESENTATION_SYSTEM_PROMPT : DOCUMENT_SYSTEM_PROMPT,
          },
          { role: 'user', content: prompt },
        ],
      });
      raw = completion.choices[0]?.message?.content;
      promptTokens = completion.usage?.prompt_tokens ?? 0;
      completionTokens = completion.usage?.completion_tokens ?? 0;
      // Only the 5.6 family's usage response includes cache_write_tokens;
      // gpt-4o-mini omits the field entirely, so this stays 0 there.
      cachedPromptTokens = completion.usage?.prompt_tokens_details?.cached_tokens ?? 0;
      cacheWritePromptTokens =
        completion.usage?.prompt_tokens_details?.cache_write_tokens ?? 0;
    } catch (err) {
      this.logger.error(`Document draft failed for model ${model}`, err as Error);
      throw new InternalServerErrorException('Document drafting failed');
    }

    const estimatedCostUsd = this.models.estimateCostUsd(model, promptTokens, completionTokens, {
      cachedTokens: cachedPromptTokens,
      cacheWriteTokens: cacheWritePromptTokens,
    });
    this.logger.log(
      `document draft model=${model} tokens=${promptTokens}/${completionTokens} cost=${
        estimatedCostUsd ?? 'unmeasured'
      }`,
    );

    // Not a streamed call, so usage always arrives on completion (or the call
    // throws above) — no abort-path estimation needed here, unlike chat.
    // Fallback turns are unmetered, same rule as chat.
    if (!usingFallback) {
      await this.prisma.$transaction((tx) =>
        this.quotas.recordUsage(tx, {
          workspaceId,
          userId,
          totalTokens: promptTokens + completionTokens,
          estimatedTokens: 0,
          costUsd: estimatedCostUsd,
        }),
      );
    }

    if (!raw) throw noDraftContentException();

    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      throw invalidDraftJsonException();
    }

    const record = parsed as Record<string, unknown>;
    if (typeof parsed !== 'object' || parsed === null || typeof record.title !== 'string') {
      throw unexpectedDraftShapeException();
    }

    if (format === 'ppt') {
      const theme = record.theme as Record<string, unknown> | undefined;
      if (
        !theme ||
        typeof theme.accentColor !== 'string' ||
        typeof theme.headFont !== 'string' ||
        typeof theme.bodyFont !== 'string' ||
        !Array.isArray(record.slides)
      ) {
        throw unexpectedDraftShapeException();
      }

      return {
        title: record.title,
        subtitle: typeof record.subtitle === 'string' ? record.subtitle : undefined,
        theme: {
          accentColor: theme.accentColor,
          headFont: theme.headFont,
          bodyFont: theme.bodyFont,
        },
        slides: (record.slides as Record<string, unknown>[]).slice(0, MAX_DECK_SLIDES),
      };
    }

    if (!Array.isArray(record.sections)) {
      throw unexpectedDraftShapeException();
    }

    return {
      title: record.title,
      sections: (record.sections as DocumentSection[]).slice(0, MAX_DOCUMENT_SECTIONS),
    };
  }

  /**
   * Generates a single 1024x1024 PNG. The model follows the caller's workspace
   * tier (standard -> gpt-image-1-mini, premium -> gpt-image-2) and is metered
   * on the same weekly token allowance as chat and document drafting — one
   * budget per member across every OpenAI feature they use, per the tier
   * design used throughout this system.
   */
  async generateImage(
    workspaceId: string,
    userId: string,
    prompt: string,
  ): Promise<GeneratedImage> {
    const tier = await this.tiers.getTier(workspaceId, userId);

    // Throws TOKEN_LIMIT_EXCEEDED for a premium member with no budget left who
    // has not accepted the standard-model fallback. Mirrors the chat/document
    // pre-flight check.
    const quota = await this.quotas.assertWithinQuota(workspaceId, userId, tier);

    // fallbackOptIn is a per-member weekly setting shared across chat,
    // documents, and images — one opt-in covers all three.
    const usingFallback = quota.metered && quota.exhausted && quota.fallbackOptIn;
    const model = usingFallback ? STANDARD_IMAGE_MODEL : this.models.resolveImage(tier);

    let result: Awaited<ReturnType<ReturnType<OpenAiClientProvider['get']>['images']['generate']>>;
    try {
      result = await this.openai.get().images.generate({
        model,
        prompt,
        n: 1,
        size: '1024x1024',
        quality: 'auto',
        output_format: 'png',
      });
    } catch (err) {
      this.logger.error(`Image generation failed for model ${model}`, err as Error);
      throw new InternalServerErrorException('Image generation failed');
    }

    // Real per-token usage, split by text vs image on both input and output —
    // confirmed live against the API, matching the pricing table's structure.
    const usage = result.usage;
    const textInputTokens = usage?.input_tokens_details?.text_tokens ?? 0;
    const imageInputTokens = usage?.input_tokens_details?.image_tokens ?? 0;
    const imageOutputTokens = usage?.output_tokens_details?.image_tokens ?? 0;
    const totalTokens = usage?.total_tokens ?? 0;

    const estimatedCostUsd = this.models.estimateImageCostUsd(model, {
      textInputTokens,
      imageInputTokens,
      imageOutputTokens,
    });

    this.logger.log(
      `image model=${model} size=${result.size ?? '1024x1024'} quality=${
        result.quality ?? 'auto'
      } tokens=${totalTokens} cost=${estimatedCostUsd ?? 'unmeasured'}`,
    );

    // Fallback turns are unmetered, same rule as chat and document drafting.
    if (!usingFallback && totalTokens > 0) {
      await this.prisma.$transaction((tx) =>
        this.quotas.recordUsage(tx, {
          workspaceId,
          userId,
          totalTokens,
          estimatedTokens: 0,
          costUsd: estimatedCostUsd,
        }),
      );
    }

    const image = result.data?.[0];
    if (!image?.b64_json) throw noImageReturnedException();

    return {
      b64Json: image.b64_json,
      mimeType: `image/${result.output_format ?? 'png'}`,
      model,
      estimatedCostUsd,
    };
  }
}
