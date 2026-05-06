# Chat + Channels v1 — Implementation Plan

## 0. Locked decisions (one-line summary)

| Topic | Decision |
|---|---|
| Transport | Socket.IO `/chat` namespace, mirroring `/docs` gateway pattern |
| Message store | New `ChannelMessage` table; `kind = USER \| SYSTEM`; rich JSON + denormalized plaintext |
| Replies | WhatsApp-style: `replyToMessageId` self-FK, single quote, no thread tree |
| Edit | Author only, within 5 min |
| Delete | Author OR channel OWNER/ADMIN; soft delete (tombstone) |
| Reactions | New `ChannelMessageReaction` `(messageId, userId, emoji) UNIQUE`, toggle-off on duplicate |
| Mentions | New `ChannelMessageMention`, frontend supplies `mentionedUserIds[]` |
| Attachments | Reuse existing `Attachment`, add nullable `channelMessageId`; reuse presign flow |
| Pinning | Columns on `ChannelMessage`: `isPinned`, `pinnedAt`, `pinnedById`; no cap |
| Mute | `isMuted: boolean` on `ChannelMember` |
| Unread | `lastReadMessageId` + denormalized `unreadCount` on `ChannelMember` |
| Read broadcast | `member:read` socket event on pointer move; "seen by" derived client-side |
| Channel kinds | Extend `Channel` with `kind = CHANNEL \| DM`; DM has nullable name/description/projectId, exactly 2 members, no role distinction |
| PUBLIC channel join | `ChannelJoinRequest` table (PENDING/APPROVED/REJECTED), admin approves; PRIVATE = invite-only (no requests) |
| System messages | Same `ChannelMessage` row, `kind = SYSTEM`, `senderId = NULL`, `contentJson = { event, ... }` |
| Notifications | Every message → notification per member except actor & muted; `chat:mention` and DMs bypass mute |
| Search | Cursor-paginated `ILIKE` over `plaintext`, restricted to caller's channels in workspace |
| Presence | New global `PresenceService` + `/presence` namespace; drives `User.isOnline`/`lastSeenAt` from socket connect/disconnect; one-line wire-in to existing `/docs` gateway |
| Pagination | Cursor-based on `(createdAt, id)`, default 50, max 100 |

---

## 1. Schema migration — single file, additive only

**File:** `prisma/schema.prisma` (edits + additions). One Prisma migration. Safe for prod (no destructive changes; backfill in `BEGIN/COMMIT`).

### 1.1 New enums
```prisma
enum ChannelKind { CHANNEL DM }
enum ChannelMessageKind { USER SYSTEM }
enum ChannelJoinRequestStatus { PENDING APPROVED REJECTED }
```

### 1.2 Extend `Channel`
- Add `kind ChannelKind @default(CHANNEL)`
- Make `name`, `description`, `projectId` nullable (latter two already are; `name` becomes nullable to allow DMs)
- Add `@@index([workspaceId, kind])`
- **Backfill in migration:** `UPDATE channels SET kind='CHANNEL'` is implicit via default; explicit `UPDATE` not needed.

### 1.3 Extend `ChannelMember`
- Add `isMuted Boolean @default(false)`
- Add `lastReadMessageId String?`
- Add `unreadCount Int @default(0)`
- Add `joinedAt DateTime @default(now())` (used by system messages)
- Add `@@index([userId, channelId])` (already have `[userId]`)

### 1.4 Extend `Attachment`
- Add `channelMessageId String?` + relation
- Add `@@index([channelMessageId])`

### 1.5 New tables

```prisma
model ChannelMessage {
  id               String              @id @default(uuid())
  channelId        String              @map("channel_id")
  senderId         String?             @map("sender_id")     // null when kind=SYSTEM
  kind             ChannelMessageKind  @default(USER)
  contentJson      Json                @map("content_json")
  plaintext        String              @default("")
  replyToMessageId String?             @map("reply_to_message_id")
  isEdited         Boolean             @default(false) @map("is_edited")
  editedAt         DateTime?           @map("edited_at")
  isPinned         Boolean             @default(false) @map("is_pinned")
  pinnedAt         DateTime?           @map("pinned_at")
  pinnedById       String?             @map("pinned_by_id")
  createdAt        DateTime            @default(now()) @map("created_at")
  updatedAt        DateTime            @updatedAt       @map("updated_at")
  deletedAt        DateTime?           @map("deleted_at")

  channel       Channel                  @relation(fields: [channelId], references: [id], onDelete: Cascade)
  sender        User?                    @relation("ChannelMessageSender", fields: [senderId], references: [id])
  pinnedBy      User?                    @relation("ChannelMessagePinner", fields: [pinnedById], references: [id])
  replyTo       ChannelMessage?          @relation("ChannelMessageReply", fields: [replyToMessageId], references: [id], onDelete: SetNull)
  replies       ChannelMessage[]         @relation("ChannelMessageReply")
  mentions      ChannelMessageMention[]
  reactions     ChannelMessageReaction[]
  attachments   Attachment[]

  @@index([channelId, createdAt(sort: Desc), id])    // primary cursor index
  @@index([channelId, isPinned, createdAt])          // pinned listing
  @@index([senderId])
  @@map("channel_messages")
}

model ChannelMessageMention {
  id              String   @id @default(uuid())
  messageId       String   @map("message_id")
  mentionedUserId String   @map("mentioned_user_id")
  createdAt       DateTime @default(now()) @map("created_at")

  message       ChannelMessage @relation(fields: [messageId], references: [id], onDelete: Cascade)
  mentionedUser User           @relation(fields: [mentionedUserId], references: [id])

  @@unique([messageId, mentionedUserId])
  @@index([mentionedUserId])
  @@map("channel_message_mentions")
}

model ChannelMessageReaction {
  id        String   @id @default(uuid())
  messageId String   @map("message_id")
  userId    String   @map("user_id")
  emoji     String   // unicode or :shortcode:
  createdAt DateTime @default(now()) @map("created_at")

  message ChannelMessage @relation(fields: [messageId], references: [id], onDelete: Cascade)
  user    User           @relation(fields: [userId], references: [id])

  @@unique([messageId, userId, emoji])
  @@index([messageId])
  @@map("channel_message_reactions")
}

model ChannelJoinRequest {
  id           String                    @id @default(uuid())
  channelId    String                    @map("channel_id")
  userId       String                    @map("user_id")
  status       ChannelJoinRequestStatus  @default(PENDING)
  requestedAt  DateTime                  @default(now()) @map("requested_at")
  decidedById  String?                   @map("decided_by_id")
  decidedAt    DateTime?                 @map("decided_at")

  channel    Channel @relation(fields: [channelId], references: [id], onDelete: Cascade)
  user       User    @relation("JoinRequester", fields: [userId], references: [id])
  decidedBy  User?   @relation("JoinRequestDecider", fields: [decidedById], references: [id])

  @@unique([channelId, userId, status])  // one PENDING per user/channel; allows historical APPROVED/REJECTED
  @@index([channelId, status])
  @@map("channel_join_requests")
}
```

### 1.6 Production migration safety
- All changes are **additive** (new tables, new columns) plus one **nullable widening** (`Channel.name`). Both are non-destructive on Postgres.
- No data loss path. Existing channels keep `kind = CHANNEL` via default. Existing `User.isOnline` values are not touched — new `PresenceService` will overwrite them at runtime once deployed.
- Run order in prod: deploy migration → restart API → presence/SSE clients reconnect → unread counts start at 0 (acceptable; users can mark all as read).

---

## 2. Module file structure

```
apps/api/src/
  chat/
    chat.module.ts
    chat.controller.ts                  # REST: messages, reactions, pin, mute, mark-read, search, attachments
    chat.service.ts                     # all message DB logic
    chat.gateway.ts                     # Socket.IO /chat
    chat-system.service.ts              # helper: emit SYSTEM message rows
    chat-fanout.service.ts              # unread increment, notification fan-out (extracted to keep service lean)
    dto/
      send-message.dto.ts
      edit-message.dto.ts
      add-reaction.dto.ts
      pin-message.dto.ts
      mark-read.dto.ts
      search-messages.dto.ts
      message-response.dto.ts
      list-messages.dto.ts
      create-dm.dto.ts

  presence/
    presence.module.ts
    presence.service.ts                 # in-memory ref-counted map<userId, Set<socketId>>
    presence.gateway.ts                 # Socket.IO /presence — broadcasts presence:changed

  channels/                              # EXISTING — additive edits only
    channels.controller.ts              # add: list-by-kind filter, DM endpoints
    channels.service.ts                 # add: createDmChannel(targetUserId), system-message hooks on existing flows
    join-requests/
      join-requests.controller.ts       # POST /channels/:id/join-requests, PATCH /channels/:id/join-requests/:reqId, GET listing
      join-requests.service.ts
      dto/
        decide-join-request.dto.ts

  docs/
    docs.gateway.ts                     # one-line edit: presence.connect / presence.disconnect calls
```

**Edits to existing files:**
- `app.module.ts` → import `ChatModule`, `PresenceModule`
- `attachments/attachments.service.ts` → extend the presign-confirm flow to accept `channelMessageId` (mirrors `taskId` / `docId` branches)

**No deletes. No renames. No file moves.**

---

## 3. RBAC matrix

| Action | Allowed for |
|---|---|
| List channel messages | Channel members only (PUBLIC channel non-members see directory entry but not messages) |
| Send message | Channel members only (DMs: both participants) |
| Edit message | Author, within 5 min, USER kind only |
| Delete message | Author OR channel OWNER/ADMIN; SYSTEM messages immutable |
| Pin / unpin | Channel OWNER/ADMIN |
| Add/remove reaction | Any channel member |
| Mute / unmute channel | Self only (own ChannelMember row) |
| Mark as read | Self only |
| Create join request | Any workspace member, target channel must be PUBLIC, requester not already a member, no PENDING request open |
| Approve/reject join request | Channel OWNER/ADMIN |
| Open DM | Any workspace member ↔ any other workspace member in same workspace |
| Search | Returns only messages from channels caller is a member of, single workspace |
| Workspace OWNER bypass | **None** for chat. PRIVATE channels are private even from workspace owners. |

Existing `WorkspaceGuard` + `JwtAuthGuard` cover the workspace boundary. Channel-level checks live in `chat.service.ts` (helper: `assertChannelMember(channelId, userId)`).

---

## 4. REST endpoints catalog

All routes under `/api/v1`, behind `JwtAuthGuard + WorkspaceGuard`, require `x-workspace-id` header.

### Messages
- `GET    /chat/channels/:channelId/messages?cursor=&limit=` — paginated history, newest first
- `GET    /chat/channels/:channelId/messages/pinned` — pinned messages
- `POST   /chat/channels/:channelId/messages` — send (body: `contentJson`, optional `replyToMessageId`, `mentionedUserIds[]`, `attachmentIds[]`)
- `PATCH  /chat/messages/:messageId` — edit (5-min window, author only)
- `DELETE /chat/messages/:messageId` — soft delete

### Reactions
- `POST   /chat/messages/:messageId/reactions` — body `{ emoji }`. Toggles off if already reacted.

### Pinning
- `POST   /chat/messages/:messageId/pin`
- `DELETE /chat/messages/:messageId/pin`

### Read state / mute
- `POST   /chat/channels/:channelId/read` — body `{ lastReadMessageId }`. Recomputes unreadCount from DB, broadcasts `member:read`.
- `POST   /chat/channels/:channelId/mute`
- `POST   /chat/channels/:channelId/unmute`

### DMs
- `POST   /chat/dm` — body `{ targetUserId }` → returns existing or new DM channel
- `GET    /chat/dms` — list caller's DM channels in workspace

### Search
- `GET    /chat/search?q=&channelId?=&cursor?=&limit?=`

### Join requests (under existing `channels` module)
- `POST   /channels/:id/join-requests` — caller requests to join PUBLIC channel
- `GET    /channels/:id/join-requests?status=PENDING` — admin-only list
- `PATCH  /channels/:id/join-requests/:reqId` — body `{ decision: 'approve'|'reject' }`
- `GET    /channels/:id/join-requests/me` — caller's own request status

### Attachments (extension of existing endpoints)
- Existing presign endpoint accepts a new `scope: 'channel-message'` with `channelId`. After upload, message create includes `attachmentIds[]` and the service marks each attachment row with `channelMessageId`.

---

## 5. Socket.IO event catalog

### Namespace `/chat`
**Auth:** JWT in handshake `auth.token`, copy `authenticate()` from `apps/api/src/docs/docs.gateway.ts` (line 211).

**Client → Server:**

| Event | Payload | Effect |
|---|---|---|
| `chat:join` | `{ channelId }` | Asserts membership, joins room `channel:{id}` |
| `chat:leave` | `{ channelId }` | Leaves room |
| `chat:typing-start` | `{ channelId }` | Server emits `typing:user-started` to room |
| `chat:typing-stop` | `{ channelId }` | Server emits `typing:user-stopped` to room |

(Message create/edit/delete/react/pin go through REST; the gateway only fans out events from the service layer. Same pattern as docs.)

**Server → Client (emitted to room `channel:{id}`):**

| Event | Payload |
|---|---|
| `message:new` | full message dto incl. sender, mentions, attachments, replyTo preview |
| `message:edited` | message dto |
| `message:deleted` | `{ messageId, deletedAt }` |
| `message:pinned` | `{ message, pinnedById, pinnedAt }` |
| `message:unpinned` | `{ messageId }` |
| `reaction:added` | `{ messageId, userId, emoji }` |
| `reaction:removed` | `{ messageId, userId, emoji }` |
| `member:read` | `{ channelId, userId, lastReadMessageId, readAt }` |
| `member:joined` / `member:left` / `member:role-changed` | mirrors REST channel-membership events |
| `typing:user-started` / `typing:user-stopped` | `{ channelId, userId }` |
| `system:event` | system message dto (also delivered via `message:new`; redundant client-side filter on `kind`) |

**Note:** `member:read` is emitted only on `POST /chat/channels/:id/read`. One event per pointer advance, not per message.

### Namespace `/presence`
**Client → Server:** `presence:subscribe` (joins rooms `workspace:{id}` for each workspace caller belongs to)

**Server → Client:** `presence:changed { userId, isOnline, lastSeenAt }` — emitted to every workspace room the user belongs to on transition (0→1 or n→0 sockets only; intermediate counts don't fire).

---

## 6. Notification fan-out rules

On `POST /chat/.../messages`:

```
for each ChannelMember m of channel:
  if m.userId == sender.userId: skip
  is_mentioned = m.userId in mentionedUserIds
  is_dm        = channel.kind == DM
  if m.isMuted and not is_mentioned and not is_dm: skip
  type  = "chat:mention" if is_mentioned or is_dm else "chat:message"
  title = depends on type, channel name, sender name
  ref   = ("channel_message", message.id)
  notifications.createNotification(...)   # existing service handles SSE push
```

One notification row per recipient per message. Reuses existing `NotificationsService` and `NotificationsSseService` — no changes to the notifications module needed.

---

## 7. Phased delivery — for developer agents

Each phase is independently mergeable and testable. Run order matters; phases assume earlier ones are deployed.

### Phase 1 — Schema + migration (foundation)
**Scope:** all schema changes from §1, one Prisma migration, regenerate client.

**Acceptance:**
- `npx prisma migrate dev` applies cleanly on a fresh DB
- `npx prisma migrate deploy` applies on a clone of staging DB without errors
- All existing tests still pass
- New tables exist; existing rows untouched

**Files:** `prisma/schema.prisma`, `prisma/migrations/<timestamp>_chat_v1/`

### Phase 2 — Channel join requests + system messages helper
**Scope:** join-request CRUD + `ChatSystemService` skeleton (just the helper that writes a SYSTEM-kind ChannelMessage row).

**Acceptance:**
- POST/GET/PATCH join-request endpoints work with RBAC checks
- Approving a request creates `ChannelMember` + writes a SYSTEM message `{ event: 'member_joined', userId }` via `ChatSystemService.emit(channelId, ...)`
- Existing channel CRUD (create / rename / privacy change / member added or removed) calls `ChatSystemService.emit` with the matching event
- Notifications still fire for member_added (existing behavior preserved)

**Files:** `chat/chat-system.service.ts`, `channels/join-requests/*`, edits in `channels/channels.service.ts`.

### Phase 3 — Core messaging (REST only, no real-time yet)
**Scope:** send / list / edit / delete / pin / unpin / reactions / mark-read / mute / DMs / attachments wiring / search.

**Acceptance:**
- All REST endpoints from §4 functional
- 5-min edit window enforced
- Soft delete works; tombstone returns `kind=USER, deletedAt!=null, contentJson={ deleted: true }, plaintext=''`
- DM endpoint deduplicates: calling `POST /chat/dm` twice with same target returns same channel
- `unreadCount` increments correctly on send (single SQL `UPDATE`); `mark-read` recomputes from DB
- Search returns only messages from caller's channels in workspace
- Notifications fan-out works per §6

**Files:** `chat/chat.controller.ts`, `chat/chat.service.ts`, `chat/chat-fanout.service.ts`, all DTOs, edits in `attachments/attachments.service.ts`.

### Phase 4 — `/chat` Socket.IO gateway
**Scope:** wire the gateway, broadcast on every mutation in `chat.service.ts`. Mirror the auth/connection lifecycle of `docs.gateway.ts`.

**Acceptance:**
- Client can `chat:join` and receive `message:new`/`message:edited`/etc. as REST mutations happen
- Membership is enforced on `chat:join`
- Typing events round-trip correctly between two connected clients
- Reconnect after disconnect: client missing messages can recover via `GET /chat/channels/:id/messages?cursor=` (at-least-once via DB)

**Files:** `chat/chat.gateway.ts`, edits in `chat/chat.service.ts` to inject and call the gateway.

### Phase 5 — Presence
**Scope:** `PresenceService` + `/presence` namespace + minimal hook into `/chat` and `/docs` gateways.

**Acceptance:**
- User connects from one client → `User.isOnline` flips to `true`, `presence:changed` fires once
- Same user opens a second tab → no duplicate `presence:changed` (ref-counted)
- Both tabs close → `User.isOnline` flips to `false`, `lastSeenAt` updated, `presence:changed` fires once
- Subscribing client receives only events for users in workspaces it belongs to
- One-line edits to docs.gateway are minimal (connect call in `handleConnection`, disconnect call in `handleDisconnect`)

**Files:** `presence/*`, edits in `chat/chat.gateway.ts` and `docs/docs.gateway.ts`.

---

## 8. Out of scope for v1 (do not build)

- Group DMs (>2 participants)
- Message threads (Slack-style sub-conversations)
- Message editing past 5 min, including by admins
- Per-channel notification preferences beyond mute on/off
- Email digests / push notifications
- Channel-scoped presence ("who's currently viewing this channel")
- tsvector / trigram search index (defer until search latency complaints)
- Redis Socket.IO adapter (defer until horizontal scaling)
- Message scheduling, reminders, drafts, bookmarks
- Cross-workspace search or DMs
- Workspace-admin override read of PRIVATE channels

---

## 9. Risk callouts

1. **`Channel.name` becomes nullable.** Any existing consumer that asserts non-null on this field needs review. The current channel service only reads it; no NOT NULL assertions in code. Frontend may need an update, but the user said the frontend is being designed fresh, so safe.
2. **`User.isOnline` becomes socket-driven.** During the first deploy, every user shows offline until they reconnect. Acceptable.
3. **Notification volume** at G1=a (every message → row per member) will produce a lot of `notifications` rows. The existing 90-day cleanup mentioned in the schema comment must actually be running in prod — confirm before phase 3 ships, or mute will become the primary load-relief lever.
4. **In-memory presence + single instance.** Same constraint as docs gateway. The existing warning log in `apps/api/src/docs/docs.gateway.ts` (line 67) about `INSTANCE_COUNT > 1` should be replicated in `chat.gateway.ts` and `presence.gateway.ts`.

---

## 10. Handoff

Greenlight Phase 1 (schema + migration) and the developer agents can begin. Each subsequent phase references this document as the source of truth — agents should not re-derive decisions, only execute against this spec.
