type NationalityOption = { id: number; name: string };

const SAUDI_NAME_MARKERS = ["saudi", "سعود"];

export const NATIONALITY_FEE_RATE = 0.15;

function nameLooksSaudi(name: string): boolean {
  const lower = name.toLowerCase();
  return SAUDI_NAME_MARKERS.some((m) => lower.includes(m));
}

function normalizeNationalityName(name: string): string {
  return name.trim().toLowerCase().replace(/^ال/, "");
}

/** Resolve API nationality id from a display name (e.g. "الكويت" → id). */
export function resolveNationalityId(
  nationalityName?: string | null,
  nationalities?: NationalityOption[]
): number | undefined {
  if (!nationalityName?.trim() || !Array.isArray(nationalities)) return undefined;

  const normalized = normalizeNationalityName(nationalityName);
  const exact = nationalities.find(
    (n) => normalizeNationalityName(n.name) === normalized
  );
  if (exact) return exact.id;

  const partial = nationalities.find((n) => {
    const apiName = normalizeNationalityName(n.name);
    return apiName.includes(normalized) || normalized.includes(apiName);
  });
  return partial?.id;
}

/** True when nationality_id matches Saudi in the API list, or the display name indicates Saudi. */
export function isSaudiNationality(
  nationalityId?: number | null,
  nationalityName?: string | null,
  nationalities?: NationalityOption[]
): boolean {
  if (nationalityId != null && Array.isArray(nationalities)) {
    const match = nationalities.find((n) => n.id === nationalityId);
    if (match && nameLooksSaudi(match.name)) return true;
  }
  if (nationalityName && nameLooksSaudi(nationalityName)) return true;
  return false;
}

/** 15% nationality fee for non-Saudi patients (0 for Saudi). */
export function calculateNationalityFee(
  subTotal: number,
  nationalityId?: number | null,
  nationalityName?: string | null,
  nationalities?: NationalityOption[]
): number {
  if (subTotal <= 0) return 0;
  if (isSaudiNationality(nationalityId, nationalityName, nationalities)) return 0;
  return Math.round(subTotal * NATIONALITY_FEE_RATE);
}
