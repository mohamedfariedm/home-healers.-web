import { Suspense } from "react";
import dynamic from "next/dynamic";
import {
  AboutApp,
  Hero,
  Bannar,
} from "./_components";
import ClientAPI from "../../../api/api";
import { createMetadata } from "@/lib/seo";
import { createBreadcrumbSchema, renderJsonLd } from "@/lib/structured-data";
import { getCachedHomeData, getCachedSettings } from "@/lib/cached-api";
import { getHeroImageUrls } from "@/lib/image-url";
import {
  DeferredClientReviews,
  DeferredOurStory,
  DeferredPackages,
  DeferredReservationReviews,
} from "./_components/DeferredSections";

const BeCloser = dynamic(() => import("./_components/BeCloser"));
const DownloadApp = dynamic(() => import("./_components/DownloadApp"));
const Card = dynamic(() => import("./_components/Card"));

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const [settings] = await Promise.all([
    getCachedSettings(locale),
  ]);
  const seo = settings?.data[0]?.setting?.seo;

  return createMetadata(seo?.["home"], locale, "", {
    title: "Home Hellers",
    description: "Home Hellers app",
  });
}

async function page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const [homeData, settings, categoriesData] = await Promise.all([
    getCachedHomeData(locale),
    getCachedSettings(locale),
    ClientAPI.getCategories(locale),
  ]);

  console.log(
    "[Homepage Categories API Response]",
    JSON.stringify(categoriesData, null, 2),
  );

  const heroSection = homeData?.data?.sections?.find(
    (section: { id: number }) => section?.id === 12,
  );
  const heroImages = getHeroImageUrls(heroSection?.Posts?.[0]?.attachment);
  const heroImage = heroImages[0];
  const aboutAppSection = homeData?.data?.sections?.find(
    (section: { id: number }) => section?.id === 1,
  );
  const aboutHomeSection = homeData?.data?.sections?.find(
    (section: { id: number }) => section?.id === 2,
  );
  const beCloserSection = homeData?.data?.sections?.find(
    (section: { id: number }) => section?.id === 3,
  );
  const downloadAppSection = homeData?.data?.sections?.find(
    (section: { id: number }) => section?.id === 4,
  );
  const cardSection = homeData?.data?.sections?.find(
    (section: { id: number }) => section?.id === 5,
  );

  const homeBanners = settings?.data?.[0]?.setting?.banners?.filter(
    (banner: { page: string; type: string }) =>
      banner.page === "home" && banner.type === "web",
  );
  const seo = settings?.data[0]?.setting?.seo["home"];

  const breadcrumbSchema = createBreadcrumbSchema([
    {
      name: "Home",
      url: `https://home-healers.com${locale === "ar" ? "" : "/en"}`,
    },
  ]);

  return (
    <div className="main-container w-full xl:w-[1440px] bg-[#fff] relative overflow-hidden mx-auto my-0">
      {heroImage ? (
        <link rel="preload" as="image" href={heroImage} fetchPriority="high" />
      ) : null}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: renderJsonLd(breadcrumbSchema) }}
      />
      <div>
        <h1 className="absolute text-4xl font-bold text-center mb-4 -z-50">
          {seo?.[locale]?.title}
        </h1>
        <div className="w-full xl:w-[1440px] h-[1px] bg-[#fff] relative shadow-[0_1px_2px_0_rgba(16,24,40,0.06)] mt-0 mr-0 mb-0 ml-0" />
        <Hero locale={locale} section={heroSection} />
        <AboutApp
          locale={locale}
          data={categoriesData?.data}
          aboutHomeSection={aboutHomeSection}
          section={aboutAppSection}
        />
        <BeCloser locale={locale} section={beCloserSection} />
        <DownloadApp section={downloadAppSection} locale={locale} />
        <Suspense fallback={null}>
          <DeferredPackages locale={locale} />
        </Suspense>
        {homeBanners?.length > 0 &&
          homeBanners.map(
            (banner: { id?: number }, index: number) => (
              <Bannar key={banner.id ?? index} banner={banner} />
            ),
          )}
        <Suspense fallback={null}>
          <DeferredOurStory locale={locale} />
        </Suspense>
        <Suspense fallback={null}>
          <DeferredClientReviews locale={locale} />
        </Suspense>
        <Suspense fallback={null}>
          <DeferredReservationReviews locale={locale} />
        </Suspense>
        <Card locale={locale} section={cardSection} />
      </div>
    </div>
  );
}

export default page;
