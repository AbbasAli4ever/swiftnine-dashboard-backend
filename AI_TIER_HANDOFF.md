# AI Tier, Model Migration & Token Quota — Session Handoff

Context for continuing this work in a new chat. Everything below is **implemented and
verified** unless marked otherwise.

## 1. What problem this solves

- Chat, image generation, and document drafting originally called OpenAI **from the
  Next.js frontend** (`swiftnine-dashboard-frontend`), using an unauthenticated proxy
  route that accepted any non-empty `Authorization` header and let the caller pick the
  model from the request body. Anyone could spend the OpenAI budget on the most
  expensive model.
- We moved all OpenAI calls to the **NestJS backend**, added a per-workspace-member
  **AI tier** (`PREMIUM` / `STANDARD`), a **secret-gated** admin flow to change tiers,
  and a **weekly token quota** system for premium members with real OpenAI pricing.

## 2. Model routing

- Standard tier → `gpt-4o-mini` (flat pricing, **unmetered**, unlimited).
- Premium tier → `gpt-5.6-luna` (metered against the weekly token allowance).
  - `gpt-5.6-sol` / `gpt-5.6-terra` exist as alternate variants but are not wired in;
    `gpt-5.6-luna` is the only one currently selected.
  - **Verified against the live OpenAI account**: `encodingForModel('gpt-5.6-luna')`
    throws "Unknown model" in `js-tiktoken` — we use an **explicit encoding map**
    (`o200k_base`), never the convenience API, or the premium path breaks.
- Real pricing for `gpt-5.6-luna` (confirmed by user):
  - Short context (≤272,000 prompt tokens): **$1.00 / 1M input, $6.00 / 1M output**
  - Long context (>272,000 prompt tokens): **$2.00 / 1M input, $9.00 / 1M output**
  - The **272,000 threshold is user-confirmed**, not independently verifiable via the
    OpenAI API (model objects expose no context-window metadata).
- `apps/api/src/ai-tier/model-resolver.service.ts` — `ModelRate` now has
  `{ short, long?, longContextThreshold? }`. `estimateCostUsd()` picks tier by
  `promptTokens`. `quoteTokenCost()` returns `{minCostUsd, maxCostUsd}` — a range, not a
  single number, because the same token count costs 1x–9x depending on input/output mix.

## 3. Tier change flow (secret-gated, not role-gated alone)

- Any workspace **OWNER** sees the "Upgrade to Premium / Downgrade to Standard" menu
  item, but the action requires a **secret key** in addition to the role — role gates
  *visibility*, secret gates *execution*.
- Secret is **bcrypt-hashed**, never encrypted (verification only needs one-way
  compare). Stored in `tier_change_secrets`. Managed via
  `npm run tier:secret -- --generate` (recommended, prints once), or `--secret <val>`
  (visible in shell history — discouraged), or `--revoke` / `--list`.
- Lockout: 5 failed attempts → 15 min lock (`tier_change_attempts`), mirroring the
  existing `ProjectUnlockAttempt` pattern.
- Every change is audited in `ai_tier_change_logs` (who, whom, workspace, old/new tier,
  which secret label authorised it).
- `AiTierService.authoriseWithSecret()` is the **single** entry point for secret
  verification — token-allowance endpoints reuse it rather than duplicating the bcrypt
  compare/lockout logic.
- Endpoint: `PATCH /workspaces/:workspaceId/members/:userId/ai-tier`

## 4. Weekly token quota (premium only)

### Design decisions (explicit, from user)
1. **One pool** — prompt + completion tokens share a single weekly limit (not
   separate input/output budgets, not a dollar budget).
2. **Weekly reset**, UTC Monday 00:00, **lazy** (computed on read, not a cron job —
   this codebase has no `@nestjs/schedule`; survives downtime/missed timers).
3. **On exhaustion: block, with explicit opt-in** to continue on `gpt-4o-mini`
   (never silent fallback — the model-quality change must be visible to the user).
4. Standard tier is **always unmetered**.
5. **Never truncate a reply.** ⚠️ **Important, hard-won lesson below.**
6. Usage bar is **always visible** (not just near the limit), 3-colour zones:
   - Green: 0–49% · Yellow: 50–84% · Red: 85–100%
   - (`TOKEN_WARN_THRESHOLD_PERCENT=50`, `TOKEN_CRITICAL_THRESHOLD_PERCENT=85` in
     `ai-tier.constants.ts`)
7. **Minimum assignable limit: 150,000 tokens** (`TOKEN_LIMIT_MIN`). This is
   deliberately **above** `MAX_SINGLE_REPLY_TOKENS` (128,000 — the real
   `max_completion_tokens` ceiling OpenAI enforces for `gpt-5.6-luna`, verified live).
   Prevents an incoherent state where one reply exhausts a freshly-assigned quota and
   raising the limit appears to do nothing.

### ⚠️ Key correction made mid-session — do not re-introduce
An earlier version capped `max_completion_tokens` to "remaining budget" so a
reply couldn't overshoot the limit. **The user correctly identified this as bad
practice**: truncating a response mid-sentence (e.g., a half-finished essay/file) is
useless output the user already paid for. **Fix applied:** removed all
`max_completion_tokens` capping. Replies always run to completion. The tradeoff,
made explicit and accepted: **the quota is soft** — worst-case overshoot per message
is bounded by OpenAI's own 128k output ceiling, but in practice (verified from real
usage data) average overshoot is a few hundred to a few thousand tokens, not
thousands of percent. The **next** request after exhaustion is what actually gets
blocked, not the one that pushed over.

### Accounting correctness (verified with live API calls against real DB)
- Token counts come from OpenAI's `usage` chunk (`stream_options: {include_usage:
  true}`) when available → `tokenSource: MEASURED`.
- **Abort-mid-stream leak, found and fixed**: OpenAI only sends `usage` in the final
  chunk. If the client disconnects mid-stream, that chunk never arrives — the old code
  recorded `0` tokens even though the prompt was fully billed by OpenAI the instant the
  request was sent. Fixed: on abort, prompt tokens are counted **exactly** via
  `js-tiktoken` (the prompt array is already in scope), completion tokens estimated
  from the partial text actually received. Recorded as `tokenSource:
  TOKENIZED_PROMPT`. Verified: abandoning a stream after 1 chunk now correctly debits
  real tokens instead of 0.
- **Fallback-metering bug, found and fixed**: when a member opted into the
  `gpt-4o-mini` fallback after exhausting premium tokens, `recordUsage()` was firing
  unconditionally — so *unmetered* fallback usage was still draining the *premium*
  allowance, defeating the entire point of the opt-in. Fixed with a `meterUsage`
  flag threaded through `persistTurn()`; fallback turns now skip `recordUsage()`
  entirely. Verified live: quota unchanged after a fallback turn.
- `TokenQuotaService.recordUsage()` runs **inside the same Prisma transaction** as the
  message-row write (`persistTurn` in `ai-completions.service.ts`) — an atomic
  `increment`, so concurrent tabs can't race and the counter can never drift from the
  message audit trail. Verified: `SUM(prompt_tokens+completion_tokens)` across
  messages equals `consumed_tokens` on the allowance row.
- `assertWithinQuota()` never blocks on *estimated*-only overage — if removing
  estimated tokens would bring the member back under the limit, the request is
  allowed (estimation error must never wrongly deny service).

### Schema (migrations applied, verified by full replay onto a scratch DB from empty)
- `WorkspaceMember.aiModelTier` (enum `PREMIUM`/`STANDARD`)
- `tier_change_secrets`, `tier_change_attempts`, `ai_tier_change_logs`
- `ai_conversation_messages` gained: `model`, `promptTokens`, `completionTokens`,
  `estimatedPromptTokens`, `estimatedCompletionTokens`, `tokenSource` (enum:
  `MEASURED`/`TOKENIZED_PROMPT`/`HEURISTIC`/`UNKNOWN`), `imageCount`,
  `estimatedCostUsd` (nullable Decimal — **null means "not measured", 0.00 means
  "free"**, never conflate the two)
- `ai_token_allowances` (per workspace+user+week: `tokenLimit`, `consumedTokens`,
  `estimatedTokens`, `costUsdUsed`, `fallbackOptIn`)
- `ai_token_allowance_history` (append-only audit: `LIMIT_SET` / `MANUAL_RESET` /
  `PERIOD_ROLLOVER`, with `actorUserId` nullable + `ON DELETE SET NULL`)

### Endpoints
- `GET/PATCH /workspaces/:workspaceId/members/:userId/token-allowance` (OWNER; PATCH
  needs secret)
- `POST .../token-allowance/reset` (OWNER + secret)
- `GET /ai-tier/token-cost-quote?tokens=N` → `{minCostUsd, maxCostUsd}` for the admin
  UI's live quote while typing
- `GET /ai-conversations/model-info` → now also returns `quota` (tier + full quota
  status) so the composer needs **one** request, not two
- `POST /ai-conversations/quota/fallback-opt-in` → user accepts standard-model
  fallback for the rest of the period

## 5. Fixed a pre-existing, unrelated migration bug along the way
`prisma/migrations/20260710124006_add_ai_conversation_attachments/migration.sql`
originally added `updated_at TIMESTAMP NOT NULL` with **no default** — fails on any
DB with existing `attachments` rows (worked on empty dev DBs, broke on a populated
one; this is exactly the failure the user hit). Fixed: added
`DEFAULT CURRENT_TIMESTAMP` to the migration SQL **and** added the matching
`@default(now())` to the Prisma schema field, so `prisma migrate diff` no longer
reports drift (was previously suggesting `DROP DEFAULT`, which would re-break it).
Verified: `prisma migrate diff --from-config-datasource --to-schema` now reports
"This is an empty migration."

## 6. Frontend

- Deleted `src/app/api/chat/route.ts`, `.../chat/image/route.ts`,
  `.../chat/document/route.ts` (the vulnerable Next.js proxy routes) and removed
  `OPENAI_API_KEY` from `.env.local` (backed up at `.env.local.bak`) — key no longer
  needed in the frontend at all.
- `ChatMessageInput.tsx` — composer now shows, always (while metered), a 3-colour
  usage bar + "X left · used/limit", plus a read-only model badge. When exhausted and
  not opted into fallback: input disabled, banner offers "Continue on gpt-4o-mini".
- `MemberTierSecretModal.tsx` — two-step flow for upgrades: (1) secret key, (2) token
  allowance assignment with live cost quote (debounced) and presets
  (500k/1M/5M). Downgrades are single-step (secret only).
- `TokenAllowanceModal.tsx` — separate modal for "Edit token limit" / "Reset tokens
  now" from the existing member's menu (post-upgrade management).
- `WorkspaceSettingsPage.tsx` member table — Premium pill + same 3-colour usage bar
  as the composer (same thresholds, `bg-emerald-500` not `bg-brand-500` so it doesn't
  get confused with brand color).
- Model badge and quota badge are **intentionally not selectable/clickable** — a
  read-only `<span>`, per explicit user requirement ("not selectable, only
  describes which model is being used").

## 7. Known open items / things to verify before shipping

- [ ] **272,000-token long-context threshold** is user-provided, not independently
      verified against an OpenAI pricing page. If wrong, only cost *reporting* on very
      large prompts is affected — never blocks a request.
- [ ] `gpt-5.6-sol` / `gpt-5.6-terra` — not wired into `ModelResolverService`, only
      `luna` is live.
- [ ] The migration-edit note (`20260710124006`) means anyone who already applied the
      old (buggy) version of that migration on another machine/environment needs
      `prisma migrate resolve` to reconcile — flagged but not yet actioned by the team.
- [ ] `CostUsageSummary.tsx` (frontend) still has stale hardcoded cost-per-feature
      claims from before this work — not touched, may need updating.
- [ ] No automated test yet exercises the full HTTP layer (controllers are tested via
      direct instantiation with mocked deps, not supertest/e2e) — all verification
      beyond unit tests was done via ad-hoc scripts run against the live dev DB and
      OpenAI account, then cleaned up. Consider adding e2e coverage.
- [ ] Frontend has no automated tests for the new components
      (`MemberTierSecretModal`, `TokenAllowanceModal`, quota bar) — verified manually
      via typecheck + build only.

## 8. Verification approach used throughout (for continuity)

Every backend change was checked three ways before being called done:
1. `npx jest <affected-path>` — unit tests, mocked Prisma/OpenAI.
2. `npm run build` (`nest build`) + `npx tsc --noEmit` — full compile.
3. **Live verification scripts** (`scripts/.tmp-*.ts`, always deleted after) run with
   `ts-node` against the real dev database and, where relevant, the real OpenAI API
   key — because unit tests with mocks can't catch things like "does this tokenizer
   library actually support this model id" or "does the DB migration actually replay
   cleanly from empty." Several real bugs (see §4, §5) were only caught this way.

Frontend changes were verified with `npx tsc --noEmit` and `npx next build`
(webpack/type errors) — no runtime browser testing was performed in this session;
manual QA in-browser is still recommended.

## 9. Current git status (uncommitted)

**Backend** — modified: `ai-conversations.controller.ts`, `ai-conversations.module.ts`,
`app.module.ts`, `workspace/dto/member-response.dto.ts`, `workspace.service(.spec).ts`,
`prisma/schema.prisma`, one existing migration file, `package.json`. New: `ai-tier/`
(whole module), `ai-generation/` (whole module), `ai-completions.service(.spec).ts`,
`chat-context.builder(.spec).ts`, `model-info.controller.spec.ts`, 3 new migrations,
`scripts/set-tier-change-secret.ts`.

**Frontend** — modified: `.env.local`, `ChatMessageInput.tsx`, `ChatbotPage.tsx`,
`WorkspaceSettingsPage.tsx`, `chatbot.service.ts`, `documentGeneration.service.ts`,
`imageGeneration.service.ts`, `workspace.service.ts`. Deleted: 3 proxy routes. New:
`MemberTierSecretModal.tsx`, `TokenAllowanceModal.tsx`.

Nothing has been committed yet — all of the above is sitting as working-tree changes
in both repos.
