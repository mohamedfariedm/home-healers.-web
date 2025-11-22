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
  params: { locale, slug },
}: {
  params: { locale: string; slug: string[] };
}) {
  const { t } = await initTranslations(locale, ["homepage"]);
  const settings = await ClientAPI.getSettings(locale);
  const seo = settings?.data[0]?.setting?.seo["specialty"];

  return createMetadata(seo, locale, "/booking", {
    title: "Home Hellers",
  });
}

async function Page({ params: { locale } }: PageProps) {
  const { t } = await initTranslations(locale, ["contactUs"]);
  const doctorsData = await ClientAPI.getDoctors(locale);
  const packagesData = await ClientAPI.getPackages(locale);
  const categoriesData = await ClientAPI.getCategories(locale);
  const countriesData = await ClientAPI.getCountries(locale);
  const statesData = await ClientAPI.getStates(locale);
  const servicesData = await ClientAPI.getAllServices(locale);

  return (
    <BookingFlow
      doctorsData={doctorsData}
      servicesData={servicesData}
      packagesData={packagesData}
      categoriesData={categoriesData}
      countriesData={countriesData}
      statesData={statesData}
    />
  );
}

export default Page;
