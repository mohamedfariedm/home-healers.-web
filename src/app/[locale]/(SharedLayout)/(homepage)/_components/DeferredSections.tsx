import ClientAPI from "@/app/api/api";
import OurStory from "./OurStory";
import ClientReviewsSection from "./ClientReviewsSection";
import ReservationReviewsSection from "./ReservationReviewsSection";
import FeaturedOfferBanner from "@/components/offers/FeaturedOfferBanner";
import OffersTeaserRail from "@/components/offers/OffersTeaserRail";

export async function DeferredOurStory({ locale }: { locale: string }) {
  const blogData = await ClientAPI.getAllBlogs(locale);
  if (!blogData?.data?.length) return null;
  return <OurStory data={blogData.data} locale={locale} />;
}

export async function DeferredOffers({ locale }: { locale: string }) {
  const [featuredRes, teaserRes] = await Promise.all([
    ClientAPI.getFeaturedPackage(locale).catch(() => null),
    ClientAPI.getPackages(locale, {
      type: "offer",
      sort: "featured",
      limit: 8,
    }).catch(() => null),
  ]);
  const featured = featuredRes?.data?.[0] ?? null;
  const offers = teaserRes?.data ?? [];
  if (!featured && !offers.length) return null;
  return (
    <>
      
      <OffersTeaserRail
        offers={offers}
        locale={locale}
        serverTime={teaserRes?.server_time}
      />
    </>
  );
}

export async function DeferredClientReviews({ locale }: { locale: string }) {
  const clientReviews = await ClientAPI.getClientReviews(locale, {
    active: true,
  });
  if (!clientReviews?.data?.length) return null;
  return (
    <ClientReviewsSection locale={locale} reviews={clientReviews.data} />
  );
}

export async function DeferredReservationReviews({
  locale,
}: {
  locale: string;
}) {
  const reservationReviews = await ClientAPI.getActiveReservationReviews(
    locale,
    { limit: 10, page: 1 },
  );
  if (!reservationReviews?.data?.length) return null;
  return (
    <ReservationReviewsSection
      reviews={reservationReviews.data}
      locale={locale}
    />
  );
}
