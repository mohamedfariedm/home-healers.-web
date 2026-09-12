import ClientAPI from "@/app/api/api";
import OurStory from "./OurStory";
import ClientReviewsSection from "./ClientReviewsSection";
import ReservationReviewsSection from "./ReservationReviewsSection";
import OffersTeaserRail from "@/components/offers/OffersTeaserRail";
import { getCachedHomeBlogs } from "@/lib/cached-api";
import {
  slimBlogForHome,
  slimClientReview,
  slimOfferCard,
  slimReservationReview,
} from "@/lib/public-payload";

export async function DeferredOurStory({ locale }: { locale: string }) {
  const blogData = await getCachedHomeBlogs(locale).catch(() => null);
  const posts = (blogData?.data || [])
    .filter((item: { show_in_home_page?: boolean }) => item.show_in_home_page)
    .slice(0, 4)
    .map(slimBlogForHome);
  if (!posts.length) return null;
  return <OurStory data={posts} locale={locale} />;
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
  const offers = (teaserRes?.data ?? []).slice(0, 8).map(slimOfferCard);
  if (!featured && !offers.length) return null;
  return (
    <OffersTeaserRail
      offers={offers}
      locale={locale}
      serverTime={teaserRes?.server_time}
    />
  );
}

export async function DeferredClientReviews({ locale }: { locale: string }) {
  const clientReviews = await ClientAPI.getClientReviews(locale, {
    active: true,
  });
  if (!clientReviews?.data?.length) return null;
  return (
    <ClientReviewsSection
      locale={locale}
      reviews={clientReviews.data.slice(0, 9).map(slimClientReview)}
    />
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
      reviews={reservationReviews.data.slice(0, 8).map(slimReservationReview)}
      locale={locale}
    />
  );
}
