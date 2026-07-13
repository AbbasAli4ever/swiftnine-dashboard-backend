import { Injectable } from '@nestjs/common';
import PptxGenJS from 'pptxgenjs';
import type { GenerateDocumentInput } from './dto/generate-document.dto';

type DocumentContent = Pick<GenerateDocumentInput, 'title' | 'sections'>;

@Injectable()
export class PptGenerationService {
  async render(input: DocumentContent): Promise<Buffer> {
    const pptx = new PptxGenJS();

    const titleSlide = pptx.addSlide();
    titleSlide.addText(input.title, {
      x: 0.5,
      y: 2,
      w: '90%',
      fontSize: 32,
      bold: true,
      align: 'center',
    });

    for (const section of input.sections) {
      const slide = pptx.addSlide();
      if (section.heading) {
        slide.addText(section.heading, { x: 0.5, y: 0.4, w: '90%', fontSize: 24, bold: true });
      }

      const bodyLines = section.bullets?.length
        ? section.bullets.map((text) => ({ text, options: { bullet: true, breakLine: true } }))
        : section.body
          ? [{ text: section.body, options: { breakLine: true } }]
          : [];

      if (bodyLines.length) {
        slide.addText(bodyLines, { x: 0.5, y: 1.3, w: '90%', h: '70%', fontSize: 16, valign: 'top' });
      }
    }

    const buffer = await pptx.write({ outputType: 'nodebuffer' });
    return buffer as Buffer;
  }
}
