import { TELR_SEAMLESS_ENV } from "./config";
import type { TelrSdkGlobal } from "./types";

const SCRIPT_ATTR = "data-telr-seamless-sdk";

let loadPromise: Promise<TelrSdkGlobal> | null = null;

function readTelrSdk(): TelrSdkGlobal | null {
  if (typeof window === "undefined") return null;
  return window.telrSdk ?? null;
}

/**
 * Loads the Telr Seamless JSSDK once from Telr-hosted servers (or env override).
 * Does not host the SDK locally (Telr compliance guidance).
 */
export function loadTelrSeamlessSdk(
  sdkUrl: string = TELR_SEAMLESS_ENV.sdkUrl
): Promise<TelrSdkGlobal> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Telr SDK can only load in the browser"));
  }

  const existing = readTelrSdk();
  if (existing?.init) {
    return Promise.resolve(existing);
  }

  if (loadPromise) return loadPromise;

  loadPromise = new Promise<TelrSdkGlobal>((resolve, reject) => {
    const prior = document.querySelector<HTMLScriptElement>(
      `script[${SCRIPT_ATTR}]`
    );
    if (prior) {
      const check = () => {
        const sdk = readTelrSdk();
        if (sdk?.init) {
          resolve(sdk);
          return true;
        }
        return false;
      };
      if (check()) return;
      prior.addEventListener("load", () => {
        const sdk = readTelrSdk();
        if (sdk?.init) resolve(sdk);
        else {
          loadPromise = null;
          reject(new Error("Telr SDK loaded but telrSdk.init is unavailable"));
        }
      });
      prior.addEventListener("error", () => {
        loadPromise = null;
        reject(new Error("Failed to load Telr Seamless SDK script"));
      });
      return;
    }

    const script = document.createElement("script");
    script.src = sdkUrl;
    script.async = true;
    script.setAttribute(SCRIPT_ATTR, "true");
    script.onload = () => {
      const sdk = readTelrSdk();
      if (sdk?.init) {
        resolve(sdk);
      } else {
        loadPromise = null;
        reject(new Error("Telr SDK loaded but telrSdk.init is unavailable"));
      }
    };
    script.onerror = () => {
      loadPromise = null;
      reject(new Error("Failed to load Telr Seamless SDK script"));
    };
    document.head.appendChild(script);
  });

  return loadPromise;
}

export function getTelrSdk(): TelrSdkGlobal | null {
  return readTelrSdk();
}
