import { PDFParse } from 'pdf-parse';
import { AttachmentContentType } from '@app/database/generated/prisma/client';
import type { ContentExtractor, ExtractedContent } from '../content-extractor';

export class PdfContentExtractor implements ContentExtractor {
  supports(contentType: AttachmentContentType): boolean {
    return contentType === AttachmentContentType.PDF;
  }

  async extract(buffer: Buffer): Promise<Pick<ExtractedContent, 'text'>> {
    const parser = new PDFParse({ data: buffer });
    try {
      const result = await parser.getText();
      return { text: result.text };
    } finally {
      await parser.destroy();
    }
  }
}
