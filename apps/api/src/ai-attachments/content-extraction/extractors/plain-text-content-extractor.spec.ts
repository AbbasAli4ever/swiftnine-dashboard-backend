import { AttachmentContentType } from '@app/database/generated/prisma/client';
import { PlainTextContentExtractor } from './plain-text-content-extractor';

describe('PlainTextContentExtractor', () => {
  const extractor = new PlainTextContentExtractor();

  it('supports TEXT, CSV, and CODE content types', () => {
    expect(extractor.supports(AttachmentContentType.TEXT, 'text/plain')).toBe(true);
    expect(extractor.supports(AttachmentContentType.CSV, 'text/csv')).toBe(true);
    expect(extractor.supports(AttachmentContentType.CODE, 'application/json')).toBe(true);
  });

  it('does not support other content types', () => {
    expect(extractor.supports(AttachmentContentType.PDF, 'application/pdf')).toBe(false);
    expect(extractor.supports(AttachmentContentType.IMAGE, 'image/png')).toBe(false);
  });

  it('decodes the buffer as UTF-8 text', async () => {
    const result = await extractor.extract(Buffer.from('hello, world — café', 'utf-8'));
    expect(result.text).toBe('hello, world — café');
  });
});
