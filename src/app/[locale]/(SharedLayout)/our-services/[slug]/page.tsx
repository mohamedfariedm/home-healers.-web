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
  getServiceSlug,
  isActiveRecord,
  serviceHref,
  unwrapDetail,
} from "@/lib/slugs";
import type { Service } from "@/types/booking";
import { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";

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
  if (!loaded) {
    return createMetadata(
      null,
      locale,
      `/our-services/${slug}`,
      { title: "Home Healers" },
      { preferPathCanonical: true },
    );
  }

  const serviceSlug = getServiceSlug(loaded.service, locale) || loaded.decoded;
  const path = loaded.categorySlug
    ? `/categories/${encodeURIComponent(loaded.categorySlug)}/${encodeURIComponent(serviceSlug)}`
    : `/our-services/${encodeURIComponent(serviceSlug)}`;
  const canonical = buildCanonicalUrl(locale, path);
  const title = loaded.service.name || "Home Healers";

  const baseMeta = createMetadata(
    null,
    locale,
    path,
    { title },
    { preferPathCanonical: true },
  );

  return {
    ...baseMeta,
    title,
    alternates: {
      canonical,
      languages: loaded.categorySlug
        ? buildCategoryServiceAlternates(
            loaded.categorySlug,
            loaded.service.slug,
            serviceSlug,
          )
        : baseMeta.alternates?.languages,
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

  if (!loaded) {
    notFound();
  }

  const serviceSlug = getServiceSlug(loaded.service, locale) || loaded.decoded;

  if (!loaded.categorySlug) {
    notFound();
  }

  permanentRedirect(serviceHref(locale, loaded.categorySlug, serviceSlug));
}
