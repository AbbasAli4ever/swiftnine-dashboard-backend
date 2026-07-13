// pptxgenjs internally uses dynamic `import('node:fs')`/`import('node:https')` to
// lazy-load Node builtins, which fails under Jest's default VM sandbox with
// "A dynamic import callback was invoked without --experimental-vm-modules".
// This is a library/tooling incompatibility, not something under our control —
// mock the library at the boundary so these tests verify OUR service's calls
// (slide/text construction, write() invocation) without exercising that path.
const mockAddText = jest.fn();
const mockAddSlide = jest.fn(() => ({ addText: mockAddText }));
const mockWrite = jest.fn().mockResolvedValue(Buffer.from('PK-fake-pptx-bytes'));

jest.mock('pptxgenjs', () =>
  jest.fn().mockImplementation(() => ({
    addSlide: mockAddSlide,
    write: mockWrite,
  })),
);

import { PptGenerationService } from './ppt-generation.service';

describe('PptGenerationService', () => {
  let service: PptGenerationService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new PptGenerationService();
  });

  it('creates a title slide plus one slide per section and returns the written buffer', async () => {
    const buffer = await service.render({
      title: 'Test Deck',
      sections: [{ heading: 'Overview', body: 'This is the overview slide.' }],
    });

    expect(mockAddSlide).toHaveBeenCalledTimes(2); // title slide + 1 section slide
    expect(mockWrite).toHaveBeenCalledWith({ outputType: 'nodebuffer' });
    expect(buffer).toEqual(Buffer.from('PK-fake-pptx-bytes'));
  });

  it('adds bullet-formatted text when a section has bullets only', async () => {
    await service.render({
      title: 'Bullet Deck',
      sections: [{ heading: 'Highlights', bullets: ['First point', 'Second point'] }],
    });

    expect(mockAddText).toHaveBeenCalledWith(
      [
        { text: 'First point', options: { bullet: true, breakLine: true } },
        { text: 'Second point', options: { bullet: true, breakLine: true } },
      ],
      expect.objectContaining({ fontSize: 16 }),
    );
  });
});
