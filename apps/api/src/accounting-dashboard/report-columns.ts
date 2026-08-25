import type { TransactionExportRow } from './accounting-dashboard.service';

// The single source of truth for the export table's column order and content,
// shared by the .xlsx and .pdf exports so the two files can never drift apart.
// Adding or reordering a column here changes both formats at once.
//
// Order: Date | Client | Bank | Currency | Revenue — the money sits last,
// beside the Currency that names its unit, so amounts line up on the right
// edge where they are read.
export type ReportColumn = {
  header: string;
  // Excel keeps the native types (number stays a number so it can be summed
  // and number-formatted in the sheet); the PDF stringifies separately.
  value: (row: TransactionExportRow) => string | number;
  // Rendered width in points for the PDF, and in characters for Excel — the
  // two units differ, hence both. The pdfWidth values sum to 762pt, exactly
  // the A4-landscape content width (842pt page - 2x40pt margin), so the table
  // spans the full page rather than leaving dead space on the right.
  pdfWidth: number;
  excelWidth: number;
  align: 'left' | 'right';
};

export const REPORT_COLUMNS: ReportColumn[] = [
  {
    header: 'Date',
    value: (row) => row.saleDate.toISOString().slice(0, 10),
    pdfWidth: 90,
    excelWidth: 14,
    align: 'left',
  },
  {
    header: 'Client',
    value: (row) => row.clientName,
    pdfWidth: 240,
    excelWidth: 26,
    align: 'left',
  },
  {
    header: 'Bank',
    value: (row) => row.bankAccount.bankName,
    pdfWidth: 200,
    excelWidth: 22,
    align: 'left',
  },
  {
    header: 'Currency',
    value: (row) => row.currency,
    pdfWidth: 92,
    excelWidth: 10,
    align: 'left',
  },
  {
    // Native amount, never converted to USD — the Currency column names the
    // unit this figure is actually in, whether the exported rows share one
    // currency or span several.
    header: 'Revenue',
    value: (row) => row.saleAmount,
    pdfWidth: 140,
    excelWidth: 16,
    align: 'right',
  },
];
