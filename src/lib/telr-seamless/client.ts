import { resolveSdkUrl } from "./config";
import { loadTelrSeamlessSdk } from "./load-sdk";
import type { TelrSeamlessConfig, TelrSdkAppearance } from "./types";

const DEFAULT_APPEARANCE: TelrSdkAppearance = {
  labels: 1,
  logos: 1,
  borders: 1,
  dropdowns: 0,
};

export type InitTelrSeamlessOptions = {
  config: TelrSeamlessConfig;
  onToken: (token: string) => void;
  appearance?: TelrSdkAppearance;
};

/**
 * Loads the SDK and initializes Telr card fields into #telr_frame.
 * Token is delivered via callback only — never log or persist long-term.
 */
export async function initTelrSeamlessFields(
  options: InitTelrSeamlessOptions
): Promise<void> {
  const { config, onToken, appearance = DEFAULT_APPEARANCE } = options;
  const sdk = await loadTelrSeamlessSdk(resolveSdkUrl(config));

  sdk.init({
    store_id: config.store_id,
    currency: config.currency,
    test_mode: config.test_mode ? 1 : 0,
    appearance,
    callback: (token: string) => {
      if (typeof token === "string" && token.trim()) {
        onToken(token.trim());
      }
    },
  });
}

export function clearTelrFrameMount(frameId = "telr_frame"): void {
  if (typeof document === "undefined") return;
  const el = document.getElementById(frameId);
  if (el) el.innerHTML = "";
}
