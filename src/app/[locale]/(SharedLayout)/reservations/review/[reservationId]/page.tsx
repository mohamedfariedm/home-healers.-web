import initTranslations from "@/app/i18n";
import ClientAPI from "@/app/api/api";
import { createMetadata } from "@/lib/seo";
import ReservationReviewForm from "./_components/reservation-review-form";

export const dynamic = "force-dynamic";

type Props = {
  params: { locale: string; reservationId: string };
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string; reservationId: string }> }) {
  const { locale, reservationId } = await params;
  const { t } = await initTranslations(locale, ["review"]);
  const settings = await ClientAPI.getSettings(locale);
  const seo = settings?.data?.[0]?.setting?.seo?.["review"];

  return createMetadata(seo, locale, `/reservations/review/${reservationId}`, {
    title: t("meta.title", "Rate Your Experience - Home Healers"),
    description: t("meta.description", "Share your feedback about your reservation experience"),
  }, { preferPathCanonical: true });
}

async function ReviewPage({ params }: { params: Promise<{ locale: string; reservationId: string }> }) {
  const { locale, reservationId } = await params;
  const { t } = await initTranslations(locale, ["review"]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8 sm:py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <ReservationReviewForm reservationId={reservationId} locale={locale} />
      </div>
    </main>
  );
}

export default ReviewPage;
