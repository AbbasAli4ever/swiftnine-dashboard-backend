/**
 * Seeds a spread of clients into a workspace so the client picker
 * (GET /clients/search, which returns the full list A-Z) can be tested with
 * realistic data.
 *
 * The names are deliberately awkward for sorting, not just varied:
 *   - mixed case, including all-lowercase and ALL-CAPS names, to prove the
 *     ordering is case-insensitive rather than deferring to the database
 *     collation (which would group every capital before every lowercase)
 *   - a leading-digit name and a leading-symbol name, to show where
 *     non-letters land
 *   - an accented name, to check it sorts next to its unaccented neighbour
 *   - two names differing only after several characters, to check tie-breaking
 *
 * Idempotent: skips any client whose name already exists in the workspace, so
 * it can be re-run without creating duplicates.
 *
 * Usage:
 *   node -r ts-node/register -r tsconfig-paths/register \
 *     scripts/seed-demo-clients.ts [workspaceId]
 *
 * Defaults to the "Test" workspace (created by umair@swiftnine.com) when no
 * id is passed — the standing workspace for manually-requested test data.
 */
import 'dotenv/config';
import { PrismaService } from '../libs/database/src/prisma.service';

const DEFAULT_WORKSPACE_ID = '847e1f05-df94-4051-b8f3-8307f9a4e0f9';

const CLIENT_NAMES = [
  'Zenith Holdings',
  'acme industries',
  'Åberg Consulting',
  'Aberdeen Logistics',
  'BRIGHTSIDE MEDIA',
  'Brightside Marketing',
  'Cedar & Sons',
  'Delta Freight Co',
  '3Point Analytics',
  'Ember Studios',
  'Fairview Partners',
  'Global Reach Ltd',
  'harbourside traders',
  'Ironclad Security',
  'Juniper Foods',
  'Keystone Capital',
  'Lakeside Ventures',
  'Meridian Systems',
  'Northwind Supply',
  'Orchard Digital',
  'Pinnacle Freight',
  'Quarry Stone Ltd',
  'Riverbend Media',
  'Summit Analytics',
  'Trailhead Outfitters',
  'Umbra Design',
  'Vantage Point Group',
  'Westfield Retail',
  'Xenon Labs',
  'Yellowstone Foods',
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

  const existing = await prisma.clients.findMany({
    where: { workspaceId },
    select: { clientName: true },
  });
  const existingNames = new Set(existing.map((c) => c.clientName));
  console.log(`Existing clients: ${existing.length}`);

  const toCreate = CLIENT_NAMES.filter((name) => !existingNames.has(name));
  if (!toCreate.length) {
    console.log('Nothing to add — every name already present.');
    await prisma.$disconnect();
    return;
  }

  await prisma.clients.createMany({
    data: toCreate.map((clientName) => ({
      workspaceId,
      clientName,
      // Left at 0: this is the hand-maintained field, not derived from
      // transactions, and the picker only reads id + clientName.
      totalRevenue: 0,
    })),
  });

  console.log(`Added ${toCreate.length} client(s).`);

  const total = await prisma.clients.count({ where: { workspaceId } });
  console.log(`Total clients in workspace: ${total}`);

  await prisma.$disconnect();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
