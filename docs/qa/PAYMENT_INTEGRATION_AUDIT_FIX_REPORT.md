# Home Healers — Payment Integration Audit & Fix Report

**Date:** 2026-11-21  
**Scope:** Next.js frontend only  
**Dev API:** `https://development.home-healers.com/api`  
**Telr store:** `31787`  
**No commit / push. No Laravel changes. No live charges.**

---

## A. Executive Summary

Frontend payment wiring (Card Seamless + Tabby via `method/pay`, return verification, session expiry guards) is largely sound. Confirmed frontend defects around **orphan reservations without client/guest**, **misleading Tabby-only copy**, and **insufficient local expiry margin** were fixed.

Remaining blockers are **outside frontend ownership**:

1. Dev currently reports **`test_mode: false`** (live merchant mode) — unsafe for sandbox E2E charges.
2. Telr hosted pages for Tabby initiation can still show **Card + Tabby** (provider/merchant panel behavior), not a Tabby-only sheet.
3. Backend expired-session **120s reuse margin** is not conclusively verified as deployed.

**Verdict: CONDITIONALLY READY** — frontend payment UX and safety guards are ready for controlled retesting once Telr/Dev mode and Tabby merchant configuration are correct; do not run real charges while `test_mode: false`.

---

## B. Root Cause Analysis

### 1. Reservation 3021 — no client / guest (payment 422/404)

| Item | Detail |
|---|---|
| Evidence | Live GET `reservations/3021` → `patient: null`, `guest_info: null`. `payment/summary/3021` → 422 `"Reservation has no associated client."`. `seamless/pay` / `method/pay` → 404 `"Not found"`. |
| Ownership | **Frontend + possible backend acceptance of incomplete creates** |
| Root causes found | (a) **Offer/Claim** flows entered payment even when create/summary indicated no payable client. (b) **LandingSlider** called `booking-with-packages` with only `{ package_id, payment_method: "web" }` — no guest/client. (c) **Standard booking** could fall into the “registered user” branch without a server client when no guest was selected. |
| Not a FE invent | Frontend must not invent patient IDs; backend still accepted some creates without linking a client (3021). |

### 2. Tabby page shows Card + Tabby

| Item | Detail |
|---|---|
| Evidence | Prior Dev check: `method/pay` with `method: "tabby"` opened Telr HTML containing both `#card-section` and Tabby. FE correctly posts `{ method: "tabby" }` only — no undocumented panels params. |
| Ownership | **Telr / merchant configuration** (and possibly backend `panels` mapping). Not a DOM-hideable FE defect. |
| Classification | Expected provider presentation when store enables multiple panels; **not** a frontend isolation bug. |

### 3. Invalid Payment Page Session (historical)

| Item | Detail |
|---|---|
| Evidence | Occurred under earlier Dev `test_mode: true` + Tabby-only panels (backend update summary). |
| Ownership | **Telr / backend merchant mode** |
| Current Dev | `seamless/config` returns **`test_mode: false`**. |

### 4. Session expiry / reuse

| Item | Detail |
|---|---|
| Evidence | Immediate reuse works (`reused: true`). Backend 120s margin not proven on Dev. FE previously only blocked after absolute `expires_at`. |
| Ownership | FE margin added conservatively; backend margin remains BE responsibility. |

---

## C. Changes Implemented

| File | Fix |
|---|---|
| `src/lib/payment-api.ts` | `reservationHasPayableClient`, `isReservationNotPayableError` |
| `src/lib/telr-seamless/tabby-flow.ts` | 120s `TELR_HOSTED_REUSE_MARGIN_MS`; map not-payable API errors; HTTPS redirect guard retained |
| `src/lib/telr-seamless/index.ts` | Export new helpers / margin |
| `src/components/offers/booking/OfferBookingClient.tsx` | Block payment phase if create lacks payable client or summary is not payable |
| `src/components/offers/claim/ClaimOfferClient.tsx` | Same post-create / summary guards |
| `src/components/offers/booking/OfferPaymentPanel.tsx` | Surface summary 422/404; disable Telr/Tamara/cash CTA when blocked |
| `src/app/.../booking-flow.tsx` | Refuse create when neither guest nor authenticated client exists |
| `src/components/LandingPage/sections/LandingSlider.tsx` | Stop bare package creates; route to `/booking?packageId=` |
| `src/components/payments/TelrSeamlessPanel.tsx` | Friendly error for not-payable Tabby start |
| `src/components/canceled.tsx` / `fail.tsx` | Toast for not-payable retry |
| `locales/en|ar/booking.json` | Honest Tabby hint; remove Apple Pay from subtitle when unused |
| `scripts/payment-lifecycle-smoke.mjs` | New regression smoke |
| `scripts/telr-seamless-parse-smoke.mjs` | Expiry margin assertion |

**Not changed:** Card Seamless pay/verify contracts, Tamara, pricing rules, Apple Pay (remains off), Laravel, env payment mode.

---

## D. Test Results

| Check | Result |
|---|---|
| `node scripts/payment-lifecycle-smoke.mjs` | **PASS** |
| `node scripts/telr-seamless-parse-smoke.mjs` | **PASS** |
| `node scripts/booking-regression-smoke.mjs` | **PASS** |
| `npm run ts` | **PASS** |
| `npm run lint` | **PASS** (existing warnings only) |
| `npm run build` | **PASS** |
| Live charge / Tabby authorize | **NOT RUN** (forbidden — `test_mode: false`) |
| New `method/pay` sessions for this audit | **NOT CREATED** |
| Browser live payment UI | **NOT RUN** this pass (safety); prior evidence reused |

Limitations: mocked/static smokes do not replace provider verification. Full Tabby E2E still blocked by merchant/mode configuration.

---

## E. Backend / Telr Dependencies

| Problem | Owner | Evidence | Required change | Acceptance |
|---|---|---|---|---|
| Dev `test_mode: false` | Backend / Ops | `GET .../telr/seamless/config` → `test_mode: false` | Intentional sandbox vs live decision; sandbox for website QA | Config shows `test_mode: true` for Dev QA **or** explicit live-test SOP |
| Tabby + Card on hosted page | Telr / Backend | Hosted HTML for tabby `method/pay` included card + Tabby | Confirm store 31787 Tabby enablement + correct `panels` | Hosted page matches product intent (Tabby-forward; document if multi-method is OK) |
| Historical Invalid Session in test mode | Telr | Backend update table: `panels: "tabby"` alone → Invalid | Enable Tabby on test store or use supported panels combo | Fresh test-mode Tabby URL opens usable checkout |
| Backend 120s reuse margin | Backend | Claimed on branch; not proven on Dev | Deploy + verify near-expiry reuse | Near-expiry returns new session (`reused: false`) |
| Orphan reservations still creatable server-side | Backend | 3021 exists with null patient/guest | Reject creates without client/guest (422) | Incomplete payload cannot create payable Draft |
| Clearer pay 404 vs 422 | Backend (optional) | Pay returns 404 `"Not found"` for no-client | Prefer 422 with explicit message | FE already maps both |

---

## F. Payment Safety Assessment

- No real card entry, Tabby authorization, capture, or charge was performed in this audit.
- No payment mode / env variables were changed.
- No new live `method/pay` sessions were created for investigation in this task.
- FE continues to require HTTPS redirects and never treats return URLs as paid without verify.

---

## G. Final Verdict

### CONDITIONALLY READY

**Why not PASS:** Provider/merchant mode and Tabby presentation remain unresolved; Dev is live-mode (`test_mode: false`).

**Why not BLOCKED:** Confirmed frontend defects for orphan payment entry, Tabby messaging honesty, expiry margin, and not-payable error handling are implemented and statically verified. Card Seamless / Tamara paths were preserved.

**Safe next step:** After Dev is confirmed sandbox (or an authorized live-test protocol is approved), re-run Tabby initiation only — no charge until Telr Tabby presentation is accepted by product.
