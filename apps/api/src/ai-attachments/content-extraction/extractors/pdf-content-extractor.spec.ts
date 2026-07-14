// pdf-parse depends on pdfjs-dist, which internally uses a dynamic
// `import()` for its worker setup — this fails under Jest's default VM
// sandbox with "A dynamic import callback was invoked without
// --experimental-vm-modules". Same library/tooling incompatibility already
// hit with pptxgenjs (see ppt-generation.service.spec.ts) — mock the library
// at the boundary so this test verifies OUR wrapper, not pdfjs-dist's worker
// bootstrapping.
const mockGetText = jest.fn();
const mockDestroy = jest.fn().mockResolvedValue(undefined);
const mockPDFParseCtor = jest.fn().mockImplementation(() => ({
  getText: mockGetText,
  destroy: mockDestroy,
}));

jest.mock('pdf-parse', () => ({
  PDFParse: mockPDFParseCtor,
}));

import { AttachmentContentType } from '@app/database/generated/prisma/client';
import { PdfContentExtractor } from './pdf-content-extractor';

describe('PdfContentExtractor', () => {
  const extractor = new PdfContentExtractor();

  beforeEach(() => {
    mockGetText.mockReset();
    mockDestroy.mockClear();
    mockPDFParseCtor.mockClear();
  });

  it('supports only the PDF content type', () => {
    expect(extractor.supports(AttachmentContentType.PDF, 'application/pdf')).toBe(true);
    expect(extractor.supports(AttachmentContentType.DOCUMENT, 'application/pdf')).toBe(false);
  });

  it('parses the buffer via PDFParse, returns the text, and always destroys the parser', async () => {
    mockGetText.mockResolvedValue({ text: 'Hello from a generated PDF fixture.' });
    const buffer = Buffer.from('fake-pdf-bytes');

    const result = await extractor.extract(buffer);

    expect(mockPDFParseCtor).toHaveBeenCalledWith({ data: buffer });
    expect(result.text).toBe('Hello from a generated PDF fixture.');
    expect(mockDestroy).toHaveBeenCalled();
  });

  it('still destroys the parser when getText throws', async () => {
    mockGetText.mockRejectedValue(new Error('parse failed'));

    await expect(extractor.extract(Buffer.from('bad-bytes'))).rejects.toThrow('parse failed');
    expect(mockDestroy).toHaveBeenCalled();
  });
});
