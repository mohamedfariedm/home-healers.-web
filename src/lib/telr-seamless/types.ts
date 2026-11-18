/**
 * Telr Seamless contracts aligned with backend response
 * (`TELR_SEAMLESS_BACKEND_RESPONSE.md` / `docs/telr-seamless-website-api.md`).
 */

export type TelrSeamlessPaymentStatus =
  | "created"
  | "processing"
  | "challenge_required"
  | "abandoned"
  | "paid"
  | "failed"
  | "cancelled"
  | "declined"
  | "expired_unused";

/**
 * Telr checkout channel identifiers used by the website.
 * UI visibility is frontend-owned (`payment-methods.ts`), not this list.
 */
export type TelrCheckoutMethod = "card" | "tabby" | "apple_pay";

/** GET client/payment/telr/seamless/config (public) — Card Seamless only */
export type TelrSeamlessConfig = {
  enabled: boolean;
  store_id: string;
  currency: string;
  test_mode: boolean;
  /** Backend may return the Telr-hosted script URL once confirmed */
  sdk_url?: string | null;
  /**
   * Optional / ignored for UI visibility.
   * Backend does not discover Telr merchant methods; website uses
   * `getTelrHybridPaymentMethods()` instead.
   */
  methods?: TelrCheckoutMethod[];
};

/** POST client/payment/telr/method/pay — Tabby hosted session (backend: tabby only) */
export type TelrMethodPayRequest = {
  reservation_id: number;
  method: "tabby";
  locale?: "ar" | "en";
};

export type TelrMethodPayData = {
  redirect_url: string;
  attempt_id?: number | null;
  payment_id?: string | null;
  payment_status?: TelrSeamlessPaymentStatus | string | null;
  amount?: number | null;
  currency?: string | null;
  payment_mode?: string | null;
  reused?: boolean;
  expires_at?: string | null;
  message?: string | null;
  error?: string | null;
};

/** POST client/payment/telr/seamless/pay request body */
export type TelrSeamlessPayRequest = {
  reservation_id: number;
  card_token: string;
  /** Sent so return URLs include `/{locale}/success|failed|canceled/...` */
  locale?: "ar" | "en";
  /**
   * Only used by backend when the client profile has no email.
   * Does not update the profile.
   */
  customer_email?: string;
};

/** POST client/payment/telr/seamless/pay success / 409 data */
export type TelrSeamlessPayData = {
  payment_id?: string | null;
  attempt_id?: number | null;
  payment_status: TelrSeamlessPaymentStatus | string;
  challenge_url?: string | null;
  amount?: number | null;
  currency?: string | null;
  final?: boolean;
  retry_allowed?: boolean;
  message?: string | null;
  error?: string | null;
};

export type TelrSeamlessPayResponse = {
  status: boolean;
  message?: string;
  data?: TelrSeamlessPayData | null;
};

/** POST client/payment/telr/seamless/verify */
export type TelrSeamlessVerifyRequest = {
  attempt_id?: number;
  reservation_id?: number;
};

export type TelrSeamlessVerifyData = {
  attempt_id?: number | null;
  payment_status: TelrSeamlessPaymentStatus | string;
  final?: boolean;
  retry_allowed?: boolean;
  payable_id?: string | number | null;
  payment_id?: string | null;
  challenge_url?: string | null;
  message?: string | null;
  error?: string | null;
};

export type TelrSeamlessPanelState =
  | "idle"
  | "loading_config"
  | "loading_sdk"
  | "ready"
  | "processing"
  | "challenge"
  | "verifying"
  | "paid"
  | "failed"
  | "cancelled"
  | "unavailable";

export type TelrSdkAppearance = {
  labels?: 0 | 1;
  logos?: 0 | 1;
  borders?: 0 | 1;
  dropdowns?: 0 | 1;
};

export type TelrSdkInitParams = {
  store_id: string | number;
  currency: string;
  test_mode: 0 | 1;
  appearance?: TelrSdkAppearance;
  callback: (token: string) => void;
};

export type TelrSdkGlobal = {
  init: (params: TelrSdkInitParams) => void;
};

declare global {
  interface Window {
    telrSdk?: TelrSdkGlobal;
  }
}

export {};
