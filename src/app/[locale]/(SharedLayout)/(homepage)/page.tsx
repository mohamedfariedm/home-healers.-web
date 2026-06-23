import initTranslations from "@/app/i18n";
import {
  AboutApp,
  Hero,
  OurStory,
  BeCloser,
  DownloadApp,
  Bannar,
  Card,
  ReservationReviewsSection,
} from "./_components";
import ClientAPI from "../../../api/api";
import { createMetadata } from "@/lib/seo";
import PackagesSection from "./_components/PackagesSection";
import { createBreadcrumbSchema, renderJsonLd } from "@/lib/structured-data";
import ClientReviewsSection from "./_components/ClientReviewsSection";
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
  const seo = settings?.data[0]?.setting?.seo;

  return createMetadata(seo?.["home"], locale, "", {
    title: "Home Hellers",
    description: "Home Hellers app",
  });
}
async function page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const homeData = await ClientAPI.getHomeData(locale);
  const blogData = await ClientAPI.getAllBlogs(locale);
  const packageData = await ClientAPI.getPackages(locale);
  const servicesData = await ClientAPI.getAllServices(locale);
  const reservationReviews = await ClientAPI.getActiveReservationReviews(locale, {
    limit: 10,
    page: 1,
  });
  const clientReviews = await ClientAPI.getClientReviews(locale, { active: true });
  console.log("clientReviews response:", clientReviews);

  // Find sections by ID
  const heroSection = homeData?.data?.sections?.find(
    (section: any) => section?.id === 12
  );
  const aboutAppSection = homeData?.data?.sections?.find(
    (section: any) => section?.id === 1
  );
  const aboutHomeSection = homeData?.data?.sections?.find(
    (section: any) => section?.id === 2
  );
  const beCloserSection = homeData?.data?.sections?.find(
    (section: any) => section?.id === 3
  );
  const downloadAppSection = homeData?.data?.sections?.find(
    (section: any) => section?.id === 4
  );
  const cardSection = homeData?.data?.sections?.find(
    (section: any) => section?.id === 5
  );

  const settings = await ClientAPI.getSettings(locale);
  const homeBanners = settings?.data?.[0]?.setting?.banners?.filter(
    (banner: any) => banner.page === "home" && banner.type === "web"
  );
  const seo = settings?.data[0]?.setting?.seo["home"];

  console.log({ homeBanners });
  // Generate breadcrumb schema for homepage
  const breadcrumbSchema = createBreadcrumbSchema([
    {
      name: "Home",
      url: `https://home-healers.com${locale === "ar" ? "" : "/en"}`,
    },
  ]);

  return (
    <div className="main-container w-full xl:w-[1440px] bg-[#fff] relative overflow-hidden mx-auto my-0">
      {/* Breadcrumb Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: renderJsonLd(breadcrumbSchema) }}
      />
      <div className="w-full xl:w-[489.058px] bg-[url(/assets/images/homepage/home-decoration.png)] bg-[length:100%_100%] bg-no-repeat relative" />
      <div>
        <h1 className="absolute text-4xl font-bold text-center mb-4 -z-50">
          {seo?.[locale]?.title}
        </h1>
        <div className="w-full xl:w-[1440px] h-[1px] bg-[#fff] relative shadow-[0_1px_2px_0_rgba(16,24,40,0.06)] mt-0 mr-0 mb-0 ml-0" />
        <Hero locale={locale} section={heroSection} />
        <AboutApp
          locale={locale}
          data={servicesData?.data}
          aboutHomeSection={aboutHomeSection}
          section={aboutAppSection}
        />
        <BeCloser locale={locale} section={beCloserSection} />
        <DownloadApp section={downloadAppSection} locale={locale} />
        {packageData?.data && packageData?.data?.length > 0 && (
          <PackagesSection locale={locale} data={packageData?.data} />
        )}
        {homeBanners?.length > 0 &&
          homeBanners.map((banner: any, index: number) => (
            <Bannar key={index} banner={banner} />
          ))}

        <OurStory data={blogData?.data} locale={locale} />
{clientReviews?.data && clientReviews?.data?.length > 0 && (
          <ClientReviewsSection locale={locale} reviews={clientReviews.data} />
        )}
        {reservationReviews?.data && reservationReviews?.data?.length > 0 && (
          <ReservationReviewsSection
            reviews={reservationReviews.data}
            locale={locale}
          />
        )}
        <Card locale={locale} section={cardSection} />

      </div>
    </div>
  );
};

export default page;
