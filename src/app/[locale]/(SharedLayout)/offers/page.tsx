import ClientAPI from "@/app/api/api";
import initTranslations from "@/app/i18n";
import OffersListingClient from "@/components/offers/OffersListingClient";
import { getCachedCategories, getCachedSettings } from "@/lib/cached-api";
import {
  buildCanonicalUrl,
  buildLanguageAlternates,
  createMetadata,
} from "@/lib/seo";
import {
  getPaginator,
  localePath,
  OFFERS_WEBSITE_BASE_PATH,
  one,
  offersQueryToSearchParams,
  parseOffersSearchParams,
} from "@/lib/offers";
import {
  createBreadcrumbSchema,
  renderJsonLd,
} from "@/lib/structured-data";
import { slimCategoryCard, slimOfferCard } from "@/lib/public-payload";
import type { OfferCard } from "@/types/offers";
import type { Metadata } from "next";
import { PageHero } from "@/components/Shared/PageHero";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({
  params,
  searchParams,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const sp = await searchParams;
  const query = parseOffersSearchParams(sp);
  const { t } = await initTranslations(locale, ["offers"]);
  const page = Number(query.page || 1);
  const settings = await getCachedSettings(locale).catch(() => null);
  const seo = settings?.data?.[0]?.setting?.seo?.["offers"];
  const pathQs = new URLSearchParams(
    Object.entries(query)
      .filter(([key, value]) => key !== "type" && key !== "limit" && value)
      .map(([key, value]) => [key, String(value)]),
  );
  const path = `${OFFERS_WEBSITE_BASE_PATH}${pathQs.toString() ? `?${pathQs}` : ""}`;
  const canonicalPath = page > 1
    ? `${OFFERS_WEBSITE_BASE_PATH}${(() => {
        const params = new URLSearchParams(pathQs);
        params.delete("page");
        const qs = params.toString();
        return qs ? `?${qs}` : "";
      })()}`
    : path;

  const meta = createMetadata(
    seo,
    locale,
    canonicalPath,
    {
      title: t("title"),
      description: t("title"),
    },
    { preferPathCanonical: true },
  );

  return {
    ...meta,
    robots: page >= 2 ? { index: false, follow: true } : { index: true, follow: true },
    alternates: {
      canonical: buildCanonicalUrl(locale, canonicalPath.split("?")[0] === OFFERS_WEBSITE_BASE_PATH && page >= 2
        ? canonicalPath
        : canonicalPath),
      languages: buildLanguageAlternates(OFFERS_WEBSITE_BASE_PATH),
    },
  };
}

export default async function OffersListingPage({
  params,
  searchParams,
}: PageProps) {
  const { locale } = await params;
  const sp = await searchParams;
  const query = parseOffersSearchParams(sp);
  const { t } = await initTranslations(locale, ["offers"]);

  const [offersRes, featuredRes, categoriesRes] = await Promise.all([
    ClientAPI.getPackages(locale, query).catch(
      () => null,
    ),
    ClientAPI.getFeaturedPackage(locale).catch(() => null),
    getCachedCategories(locale).catch(() => null),
  ]);

  const fetchError = !offersRes;
  const offers = ((offersRes?.data ?? []) as OfferCard[]).map(slimOfferCard);
  const meta = getPaginator(offersRes);
  const featured = slimOfferCard(one<OfferCard>(featuredRes));
  const qsFor = (page: number) => {
    const params = offersQueryToSearchParams({ ...query, page });
    const qs = params.toString();
    return buildCanonicalUrl(locale, `${OFFERS_WEBSITE_BASE_PATH}${qs ? `?${qs}` : ""}`);
  };
  const prev =
    meta.current_page > 1 ? qsFor(meta.current_page - 1) : null;
  const next =
    meta.current_page < meta.last_page ? qsFor(meta.current_page + 1) : null;

  const breadcrumbSchema = createBreadcrumbSchema([
    { name: t("breadcrumb.home"), url: buildCanonicalUrl(locale, "/") },
    { name: t("breadcrumb.offers"), url: buildCanonicalUrl(locale, OFFERS_WEBSITE_BASE_PATH) },
  ]);

  return (
    <div className="page-shell bg-white">
      {prev ? <link rel="prev" href={prev} /> : null}
      {next ? <link rel="next" href={next} /> : null}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: renderJsonLd(breadcrumbSchema) }}
      />
      <PageHero
        title={t("title")}
        breadcrumbItems={[
          { label: t("breadcrumb.home"), href: localePath(locale, "/") },
          { label: t("breadcrumb.offers"), isActive: true },
        ]}
      />
      <OffersListingClient
        locale={locale}
        initialQuery={query}
        initialOffers={offers}
        initialMeta={meta}
        initialServerTime={offersRes?.server_time}
        featured={featured}
        categories={(categoriesRes?.data ?? []).map(slimCategoryCard)}
        fetchError={fetchError}
      />
    </div>
  );
}
