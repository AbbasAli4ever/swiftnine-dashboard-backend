import 'dotenv/config';
import { randomUUID, createHash } from 'node:crypto';
import { Client } from 'pg';

const BASE_URL = 'http://localhost:3020/api/v1';
const TEST_TAG = 'reports-test';

function hashToken(rawToken: string): string {
  return createHash('sha256').update(rawToken).digest('hex');
}

async function main() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();

  try {
    const inviterId = randomUUID();
    await client.query(
      `INSERT INTO "users" ("id", "full_name", "email", "password_hash", "is_email_verified", "updated_at")
       VALUES ($1, $2, $3, $4, true, now())`,
      [inviterId, 'Reports Test Inviter', `${TEST_TAG}-inviter@example.com`, 'x'],
    );

    const workspaceId = randomUUID();
    await client.query(
      `INSERT INTO "workspaces" ("id", "name", "workspace_use", "management_type", "created_by", "updated_at")
       VALUES ($1, $2, 'WORK', 'HR_RECRUITING', $3, now())`,
      [workspaceId, `${TEST_TAG}-ws`, inviterId],
    );

    // Claim an ACCOUNTANT invite via the real API — this also auto-provisions
    // the 12 default bank accounts for this brand-new workspace.
    const rawToken = randomUUID();
    await client.query(
      `INSERT INTO "workspace_invites"
         ("id", "workspace_id", "email", "role", "accounting_role", "invite_token", "invited_by", "status", "expires_at")
       VALUES ($1, $2, $3, 'MEMBER', 'ACCOUNTANT', $4, $5, 'PENDING', now() + interval '7 days')`,
      [randomUUID(), workspaceId, `${TEST_TAG}-user@example.com`, hashToken(rawToken), inviterId],
    );

    const claimRes = await fetch(`${BASE_URL}/workspaces/invite/claim`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token: rawToken,
        fullName: 'Reports Test User',
        password: 'Passw0rd!23',
      }),
    });
    const claimBody = await claimRes.json();
    if (!claimRes.ok) throw new Error(`claim failed: ${claimRes.status} ${JSON.stringify(claimBody)}`);
    const accessToken = claimBody.data.accessToken;

    const { rows: bankAccounts } = await client.query(
      `SELECT id FROM "BankAccount" WHERE "workspace_id" = $1 AND "currencyType" = 'PKR' LIMIT 1`,
      [workspaceId],
    );
    const bankAccountId = bankAccounts[0].id;
    console.log(`Auto-provisioned bank accounts found, using PKR account ${bankAccountId}`);

    const clientId = randomUUID();
    await client.query(
      `INSERT INTO "Clients" ("id", "workspace_id", "clientName", "totalRevenue", "updatedAt")
       VALUES ($1, $2, $3, 0, now())`,
      [clientId, workspaceId, `${TEST_TAG}-client`],
    );

    async function insertTransaction(saleDate: string, saleAmount: number) {
      await client.query(
        `INSERT INTO "Transaction"
           ("id", "workspace_id", "clientId", "clientName", "bank_account_id", "type", "saleAmount", "paymentPlatform", "currency", "saleDate", "refId", "updatedAt")
         VALUES ($1, $2, $3, $4, $5, 'CREDIT', $6, 'WHOP', 'PKR', $7, $8, now())`,
        [
          randomUUID(),
          workspaceId,
          clientId,
          `${TEST_TAG}-client`,
          bankAccountId,
          saleAmount,
          new Date(saleDate),
          `${TEST_TAG}-${randomUUID()}`,
        ],
      );
    }

    // March: 2780 + 5560 (on the 10th) + 1390 (on the 15th) = 8340+1390 PKR
    // = 30 + 20?? -> deliberately simple: 2780/278=10, 5560/278=20, 1390/278=5
    await insertTransaction('2026-03-10T08:00:00.000Z', 2780);
    await insertTransaction('2026-03-10T18:00:00.000Z', 5560);
    await insertTransaction('2026-03-15T08:00:00.000Z', 1390);
    // June: 27800/278 = 100 USD
    await insertTransaction('2026-06-20T08:00:00.000Z', 27800);

    async function getJson(path: string) {
      const res = await fetch(`${BASE_URL}${path}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'x-workspace-id': workspaceId,
        },
      });
      const body = await res.json();
      if (!res.ok) throw new Error(`${path} failed: ${res.status} ${JSON.stringify(body)}`);
      return body.data;
    }

    // Test A: daily-report on a date with 2 transactions.
    const dailyA = await getJson('/accounting-dashboard/daily-report?date=2026-03-10');
    console.log(
      `Daily report 2026-03-10: revenueUsd=${dailyA.revenueUsd} (expect 30) salesCount=${dailyA.salesCount} (expect 2) clientPayments.length=${dailyA.clientPayments.length} (expect 2)`,
    );

    // Test B: daily-report on a date with zero transactions.
    const dailyB = await getJson('/accounting-dashboard/daily-report?date=2026-03-11');
    console.log(
      `Daily report 2026-03-11: revenueUsd=${dailyB.revenueUsd} (expect 0) salesCount=${dailyB.salesCount} (expect 0) clientPayments.length=${dailyB.clientPayments.length} (expect 0)`,
    );
    console.log(`  balances present: ${!!dailyB.balances && !!dailyB.balances.byAccountType}`);

    // Test C: monthly-breakdown for 2026 -> 12 points, March=35, June=100, rest 0.
    const breakdown = await getJson('/accounting-dashboard/monthly-breakdown?year=2026');
    console.log(`Monthly breakdown 2026: points.length=${breakdown.points.length} (expect 12)`);
    console.log('  points:', JSON.stringify(breakdown.points));
    const march = breakdown.points.find((p: { label: string }) => p.label === '2026-03');
    const june = breakdown.points.find((p: { label: string }) => p.label === '2026-06');
    console.log(`  March totalUsd=${march?.totalUsd} (expect 35), June totalUsd=${june?.totalUsd} (expect 100)`);

    // Cleanup
    await client.query(`DELETE FROM "Transaction" WHERE "workspace_id" = $1`, [workspaceId]);
    await client.query(`DELETE FROM "Clients" WHERE "workspace_id" = $1`, [workspaceId]);
    await client.query(`DELETE FROM "BankAccount" WHERE "workspace_id" = $1`, [workspaceId]);
    await client.query(`DELETE FROM "workspace_members" WHERE "workspace_id" = $1`, [workspaceId]);
    await client.query(`DELETE FROM "workspace_invites" WHERE "workspace_id" = $1`, [workspaceId]);
    await client.query(
      `DELETE FROM "refresh_tokens" WHERE "user_id" IN (SELECT id FROM "users" WHERE email LIKE $1)`,
      [`${TEST_TAG}%`],
    );
    await client.query(`DELETE FROM "workspaces" WHERE "id" = $1`, [workspaceId]);
    await client.query(`DELETE FROM "users" WHERE email LIKE $1`, [`${TEST_TAG}%`]);

    const remaining = await client.query(`SELECT count(*) FROM "users" WHERE email LIKE $1`, [`${TEST_TAG}%`]);
    console.log(`Cleanup done. users left: ${remaining.rows[0].count}`);
  } finally {
    await client.end();
  }
}

main().catch((err) => {
  console.error('Script failed:', err);
  process.exit(1);
});
