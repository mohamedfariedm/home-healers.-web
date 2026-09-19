import ClientAPI from "@/app/api/api";
import OfferBookingClient from "@/components/offers/booking/OfferBookingClient";
import { createNoIndexMetadata } from "@/lib/seo";
import {
  one,
  offerHref,
  safeDecodeUriSlug,
} from "@/lib/offers";
import { getOfferSlug } from "@/lib/slugs";
import { getCachedOfferBySlug } from "@/lib/cached-api";
import type { OfferDetails } from "@/types/offers";
import { notFound, permanentRedirect } from "next/navigation";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { locale, slug } = await params;
  const decodedSlug = safeDecodeUriSlug(slug);
  return createNoIndexMetadata(locale, `/offers/${encodeURIComponent(decodedSlug)}/book`, {
    title: locale === "ar" ? "حجز العرض | هوم هيلرز" : "Book offer | Home Healers",
    description:
      locale === "ar"
        ? "أكمل حجز العرض في صفحة واحدة"
        : "Complete your offer booking on one page",
  });
}

export default async function OfferBookPage({ params }: PageProps) {
  const { locale, slug } = await params;
  const decodedSlug = safeDecodeUriSlug(slug);
  const [res, countriesData, statesData, nationalitiesData] = await Promise.all([
    getCachedOfferBySlug(locale, decodedSlug),
    ClientAPI.getCountries(locale),
    ClientAPI.getStates(locale),
    ClientAPI.getNationalities(locale),
  ]);

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

  const offerSlug = getOfferSlug(offer, locale);
  if (offerSlug && safeDecodeUriSlug(offerSlug) !== decodedSlug) {
    permanentRedirect(`${offerHref(locale, offerSlug)}/book`);
  }

  return (
    <div className="w-full overflow-x-hidden bg-[linear-gradient(180deg,#eef4ff_0%,#f7f9fc_220px,#f7f9fc_100%)]">
      <OfferBookingClient
        offer={offer}
        locale={locale}
        serverTime={res.server_time}
        countriesData={countriesData}
        statesData={statesData}
        nationalitiesData={nationalitiesData}
      />
    </div>
  );
}
