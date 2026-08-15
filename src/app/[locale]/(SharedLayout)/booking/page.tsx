import { Suspense } from "react";
import ClientAPI from "@/app/api/api";
import initTranslations from "@/app/i18n";
import BookingFlow from "./_components/booking-flow";
import { createMetadata } from "@/lib/seo";
export const dynamic = "force-dynamic";

type PageProps = {
  params: { locale: string };
};

type CardData = {
  iconUrl: string;
  text: string;
  textColor?: string;
  containerBgColor?: string;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const { t } = await initTranslations(locale, ["homepage"]);
  const settings = await ClientAPI.getSettings(locale);
  const seo = settings?.data[0]?.setting?.seo["specialty"];

  return createMetadata(seo, locale, "/booking", {
    title: "Home Hellers",
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
  const [
    doctorsData,
    packagesData,
    categoriesData,
    countriesData,
    statesData,
    citiesData,
    nationalitiesData,
    servicesData,
    singlePackage,
  ] = await Promise.all([
    ClientAPI.getDoctors(locale),
    ClientAPI.getPackages(locale, { limit: 100 }),
    ClientAPI.getCategories(locale),
    ClientAPI.getCountries(locale),
    ClientAPI.getStates(locale),
    ClientAPI.getCities(locale),
    ClientAPI.getNationalities(locale),
    ClientAPI.getAllServices(locale),
    packageId ? ClientAPI.getPackageById(packageId, locale) : Promise.resolve(null),
  ]);

  const selectedPackage = singlePackage?.data?.[0];
  if (selectedPackage && packagesData?.data) {
    const exists = packagesData.data.some(
      (pkg: { id: number }) => Number(pkg.id) === Number(selectedPackage.id),
    );
    if (!exists) {
      packagesData.data = [selectedPackage, ...packagesData.data];
    }
  }

  return (
    <Suspense fallback={null}>
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
