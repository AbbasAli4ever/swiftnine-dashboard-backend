/**
 * Expanded end-to-end live test of chat/channels/DMs against the real
 * running dev server, in the "Test" workspace — multiple users, Alice
 * cycling through every channel role (OWNER as creator, ADMIN, plain
 * MEMBER), mentions (valid + invalid), and the full permission matrix
 * documented from chat.service.ts / channels.service.ts:
 *   - pin/unpin: OWNER/ADMIN only
 *   - delete others' message: OWNER/ADMIN only (author can always delete own)
 *   - edit: author only, regardless of role
 *   - add/remove members: OWNER/ADMIN only
 *   - remove OWNER: never allowed
 *   - remove ADMIN: OWNER only (another ADMIN can't)
 *   - self-removal: never allowed via this route
 *   - mentioning a non-channel-member: rejected (400)
 *   - messaging a channel you're not a member of: rejected (403), even PUBLIC
 *
 * Every assertion is checked against the real HTTP response (not assumed),
 * and PASS/FAIL is tracked and reported — this is not a happy-path-only
 * script, several calls are EXPECTED to fail and that's asserted explicitly.
 *
 * Requires the dev server already running on PORT (default 3000).
 *
 * Usage:
 *   node -r ts-node/register -r tsconfig-paths/register \
 *     scripts/test-chat-roles-flow.ts
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

type Call = { status: number; ok: boolean; body: any };

async function call(
  token: string,
  method: string,
  path: string,
  body?: unknown,
): Promise<Call> {
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
  return { status: res.status, ok: res.ok, body: json };
}

const results: { label: string; pass: boolean }[] = [];
function check(label: string, condition: boolean, detail?: unknown): void {
  results.push({ label, pass: condition });
  console.log(
    `${condition ? 'PASS' : 'FAIL'} — ${label}${detail !== undefined ? ' :: ' + JSON.stringify(detail) : ''}`,
  );
}

async function main(): Promise<void> {
  const prisma = new PrismaService();
  const stamp = Date.now();
  const passwordHash = await bcrypt.hash('ChatTest123!', 10);

  console.log('=== SETUP: creating 5 dummy users + workspace memberships ===');
  const names = ['Alice', 'Bob', 'Carol', 'Dave', 'Eve'];
  const users: Record<string, { id: string; email: string; token: string }> = {};
  for (const name of names) {
    const email = `chat-role-test-${name.toLowerCase()}-${stamp}@swiftnine.local`;
    const user = await prisma.user.create({
      data: { fullName: `Chat Role Test ${name}`, email, passwordHash, isEmailVerified: true },
    });
    await prisma.workspaceMember.create({
      data: { workspaceId: WORKSPACE_ID, userId: user.id, role: 'MEMBER' },
    });
    users[name] = { id: user.id, email, token: mintToken(user.id, email) };
  }
  console.log(Object.fromEntries(Object.entries(users).map(([k, v]) => [k, v.id])));

  const { Alice, Bob, Carol, Dave, Eve } = users;

  // ════════════════════════════════════════════════════════════════════
  // SCENARIO A — Alice as channel CREATOR (OWNER)
  // ════════════════════════════════════════════════════════════════════
  console.log('\n\n=== SCENARIO A: Alice creates a channel (OWNER) ===');

  const chA = await call(Alice.token, 'POST', '/channels', {
    name: `alice-owned-${stamp}`,
    privacy: 'PRIVATE',
  });
  check('A1: Alice creates channel -> 201', chA.status === 201, chA.status);
  const channelA = chA.body.data.id;

  const chAMemberRow = await prisma.channelMember.findFirst({
    where: { channelId: channelA, userId: Alice.id },
  });
  check('A2: Alice is stored as OWNER on her own channel', chAMemberRow?.role === 'OWNER');

  const addBob = await call(Alice.token, 'POST', `/channels/${channelA}/members`, {
    userId: Bob.id,
    role: 'member',
  });
  check('A3: Alice (OWNER) adds Bob as member -> 201', addBob.status === 201, addBob.status);

  const addCarol = await call(Alice.token, 'POST', `/channels/${channelA}/members`, {
    userId: Carol.id,
    role: 'admin',
  });
  check('A4: Alice (OWNER) adds Carol as admin -> 201', addCarol.status === 201, addCarol.status);

  // Mentions: valid (Bob + Carol are members) + invalid (Eve is not)
  const mentionMsg = await call(Alice.token, 'POST', `/chat/channels/${channelA}/messages`, {
    contentJson: { text: 'Hi Bob and Carol, welcome!' },
    mentionedUserIds: [Bob.id, Carol.id],
  });
  check('A5: Alice sends message mentioning Bob+Carol -> 201', mentionMsg.status === 201, mentionMsg.status);
  const aliceMsgId = mentionMsg.body?.data?.id;

  const mentionRows = await prisma.channelMessageMention.findMany({ where: { messageId: aliceMsgId } });
  check('A6: 2 ChannelMessageMention rows created for that message', mentionRows.length === 2, mentionRows.length);

  const invalidMention = await call(Alice.token, 'POST', `/chat/channels/${channelA}/messages`, {
    contentJson: { text: 'Hey @Eve' },
    mentionedUserIds: [Eve.id],
  });
  check('A7: mentioning Eve (non-member) -> 400 rejected', invalidMention.status === 400, invalidMention.status);

  // Pin permission: MEMBER blocked, ADMIN allowed
  const bobPinAttempt = await call(Bob.token, 'POST', `/chat/messages/${aliceMsgId}/pin`);
  check('A8: Bob (MEMBER) tries to pin -> 403', bobPinAttempt.status === 403, bobPinAttempt.status);

  const carolPin = await call(Carol.token, 'POST', `/chat/messages/${aliceMsgId}/pin`);
  check('A9: Carol (ADMIN) pins the message -> 200', carolPin.status === 200, carolPin.status);

  const pinnedRow = await prisma.channelMessage.findUnique({ where: { id: aliceMsgId } });
  check('A10: message isPinned=true in DB, pinnedById=Carol', pinnedRow?.isPinned === true && pinnedRow?.pinnedById === Carol.id);

  // Delete permission: author always ok; MEMBER can't delete others'; ADMIN can
  const carolMsg = await call(Carol.token, 'POST', `/chat/channels/${channelA}/messages`, {
    contentJson: { text: 'Carol speaking' },
  });
  const carolMsgId = carolMsg.body.data.id;

  const bobDeleteCarol = await call(Bob.token, 'DELETE', `/chat/messages/${carolMsgId}`);
  check('A11: Bob (MEMBER) tries to delete Carol\'s message -> 403', bobDeleteCarol.status === 403, bobDeleteCarol.status);

  const carolDeletesOwn = await call(Carol.token, 'DELETE', `/chat/messages/${carolMsgId}`);
  check('A12: Carol deletes her own message -> 200', carolDeletesOwn.status === 200, carolDeletesOwn.status);

  const deletedRow = await prisma.channelMessage.findUnique({ where: { id: carolMsgId } });
  check('A13: message deletedAt set in DB', deletedRow?.deletedAt !== null);

  // Edit permission: author-only, even for admins
  const bobEditAlice = await call(Bob.token, 'PATCH', `/chat/messages/${aliceMsgId}`, {
    contentJson: { text: 'hijacked' },
  });
  check('A14: Bob tries to edit Alice\'s message -> 403', bobEditAlice.status === 403, bobEditAlice.status);

  const aliceEditsOwn = await call(Alice.token, 'PATCH', `/chat/messages/${aliceMsgId}`, {
    contentJson: { text: 'Hi Bob and Carol, welcome!! (edited)' },
  });
  check('A15: Alice edits her own message -> 200', aliceEditsOwn.status === 200, aliceEditsOwn.status);

  // Member management permission: MEMBER blocked, ADMIN allowed
  const bobAddsDave = await call(Bob.token, 'POST', `/channels/${channelA}/members`, {
    userId: Dave.id,
    role: 'member',
  });
  check('A16: Bob (MEMBER) tries to add Dave -> 403', bobAddsDave.status === 403, bobAddsDave.status);

  const carolAddsDave = await call(Carol.token, 'POST', `/channels/${channelA}/members`, {
    userId: Dave.id,
    role: 'member',
  });
  check('A17: Carol (ADMIN) adds Dave -> 201', carolAddsDave.status === 201, carolAddsDave.status);

  // Channel update permission
  const bobUpdatesChannel = await call(Bob.token, 'PATCH', `/channels/${channelA}`, {
    description: 'hijacked description',
  });
  check('A18: Bob (MEMBER) tries to update channel -> 403', bobUpdatesChannel.status === 403, bobUpdatesChannel.status);

  const aliceUpdatesChannel = await call(Alice.token, 'PATCH', `/channels/${channelA}`, {
    description: 'Alice\'s real description',
  });
  check('A19: Alice (OWNER) updates channel -> 200', aliceUpdatesChannel.status === 200, aliceUpdatesChannel.status);

  // Removal rules: self-removal blocked, owner can never be removed,
  // admin can only be removed by owner (not by another admin)
  const daveMemberRow = await prisma.channelMember.findFirst({ where: { channelId: channelA, userId: Dave.id } });
  const bobMemberRow = await prisma.channelMember.findFirst({ where: { channelId: channelA, userId: Bob.id } });
  const carolMemberRow = await prisma.channelMember.findFirst({ where: { channelId: channelA, userId: Carol.id } });
  const aliceMemberRow = await prisma.channelMember.findFirst({ where: { channelId: channelA, userId: Alice.id } });

  const aliceRemovesSelf = await call(Alice.token, 'DELETE', `/channels/${channelA}/members/${aliceMemberRow!.id}`);
  check('A20: Alice tries to remove herself -> 403', aliceRemovesSelf.status === 403, aliceRemovesSelf.status);

  const carolRemovesAlice = await call(Carol.token, 'DELETE', `/channels/${channelA}/members/${aliceMemberRow!.id}`);
  check('A21: Carol (ADMIN) tries to remove Alice (OWNER) -> 403', carolRemovesAlice.status === 403, carolRemovesAlice.status);

  const bobRemovesDave = await call(Bob.token, 'DELETE', `/channels/${channelA}/members/${daveMemberRow!.id}`);
  check('A22: Bob (MEMBER) tries to remove Dave -> 403', bobRemovesDave.status === 403, bobRemovesDave.status);

  // promote Bob to admin so we can test "admin can't remove admin"
  await call(Alice.token, 'POST', `/channels/${channelA}/members`, { userId: Bob.id, role: 'admin' });
  const bobRemovesCarol = await call(Bob.token, 'DELETE', `/channels/${channelA}/members/${carolMemberRow!.id}`);
  check('A23: Bob (ADMIN) tries to remove Carol (ADMIN) -> 403 (only OWNER can remove an admin)', bobRemovesCarol.status === 403, bobRemovesCarol.status);

  const aliceRemovesCarol = await call(Alice.token, 'DELETE', `/channels/${channelA}/members/${carolMemberRow!.id}`);
  check('A24: Alice (OWNER) removes Carol (ADMIN) -> 200', aliceRemovesCarol.status === 200, aliceRemovesCarol.status);

  // ════════════════════════════════════════════════════════════════════
  // SCENARIO B — Alice as plain MEMBER (Bob's channel)
  // ════════════════════════════════════════════════════════════════════
  console.log('\n\n=== SCENARIO B: Alice as plain MEMBER in Bob\'s channel ===');

  const chB = await call(Bob.token, 'POST', '/channels', { name: `bob-owned-${stamp}`, privacy: 'PRIVATE' });
  const channelB = chB.body.data.id;
  await call(Bob.token, 'POST', `/channels/${channelB}/members`, { userId: Alice.id, role: 'member' });
  await call(Bob.token, 'POST', `/channels/${channelB}/members`, { userId: Dave.id, role: 'admin' });

  const bobMsgInB = await call(Bob.token, 'POST', `/chat/channels/${channelB}/messages`, {
    contentJson: { text: 'Bob\'s channel, welcome Alice' },
  });
  const bobMsgInBId = bobMsgInB.body.data.id;

  const aliceMsgInB = await call(Alice.token, 'POST', `/chat/channels/${channelB}/messages`, {
    contentJson: { text: 'Thanks for adding me!' },
  });
  const aliceMsgInBId = aliceMsgInB.body.data.id;
  check('B1: Alice (MEMBER) can send a message -> 201', aliceMsgInB.status === 201, aliceMsgInB.status);

  const alicePinOwnInB = await call(Alice.token, 'POST', `/chat/messages/${aliceMsgInBId}/pin`);
  check('B2: Alice (MEMBER) tries to pin even her OWN message -> 403 (role-based, not author-based)', alicePinOwnInB.status === 403, alicePinOwnInB.status);

  const aliceDeletesBobInB = await call(Alice.token, 'DELETE', `/chat/messages/${bobMsgInBId}`);
  check('B3: Alice (MEMBER) tries to delete Bob\'s message -> 403', aliceDeletesBobInB.status === 403, aliceDeletesBobInB.status);

  const aliceAddsEveInB = await call(Alice.token, 'POST', `/channels/${channelB}/members`, { userId: Eve.id, role: 'member' });
  check('B4: Alice (MEMBER) tries to add Eve -> 403', aliceAddsEveInB.status === 403, aliceAddsEveInB.status);

  const aliceUpdatesB = await call(Alice.token, 'PATCH', `/channels/${channelB}`, { description: 'hijack' });
  check('B5: Alice (MEMBER) tries to update the channel -> 403', aliceUpdatesB.status === 403, aliceUpdatesB.status);

  const davePinsAliceInB = await call(Dave.token, 'POST', `/chat/messages/${aliceMsgInBId}/pin`);
  check('B6: Dave (ADMIN) pins Alice\'s message -> 200', davePinsAliceInB.status === 200, davePinsAliceInB.status);

  const daveDeletesAliceInB = await call(Dave.token, 'DELETE', `/chat/messages/${aliceMsgInBId}`);
  check('B7: Dave (ADMIN) deletes Alice\'s message -> 200', daveDeletesAliceInB.status === 200, daveDeletesAliceInB.status);

  const aliceMemberRowInB = await prisma.channelMember.findFirst({ where: { channelId: channelB, userId: Alice.id } });
  const bobRemovesAliceFromB = await call(Bob.token, 'DELETE', `/channels/${channelB}/members/${aliceMemberRowInB!.id}`);
  check('B8: Bob (OWNER) removes Alice (MEMBER) -> 200', bobRemovesAliceFromB.status === 200, bobRemovesAliceFromB.status);

  // ════════════════════════════════════════════════════════════════════
  // SCENARIO C — Alice as ADMIN (Dave's channel)
  // ════════════════════════════════════════════════════════════════════
  console.log('\n\n=== SCENARIO C: Alice as ADMIN in Dave\'s channel ===');

  const chC = await call(Dave.token, 'POST', '/channels', { name: `dave-owned-${stamp}`, privacy: 'PUBLIC' });
  const channelC = chC.body.data.id;
  await call(Dave.token, 'POST', `/channels/${channelC}/members`, { userId: Alice.id, role: 'admin' });
  await call(Dave.token, 'POST', `/channels/${channelC}/members`, { userId: Eve.id, role: 'member' });
  await call(Dave.token, 'POST', `/channels/${channelC}/members`, { userId: Bob.id, role: 'admin' });

  const eveMsgInC = await call(Eve.token, 'POST', `/chat/channels/${channelC}/messages`, {
    contentJson: { text: 'Eve here' },
  });
  const eveMsgInCId = eveMsgInC.body.data.id;

  const alicePinsEveInC = await call(Alice.token, 'POST', `/chat/messages/${eveMsgInCId}/pin`);
  check('C1: Alice (ADMIN) pins Eve\'s message -> 200', alicePinsEveInC.status === 200, alicePinsEveInC.status);

  const aliceDeletesEveInC = await call(Alice.token, 'DELETE', `/chat/messages/${eveMsgInCId}`);
  check('C2: Alice (ADMIN) deletes Eve\'s message -> 200', aliceDeletesEveInC.status === 200, aliceDeletesEveInC.status);

  const eveMemberRowInC = await prisma.channelMember.findFirst({ where: { channelId: channelC, userId: Eve.id } });
  const aliceRemovesEveInC = await call(Alice.token, 'DELETE', `/channels/${channelC}/members/${eveMemberRowInC!.id}`);
  check('C3: Alice (ADMIN) removes Eve (MEMBER) -> 200', aliceRemovesEveInC.status === 200, aliceRemovesEveInC.status);

  const daveMemberRowInC = await prisma.channelMember.findFirst({ where: { channelId: channelC, userId: Dave.id } });
  const aliceRemovesDaveInC = await call(Alice.token, 'DELETE', `/channels/${channelC}/members/${daveMemberRowInC!.id}`);
  check('C4: Alice (ADMIN) tries to remove Dave (OWNER) -> 403', aliceRemovesDaveInC.status === 403, aliceRemovesDaveInC.status);

  const bobMemberRowInC = await prisma.channelMember.findFirst({ where: { channelId: channelC, userId: Bob.id } });
  const aliceRemovesBobInC = await call(Alice.token, 'DELETE', `/channels/${channelC}/members/${bobMemberRowInC!.id}`);
  check('C5: Alice (ADMIN) tries to remove Bob (ADMIN) -> 403 (only OWNER can)', aliceRemovesBobInC.status === 403, aliceRemovesBobInC.status);

  const daveRemovesBobInC = await call(Dave.token, 'DELETE', `/channels/${channelC}/members/${bobMemberRowInC!.id}`);
  check('C6: Dave (OWNER) removes Bob (ADMIN) -> 200', daveRemovesBobInC.status === 200, daveRemovesBobInC.status);

  // Non-membership check: Eve was just removed from channelC — she should
  // no longer be able to read/send there, even though it's PUBLIC.
  const eveReadsAfterRemoval = await call(Eve.token, 'GET', `/chat/channels/${channelC}/messages`);
  check('C7: Eve (removed, PUBLIC channel) tries to read messages -> 403 (privacy != membership)', eveReadsAfterRemoval.status === 403, eveReadsAfterRemoval.status);

  // ════════════════════════════════════════════════════════════════════
  // SCENARIO D — DMs across multiple users
  // ════════════════════════════════════════════════════════════════════
  console.log('\n\n=== SCENARIO D: 1-to-1 DMs, multiple partners, dedup, mention scoping ===');

  const dmAliceBob = await call(Alice.token, 'POST', '/chat/dm', { targetUserId: Bob.id });
  const dmAliceCarol = await call(Alice.token, 'POST', '/chat/dm', { targetUserId: Carol.id });
  const dmAliceDave = await call(Alice.token, 'POST', '/chat/dm', { targetUserId: Dave.id });
  const dmAliceEve = await call(Alice.token, 'POST', '/chat/dm', { targetUserId: Eve.id });
  check('D1: Alice creates 4 distinct DMs -> all 201', [dmAliceBob, dmAliceCarol, dmAliceDave, dmAliceEve].every((r) => r.status === 201));

  const dmIds = new Set([dmAliceBob, dmAliceCarol, dmAliceDave, dmAliceEve].map((r) => r.body.data.id));
  check('D2: all 4 DM channel ids are distinct', dmIds.size === 4, [...dmIds]);

  const aliceDms = await call(Alice.token, 'GET', '/chat/dms');
  check('D3: Alice sees 4 DMs in her list', (aliceDms.body.data.length ?? aliceDms.body.data.items?.length) === 4, aliceDms.body.data.length);

  const bobDms = await call(Bob.token, 'GET', '/chat/dms');
  check('D4: Bob sees only 1 DM (his own with Alice)', (bobDms.body.data.length ?? bobDms.body.data.items?.length) === 1, bobDms.body.data.length);

  const dmSelf = await call(Alice.token, 'POST', '/chat/dm', { targetUserId: Alice.id });
  check('D5: Alice DMing herself -> 400', dmSelf.status === 400, dmSelf.status);

  const dmNonMember = await call(Alice.token, 'POST', '/chat/dm', { targetUserId: '00000000-0000-0000-0000-000000000000' });
  check('D6: DMing a non-existent/non-member user -> 404', dmNonMember.status === 404, dmNonMember.status);

  const dmDedupe = await call(Alice.token, 'POST', '/chat/dm', { targetUserId: Bob.id });
  check('D7: re-creating Alice-Bob DM returns the SAME channel id', dmDedupe.body.data.id === dmAliceBob.body.data.id, dmDedupe.body.data.id);

  const dmChannelId = dmAliceBob.body.data.id;
  const dmMsg = await call(Alice.token, 'POST', `/chat/channels/${dmChannelId}/messages`, {
    contentJson: { text: 'Hey Bob' },
    mentionedUserIds: [Bob.id],
  });
  check('D8: Alice mentions Bob inside their own DM -> 201 (valid, Bob is a member of this DM)', dmMsg.status === 201, dmMsg.status);

  const dmMentionOutsider = await call(Alice.token, 'POST', `/chat/channels/${dmChannelId}/messages`, {
    contentJson: { text: 'Hey Carol are you there' },
    mentionedUserIds: [Carol.id],
  });
  check('D9: Alice mentions Carol inside the Alice-Bob DM -> 400 (Carol not a member of THIS channel)', dmMentionOutsider.status === 400, dmMentionOutsider.status);

  const bobRepliesInDm = await call(Bob.token, 'POST', `/chat/channels/${dmChannelId}/messages`, {
    contentJson: { text: 'Yep, got your message' },
  });
  check('D10: Bob replies in the DM -> 201', bobRepliesInDm.status === 201, bobRepliesInDm.status);

  const carolTriesDmChannel = await call(Carol.token, 'GET', `/chat/channels/${dmChannelId}/messages`);
  check('D11: Carol (not a party to this DM) tries to read it -> 403', carolTriesDmChannel.status === 403, carolTriesDmChannel.status);

  // ════════════════════════════════════════════════════════════════════
  // SUMMARY
  // ════════════════════════════════════════════════════════════════════
  console.log('\n\n=== FINAL SUMMARY ===');
  const passed = results.filter((r) => r.pass).length;
  const failed = results.filter((r) => !r.pass);
  console.log(`${passed}/${results.length} checks passed.`);
  if (failed.length > 0) {
    console.log('FAILED CHECKS:');
    for (const f of failed) console.log(' -', f.label);
  }
  console.log('\nUsers, channels, and messages left in place in the "Test" workspace, not cleaned up.');
  console.log('Users:', Object.fromEntries(Object.entries(users).map(([k, v]) => [k, v.email])));
  console.log('Channels:', { channelA, channelB, channelC });
  console.log('DMs:', { dmAliceBob: dmAliceBob.body.data.id, dmAliceCarol: dmAliceCarol.body.data.id, dmAliceDave: dmAliceDave.body.data.id, dmAliceEve: dmAliceEve.body.data.id });

  await prisma.$disconnect();

  if (failed.length > 0) process.exit(1);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
