import { PdfGenerationService } from './pdf-generation.service';

describe('PdfGenerationService', () => {
  let service: PdfGenerationService;

  beforeEach(() => {
    service = new PdfGenerationService();
  });

  it('renders a title with a body-only section into a non-empty PDF buffer', async () => {
    const buffer = await service.render({
      title: 'Test Report',
      sections: [{ body: 'This is the body of the report.' }],
    });

    expect(buffer.length).toBeGreaterThan(0);
    expect(buffer.subarray(0, 4).toString('utf-8')).toBe('%PDF');
  });

  it('renders a section with bullets only', async () => {
    const buffer = await service.render({
      title: 'Bullet Report',
      sections: [{ heading: 'Highlights', bullets: ['First point', 'Second point'] }],
    });

    expect(buffer.length).toBeGreaterThan(0);
    expect(buffer.subarray(0, 4).toString('utf-8')).toBe('%PDF');
  });

  it('renders multiple sections without throwing', async () => {
    const sections = Array.from({ length: 10 }, (_, i) => ({
      heading: `Section ${i + 1}`,
      body: `Body text for section ${i + 1}.`,
    }));

    const buffer = await service.render({ title: 'Multi-section Report', sections });

    expect(buffer.length).toBeGreaterThan(0);
  });
});
