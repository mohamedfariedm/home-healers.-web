import ClientAPI from "@/app/api/api";
import ClaimOfferClient from "@/components/offers/claim/ClaimOfferClient";
import {
  slimBookingCategory,
  slimBookingDoctor,
  slimGeoList,
} from "@/lib/public-payload";
import { createNoIndexMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  return createNoIndexMetadata(locale, "/claim-offer", {
    title:
      locale === "ar"
        ? "إكمال العرض | هوم هيلرز"
        : "Complete offer | Home Healers",
    description:
      locale === "ar"
        ? "أكمل بياناتك لتطبيق الخصم وإتمام الحجز"
        : "Complete your details to apply the discount and finish booking",
  });
}

export default async function ClaimOfferPage({ params }: PageProps) {
  const { locale } = await params;

  const [
    doctorsRaw,
    categoriesRaw,
    countriesData,
    statesData,
    nationalitiesData,
  ] = await Promise.all([
    ClientAPI.getDoctors(locale),
    ClientAPI.getCategories(locale),
    ClientAPI.getCountries(locale),
    ClientAPI.getStates(locale),
    ClientAPI.getNationalities(locale),
  ]);

  const doctorsData = {
    data: (Array.isArray(doctorsRaw?.data) ? doctorsRaw.data : []).map(
      slimBookingDoctor,
    ),
  };
  const categoriesData = {
    data: (Array.isArray(categoriesRaw?.data) ? categoriesRaw.data : []).map(
      slimBookingCategory,
    ),
  };

  return (
    <div className="w-full overflow-x-hidden bg-[linear-gradient(180deg,#e8f6f7_0%,#f7f9fc_220px,#f7f9fc_100%)]">
      <ClaimOfferClient
        locale={locale}
        categoriesData={categoriesData}
        doctorsData={doctorsData}
        countriesData={{
          data: slimGeoList(
            Array.isArray(countriesData?.data) ? countriesData.data : [],
          ),
        }}
        statesData={{
          data: slimGeoList(
            Array.isArray(statesData?.data) ? statesData.data : [],
          ),
        }}
        nationalitiesData={nationalitiesData}
      />
    </div>
  );
}
