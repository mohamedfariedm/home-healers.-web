# Telr Hybrid Card + Tabby — Final Backend Handoff

**Audience:** Backend developers (Home Healers Laravel API)  
**Frontend:** Home Healers Website (Next.js)  
**Document date:** 2026-11-18  
**Status:** Frontend hybrid orchestration is complete. Remaining work is backend-owned payment processing for Tabby-via-Telr.

---

## 1. Executive summary

The website offers a **custom Card + Tabby selector**:

| Method | Integration | Frontend status | Backend status |
|---|---|---|---|
| **Card** | Telr Seamless SDK (on-site) | Complete | Existing Seamless APIs (preserve) |
| **Tabby** | Telr Hosted Payment Page, Tabby-only | Complete (initiate → redirect → recover) | **`POST .../telr/method/pay` must be implemented** |

**Critical architecture rule:** The backend **cannot** retrieve enabled payment methods from Telr. The website **does not** require `config.methods`. Method visibility is **frontend-owned**. The backend owns session creation, amounts, verification, idempotency, and reconciliation.

**Previously listed TBY-01 (`methods` on seamless config) is removed.** It is not a backend blocker and must not be implemented as Telr method discovery.

---

## 2. Confirmed merchant / product facts

- Tabby is **activated and working** on the Home Healers Telr merchant account (full hosted checkout already succeeds).
- No customer eligibility APIs or reservation eligibility checks.
- Declines during Telr/Tabby hosted checkout use normal fail / cancel / retry.
- Card Seamless behavior must remain unchanged.
- Tamara is out of scope for this handoff.
- Do not integrate Tabby’s own API. Tabby continues **only through Telr**.
- Tabby does **not** require an iframe; full-page redirect is required.

---

## 3. Final frontend architecture

```text
Booking Step 5 / Offer Checkout (paymentMethod = telr)
  └─ TelrSeamlessPanel
       ├─ Frontend config: getTelrHybridPaymentMethods()
       │     card.enabled  → show Card option
       │     tabby.enabled → show Tabby option (independent of Card SDK)
       ├─ Card (if enabled + Seamless config usable)
       │     → telrSdk → POST .../seamless/pay → 3DS → seamless/verify
       │     → if Seamless unavailable → existing HPP fallback (telr/pay)
       └─ Tabby (if enabled)
             → POST .../telr/method/pay { method: "tabby", locale }
             → persist pendingPayment { provider: telr, method: tabby, attemptId? }
             → redirect to data.redirect_url
             → return /{locale}/success|failed|canceled/{ref}
             → re-check reservation payment_status (never trust URL alone)
```

Tabby remains visible even when Card Seamless `enabled: false` or the SDK fails.

---

## 4. Frontend-owned payment method configuration

**Module:** `src/lib/telr-seamless/payment-methods.ts`

| Flag | Env | Default | Meaning |
|---|---|---|---|
| Card UI | `NEXT_PUBLIC_TELR_CARD_ENABLED` | on | Show Card option |
| Tabby UI | `NEXT_PUBLIC_TELR_TABBY_ENABLED` | on | Show Tabby option |
| Apple Pay UI | `NEXT_PUBLIC_TELR_APPLE_PAY_ENABLED` | off | Optional hosted method |

Set `"false"` / `"0"` to disable a method without code changes.  
Card still requires live Seamless config (`enabled` + `store_id`) to charge via SDK.  
Tabby UI enablement is **not** proof `method/pay` works — failures surface as API errors (no silent switch to another method, no fake success).

**Do not** add backend endpoints for method discovery. **Do not** require `GET .../seamless/config` to return `methods`.

---

## 5. Existing verified backend APIs (frontend call sites)

### 5.1 `GET /api/client/payment/telr/seamless/config`

| | |
|---|---|
| Purpose | Card Seamless store config |
| Call site | `resolveTelrSeamlessConfig` → panel boot |
| Auth | Public / same as other client payment reads |
| Request | none |
| Expected fields | `enabled`, `store_id`, `currency`, `test_mode`, optional `sdk_url` |
| **`methods`** | **Not required. Omission is correct.** |
| Dev probe (2026-11-18) | **Live** — returns enabled store `31787`, SAR, test_mode, sdk_url; no `methods` |
| Frontend change | None for missing `methods` |

### 5.2 `POST /api/client/payment/telr/seamless/pay`

| | |
|---|---|
| Purpose | Charge with card token |
| Call site | `TelrSeamlessPanel` card pay |
| Body | `reservation_id`, `card_token`, `locale`, optional `customer_email` |
| Expected | `payment_status`, optional `challenge_url`, `attempt_id` |
| Errors | `409 payment_in_progress`, `422` email-required, etc. |
| Frontend | Preserve as-is |

### 5.3 `POST /api/client/payment/telr/seamless/verify`

| | |
|---|---|
| Purpose | Authoritative Card Seamless status |
| Call site | Panel after pay / 3DS |
| Body | `attempt_id` and/or `reservation_id` |
| Frontend | Preserve as-is |

### 5.4 `POST /api/client/payment/telr/pay`

| | |
|---|---|
| Purpose | Generic HPP fallback |
| Call site | Hosted fallback / fail-cancel non-Tabby retry |
| Body | `reservation_id`, `method: "web"` |
| Expected | `redirect_url` |
| Frontend | Preserve as-is (not Tabby-only) |

### 5.5 `POST /api/client/payment/telr/method/pay`

| | |
|---|---|
| Purpose | Tabby-only (or Apple Pay) hosted session |
| Call site | Panel Tabby CTA; fail/canceled Tabby retry |
| Body | see TBY-02 |
| Dev probe (2026-11-18) | **404** — Laravel: `The route api/client/payment/telr/method/pay could not be found.` |
| Frontend | Client + UI ready; graceful error if route missing |

### 5.6 `GET /api/client/reservations/{id}`

| | |
|---|---|
| Purpose | Soft verify `payment_status` on return pages |
| Call site | success / fail / canceled (Telr paths) |
| Required for Tabby | Must reflect Tabby-via-Telr paid state after confirmation |

---

## 6. Missing backend capabilities

| ID | Capability | Priority |
|---|---|---|
| **TBY-02** | Implement `method/pay` with Telr `panels: "tabby"` | **Blocker** |
| **TBY-03** | Return `redirect_url` (+ `attempt_id`); localized returns | **Blocker** |
| **TBY-04** | Authoritative paid update for Tabby-via-Telr | **Blocker** |
| **TBY-05** | Idempotency / 409 / already-paid | **Important** |
| **TBY-06** | Reconciliation for delayed / abandoned Tabby | **Important** |

~~TBY-01~~ removed (not a backend requirement).

---

## 7–10. Requirements (contracts, errors, lifecycle)

### TBY-02 — Tabby payment session (Blocker)

| | |
|---|---|
| **Current behavior** | Route **not found** on development API (404). Website client already calls it. |
| **Required change** | Register and implement `POST /api/client/payment/telr/method/pay`. Create Telr order with **Tabby-only** panel. Keep auth key server-side. Amount/currency from reservation. |

**Request (matches website `payReservationWithTelrMethod`)**

```http
POST /api/client/payment/telr/method/pay
Content-Type: application/json
```

```json
{
  "reservation_id": 123,
  "method": "tabby",
  "locale": "ar"
}
```

`method`: `"tabby"` | `"apple_pay"` (website sends `tabby` for Tabby CTA).  
`locale`: `"ar"` | `"en"`.

**Telr order requirement:** `panels: "tabby"` (or Telr’s officially supported equivalent for a Tabby-only hosted page).

**Success response (proposed until verified live)**

```json
{
  "status": true,
  "data": {
    "redirect_url": "https://secure.telr.com/...",
    "attempt_id": 42,
    "payment_status": "processing"
  }
}
```

| Field | Required by FE? |
|---|---|
| `data.redirect_url` | **Yes** (aliases `redirect_link` / `order_url` also parsed) |
| `data.attempt_id` | Strongly preferred (recovery) |
| `data.payment_status` | Optional |

**Error scenarios**

| HTTP | Expected | Frontend |
|---|---|---|
| 404 reservation | Not found | Generic error |
| 404 route | Missing implementation | Surfaces API error (current) |
| 409 + `payment_in_progress` | Active session | Toast in-progress; no second charge |
| 422 | Not payable / validation | Show message |
| 5xx | Upstream failure | Retry / other method |

**Acceptance**

- [ ] Route exists (not 404).
- [ ] Payable reservation returns working `redirect_url`.
- [ ] Session is Tabby-only.
- [ ] Auth key never in response.
- [ ] Existing Seamless + HPP unchanged.

**Frontend dependency:** Tabby CTA cannot complete without this.

---

### TBY-03 — Redirect payload + localized returns (Blocker)

| | |
|---|---|
| **Current behavior** | Website redirects to `redirect_url` and expects return to existing result routes. |
| **Required change** | Always return `redirect_url`; prefer `attempt_id`. Set Telr return URLs using `locale`. |

**Website return routes (exact)**

```text
{FRONTEND_URL}/{locale}/success/{orderRef}
{FRONTEND_URL}/{locale}/failed/{orderRef}
{FRONTEND_URL}/{locale}/canceled/{orderRef}
```

`locale` is `ar` or `en` from the pay request.  
`orderRef` should be the Telr order / transaction reference used elsewhere.

**Acceptance**

- [ ] AR + EN success / failed / canceled land on the website routes above.
- [ ] `redirect_url` is always present on success.

---

### TBY-04 — Authoritative verification (Blocker)

| | |
|---|---|
| **Current behavior** | Success/fail/canceled **never** trust the path alone. Telr returns re-check `GET reservations/{id}` → `payment_status === "paid"`. |
| **Required change** | After Telr confirmation (return handler and/or webhook/check), update reservation to paid **only** when verified. Tabby-via-`method/pay` must use the same authoritative path as HPP. |

**Optional enhancement (not required if reservation status is reliable):** allow Seamless verify (or shared verify) to resolve `method/pay` attempts by `attempt_id` / `reservation_id`.

**Acceptance**

- [ ] Successful Tabby payment → reservation `payment_status: "paid"`.
- [ ] Decline / cancel → remains unpaid.
- [ ] Stale failed URL after late paid → reservation shows paid (website redirects to success).

---

### TBY-05 — Idempotency (Important)

| | |
|---|---|
| **Required change** | Prevent duplicate active Tabby sessions/charges. Reuse session or return `409 payment_in_progress`. Handle already-paid. Allow safe retry after terminal fail/cancel. |

Website: disables double-submit; on 409 shows in-progress; Tabby retry calls `method/pay` again when `pending.method === "tabby"`.

---

### TBY-06 — Reconciliation (Important)

| | |
|---|---|
| **Required change** | Handle delayed Tabby confirmation, abandon, interrupt. Reuse existing Telr webhook/schedule if present. |

**Assumption (verify on backend):** HPP already has Telr return + reconciliation; extend to `method/pay` attempts. Do not claim webhooks exist without backend confirmation — acceptance test must prove delayed Tabby still settles.

---

## 11. Payment lifecycle (Tabby)

1. Customer selects Tabby → Continue.  
2. `POST method/pay`.  
3. Persist `{ reservationId, provider: "telr", method: "tabby", attemptId? }`.  
4. Redirect to `redirect_url`.  
5. Customer completes / cancels / fails on Telr/Tabby.  
6. Backend return → website result page.  
7. Website re-checks reservation (and does not invent paid).  
8. Retry (fail/cancel) → `method/pay` again if pending method is tabby.

---

## 12. Localized return URLs

See TBY-03. Frontend routes already exist under `src/app/[locale]/.../success|failed|canceled`.

---

## 13. Verification rules

- Never mark paid from redirect path alone.  
- Card: `seamless/verify`.  
- Tabby: reservation `payment_status` (minimum).  
- Pending: do not force failed UI until terminal or timeout policy on website.

---

## 14. Idempotency / retry

See TBY-05. Frontend will not create Telr URLs itself and will not expose secrets.

---

## 15. Environment requirements (backend)

| Variable / setting | Notes |
|---|---|
| Telr store + auth key | Server-only |
| Tabby panel enabled on store | Confirmed by merchant |
| `FRONTEND_URL` | Must match website hosting result pages |
| Return URL builder | Must honor `locale` from `method/pay` |

Frontend env (not backend): `NEXT_PUBLIC_TELR_TABBY_ENABLED`, `NEXT_PUBLIC_TELR_CARD_ENABLED`.

---

## 16. Backend test scenarios

1. `method/pay` with valid unpaid reservation → 200 + `redirect_url`.  
2. Open URL → Tabby-only UI (not full multi-method HPP if panels restricted).  
3. Success → reservation paid; website success confirms.  
4. Decline → unpaid; failed page; retry works.  
5. Cancel → unpaid; canceled page; retry works.  
6. Double submit / second pay → reuse or 409.  
7. Already paid → reject new session.  
8. Wrong owner / missing reservation → 404.  
9. AR and EN return URLs.  
10. Abandon mid-flow → reconcile later without false paid.

Use Telr/Tabby **sandbox** only. No real customer charges from this handoff.

---

## 17. Backend acceptance checklist

- [ ] `POST /api/client/payment/telr/method/pay` exists (not route 404).  
- [ ] Tabby session uses `panels: "tabby"` (or official equivalent).  
- [ ] Response includes usable `redirect_url`.  
- [ ] `attempt_id` returned when possible.  
- [ ] Localized returns for ar/en × success/failed/canceled.  
- [ ] Reservation paid only after Telr confirmation.  
- [ ] Idempotency / 409 / already-paid handled.  
- [ ] Delayed confirmation reconciled.  
- [ ] Card Seamless + generic HPP unchanged.  
- [ ] Auth key never returned to browser.  
- [ ] **No** Telr method-discovery API.  
- [ ] **No** requirement to return `config.methods`.  
- [ ] **No** customer eligibility APIs.

---

## 18. Frontend / backend ownership

| Work | Owner | Status |
|---|---|---|
| Independent Card/Tabby UI config | Frontend | **Done** |
| Custom selector + Tabby branding/i18n | Frontend | **Done** |
| Card Seamless SDK / 3DS / verify / email / 409 | Frontend | **Done** |
| Tabby initiate client + redirect + pending state | Frontend | **Done** |
| Fail/cancel Tabby retry | Frontend | **Done** |
| Return pages never trust URL alone | Frontend | **Done** |
| `method/pay` + `panels: tabby` | **Backend** | **Required** |
| Localized Telr returns for method/pay | **Backend** | **Required** |
| Paid / reconcile Tabby-via-Telr | **Backend** | **Required** |
| Idempotent sessions | **Backend** | **Required** |

---

## 19. Remaining uncertainties (verify in acceptance tests)

1. Exact Telr field name/value if not literally `panels: "tabby"` — confirm with Telr docs/support; website only needs a Tabby-restricted hosted URL.  
2. Whether Seamless `verify` can read `method/pay` attempts — optional if reservation status is authoritative.  
3. Whether webhook vs return-only reconciliation is already wired for HPP — extend same path to method/pay.  
4. Dev vs production route deploy lag — re-probe after backend release (404 was observed on development 2026-11-18).

---

## 20. Final implementation checklist (backend cycle)

1. Implement TBY-02 route + Telr Tabby-only order.  
2. Wire TBY-03 returns with locale.  
3. Ensure TBY-04 paid updates for method/pay.  
4. Add TBY-05 idempotency.  
5. Confirm TBY-06 reconciliation.  
6. Run section 16 scenarios in sandbox.  
7. Notify frontend to re-probe `method/pay` (expect 200/4xx validation — not route 404).  
8. Do **not** spend time on `config.methods` or eligibility APIs.

---

## Explicitly out of scope

- Telr payment-method discovery  
- Backend `config.methods`  
- Customer / reservation eligibility  
- Direct Tabby API  
- Tabby iframe  
- Changing Card Seamless or Tamara contracts  
- Inventing alternate endpoints when `method/pay` is the agreed path  
