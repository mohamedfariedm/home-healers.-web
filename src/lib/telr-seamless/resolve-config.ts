import ClientAPI from "@/app/api/api";
import {
  envSeamlessConfigFallback,
  isSeamlessConfigUsable,
  parseTelrSeamlessConfig,
  type TelrSeamlessConfig,
} from "@/lib/telr-seamless";

/**
 * Resolves Seamless config preferring the backend feature flag.
 * - enabled:false from API → Seamless off (no env override)
 * - enabled:true + usable store → use API config
 * - API unreachable → optional local env fallback for UI development only
 */
export async function resolveTelrSeamlessConfig(
  locale: string
): Promise<TelrSeamlessConfig | null> {
  try {
    const response = await ClientAPI.getTelrSeamlessConfig(locale);
    const parsed = parseTelrSeamlessConfig(response);

    if (parsed && parsed.enabled === false) {
      return null;
    }
    if (parsed && isSeamlessConfigUsable(parsed)) {
      return parsed;
    }
    // API reachable but incomplete while claiming enabled — do not invent store ids.
    return null;
  } catch {
    // Config API unreachable — local/dev fallback only.
    return envSeamlessConfigFallback();
  }
}
