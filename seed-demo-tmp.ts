import 'dotenv/config';
import * as bcrypt from 'bcrypt';
import { PrismaService } from './libs/database/src/prisma.service';

const DEMO_PASSWORD = 'DemoPass123!';
const DEMO_EMAIL = 'demo-accountant@swiftnine.local';

function daysAgo(n: number): Date {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - n);
  d.setUTCHours(12, 0, 0, 0);
  return d;
}

async function main() {
  const prisma = new PrismaService();
  await prisma.$connect();

  // Clean up any previous run of this same demo seed, so it's safe to re-run.
  const existingUser = await prisma.user.findUnique({ where: { email: DEMO_EMAIL } });
  if (existingUser) {
    const memberships = await prisma.workspaceMember.findMany({
      where: { userId: existingUser.id },
      select: { workspaceId: true },
    });
    for (const m of memberships) {
      await prisma.transaction.deleteMany({ where: { workspaceId: m.workspaceId } });
      await prisma.bankAccount.deleteMany({ where: { workspaceId: m.workspaceId } });
      await prisma.clients.deleteMany({ where: { workspaceId: m.workspaceId } });
      await prisma.workspaceMember.deleteMany({ where: { workspaceId: m.workspaceId } });
      await prisma.workspace.delete({ where: { id: m.workspaceId } });
    }
    await prisma.user.delete({ where: { id: existingUser.id } });
    console.log('Removed previous demo seed.');
  }

  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);
  const user = await prisma.user.create({
    data: {
      fullName: 'Demo Accountant',
      email: DEMO_EMAIL,
      passwordHash,
      isEmailVerified: true,
    },
  });

  const workspace = await prisma.workspace.create({
    data: {
      name: 'Demo — Accounting Flow',
      workspaceUse: 'WORK',
      managementType: 'FINANCE_ACCOUNTING',
      createdBy: user.id,
    },
  });

  await prisma.workspaceMember.create({
    data: {
      workspaceId: workspace.id,
      userId: user.id,
      role: 'OWNER',
      accountingRole: 'ACCOUNTANT',
    },
  });

  const whop = await prisma.bankAccount.create({
    data: { workspaceId: workspace.id, bankName: 'Whop', accountType: 'INTERNATIONAL', currencyType: 'USD', amount: 18400 },
  });
  const slash = await prisma.bankAccount.create({
    data: { workspaceId: workspace.id, bankName: 'Slash', accountType: 'INTERNATIONAL', currencyType: 'USD', amount: 7200 },
  });
  const hbl = await prisma.bankAccount.create({
    data: { workspaceId: workspace.id, bankName: 'HBL', accountType: 'LOCAL', currencyType: 'PKR', amount: 1250000 },
  });

  const victoria = await prisma.clients.create({
    data: { workspaceId: workspace.id, clientName: 'Victoria Partners', currencyType: 'USD' },
  });
  const anton = await prisma.clients.create({
    data: { workspaceId: workspace.id, clientName: 'Anton Enne', currencyType: 'USD' },
  });
  const phaseShop = await prisma.clients.create({
    data: { workspaceId: workspace.id, clientName: 'Phase Shop', currencyType: 'PKR' },
  });

  // Spread across today, this month, and last month so daily / monthly /
  // yearly breakdowns all show different, meaningful numbers.
  const rows: { workspaceId: string; clientId: string; clientName: string; bankAccountId: string; saleAmount: number; currency: 'USD' | 'PKR'; saleDate: Date; refId: string; description: string }[] = [
    { workspaceId: workspace.id, clientId: victoria.id, clientName: victoria.clientName, bankAccountId: whop.id, saleAmount: 1200, currency: 'USD', saleDate: daysAgo(0), refId: 'DEMO-0001', description: 'Retainer — this month' },
    { workspaceId: workspace.id, clientId: anton.id, clientName: anton.clientName, bankAccountId: slash.id, saleAmount: 850, currency: 'USD', saleDate: daysAgo(0), refId: 'DEMO-0002', description: 'Consulting — today' },
    { workspaceId: workspace.id, clientId: phaseShop.id, clientName: phaseShop.clientName, bankAccountId: hbl.id, saleAmount: 42000, currency: 'PKR', saleDate: daysAgo(0), refId: 'DEMO-0003', description: 'Local order — today' },
    { workspaceId: workspace.id, clientId: victoria.id, clientName: victoria.clientName, bankAccountId: whop.id, saleAmount: 2400, currency: 'USD', saleDate: daysAgo(3), refId: 'DEMO-0004', description: 'Add-on package' },
    { workspaceId: workspace.id, clientId: anton.id, clientName: anton.clientName, bankAccountId: slash.id, saleAmount: 1600, currency: 'USD', saleDate: daysAgo(5), refId: 'DEMO-0005', description: 'Monthly consulting' },
    { workspaceId: workspace.id, clientId: victoria.id, clientName: victoria.clientName, bankAccountId: whop.id, saleAmount: 900, currency: 'USD', saleDate: daysAgo(7), refId: 'DEMO-0006', description: 'Support hours' },
    { workspaceId: workspace.id, clientId: phaseShop.id, clientName: phaseShop.clientName, bankAccountId: hbl.id, saleAmount: 78000, currency: 'PKR', saleDate: daysAgo(9), refId: 'DEMO-0007', description: 'Bulk order' },
    { workspaceId: workspace.id, clientId: anton.id, clientName: anton.clientName, bankAccountId: slash.id, saleAmount: 3100, currency: 'USD', saleDate: daysAgo(12), refId: 'DEMO-0008', description: 'Quarterly retainer' },
    { workspaceId: workspace.id, clientId: victoria.id, clientName: victoria.clientName, bankAccountId: whop.id, saleAmount: 1750, currency: 'USD', saleDate: daysAgo(15), refId: 'DEMO-0009', description: 'Design sprint' },
    { workspaceId: workspace.id, clientId: phaseShop.id, clientName: phaseShop.clientName, bankAccountId: hbl.id, saleAmount: 56000, currency: 'PKR', saleDate: daysAgo(18), refId: 'DEMO-0010', description: 'Restock order' },
    { workspaceId: workspace.id, clientId: anton.id, clientName: anton.clientName, bankAccountId: slash.id, saleAmount: 2050, currency: 'USD', saleDate: daysAgo(22), refId: 'DEMO-0011', description: 'Support renewal' },
    { workspaceId: workspace.id, clientId: victoria.id, clientName: victoria.clientName, bankAccountId: whop.id, saleAmount: 1400, currency: 'USD', saleDate: daysAgo(26), refId: 'DEMO-0012', description: 'Extra seats' },
    // A batch from last month, so the monthly comparison has something to compare against.
    { workspaceId: workspace.id, clientId: victoria.id, clientName: victoria.clientName, bankAccountId: whop.id, saleAmount: 2100, currency: 'USD', saleDate: daysAgo(35), refId: 'DEMO-0013', description: 'Last month retainer' },
    { workspaceId: workspace.id, clientId: anton.id, clientName: anton.clientName, bankAccountId: slash.id, saleAmount: 1900, currency: 'USD', saleDate: daysAgo(40), refId: 'DEMO-0014', description: 'Last month consulting' },
    { workspaceId: workspace.id, clientId: phaseShop.id, clientName: phaseShop.clientName, bankAccountId: hbl.id, saleAmount: 61000, currency: 'PKR', saleDate: daysAgo(45), refId: 'DEMO-0015', description: 'Last month order' },
  ];

  for (const row of rows) {
    await prisma.transaction.create({ data: row });
  }

  console.log('\n=== Demo seed ready ===');
  console.log('Workspace ID:', workspace.id);
  console.log('Login email:', DEMO_EMAIL);
  console.log('Login password:', DEMO_PASSWORD);
  console.log('Bank accounts:', { whop: whop.id, slash: slash.id, hbl: hbl.id });
  console.log('Transactions seeded:', rows.length);
  console.log('This data is NOT cleaned up automatically — re-run this script to reset it, or delete workspace', workspace.id, 'manually when done.');

  await prisma.$disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
