# Chat + Presence Frontend Integration

Purpose: frontend integration reference for chat REST APIs, `/chat` and `/presence` Socket.IO usage, payload shapes, unread state, reconnect behavior, and presence semantics.

## Transport

- REST base: `/api/v1/chat`
- Socket namespace: `/chat`
- Presence namespace: `/presence`
- Auth: JWT access token in Socket.IO handshake `auth.token`
- Workspace scope for REST: `x-workspace-id` header is required

Example socket bootstrap:

```ts
import { io } from 'socket.io-client';

const chatSocket = io('/chat', {
  withCredentials: true,
  auth: { token: accessToken },
});

const presenceSocket = io('/presence', {
  withCredentials: true,
  auth: { token: accessToken },
});
```

## REST Endpoints

- `GET /chat/channels/:channelId/messages?cursor=&limit=`
- `GET /chat/channels/:channelId/messages/context?messageId=&before=&after=`
- `GET /chat/channels/:channelId/messages/pinned`
- `POST /chat/channels/:channelId/messages`
- `PATCH /chat/messages/:messageId`
- `DELETE /chat/messages/:messageId`
- `POST /chat/messages/:messageId/reactions`
- `POST /chat/messages/:messageId/pin`
- `DELETE /chat/messages/:messageId/pin`
- `POST /chat/channels/:channelId/read`
- `POST /chat/channels/:channelId/mute`
- `POST /chat/channels/:channelId/unmute`
- `POST /chat/dm`
- `GET /chat/dms`
- `GET /chat/search?q=&channelId?=&cursor?=&limit?=`

## Channel Sidebar State

Workspace and project channel list APIs under `/api/v1/channels` now expose caller-specific unread state:

- `isMember`
- `isMuted`
- `unreadCount`
- `lastReadMessageId`
- `viewerMembership`

Use these fields for badges and mute indicators. Public channels the caller has not joined return:

- `isMember = false`
- `isMuted = false`
- `unreadCount = 0`
- `lastReadMessageId = null`
- `viewerMembership = null`

## `/chat` Client Events

- `chat:join { channelId }`
- `chat:leave { channelId }`
- `chat:typing-start { channelId }`
- `chat:typing-stop { channelId }`

Notes:

- The backend auto-joins all channels the user belongs to on socket connect.
- `chat:join` is still useful when the frontend wants an explicit room contract for the currently viewed channel.
- Typing events are rate-limited server-side.

## `/chat` Server Events

- `message:new`
- `message:edited`
- `message:deleted { messageId, deletedAt }`
- `message:pinned { message, pinnedById, pinnedAt }`
- `message:unpinned { messageId }`
- `reaction:added { messageId, userId, emoji }`
- `reaction:removed { messageId, userId, emoji }`
- `member:read { channelId, userId, lastReadMessageId, unreadCount, readAt }`
- `typing:user-started { channelId, userId }`
- `typing:user-stopped { channelId, userId }`
- `system:event`

`message:new` carries the full message DTO used by REST history endpoints. System messages are also emitted as `system:event` for clients that want a dedicated handler.

## Message DTO Shape

Important fields:

- `id`
- `channelId`
- `senderId`
- `kind`: `USER | SYSTEM`
- `contentJson`
- `plaintext`
- `replyToMessageId`
- `isEdited`
- `editedAt`
- `isPinned`
- `pinnedAt`
- `pinnedById`
- `createdAt`
- `updatedAt`
- `deletedAt`
- `sender`
- `pinnedBy`
- `mentions`
- `reactions`
- `attachments`
- `replyTo`
- `channel`

Soft-deleted messages return:

- `contentJson = { deleted: true }`
- `plaintext = ''`
- `deletedAt != null`

## Seen By / Read State

The backend does not send a precomputed `seenBy` list.

Frontend derivation rule:

1. Track each `member:read` event per channel by `userId`.
2. Compare the member's `lastReadMessageId` pointer against each message in the current timeline.
3. Render "seen by" from those pointers client-side.

Unread state updates:

- history reload or channel list fetch gives the canonical unread count
- `member:read` advances pointers live
- incoming `message:new` should increment local badge state unless the channel is active and immediately marked read

## Search And Jump To Context

Search:

- `GET /chat/search` returns matched messages only

Jump to context:

- `GET /chat/channels/:channelId/messages/context?messageId=<id>&before=20&after=20`

Use the context endpoint after a search hit to hydrate nearby messages without replaying the entire channel history.

## Reconnect Strategy

Recommended client flow:

1. Reconnect the `/chat` socket with a fresh access token.
2. Re-subscribe `/presence` with `presence:subscribe`.
3. Re-fetch the active channel with `GET /chat/channels/:id/messages?cursor=`.
4. Re-fetch channel sidebar lists to reconcile unread counts.
5. If the user jumped from search, use the context endpoint for anchor hydration.

Delivery model is at-least-once via database recovery, not exactly-once via sockets.

## `/presence` Namespace

Client event:

- `presence:subscribe`

Server event:

- `presence:changed { userId, isOnline, lastSeenAt }`

Behavior:

- subscribe joins every workspace room the caller belongs to
- updates are only delivered for users in shared workspaces
- only `/chat` and `/docs` sockets mark users online

Important:

- a client connected only to `/presence` does **not** flip `isOnline = true`
- connect `/chat` early in the app lifecycle if presence indicators should reflect an active session

## Rate Limits

Current backend safeguards:

- message send: 30 per minute per user per channel
- reaction toggles: 120 per minute per user per channel
- typing events: 120 per minute per user per channel

Expect HTTP `429` or websocket errors if the client floods these paths.
