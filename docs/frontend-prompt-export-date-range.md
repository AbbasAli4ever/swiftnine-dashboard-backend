# Frontend task — fix the Reports export date range

## Context

The Reports page has two export buttons (Excel and PDF). When the user has
**not** picked a date range, the exported file is labelled:

```
2025-07-21 to 2026-08-25
```

This is wrong, and it is coming from **our frontend**, not the backend.

`2025-07-21 → 2026-08-25` is exactly **400 days** — the backend's maximum
allowed range (`ACCOUNTING_REPORTS_MAX_RANGE_DAYS = 400`). So somewhere in the
Reports page we are initialising the date-range picker to
`[today − 400 days, today]` and sending it on every export, even when the picker
*looks* empty to the user.

Verified against the live API:

| Request sent to backend | Filename returned |
|---|---|
| No date params at all | `accounting-report-2026-08-25.xlsx` (today only) |
| `dateFrom=2025-07-21&dateTo=2026-08-25` | `accounting-report-2025-07-21_to_2026-08-25.xlsx` |
| `dateFrom=&dateTo=` (empty strings) | **422** |

The backend has no code path that produces `2025-07-21`. The only way to get
that label is for us to send those exact dates.

### The backend's default is confirmed to be today only

Tested with transactions seeded either side of the UTC day boundary, then
exported with **no date params**:

| Seeded transaction | In the export? |
|---|---|
| Yesterday `2026-08-24T12:00Z` | ❌ excluded |
| Today `2026-08-25T00:00:00Z` (first instant) | ✅ included |
| Today `2026-08-25T12:00Z` | ✅ included |
| Today `2026-08-25T23:59:59Z` (last instant) | ✅ included |
| Tomorrow `2026-08-26T12:00Z` | ❌ excluded |

Result: 6 rows, every one dated `2026-08-25`. Both `.xlsx` and `.pdf` behave
identically. The full UTC day is covered, inclusive at both ends.

## The task

**1. Find where the export request is built** on the Reports page and confirm in
DevTools → Network what `dateFrom` / `dateTo` are actually being sent when the
user has not touched the filter. Expect to find a default like
`subDays(new Date(), 400)` or `subMonths(new Date(), 13)`.

**2. Make the export send exactly what the table on screen is showing.** The
export must always match the visible list — same date range, same filters. If
the user filtered the table to one client, the export contains that client.

**3. Default the Reports view to TODAY, matching the backend.**

Remove the hidden 400-day default. The picker must default to **today**, and the
table must show **today's** rows — so that what the user sees on screen is
exactly what the export produces.

Two equivalent ways to send it; either is fine:

```
(no date params at all)        → backend defaults both ends to today
?date=2026-08-25               → explicit single day
```

The important part is that the **picker visibly reads "Today"** instead of
looking blank. The current defect is the mismatch between what the picker
displays (nothing) and what it sends (400 days).

A user who exports without touching the filter will get one day's data — and an
empty file on a day with no sales. That is correct and intended: the export
matches the table. Make sure the empty state on the table says so, so an empty
export is never a surprise.

Keep the usual presets (Today / This week / This month / Custom) available —
just start on **Today**.

**4. Never send empty-string params.** `?dateFrom=&dateTo=` returns **422**.
Either send a valid `YYYY-MM-DD` pair or omit both keys.

## API contract (both export routes)

```
GET /api/v1/accounting-dashboard/reports/export       → .xlsx
GET /api/v1/accounting-dashboard/reports/export/pdf   → .pdf
```

Identical params, date resolution, filters and auth — only the format differs.

| Param | Rules |
|---|---|
| `date` | `YYYY-MM-DD`. A single day. **Cannot** be combined with `dateFrom`/`dateTo`. |
| `dateFrom` + `dateTo` | `YYYY-MM-DD`. **Must be sent together** — one alone is a 422. `dateFrom <= dateTo`. **Max 400 days apart.** |
| `clientId` | UUID |
| `bankAccountId` | UUID |
| `accountType` | `LOCAL` / `INTERNATIONAL`, comma-separated for both |
| `currency` | `USD,PKR,…` comma-separated |

All optional. Omitting every date param defaults **both ends to today**.

Validation failures return **422** with per-field detail:

```json
{ "statusCode": 422, "message": "Validation failed",
  "errors": [{ "field": "dateTo", "message": "Range cannot exceed 400 days" }] }
```

Surface `errors[].message` to the user — especially the 400-day cap, which is
currently invisible in the UI and will reject a wider picker selection.

## Download handling

Both routes return a **binary blob**, not JSON. A shared API client that calls
`res.json()` on every response will corrupt the file.

```ts
const res = await fetch(`/api/v1/accounting-dashboard/reports/export/pdf?${params}`, {
  headers: { Authorization: `Bearer ${token}`, 'x-workspace-id': workspaceId },
});
if (!res.ok) throw new Error(`Export failed: ${res.status}`);

const blob = await res.blob();
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = `accounting-report-${from}_to_${to}.pdf`;
a.click();
URL.revokeObjectURL(url);
```

Both routes require a bearer token **and** the `x-workspace-id` header — a plain
`<a href>` will 401, since the browser sends neither.

## Note on time zones

Export date boundaries are **UTC**. The Overview page's daily metric uses
server-local time (PKT, UTC+5). They can disagree about which day a late-night
transaction belongs to. Do not try to reconcile them on the frontend — just be
aware the two features genuinely use different day boundaries.

## Acceptance criteria

- [ ] The Reports page opens with the picker reading **Today**, and the table
      showing today's rows — no more hidden 400-day default.
- [ ] Exporting without touching the filter produces a **single-day file for
      today**, matching the table exactly.
- [ ] Exporting with filters applied produces a file matching the visible table.
- [ ] No empty-string date params are ever sent.
- [ ] A range over 400 days shows the server's error message instead of failing
      silently.
- [ ] Both Excel and PDF buttons behave identically.
