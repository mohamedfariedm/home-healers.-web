# Tamara (Buy Now Pay Later) — Website Integration Handoff

**Audience:** Website (Next.js) developer
**Backend:** Home Healers API (`https://backend.home-healers.com/api`, dev: `https://development.home-healers.com/api`)
**Scope:** Reservation payments only (Tamara for wallet top-up and the market is not exposed to the website).
**Status:** Backend implemented and covered by automated tests with Tamara mocked. Not yet exercised end to end from the website. Test it in the Tamara **sandbox** first.

The backend is the single source of truth. Never treat "the customer came back from Tamara" as paid — always confirm with `verify` (or the reservation's `payment_status`).

## 1. What the customer experiences

1. The customer reaches the payment step (Step 5 / offer checkout) and picks **Tamara**.
2. The website asks the backend for a checkout session and gets a `checkout_url`.
3. The website does a **full-page redirect** to `checkout_url` (Tamara's hosted page; no iframe, no SDK).
4. The customer completes (or abandons) the payment on Tamara.
5. Tamara sends the customer to the **backend** (`/tamara/return/...`). The backend re-checks the order with Tamara, updates the reservation, then **redirects the browser to your existing result pages**.
6. Your result page confirms the final state and shows success / failed / canceled.

## 2. No login required

Like `payment/cash/pay` and `payment/wallet/pay`, the Tamara routes below are **public**: the backend resolves the customer from `reservation_id`. Do **not** send an `Authorization` header unless the customer really has a client token (if one is sent, the backend also enforces that the reservation belongs to that client → `404` otherwise). The website can only use `method: "web"`.

Base: `{API}/client` (e.g. `https://backend.home-healers.com/api/client`).

## 3. Endpoints

### 3.1 Is Tamara available? — `GET payment/tamara/config`

Public, no secrets. Tamara is controlled by the admin dashboard toggle plus the server configuration.

```json
{ "status": true, "data": { "enabled": true, "currency": "SAR", "country_code": "SA",
                            "payment_type": "PAY_BY_INSTALMENTS", "instalments": null, "test_mode": true } }
```

`enabled: false` → hide Tamara. (`test_mode: true` means the backend points to Tamara's sandbox.)

### 3.2 Price per method — `GET payment/summary/{reservationId}` (existing endpoint)

When Tamara is enabled, `data.methods` contains an item with `"type": "tamara"`:

```json
{ "type": "tamara", "discount": 0, "coupon_discount": 0, "nationality_fee": 0, "fees": 5, "total": 105, "available": true, "insufficient_balance": false }
```

- Show Tamara with **its own `total`** (each method has a different total).
- If the item is missing, Tamara is off. If `available: false`, hide or disable it.
- The name and logo are yours; the backend does not send them.

### 3.3 Start the payment — `POST payment/tamara/pay`

```json
{ "reservation_id": 2968, "method": "web", "locale": "ar", "customer_email": "optional@example.com" }
```

- `method`: always `"web"`.
- `locale` (optional, `ar` | `en`): if sent, the customer is returned to `/{locale}/success|failed|canceled/...`. If omitted, the URL has **no locale prefix** (same as the Telr HPP return today).
- `customer_email` (optional): only used if the customer profile has no email; the profile is never modified.
- **Never send an amount.** The backend computes it from the reservation (same total shown by `payment/summary`).

Success `200`:

```json
{ "status": true, "message": "Payment session created successfully",
  "data": { "attempt_id": 17, "payment_provider": "tamara",
            "checkout_url": "https://checkout-sandbox.tamara.co/checkout/xxxx",
            "tamara_order_id": "uuid", "amount": 105, "currency": "SAR",
            "expires_at": "2026-11-18T12:30:00+00:00", "payment_status": "created" } }
```

→ Save `reservation_id` (and `attempt_id`) in the page state / storage, then `window.location.assign(data.checkout_url)`.

Calling it again within 30 minutes for the same reservation and amount returns the **same session** (safe to retry on double clicks). The session expires after 30 minutes.

Errors:

| HTTP | Meaning | What to do |
|---|---|---|
| 401 | `method` is not `web`, or a non-client token was sent | Fix the request |
| 404 | Reservation not found (or not owned by the token's client) | Generic error |
| 409 | `data.error = payment_in_progress` — a different live session exists | Call `verify`; if not final show "a payment is in progress, try again shortly" |
| 422 | Tamara disabled, reservation already paid / not payable, or Tamara rejected the order (`data.error = tamara_rejected`, typically amount outside Tamara's limits or an unsupported phone number) | Show `message`; for `tamara_rejected` suggest another payment method |
| 503 | `data.error = tamara_unavailable` | "Tamara is temporarily unavailable", suggest another method |
| 500 | Unexpected | Generic error |

### 3.4 Confirm the result — `POST payment/tamara/verify`

```json
{ "reservation_id": 2968 }
```

`attempt_id` is optional (it only narrows within that reservation). `reservation_id` is **required** for guests.

```json
{ "status": true, "data": { "attempt_id": 17, "payment_provider": "tamara", "payment_status": "paid",
                            "final": true, "reservation_id": "2968", "needs_review": false } }
```

| `payment_status` | Meaning | UI |
|---|---|---|
| `paid` | Paid and confirmed | Success page |
| `created` | Customer has not finished yet (or confirmation not received yet) | Keep waiting / poll |
| `approved` | Tamara approved, backend is completing the authorisation | Poll |
| `failed` | Tamara declined | Failed page; offer another method |
| `cancelled` | Customer cancelled | Back to payment step |
| `expired` | Session expired | Back to payment step; paying again creates a new session |

`final: true` means the state will not change again (`paid`, `failed`, `cancelled`, `expired`). `needs_review: true` only means the admins will look at it (e.g. a duplicate payment); if `paid`, show a normal success.

Errors: `503 payment_status_unavailable` (Tamara unreachable; the status is unchanged — retry in a few seconds, do not show "failed"), `404` (no attempt for that reservation), `422` (missing `reservation_id`).

## 4. Where the customer lands after Tamara

The backend redirects the browser to:

`{FRONTEND_URL}[/{locale}]/{success|failed|canceled}/{orderRef}`

- `orderRef` is the **Tamara order id** (also stored on the reservation as `transaction_reference`, exactly like the Telr order ref).
- The result is decided by the backend after asking Tamara. The URL path the customer used is only a hint.
- Anything not confirmed paid yet is reported as `failed`, but it **can still turn into paid** a few seconds later (webhook / reconciliation). Therefore:
  - On `/failed/{ref}` **do not trust the page blindly**: call `verify` (or `GET client/reservations/{id}`) once or twice before showing a final failure; if `payment_status` is `paid`, show success.
  - On `/success/{ref}` poll `verify` / `GET client/reservations/{id}` every 2–3 s for up to ~30 s until `paid` (same pattern as Telr). If it is still not paid after the timeout, show "We are confirming your payment" instead of failure.
- `FRONTEND_URL` is a single backend setting (production/dev site). A website running on `localhost` will be redirected to that configured URL, not to localhost.

## 5. Recommended website flow (pseudo)

```ts
// 1. on payment step
const cfg = await api.get('/client/payment/tamara/config');      // show Tamara only if cfg.data.enabled
const summary = await api.get(`/client/payment/summary/${id}`);  // methods[type=tamara].total / available

// 2. on "Pay with Tamara"
const r = await api.post('/client/payment/tamara/pay', { reservation_id: id, method: 'web', locale });
localStorage.setItem('pendingPayment', JSON.stringify({ reservationId: id, provider: 'tamara' }));
window.location.assign(r.data.checkout_url);

// 3. on /success/:ref and /failed/:ref
const v = await api.post('/client/payment/tamara/verify', { reservation_id: id });
// paid → success; created/approved → poll; failed/cancelled/expired → failed/retry
```

If the customer closes Tamara's page and comes back to the site by themselves, call `verify` with the stored `reservation_id` before letting them pay again.

## 6. Important rules

- Never mark a payment as successful from the redirect alone; use `verify` or the reservation `payment_status`.
- Never send or trust an amount from the browser.
- Do not keep a `checkout_url` for more than 30 minutes; call `pay` again.
- Do not call `pay` again once the reservation is `paid`.
- Tamara is for reservations only (not wallet/market) on the website.
- Do not send `sdk_supported` (that is a Telr mobile option).

## 7. Backend / ops prerequisites (not the website's job, but needed before testing)

1. Server `.env`: `TAMARA_BASE_URL` (sandbox `https://api-sandbox.tamara.co`, production `https://api.tamara.co`), `TAMARA_API_TOKEN`, `TAMARA_NOTIFICATION_TOKEN`, `TAMARA_CURRENCY=SAR`, `TAMARA_COUNTRY_CODE=SA`, and **`TAMARA_RETURN_BASE_URL` = the public https URL of the backend** (Tamara must be able to redirect the customer's browser to it). Then `php artisan config:clear`.
2. In the admin dashboard enable **Tamara** in the available payment methods (it is off by default).
3. In the Tamara merchant portal set the webhook to `POST {backend}/api/payments/tamara/webhook` (the backend validates Tamara's token and only uses it to trigger a re-check).
4. `FRONTEND_URL` must point to the website that hosts the `/success`, `/failed`, `/canceled` pages.
5. The server must run `schedule:run` (Tamara reconciliation/capture retries).

## 8. Sandbox testing

On Tamara's sandbox checkout page:

- Phone: `+966` followed by 9 digits starting with 5. Pick a random number; avoid numbers starting with `52`, `500000000` and `512345678`.
- Decline test phone: `536422337` (should end as `failed`).
- The OTP is shown on the page; use Tamara's "Testing Cards" for card steps.

Test at least: success, decline, customer cancel, and closing the tab without returning (then `verify`). Tamara may reject amounts outside its merchant limits (`422 tamara_rejected`) — try a normal amount.

## 9. Quick reference

| What | Method & path |
|---|---|
| Availability | `GET /api/client/payment/tamara/config` |
| Price/availability per method | `GET /api/client/payment/summary/{reservationId}` |
| Start | `POST /api/client/payment/tamara/pay` |
| Confirm | `POST /api/client/payment/tamara/verify` |
| Return (browser, backend) | `GET {backend}/tamara/return/{success|failure|cancel}?attempt=..&channel=web[&locale=..]` → redirects to the website |
