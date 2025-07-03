import initTranslations from "@/app/i18n";
import { AboutAppTwoColumns, Bannar } from "../(homepage)/_components";
import { DoctorsSection, FaqSection, FeaturesSection, HeroBanner, PartnersSection } from "@/components/AboutUs";
import ClientAPI from "@/app/api/api";

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
  const seo = settings.data[0].setting.seo["about-us"];

  return {
    title: seo.title || "Home Hellers",
    description: seo.description || "Home Hellers app",
    keywords: seo.keywords || "Home Hellers, services, healthcare, clinics", // customize if needed
    alternates: {
      canonical: seo.canonical || `https://home-hellers.com/${locale}`,
    },
    icons: {
      icon: "/assets/images/favicon.ico",
    },
    openGraph: {
      title: seo.og_title || "Home Hellers",
      description: seo.og_description || "Home Hellers app",
      url: seo.canonical || `https://home-hellers.com/${locale}`,
      images: [
        {
          url: seo.og_image || "/assets/images/favicon.ico",
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: seo.twitter_title || "Home Hellers",
      description: seo.twitter_description || "Home Hellers app",
      images: [seo.twitter_image || "/assets/images/favicon.ico"],
    },
  };
}

async function page({ params: { locale } }: props) {
  const { t } = await initTranslations(locale, ["aboutUs"]);
  const aboutData = await ClientAPI.getAboutUs(locale);
  const doctorsData = await ClientAPI.getDoctors(locale);
  const faqsData = await ClientAPI.getFAQs(locale);
  const settings = await ClientAPI.getSettings(locale);


    const homeBanners = settings.data[0].setting.banners.filter(
  (banner: any) => banner.page === 'about-us'
);
  return (
    <>
<div className="min-h-screen bg-white">
      <HeroBanner 
        title={"عن هوم هيليرز"}
        breadcrumbItems={[
          { label: "الرئيسية" },
          { label: "عن هوم هيليرز", isActive: true }
        ]}
      />

      <div className="flex flex-col items-center gap-14 mt-24 w-full mx-auto">
        <div className="flex max-w-screen-xl rtl:ltr ltr:rtl flex-col xl:flex-row gap-6 items-center justify-between w-full px-4 xl:px-0">
          {/* This is a placeholder for the AboutAppTwoColumns component which is imported in the original file */}
          <div className="w-full py-8 text-center">
            <AboutAppTwoColumns aboutHomeSection={aboutData?.data?.sections?.[0]} locale={locale} />
          </div>
        </div>
      </div>

      <FeaturesSection data={aboutData?.data?.sections?.[1]} locale={locale} />
              {homeBanners.length > 0 && (
          homeBanners.map((banner: any, index: number) => (
            <Bannar key={index} banner={banner} />
          ))
        )
        }
      <DoctorsSection doctorsData={doctorsData?.data} data={aboutData?.data?.sections?.[2]} locale={locale} />
      <FaqSection faqsData={faqsData?.data} data={aboutData?.data?.sections?.[3]} locale={locale}  />
      <PartnersSection data={aboutData?.data?.sections?.[4]} locale={locale} />
    </div>
    </>
  );
}

export default page;
