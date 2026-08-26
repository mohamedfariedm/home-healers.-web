import { getCachedCategory } from "@/lib/cached-api";
import {
  buildCanonicalUrl,
  buildCategoryServiceAlternates,
  createMetadata,
} from "@/lib/seo";
import {
  categoryFirstServiceHref,
  getActiveServices,
  getCategorySlug,
  getServiceSlug,
  isActiveRecord,
  unwrapDetail,
} from "@/lib/slugs";
import type { Category } from "@/types/booking";
import { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";

export const dynamic = "force-dynamic";

async function loadCategoryWithFirstService(locale: string, key: string) {
  const decoded = decodeURIComponent(key);
  const res = await getCachedCategory(locale, decoded);
  const category = unwrapDetail<Category>(res);
  if (!category || !isActiveRecord(category)) return null;

  const services = getActiveServices(category.services);
  const firstService = services[0];
  const categorySlug = getCategorySlug(category) || decoded;
  const serviceSlug = getServiceSlug(firstService, locale);
  if (!serviceSlug) return null;

  return {
    category: { ...category, services },
    categorySlug,
    serviceSlug,
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const loaded = await loadCategoryWithFirstService(locale, slug);

  if (!loaded) {
    return createMetadata(null, locale, `/categories/${slug}`, {
      title: "Home Healers | Category",
    });
  }

  const path = `/categories/${encodeURIComponent(loaded.categorySlug)}/${encodeURIComponent(loaded.serviceSlug)}`;
  const canonical = buildCanonicalUrl(locale, path);
  const title = loaded.category.name
    ? `${loaded.category.name} | Home Healers`
    : "Home Healers | Category";
  const baseMeta = createMetadata(
    null,
    locale,
    path,
    {
      title,
      description: loaded.category.name
        ? `Services in ${loaded.category.name}`
        : "Category details",
    },
    { preferPathCanonical: true },
  );

  return {
    ...baseMeta,
    title,
    alternates: {
      canonical,
      languages: buildCategoryServiceAlternates(
        loaded.categorySlug,
        loaded.category.services[0]?.slug,
        loaded.serviceSlug,
      ),
    },
  };
}

export default async function CategoryDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const loaded = await loadCategoryWithFirstService(locale, slug);

  if (!loaded) {
    notFound();
  }

  permanentRedirect(
    categoryFirstServiceHref(locale, loaded.category) ||
      `/categories/${encodeURIComponent(loaded.categorySlug)}/${encodeURIComponent(loaded.serviceSlug)}`,
  );
}
