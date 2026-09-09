export const STATIC_LOCALES = ["ar", "en"] as const;

/** Home, About, Contact × ar/en = 6 statically generated pages. */
export function generateLocaleStaticParams() {
  return STATIC_LOCALES.map((locale) => ({ locale }));
}
