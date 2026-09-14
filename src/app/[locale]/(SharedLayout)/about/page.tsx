import initTranslations from "@/app/i18n";
import { AboutAppTwoColumns, Bannar } from "../(homepage)/_components";
import {
  DoctorsSection,
  FaqSection,
  FeaturesSection,
  HeroBanner,
  PartnersSection,
} from "@/components/AboutUs";
import { createMetadata } from "@/lib/seo";
import { createFaqPageSchema, renderJsonLd } from "@/lib/structured-data";
import { formatFaqData } from "@/utils/faq-helpers";
import {
  getCachedAboutUs,
  getCachedDoctors,
  getCachedFAQs,
  getCachedSettings,
} from "@/lib/cached-api";
import {
  slimBanner,
  slimDoctorCard,
  slimHomeSection,
  slimSettingsForChrome,
} from "@/lib/public-payload";
import { localePath } from "@/lib/offers";
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const settings = await getCachedSettings(locale);
  const seo = settings?.data[0]?.setting?.seo["about-us"];

  return createMetadata(seo, locale, "/about", {
    title: "Home Healers | About",
    description: "About Home Healers, our doctors, and in-home healthcare services",
  });
}

async function page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const { t } = await initTranslations(locale, ["aboutUs"]);
  const [aboutData, doctorsData, faqsData, settings] = await Promise.all([
    getCachedAboutUs(locale),
    getCachedDoctors(locale),
    getCachedFAQs(locale),
    getCachedSettings(locale),
  ]);

  const homeBanners = settings?.data?.[0]?.setting?.banners?.filter(
    (banner: any) => banner.page === "about-us"&& banner.type === "web"
  );
  
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

  const faqSchema = createFaqPageSchema(formatFaqData(faqsData?.data || [], locale));

  return (
    <>
      {faqSchema ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: renderJsonLd(faqSchema) }}
        />
      ) : null}
      <div className="min-h-screen overflow-x-hidden bg-white">
        <HeroBanner
          title={t("breadcrumb.title")}
          breadcrumbItems={[
            { label: t("home"), href: localePath(locale, "/") },
            { label: t("breadcrumb.name"), isActive: true },
          ]}
        />

        <div className="mx-auto mt-10 flex w-full max-w-screen-xl flex-col items-center px-4 sm:mt-16 lg:mt-24 xl:px-0">
          <AboutAppTwoColumns
            aboutHomeSection={slimHomeSection(aboutSection, 4)}
            locale={locale}
            showCta={false}
          />
        </div>

        <FeaturesSection data={slimHomeSection(featuresSection, 8)} locale={locale} />
        {homeBanners?.length > 0 &&
          homeBanners.map((banner: any, index: number) => (
            <div key={index} className="mx-auto w-full max-w-screen-xl overflow-hidden px-4">
              <Bannar banner={slimBanner(banner)} />
            </div>
          ))}
        <DoctorsSection
          doctorsData={(doctorsData?.data || []).map(slimDoctorCard)}
          data={slimHomeSection(doctorsSection, 2)}
          locale={locale}
        />
        <FaqSection
          faqsData={faqsData?.data}
          data={slimHomeSection(faqSection, 2)}
          locale={locale}
          settings={slimSettingsForChrome(settings)}
        />
        <PartnersSection data={slimHomeSection(partnersSection, 12)} locale={locale} />
      </div>
    </>
  );
}

export default page;
