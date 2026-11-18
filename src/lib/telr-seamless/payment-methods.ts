/**
 * Frontend-owned Telr hybrid payment method visibility.
 *
 * The backend cannot (and need not) return Telr merchant "methods".
 * Card Seamless still respects backend `GET .../seamless/config` `enabled`
 * + store credentials at runtime. Tabby visibility is independent of that.
 *
 * Env (build-time / Next public):
 * - NEXT_PUBLIC_TELR_CARD_ENABLED — default on (`"false"` / `"0"` to disable)
 * - NEXT_PUBLIC_TELR_TABBY_ENABLED — default on (`"false"` / `"0"` to disable)
 * - NEXT_PUBLIC_TELR_APPLE_PAY_ENABLED — ignored; Apple Pay stays off
 *   (backend `method/pay` supports `tabby` only; `apple_pay` → 422)
 *
 * Production: set Card/Tabby flags deliberately in the deployment env.
 */

export type TelrHybridIntegration = "telr_seamless" | "telr_hosted";

export type TelrHybridMethodDefinition = {
  enabled: boolean;
  integration: TelrHybridIntegration;
};

export type TelrHybridPaymentMethodsConfig = {
  card: TelrHybridMethodDefinition;
  tabby: TelrHybridMethodDefinition;
  apple_pay: TelrHybridMethodDefinition;
};

function envFlagEnabled(
  value: string | undefined,
  defaultEnabled: boolean
): boolean {
  if (value == null || value.trim() === "") return defaultEnabled;
  const normalized = value.trim().toLowerCase();
  if (normalized === "1" || normalized === "true" || normalized === "yes") {
    return true;
  }
  if (normalized === "0" || normalized === "false" || normalized === "no") {
    return false;
  }
  return defaultEnabled;
}

/**
 * Single source of truth for which Telr options the custom checkout may show.
 * Not eligibility. Not proof the backend can process the method yet.
 */
export function getTelrHybridPaymentMethods(): TelrHybridPaymentMethodsConfig {
  return {
    card: {
      enabled: envFlagEnabled(process.env.NEXT_PUBLIC_TELR_CARD_ENABLED, true),
      integration: "telr_seamless",
    },
    tabby: {
      enabled: envFlagEnabled(process.env.NEXT_PUBLIC_TELR_TABBY_ENABLED, true),
      integration: "telr_hosted",
    },
    // Backend does not implement apple_pay on method/pay — keep UI off.
    apple_pay: {
      enabled: false,
      integration: "telr_hosted",
    },
  };
}

export function hasAnyTelrHybridMethod(
  config: TelrHybridPaymentMethodsConfig = getTelrHybridPaymentMethods()
): boolean {
  return config.card.enabled || config.tabby.enabled || config.apple_pay.enabled;
}

export function defaultTelrHybridSelection(
  config: TelrHybridPaymentMethodsConfig = getTelrHybridPaymentMethods()
): "card" | "tabby" {
  if (config.card.enabled) return "card";
  if (config.tabby.enabled) return "tabby";
  return "card";
}
