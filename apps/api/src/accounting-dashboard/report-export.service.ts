import { Injectable } from '@nestjs/common';
import { Workbook, type Row } from 'exceljs';
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
    sheet.columns = [
      { header: 'Ref ID', key: 'refId', width: 22 },
      { header: 'Date', key: 'date', width: 14 },
      { header: 'Client', key: 'client', width: 24 },
      { header: 'Bank Account', key: 'bankAccount', width: 20 },
      { header: 'Currency', key: 'currency', width: 10 },
      { header: 'Amount', key: 'amount', width: 16 },
      { header: 'Description', key: 'description', width: 32 },
    ];
    this.boldRow(sheet.getRow(1));

    for (const transaction of data.transactions) {
      sheet.addRow({
        refId: transaction.refId,
        date: transaction.saleDate.toISOString().slice(0, 10),
        client: transaction.clientName,
        bankAccount: transaction.bankAccount.bankName,
        currency: transaction.currency,
        amount: transaction.saleAmount,
        description: transaction.description ?? '',
      });
    }
    sheet.getColumn('amount').numFmt = CURRENCY_FORMAT;
  }

  private addSalesSummarySheet(
    workbook: Workbook,
    data: DailyExportData,
  ): void {
    const sheet = workbook.addWorksheet('Sales Summary');
    sheet.columns = [
      { header: 'Date', key: 'date', width: 14 },
      { header: 'Total Revenue (USD)', key: 'revenue', width: 20 },
      { header: 'Sales Count', key: 'count', width: 14 },
      { header: 'Average Sale (USD)', key: 'avg', width: 20 },
    ];
    this.boldRow(sheet.getRow(1));

    sheet.addRow({
      date: data.date,
      revenue: data.salesSummary.revenueUsd,
      count: data.salesSummary.salesCount,
      avg: data.salesSummary.avgSaleUsd,
    });
    sheet.getColumn('revenue').numFmt = CURRENCY_FORMAT;
    sheet.getColumn('avg').numFmt = CURRENCY_FORMAT;
  }

  // Header labels carry the "current" caveat directly (rather than a note
  // row above the table) because setting `sheet.columns` always writes its
  // own header into row 1 — the same caveat getDailyReport's `balances`
  // field already carries: these are current balances, not as of `date`.
  private addBalancesSheet(workbook: Workbook, data: DailyExportData): void {
    const sheet = workbook.addWorksheet('Balances by Account');
    sheet.columns = [
      { header: 'Bank Name', key: 'bankName', width: 22 },
      { header: 'Account Type', key: 'accountType', width: 16 },
      { header: 'Currency', key: 'currency', width: 10 },
      { header: 'Balance — native (current)', key: 'amount', width: 22 },
      { header: 'Balance — USD (current)', key: 'amountUsd', width: 20 },
    ];
    this.boldRow(sheet.getRow(1));

    for (const account of data.balancesByAccount) {
      sheet.addRow({
        bankName: account.bankName,
        accountType: account.accountType,
        currency: account.currencyType,
        amount: account.amount,
        amountUsd: account.amountUsd,
      });
    }
    sheet.getColumn('amount').numFmt = CURRENCY_FORMAT;
    sheet.getColumn('amountUsd').numFmt = CURRENCY_FORMAT;
  }

  // Two independent tables stacked in one sheet, scoped to `date` — not the
  // all-time breakdowns /overview shows. Built row-by-row (not via
  // `sheet.columns`, which only supports one header row per sheet).
  private addRevenueBreakdownSheet(
    workbook: Workbook,
    data: DailyExportData,
  ): void {
    const sheet = workbook.addWorksheet('Revenue Breakdown');
    [22, 16, 16, 16, 14, 12].forEach((width, index) => {
      sheet.getColumn(index + 1).width = width;
    });

    this.boldRow(sheet.addRow(['Revenue by Currency']));
    const currencyHeader = sheet.addRow([
      'Currency',
      'Total (native)',
      'Total (USD)',
      '% of Total',
    ]);
    this.boldRow(currencyHeader);
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
    const bankAccountHeader = sheet.addRow([
      'Bank Name',
      'Account Type',
      'Currency',
      'Revenue (native)',
      'Revenue (USD)',
      'Sales Count',
    ]);
    this.boldRow(bankAccountHeader);
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

  private boldRow(row: Row): void {
    row.font = { bold: true };
  }
}
