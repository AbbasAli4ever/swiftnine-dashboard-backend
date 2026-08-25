import { Injectable } from '@nestjs/common';
import PDFDocument from 'pdfkit';
import SVGtoPDF from 'svg-to-pdfkit';
import type { AccountingExportData } from './accounting-dashboard.service';
import { REPORT_COLUMNS, type ReportColumn } from './report-columns';
import { SWIFTNINE_LOGO_ASPECT, SWIFTNINE_LOGO_SVG } from './swiftnine-logo';

// Pure rendering — no Prisma/DB dependency, takes plain data in and returns a
// Buffer, mirroring ReportExportService (.xlsx) and PdfGenerationService.
// Callers gather data (AccountingDashboardService.getExportData) and stream
// the result back over HTTP; this service only builds the file.
//
// Column order/content comes from the shared REPORT_COLUMNS, so this file and
// the .xlsx export can never disagree about the table's shape.

const PAGE_MARGIN = 40;
const LOGO_WIDTH = 120;
const LOGO_HEIGHT = LOGO_WIDTH / SWIFTNINE_LOGO_ASPECT;

const ROW_HEIGHT = 22;
const HEADER_ROW_HEIGHT = 26;
const CELL_PADDING = 8;

const COLOR_TEXT = '#172035'; // the logo's own dark navy
const COLOR_MUTED = '#6b7280';
const COLOR_HEADER_BG = '#172035';
const COLOR_HEADER_TEXT = '#ffffff';
const COLOR_ROW_ALT = '#f4f6fb';
const COLOR_BORDER = '#dfe3ec';
const COLOR_ACCENT = '#3878f6'; // the logo's blue

const TABLE_WIDTH = REPORT_COLUMNS.reduce((sum, col) => sum + col.pdfWidth, 0);

@Injectable()
export class ReportPdfService {
  async buildReportPdf(data: AccountingExportData): Promise<Buffer> {
    // landscape: the five columns total 515pt, which fits portrait A4, but
    // long client/bank names read far better with the extra width.
    const doc = new PDFDocument({
      size: 'A4',
      layout: 'landscape',
      margin: PAGE_MARGIN,
      info: {
        Title: `Accounting Report ${this.rangeLabel(data)}`,
        Author: 'SwiftNine Accounting',
        CreationDate: new Date(),
      },
    });

    const chunks: Buffer[] = [];
    doc.on('data', (chunk: Buffer) => chunks.push(chunk));
    const done = new Promise<Buffer>((resolve, reject) => {
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);
    });

    this.drawHeader(doc, data);
    this.drawTable(doc, data);
    this.drawPageNumbers(doc);

    doc.end();
    return done;
  }

  // Logo top-left, report title and date range beneath it, a rule to close it
  // off. Drawn once on page 1 — continuation pages get the repeated table
  // header instead, so the logo does not eat vertical space on every page.
  private drawHeader(
    doc: PDFKit.PDFDocument,
    data: AccountingExportData,
  ): void {
    SVGtoPDF(doc, SWIFTNINE_LOGO_SVG, PAGE_MARGIN, PAGE_MARGIN, {
      width: LOGO_WIDTH,
      height: LOGO_HEIGHT,
      preserveAspectRatio: 'xMinYMin meet',
    });

    const titleY = PAGE_MARGIN + LOGO_HEIGHT + 14;
    doc
      .fillColor(COLOR_TEXT)
      .font('Helvetica-Bold')
      .fontSize(16)
      .text('Accounting Report', PAGE_MARGIN, titleY);

    doc
      .fillColor(COLOR_MUTED)
      .font('Helvetica')
      .fontSize(9)
      .text(this.rangeLabel(data), PAGE_MARGIN, titleY + 20);

    // Transaction count on the right, baseline-aligned with the title.
    const count = data.transactions.length;
    doc
      .fillColor(COLOR_MUTED)
      .fontSize(9)
      .text(
        `${count} ${count === 1 ? 'transaction' : 'transactions'}`,
        PAGE_MARGIN,
        titleY + 20,
        { width: this.contentWidth(doc), align: 'right' },
      );

    const ruleY = titleY + 40;
    doc
      .moveTo(PAGE_MARGIN, ruleY)
      .lineTo(PAGE_MARGIN + this.contentWidth(doc), ruleY)
      .lineWidth(1.5)
      .strokeColor(COLOR_ACCENT)
      .stroke();

    doc.y = ruleY + 18;
  }

  private drawTable(doc: PDFKit.PDFDocument, data: AccountingExportData): void {
    if (data.transactions.length === 0) {
      doc
        .fillColor(COLOR_MUTED)
        .font('Helvetica-Oblique')
        .fontSize(10)
        .text(
          'No transactions match the selected filters.',
          PAGE_MARGIN,
          doc.y,
        );
      return;
    }

    this.drawTableHeader(doc);

    data.transactions.forEach((transaction, index) => {
      // Break before drawing, never mid-row, so a row is never split across
      // pages. The repeated header is what identifies the columns on page 2+.
      if (doc.y + ROW_HEIGHT > this.pageBottom(doc)) {
        doc.addPage();
        doc.y = PAGE_MARGIN;
        this.drawTableHeader(doc);
      }
      this.drawRow(doc, transaction, index);
    });

    this.drawTotals(doc, data);
  }

  private drawTableHeader(doc: PDFKit.PDFDocument): void {
    const y = doc.y;
    doc
      .rect(PAGE_MARGIN, y, TABLE_WIDTH, HEADER_ROW_HEIGHT)
      .fillColor(COLOR_HEADER_BG)
      .fill();

    doc.font('Helvetica-Bold').fontSize(9).fillColor(COLOR_HEADER_TEXT);
    this.forEachCell(REPORT_COLUMNS, (column, x) => {
      const inner = column.pdfWidth - CELL_PADDING * 2;
      doc.text(
        this.truncate(doc, column.header.toUpperCase(), inner),
        x + CELL_PADDING,
        y + 9,
        { width: inner, align: column.align, lineBreak: false },
      );
    });

    doc.y = y + HEADER_ROW_HEIGHT;
  }

  private drawRow(
    doc: PDFKit.PDFDocument,
    transaction: AccountingExportData['transactions'][number],
    index: number,
  ): void {
    const y = doc.y;

    // Zebra striping: banding beats drawing a grid line under every row when
    // the table runs to hundreds of rows.
    if (index % 2 === 1) {
      doc
        .rect(PAGE_MARGIN, y, TABLE_WIDTH, ROW_HEIGHT)
        .fillColor(COLOR_ROW_ALT)
        .fill();
    }

    doc.font('Helvetica').fontSize(9).fillColor(COLOR_TEXT);
    this.forEachCell(REPORT_COLUMNS, (column, x) => {
      const raw = column.value(transaction);
      const text =
        typeof raw === 'number' ? this.formatAmount(raw) : String(raw);
      const inner = column.pdfWidth - CELL_PADDING * 2;
      doc.text(this.truncate(doc, text, inner), x + CELL_PADDING, y + 7, {
        width: inner,
        align: column.align,
        lineBreak: false,
      });
    });

    doc.y = y + ROW_HEIGHT;
  }

  // Per-currency totals. Deliberately NOT one grand total — the rows carry
  // native amounts in whatever currencies matched the filter, so summing
  // across them would produce a meaningless number. One line per currency
  // present, matching how the Reports UI presents multi-currency figures.
  private drawTotals(
    doc: PDFKit.PDFDocument,
    data: AccountingExportData,
  ): void {
    const totals = new Map<string, number>();
    for (const transaction of data.transactions) {
      totals.set(
        transaction.currency,
        (totals.get(transaction.currency) ?? 0) + transaction.saleAmount,
      );
    }

    const needed = 14 + totals.size * ROW_HEIGHT;
    if (doc.y + needed > this.pageBottom(doc)) {
      doc.addPage();
      doc.y = PAGE_MARGIN;
    }

    const y = doc.y + 6;
    doc
      .moveTo(PAGE_MARGIN, y)
      .lineTo(PAGE_MARGIN + TABLE_WIDTH, y)
      .lineWidth(1)
      .strokeColor(COLOR_BORDER)
      .stroke();
    doc.y = y + 8;

    // "Total <CUR>" sits as one right-aligned label ending where the Currency
    // column ends, with the figure under Revenue — so each total lines up with
    // the column of figures it sums.
    const revenue = REPORT_COLUMNS[REPORT_COLUMNS.length - 1];
    const labelRight = PAGE_MARGIN + TABLE_WIDTH - revenue.pdfWidth;
    const LABEL_WIDTH = 220;

    for (const [currency, total] of [...totals].sort(([a], [b]) =>
      a.localeCompare(b),
    )) {
      const rowY = doc.y;
      doc
        .font('Helvetica-Bold')
        .fontSize(9)
        .fillColor(COLOR_TEXT)
        .text(`Total ${currency}`, labelRight - LABEL_WIDTH, rowY, {
          width: LABEL_WIDTH - CELL_PADDING,
          align: 'right',
          lineBreak: false,
        })
        .text(this.formatAmount(total), labelRight, rowY, {
          width: revenue.pdfWidth - CELL_PADDING,
          align: 'right',
          lineBreak: false,
        });
      doc.y = rowY + ROW_HEIGHT;
    }
  }

  // Footer on every page. Must run after all content — switching pages with
  // bufferedPageRange is the only way to reach page 1 again once page N is
  // open.
  private drawPageNumbers(doc: PDFKit.PDFDocument): void {
    const range = doc.bufferedPageRange();
    for (let i = 0; i < range.count; i += 1) {
      doc.switchToPage(range.start + i);
      const y = doc.page.height - PAGE_MARGIN + 8;
      doc
        .font('Helvetica')
        .fontSize(8)
        .fillColor(COLOR_MUTED)
        .text(`Page ${i + 1} of ${range.count}`, PAGE_MARGIN, y, {
          width: this.contentWidth(doc),
          align: 'right',
          lineBreak: false,
        });
    }
  }

  // Walks the columns left to right, handing each its starting x — keeps the
  // running-offset arithmetic in one place instead of in every draw method.
  private forEachCell(
    columns: ReportColumn[],
    draw: (column: ReportColumn, x: number) => void,
  ): void {
    let x = PAGE_MARGIN;
    for (const column of columns) {
      draw(column, x);
      x += column.pdfWidth;
    }
  }

  // pdfkit's own `ellipsis` option only clips when an explicit height is
  // given, and `lineBreak: false` still wraps a string wider than `width` —
  // either would push a row past the fixed ROW_HEIGHT the pagination maths
  // depends on, and did (long client names spilled onto a second line, and
  // the CURRENCY header wrapped to "CURRENC/Y"). Measuring and cutting the
  // string here keeps every cell to exactly one line, whatever the content.
  private truncate(
    doc: PDFKit.PDFDocument,
    text: string,
    maxWidth: number,
  ): string {
    if (doc.widthOfString(text) <= maxWidth) return text;
    const ellipsis = '\u2026';
    let cut = text;
    while (cut.length > 1 && doc.widthOfString(cut + ellipsis) > maxWidth) {
      cut = cut.slice(0, -1);
    }
    return cut.trimEnd() + ellipsis;
  }

  private formatAmount(value: number): string {
    return value.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  private rangeLabel(data: AccountingExportData): string {
    return data.dateFrom === data.dateTo
      ? data.dateFrom
      : `${data.dateFrom} to ${data.dateTo}`;
  }

  private contentWidth(doc: PDFKit.PDFDocument): number {
    return doc.page.width - PAGE_MARGIN * 2;
  }

  private pageBottom(doc: PDFKit.PDFDocument): number {
    return doc.page.height - PAGE_MARGIN - 16;
  }
}
