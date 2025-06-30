import initTranslations from "@/app/i18n";
import { Container } from "@/components/Layout";
import { Separator } from "@/components/ui/separator";
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

const Home = async ({ params: { locale } }: { params: { locale: string } }) => {
  const { t } = await initTranslations(locale, ["homepage"]);
  const homeData = await ClientAPI.getHomeData(locale);
  const blogData = await ClientAPI.getAllBlogs(locale);

  // Find sections by ID
  const heroSection = homeData?.data.sections.find((section: any) => section.id === 12);
  const aboutAppSection = homeData?.data.sections.find((section: any) => section.id === 1);
  const beCloserSection = homeData?.data.sections.find((section: any) => section.id === 3);
  const downloadAppSection = homeData?.data.sections.find((section: any) => section.id === 4);
  const cardSection = homeData?.data.sections.find((section: any) => section.id === 5);

  return (
    <div className="main-container w-full xl:w-[1440px] bg-[#fff] relative overflow-hidden mx-auto my-0">
      <div className="w-full xl:w-[489.058px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-05/Xam6EEVohV.png)] bg-[length:100%_100%] bg-no-repeat relative" />
      <div>
        <div className="w-full xl:w-[1440px] h-[1px] bg-[#fff] relative shadow-[0_1px_2px_0_rgba(16,24,40,0.06)] mt-0 mr-0 mb-0 ml-0" />
        <Hero locale={locale} section={heroSection} />
        <AboutApp locale={locale} section={aboutAppSection} />
        <BeCloser locale={locale} section={beCloserSection} />
        <DownloadApp section={downloadAppSection} />
        <Bannar />
        <OurStory data={blogData.data} locale={locale} />
        <Card locale={locale} section={cardSection} />
      </div>
    </div>
  );
};

export default Home;