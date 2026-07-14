import { AttachmentContentType } from '@app/database/generated/prisma/client';
import { AttachmentContentExtractionService } from './attachment-content-extraction.service';
import { AI_ATTACHMENT_MAX_EXTRACTED_TEXT_CHARS } from '../ai-attachments.constants';

describe('AttachmentContentExtractionService', () => {
  let service: AttachmentContentExtractionService;
  let s3: { getObjectBody: jest.Mock };

  beforeEach(() => {
    s3 = { getObjectBody: jest.fn() };
    service = new AttachmentContentExtractionService(s3 as never);
  });

  it('returns null for non-extractable content types without touching S3', async () => {
    const result = await service.maybeExtract(AttachmentContentType.IMAGE, 'image/png', 'key');
    expect(result).toBeNull();
    expect(s3.getObjectBody).not.toHaveBeenCalled();
  });

  it('returns null for generated content types', async () => {
    const result = await service.maybeExtract(AttachmentContentType.GENERATED_PDF, 'application/pdf', 'key');
    expect(result).toBeNull();
  });

  it('returns unsupported when no extractor matches (e.g. legacy .doc)', async () => {
    const result = await service.maybeExtract(AttachmentContentType.DOCUMENT, 'application/msword', 'key');
    expect(result).toEqual({ text: '', charCount: 0, truncated: false, status: 'unsupported' });
    expect(s3.getObjectBody).not.toHaveBeenCalled();
  });

  it('extracts and truncates text over the configured character limit', async () => {
    const longText = 'a'.repeat(AI_ATTACHMENT_MAX_EXTRACTED_TEXT_CHARS + 500);
    s3.getObjectBody.mockResolvedValue(Buffer.from(longText, 'utf-8'));

    const result = await service.maybeExtract(AttachmentContentType.TEXT, 'text/plain', 'key');

    expect(result?.status).toBe('ok');
    expect(result?.truncated).toBe(true);
    expect(result?.text.length).toBe(AI_ATTACHMENT_MAX_EXTRACTED_TEXT_CHARS);
  });

  it('extracts short text without truncation', async () => {
    s3.getObjectBody.mockResolvedValue(Buffer.from('short text', 'utf-8'));

    const result = await service.maybeExtract(AttachmentContentType.CSV, 'text/csv', 'key');

    expect(result).toEqual({ text: 'short text', charCount: 10, truncated: false, status: 'ok' });
  });

  it('returns a failed status when extraction throws', async () => {
    s3.getObjectBody.mockRejectedValue(new Error('S3 unavailable'));

    const result = await service.maybeExtract(AttachmentContentType.TEXT, 'text/plain', 'key');

    expect(result?.status).toBe('failed');
    expect(result?.error).toContain('S3 unavailable');
  });
});
