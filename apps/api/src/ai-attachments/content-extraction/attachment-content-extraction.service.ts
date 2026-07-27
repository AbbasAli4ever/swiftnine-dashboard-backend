import { Injectable, Logger } from '@nestjs/common';
import { S3Service } from '@app/common';
import { AttachmentContentType } from '@app/database/generated/prisma/client';
import {
  AI_ATTACHMENT_EXTRACTION_TIMEOUT_MS,
  AI_ATTACHMENT_MAX_EXTRACTED_TEXT_CHARS,
  NON_EXTRACTABLE_CONTENT_TYPES,
} from '../ai-attachments.constants';
import type { ContentExtractor, ExtractedContent } from './content-extractor';
import { PdfContentExtractor } from './extractors/pdf-content-extractor';
import { DocxContentExtractor } from './extractors/docx-content-extractor';
import { PlainTextContentExtractor } from './extractors/plain-text-content-extractor';

async function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  const timer: { id?: NodeJS.Timeout } = {};
  const timeout = new Promise<never>((_, reject) => {
    timer.id = setTimeout(() => reject(new Error(`Extraction timed out after ${ms}ms`)), ms);
  });
  try {
    return await Promise.race([promise, timeout]);
  } finally {
    if (timer.id) clearTimeout(timer.id);
  }
}

function truncate(text: string, maxChars: number): { text: string; truncated: boolean } {
  if (text.length <= maxChars) return { text, truncated: false };
  return { text: text.slice(0, maxChars), truncated: true };
}

@Injectable()
export class AttachmentContentExtractionService {
  private readonly logger = new Logger(AttachmentContentExtractionService.name);
  private readonly extractors: ContentExtractor[] = [
    new PdfContentExtractor(),
    new DocxContentExtractor(),
    new PlainTextContentExtractor(),
  ];

  constructor(private readonly s3: S3Service) {}

  async maybeExtract(
    contentType: AttachmentContentType | null,
    mimeType: string,
    s3Key: string,
  ): Promise<ExtractedContent | null> {
    if (!contentType || NON_EXTRACTABLE_CONTENT_TYPES.has(contentType)) return null;

    const extractor = this.extractors.find((e) => e.supports(contentType, mimeType));
    if (!extractor) {
      return { text: '', charCount: 0, truncated: false, status: 'unsupported' };
    }

    try {
      const buffer = await this.s3.getObjectBody(s3Key);
      const result = await withTimeout(
        extractor.extract(buffer, s3Key),
        AI_ATTACHMENT_EXTRACTION_TIMEOUT_MS,
      );
      const { text, truncated } = truncate(result.text, AI_ATTACHMENT_MAX_EXTRACTED_TEXT_CHARS);
      return { text, charCount: text.length, truncated, status: 'ok' };
    } catch (err) {
      this.logger.warn(`Content extraction failed for ${s3Key}: ${(err as Error).message}`);
      return { text: '', charCount: 0, truncated: false, status: 'failed', error: (err as Error).message };
    }
  }
}
