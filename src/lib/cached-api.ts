import { cache } from "react";
import { unstable_cache } from "next/cache";
import ClientAPI from "@/app/api/api";
import { getCategorySlug, getServiceSlug, unwrapClientData } from "@/lib/slugs";

const REVALIDATE_SECONDS = 300;

function cached<T>(
  key: string[],
  fn: () => Promise<T>,
): Promise<T> {
  return unstable_cache(fn, key, {
    revalidate: REVALIDATE_SECONDS,
    tags: key,
  })();
}

export const getCachedHomeData = cache((locale: string) =>
  cached(["home-data", locale], () => ClientAPI.getHomeData(locale)),
);

export const getCachedSettings = cache((locale: string) =>
  cached(["settings", locale], () => ClientAPI.getSettings(locale)),
);
export const getCachedServiceBySlug = cache((locale: string, slug: string) =>
  cached(["service-slug", locale, slug], () =>
    ClientAPI.getAllServicesSlug(locale, slug),
  ),
);

export const getCachedCategory = cache((locale: string, key: string) =>
  cached(["category", locale, key], () => ClientAPI.getCategory(key, locale)),
);

export const getCachedSingleBlog = cache((blogID: string, locale: string) =>
  cached(["blog", locale, blogID], () =>
    ClientAPI.getSingleBlog(blogID, locale),
  ),
);

export const getCachedOfferBySlug = cache((locale: string, slug: string) =>
  cached(["offer", locale, slug], () =>
    ClientAPI.getOfferBySlug(slug, locale),
  ),
);

export const getCachedServices = cache((locale: string) =>
  cached(["services", locale], () => ClientAPI.getAllServices(locale)),
);

export const getCachedCategories = cache((locale: string) =>
  cached(["categories", locale], () => ClientAPI.getCategories(locale)),
);

export async function resolveServiceCategorySlug(
  locale: string,
  service: { id?: number; slug?: unknown; category?: { slug?: unknown } } | null,
): Promise<string> {
  const nested = getCategorySlug(service?.category, locale);
  if (nested) return nested;
  if (!service) return "";

  const list = await getCachedServices(locale);
  const services = unwrapClientData<Array<{
    id?: number;
    slug?: unknown;
    category?: { slug?: unknown };
  }>>(list) || [];
  const serviceSlug = getServiceSlug(service, locale);
  const match = services.find(
    (item) =>
      (service.id != null && item.id === service.id) ||
      getServiceSlug(item, locale) === serviceSlug,
  );
  return getCategorySlug(match?.category, locale);
}
