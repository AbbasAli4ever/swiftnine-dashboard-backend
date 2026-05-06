# Chat + Channel Migration Runbook

Purpose: production rollout checklist for the additive chat/channel schema migration and the follow-on API release.

## Migration Artifact

- Prisma migration: `prisma/migrations/20260505115119_chat_v1/`

## Risk Note

The generated migration includes:

- additive chat/channel tables and columns
- nullable widening for `Channel.name`
- `ALTER TYPE "Role" ADD VALUE 'ADMIN'`

Older Postgres versions can reject enum value changes inside transactional migration wrappers. Confirm the production server version before rollout.

## Pre-Deploy Checklist

1. Confirm production Postgres major version.
   If version is older than PostgreSQL 12, dry-run the enum-alter behavior on a clone first.
2. Run the migration against a staging clone of production data.
3. Confirm the application build used for deploy contains:
   - Phase 1 schema
   - Phase 2 join requests/system messages
   - Phase 3 REST messaging
   - Phase 4 `/chat` gateway
   - Phase 5 `/presence`
4. Ensure `CORS_ALLOWED_ORIGINS` is set for production websocket and HTTP traffic.
5. Confirm notification retention envs if customized:
   - `NOTIFICATIONS_RETENTION_DAYS`
   - `NOTIFICATIONS_RETENTION_CLEANUP_INTERVAL_MS`

## Dry Run Commands

Staging clone:

```bash
npx prisma migrate deploy
npm run build
```

Verify:

- migration completes with no enum errors
- chat tables exist
- existing workspaces/channels/users remain readable
- app boots successfully after migration

## Production Rollout Order

1. Deploy migration:

```bash
npx prisma migrate deploy
```

2. Restart the API with the chat-enabled build.
3. Let `/chat`, `/docs`, and `/presence` clients reconnect.
4. Smoke test:
   - open chat socket
   - send message
   - receive realtime event
   - mark read
   - verify presence updates between two users

## Post-Deploy Validation

- `GET /channels/workspaces/:workspaceId` returns unread state fields
- `POST /chat/dm` creates or reuses a DM channel
- `/chat` sockets auto-join member channel rooms on connect
- `presence:changed` fires once on first active socket and once on last disconnect
- notification cleanup watcher does not throw at startup

## Rollback

Schema rollback is not trivial because the migration adds new tables and enum values. Treat rollback as:

1. stop serving the new app build
2. redeploy the previous API build only if it tolerates the additive schema
3. do not attempt destructive schema rollback without a data migration plan

The safer rollback path is application rollback, not database rollback.
