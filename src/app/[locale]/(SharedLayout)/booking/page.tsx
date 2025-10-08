import ClientAPI from "@/app/api/api";
import initTranslations from "@/app/i18n";
import BookingFlow from "./_components/booking-flow";
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

  return {
    title: seo?.title || "Home Hellers",
    description: seo?.description || "Home Hellers app",
    keywords: seo?.keywords || "Home Hellers, services, healthcare, clinics", // customize if needed
    alternates: {
      canonical:
        seo?.canonical ||
        `https://home-hellers.com${locale === "ar" ? "" : "/en"}`,
    },
    icons: {
      icon: "/assets/images/favicon.ico",
    },
    openGraph: {
      title: seo?.og_title || "Home Hellers",
      description: seo?.og_description || "Home Hellers app",
      url:
        seo?.canonical ||
        `https://home-hellers.com${locale === "ar" ? "" : "/en"}`,
      images: [seo?.og_image || "/assets/images/favicon.ico"],
    },
    twitter: {
      card: "summary_large_image",
      title: seo?.twitter_title || "Home Hellers",
      description: seo?.twitter_description || "Home Hellers app",
      images: [seo?.twitter_image || "/assets/images/favicon.ico"],
    },
  };
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
