# Telr Seamless — Frontend Implementation

**Updated:** 2026-11-17  
**Repo:** Home Healers Website (Next.js)  
**Backend contract source:** `TELR_SEAMLESS_BACKEND_RESPONSE.md` (Laravel `tamara` branch)

---

## Integration readiness report

| Layer | Status |
|---|---|
| **Frontend completed** | Yes — aligned with backend Seamless contract (config, pay+locale+email, 409 resume, verify, SDK candidate URL, HPP fallback). |
| **Backend integrated (API shipped)** | Yes — config / pay / verify implemented behind `TELR_SEAMLESS_ENABLED` (default off). HPP untouched. |
| **Telr confirmation still required** | Yes — Seamless enabled on merchant, production SDK URL, token field, `ivp_framed`, mandatory billing fields. |
| **Real sandbox E2E testing still pending** | Yes — no live Telr test-mode charges from this website workstream. |

---

## Contract alignment (completed this pass)

1. **`locale` on pay** — `POST client/payment/telr/seamless/pay` body includes `locale: "ar" | "en"` so backend return URLs become `FRONTEND_URL/{locale}/{success|failed|canceled}/{ref}`.
2. **`409 payment_in_progress`** — resumes existing `challenge_url` / verify; **does not** start a second Telr order.
3. **`POST client/payment/telr/seamless/verify`** — authoritative verification via `attempt_id` (preferred) or `reservation_id`; polls through pending/`503 payment_status_unavailable`.
4. **`customer_email`** — optional; sent when available from patient/guest context; inline collect on `422` email-required; never invents fake emails; backend does not save to profile.
5. **SDK URL candidate** — default `https://secure.telr.com/jssdk/v2/telr_sdk.js` (Telr sample). Backend `sdk_url` from config overrides. Not treated as Telr-confirmed production URL.

Also:

- Feature enablement prefers **backend config** `enabled` (env fallback only if config API unreachable).
- Success only after verify reports `paid` (never from SDK/token alone).
- Existing HPP `POST client/payment/telr/pay` + fail/canceled HPP retry preserved.

---

## Architecture

```text
Step5 / OfferPaymentPanel
  └─ GET client/payment/telr/seamless/config  (+ methods[])
       └─ TelrSeamlessPanel (Home Healers custom UI — no HPP iframe)
            ├─ Apple Pay button (if methods includes apple_pay + device OK)
            │     → POST client/payment/telr/method/pay { method: apple_pay }
            │     → redirect_url (full page)
            ├─ New Card (if methods includes card)
            │     → telrSdk.init → #telr_frame
            │     → POST .../seamless/pay { card_token, locale, customer_email? }
            │     → challenge #telr_iframe + verify
            └─ Tabby (if methods includes tabby)
                  → POST client/payment/telr/method/pay { method: tabby }
                  → redirect_url (full page)
  └─ Hosted fallback → POST client/payment/telr/pay (HPP) when Seamless card unavailable
```

Backend return flow (not changed in FE): Telr → backend `/telr/seamless/return/...` → verify → break out to website success/failed/canceled.

**Note:** Telr does not expose a browser “list methods” API. `methods` is merchant config returned by backend.

---

## Files touched (alignment pass)

| File | Change |
|---|---|
| `src/lib/telr-seamless/types.ts` | Final statuses + pay/verify request types |
| `src/lib/telr-seamless/config.ts` | Candidate SDK URL; `normalizePayLocale` |
| `src/lib/telr-seamless/parse.ts` | Disabled config, 409/email helpers, verify parse |
| `src/lib/telr-seamless/resolve-config.ts` | Backend `enabled:false` wins over env |
| `src/lib/telr-seamless/index.ts` | Export updates |
| `src/app/api/api.ts` | Pay body locale/email; `verifyTelrSeamlessPayment` |
| `src/lib/payment-api.ts` | Verify extract helper |
| `src/components/payments/TelrSeamlessPanel.tsx` | Full contract behavior |
| `src/app/.../steps/step5-payment.tsx` | Pass patient email |
| `src/components/offers/booking/OfferPaymentPanel.tsx` | Pass customer email |
| `src/components/offers/booking/OfferBookingClient.tsx` | Pass guest email |
| `locales/en/booking.json` / `locales/ar/booking.json` | Email + in-progress copy |
| `docs/TELR_SEAMLESS_FRONTEND_IMPLEMENTATION.md` | This update |

---

## Completed functionality

- [x] Locale on Seamless pay requests
- [x] Localized return URL expectation documented / backend-driven
- [x] 409 in-progress → resume challenge / verify only
- [x] Authoritative verify endpoint integration
- [x] Optional customer email + 422 email UI
- [x] Candidate SDK URL with backend override
- [x] Respect backend `TELR_SEAMLESS_ENABLED` via config
- [x] No frontend-only “paid”
- [x] HPP fallback preserved
- [x] EN/AR strings

---

## Backend-blocked / external

- [ ] Telr confirms Seamless on merchant account
- [ ] Telr confirms production SDK URL (candidate may change)
- [ ] Telr confirms token field / framed / billing requirements
- [ ] Staging: `TELR_SEAMLESS_ENABLED=true` + website flag/config
- [ ] Sandbox E2E: success, decline, 3DS, cancel, refresh, duplicate submit
- [ ] Live cutover

---

## Tests performed

| Check | Result |
|---|---|
| `npm run ts` | Pass |
| `npm run lint` | Pass (existing repo warnings only) |
| `npm run build` | Pass |
| `node scripts/telr-seamless-parse-smoke.mjs` | Pass (disabled config, pay, 409, verify, SDK candidate) |
| Unit test runner for payment flows | **N/A** — repo has no Jest/Vitest suite |
| Real Telr sandbox charge | **Not run** (blocked + disallowed for production cards) |
| HPP code path still present | Pass |

---

## Known limitations

1. Challenge completion often relies on backend top-level breakout; panel also polls verify while the iframe is open.
2. Fail/canceled pages still retry via **HPP** only.
3. `#telr_frame` / `#telr_iframe` IDs are global (Telr sample).
4. Without backend flag on, Seamless UI stays off (config `enabled: false`).
