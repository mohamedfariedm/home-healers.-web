# Home Healers — Booking Production Readiness Report

**Date:** 2026-11-18  
**Environment:** `http://localhost:3001` (`yarn next dev -p 3001`)  
**Scope:** Close remaining QA gaps (Step 5/6 responsive, English confirmation + locale specialty labels, HH-2995 nationality evidence, booking smoke tests, static gates)

---

## A. Executive Summary

| Item | Result |
|---|---|
| Overall readiness | **CONDITIONALLY READY** |
| Bugs found this closure | **2** (320px FAB overlap with sticky nav; 320px coupon Apply clip) |
| Bugs fixed | **2** (+ locale specialty catalog sync completed/verified) |
| Critical blockers | **0** |
| Non-critical gaps | HH-2995 nationality still **INCONCLUSIVE** from authorized GET fields; browser E2E not covered by a full automation framework (smoke helpers only) |

Core booking works end-to-end in Arabic and English, including cash confirmation **HH-3000** (EN) and prior **HH-2996** (AR). Payment summary remains backend-authoritative. Production `yarn build` succeeds.

---

## B. Responsive Step 5/6 Matrix

Actual browser inspection via CDP `Emulation.setDeviceMetricsOverride` + DOM layout metrics on live Step 5 / Step 6 UI.

| Viewport | Payment Step | Confirmation Step | Evidence |
|---|---|---|---|
| 1440px | **PASS** | **PASS** | Step 5: Telr/Tamara/Cash visible; summary `300`/`tax 0`; overflowX=0; FAB≠nav. Step 6: HH-3000 EN confirmation, specialty General Physiotherapy, Download Receipt clickable |
| 768px | **PASS** | **PASS** | overflowX=0; methods visible; fabNavGap≈34; confirmation cards readable; no clipped CTAs |
| 390px | **PASS** | **PASS** | After FAB lift: fabNavGap≈42, fabOverlapNav=false; payment + confirmation OK |
| 320px | **PASS** (after fix) | **PASS** | Pre-fix: Call FAB overlapped sticky nav; coupon Apply clipped (left≈-45). Post-fix: fabBottom=144px (`bottom-36`), fabOverlapNav=false, clippedBtnCount=0, Download Receipt / Go to Home fully in-view |

**Notes**

- Step 5 exercised on unpaid → cash flow that produced **HH-3000** (no Telr/Tamara submission).
- Step 6 exercised on live confirmation UI for **HH-3000**, not a manufactured fake response.
- Sticky step nav is not present on confirmation (expected); FAB overlap checks apply primarily to Steps 1–5.

---

## C. Localization Results

| Scenario | Result | Evidence |
|---|---|---|
| AR → select specialty/doctor → switch EN | **PASS** | Category id `21` retained; `selectedCategory.name` updated to **General Physiotherapy** from EN catalog |
| EN → switch AR | **PASS** | Name restored to **العلاج الطبيعي العام**; `dir=rtl`; selected chip `تم اختيار: العلاج الطبيعي العام (تخصص)` |
| Refresh persistence | **PASS** | After reload on `/booking`, id `21` + doctor `عثمان المقتسم` + AR label persisted |
| EN booking chrome (steps 1–6) | **PASS** | `/en/booking` LTR; Payment Method / Invoice Summary / Confirm Booking — Cash |
| EN confirmation | **PASS** | **HH-3000**; specialty **General Physiotherapy**; patient `اختبار سعودي QA`; doctor `عثمان المقتسم`; total **300**; PDF control “Download Receipt” |
| PDF / tax labels | **PASS** (UI) | EN confirmation payment summary + download control present; no frontend nationality-fee override observed (`tax: 0` for Saudi) |

**Implementation:** `booking-flow` syncs `selectedCategory` / nested service category **by ID** from the active-locale categories catalog. `resolveBookingSpecialtyLabel` prefers catalog-by-id. No hardcoded specialty dictionary.

---

## D. Nationality Fee Evidence

Authorized `GET /client/reservations/{id}` inspection (development API). Payload contains `fees` / `total_amount` / patient demographics, but **no `nationality_id` / `nationality` field** on reservation or patient for these records.

| Reservation | Verified Nationality | Nationality ID | Fee | Total | Verdict |
|---|---|---|---|---|---|
| HH-2996 | Saudi (create-path evidence: guest `nationality_id=1`, payment-summary `nationality_fee=0`) | **1** (create) | 0.00 | 300.00 | **PASS** (Saudi) |
| HH-2995 | **Not independently verifiable** from GET (`national_id` document number only; `guest_info=null`; no nationality fields) | **Unknown** | 45.00 | 345.00 | **INCONCLUSIVE** |
| HH-3000 | Saudi patient in draft (`nationality_id=1`, name `اختبار سعودي QA`); UI tax 0 / total 300 | **1** (client draft / create path) | 0 (UI / summary path) | 300 | **PASS** (Saudi EN cash) |

Frontend continues to map API `nationality_fee` → `pricing.tax` with no hardcoded nationality math.

---

## E. Automated Tests

No Jest / Vitest / Playwright in `package.json`. Added a lightweight Node smoke script consistent with existing `scripts/*-smoke.mjs` pattern.

| Suite | Command | Result |
|---|---|---|
| Booking regression smoke | `node scripts/booking-regression-smoke.mjs` | **OK** |

Covers pure logic mirrors of:

- Doctor ↔ category match / invalidate
- Catalog-by-id specialty label resolution across locales
- Placeholder specialist suppression
- Backend `nationality_fee` → tax mapping

Does **not** claim full browser E2E automation coverage.

---

## F. Build & Static Checks

| Check | Result |
|---|---|
| `yarn ts` | **PASS** |
| `yarn lint` | **PASS** (pre-existing warnings only; no new errors) |
| `yarn build` | **PASS** |
| Browser console (sampled Steps 5–6) | No booking-blocking exceptions observed during EN cash path |
| Network (sampled) | `client/reservations` → payment summary → `payment/cash/pay` succeeded for HH-3000 |

Dev server on **3001** was stopped before build; port **3000** was not modified.

---

## G. Modified Files (this closure + related booking QA)

| File | Reason |
|---|---|
| `src/app/.../booking-flow.tsx` | Sync selected category/service names from locale catalog by ID |
| `src/lib/resolve-booking-specialty.ts` | Catalog-by-id specialty label resolution |
| `src/app/.../steps/step1-specialty-selection.tsx` | Locale-aware category labels |
| `src/components/FloatingContact.tsx` | Raise booking FABs (`bottom-36`) so 320px Call does not cover sticky nav |
| `src/app/.../steps/step5-payment.tsx` | Coupon row stacks on small screens; avoid Apply clip |
| `scripts/booking-regression-smoke.mjs` | Targeted booking helper regression smoke |
| `docs/qa/BOOKING_PRODUCTION_READINESS_REPORT.md` | This report |

Prior booking QA fixes (localStorage hydrate, doctor gate, image fallbacks, Maps error UI, etc.) remain as documented in earlier QA reports.

---

## H. Outstanding Issues

### Confirmed bugs

None remaining after the 320px FAB / coupon fixes.

### Backend limitations

- Reservation GET does not expose `nationality_id` / nationality name for HH-2995/HH-2996 shaped payloads → non-Saudi fee comparisons stay **INCONCLUSIVE** without create-payload or admin fields.
- Fee amounts remain backend-authoritative.

### Missing test coverage

- No Playwright/Cypress suite for full six-step browser E2E.
- Smoke script covers helpers only.

### Non-blocking data quality

- Some doctor `specialist` seed strings remain faker-like; UI prefers selected category.
- Occasional mixed AR fragments on EN Step 3 calendar chrome (`اختيار المواعيد`) — i18n copy gap, not a booking blocker.

---

## I. Final Verdict

### **CONDITIONALLY READY**

Core booking, English confirmation, locale specialty display, Step 5/6 responsive layouts (after small fixes), TypeScript/lint/production build, and Saudi fee pass-through are verified with browser evidence.

Remaining non-critical gaps: independent proof of nationality for historical HH-2995 (`fees=45`), and absence of a full browser automation harness beyond the new smoke script.

A successful build alone was **not** used as the readiness bar; Step 5/6 viewports and EN confirmation were inspected live in the browser.
