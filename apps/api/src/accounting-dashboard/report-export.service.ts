import { Injectable } from '@nestjs/common';
import { Workbook, type Row, type Worksheet } from 'exceljs';
import type { AccountingExportData } from './accounting-dashboard.service';
import { REPORT_COLUMNS } from './report-columns';

const CURRENCY_FORMAT = '#,##0.00';

// Pure rendering — no Prisma/DB dependency, takes plain data in, returns a
// Buffer, mirroring PdfGenerationService/PptGenerationService's render-only
// shape. Callers gather data (AccountingDashboardService.getExportData) and
// stream the result back over HTTP; this service only builds the file.
//
// One sheet, one row per transaction — whether or not any filters were
// applied. No separate summary/balance/breakdown sheets. Column order and
// content come from the shared REPORT_COLUMNS, so this file and the PDF
// export can never disagree about the table's shape.
@Injectable()
export class ReportExportService {
  async buildReportWorkbook(data: AccountingExportData): Promise<Buffer> {
    const workbook = new Workbook();
    workbook.creator = 'SwiftNine Accounting';
    workbook.created = new Date();

    this.addTransactionsSheet(workbook, data);

    // exceljs bundles its own non-generic ambient `Buffer` type, which
    // conflicts with @types/node's generic `Buffer<TArrayBuffer>` — cast
    // through ArrayBuffer to get a real Node Buffer back out.
    const written = await workbook.xlsx.writeBuffer();
    return Buffer.from(written as unknown as ArrayBuffer);
  }

  private addTransactionsSheet(
    workbook: Workbook,
    data: AccountingExportData,
  ): void {
    const sheet = workbook.addWorksheet('Report');
    this.setColumnWidths(
      sheet,
      REPORT_COLUMNS.map((column) => column.excelWidth),
    );
    this.boldRow(sheet.addRow(REPORT_COLUMNS.map((column) => column.header)));

    for (const transaction of data.transactions) {
      const row = sheet.addRow(
        REPORT_COLUMNS.map((column) => column.value(transaction)),
      );
      // Number-format every numeric column (currently just Revenue), found by
      // the column's own type rather than a hardcoded index, so reordering
      // REPORT_COLUMNS cannot leave the format on the wrong cell.
      REPORT_COLUMNS.forEach((column, index) => {
        if (typeof column.value(transaction) === 'number') {
          row.getCell(index + 1).numFmt = CURRENCY_FORMAT;
        }
      });
    }
  }

  private setColumnWidths(sheet: Worksheet, widths: number[]): void {
    widths.forEach((width, index) => {
      sheet.getColumn(index + 1).width = width;
    });
  }

  private boldRow(row: Row): void {
    row.font = { bold: true };
  }
}
