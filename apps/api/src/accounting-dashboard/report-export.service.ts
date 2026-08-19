import { Injectable } from '@nestjs/common';
import { Workbook, type Row, type Worksheet } from 'exceljs';
import type { AccountingExportData } from './accounting-dashboard.service';

const CURRENCY_FORMAT = '#,##0.00';

// Pure rendering — no Prisma/DB dependency, takes plain data in, returns a
// Buffer, mirroring PdfGenerationService/PptGenerationService's render-only
// shape. Callers gather data (AccountingDashboardService.getExportData) and
// stream the result back over HTTP; this service only builds the file.
//
// Mirrors the Reports table exactly: one sheet, one row per transaction,
// columns Date / Revenue / Currency / Client / Bank — whether or not any
// filters were applied. No separate summary/balance/breakdown sheets.
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
    this.setColumnWidths(sheet, [14, 16, 10, 24, 20]);
    this.boldRow(
      sheet.addRow(['Date', 'Revenue', 'Currency', 'Client', 'Bank']),
    );

    for (const transaction of data.transactions) {
      const row = sheet.addRow([
        transaction.saleDate.toISOString().slice(0, 10),
        transaction.saleAmountUsd,
        transaction.currency,
        transaction.clientName,
        transaction.bankAccount.bankName,
      ]);
      row.getCell(2).numFmt = CURRENCY_FORMAT;
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
