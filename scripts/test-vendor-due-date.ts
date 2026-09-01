/**
 * Exercises the new Vendor.dueDate field through the real VendorsService:
 * create with a dueDate, read it back, update it, then clear it with null.
 *
 * Usage:
 *   node -r ts-node/register -r tsconfig-paths/register \
 *     scripts/test-vendor-due-date.ts
 */
import 'dotenv/config';
import { PrismaService } from '../libs/database/src/prisma.service';
import { VendorsService } from './../apps/api/src/vendors/vendors.service';

const WORKSPACE_ID = '847e1f05-df94-4051-b8f3-8307f9a4e0f9'; // "Test"

async function main(): Promise<void> {
  const prisma = new PrismaService();
  const vendorsService = new VendorsService(prisma);

  console.log('--- Create with dueDate ---');
  const created = await vendorsService.create(WORKSPACE_ID, {
    name: `Due Date Test Vendor ${Date.now()}`,
    pendingPayment: 25000,
    dueDate: '2026-09-30T00:00:00.000Z',
  });
  console.log({ id: created.id, pendingPayment: created.pendingPayment, dueDate: created.dueDate });

  console.log('\n--- Read back via findOne ---');
  const fetched = await vendorsService.findOne(WORKSPACE_ID, created.id);
  console.log({ dueDate: fetched.dueDate });

  console.log('\n--- Update dueDate ---');
  const updated = await vendorsService.update(WORKSPACE_ID, created.id, {
    dueDate: '2026-10-15T00:00:00.000Z',
  });
  console.log({ dueDate: updated.dueDate });

  console.log('\n--- Clear dueDate with null ---');
  const cleared = await vendorsService.update(WORKSPACE_ID, created.id, {
    dueDate: null,
  });
  console.log({ dueDate: cleared.dueDate });

  console.log('\n--- Create with no dueDate (omitted) ---');
  const noDate = await vendorsService.create(WORKSPACE_ID, {
    name: `Due Date Test Vendor No Date ${Date.now()}`,
    pendingPayment: 5000,
  });
  console.log({ dueDate: noDate.dueDate });

  await prisma.vendor.deleteMany({ where: { id: { in: [created.id, noDate.id] } } });
  console.log('\nTest vendors cleaned up.');

  await prisma.$disconnect();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
