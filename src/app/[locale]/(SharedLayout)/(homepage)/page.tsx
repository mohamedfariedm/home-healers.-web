import initTranslations from "@/app/i18n";
import {
  AboutApp,
  Hero,
  OurStory,
  BeCloser,
  DownloadApp,
  Bannar,
  Card,
} from "./_components";
import ClientAPI from "../../../api/api";
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params: { locale, slug },
}: {
  params: { locale: string; slug: string[] };
}) {
  const { t } = await initTranslations(locale, ["homepage"]);
  const settings = await ClientAPI.getSettings(locale);
  const seo = settings?.data[0]?.setting?.seo["about-us"];

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
const Home = async ({ params: { locale } }: { params: { locale: string } }) => {
  const { t } = await initTranslations(locale, ["homepage"]);
  const homeData = await ClientAPI.getHomeData(locale);
  const blogData = await ClientAPI.getAllBlogs(locale);
  const servicesData = await ClientAPI.getAllServices(locale);
  // Find sections by ID
  const heroSection = homeData?.data?.sections?.find(
    (section: any) => section.id === 12
  );
  const aboutAppSection = homeData?.data?.sections?.find(
    (section: any) => section.id === 1
  );
  const aboutHomeSection = homeData?.data?.sections?.find(
    (section: any) => section.id === 2
  );
  const beCloserSection = homeData?.data?.sections?.find(
    (section: any) => section.id === 3
  );
  const downloadAppSection = homeData?.data?.sections?.find(
    (section: any) => section.id === 4
  );
  const cardSection = homeData?.data?.sections?.find(
    (section: any) => section.id === 5
  );

  const settings = await ClientAPI.getSettings(locale);
  const homeBanners = settings.data[0].setting.banners.filter(
    (banner: any) => banner.page === "home"
  );
  const seo = settings?.data[0]?.setting?.seo["home"];

  return (
    <div className="main-container w-full xl:w-[1440px] bg-[#fff] relative overflow-hidden mx-auto my-0">
      <div className="w-full xl:w-[489.058px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-05/Xam6EEVohV.png)] bg-[length:100%_100%] bg-no-repeat relative" />
      <div>
        <h1 className="absolute text-4xl font-bold text-center mb-4 -z-50">
          {seo.title}
        </h1>
        <div className="w-full xl:w-[1440px] h-[1px] bg-[#fff] relative shadow-[0_1px_2px_0_rgba(16,24,40,0.06)] mt-0 mr-0 mb-0 ml-0" />
        <Hero locale={locale} section={heroSection} />
        <AboutApp
          locale={locale}
          data={servicesData.data}
          aboutHomeSection={aboutHomeSection}
          section={aboutAppSection}
        />
        <BeCloser locale={locale} section={beCloserSection} />
        <DownloadApp section={downloadAppSection} locale={locale} />
        {homeBanners.length > 0 &&
          homeBanners.map((banner: any, index: number) => (
            <Bannar key={index} banner={banner} />
          ))}

        <OurStory data={blogData?.data} locale={locale} />
        <Card locale={locale} section={cardSection} />
      </div>
    </div>
  );
};

export default Home;
