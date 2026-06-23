import ClientAPI from "@/app/api/api";
import OurStory from "./OurStory";
import ClientReviewsSection from "./ClientReviewsSection";
import ReservationReviewsSection from "./ReservationReviewsSection";
import PackagesSection from "./PackagesSection";

export async function DeferredOurStory({ locale }: { locale: string }) {
  const blogData = await ClientAPI.getAllBlogs(locale);
  if (!blogData?.data?.length) return null;
  return <OurStory data={blogData.data} locale={locale} />;
}

export async function DeferredPackages({ locale }: { locale: string }) {
  const packageData = await ClientAPI.getPackages(locale);
  if (!packageData?.data?.length) return null;
  return <PackagesSection locale={locale} data={packageData.data} />;
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
