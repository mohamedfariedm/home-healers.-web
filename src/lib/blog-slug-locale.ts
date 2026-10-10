/** Exact `slug[locale]` with no fallback to the other language. */
export function exactLocaleSlug(slug: unknown, locale: string): string {
  if (slug && typeof slug === "object") {
    const value = (slug as Record<string, unknown>)[locale];
    return typeof value === "string" ? value : "";
  }
  return typeof slug === "string" ? slug : "";
}

/** English slugs belong on /en, Arabic slugs on the Arabic site. */
export function blogSlugMatchesLocale(
  news: { slug?: unknown } | null | undefined,
  locale: string,
  requested: string,
): boolean {
  const localeSlug = exactLocaleSlug(news?.slug, locale);
  return localeSlug !== "" && localeSlug === requested;
}
