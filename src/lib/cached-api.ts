import { cache } from "react";
import ClientAPI from "@/app/api/api";
import { slimBlogForHome } from "@/lib/public-payload";
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

export const getCachedCategories = cache((locale: string) =>
  ClientAPI.getCategories(locale),
);

export const getCachedBlogs = cache(async (locale: string) => {
  const res = await ClientAPI.getAllBlogs(locale, { page: 1, limit: 100 });
  if (!res?.data) {
    throw new Error("Failed to load blogs");
  }
  return {
    ...res,
    data: res.data.map(slimBlogForHome),
  };
});

export const getCachedHomeBlogs = cache(async (locale: string) => {
  const res = await ClientAPI.getAllBlogs(locale, {
    show_home: true,
    limit: 4,
    page: 1,
  });
  if (!res?.data) {
    throw new Error("Failed to load home blogs");
  }
  return {
    ...res,
    data: res.data.map(slimBlogForHome),
  };
});

export const getCachedAboutUs = cache((locale: string) =>
  ClientAPI.getAboutUs(locale),
);

export const getCachedDoctors = cache((locale: string) =>
  ClientAPI.getDoctors(locale),
);

export const getCachedFAQs = cache((locale: string) =>
  ClientAPI.getFAQs(locale),
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
