import ClientAPI from "@/app/api/api";
import initTranslations from "@/app/i18n";
import OfferDetailsView from "@/components/offers/OfferDetailsView";
import {
  buildCanonicalUrl,
  buildLanguageAlternates,
  ogLocale,
} from "@/lib/seo";
import { createBreadcrumbSchema, renderJsonLd } from "@/lib/structured-data";
import {
  DEFAULT_OFFER_OG_IMAGE,
  localePath,
  localizedName,
  one,
  offerOgImage,
  toAbsoluteUrl,
} from "@/lib/offers";
import { getCachedOfferBySlug } from "@/lib/cached-api";
import type { OfferDetails } from "@/types/offers";
import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";

export const revalidate = 300;
export const dynamicParams = true;

type PageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateStaticParams() {
  const slugs = new Set<string>();
  try {
    let page = 1;
    let last = 1;
    do {
      const res = await ClientAPI.getPackages("en", {
        type: "offer",
        limit: 100,
        page,
      });
      for (const row of res?.data ?? []) {
        if (row?.slug) slugs.add(row.slug);
      }
      last = Number(res?.meta?.last_page ?? 1) || 1;
      page += 1;
    } while (page <= last && page <= 20);
  } catch {
    return [];
  }
  return Array.from(slugs).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const res = await getCachedOfferBySlug(locale, slug);
  const offer = one<OfferDetails>(res);
  if (!offer || res?._httpStatus === 404) {
    return { robots: { index: false, follow: false } };
  }

  const title = offer.meta_title || offer.name;
  const description = offer.meta_description || offer.short_description || "";
  const path = `/offers/${offer.slug || slug}`;
  const canonical =
    offer.canonical_url || buildCanonicalUrl(locale, path);
  const image = toAbsoluteUrl(offerOgImage(offer)) || DEFAULT_OFFER_OG_IMAGE;

  return {
    title,
    description,
    robots: { index: true, follow: true },
    alternates: {
      canonical,
      languages: buildLanguageAlternates(path),
    },
    openGraph: {
      type: "website",
      title,
      description,
      url: canonical,
      siteName: "Home Healers",
      locale: ogLocale(locale),
      images: [{ url: image, width: 1200, height: 630, alt: offer.name }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
    other: {
      "og:type": "product",
      "og:locale:alternate": locale === "ar" ? "en_SA" : "ar_SA",
      "product:price:amount": String(offer.price ?? ""),
      "product:price:currency": String(offer.currency || "SAR"),
    },
  };
}

export default async function OfferDetailsPage({ params }: PageProps) {
  const { locale, slug } = await params;
  const res = await getCachedOfferBySlug(locale, slug);

  if (!res) {
    throw new Error("Failed to load offer");
  }
  if (res._httpStatus === 404 || res._httpStatus === 410) {
    notFound();
  }
  if (res._httpStatus && res._httpStatus >= 500) {
    throw new Error("Offer details unavailable");
  }

  const offer = one<OfferDetails>(res);
  if (!offer) notFound();

  if (offer.slug && offer.slug !== slug) {
    permanentRedirect(localePath(locale, `/offers/${offer.slug}`));
  }

  const { t } = await initTranslations(locale, ["offers"]);
  const path = `/offers/${offer.slug || slug}`;
  const canonical = offer.canonical_url || buildCanonicalUrl(locale, path);
  const category = offer.categories?.[0];
  const categoryName = category ? localizedName(category.name, locale) : "";

  const crumbs = [
    { name: t("breadcrumb.home"), url: buildCanonicalUrl(locale, "/") },
    { name: t("breadcrumb.offers"), url: buildCanonicalUrl(locale, "/offers") },
  ];
  if (categoryName) {
    crumbs.push({
      name: categoryName,
      url: buildCanonicalUrl(locale, `/offers?category_id=${category!.id}`),
    });
  }
  crumbs.push({ name: offer.name, url: canonical });

  const faqSchema =
    offer.faqs && offer.faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: offer.faqs.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: faq.answer,
            },
          })),
        }
      : null;

  return (
    <div className="w-full bg-white">
      {offer.structured_data ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(offer.structured_data),
          }}
        />
      ) : null}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: renderJsonLd(createBreadcrumbSchema(crumbs)),
        }}
      />
      {faqSchema ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      ) : null}
      <OfferDetailsView
        offer={offer}
        locale={locale}
        serverTime={res.server_time}
        canonicalUrl={canonical}
      />
    </div>
  );
}
