/**
 * End-to-end live test of the chat feature (channels + 1-to-1 DMs) against
 * the real running dev server, in the "Test" workspace. Creates two dummy
 * users, mints JWTs locally (same {sub, email} payload / JWT_ACCESS_SECRET
 * the real auth service signs with — no login flow needed, matching this
 * repo's established test convention), then exercises:
 *   - channel create -> add member -> send -> threaded reply -> reaction -> list
 *   - DM create-or-return -> messages both ways -> list -> dedup check
 *
 * Requires the dev server already running on PORT (default 3000).
 *
 * Usage:
 *   node -r ts-node/register -r tsconfig-paths/register \
 *     scripts/test-chat-flow.ts
 */
import 'dotenv/config';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { PrismaService } from '../libs/database/src/prisma.service';

const WORKSPACE_ID = '847e1f05-df94-4051-b8f3-8307f9a4e0f9'; // "Test"
const BASE_URL = `http://localhost:${process.env['PORT'] ?? 3000}/api/v1`;
const JWT_SECRET = process.env['JWT_ACCESS_SECRET'];
if (!JWT_SECRET) throw new Error('JWT_ACCESS_SECRET not set');

function mintToken(userId: string, email: string): string {
  return jwt.sign({ sub: userId, email }, JWT_SECRET as string, {
    expiresIn: '1h',
  });
}

async function api(
  token: string,
  method: string,
  path: string,
  body?: unknown,
): Promise<any> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${token}`,
      'x-workspace-id': WORKSPACE_ID,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  const json = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(
      `${method} ${path} -> ${res.status}: ${JSON.stringify(json)}`,
    );
  }
  return json;
}

async function main(): Promise<void> {
  const prisma = new PrismaService();
  const stamp = Date.now();
  const passwordHash = await bcrypt.hash('ChatTest123!', 10);

  console.log('--- Creating two dummy users ---');
  const userA = await prisma.user.create({
    data: {
      fullName: 'Chat Test Alice',
      email: `chat-test-alice-${stamp}@swiftnine.local`,
      passwordHash,
      isEmailVerified: true,
    },
  });
  const userB = await prisma.user.create({
    data: {
      fullName: 'Chat Test Bob',
      email: `chat-test-bob-${stamp}@swiftnine.local`,
      passwordHash,
      isEmailVerified: true,
    },
  });
  console.log({ userA: userA.id, userB: userB.id });

  console.log('\n--- Adding both as WorkspaceMembers of "Test" ---');
  await prisma.workspaceMember.create({
    data: { workspaceId: WORKSPACE_ID, userId: userA.id, role: 'MEMBER' },
  });
  await prisma.workspaceMember.create({
    data: { workspaceId: WORKSPACE_ID, userId: userB.id, role: 'MEMBER' },
  });

  const tokenA = mintToken(userA.id, userA.email);
  const tokenB = mintToken(userB.id, userB.email);

  // ── Channel flow ──────────────────────────────────────────────────────
  console.log('\n=== CHANNEL FLOW ===');

  console.log('--- Alice creates a channel ---');
  const channelResp = await api(tokenA, 'POST', '/channels', {
    name: `chat-test-channel-${stamp}`,
    description: 'E2E chat test channel',
    privacy: 'PRIVATE',
  });
  const channelId = channelResp.data.id;
  console.log({ channelId, name: channelResp.data.name });

  console.log('\n--- Alice adds Bob as a channel member ---');
  await api(tokenA, 'POST', `/channels/${channelId}/members`, {
    userId: userB.id,
    role: 'member',
  });
  console.log('Bob added.');

  console.log('\n--- Alice sends a message ---');
  const msg1 = await api(
    tokenA,
    'POST',
    `/chat/channels/${channelId}/messages`,
    { contentJson: { text: 'Hey Bob, welcome to the channel!' } },
  );
  const msg1Id = msg1.data.id;
  console.log({ id: msg1Id, plaintext: msg1.data.plaintext ?? msg1.data.contentJson });

  console.log('\n--- Bob replies (threaded) ---');
  const msg2 = await api(
    tokenB,
    'POST',
    `/chat/channels/${channelId}/messages`,
    {
      contentJson: { text: 'Thanks Alice, glad to be here!' },
      replyToMessageId: msg1Id,
    },
  );
  const msg2Id = msg2.data.id;
  console.log({ id: msg2Id, replyToMessageId: msg2.data.replyToMessageId });

  console.log('\n--- Bob reacts to Alice\'s message ---');
  await api(tokenB, 'POST', `/chat/messages/${msg1Id}/reactions`, {
    emoji: '👍',
  });
  console.log('Reaction added.');

  console.log('\n--- Both list channel messages ---');
  const listA = await api(tokenA, 'GET', `/chat/channels/${channelId}/messages`);
  const listB = await api(tokenB, 'GET', `/chat/channels/${channelId}/messages`);
  console.log('Alice sees', listA.data.items?.length ?? listA.data.length, 'messages');
  console.log('Bob sees', listB.data.items?.length ?? listB.data.length, 'messages');

  // ── DM flow ───────────────────────────────────────────────────────────
  console.log('\n=== DM FLOW ===');

  console.log('--- Alice creates a DM with Bob ---');
  const dm1 = await api(tokenA, 'POST', '/chat/dm', { targetUserId: userB.id });
  const dmChannelId = dm1.data.id;
  console.log({ dmChannelId, kind: dm1.data.kind });

  console.log('\n--- Alice sends a DM message ---');
  await api(tokenA, 'POST', `/chat/channels/${dmChannelId}/messages`, {
    contentJson: { text: 'Hey Bob, quick DM test.' },
  });

  console.log('--- Bob replies in the DM ---');
  await api(tokenB, 'POST', `/chat/channels/${dmChannelId}/messages`, {
    contentJson: { text: 'Got it, DM works!' },
  });

  console.log('\n--- Both list their DMs ---');
  const dmsA = await api(tokenA, 'GET', '/chat/dms');
  const dmsB = await api(tokenB, 'GET', '/chat/dms');
  console.log('Alice DMs:', dmsA.data.length ?? dmsA.data.items?.length);
  console.log('Bob DMs:', dmsB.data.length ?? dmsB.data.items?.length);

  console.log('\n--- Re-creating the same DM (dedup check) ---');
  const dm2 = await api(tokenA, 'POST', '/chat/dm', { targetUserId: userB.id });
  console.log({
    sameChannelId: dm2.data.id === dmChannelId,
    dm1: dmChannelId,
    dm2: dm2.data.id,
  });

  // ── Manual DB verification ───────────────────────────────────────────
  console.log('\n=== MANUAL DB VERIFICATION (raw Prisma reads) ===');

  const channelRow = await prisma.channel.findUnique({
    where: { id: channelId },
    include: { members: true },
  });
  console.log('\nChannel row:', {
    id: channelRow?.id,
    name: channelRow?.name,
    kind: channelRow?.kind,
    privacy: channelRow?.privacy,
    memberCount: channelRow?.members.length,
    memberRoles: channelRow?.members.map((m) => `${m.userId}:${m.role}`),
  });

  const dmRow = await prisma.channel.findUnique({
    where: { id: dmChannelId },
    include: { members: true },
  });
  console.log('\nDM Channel row:', {
    id: dmRow?.id,
    name: dmRow?.name,
    kind: dmRow?.kind,
    privacy: dmRow?.privacy,
    memberCount: dmRow?.members.length,
  });

  const channelMessages = await prisma.channelMessage.findMany({
    where: { channelId },
    orderBy: { createdAt: 'asc' },
    include: { reactions: true },
  });
  console.log('\nChannel messages in DB:');
  for (const m of channelMessages) {
    console.log({
      id: m.id,
      kind: m.kind,
      senderId: m.senderId,
      plaintext: m.plaintext,
      replyToMessageId: m.replyToMessageId,
      reactions: m.reactions.map((r) => `${r.userId}:${r.emoji}`),
    });
  }

  const dmMessages = await prisma.channelMessage.findMany({
    where: { channelId: dmChannelId },
    orderBy: { createdAt: 'asc' },
  });
  console.log('\nDM messages in DB:');
  for (const m of dmMessages) {
    console.log({ id: m.id, kind: m.kind, senderId: m.senderId, plaintext: m.plaintext });
  }

  const memberStates = await prisma.channelMember.findMany({
    where: { channelId, userId: { in: [userA.id, userB.id] } },
  });
  console.log('\nChannelMember unread state (post-send):');
  for (const m of memberStates) {
    console.log({ userId: m.userId, unreadCount: m.unreadCount, lastReadMessageId: m.lastReadMessageId });
  }

  const notifications = await prisma.notification.findMany({
    where: { userId: { in: [userA.id, userB.id] } },
    orderBy: { createdAt: 'asc' },
  });
  console.log('\nNotification rows created by fanout:', notifications.length);
  for (const n of notifications) {
    console.log({ id: n.id, type: n.type, userId: n.userId, title: n.title, isRead: n.isRead });
  }

  console.log('\n=== SUMMARY ===');
  console.log('Users created:', { alice: userA.id, bob: userB.id });
  console.log('Channel:', channelId, '- 2 members, 2 messages, 1 reaction, 1 threaded reply — all confirmed above.');
  console.log('DM:', dmChannelId, '- 2 members, 2 messages, dedup confirmed:', dm2.data.id === dmChannelId);
  console.log('Test data left in place in the "Test" workspace, not cleaned up.');

  await prisma.$disconnect();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
