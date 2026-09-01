import type {
  OfferCard,
  OfferDetails,
  OfferImage,
  OffersEnvelope,
  OffersListQuery,
  OffersPaginator,
} from "@/types/offers";

export const DEFAULT_OFFER_OG_IMAGE = "/assets/images/logo2.svg";
export const OFFERS_REVALIDATE_SECONDS = 300;
export const OFFERS_PAGE_SIZE = 20;
/** Website route for offers pages (deep links stay at /offers). */
export const OFFERS_WEBSITE_BASE_PATH = "/backges";

export function one<T>(res: OffersEnvelope<T> | null | undefined): T | null {
  return res?.data?.[0] ?? null;
}

export function localePath(locale: string, path = ""): string {
  const normalized = path.startsWith("/") ? path : path ? `/${path}` : "";
  return locale === "ar" ? normalized || "/" : `/en${normalized}`;
}

export function offerHref(
  locale: string,
  slug?: string | null,
  hash?: string,
) {
  if (!slug) return localePath(locale, OFFERS_WEBSITE_BASE_PATH);
  const path = `${OFFERS_WEBSITE_BASE_PATH}/${encodeURIComponent(slug)}`;
  return `${localePath(locale, path)}${hash ? `#${hash}` : ""}`;
}

export function bookingHref(locale: string, packageId: number) {
  return `${localePath(locale, "/booking")}?packageId=${packageId}`;
}

export function localizedName(name: unknown, locale: string): string {
  if (typeof name === "string") return name;
  if (name && typeof name === "object") {
    const record = name as Record<string, string>;
    return record[locale] || record.ar || record.en || "";
  }
  return "";
}

export function isTruthyFlag(value: unknown): boolean {
  return value === true || value === 1 || value === "1" || value === "true";
}

export function isRichTextEmpty(html?: string | null): boolean {
  if (!html) return true;
  return (
    html.replace(/<[^>]*>/g, " ").replace(/&nbsp;/gi, " ").trim() === ""
  );
}

export function isListEmpty(list?: unknown[] | null): boolean {
  return !Array.isArray(list) || list.length === 0;
}

export function toNumber(value: unknown): number | null {
  if (value === null || value === undefined || value === "") return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

export function resolveOfferImageUrl(
  image?: OfferImage,
  fallback = "",
): string {
  if (!image) return fallback;
  if (typeof image === "string") return image || fallback;
  if (Array.isArray(image)) return resolveOfferImageUrl(image[0], fallback);
  return (
    image.original ||
    image.converted ||
    image.thumbnail ||
    image.url ||
    fallback
  );
}

export function toAbsoluteUrl(url: string, origin?: string): string {
  if (!url) return "";
  if (/^https?:\/\//i.test(url)) return url;
  const base =
    origin ||
    process.env.NEXT_PUBLIC_WEBSITE_URL ||
    "https://home-healers.com";
  return `${base.replace(/\/$/, "")}${url.startsWith("/") ? "" : "/"}${url}`;
}

export function formatOfferPrice(
  amount: string | number | null | undefined,
  currency: string | null | undefined,
  locale: string,
): string {
  const n = toNumber(amount);
  if (n === null) return "";
  return new Intl.NumberFormat(locale === "ar" ? "ar-SA" : "en-US", {
    style: "currency",
    currency: currency || "SAR",
    maximumFractionDigits: n % 1 === 0 ? 0 : 2,
  }).format(n);
}

export function formatOfferNumber(value: number, locale: string): string {
  return new Intl.NumberFormat(locale === "ar" ? "ar-SA" : "en-US").format(
    value,
  );
}

export type OfferFlagKey = "best_seller" | "most_popular" | "new";

export function pickOfferFlags(offer: OfferCard): OfferFlagKey[] {
  const flags: OfferFlagKey[] = [];
  if (isTruthyFlag(offer.is_best_seller)) flags.push("best_seller");
  if (isTruthyFlag(offer.is_most_popular)) flags.push("most_popular");
  if (isTruthyFlag(offer.is_new)) flags.push("new");
  return flags.slice(0, 2);
}

export function remainingMs(
  endsAt: string,
  serverTime: string,
  now = Date.now(),
) {
  const serverMs = Date.parse(serverTime);
  const endsMs = Date.parse(endsAt);
  if (Number.isNaN(endsMs)) return 0;
  const offset = Number.isNaN(serverMs) ? 0 : serverMs - now;
  return endsMs - (now + offset);
}

export function formatRemaining(ms: number): string {
  if (ms <= 0) return "";
  const totalSec = Math.max(0, Math.floor(ms / 1000));
  const days = Math.floor(totalSec / 86400);
  const hours = Math.floor((totalSec % 86400) / 3600);
  const mins = Math.floor((totalSec % 3600) / 60);
  const secs = totalSec % 60;
  if (totalSec < 3600) {
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }
  const hh = String(hours).padStart(2, "0");
  const mm = String(mins).padStart(2, "0");
  return days > 0 ? `${days}d ${hh}:${mm}` : `${hh}:${mm}`;
}

export function getPaginator(
  res: OffersEnvelope<unknown> | null | undefined,
): OffersPaginator {
  const meta = res?.meta;
  return {
    current_page: Number(meta?.current_page ?? 1) || 1,
    last_page: Number(meta?.last_page ?? 1) || 1,
    per_page: toNumber(meta?.per_page) ?? undefined,
    total: toNumber(meta?.total) ?? undefined,
  };
}

export function parseOffersSearchParams(
  searchParams: Record<string, string | string[] | undefined>,
): OffersListQuery {
  const read = (key: string) => {
    const value = searchParams[key];
    return Array.isArray(value) ? value[0] : value;
  };

  const page = Math.max(1, Number(read("page") || 1) || 1);
  const priceMin = toNumber(read("price_min"));
  const priceMax = toNumber(read("price_max"));
  const query: OffersListQuery = {
    type: "offer",
    limit: OFFERS_PAGE_SIZE,
    page,
  };

  const name = read("name")?.trim();
  if (name) query.name = name;

  const categoryId = read("category_id");
  if (categoryId) query.category_id = categoryId;

  const sort = read("sort");
  if (sort) query.sort = sort;

  if (priceMin !== null && priceMax !== null && priceMin > priceMax) {
    query.price_min = priceMax;
    query.price_max = priceMin;
  } else {
    if (priceMin !== null) query.price_min = priceMin;
    if (priceMax !== null) query.price_max = priceMax;
  }

  const sessions = read("sessions_count")?.trim();
  if (sessions) query.sessions_count = sessions;

  for (const key of [
    "has_discount",
    "is_best_seller",
    "is_most_popular",
    "is_new",
    "is_featured",
  ] as const) {
    const value = read(key);
    if (value === "1" || value === "true") query[key] = 1;
  }

  return query;
}

export function offersQueryToSearchParams(
  query: OffersListQuery,
): URLSearchParams {
  const params = new URLSearchParams();
  const skip = new Set(["type", "limit"]);
  Object.entries(query).forEach(([key, value]) => {
    if (
      skip.has(key) ||
      value === undefined ||
      value === null ||
      value === ""
    ) {
      return;
    }
    if (key === "page" && Number(value) <= 1) return;
    params.set(key, String(value));
  });
  return params;
}

export function buildOffersListPath(locale: string, query: OffersListQuery) {
  const params = offersQueryToSearchParams(query);
  const qs = params.toString();
  return `${localePath(locale, OFFERS_WEBSITE_BASE_PATH)}${qs ? `?${qs}` : ""}`;
}

export function offerDisplayImage(offer: OfferCard | OfferDetails) {
  return (
    resolveOfferImageUrl(offer.cover_image) ||
    resolveOfferImageUrl(offer.image) ||
    ""
  );
}

export function offerOgImage(offer: OfferDetails) {
  return (
    resolveOfferImageUrl(offer.og_image) ||
    resolveOfferImageUrl(offer.cover_image) ||
    resolveOfferImageUrl(offer.image) ||
    DEFAULT_OFFER_OG_IMAGE
  );
}

export function compactQuery(
  query: Record<string, unknown>,
): Record<string, string | number | boolean> {
  const next: Record<string, string | number | boolean> = {};
  Object.entries(query).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    if (typeof value === "boolean" || typeof value === "number") {
      next[key] = value;
      return;
    }
    next[key] = String(value);
  });
  return next;
}
