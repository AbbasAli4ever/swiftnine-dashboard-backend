import { Injectable } from '@nestjs/common';
import PDFDocument from 'pdfkit';
import type { GenerateDocumentInput } from './dto/generate-document.dto';

type DocumentContent = Pick<GenerateDocumentInput, 'title' | 'sections'>;

@Injectable()
export class PdfGenerationService {
  async render(input: DocumentContent): Promise<Buffer> {
    const doc = new PDFDocument({ margin: 50 });
    const chunks: Buffer[] = [];
    doc.on('data', (chunk: Buffer) => chunks.push(chunk));

    const done = new Promise<Buffer>((resolve, reject) => {
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);
    });

    doc.fontSize(20).text(input.title, { underline: true });
    doc.moveDown();

    for (const section of input.sections) {
      if (section.heading) {
        doc.fontSize(14).text(section.heading);
        doc.moveDown(0.5);
      }
      if (section.body) {
        doc.fontSize(11).text(section.body);
        doc.moveDown(0.5);
      }
      if (section.bullets?.length) {
        for (const bullet of section.bullets) {
          doc.fontSize(11).text(`•  ${bullet}`, { indent: 20 });
        }
        doc.moveDown(0.5);
      }
      doc.moveDown();
    }

    doc.end();
    return done;
  }
}
