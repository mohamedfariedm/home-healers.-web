import ClientAPI from "@/app/api/api";
import initTranslations from "@/app/i18n";
import OffersListingClient from "@/components/offers/OffersListingClient";
import { getCachedSettings } from "@/lib/cached-api";
import {
  buildCanonicalUrl,
  buildLanguageAlternates,
  createMetadata,
} from "@/lib/seo";
import {
  getPaginator,
  localePath,
  one,
  offersQueryToSearchParams,
  parseOffersSearchParams,
} from "@/lib/offers";
import { createBreadcrumbSchema, renderJsonLd } from "@/lib/structured-data";
import type { OfferCard } from "@/types/offers";
import type { Metadata } from "next";

export const revalidate = 300;

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
  const path = `/offers${pathQs.toString() ? `?${pathQs}` : ""}`;
  const canonicalPath = page > 1
    ? `/offers${(() => {
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
      canonical: buildCanonicalUrl(locale, canonicalPath.split("?")[0] === "/offers" && page >= 2
        ? canonicalPath
        : canonicalPath),
      languages: buildLanguageAlternates("/offers"),
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
    ClientAPI.getPackages(locale, query, { revalidate: 300 }).catch(
      () => null,
    ),
    ClientAPI.getFeaturedPackage(locale).catch(() => null),
    ClientAPI.getCategories(locale).catch(() => null),
  ]);

  const fetchError = !offersRes;
  const offers = (offersRes?.data ?? []) as OfferCard[];
  const meta = getPaginator(offersRes);
  const featured = one<OfferCard>(featuredRes);
  const qsFor = (page: number) => {
    const params = offersQueryToSearchParams({ ...query, page });
    const qs = params.toString();
    return buildCanonicalUrl(locale, `/offers${qs ? `?${qs}` : ""}`);
  };
  const prev =
    meta.current_page > 1 ? qsFor(meta.current_page - 1) : null;
  const next =
    meta.current_page < meta.last_page ? qsFor(meta.current_page + 1) : null;

  const breadcrumbSchema = createBreadcrumbSchema([
    { name: t("breadcrumb.home"), url: buildCanonicalUrl(locale, "/") },
    { name: t("breadcrumb.offers"), url: buildCanonicalUrl(locale, "/offers") },
  ]);

  return (
    <div className="w-full bg-white">
      {prev ? <link rel="prev" href={prev} /> : null}
      {next ? <link rel="next" href={next} /> : null}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: renderJsonLd(breadcrumbSchema) }}
      />
      <div className="mx-auto max-w-[1440px] px-4 pt-10">
        <nav aria-label="Breadcrumb" className="mb-4 text-sm text-[#4a5568]">
          <ol className="flex items-center gap-2">
            <li>
              <a href={localePath(locale, "/")}>{t("breadcrumb.home")}</a>
            </li>
            <li aria-hidden>›</li>
            <li aria-current="page" className="text-[#1e1e1e]">
              {t("breadcrumb.offers")}
            </li>
          </ol>
        </nav>
        <h1 className="mb-8 text-4xl font-bold text-[#143087]">{t("title")}</h1>
      </div>
      <OffersListingClient
        locale={locale}
        initialQuery={query}
        initialOffers={offers}
        initialMeta={meta}
        initialServerTime={offersRes?.server_time}
        featured={featured}
        categories={categoriesRes?.data ?? []}
        fetchError={fetchError}
      />
    </div>
  );
}
