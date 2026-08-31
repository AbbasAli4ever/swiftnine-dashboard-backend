/**
 * Seeds a spread of employees into a workspace so the employees list/detail
 * views (including the PKR/USD commission fields) can be tested with
 * realistic data.
 *
 * paidCommission/pendingCommission are PKR, entered manually — the values
 * below span zero, small, and large amounts so totalCommission and the
 * derived *Usd fields cover a realistic range.
 *
 * Idempotent: skips any employee whose name already exists in the workspace,
 * so it can be re-run without creating duplicates.
 *
 * Usage:
 *   node -r ts-node/register -r tsconfig-paths/register \
 *     scripts/seed-demo-employees.ts [workspaceId]
 *
 * Defaults to the "Test" workspace (created by umair@swiftnine.com) when no
 * id is passed — the standing workspace for manually-requested test data.
 */
import 'dotenv/config';
import { PrismaService } from '../libs/database/src/prisma.service';

const DEFAULT_WORKSPACE_ID = '847e1f05-df94-4051-b8f3-8307f9a4e0f9';

const EMPLOYEES = [
  { name: 'Sara Khan', paidCommission: 15000, pendingCommission: 5000 },
  { name: 'Ali Raza', paidCommission: 42000, pendingCommission: 0 },
  { name: 'Hassan Tariq', paidCommission: 0, pendingCommission: 12500 },
  { name: 'Ayesha Malik', paidCommission: 8750, pendingCommission: 3250 },
  { name: 'Bilal Ahmed', paidCommission: 125000, pendingCommission: 45000 },
  { name: 'Fatima Sheikh', paidCommission: 3000, pendingCommission: 0 },
  { name: 'Usman Javed', paidCommission: 60000, pendingCommission: 15000 },
  { name: 'Zainab Qureshi', paidCommission: 0, pendingCommission: 0 },
];

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

  const existing = await prisma.employee.findMany({
    where: { workspaceId },
    select: { name: true },
  });
  const existingNames = new Set(existing.map((e) => e.name));
  console.log(`Existing employees: ${existing.length}`);

  const toCreate = EMPLOYEES.filter((e) => !existingNames.has(e.name));
  if (!toCreate.length) {
    console.log('Nothing to add — every name already present.');
    await prisma.$disconnect();
    return;
  }

  await prisma.employee.createMany({
    data: toCreate.map((employee) => ({
      workspaceId,
      name: employee.name,
      paidCommission: employee.paidCommission,
      pendingCommission: employee.pendingCommission,
    })),
  });

  console.log(`Added ${toCreate.length} employee(s).`);

  const total = await prisma.employee.count({ where: { workspaceId } });
  console.log(`Total employees in workspace: ${total}`);

  await prisma.$disconnect();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
