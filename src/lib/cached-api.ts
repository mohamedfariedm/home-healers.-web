import ClientAPI from "@/app/api/api";
import { cache } from "react";
import { getCategorySlug, getServiceSlug, unwrapClientData } from "@/lib/slugs";

export const getCachedHomeData = cache((locale: string) =>
  ClientAPI.getHomeData(locale),
);

export const getCachedSettings = cache((locale: string) =>
  ClientAPI.getSettings(locale),
);

export const getCachedServiceBySlug = cache((locale: string, slug: string) =>
  ClientAPI.getAllServicesSlug(locale, slug),
);

export const getCachedCategory = cache((locale: string, key: string) =>
  ClientAPI.getCategory(key, locale),
);

export const getCachedSingleBlog = cache((blogID: string, locale: string) =>
  ClientAPI.getSingleBlog(blogID, locale),
);

export const getCachedOfferBySlug = cache((locale: string, slug: string) =>
  ClientAPI.getOfferBySlug(slug, locale),
);

export const getCachedServices = cache((locale: string) =>
  ClientAPI.getAllServices(locale),
);

export async function resolveServiceCategorySlug(
  locale: string,
  service: { id?: number; slug?: unknown; category?: { slug?: unknown } } | null,
): Promise<string> {
  const nested = getCategorySlug(service?.category);
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
  return getCategorySlug(match?.category);
}

