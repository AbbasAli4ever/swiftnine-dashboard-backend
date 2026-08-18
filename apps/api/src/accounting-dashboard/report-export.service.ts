import { Injectable } from '@nestjs/common';
import { Workbook, type Row, type Worksheet } from 'exceljs';
import type { DailyExportData } from './accounting-dashboard.service';

const CURRENCY_FORMAT = '#,##0.00';

// Pure rendering — no Prisma/DB dependency, takes plain data in, returns a
// Buffer, mirroring PdfGenerationService/PptGenerationService's render-only
// shape. Callers gather data (AccountingDashboardService.getDailyExportData)
// and stream the result back over HTTP; this service only builds the file.
@Injectable()
export class ReportExportService {
  async buildDailyReportWorkbook(data: DailyExportData): Promise<Buffer> {
    const workbook = new Workbook();
    workbook.creator = 'SwiftNine Accounting';
    workbook.created = new Date();

    this.addTransactionsSheet(workbook, data);
    this.addSalesSummarySheet(workbook, data);
    this.addBalancesSheet(workbook, data);
    this.addRevenueBreakdownSheet(workbook, data);

    // exceljs bundles its own non-generic ambient `Buffer` type, which
    // conflicts with @types/node's generic `Buffer<TArrayBuffer>` — cast
    // through ArrayBuffer to get a real Node Buffer back out.
    const written = await workbook.xlsx.writeBuffer();
    return Buffer.from(written as unknown as ArrayBuffer);
  }

  private addTransactionsSheet(
    workbook: Workbook,
    data: DailyExportData,
  ): void {
    const sheet = workbook.addWorksheet('Transactions');
    this.setColumnWidths(sheet, [22, 14, 24, 20, 10, 16, 32]);
    this.addTitleRow(sheet, data.date, 7);
    this.boldRow(
      sheet.addRow([
        'Ref ID',
        'Date',
        'Client',
        'Bank Account',
        'Currency',
        'Amount',
        'Description',
      ]),
    );

    for (const transaction of data.transactions) {
      const row = sheet.addRow([
        transaction.refId,
        transaction.saleDate.toISOString().slice(0, 10),
        transaction.clientName,
        transaction.bankAccount.bankName,
        transaction.currency,
        transaction.saleAmount,
        transaction.description ?? '',
      ]);
      row.getCell(6).numFmt = CURRENCY_FORMAT;
    }
  }

  private addSalesSummarySheet(
    workbook: Workbook,
    data: DailyExportData,
  ): void {
    const sheet = workbook.addWorksheet('Sales Summary');
    this.setColumnWidths(sheet, [14, 20, 14, 20]);
    this.addTitleRow(sheet, data.date, 4);
    this.boldRow(
      sheet.addRow([
        'Date',
        'Total Revenue (USD)',
        'Sales Count',
        'Average Sale (USD)',
      ]),
    );

    const row = sheet.addRow([
      data.date,
      data.salesSummary.revenueUsd,
      data.salesSummary.salesCount,
      data.salesSummary.avgSaleUsd,
    ]);
    row.getCell(2).numFmt = CURRENCY_FORMAT;
    row.getCell(4).numFmt = CURRENCY_FORMAT;
  }

  // Column headers carry the "current" caveat directly — this sheet's
  // balances are current, not as of `date`, the same caveat getDailyReport's
  // `balances` field already carries. There's no ledger of what a balance
  // was on a past date, only what the accountant last counted it as.
  private addBalancesSheet(workbook: Workbook, data: DailyExportData): void {
    const sheet = workbook.addWorksheet('Balances by Account');
    this.setColumnWidths(sheet, [22, 16, 10, 22, 20]);
    this.addTitleRow(sheet, data.date, 5);
    this.boldRow(
      sheet.addRow([
        'Bank Name',
        'Account Type',
        'Currency',
        'Balance — native (current)',
        'Balance — USD (current)',
      ]),
    );

    for (const account of data.balancesByAccount) {
      const row = sheet.addRow([
        account.bankName,
        account.accountType,
        account.currencyType,
        account.amount,
        account.amountUsd,
      ]);
      row.getCell(4).numFmt = CURRENCY_FORMAT;
      row.getCell(5).numFmt = CURRENCY_FORMAT;
    }
  }

  // Two independent tables stacked in one sheet, both scoped to `date` —
  // not the all-time breakdowns /overview shows.
  private addRevenueBreakdownSheet(
    workbook: Workbook,
    data: DailyExportData,
  ): void {
    const sheet = workbook.addWorksheet('Revenue Breakdown');
    this.setColumnWidths(sheet, [22, 16, 16, 16, 14, 12]);
    this.addTitleRow(sheet, data.date, 6);

    this.boldRow(sheet.addRow(['Revenue by Currency']));
    this.boldRow(
      sheet.addRow(['Currency', 'Total (native)', 'Total (USD)', '% of Total']),
    );
    for (const item of data.revenueByCurrency) {
      const row = sheet.addRow([
        item.currency,
        item.total,
        item.totalUsd,
        item.percent,
      ]);
      row.getCell(2).numFmt = CURRENCY_FORMAT;
      row.getCell(3).numFmt = CURRENCY_FORMAT;
    }

    sheet.addRow([]);

    this.boldRow(sheet.addRow(['Revenue by Bank Account']));
    this.boldRow(
      sheet.addRow([
        'Bank Name',
        'Account Type',
        'Currency',
        'Revenue (native)',
        'Revenue (USD)',
        'Sales Count',
      ]),
    );
    for (const item of data.revenueByBankAccount) {
      const row = sheet.addRow([
        item.bankName,
        item.accountType,
        item.currencyType,
        item.totalRevenue,
        item.totalRevenueUsd,
        item.salesCount,
      ]);
      if (item.totalRevenue !== null) row.getCell(4).numFmt = CURRENCY_FORMAT;
      row.getCell(5).numFmt = CURRENCY_FORMAT;
    }
  }

  // Every sheet gets the same title so it's unambiguous which day it covers
  // even once the file has been saved, renamed, or opened weeks later —
  // "Report date: 2026-08-18", not a relative "Today" that goes stale.
  // Merged across the sheet's full column count and followed by a blank
  // spacer row before the real header.
  private addTitleRow(
    sheet: Worksheet,
    date: string,
    columnSpan: number,
  ): void {
    const row = sheet.addRow([`Report date: ${date}`]);
    row.font = { bold: true, size: 12 };
    if (columnSpan > 1) sheet.mergeCells(row.number, 1, row.number, columnSpan);
    sheet.addRow([]);
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
