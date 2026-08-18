import { Injectable } from '@nestjs/common';
import { Workbook, type Row, type Worksheet } from 'exceljs';
import type { AccountingExportData } from './accounting-dashboard.service';

const CURRENCY_FORMAT = '#,##0.00';

// Pure rendering — no Prisma/DB dependency, takes plain data in, returns a
// Buffer, mirroring PdfGenerationService/PptGenerationService's render-only
// shape. Callers gather data (AccountingDashboardService.getExportData) and
// stream the result back over HTTP; this service only builds the file.
@Injectable()
export class ReportExportService {
  async buildReportWorkbook(data: AccountingExportData): Promise<Buffer> {
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
    data: AccountingExportData,
  ): void {
    const sheet = workbook.addWorksheet('Transactions');
    this.setColumnWidths(sheet, [22, 14, 24, 20, 10, 16, 32]);
    this.addTitleRow(sheet, data.dateFrom, data.dateTo, 7);
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

  // One row per day in range (zero-filled), plus a bold Total row once the
  // range spans more than one day — for a single date that row would just
  // repeat the one data row above it, so it's skipped.
  private addSalesSummarySheet(
    workbook: Workbook,
    data: AccountingExportData,
  ): void {
    const sheet = workbook.addWorksheet('Sales Summary');
    this.setColumnWidths(sheet, [14, 20, 14, 20]);
    this.addTitleRow(sheet, data.dateFrom, data.dateTo, 4);
    this.boldRow(
      sheet.addRow([
        'Date',
        'Total Revenue (USD)',
        'Sales Count',
        'Average Sale (USD)',
      ]),
    );

    for (const day of data.dailyBreakdown) {
      const row = sheet.addRow([
        day.date,
        day.revenueUsd,
        day.salesCount,
        day.avgSaleUsd,
      ]);
      row.getCell(2).numFmt = CURRENCY_FORMAT;
      row.getCell(4).numFmt = CURRENCY_FORMAT;
    }

    if (data.dailyBreakdown.length > 1) {
      const totalRow = sheet.addRow([
        'Total',
        data.totals.revenueUsd,
        data.totals.salesCount,
        data.totals.avgSaleUsd,
      ]);
      this.boldRow(totalRow);
      totalRow.getCell(2).numFmt = CURRENCY_FORMAT;
      totalRow.getCell(4).numFmt = CURRENCY_FORMAT;
    }
  }

  // Column headers carry the "current" caveat directly — this sheet's
  // balances are current, not as of the report period, the same caveat
  // getDailyReport's `balances` field already carries. There's no ledger of
  // what a balance was on a past date, only what the accountant last
  // counted it as.
  private addBalancesSheet(
    workbook: Workbook,
    data: AccountingExportData,
  ): void {
    const sheet = workbook.addWorksheet('Balances by Account');
    this.setColumnWidths(sheet, [22, 16, 10, 22, 20]);
    this.addTitleRow(sheet, data.dateFrom, data.dateTo, 5);
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

  // Two independent tables stacked in one sheet, both scoped to the report
  // period — not the all-time breakdowns /overview shows.
  private addRevenueBreakdownSheet(
    workbook: Workbook,
    data: AccountingExportData,
  ): void {
    const sheet = workbook.addWorksheet('Revenue Breakdown');
    this.setColumnWidths(sheet, [22, 16, 16, 16, 14, 12]);
    this.addTitleRow(sheet, data.dateFrom, data.dateTo, 6);

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

  // Every sheet gets the same title so it's unambiguous which period it
  // covers even once the file has been saved, renamed, or opened weeks
  // later — "Report date: 2026-08-18" for a single day (dateFrom ===
  // dateTo), or "Report period: 2026-08-01 to 2026-08-31" for a range.
  // Never a relative "Today" label, which goes stale. Merged across the
  // sheet's full column count and followed by a blank spacer row before
  // the real header.
  private addTitleRow(
    sheet: Worksheet,
    dateFrom: string,
    dateTo: string,
    columnSpan: number,
  ): void {
    const label =
      dateFrom === dateTo
        ? `Report date: ${dateFrom}`
        : `Report period: ${dateFrom} to ${dateTo}`;
    const row = sheet.addRow([label]);
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
