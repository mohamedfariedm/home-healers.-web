import { localePath } from "@/lib/offers";

export type LocaleCode = "ar" | "en";

/** Pick `slug[locale]` from `{ en, ar }` or return a plain string slug. */
export function pickLocalizedSlug(slug: unknown, locale: string): string {
  if (slug && typeof slug === "object") {
    const record = slug as Record<string, string>;
    return record[locale] || record.en || record.ar || "";
  }
  return typeof slug === "string" ? slug : "";
}

/** Category slug is `{ en, ar }` — pick the active locale key. */
export function getCategorySlug(
  category: { slug?: unknown } | null | undefined,
  locale: string,
): string {
  return pickLocalizedSlug(category?.slug, locale);
}

/** Service slug is `{ en, ar }` — pick the active locale key. */
export function getServiceSlug(
  service: { slug?: unknown } | null | undefined,
  locale: string,
): string {
  return pickLocalizedSlug(service?.slug, locale);
}

/** Blog slug is `{ en, ar }` — pick the active locale key. */
export function getBlogSlug(
  news: { slug?: unknown } | null | undefined,
  locale: string,
): string {
  return pickLocalizedSlug(news?.slug, locale);
}

/** Offer slug may be a string or `{ en, ar }`. */
export function getOfferSlug(
  offer: { slug?: unknown } | null | undefined,
  locale: string,
): string {
  return pickLocalizedSlug(offer?.slug, locale);
}

/**
 * `news.name` is a string when the `language` header is sent,
 * and `{ en, ar }` without it. Always guard both shapes.
 */
export function getNewsTitle(
  news: { name?: unknown } | null | undefined,
  locale: string,
): string {
  const name = news?.name;
  if (typeof name === "string") return name;
  if (name && typeof name === "object") {
    const record = name as Record<string, string>;
    return record[locale] || record.en || record.ar || "";
  }
  return "";
}

export function isActiveRecord(
  item: { active?: number | boolean | string } | null | undefined,
): boolean {
  if (item == null || item.active === undefined || item.active === null) {
    return true;
  }
  return item.active === 1 || item.active === true || item.active === "1";
}

export function getActiveServices<T extends { active?: number | boolean | string }>(
  services?: T[] | null,
): T[] {
  if (!Array.isArray(services)) return [];
  return services.filter(isActiveRecord);
}

export function unwrapClientData<T = unknown>(res: unknown): T | undefined {
  if (!res || typeof res !== "object") return undefined;
  return (res as { data?: T }).data;
}

export function isApiNotFound(res: unknown): boolean {
  if (!res || typeof res !== "object") return true;
  const status = (res as { _httpStatus?: number; status?: number })._httpStatus
    ?? (res as { status?: number }).status;
  return status === 404;
}

export function unwrapDetail<T extends object>(res: unknown): T | null {
  if (isApiNotFound(res)) return null;
  const data = unwrapClientData<T>(res);
  if (!data || typeof data !== "object" || Array.isArray(data)) return null;
  return data;
}

/** Client `created_at` / `updated_at` / `date` are `DD-MM-YYYY`, not ISO. */
export function parseApiDate(value?: string | null): Date | null {
  if (!value) return null;
  const trimmed = value.trim();
  const ddmmyyyy = /^(\d{2})-(\d{2})-(\d{4})$/.exec(trimmed);
  if (ddmmyyyy) {
    const [, dd, mm, yyyy] = ddmmyyyy;
    const date = new Date(Number(yyyy), Number(mm) - 1, Number(dd));
    return Number.isNaN(date.getTime()) ? null : date;
  }
  const yyyymmdd = /^(\d{4})-(\d{2})-(\d{2})$/.exec(trimmed);
  if (yyyymmdd) {
    const [, yyyy, mm, dd] = yyyymmdd;
    const date = new Date(Number(yyyy), Number(mm) - 1, Number(dd));
    return Number.isNaN(date.getTime()) ? null : date;
  }
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function formatApiDate(
  value: string | undefined | null,
  locale: string,
): string {
  const date = parseApiDate(value);
  if (!date) return value || "";
  try {
    return date.toLocaleDateString(locale === "ar" ? "ar-EG" : "en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return date.toDateString();
  }
}

export function categoryHref(locale: string, categorySlug: string): string {
  if (!categorySlug) return localePath(locale, "/categories");
  return localePath(locale, `/categories/${encodeURIComponent(categorySlug)}`);
}

export function categoryHrefFrom(
  locale: string,
  category: { slug?: unknown } | null | undefined,
): string {
  return categoryHref(locale, getCategorySlug(category, locale));
}

export function categoryFirstServiceHref(
  locale: string,
  category: {
    id?: number | string;
    slug?: unknown;
    services?: Array<{ slug?: unknown; active?: number | boolean | string }> | null;
  } | null | undefined,
): string {
  const categorySlug = getCategorySlug(category, locale);
  const firstService = getActiveServices(category?.services)[0];
  const serviceSlug = getServiceSlug(firstService, locale);
  if (categorySlug && serviceSlug) {
    return serviceHref(locale, categorySlug, serviceSlug);
  }
  return categoryHrefFrom(locale, category);
}

export function serviceHref(
  locale: string,
  categorySlug: string,
  serviceSlug: string,
): string {
  if (!categorySlug) return localePath(locale, "/categories");
  if (!serviceSlug) return categoryHref(locale, categorySlug);
  return localePath(
    locale,
    `/categories/${encodeURIComponent(categorySlug)}/${encodeURIComponent(serviceSlug)}`,
  );
}

export function blogHref(locale: string, blogSlug: string): string {
  if (!blogSlug) return localePath(locale, "/blog");
  return localePath(locale, `/blog/${encodeURIComponent(blogSlug)}`);
}

export function serviceFromCategory(
  service: { slug?: unknown; category?: { slug?: unknown } | null } | null | undefined,
  locale: string,
): { categorySlug: string; serviceSlug: string } {
  return {
    categorySlug: getCategorySlug(service?.category, locale),
    serviceSlug: getServiceSlug(service, locale),
  };
}
