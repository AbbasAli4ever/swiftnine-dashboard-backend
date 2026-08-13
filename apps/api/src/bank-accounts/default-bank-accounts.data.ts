import type {
  AccountType,
  Currency,
} from '@app/database/generated/prisma/client';

interface DefaultBankAccount {
  bankName: string;
  accountType: AccountType;
  currencyType: Currency;
  logoUrl: string;
}

const BANK_LOGOS_BASE_URL =
  'https://public-data-swiftnine.s3.us-east-1.amazonaws.com/accounts_dashboard_assets/bank-logos';

// Starter set of bank accounts auto-provisioned for a workspace the first
// time a CEO/ACCOUNTANT joins it. Every logo currently uploaded to the
// public assets bucket (see assets/bank-logo-urls.json) is used.
export const DEFAULT_BANK_ACCOUNTS: readonly DefaultBankAccount[] = [
  {
    bankName: 'HBL',
    accountType: 'LOCAL',
    currencyType: 'PKR',
    logoUrl: `${BANK_LOGOS_BASE_URL}/hbl.svg`,
  },
  {
    bankName: 'UBL',
    accountType: 'LOCAL',
    currencyType: 'PKR',
    logoUrl: `${BANK_LOGOS_BASE_URL}/ubl.svg`,
  },
  {
    bankName: 'Alfalah',
    accountType: 'LOCAL',
    currencyType: 'PKR',
    logoUrl: `${BANK_LOGOS_BASE_URL}/alfalah.svg`,
  },
  {
    bankName: 'BOP',
    accountType: 'LOCAL',
    currencyType: 'PKR',
    logoUrl: `${BANK_LOGOS_BASE_URL}/bop.svg`,
  },
  {
    bankName: 'Faysal',
    accountType: 'LOCAL',
    currencyType: 'PKR',
    logoUrl: `${BANK_LOGOS_BASE_URL}/faysal.svg`,
  },
  {
    bankName: 'Whop',
    accountType: 'INTERNATIONAL',
    currencyType: 'USD',
    logoUrl: `${BANK_LOGOS_BASE_URL}/whop.svg`,
  },
  {
    bankName: 'Slash',
    accountType: 'INTERNATIONAL',
    currencyType: 'USD',
    logoUrl: `${BANK_LOGOS_BASE_URL}/slash.svg`,
  },
  {
    bankName: 'Payoneer',
    accountType: 'INTERNATIONAL',
    currencyType: 'USD',
    logoUrl: `${BANK_LOGOS_BASE_URL}/payoneer.svg`,
  },
  {
    bankName: 'Airwallex',
    accountType: 'INTERNATIONAL',
    currencyType: 'USD',
    logoUrl: `${BANK_LOGOS_BASE_URL}/airwallex.svg`,
  },
  {
    bankName: 'Wio',
    accountType: 'INTERNATIONAL',
    currencyType: 'USD',
    logoUrl: `${BANK_LOGOS_BASE_URL}/wio.svg`,
  },
  {
    bankName: 'Mamo',
    accountType: 'INTERNATIONAL',
    currencyType: 'USD',
    logoUrl: `${BANK_LOGOS_BASE_URL}/mamo.svg`,
  },
  {
    bankName: 'Kraken',
    accountType: 'INTERNATIONAL',
    currencyType: 'USD',
    logoUrl: `${BANK_LOGOS_BASE_URL}/kraken.svg`,
  },
] as const;
