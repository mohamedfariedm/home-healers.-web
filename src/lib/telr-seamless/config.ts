import type { TelrSeamlessConfig } from "./types";

/**
 * Public env used only as a local/dev fallback when the Card Seamless
 * config API is unreachable. Never put Telr auth keys here.
 *
 * Method visibility (Card / Tabby / Apple Pay) is owned by
 * `payment-methods.ts` — not by Seamless config.
 *
 * Default SDK URL matches Telr's sample (`secure.telr.com/jssdk/v2/telr_sdk.js`).
 * Backend `sdk_url` from config always wins when present.
 */
export const TELR_SEAMLESS_CANDIDATE_SDK_URL =
  "https://secure.telr.com/jssdk/v2/telr_sdk.js";

export const TELR_SEAMLESS_ENV = {
  enabled: process.env.NEXT_PUBLIC_TELR_SEAMLESS_ENABLED === "true",
  storeId: process.env.NEXT_PUBLIC_TELR_STORE_ID?.trim() || "",
  currency: process.env.NEXT_PUBLIC_TELR_CURRENCY?.trim() || "SAR",
  testMode: process.env.NEXT_PUBLIC_TELR_TEST_MODE !== "0",
  sdkUrl:
    process.env.NEXT_PUBLIC_TELR_SDK_URL?.trim() ||
    TELR_SEAMLESS_CANDIDATE_SDK_URL,
} as const;

export function envSeamlessConfigFallback(): TelrSeamlessConfig | null {
  if (!TELR_SEAMLESS_ENV.enabled || !TELR_SEAMLESS_ENV.storeId) {
    return null;
  }

  return {
    enabled: true,
    store_id: TELR_SEAMLESS_ENV.storeId,
    currency: TELR_SEAMLESS_ENV.currency,
    test_mode: TELR_SEAMLESS_ENV.testMode,
    sdk_url: TELR_SEAMLESS_ENV.sdkUrl,
  };
}

export function isSeamlessConfigUsable(
  config: TelrSeamlessConfig | null | undefined
): boolean {
  return Boolean(
    config?.enabled &&
      typeof config.store_id === "string" &&
      config.store_id.trim() &&
      typeof config.currency === "string" &&
      config.currency.trim()
  );
}

export function resolveSdkUrl(config?: TelrSeamlessConfig | null): string {
  const fromApi = config?.sdk_url?.trim();
  if (fromApi) return fromApi;
  return TELR_SEAMLESS_ENV.sdkUrl;
}

export function normalizePayLocale(locale: string): "ar" | "en" {
  return locale.toLowerCase().startsWith("en") ? "en" : "ar";
}
