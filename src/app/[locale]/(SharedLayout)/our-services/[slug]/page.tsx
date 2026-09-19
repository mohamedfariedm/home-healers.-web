import {
  getCachedServiceBySlug,
  resolveServiceCategorySlug,
} from "@/lib/cached-api";
import {
  buildCanonicalUrl,
  buildCategoryServiceAlternates,
  createMetadata,
} from "@/lib/seo";
import {
  categoryHref,
  getServiceSlug,
  isActiveRecord,
  serviceHref,
  unwrapDetail,
} from "@/lib/slugs";
import type { Service } from "@/types/booking";
import { Metadata } from "next";
import { permanentRedirect } from "next/navigation";

export const dynamic = "force-dynamic";

async function loadService(locale: string, slug: string) {
  const decoded = decodeURIComponent(slug);
  const res = await getCachedServiceBySlug(locale, decoded);
  const service = unwrapDetail<Service>(res);
  if (!service || !isActiveRecord(service)) return null;
  const categorySlug = await resolveServiceCategorySlug(locale, service);
  return { service, decoded, categorySlug };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const loaded = await loadService(locale, slug);
  if (!loaded?.categorySlug) {
    return createMetadata(
      null,
      locale,
      "/categories",
      { title: "Home Healers" },
      { preferPathCanonical: true },
    );
  }

  const serviceSlug = getServiceSlug(loaded.service, locale) || loaded.decoded;
  const path = `/categories/${encodeURIComponent(loaded.categorySlug)}/${encodeURIComponent(serviceSlug)}`;
  const canonical = buildCanonicalUrl(locale, path);
  const title = loaded.service.name || "Home Healers";
  const description =
    (typeof loaded.service.meta_description === "object"
      ? loaded.service.meta_description?.[locale]
      : loaded.service.meta_description) ||
    (typeof loaded.service.description === "string"
      ? loaded.service.description.replace(/<[^>]+>/g, "").slice(0, 160)
      : `${title} | Home Healers`);

  const baseMeta = createMetadata(
    null,
    locale,
    path,
    { title, description },
    { preferPathCanonical: true },
  );

  return {
    ...baseMeta,
    title,
    description,
    alternates: {
      canonical,
      languages: buildCategoryServiceAlternates(
        loaded.categorySlug,
        loaded.service.slug,
        serviceSlug,
      ),
    },
    openGraph: {
      ...baseMeta.openGraph,
      title,
      url: canonical,
    },
  };
}

export default async function OurServicePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const loaded = await loadService(locale, slug);

  if (!loaded?.categorySlug) {
    permanentRedirect(categoryHref(locale, ""));
  }

  const serviceSlug = getServiceSlug(loaded.service, locale) || loaded.decoded;
  permanentRedirect(serviceHref(locale, loaded.categorySlug, serviceSlug));
}
