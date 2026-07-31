import { Injectable } from '@nestjs/common';
import PptxGenJS from 'pptxgenjs';
import type { ResolvedPresentation, ResolvedPresentationSlide } from './presentation-orchestrator.service';

const MASTER_CONTENT = 'MASTER_CONTENT';
const MASTER_ACCENT = 'MASTER_ACCENT';

function assertNever(value: never): never {
  throw new Error(`Unhandled slide type: ${JSON.stringify(value)}`);
}

function withHash(hex: string): string {
  return hex.startsWith('#') ? hex : `#${hex}`;
}

@Injectable()
export class PptGenerationService {
  async render(input: ResolvedPresentation): Promise<Buffer> {
    const pptx = new PptxGenJS();
    pptx.layout = 'LAYOUT_16x9';
    this.applyTheme(pptx, input.theme);

    for (const slide of input.slides) {
      this.renderSlide(pptx, slide, input.theme);
    }

    const buffer = await pptx.write({ outputType: 'nodebuffer' });
    return buffer as Buffer;
  }

  private applyTheme(pptx: PptxGenJS, theme: ResolvedPresentation['theme']): void {
    const accent = withHash(theme.accentColor);

    pptx.defineSlideMaster({
      title: MASTER_CONTENT,
      background: { color: 'FFFFFF' },
      objects: [
        { rect: { x: 0, y: 5.55, w: '100%', h: 0.08, fill: { color: accent.replace('#', '') } } },
      ],
      slideNumber: { x: '92%', y: '95%', fontSize: 10, color: '888888' },
    });

    pptx.defineSlideMaster({
      title: MASTER_ACCENT,
      background: { color: theme.accentColor.replace('#', '') },
    });
  }

  private renderSlide(
    pptx: PptxGenJS,
    slide: ResolvedPresentationSlide,
    theme: ResolvedPresentation['theme'],
  ): void {
    switch (slide.type) {
      case 'title':
        return this.renderTitleSlide(pptx, slide, theme);
      case 'bullets':
        return this.renderBulletsSlide(pptx, slide, theme);
      case 'image-left':
        return this.renderImageSlide(pptx, slide, theme, 'left');
      case 'image-right':
        return this.renderImageSlide(pptx, slide, theme, 'right');
      case 'chart':
        return this.renderChartSlide(pptx, slide, theme);
      case 'quote':
        return this.renderQuoteSlide(pptx, slide, theme);
      case 'section-divider':
        return this.renderDividerSlide(pptx, slide, theme);
      default:
        return assertNever(slide);
    }
  }

  private renderTitleSlide(
    pptx: PptxGenJS,
    slide: Extract<ResolvedPresentationSlide, { type: 'title' }>,
    theme: ResolvedPresentation['theme'],
  ): void {
    const s = pptx.addSlide({ masterName: MASTER_ACCENT });
    s.addText(slide.heading, {
      x: 0.6,
      y: 2.2,
      w: '85%',
      fontFace: theme.headFont,
      fontSize: 40,
      bold: true,
      color: 'FFFFFF',
      align: 'left',
    });
    if (slide.subheading) {
      s.addText(slide.subheading, {
        x: 0.6,
        y: 3.3,
        w: '80%',
        fontFace: theme.bodyFont,
        fontSize: 18,
        color: 'F2F2F2',
        align: 'left',
      });
    }
  }

  private renderBulletsSlide(
    pptx: PptxGenJS,
    slide: Extract<ResolvedPresentationSlide, { type: 'bullets' }>,
    theme: ResolvedPresentation['theme'],
  ): void {
    const s = pptx.addSlide({ masterName: MASTER_CONTENT });
    s.addText(slide.heading, {
      x: 0.5,
      y: 0.4,
      w: '90%',
      fontFace: theme.headFont,
      fontSize: 26,
      bold: true,
      color: withHash(theme.accentColor).replace('#', ''),
    });
    s.addText(
      slide.bullets.map((text) => ({ text, options: { bullet: true, breakLine: true } })),
      {
        x: 0.6,
        y: 1.4,
        w: '85%',
        h: '65%',
        fontFace: theme.bodyFont,
        fontSize: 18,
        color: '333333',
        valign: 'top',
      },
    );
  }

  private renderImageSlide(
    pptx: PptxGenJS,
    slide: Extract<ResolvedPresentationSlide, { type: 'image-left' | 'image-right' }>,
    theme: ResolvedPresentation['theme'],
    side: 'left' | 'right',
  ): void {
    const s = pptx.addSlide({ masterName: MASTER_CONTENT });
    const textX = side === 'left' ? 5.3 : 0.5;
    const imageX = side === 'left' ? 0.5 : 5.3;

    s.addText(slide.heading, {
      x: textX,
      y: 0.4,
      w: 4.2,
      fontFace: theme.headFont,
      fontSize: 22,
      bold: true,
      color: withHash(theme.accentColor).replace('#', ''),
    });

    const bodyLines = slide.bullets?.length
      ? slide.bullets.map((text) => ({ text, options: { bullet: true, breakLine: true } }))
      : slide.body
        ? [{ text: slide.body, options: { breakLine: true } }]
        : [];
    if (bodyLines.length) {
      s.addText(bodyLines, {
        x: textX,
        y: 1.4,
        w: 4.2,
        h: 3.8,
        fontFace: theme.bodyFont,
        fontSize: 14,
        color: '333333',
        valign: 'top',
      });
    }

    if (slide.imageData) {
      s.addImage({
        data: `data:${slide.imageData.mimeType};base64,${slide.imageData.b64Json}`,
        x: imageX,
        y: 0.9,
        w: 4.2,
        h: 4.2,
      });
    }
  }

  private renderChartSlide(
    pptx: PptxGenJS,
    slide: Extract<ResolvedPresentationSlide, { type: 'chart' }>,
    theme: ResolvedPresentation['theme'],
  ): void {
    const s = pptx.addSlide({ masterName: MASTER_CONTENT });
    s.addText(slide.heading, {
      x: 0.5,
      y: 0.4,
      w: '90%',
      fontFace: theme.headFont,
      fontSize: 26,
      bold: true,
      color: withHash(theme.accentColor).replace('#', ''),
    });

    const chartTypeMap = {
      bar: pptx.ChartType.bar,
      line: pptx.ChartType.line,
      pie: pptx.ChartType.pie,
      doughnut: pptx.ChartType.doughnut,
    } as const;

    s.addChart(
      chartTypeMap[slide.chartType],
      [{ name: slide.heading, labels: slide.labels, values: slide.values }],
      {
        x: 0.6,
        y: 1.4,
        w: '85%',
        h: '65%',
        chartColors: [theme.accentColor.replace('#', '')],
        showLegend: slide.chartType === 'pie' || slide.chartType === 'doughnut',
        showValue: true,
      },
    );
  }

  private renderQuoteSlide(
    pptx: PptxGenJS,
    slide: Extract<ResolvedPresentationSlide, { type: 'quote' }>,
    theme: ResolvedPresentation['theme'],
  ): void {
    const s = pptx.addSlide({ masterName: MASTER_ACCENT });
    s.addText(`"${slide.quote}"`, {
      x: 0.8,
      y: 1.8,
      w: '85%',
      h: 2.4,
      fontFace: theme.headFont,
      fontSize: 28,
      italic: true,
      color: 'FFFFFF',
      align: 'left',
      valign: 'middle',
    });
    if (slide.attribution) {
      s.addText(`— ${slide.attribution}`, {
        x: 0.8,
        y: 4.3,
        w: '80%',
        fontFace: theme.bodyFont,
        fontSize: 16,
        color: 'F2F2F2',
      });
    }
  }

  private renderDividerSlide(
    pptx: PptxGenJS,
    slide: Extract<ResolvedPresentationSlide, { type: 'section-divider' }>,
    theme: ResolvedPresentation['theme'],
  ): void {
    const s = pptx.addSlide({ masterName: MASTER_ACCENT });
    s.addText(slide.heading, {
      x: 0.6,
      y: 2.5,
      w: '85%',
      fontFace: theme.headFont,
      fontSize: 34,
      bold: true,
      color: 'FFFFFF',
      align: 'left',
    });
  }
}
