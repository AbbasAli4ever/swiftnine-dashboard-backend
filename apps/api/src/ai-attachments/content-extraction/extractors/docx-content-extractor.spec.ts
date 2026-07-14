const mockExtractRawText = jest.fn();

jest.mock('mammoth', () => ({
  extractRawText: (...args: unknown[]) => mockExtractRawText(...args),
}));

import { AttachmentContentType } from '@app/database/generated/prisma/client';
import { DocxContentExtractor } from './docx-content-extractor';

const DOCX_MIME = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

describe('DocxContentExtractor', () => {
  const extractor = new DocxContentExtractor();

  beforeEach(() => {
    mockExtractRawText.mockReset();
  });

  it('supports only modern .docx, not legacy .doc/.rtf', () => {
    expect(extractor.supports(AttachmentContentType.DOCUMENT, DOCX_MIME)).toBe(true);
    expect(extractor.supports(AttachmentContentType.DOCUMENT, 'application/msword')).toBe(false);
    expect(extractor.supports(AttachmentContentType.DOCUMENT, 'application/rtf')).toBe(false);
  });

  it('delegates to mammoth.extractRawText with the buffer and returns its text', async () => {
    mockExtractRawText.mockResolvedValue({ value: 'Extracted docx text', messages: [] });
    const buffer = Buffer.from('fake-docx-bytes');

    const result = await extractor.extract(buffer);

    expect(mockExtractRawText).toHaveBeenCalledWith({ buffer });
    expect(result.text).toBe('Extracted docx text');
  });
});
