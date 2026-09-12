import { Suspense } from "react";
import nextDynamic from "next/dynamic";
import { AboutApp, Bannar } from "./_components";
import Hero from "./_components/Hero";
import { getHeroImageUrls } from "@/lib/image-url";
import { createMetadata } from "@/lib/seo";
import { createBreadcrumbSchema, renderJsonLd } from "@/lib/structured-data";
import {
  getCachedCategories,
  getCachedHomeData,
  getCachedSettings,
} from "@/lib/cached-api";
import {
  slimBanner,
  slimCategoryCard,
  slimHomeSection,
} from "@/lib/public-payload";
import {
  DeferredClientReviews,
  DeferredOurStory,
  DeferredOffers,
  DeferredReservationReviews,
} from "./_components/DeferredSections";

export const dynamic = "force-dynamic";

const BeCloser = nextDynamic(() => import("./_components/BeCloser"));
const DownloadApp = nextDynamic(() => import("./_components/DownloadApp"));
const Card = nextDynamic(() => import("./_components/Card"));

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
    title: "Home Healers",
    description:
      "Home Healers — in-home physiotherapy and medical rehabilitation in Saudi Arabia",
  });
}

async function page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const [homeData, settings, categoriesData] = await Promise.all([
    getCachedHomeData(locale),
    getCachedSettings(locale),
    getCachedCategories(locale),
  ]);

  const heroSection = homeData?.data?.sections?.find(
    (section: { id: number }) => section?.id === 12,
  );
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
  const breadcrumbSchema = createBreadcrumbSchema([
    {
      name: "Home",
      url: `https://home-healers.com${locale === "ar" ? "" : "/en"}`,
    },
  ]);

  return (
    <div className="main-container w-full xl:w-[1440px] bg-[#fff] relative overflow-hidden mx-auto my-0">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: renderJsonLd(breadcrumbSchema) }}
      />
      <div>
        <div className="w-full xl:w-[1440px] h-[1px] bg-[#fff] relative shadow-[0_1px_2px_0_rgba(16,24,40,0.06)] mt-0 mr-0 mb-0 ml-0" />
        <Hero
          locale={locale}
          section={{
            ...heroSection,
            Posts: (heroSection?.Posts || []).map((post: any) => ({
              ...post,
              attachment: getHeroImageUrls(post.attachment, "").map((original) => ({
                original,
                thumbnail: original,
              })),
            })),
          }}
        />
        <AboutApp
          locale={locale}
          data={(categoriesData?.data || []).slice(0, 6).map(slimCategoryCard)}
          aboutHomeSection={slimHomeSection(aboutHomeSection, 4)}
          section={slimHomeSection(aboutAppSection, 1)}
        />
        <BeCloser locale={locale} section={slimHomeSection(beCloserSection, 6)} />
        <DownloadApp section={slimHomeSection(downloadAppSection, 1)} locale={locale} />
        <Suspense fallback={null}>
          <DeferredOffers locale={locale} />
        </Suspense>
        {homeBanners?.length > 0 &&
          homeBanners.map(
            (banner: { id?: number }, index: number) => (
              <Bannar key={banner.id ?? index} banner={slimBanner(banner)} />
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
        <Card locale={locale} section={slimHomeSection(cardSection, 8)} />
      </div>
    </div>
  );
}

export default page;
