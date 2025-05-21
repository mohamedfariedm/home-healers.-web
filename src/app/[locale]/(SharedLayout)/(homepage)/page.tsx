import initTranslations from "@/app/i18n";
import { Container } from "@/components/Layout";
import { Separator } from "@/components/ui/separator";
import {
  AboutApp,
  Articles,
  Hero,
  OurStory,
  Products,
  BeCloser,
  Testimonials,
  DownloadApp,
  Bannar,
  Card,
} from "./_components";
import { Features } from "@/components/Shared";
import CofeTrip from "./_components/CofeTrip";
import HomeAPI from "../../../api/api";
import AppHeader from "./_components/AppHeader";
import AppRating from "./_components/AppRating";
import DownloadButtons from "./_components/DownloadButtons";

const Home = async ({ params: { locale } }: { params: { locale: string } }) => {

  const { t } = await initTranslations(locale, ["homepage"]);


  // const homeData = await HomeAPI.getHomeData(locale);
  // const ClientReview = await HomeAPI.getClientReview(locale);
  // const NewsData = await HomeAPI.getNewsData(locale);

  // const ServiceData = await HomeAPI.getServiceData(locale);
  // const FaqeData = await HomeAPI.getFaqData(locale);
  // const SettingData = await HomeAPI.getSetting(locale);


  return (
    <div className="main-container w-full xl:w-[1440px]  bg-[#fff] relative overflow-hidden mx-auto my-0">
      <div className="w-full xl:w-[489.058px]  bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-05/Xam6EEVohV.png)] bg-[length:100%_100%] bg-no-repeat relative" />
      <div className=" ">
      <div className="w-full xl:w-[1440px] h-[1px] bg-[#fff] relative shadow-[0_1px_2px_0_rgba(16,24,40,0.06)] mt-0 mr-0 mb-0 ml-0"/>
<Hero />
        
        
<AboutApp  />

<Products  />
<BeCloser />
<DownloadApp/>

<Bannar/>

<OurStory  />





<Card/>

      </div>
    </div>
  );
};

export default Home;
