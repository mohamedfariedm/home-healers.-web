# Booking Flow Fixes & End-to-End QA Report

**Date:** 2026-11-18  
**Environment:** `http://localhost:3001` (dev; port 3000 left untouched)  
**App:** Home Healers Website  

---

## A. Executive Summary

| Metric | Result |
|---|---|
| Issues fixed (frontend verified) | **5** (Issues 2–6) |
| Issues investigated with API evidence | **6** (including Issue 1) |
| Unresolved / external | **0 critical frontend blockers**; Issue 1 currently behaves correctly when `nationality_id=1` is sent |
| Cash booking E2E | **PASS** — reference **HH-2996** |
| Backend changes required | **No frontend VAT override needed.** If non-Saudi fee / Saudi fee ever regresses while `nationality_id` is correct, that is backend ownership. Doctor seed field `specialist: "doloremque"` remains bad test data (display mitigated). |
| Production build | **PASS** after clearing contended `.next` (see follow-up report) |
| Final verdict | **PASS** (follow-up regression completed — see `BOOKING_FINAL_REGRESSION_REPORT.md`) |

Cash booking works end-to-end after frontend fixes. Issue 1 (VAT) was verified against the live payment-summary API for a Saudi patient (`nationality_id=1` → `nationality_fee: 0`). Non-Saudi comparative evidence uses existing HH-2995 (`fees: 45`) without creating a new booking. Production build initially failed due to concurrent `yarn build` + `yarn dev` corrupting `.next`; a clean rebuild succeeded with **no source changes**.

---

## B. Root Cause Analysis

| Issue | Root Cause | Ownership | Resolution | Status |
|---|---|---|---|---|
| 1 — Incorrect VAT for Saudi patients | UI tax is mapped from API `nationality_fee` (`payment-summary.ts`). Label is always `الضريبة المضافة لغير السعوديين` when fee > 0. Frontend sends `nationality_id` from the selected patient. With Saudi `nationality_id=1`, summary returned `nationality_fee: 0` and UI showed total **300** with no nationality tax line. Historical “45 / لغير السعوديين” for Saudi is consistent with **backend fee calculation** (or a prior request missing/wrong nationality), not a frontend override bug. | Backend (fee authority) + Frontend (pass-through display) | No frontend VAT override. Verified correct Saudi payload/summary. Document contract below. | **Verified OK** for Saudi in this run |
| 2 — Proceed without doctor | Step 2 allowed progression with empty doctor list / no selection; specialty change could leave stale doctor. | Frontend | Clear incompatible doctor; disable Next when empty/no doctor; validate category match; empty-state CTA. | **Fixed** |
| 3 — `/default-doctor.png` 404 | Fallback path pointed at a missing public asset. | Frontend | Use existing `/assets/images/doctorMale.webp` / `doctorFemale.webp`. | **Fixed** |
| 4 — Floating widgets overlap Next | Contact FABs sat on the sticky booking nav Next control. Next.js issues badge is **dev-only**. Sticky nav can still cover lower content until scrolled (expected sticky chrome). | Frontend (prod FABs) / Dev overlay separate | Lift FABs on booking routes (`bottom-28` / `sm:bottom-32`); nav `pe-*` padding so Next remains clickable. | **Fixed** (prod FABs) |
| 5 — Confirmation specialty `doloremque` | `useLocalStorage` deserialize **forced `selectedCategory: null`** on every hydrate while keeping `selectedDoctor`. Confirmation fell back to seeded `doctor.specialist` (`doloremque`). Also caused `POST /reservations` **422** (`category_id` required). | Frontend (+ bad seed data on doctor) | Preserve category/service on hydrate; validate category before create; `resolveBookingSpecialtyLabel()` prefers selected category. | **Fixed** |
| 6 — Maps infinite loading | Script load used `onload` only; failures left spinner forever. | Frontend | `onerror` → localized error + retry + manual entry; keep modal usable. | **Fixed** |

---

## C. Code Changes

| File | Why |
|---|---|
| `src/Hooks/use-local-storage.ts` | SSR-safe hydrate (preserve prior fix). |
| `src/lib/public-payload.ts` | Keep status for country Published filter (preserve prior fix). |
| `src/app/.../location-picker-modal.tsx` | Country/city Published null-safety; `citiesData`; map error/retry/manual. |
| `src/app/.../booking-flow.tsx` | Doctor/category validation; preserve `selectedCategory`/`selectedService` on deserialize; require category/service before reservation create; pass `citiesData`. |
| `src/app/.../step2-doctor-selection.tsx` | Clear doctor on specialty change; Next disabled when empty; image fallbacks. |
| `src/app/.../doctor-profile-modal.tsx` | Doctor image fallbacks. |
| `src/app/.../step4-patient-info.tsx` | Specialty label via `resolveBookingSpecialtyLabel`. |
| `src/app/.../step6-confirmation.tsx` | Confirmation + PDF specialty via helper (no faker fallback). |
| `src/lib/resolve-booking-specialty.ts` | Shared specialty display resolution. |
| `src/lib/doctor-matches-category.ts` | Category/doctor membership checks. |
| `src/components/FloatingContact.tsx` | Raise FABs on booking routes. |
| `src/app/.../booking-step-nav.tsx` | End padding so Next stays clear of FABs. |

---

## D. Browser Test Results

| Test Scenario | Result | Evidence |
|---|---|---|
| **A — Standard cash booking** | **PASS** | Specialty `العلاج الطبيعي العام` (id 21) → doctor `عثمان المقتسم` → location/date restored → Saudi patient `اختبار سعودي QA` → Cash → confirmation **HH-2996**, `paymentStatus: cash_pending`. `POST .../payment/cash/pay` → 200. |
| **B — Doctor validation** | **PASS** | Specialty `العلاج العام` → `(0 طبيب)`, empty copy shown, sticky **التالي** `disabled=true`. Specialty with doctors enables selection. Changing specialty clears incompatible doctor. |
| **C — VAT / payment summary (Saudi)** | **PASS** | Request: `nationality_id: 1`, `guest_info.nationality_id: 1`, `category_id: 21`. `GET .../payment/summary/2996` → `reservation.nationality_fee: 0`, cash method `nationality_fee: 0`, `total: 300`. UI tax `0`; no nationality-tax line on summary. |
| **C — VAT (non-Saudi)** | **PASS** (comparative, no new booking) | Existing HH-2995 reservation GET: `fees: 45.00`, `total_amount: 345.00` vs Saudi HH-2996 `fees: 0.00` / `300.00`. |
| **D — Doctor image fallback** | **PASS** | Doctor cards used `/assets/images/doctorMale.webp` / `doctorFemale.webp`; no broken images in list. `doctorMale.webp` HTTP 200. App no longer references `/default-doctor.png` for booking cards. |
| **E — Responsive nav / FAB** | **PASS** | Verified at 1440 / 768 / 390 / 320: `overflowX=0`; FABs do not hit-test overlap Next (390px gap ≈42px). Modal/drawer overlays can cover Next while open (expected). |
| **F — Location modal** | **PASS** | Forced Maps SDK block showed localized error + retry + manual entry; success path loaded `google.maps` + map canvas after unblock. |
| **G — Confirmation integrity** | **PASS** | HH-2996 shows specialty **العلاج الطبيعي العام** (not `doloremque`), doctor عثمان المقتسم, patient اختبار سعودي QA, cash pending, totals 300/300. |

### Created test bookings

| Reference | Notes |
|---|---|
| HH-2995 | Prior successful cash booking (context) |
| HH-2996 | This session — Saudi cash E2E after fixes |

---

## E. Backend Requirements

### Issue 1 — Nationality fee contract (verified)

- **Create reservation:** `POST /api/client/reservations`  
  - Relevant body (sanitized): `nationality_id`, `guest_info.nationality_id` / `guest_nationality_id`, `category_id` (required when `service_id` absent), `doctor_id`, dates, guest demographics.  
  - Observed Saudi success: `nationality_id: 1`, `category_id: 21` → **200**, reservation id **2996**.
- **Payment summary:** `GET /api/client/payment/summary/{reservationId}`  
  - Relevant fields: `data.reservation.nationality_fee`, per-method `nationality_fee` / `fees` / `total`.  
  - Observed Saudi: all `nationality_fee: 0`, cash `total: 300`.
- **Frontend mapping:** `nationality_fee` → `bookingData.pricing.tax`; label `step5.nationalityTax` = “الضريبة المضافة لغير السعوديين” whenever tax is shown.  
- **Why FE must not “fix” VAT:** Fee is authoritative from backend; overriding would hide real pricing errors and diverge from paid totals.

If Saudi patients again receive `nationality_fee > 0` while requests include `nationality_id=1`, treat as **backend defect** and attach the request/response pair above.

### Issue 5 — Seed data (optional cleanup)

- Doctor records may still expose faker `specialist: "doloremque"`. Display now prefers selected category. Backend/data cleanup of seeded specialist strings is optional, not required for booking correctness.

---

## F. Regression Results

| Check | Result |
|---|---|
| TypeScript (`yarn ts`) | **PASS** |
| ESLint (`yarn lint`) | **PASS** (pre-existing warnings only; no new errors) |
| Production build (`yarn build`) | **PASS** after clean `.next` rebuild (concurrent build+dev was the root cause of prior `PageNotFoundError`s). |
| Automated unit/E2E suite | No booking-specific suite invoked beyond `package.json` scripts (`dev`/`build`/`start`/`lint`/`ts`). |
| Browser console / network | Reservation + payment-summary + cash pay **200** for HH-2996. Earlier diagnostic: missing `category_id` → **422** (fixed by preserving category). |
| RTL (ar) | PASS |
| LTR (en) | PASS (`/en/booking`) |
| Responsive | PASS at 1440 / 768 / 390 / 320 |

---

## G. Final Verdict

**PASS** — Frontend fixes for Issues 2–6 verified; Saudi cash booking **HH-2996** succeeded with correct specialty and `nationality_fee: 0`; production build succeeds after clean `.next` recovery; follow-up responsive / EN / Maps-failure / VAT comparative checks are documented in `docs/qa/BOOKING_FINAL_REGRESSION_REPORT.md`.

---

## Appendix — Key API evidence (sanitized)

**POST `/api/client/reservations` (success)**  
- `nationality_id`: 1  
- `category_id`: 21  
- `doctor_id`: 230  
- Guest nationality: سعودي / id 1  

**GET `/api/client/payment/summary/2996`**  
- `reservation.nationality_fee`: 0  
- cash method: `nationality_fee: 0`, `fees: 0`, `total: 300`  

**POST `/api/client/payment/cash/pay`**  
- status 200 — cash selected for reservation 2996  
