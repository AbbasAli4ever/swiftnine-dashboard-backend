import { AttachmentContentType } from '@app/database/generated/prisma/client';

export interface ExtractedContent {
  text: string;
  charCount: number;
  truncated: boolean;
  status: 'ok' | 'unsupported' | 'failed';
  error?: string;
}

export interface ContentExtractor {
  supports(contentType: AttachmentContentType, mimeType: string): boolean;
  extract(buffer: Buffer, fileName: string): Promise<Pick<ExtractedContent, 'text'>>;
}
