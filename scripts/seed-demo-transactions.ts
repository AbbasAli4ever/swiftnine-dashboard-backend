/**
 * Seeds a handful of transactions against existing clients in a workspace, so
 * /overview's transaction-derived topClients (see the 2026-08-25 follow-up in
 * docs/accounting-workspace-migration-changes.md) has real data to show
 * beyond whatever was already there.
 *
 * Writes directly via Prisma rather than through POST /transactions, for the
 * same reason scripts/seed-demo-clients.ts does: no login credentials are
 * available for the target workspace's owner. Hand-replicates what the real
 * endpoint does — snapshots clientName at creation time, generates a unique
 * refId — so the rows look exactly like ones the API would have produced.
 *
 * Only uses a LOCAL bank account paying in PKR, since the LOCAL-accounts-
 * only-accept-PKR rule (see the 2026-08-21 follow-up) means that's the only
 * kind of transaction this workspace's bank accounts can legally hold right
 * now — see the printed warning if that ever stops being true.
 *
 * Idempotent-ish: uses a fixed REF_PREFIX and skips clients that already
 * have a transaction with that prefix, so re-running doesn't double up.
 *
 * Usage:
 *   node -r ts-node/register -r tsconfig-paths/register \
 *     scripts/seed-demo-transactions.ts [workspaceId]
 */
import 'dotenv/config';
import { PrismaService } from '../libs/database/src/prisma.service';

const DEFAULT_WORKSPACE_ID = '847e1f05-df94-4051-b8f3-8307f9a4e0f9';
const REF_PREFIX = 'SEED-TXN-';

// clientName is matched against whatever's already seeded by
// seed-demo-clients.ts. amounts are PKR, one entry per sale (not summed) so
// clients end up with different sale counts too.
const PLAN: { clientName: string; amounts: number[] }[] = [
  { clientName: 'Zenith Holdings', amounts: [45000, 30000] },
  { clientName: 'Aberdeen Logistics', amounts: [60000] },
  { clientName: 'Ember Studios', amounts: [22000, 18000] },
  { clientName: 'Cedar & Sons', amounts: [10000, 12000, 8000] },
  { clientName: 'Delta Freight Co', amounts: [5000] },
];

function daysAgo(n: number): Date {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - n);
  d.setUTCHours(12, 0, 0, 0);
  return d;
}

async function main(): Promise<void> {
  const workspaceId = process.argv[2] ?? DEFAULT_WORKSPACE_ID;
  const prisma = new PrismaService();

  const workspace = await prisma.workspace.findFirst({
    where: { id: workspaceId, deletedAt: null },
    select: { id: true, name: true },
  });
  if (!workspace) {
    console.error(`Workspace ${workspaceId} not found.`);
    process.exit(1);
  }
  console.log(`Workspace: ${workspace.name} (${workspace.id})`);

  const bankAccount = await prisma.bankAccount.findFirst({
    where: { workspaceId, accountType: 'LOCAL', currencyType: 'PKR' },
    select: { id: true, bankName: true },
  });
  if (!bankAccount) {
    console.error(
      'No LOCAL/PKR bank account found in this workspace — the LOCAL-accounts-' +
        'only-accept-PKR rule means there is no bank account these seeded ' +
        'transactions could legally use. Add one (or pass a different currency ' +
        'plan) before re-running.',
    );
    process.exit(1);
  }
  console.log(`Using bank account: ${bankAccount.bankName} (PKR)`);

  const otherAccounts = await prisma.bankAccount.findMany({
    where: { workspaceId, id: { not: bankAccount.id } },
    select: { bankName: true, accountType: true, currencyType: true },
  });
  for (const acct of otherAccounts) {
    if (acct.accountType === 'LOCAL' && acct.currencyType !== 'PKR') {
      console.log(
        `  ⚠  "${acct.bankName}" is LOCAL but denominated in ${acct.currencyType}, not PKR — ` +
          'no transaction can legally be created against it via the real API ' +
          "(LOCAL requires PKR, but that isn't this account's own currency either). Not used by this script.",
      );
    }
  }

  let created = 0;
  let skipped = 0;

  for (const entry of PLAN) {
    const client = await prisma.clients.findFirst({
      where: { workspaceId, clientName: entry.clientName },
      select: { id: true, clientName: true },
    });
    if (!client) {
      console.log(`  skip "${entry.clientName}" — no client with that name in this workspace`);
      continue;
    }

    const alreadySeeded = await prisma.transaction.findFirst({
      where: { workspaceId, clientId: client.id, refId: { startsWith: REF_PREFIX } },
      select: { id: true },
    });
    if (alreadySeeded) {
      console.log(`  skip "${client.clientName}" — already has seeded transactions`);
      skipped += entry.amounts.length;
      continue;
    }

    for (let i = 0; i < entry.amounts.length; i++) {
      await prisma.transaction.create({
        data: {
          workspaceId,
          clientId: client.id,
          clientName: client.clientName,
          bankAccountId: bankAccount.id,
          saleAmount: entry.amounts[i],
          currency: 'PKR',
          saleDate: daysAgo((entry.amounts.length - i) * 3),
          refId: `${REF_PREFIX}${client.id}-${i}`,
          description: 'Seeded for overview testing',
        },
      });
      created++;
    }
    const total = entry.amounts.reduce((a, b) => a + b, 0);
    console.log(
      `  + "${client.clientName}": ${entry.amounts.length} sale(s), PKR ${total.toLocaleString()} total`,
    );
  }

  console.log(`\nCreated ${created} transaction(s), skipped ${skipped}.`);
  await prisma.$disconnect();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
