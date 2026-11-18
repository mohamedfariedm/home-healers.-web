# Telr + Tabby Sandbox E2E — Final Report

**Date:** 2026-11-18 (UTC)  
**Environment:** Next.js frontend (`localhost:3000`) → Dev API `https://development.home-healers.com/api`  
**Scope:** Frontend-only. No Laravel changes. No commits/pushes. Sandbox / test mode only.

---

## E. Final Verdict

**PARTIALLY VERIFIED — EXTERNAL LIMITATION**

Frontend Tabby initiation, hybrid Card+Tabby UI, return/recovery handling, idempotent session reuse against the Dev API, and static gates are verified. **Live Telr hosted checkout pages created by `method/pay` resolve to “Invalid Payment Page Session”** for every fresh and reused order tested (curl + browser). No authorized Sandbox Tabby payment can complete until Telr merchant/session creation is fixed on the provider/backend side. Card Seamless UI opens; no sandbox card charge was completed (no authorized test card run after Telr hosted failure mode).

---

## A. Executed Test Matrix

| Scenario | Environment | Result | Evidence |
|---|---|---|---|
| Tabby session initiation | Dev API + Offer UI | **PASS** | UI Tabby CTA → `POST .../telr/method/pay` → redirect to `secure.telr.com/gateway/process.html?o=…`. API returns `redirect_url`, `payment_id`, `attempt_id`, `payment_status`, `reused`, `expires_at`, amount/currency. |
| Tabby-only provider page | Sandbox | **BLOCKED** | Hosted page always “Invalid Payment Page Session” (fresh `reused:false` and reused). Cannot confirm Tabby-only panels. |
| Tabby success | Sandbox | **BLOCKED** | Cannot complete provider payment; reservation stays `payment_status: pending`. |
| Tabby cancellation | Browser/API | **PASS** (return UX) | `/en/canceled/3005` with pending Tabby → authoritative verify `created` → **Payment canceled** + retry CTA; reservation unpaid. Provider cancel workflow N/A (invalid page). |
| Tabby decline | Sandbox | **NOT RUN** | No provider decline path available; invalid session blocks decline. |
| Arabic return | Browser | **PASS** (locale UI) | `/ar/failed/…` serves Arabic chrome; recovery depends on verify (see pending recovery). |
| English return | Browser | **PASS** | `/en/canceled/3005` English canceled copy + retry. |
| Pending recovery | Browser/API | **PASS** | Verify `created`/`final:false` never treated as paid; success URL routes `unpaid` → failed; cancel shows unpaid + retry. |
| Duplicate prevention | Dev API | **PASS** | Repeat `method/pay` on same reservation → `reused:true`, same `attempt_id`/`payment_id`. `apple_pay` → **422**. |
| Card Seamless | Browser | **PASS** (UI) / **NOT RUN** (charge) | Offer panel: New Card + Tabby; amount due matches summary (621 SAR). No sandbox card charge executed. |
| Standard Booking Step 5 | Browser | **NOT RUN** | Time spent on offer + API path; Card/Tabby panel shared component. |
| Offer Checkout | Browser | **PASS** (initiation) | Offer book → Telr panel → Tabby → redirect. |
| TypeScript | Local | **PASS** | `npm run ts` |
| ESLint | Local | **PASS** | `npm run lint` (existing warnings only) |
| Production build | Local | **PASS** | `npm run build` succeeded on retry (first run failed collecting pages while `.next` raced with concurrent build/dev). |
| Parse / booking smoke | Local | **PASS** | `telr-seamless-parse-smoke.mjs`, `booking-regression-smoke.mjs` |

---

## B. Changes Made

| File | Why |
|---|---|
| `src/lib/telr-seamless/tabby-flow.ts` | Reject redirect when `expires_at` is past; require `https` redirect; treat verify `created` as **unpaid** (not endless pending); export session-expired helpers. |
| `src/lib/telr-seamless/index.ts` | Export new helpers. |
| `src/components/payments/TelrSeamlessPanel.tsx` | Surface `sessionExpired` toast on Tabby start. |
| `src/components/canceled.tsx` / `fail.tsx` | Handle `TelrSessionExpiredError` on retry. |
| `src/components/success.tsx` | On Telr `unpaid`, redirect to failed (never fake paid / never spin forever on `created`). |
| `locales/en/booking.json` / `locales/ar/booking.json` | `seamless.sessionExpired` copy. |
| `scripts/telr-seamless-parse-smoke.mjs` | Regression for expired-session detection. |

No Card Seamless pay/verify contract changes. Apple Pay remains disabled. No pricing/business-rule changes.

---

## C. Payment Evidence (sanitized)

### Environment
- API: `https://development.home-healers.com/api`
- Seamless config: `enabled`, store `31787`, `currency: SAR`, **`test_mode: true`**, SDK on `secure.telr.com`
- Frontend: `NEXT_PUBLIC_API_URL` → Dev API; Card+Tabby hybrid flags default on; Apple Pay off

### Disposable reservations (offer package 40)

| ID | Scenario | Locale | Amount (authoritative) | Notes |
|---|---|---|---|---|
| 2976 | Prior / stuck | en | 540 → fees later | Expired reused Telr session attempt **165** |
| **3005** | Tabby success attempt | en | **621 SAR** (540 + 81 nationality fee) | Attempt **166**, `reused` after first pay |
| **3006** | Cancel / AR failed | ar/en | 621 | Attempt **167** |
| 3007 | Decline (unused) | en | 540 unpaid | Prepared only |
| 3008 | Card (unused) | en | 540 unpaid | Prepared only |

### `POST /api/client/payment/telr/method/pay` (example, 3005)

Request shape: `{ reservation_id, method: "tabby", locale }`  
Response (sanitized): `attempt_id: 166`, `payment_status: "processing"`, `amount: 621`, `currency: "SAR"`, `payment_mode: "hosted_method"`, `reused: false|true`, `expires_at` ~30m, `redirect_url` host `secure.telr.com` (order ref redacted).

### Verify
`POST .../seamless/verify` attempt 166/167 → `payment_status: "created"`, `final: false`, `retry_allowed: true`, `payable_id` matches reservation. Reservation `payment_status` remains **`pending`** / unpaid.

### Provider
Opening redirect URL (browser + curl): **Invalid Payment Page Session** — expired or already used — for brand-new sessions still within `expires_at`.

### UI
Offer checkout Secure checkout: **New Card** | **Pay later with Tabby**; Tabby CTA **Pay 621 SAR**; redirect observed to Telr invalid page.

---

## D. Remaining Limitations

1. **Telr hosted sessions from `method/pay` are invalid at the provider**  
   - Evidence: fresh `reused:false` orders immediately show Invalid Payment Page Session.  
   - Impact: No Tabby (or hosted method) Sandbox E2E completion; cannot verify Tabby-only panels.  
   - FE handling: Does not invent paid; cancel/fail/success respect verify; expired `expires_at` blocks redirect.  
   - **Blocks production Tabby** until Telr order/session creation is valid in this store/test mode.

2. **Backend reuses expired Telr sessions** (e.g. 2976 / attempt 165 past `expires_at`)  
   - FE now refuses redirect when `expires_at` ≤ now; cannot force a new session without backend.  
   - Does not block once (1) is fixed and sessions are fresh.

3. **No authorized Sandbox card charge in this run**  
   - Card UI/regression only. Manual sandbox card still required for FULL card E2E.

4. **Provider decline path**  
   - Unverified (no working hosted page / no authorized decline recipe).

These are **not** frontend feature requests beyond what was safely handled above.

---

## Disposable reservation ledger

| Reservation | Purpose | payment_status after tests |
|---|---|---|
| 3005 | Tabby initiation + EN cancel recovery | pending / unpaid |
| 3006 | Tabby session + AR failed recovery seed | pending / unpaid |
| 3007 | Reserved decline | pending (untouched pay) |
| 3008 | Reserved card | pending (untouched pay) |
| 2976 | Contaminated prior Tamara/Telr | pending; do not reuse for new charges |
`)