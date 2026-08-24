/**
 * One-off cleanup for the "only a platform admin can grant accounting access"
 * change.
 *
 * Two things need clearing after that change ships:
 *
 *   1. WorkspaceMember.accountingRole rows granted by workspace owners under
 *      the old rules. They keep working otherwise — the guards read the column
 *      directly, so legacy grants stay live until removed.
 *   2. WorkspaceInvite.accountingRole on PENDING invites. Invite creation no
 *      longer writes this column, but an invite created *before* the change
 *      still carries it, and accepting it would apply that access. Clearing
 *      the column shuts that path even though the accept code no longer reads
 *      it — belt and braces, and it stops the stale value showing up in
 *      reports later.
 *
 * Deliberately NOT part of the Prisma migration: it revokes real people's
 * access, so it should be run knowingly, after reviewing the counts, rather
 * than firing automatically on deploy.
 *
 * Usage:
 *   node -r ts-node/register -r tsconfig-paths/register \
 *     scripts/lockdown-accounting-access.ts            # dry run, prints only
 *   node ... scripts/lockdown-accounting-access.ts --apply   # performs writes
 *
 * Safe to re-run: the second run finds nothing and writes nothing.
 */
import 'dotenv/config';
import { PrismaService } from '../libs/database/src/prisma.service';

const APPLY = process.argv.includes('--apply');
const PLATFORM_ADMIN_EMAIL = 'ali@swiftnine.com';

async function main(): Promise<void> {
  const prisma = new PrismaService();

  const admins = await prisma.user.findMany({
    where: { isPlatformAdmin: true, deletedAt: null },
    select: { email: true },
  });
  console.log(
    `Platform admins: ${admins.length ? admins.map((a) => a.email).join(', ') : 'NONE'}`,
  );
  if (!admins.length) {
    console.log(
      `  ⚠  Nobody can grant accounting access yet. Run:\n` +
        `     UPDATE users SET is_platform_admin = true WHERE email = '${PLATFORM_ADMIN_EMAIL}';\n` +
        `     (0 rows means that user has not signed in yet — re-run once they have.)`,
    );
  }

  const memberGrants = await prisma.workspaceMember.findMany({
    where: { accountingRole: { not: null }, deletedAt: null },
    select: {
      id: true,
      role: true,
      accountingRole: true,
      user: { select: { email: true } },
      workspace: { select: { name: true } },
    },
  });

  console.log(`\nMembers holding accounting access: ${memberGrants.length}`);
  for (const grant of memberGrants) {
    console.log(
      `  - ${grant.user.email} (${grant.role}) in "${grant.workspace.name}" → ${grant.accountingRole}`,
    );
  }

  const pendingInvites = await prisma.workspaceInvite.findMany({
    where: { accountingRole: { not: null }, status: 'PENDING' },
    select: {
      id: true,
      email: true,
      accountingRole: true,
      workspace: { select: { name: true } },
    },
  });

  console.log(
    `\nPending invites carrying accounting access: ${pendingInvites.length}`,
  );
  for (const invite of pendingInvites) {
    console.log(
      `  - ${invite.email} in "${invite.workspace.name}" → ${invite.accountingRole}`,
    );
  }

  if (!APPLY) {
    console.log(
      `\nDry run — nothing written. Re-run with --apply to clear ${memberGrants.length} member grant(s) and ${pendingInvites.length} pending invite value(s).`,
    );
    await prisma.$disconnect();
    return;
  }

  const [clearedMembers, clearedInvites] = await prisma.$transaction([
    prisma.workspaceMember.updateMany({
      where: { accountingRole: { not: null }, deletedAt: null },
      data: { accountingRole: null },
    }),
    prisma.workspaceInvite.updateMany({
      where: { accountingRole: { not: null }, status: 'PENDING' },
      data: { accountingRole: null },
    }),
  ]);

  console.log(
    `\nCleared ${clearedMembers.count} member grant(s) and ${clearedInvites.count} pending invite value(s).`,
  );
  console.log(
    'Accounting access must now be re-granted per member via ' +
      'PUT /organizations/members/:id/accounting-role by a platform admin.',
  );

  await prisma.$disconnect();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
