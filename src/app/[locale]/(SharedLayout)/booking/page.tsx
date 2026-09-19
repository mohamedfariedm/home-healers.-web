import { Suspense } from "react";
import { redirect } from "next/navigation";
import ClientAPI from "@/app/api/api";
import BookingFlow from "./_components/booking-flow";
import { getCachedSettings } from "@/lib/cached-api";
import { offerBookHref } from "@/lib/offers";
import { createMetadata } from "@/lib/seo";
import { getOfferSlug } from "@/lib/slugs";
export const dynamic = "force-dynamic";

function getBookingSeo(settings: any) {
  return (
    settings?.data?.[0]?.setting?.seo?.["booking"] ||
    settings?.data?.[0]?.setting?.seo?.["specialty"]
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const settings = await getCachedSettings(locale);
  const seo = getBookingSeo(settings);

  return createMetadata(seo, locale, "/booking", {
    title: "Home Healers | Booking",
    description: "Book a home physiotherapy session with Home Healers",
  });
}

async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { locale } = await params;
  const sp = await searchParams;
  const packageIdRaw = sp.packageId ?? sp.packageid;
  const packageId = Array.isArray(packageIdRaw) ? packageIdRaw[0] : packageIdRaw;
  const singlePackage = packageId
    ? await ClientAPI.getPackageById(packageId, locale)
    : null;
  const selectedPackage = Array.isArray(singlePackage?.data)
    ? singlePackage.data[0]
    : singlePackage?.data;

  if (String(selectedPackage?.type || "").toLowerCase() === "offer") {
    const slug = getOfferSlug(selectedPackage, locale);
    if (slug) {
      redirect(offerBookHref(locale, slug, selectedPackage.id));
    }
  }

  const [
    doctorsData,
    packagesData,
    categoriesData,
    countriesData,
    statesData,
    citiesData,
    nationalitiesData,
    servicesData,
    settings,
  ] = await Promise.all([
    ClientAPI.getDoctors(locale),
    ClientAPI.getPackages(locale, { limit: 100 }),
    ClientAPI.getCategories(locale),
    ClientAPI.getCountries(locale),
    ClientAPI.getStates(locale),
    ClientAPI.getCities(locale),
    ClientAPI.getNationalities(locale),
    ClientAPI.getAllServices(locale),
    getCachedSettings(locale),
  ]);
  const seo = getBookingSeo(settings);

  if (selectedPackage && packagesData?.data) {
    const exists = packagesData.data.some(
      (pkg: { id: number }) => Number(pkg.id) === Number(selectedPackage.id),
    );
    if (!exists) {
      packagesData.data = [selectedPackage, ...packagesData.data];
    }
  }

  const heading =
    seo?.[locale]?.h1 ||
    seo?.[locale]?.title ||
    (locale === "ar" ? "احجز جلستك" : "Book Your Session");

  return (
    <Suspense fallback={null}>
      <h1 className="absolute text-4xl font-bold text-center mb-4 -z-50">
        {heading}
      </h1>
      <BookingFlow
          locale={locale}
          doctorsData={doctorsData}
          servicesData={servicesData}
          packagesData={packagesData}
          categoriesData={categoriesData}
          countriesData={countriesData}
          statesData={statesData}
          citiesData={citiesData}
          nationalitiesData={nationalitiesData}
        />
    </Suspense>
  );
}

export default Page;
