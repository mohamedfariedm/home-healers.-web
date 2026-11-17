# Telr Seamless — Backend Requirements (Handoff)

**Audience:** Backend developers for Home Healers API (`backend.home-healers.com`)  
**Frontend repo:** Home Healers Website (Next.js)  
**Status:** Frontend prepared against **PROPOSED** contracts. Do not treat proposed schemas as live until implemented and verified.

---

## A. Current Backend Integration (verified from website)

### A.1 Hosted Payment Page (HPP) — live today

| Item | Value |
|---|---|
| Method / path | `POST /api/client/payment/telr/pay` |
| Auth | Client session / token as used by other `client/payment/*` routes |
| Body | `{ "reservation_id": <number>, "method": "web" }` |
| Success | Response includes `data.redirect_url` (or top-level `redirect_url`) |
| Frontend action | Full-page navigate to Telr HPP |
| Soft verify | `GET /api/client/reservations/{id}` → `payment_status === "paid"` on success page |

Related (unchanged):

- `GET /api/client/payment/summary/{reservationId}`
- `POST /api/client/payment/cash/pay`
- `POST /api/client/payment/wallet/pay`

### A.2 Limitations of HPP for the new product goal

- Customer leaves `home-healers.com` for Telr’s hosted page.
- Website cannot render a branded in-page card form with HPP alone.
- Seamless (token + server order) is a **different** Telr product path from HPP. Do not assume the same create-order payload.

### A.3 Website return routes (already exist)

After Telr finishes (HPP or framed challenge), customers land on:

- `/{locale}/success/{orderRef}`
- `/{locale}/failed/{orderRef}`
- `/{locale}/canceled/{orderRef}`

Success page re-checks reservation `payment_status` via `GET client/reservations/{id}`.

---

## B. Required Backend Changes

### B.1 Merchant / Telr account (external)

**Mandatory**

1. Confirm Telr Seamless / Transparent JS SDK is enabled for the Home Healers store.
2. Confirm store credentials for the correct currency (**SAR expected** for KSA). Telr often issues **one store per currency**.
3. Obtain:
   - `store_id` (public — safe to expose to frontend)
   - `auth_key` / API key (**server-only secret**)
4. Confirm test vs live mode flags with Telr.

**Conditional**

- Separate test store credentials for sandbox.
- Exact production URL of the Seamless JS SDK script (must be loaded from Telr servers; frontend uses env `NEXT_PUBLIC_TELR_SDK_URL` until backend returns `sdk_url`).

### B.2 Credential handling

**Mandatory**

- Store Telr `auth_key` only in backend env / secrets manager.
- Never return `auth_key` from any API.
- Never accept client-supplied auth keys.
- Frontend may receive only: `store_id`, `currency`, `test_mode`, optional `sdk_url`, `enabled`.

### B.3 New APIs (PROPOSED)

Implement the endpoints in section C. Until they exist, the website keeps using HPP.

### B.4 Server-side charge (Telr order API)

**Mandatory** — based on Telr’s official Seamless sample (`process.php`):

1. Accept `card_token` from the website (token from `telrSdk` callback).
2. Create order server-side against Telr:

   - URL used in sample: `https://secure.telr.com/gateway/order.json`
   - Include store id + auth key
   - Include amount, currency, cart id, description, billing fields as required by Telr
   - Include card token field used by Seamless sample: `card_token`  
     (**CONFIRMATION NEEDED:** sample JS comments mention `ivp_ctoken`; PHP sample posts `card_token`. Align with Telr support.)
   - Use framed mode suitable for on-page challenge iframe (sample uses `ivp_framed: 2`)
   - Set `return_auth` / `return_can` / `return_decl` to website success / canceled / failed URLs (or backend callbacks that redirect there)

3. Persist Telr `order.ref` against the reservation / payment attempt.
4. Return `order.url` to the frontend as `challenge_url` (aliases `redirect_link` accepted by frontend parser).

### B.5 Reservation / payment association

**Mandatory**

- Bind every Seamless attempt to `reservation_id` owned by the authenticated client.
- Persist: attempt id, Telr order ref, amount, currency, status, timestamps.
- Update reservation `payment_status` only from verified Telr/check/webhook results — never from a client “I succeeded” claim.

### B.6 Payment status verification

**Mandatory**

- After challenge / return, confirm with Telr order check (sample uses `ivp_method=check` against `order.json`) and/or verified webhook.
- Expose final state via existing reservation resource (`payment_status`) at minimum.
- Optional dedicated verify endpoint (see C.3).

### B.7 3-D Secure / framed challenge

**Mandatory**

- When Telr returns an `order.url`, treat payment as **not final**.
- Frontend loads URL in an on-page iframe (`#telr_iframe`).
- Return URLs must eventually land on website success/failed/canceled (top navigation allowed via iframe sandbox).
- Backend must still verify before marking paid.

### B.8 Idempotency & duplicate-charge prevention

**Mandatory**

- Reject a second Seamless pay for the same reservation while status is `processing` / challenge in flight (recommend HTTP `409` with current `attempt_id`).
- Idempotency key options: reservation id + attempt id, or client-supplied idempotency key.
- Do not create a new Telr order if a non-final attempt already exists — return existing challenge URL or instruct client to verify.

### B.9 Cancellation, decline, retry

**Mandatory**

- Declined / cancelled / expired attempts marked terminal with `retry_allowed: true` when a new pay is safe.
- Retry creates a **new** attempt only when previous is final or abandoned per rules.

### B.10 Webhooks / callbacks

**Conditional but strongly recommended**

- If Telr provides webhook/IPN for the store, verify signature/auth and update payment status asynchronously.
- Handle “payment succeeded but browser closed” via webhook + reservation poll.

### B.11 Environment variables (backend)

| Variable | Secret? | Purpose |
|---|---|---|
| `TELR_STORE_ID` | No (public) | Store id for SAR (or map by currency) |
| `TELR_AUTH_KEY` | **Yes** | Server-only Telr auth |
| `TELR_TEST_MODE` | No | `1` / `0` |
| `TELR_SEAMLESS_ENABLED` | No | Feature flag |
| `TELR_SDK_URL` | No | Optional; return to frontend if known |
| `TELR_CURRENCY` | No | Default `SAR` |
| Website base URL(s) | No | Build return_auth / return_decl / return_can |

### B.12 Security / PCI

**Mandatory**

- Never log full card data, raw tokens longer than needed, or auth keys.
- Never ask the website to collect PAN/CVV in first-party inputs.
- HTTPS only.
- Validate reservation ownership on every pay/verify.

---

## C. API Contract Specifications (PROPOSED)

> All endpoints below are **PROPOSED**. Paths follow existing `client/payment/telr/*` naming. Adjust if your router conventions differ, but keep the website client updated.

Base: `{API}/client/...` (website uses `NEXT_PUBLIC_API_URL`, currently `https://backend.home-healers.com/api`).

### C.1 Get Seamless config

| | |
|---|---|
| Method | `GET` |
| Path | `client/payment/telr/seamless/config` |
| Auth | Same as other client payment reads (or public read-only store config) |
| Purpose | Tell frontend whether Seamless is on and how to init `telrSdk` |

**Success example**

```json
{
  "status": true,
  "data": {
    "enabled": true,
    "store_id": "12345",
    "currency": "SAR",
    "test_mode": true,
    "sdk_url": null
  }
}
```

**Validation / rules**

- If Seamless disabled: `{ "enabled": false, ... }` or `enabled: false` with empty store.
- Never include auth key.

**Frontend usage**

- Website calls this before mounting Telr fields.
- Falls back to `NEXT_PUBLIC_TELR_*` env only for local/dev UI work.

---

### C.2 Seamless pay (token charge)

| | |
|---|---|
| Method | `POST` |
| Path | `client/payment/telr/seamless/pay` |
| Auth | Required (client must own reservation) |
| Purpose | Create Telr order with card token; return challenge URL and/or status |

**Request**

```json
{
  "reservation_id": 456,
  "card_token": "<token from telrSdk callback>"
}
```

**Validation**

- `reservation_id` required, owned by client, payable.
- `card_token` required, non-empty string, max length per Telr.
- Amount/currency taken from authoritative reservation/payment summary — **do not trust client amount**.

**Success — challenge required**

```json
{
  "status": true,
  "message": "Payment challenge required",
  "data": {
    "payment_id": "<telr order ref>",
    "attempt_id": 789,
    "payment_status": "challenge_required",
    "challenge_url": "https://secure.telr.com/gateway/...",
    "amount": 93,
    "currency": "SAR",
    "final": false,
    "retry_allowed": false
  }
}
```

Frontend also accepts aliases: `redirect_link`, `redirect_url` for the challenge URL.

**Success — already paid (rare if 3DS skipped)**

```json
{
  "status": true,
  "data": {
    "payment_id": "<telr order ref>",
    "attempt_id": 789,
    "payment_status": "paid",
    "challenge_url": null,
    "final": true,
    "retry_allowed": false
  }
}
```

**Error examples**

`409` payment in progress:

```json
{
  "status": false,
  "message": "Payment already in progress",
  "data": {
    "error": "payment_in_progress",
    "attempt_id": 789,
    "payment_status": "processing",
    "challenge_url": "https://secure.telr.com/gateway/..."
  }
}
```

`404` reservation not found / not owned  
`422` validation  
`503` Telr unreachable  

**Frontend usage**

- `ClientAPI.payReservationWithTelrSeamless(reservationId, cardToken, locale)`
- On `challenge_url` → load iframe; then verify via reservation GET.
- Never treat token callback alone as paid.

---

### C.3 Optional verify endpoint

| | |
|---|---|
| Method | `POST` |
| Path | `client/payment/telr/seamless/verify` **or** reuse `client/payment/telr/verify` |
| Auth | Required |
| Body | `{ "attempt_id": 789 }` or `{ "reservation_id": 456 }` |

**Success**

```json
{
  "status": true,
  "data": {
    "attempt_id": 789,
    "payment_status": "paid",
    "final": true,
    "retry_allowed": false,
    "payable_id": "456"
  }
}
```

Until this exists, frontend polls `GET client/reservations/{id}`.

---

### C.4 Keep HPP endpoint

Do **not** remove or break `POST client/payment/telr/pay` with `method: "web"`. Website uses it as fallback and for fail/canceled retry.

---

## D. Complete Payment Lifecycle (target)

1. Customer completes booking → reservation created (existing).
2. Customer selects card pay on website Step 5 / offer checkout.
3. Frontend `GET .../seamless/config` (or env fallback in dev).
4. Frontend loads Telr JSSDK from Telr servers; `telrSdk.init({ store_id, currency, test_mode, appearance, callback })` into `#telr_frame`.
5. Telr tokenizes card → callback gives `card_token` (not logged).
6. Frontend `POST .../seamless/pay` with `reservation_id` + `card_token`.
7. Backend creates Telr order with auth key + token; persists attempt; returns `challenge_url` and/or status.
8. If challenge URL present, frontend shows it in `#telr_iframe` (framed / 3DS).
9. Customer completes or abandons challenge; Telr hits return URLs / webhooks.
10. Backend verifies with Telr and sets reservation `payment_status`.
11. Frontend confirms via reservation GET (or verify API) and shows success/failure.
12. **Source of truth is always backend payment status.**

```text
Booking → Config → telrSdk token → POST seamless/pay → [iframe challenge]
       → Telr return/webhook → Backend status → Frontend verify → UI
```

---

## E. Edge Cases

| Case | Expected backend behavior | Frontend behavior |
|---|---|---|
| Declined card | Final failed/declined; `retry_allowed: true` | Show error; allow retry / HPP fallback |
| Invalid / expired card | Telr error mapped to 422/failed | Show message; allow retry |
| 3DS failure | Final failed; retry allowed | Failed UI |
| 3DS cancel | Cancelled; retry allowed | Cancelled / retry |
| Network timeout to Telr | 503; do not mark paid; keep attempt processing or abandoned per policy | Keep UI; retry verify; no second charge while processing |
| Duplicate pay click | 409 `payment_in_progress` + existing attempt | Do not start new pay; resume challenge/verify |
| Browser refresh mid-challenge | Attempt remains non-final; client can re-fetch challenge or verify | Persist `reservationId` (+ `attempt_id` if returned) |
| Paid but FE disconnect | Webhook/check marks paid | Success page / poll eventually sees paid |
| Delayed Telr confirmation | `processing` until check says authorised | “Verifying…” + poll |
| Reservation expired / not payable | 422/409 with clear error | Stop; do not charge |
| Uncertain result after error | Leave processing; expose verify | Soft retry verify only; no new pay until `retry_allowed` |

---

## F. Backend Acceptance Criteria

- [ ] Seamless feature flag can enable/disable without breaking HPP.
- [ ] Config endpoint returns store_id/currency/test_mode without secrets.
- [ ] Pay endpoint charges only with server-side Telr credentials + client token.
- [ ] Amount comes from reservation/summary, not client body.
- [ ] Order ref / attempt persisted and linked to reservation.
- [ ] Challenge URL returned when Telr requires framed/3DS step.
- [ ] Return URLs reach website success/failed/canceled (or API→redirect).
- [ ] Reservation `payment_status` becomes `paid` only after Telr confirmation.
- [ ] Duplicate in-flight pays return 409 and do not double-charge.
- [ ] Declined/cancelled allow safe retry.
- [ ] HPP `POST client/payment/telr/pay` still works.
- [ ] Logs never contain PAN, CVV, auth_key, or long-lived raw tokens.
- [ ] Tested in Telr **test mode** for: success, decline, 3DS challenge, cancel, refresh, duplicate submit.
- [ ] Live mode verified with Telr before production cutover.

---

## G. Backend Questions / External Dependencies

Mark these as blocking until answered:

1. **Is Seamless enabled** on the Home Healers Telr merchant account?
2. **Exact JSSDK script URL** for production (docs require loading from Telr servers)?
3. Token field name for order create: **`card_token` vs `ivp_ctoken`** (sample inconsistency)?
4. Confirm **SAR store_id** and whether multi-currency stores exist.
5. Preferred framed value: sample uses **`ivp_framed: 2`** — OK for iframe + breakout?
6. Do you already have Telr **webhook/IPN** handlers for HPP that Seamless can reuse?
7. Should Seamless reuse payment attempt tables from the Flutter/mobile Telr work (`attempt_id`), or a new table?
8. Auth model for website pay calls: same Sanctum/client token as other `client/payment/*` mutations?
9. Billing fields required by Telr for Seamless orders — which can be filled from client profile/address?
10. Can config endpoint be shipped before pay endpoint so frontend can soft-launch UI behind flag?

---

## References

- Telr Seamless intro: https://docs.telr.com/reference/jssdk-seamless  
- Official sample: https://github.com/Telr-PG/telr-jssdk-seamless-sample  
- Telr iframe display notes: https://docs.telr.com/reference/iframe-display  
- Website frontend implementation notes: [`docs/TELR_SEAMLESS_FRONTEND_IMPLEMENTATION.md`](./TELR_SEAMLESS_FRONTEND_IMPLEMENTATION.md)
