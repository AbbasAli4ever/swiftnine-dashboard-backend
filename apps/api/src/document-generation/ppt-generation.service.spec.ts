// pptxgenjs internally uses dynamic `import('node:fs')`/`import('node:https')` to
// lazy-load Node builtins, which fails under Jest's default VM sandbox with
// "A dynamic import callback was invoked without --experimental-vm-modules".
// This is a library/tooling incompatibility, not something under our control —
// mock the library at the boundary so these tests verify OUR service's calls
// (slide/master/text/image/chart construction, write() invocation) without
// exercising that path.
const mockAddText = jest.fn();
const mockAddImage = jest.fn();
const mockAddChart = jest.fn();
const mockAddSlide = jest.fn(() => ({
  addText: mockAddText,
  addImage: mockAddImage,
  addChart: mockAddChart,
}));
const mockDefineSlideMaster = jest.fn();
const mockWrite = jest.fn().mockResolvedValue(Buffer.from('PK-fake-pptx-bytes'));

jest.mock('pptxgenjs', () =>
  jest.fn().mockImplementation(() => ({
    addSlide: mockAddSlide,
    defineSlideMaster: mockDefineSlideMaster,
    write: mockWrite,
    ChartType: { bar: 'bar', line: 'line', pie: 'pie', doughnut: 'doughnut' },
  })),
);

import { PptGenerationService } from './ppt-generation.service';
import type { ResolvedPresentation } from './presentation-orchestrator.service';

const theme = { accentColor: '2563EB', headFont: 'Arial', bodyFont: 'Arial' };

describe('PptGenerationService', () => {
  let service: PptGenerationService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new PptGenerationService();
  });

  it('defines the two theme masters and writes the buffer', async () => {
    const buffer = await service.render({
      title: 'Test Deck',
      theme,
      slides: [{ type: 'title', heading: 'Welcome' }],
    } as ResolvedPresentation);

    expect(mockDefineSlideMaster).toHaveBeenCalledTimes(2);
    expect(mockWrite).toHaveBeenCalledWith({ outputType: 'nodebuffer' });
    expect(buffer).toEqual(Buffer.from('PK-fake-pptx-bytes'));
  });

  it('renders one slide per entry, dispatching by layout type', async () => {
    await service.render({
      title: 'Deck',
      theme,
      slides: [
        { type: 'title', heading: 'Welcome' },
        { type: 'bullets', heading: 'Highlights', bullets: ['First point', 'Second point'] },
        { type: 'section-divider', heading: 'Part Two' },
      ],
    } as ResolvedPresentation);

    expect(mockAddSlide).toHaveBeenCalledTimes(3);
  });

  it('renders bullet-formatted text for a bullets slide', async () => {
    await service.render({
      title: 'Bullet Deck',
      theme,
      slides: [{ type: 'bullets', heading: 'Highlights', bullets: ['First point', 'Second point'] }],
    } as ResolvedPresentation);

    expect(mockAddText).toHaveBeenCalledWith(
      [
        { text: 'First point', options: { bullet: true, breakLine: true } },
        { text: 'Second point', options: { bullet: true, breakLine: true } },
      ],
      expect.objectContaining({ fontSize: 18 }),
    );
  });

  it('embeds resolved image data on an image slide', async () => {
    await service.render({
      title: 'Image Deck',
      theme,
      slides: [
        {
          type: 'image-right',
          heading: 'Feature',
          body: 'Body text',
          imagePrompt: 'a picture',
          imageData: { b64Json: 'AAA=', mimeType: 'image/png' },
        },
      ],
    } as ResolvedPresentation);

    expect(mockAddImage).toHaveBeenCalledWith(
      expect.objectContaining({ data: 'data:image/png;base64,AAA=' }),
    );
  });

  it('skips addImage when no imageData was resolved for an image slide', async () => {
    await service.render({
      title: 'Image Deck',
      theme,
      slides: [{ type: 'image-left', heading: 'Feature', body: 'Body text', imagePrompt: 'a picture' }],
    } as ResolvedPresentation);

    expect(mockAddImage).not.toHaveBeenCalled();
  });

  it('renders a chart slide with labels/values', async () => {
    await service.render({
      title: 'Chart Deck',
      theme,
      slides: [
        {
          type: 'chart',
          heading: 'Revenue',
          chartType: 'bar',
          labels: ['Q1', 'Q2'],
          values: [10, 20],
        },
      ],
    } as ResolvedPresentation);

    expect(mockAddChart).toHaveBeenCalledWith(
      'bar',
      [{ name: 'Revenue', labels: ['Q1', 'Q2'], values: [10, 20] }],
      expect.objectContaining({ showValue: true }),
    );
  });
});
