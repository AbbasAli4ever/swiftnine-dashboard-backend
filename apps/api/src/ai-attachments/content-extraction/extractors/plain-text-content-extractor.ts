import { AttachmentContentType } from '@app/database/generated/prisma/client';
import type { ContentExtractor, ExtractedContent } from '../content-extractor';

export class PlainTextContentExtractor implements ContentExtractor {
  supports(contentType: AttachmentContentType): boolean {
    return (
      contentType === AttachmentContentType.TEXT ||
      contentType === AttachmentContentType.CSV ||
      contentType === AttachmentContentType.CODE
    );
  }

  async extract(buffer: Buffer): Promise<Pick<ExtractedContent, 'text'>> {
    return { text: buffer.toString('utf-8') };
  }
}
