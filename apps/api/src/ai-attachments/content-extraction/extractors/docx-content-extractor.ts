import * as mammoth from 'mammoth';
import { AttachmentContentType } from '@app/database/generated/prisma/client';
import type { ContentExtractor, ExtractedContent } from '../content-extractor';

const DOCX_MIME_TYPE = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

// Legacy .doc/.rtf mimetypes are NOT supported by mammoth (it only parses the
// modern .docx zip/XML format) — those fall through to `unsupported` upstream.
export class DocxContentExtractor implements ContentExtractor {
  supports(contentType: AttachmentContentType, mimeType: string): boolean {
    return contentType === AttachmentContentType.DOCUMENT && mimeType === DOCX_MIME_TYPE;
  }

  async extract(buffer: Buffer): Promise<Pick<ExtractedContent, 'text'>> {
    const result = await mammoth.extractRawText({ buffer });
    return { text: result.value };
  }
}
