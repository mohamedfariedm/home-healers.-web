type NationalityOption = { id: number; name: string };

const SAUDI_NAME_MARKERS = ["saudi", "سعود"];

function nameLooksSaudi(name: string): boolean {
  const lower = name.toLowerCase();
  return SAUDI_NAME_MARKERS.some((m) => lower.includes(m));
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
