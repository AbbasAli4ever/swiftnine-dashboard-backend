import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

/**
 * Lazily-built OpenAI client shared by every AI feature.
 *
 * Built on first use rather than in the constructor: the SDK throws when the
 * key is absent, which would otherwise take down app boot for every unrelated
 * module. A missing key must fail only the endpoints that need it.
 *
 * A single key serves both tiers — only the model id differs.
 */
@Injectable()
export class OpenAiClientProvider {
  private readonly logger = new Logger(OpenAiClientProvider.name);
  private client: OpenAI | null = null;

  constructor(private readonly config: ConfigService) {
    if (!this.config.get<string>('OPENAI_API_KEY')) {
      this.logger.warn(
        'OPENAI_API_KEY is not set — AI features will fail until it is configured.',
      );
    }
  }

  get(): OpenAI {
    if (this.client) return this.client;

    const apiKey = this.config.get<string>('OPENAI_API_KEY');
    if (!apiKey) {
      throw new InternalServerErrorException('OPENAI_API_KEY is not configured');
    }

    this.client = new OpenAI({ apiKey });
    return this.client;
  }
}
