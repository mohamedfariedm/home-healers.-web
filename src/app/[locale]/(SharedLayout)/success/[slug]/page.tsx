import ClientAPI from "@/app/api/api";
import initTranslations from "@/app/i18n";
import { AnimatedServicesSection } from "@/components/Services";
import PaymentSuccess from "@/components/success";
export const dynamic = "force-dynamic";

type props = {
  params: { locale: string };
};

export async function generateMetadata({
  params: { locale, slug },
}: {
  params: { locale: string; slug: string[] };
}) {
  const { t } = await initTranslations(locale, ["homepage"]);
  const settings = await ClientAPI.getSettings(locale);
  const seo = settings?.data[0]?.setting?.seo["services"];

  return {
    title: seo?.title || "Home Hellers",
    description: seo?.description || "Home Hellers app",
    keywords: seo?.keywords || "Home Hellers, services, healthcare, clinics", // customize if needed
    alternates: {
      canonical: seo?.canonical || `https://home-hellers.com/${locale}`,
    },
    icons: {
      icon: "/assets/images/favicon.ico",
    },
    openGraph: {
      title: seo?.og_title || "Home Hellers",
      description: seo?.og_description || "Home Hellers app",
      url: seo?.canonical || `https://home-hellers.com/${locale}`,
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

async function page({ params: { locale } }: props) {
  const { t } = await initTranslations(locale, ["aboutUs"]);
  const servicesData = await ClientAPI.getAllServices(locale);
  const settings = await ClientAPI.getSettings(locale);

  const homeBanners = settings?.data?.[0]?.setting?.banners?.filter(
    (banner: any) => banner.page === "services"
  );
  return <PaymentSuccess />;
}

export default page;
