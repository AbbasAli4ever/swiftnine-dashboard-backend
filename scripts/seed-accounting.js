/**
 * Seeds test data into the accounting tables (Clients, Transaction, BankAccount)
 * so the /clients, /transactions, /bank-accounts, and /accounting-dashboard/overview
 * APIs have something realistic to return.
 *
 * Usage:
 *   node scripts/seed-accounting.js
 *
 * This DELETEs existing rows in Transaction, Clients, and BankAccount before
 * reseeding, so it's safe (and expected) to re-run repeatedly during testing.
 * It talks to Postgres directly via `pg` (not Prisma) so it can run as plain
 * JS with no build step — the generated Prisma client in this repo is
 * TypeScript-only outside of `dist/`.
 */

require('dotenv/config');
const { randomUUID } = require('crypto');
const { Client } = require('pg');

const PAYMENT_PLATFORMS = [
  'WHOP',
  'AIRWALLEX',
  'SLASH',
  'PAYONEER',
  'WIO_BANK',
  'MAMO',
  'KRAKEN',
];
const CURRENCIES = ['USD', 'HKD', 'PKR'];

const CLIENTS = [
  { clientName: 'Victoria Partners', totalRevenue: 32400, currencyType: 'USD' },
  { clientName: 'Anton Enne', totalRevenue: 24100, currencyType: 'USD' },
  { clientName: 'Phase Shop', totalRevenue: 18600, currencyType: 'USD' },
  { clientName: 'ABD LTD', totalRevenue: 11200, currencyType: 'USD' },
  { clientName: 'Acme Corp', totalRevenue: 45300, currencyType: 'USD' },
  { clientName: 'Nimbus Traders', totalRevenue: 15800, currencyType: 'PKR' },
];

const BANK_ACCOUNTS = [
  { bankName: 'HBL', accountType: 'LOCAL', currencyType: 'PKR', amount: 1250000 },
  { bankName: 'MCB', accountType: 'LOCAL', currencyType: 'PKR', amount: 2100000 },
  { bankName: 'UBL', accountType: 'LOCAL', currencyType: 'PKR', amount: 850000 },
  { bankName: 'Meezan Bank', accountType: 'LOCAL', currencyType: 'PKR', amount: 1900000 },
  { bankName: 'Allied Bank', accountType: 'LOCAL', currencyType: 'PKR', amount: 2065000 },
  { bankName: 'Whop', accountType: 'INTERNATIONAL', currencyType: 'USD', amount: 18500 },
  { bankName: 'Slash', accountType: 'INTERNATIONAL', currencyType: 'USD', amount: 24100 },
  { bankName: 'Payoneer', accountType: 'INTERNATIONAL', currencyType: 'USD', amount: 9400 },
  { bankName: 'Airwallex', accountType: 'INTERNATIONAL', currencyType: 'USD', amount: 15200 },
  { bankName: 'Wise', accountType: 'INTERNATIONAL', currencyType: 'HKD', amount: 35300 },
];

function randomFrom(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function randomAmount(min, max) {
  return Math.round((Math.random() * (max - min) + min) * 100) / 100;
}

function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}

function randomDateBetween(daysAgoStart, daysAgoEnd) {
  const start = daysAgo(daysAgoStart).getTime();
  const end = daysAgo(daysAgoEnd).getTime();
  return new Date(start + Math.random() * (end - start));
}

// One entry per transaction to create, spread across time so every dashboard
// bucket (today / yesterday / this month / last month / this year / last
// year) has something in it.
function buildTransactionDates() {
  const dates = [];
  for (let i = 0; i < 5; i++) dates.push(new Date()); // today
  for (let i = 0; i < 5; i++) dates.push(daysAgo(1)); // yesterday
  for (let i = 0; i < 15; i++) dates.push(randomDateBetween(2, 27)); // earlier this month
  for (let i = 0; i < 15; i++) dates.push(randomDateBetween(30, 58)); // last month
  for (let i = 0; i < 20; i++) dates.push(randomDateBetween(60, 330)); // earlier this year
  for (let i = 0; i < 15; i++) dates.push(randomDateBetween(370, 700)); // last year
  return dates;
}

async function main() {
  const connectionString = process.env.DATABASE_URL || "postgresql://swiftnine:2vdbf8OFS10QJ8UAiSBlolLS@localhost:5432/swiftnine_dashbaord?schema=public";
  if (!connectionString) {
    throw new Error('DATABASE_URL is not set (check your .env file).');
  }

  const client = new Client({ connectionString });
  await client.connect();

  try {
    console.log('Clearing existing accounting data (Transaction, Clients, BankAccount)...');
    await client.query('DELETE FROM "Transaction"');
    await client.query('DELETE FROM "Clients"');
    await client.query('DELETE FROM "BankAccount"');

    console.log(`Seeding ${CLIENTS.length} clients...`);
    const clientIds = [];
    for (const c of CLIENTS) {
      const id = randomUUID();
      clientIds.push(id);
      await client.query(
        `INSERT INTO "Clients" ("id", "clientName", "totalRevenue", "currencyType", "createdAt", "updatedAt")
         VALUES ($1, $2, $3, $4, now(), now())`,
        [id, c.clientName, c.totalRevenue, c.currencyType],
      );
    }

    console.log(`Seeding ${BANK_ACCOUNTS.length} bank accounts...`);
    for (const b of BANK_ACCOUNTS) {
      await client.query(
        `INSERT INTO "BankAccount" ("id", "bankName", "accountType", "currencyType", "amount", "createdAt", "updatedAt")
         VALUES ($1, $2, $3, $4, $5, now(), now())`,
        [randomUUID(), b.bankName, b.accountType, b.currencyType, b.amount],
      );
    }

    const dates = buildTransactionDates();
    console.log(`Seeding ${dates.length} transactions...`);
    let seq = 0;
    for (const createdAt of dates) {
      seq += 1;
      const clientIndex = Math.floor(Math.random() * CLIENTS.length);
      const clientId = clientIds[clientIndex];
      const clientName = CLIENTS[clientIndex].clientName;
      const paymentPlatform = randomFrom(PAYMENT_PLATFORMS);
      const currency = randomFrom(CURRENCIES);
      const saleAmount = randomAmount(50, 5000);
      const refId = `seed-${Date.now()}-${seq}`;

      await client.query(
        `INSERT INTO "Transaction"
           ("id", "clientId", "clientName", "saleAmount", "paymentPlatform", "currency", "refId", "description", "createdAt", "updatedAt")
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $9)`,
        [
          randomUUID(),
          clientId,
          clientName,
          saleAmount,
          paymentPlatform,
          currency,
          refId,
          'Seeded test transaction',
          createdAt,
        ],
      );
    }

    console.log('Done. Seeded:');
    console.log(`  - ${CLIENTS.length} clients`);
    console.log(`  - ${BANK_ACCOUNTS.length} bank accounts`);
    console.log(`  - ${dates.length} transactions`);
  } finally {
    await client.end();
  }
}

main().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
