import initTranslations from "@/app/i18n";
import { AboutAppTwoColumns, Bannar } from "../(homepage)/_components";
import {
  DoctorsSection,
  FaqSection,
  FeaturesSection,
  HeroBanner,
  PartnersSection,
} from "@/components/AboutUs";
import ClientAPI from "@/app/api/api";
import { createMetadata } from "@/lib/seo";
export const dynamic = "force-dynamic";

type props = {
  params: { locale: string };
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const settings = await ClientAPI.getSettings(locale);
  const seo = settings?.data[0]?.setting?.seo["about-us"];

  return createMetadata(seo, locale, "/about-us", {
    title: "Home Hellers",
  });
}

async function page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const { t } = await initTranslations(locale, ["aboutUs"]);
  const aboutData = await ClientAPI.getAboutUs(locale);
  const doctorsData = await ClientAPI.getDoctors(locale);
  const faqsData = await ClientAPI.getFAQs(locale);
  const settings = await ClientAPI.getSettings(locale);

  const seo = settings?.data[0]?.setting?.seo["about-us"];

  const homeBanners = settings?.data?.[0]?.setting?.banners?.filter(
    (banner: any) => banner.page === "about-us"&& banner.type === "web"
  );
  console.log("aboutData", aboutData);

  // Find sections by ID
  const aboutSection = aboutData?.data?.sections?.find(
    (section: any) => section?.id === 7
  );
  const featuresSection = aboutData?.data?.sections?.find(
    (section: any) => section?.id === 8
  );
  const doctorsSection = aboutData?.data?.sections?.find(
    (section: any) => section?.id === 9
  );
  const faqSection = aboutData?.data?.sections?.find(
    (section: any) => section?.id === 10
  );
  const partnersSection = aboutData?.data?.sections?.find(
    (section: any) => section?.id === 11
  );

  return (
    <>
      <div className="min-h-screen bg-white">
        <h1 className="absolute text-4xl font-bold text-center mb-4 -z-50">
          {seo?.[locale]?.title}
        </h1>

        <HeroBanner
          title={t("breadcrumb.title")}
          breadcrumbItems={[
            { label: t("home") },
            { label: t("breadcrumb.name"), isActive: true },
          ]}
        />

        <div className="flex flex-col items-center gap-14 mt-24 w-full mx-auto">
          <div className="flex max-w-screen-xl rtl:ltr ltr:rtl flex-col xl:flex-row gap-6 items-center justify-between w-full px-4 xl:px-0">
            {/* This is a placeholder for the AboutAppTwoColumns component which is imported in the original file */}
            <div className="w-full py-8 text-center">
              <AboutAppTwoColumns
                aboutHomeSection={aboutSection}
                locale={locale}
              />
            </div>
          </div>
        </div>

        <FeaturesSection data={featuresSection} locale={locale} />
        {homeBanners?.length > 0 &&
          homeBanners.map((banner: any, index: number) => (
            <Bannar key={index} banner={banner} />
          ))}
        <DoctorsSection
          doctorsData={doctorsData?.data}
          data={doctorsSection}
          locale={locale}
        />
        <FaqSection
          faqsData={faqsData?.data}
          data={faqSection}
          locale={locale}
          settings={settings}
        />
        <PartnersSection data={partnersSection} locale={locale} />
      </div>
    </>
  );
}

export default page;
