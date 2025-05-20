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
<div  className="main-container flex justify-center items-center rtl:ltr ltr:rtl relative w-full max-w-[1280px] mx-auto h-auto px-4 lg:px-0">
  {/* Background layer */}
  <div className="relative  w-full max-w-[1280px] h-[626px] bg-[#143087] rounded-[32px] top-0 left-1/2 transform -translate-x-1/2" />

  {/* Left Illustration Section */}
  <div className="absolute w-[90%] xl:max-w-[585.48px] h-[586px] top-1/2 left-4 lg:left-[55px] transform -translate-y-1/2 hidden md:flex opacity-30 xl:opacity-100  xl:z-[37]">
        <div className="w-full h-full absolute top-0 left-0 z-[49]">
          <div className="w-[16.55%] h-full absolute top-0 left-[41.77%] z-[53]">
            <div className="w-[96.766px] h-[96.765px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-12/50utCwbnxz.png)] bg-[length:100%_100%] bg-no-repeat relative z-[51] mt-0 mr-0 mb-0 ml-[0.15px]" />
            <div className="w-[96.766px] h-[96.765px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-12/r6PfNouPne.png)] bg-[length:100%_100%] bg-no-repeat relative z-[53] mt-[392.473px] mr-0 mb-0 ml-0" />
          </div>
          <div className="w-[28.69%] h-[75.47%] absolute top-[12.24%] left-[71.31%] z-[57]">
            <div className="w-[96.766px] h-[96.764px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-12/goV1ZBhMPe.png)] bg-[length:100%_100%] bg-no-repeat relative z-50 mt-0 mr-0 mb-0 ml-0" />
            <div className="w-[95.867px] h-[95.865px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-12/NyGEJOt4hS.png)] bg-[length:100%_100%] bg-no-repeat relative z-[57] mt-[76.64px] mr-0 mb-0 ml-[72.094px]" />
            <div className="w-[95.95px] h-[95.948px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-12/ZP1zQ9Wp2z.png)] bg-[length:100%_100%] bg-no-repeat relative z-[52] mt-[77.037px] mr-0 mb-0 ml-[0.42px]" />
          </div>
          <div className="w-[28.76%] h-[75.54%] absolute top-[12.24%] left-0 z-[56]">
            <div className="w-[96.766px] h-[96.765px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-12/x4f7OnQqiM.png)] bg-[length:100%_100%] bg-no-repeat relative z-[56] mt-0 mr-0 mb-0 ml-[71.631px]" />
            <div className="w-[96.766px] h-[96.765px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-12/mbEKDrZRdM.png)] bg-[length:100%_100%] bg-no-repeat relative z-[55] mt-[76.177px] mr-0 mb-0 ml-0" />
            <div className="w-[96.766px] h-[96.765px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-12/5v7JZZ9VrZ.png)] bg-[length:100%_100%] bg-no-repeat relative z-[54] mt-[76.187px] mr-0 mb-0 ml-[71.637px]" />
          </div>
        </div>
        <div className="w-[64.67%] h-[83.31%] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-12/9yeuLJ61Th.png)] bg-[length:100%_100%] bg-no-repeat absolute top-[8.36%] left-[17.46%] z-[58]" />
        <div className="w-[20.4%] h-[57.19%] absolute top-[21.33%] left-[39.87%] z-[38]">
          <div className="w-[92.64%] h-[98.72%] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-12/idL53tFgAc.png)] bg-[length:100%_100%] bg-no-repeat absolute top-0 left-[3.46%] z-[39]" />
          <div className="w-full h-[88.97%] absolute top-[11.03%] left-0 z-40">
            <div className="w-[32.58%] h-[95.36%] absolute top-0 left-[21.13%] z-[48]">
              <div className="w-[23.915px] h-[23.915px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-12/J13pLcXupX.png)] bg-[length:100%_100%] bg-no-repeat relative z-[41] mt-0 mr-0 mb-0 ml-[14.988px]" />
              <div className="w-[23.915px] h-[23.915px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-12/XNuv79fZL6.png)] bg-[length:100%_100%] bg-no-repeat relative z-[48] mt-[100.535px] mr-0 mb-0 ml-0" />
              <div className="w-[23.915px] h-[23.915px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-12/PJ2EejeYoO.png)] bg-[length:100%_100%] bg-no-repeat relative z-[47] mt-[112.083px] mr-0 mb-0 ml-[3.205px]" />
            </div>
            <div className="w-[26.59%] h-[41.91%] absolute top-[6.85%] left-[73.41%] z-[44]">
              <div className="w-[23.915px] h-[23.915px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-12/ywzZzPVFSr.png)] bg-[length:100%_100%] bg-no-repeat relative z-[43] mt-0 mr-0 mb-0 ml-0" />
              <div className="w-[23.915px] h-[23.915px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-12/ZpqcdQGqyM.png)] bg-[length:100%_100%] bg-no-repeat relative z-[44] mt-[77.127px] mr-0 mb-0 ml-[7.832px]" />
            </div>
            <div className="w-[20.03%] h-[8.02%] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-12/D42eaVRfv4.png)] bg-[length:100%_100%] bg-no-repeat absolute top-[22.21%] left-0 z-[42]" />
            <div className="w-[20.19%] h-[34.82%] absolute top-[65.18%] left-[56.65%] z-[46]">
              <div className="w-[23.915px] h-[23.915px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-12/wsPkNPbLk1.png)] bg-[length:100%_100%] bg-no-repeat relative z-[45] mt-0 mr-0 mb-0 ml-0" />
              <div className="w-[23.915px] h-[23.915px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-12/wUEaQ8tyJL.png)] bg-[length:100%_100%] bg-no-repeat relative z-[46] mt-[55.984px] mr-0 mb-0 ml-[0.19px]" />
            </div>
          </div>
        </div>
  </div>

  {/* end Text Content */}
  <div className="absolute flex flex-col gap-8 items-center justify-center w-[85%]  xl:w-[90%] xl:max-w-[534px] h-auto top-[32px] lg:end-4 lg:left-[714px] z-[1]">
    <div className="flex flex-col gap-4 items-end w-full">
      <div className="w-full xl:max-w-[301px]">
        <span className="block text-[28px] lg:text-[36px] font-bold leading-[1.2] text-white text-end">
          أين موضع الألم ؟
        </span>
      </div>
      <div className="w-full xl:max-w-[452px]">
        <span className="block text-[14px] lg:text-[16px] leading-[24px] text-white text-end">
          حدد الجزء الذي يؤلمك لتحصل على استشارة من القسم المناسب
        </span>
      </div>
    </div>

    {/* Cards */}
    <div className="flex flex-col gap-6 w-full">
      {/* Card 1 */}
      <div className="relative h-[210px] w-full">
        <div className="absolute inset-0 bg-white rounded-[24px] z-10" />
        <div className="absolute top-0 end-0 w-[141px] h-full bg-[url('https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-12/2NBkFsX4EP.png')] bg-cover bg-no-repeat rounded-[24px] z-20" />
        <div className="absolute left-[-6%] top-1/2 transform -translate-y-1/2 w-[76.78%] h-[154px] flex flex-col gap-5 items-end z-30">
          <div className="flex flex-col gap-4 items-end w-full">
            <span className="text-[#62a0f6] font-bold text-[16px] lg:text-[20px] leading-[30px] text-end">
              جلسة علاجية في راحة منزلك
            </span>
            <p className="text-[14px] lg:text-[16px] w-[328px]  leading-[24px] text-[#1e1e1e] text-end">
              جلسات علاج طبيعي وتأهيل في منزلك، بأمان وخصوصية، وفي الوقت اللي يناسبك.
            </p>
          </div>
          <button className="flex items-center gap-2 bg-[#143087] text-white text-sm font-medium px-4 py-2 rounded-md">
            <img src="https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-12/SFdZenu6Zj.png" alt="arrow" className="w-3 h-3" />
            احجز استشارتك الان
          </button>
        </div>
      </div>

      {/* Card 2 */}
      <div className="relative h-[210px] w-full">
        <div className="absolute inset-0 bg-white rounded-[24px] z-10" />
        <div className="absolute top-0 end-0 w-[141px] h-full bg-[url('https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-12/2NBkFsX4EP.png')] bg-cover bg-no-repeat rounded-[24px] z-20" />
        <div className="absolute left-[-6%] top-1/2 transform -translate-y-1/2 w-[76.78%] h-[154px] flex flex-col gap-5 items-end z-30">
          <div className="flex flex-col gap-4 items-end w-full">
            <span className="text-[#62a0f6] font-bold text-[16px] lg:text-[20px] leading-[30px] text-end">
              جلسة علاجية في راحة منزلك
            </span>
            <p className="text-[14px] lg:text-[16px] w-[328px]  leading-[24px] text-[#1e1e1e] text-end">
              جلسات علاج طبيعي وتأهيل في منزلك، بأمان وخصوصية، وفي الوقت اللي يناسبك.
            </p>
          </div>
          <button className="flex items-center gap-2 bg-[#143087] text-white text-sm font-medium px-4 py-2 rounded-md">
            <img src="https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-12/SFdZenu6Zj.png" alt="arrow" className="w-3 h-3" />
            احجز استشارتك الان
          </button>
        </div>
      </div>
    </div>
  </div>
</div>


<div className="w-full max-w-7xl mx-auto my-16 relative overflow-hidden bg-[#eff6fe] rounded-[32px] shadow-lg">
      <div className="flex flex-col lg:flex-row">

               {/* end side with content - becomes bottom on mobile */}
               <div className="w-full lg:w-1/2 p-6 lg:p-10 flex flex-col justify-center relative">
          <div className="absolute top-0 end-0 w-3/4 h-3/4 z-0 opacity-50 lg:opacity-100">
            <img 
              src="https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-12/ngWJPKbbO8.png" 
              alt="Decorative element" 
              className="w-full h-full object-contain"
            />
          </div>
          
          <div className="flex flex-col gap-8 items-start relative z-10">
            <AppHeader />
            <AppRating />
            <DownloadButtons />
          </div>
        </div>
        {/* Left side with app image - becomes top on mobile */}
        <div className="w-full lg:w-1/2 relative">
          <div className="absolute top-0 left-0 w-full h-full z-10 lg:block hidden">
            <img 
              src="https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-12/scH5Bj0Loc.png" 
              alt="Background shape" 
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="relative z-20 mx-auto lg:mx-0 px-4 py-6 lg:p-0">
            <img 
              src="https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-12/NmXxV1AJjt.png" 
              alt="App screenshot" 
              className="w-full max-w-xs lg:max-w-md mx-auto lg:mx-8 h-auto object-contain"
            />
          </div>
        </div>

 
      </div>
    </div>

<div
  style={{ background: "linear-gradient(135deg, #143087 0%, #111F4C 100%)" }}
  className="main-container w-full max-w-[1280px] h-auto rounded-[24px] relative overflow-hidden mx-auto my-0 flex flex-col lg:flex-row items-center justify-between px-4 py-6"
>
    {/* end Decorative Image */}
  <div className="w-full sm:w-[30%] sm:max-w-[300px] h-[74.24%] min-h-[184px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-12/uFz0LWmGp6.png)] bg-[length:100%_100%] bg-no-repeat  " />


  {/* Center Text */}
  <span className="w-full lg:w-[40%] text-[32px] lg:text-[48px] leading-[48px] lg:leading-[72px] font-medium text-white text-center  my-4">
    استـــــمتع بخصــــــومات
    <br /> تصــــل الي 50%
  </span>
  {/* Left Image */}
  <div className="w-[25%] max-w-[244px] aspect-square bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-12/EO8G8yncmw.png)] bg-cover bg-no-repeat hidden lg:block" />

</div>



<div  className="main-container ltr:rtl rtl:ltr w-full max-w-[1280px] mx-auto my-0 px-4 py-6">
  {/* Header Section */}
  <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
    <div className="flex items-center gap-3 bg-[#143087] text-white px-4 py-2 rounded-[8px] border border-[#143087]">
      <div className="w-6 h-6 bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-12/mpxQvem0Fr.png)] bg-no-repeat bg-contain mt-[6px] ml-2" />
      <span className="text-[18px] font-medium leading-[28px]">جميع المقالات</span>
    </div>
    <div className="flex flex-col gap-2 items-end">
      <span className="text-[16px] font-medium text-[#62a0f6]">اخر المقالات الطبية</span>
      <h2 className="text-[30px] font-semibold leading-[40px] text-[#1e1e1e] text-end">
        استشكف اخر <span className="text-[#62a0f6]">المقالات</span> الطبية
      </h2>
    </div>
  </div>

  {/* Articles Section */}
  <div className="flex flex-col lg:flex-row gap-8 mt-12">
    {/* Left Column */}
    <div className="flex flex-col gap-8 flex-1">
      {[0, 1].map((_, i) => (
        <div key={i} className="relative bg-[#eff6fe] rounded-[24px] p-5">
          <div className="flex flex-col md:flex-row items-center gap-5">
            {/* Article Text */}
            <div className="flex flex-col gap-5 text-end items-end max-w-[353px]">
              <span className="text-[16px] font-medium text-[#62a0f6]">3 ديسمبر 2025</span>
              <div>
                <h3 className="text-[20px] font-semibold text-[#1e1e1e] mb-2">اخر تطورات المجال الطبي</h3>
                <p className="text-[16px] font-light text-[#1e1e1e] leading-[32px]">
                  هنا يكتب وصف بسيط عن المنتج في سطرين كمثال , هنا يكتب وصف بسيط عن المنتج في سطرين كمثال.
                </p>
              </div>
              <div className="relative w-14 h-14">
                <div className="absolute top-0 left-0 w-full h-full rounded-full border border-white bg-[#143087] z-0" />
                <div className="absolute top-2 left-2 w-[42px] h-[42px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-12/ZbTWGDTrjh.png)] bg-no-repeat bg-contain z-10" />
                <span className="absolute bottom-[-6px] end-0 text-[12px] text-white ">عرض المزيد</span>
              </div>
            </div>
            {/* Image */}
            <div className="w-[219px] h-[268px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-12/M4Q6t7QDVk.png)] bg-cover bg-no-repeat rounded-[20px]" />
          </div>
        </div>
      ))}
    </div>

    {/* end Column */}
    <div className="flex flex-col items-end bg-[#eff6fe] rounded-[24px] p-6 w-full max-w-[612px]">
      <div className="w-full h-[370px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-12/M4Q6t7QDVk.png)] bg-cover bg-no-repeat rounded-[20px] mb-6" />
      <span className="text-[16px] font-medium text-[#62a0f6] mb-2 text-end">3 ديسمبر 2025</span>
      <h3 className="text-[20px] font-semibold text-[#1e1e1e] text-end mb-2">اخر تطورات المجال الطبي</h3>
      <p className="text-[16px] font-light text-[#1e1e1e] leading-[32px] text-end mb-4">
        هنا يكتب وصف بسيط عن المنتج في سطرين كمثال , هنا يكتب وصف بسيط عن المنتج في سطرين كمثال.
      </p>
      <div className="relative w-14 h-14">
        <div className="absolute top-0 left-0 w-full h-full rounded-full border border-white bg-[#143087] z-0" />
        <div className="absolute top-2 left-2 w-[42px] h-[42px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-12/4CQTrjhrHj.png)] bg-no-repeat bg-contain z-10" />
        <span className="absolute bottom-[-6px] end-0 text-[12px] text-white ">عرض المزيد</span>
      </div>
    </div>
  </div>
</div>

<div  className="main-container w-full max-w-[1280px] xl:h-[913px] relative mx-auto my-0">
      <div className="flex w-full max-w-[610px] flex-col gap-[16px] items-end  relative z-[24] mt-[60px] mx-auto">
        <div className="flex gap-[10px] justify-center items-center self-stretch   relative z-[25]">
          <div className="w-[610px]  text-[30px] font-semibold leading-[40px] relative text-center xl:text-start  z-[26]">
            <span className="text-[30px] font-semibold leading-[40px] text-[#1e1e1e] relative text-start">
              اطلب الان{" "}
            </span>
            <span className="text-[30px] font-semibold leading-[40px] text-[#62a0f6] relative text-start">
              الكارت الطبي
            </span>
            <span className="text-[30px] font-semibold leading-[40px] text-[#1e1e1e] relative text-start">
              {" "}
              الخاص بــ{" "}
            </span>
            <span className="text-[30px] font-semibold leading-[40px] text-[#62a0f6] relative text-start">
              هوم هيلرز
            </span>
          </div>
        </div>
        <div className="flex gap-[10px] justify-center items-center self-stretch   relative z-[27]">
          <span className="flex w-[564px]  justify-center items-start  basis-auto text-[16px] font-medium leading-[24px] text-[#1e1e1e] relative text-center  z-[28]">
            اطلب الان الكارت الطبي واستمتع بكل المميزات المتاحة الان
          </span>
        </div>
      </div>
      <div className="flex w-full max-w-[1075px] flex-col gap-[24px] items-center justify-center  relative z-[1] mt-[33px] mx-auto">
        <div className="flex gap-5 xl:gap-[86px] flex-col md:flex-row flex-wrap justify-center items-center    relative z-[2]">
          <div className="w-[301px] h-[227px] flex justify-center  relative z-[15]">
            <div className="flex w-[26.91%] h-[35.68%] pt-[16px] pr-[16px] pb-[16px] pl-[16px] gap-[10px] justify-center items-center  bg-[#00b5b4] rounded-[50%] border-solid border-4 border-[#fff] absolute top-[-10%]   box-content z-[18]">
              <div className="w-[56px] h-[56px]  relative overflow-hidden z-[19] flex justify-center items-center">
                <div className="w-[44.333px] h-[46.667px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-13/oyagdjg0Uw.png)] bg-[length:100%_100%] bg-no-repeat relative z-20 " />
              </div>
            </div>
            <div className="w-full h-[83.26%] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-13/MYzDAtQX71.png)] bg-[length:100%_100%] bg-no-repeat absolute top-[16.74%] start-0 z-[16]" />
            <span className="flex w-[275px] h-[26.43%] justify-center items-start text-[20px] font-semibold leading-[30px] text-[#fff] absolute top-[45.37%] start-[4.32%] text-center overflow-hidden z-[17]">
              يغطي أكثر من 4000
              <br />
              مؤسسة طبية
            </span>
          </div>
        
          <div className="w-[301px] h-[227px] flex justify-center  relative z-[9]">
            <div className="flex w-[26.91%] h-[35.68%] pt-[16px] pr-[16px] pb-[16px] pl-[16px] gap-[10px] justify-center items-center  bg-[#62a0f6] rounded-[50%] border-solid border-4 border-[#fff] absolute top-[-10%]  box-content z-[12]">
              <div className="w-[56px] h-[56px]  relative overflow-hidden z-[13] flex justify-center items-center">
                <div className="w-[46.667px] h-[46.667px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-13/rLXfmB2tP2.png)] bg-[length:100%_100%] bg-no-repeat relative z-[14] " />
              </div>
            </div>
            <div className="w-full h-[83.26%] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-13/KFeLeCb3fU.png)] bg-[length:100%_100%] bg-no-repeat absolute top-[16.74%] start-0 z-10" />
            <span className="flex w-[275px] h-[26.43%] justify-center items-start text-[20px] font-semibold leading-[30px] text-[#fff] absolute top-[45.37%] start-[4.32%] text-center overflow-hidden z-[11]">
              خصومات متنوعة قد تصل
              <br />
              الي 90%
            </span>
          </div>
          
            <div className="w-[301px] h-[227px] flex justify-center  relative z-[3]">
            <div className="flex w-[26.91%] h-[35.68%] pt-[16px] pr-[16px] pb-[16px] pl-[16px] gap-[10px] justify-center items-center  bg-[#5ad0ae] rounded-[50%] border-solid border-4 border-[#fff] absolute top-[-10%]  box-content z-[6]">
              <div className="w-[56px] h-[56px]  relative overflow-hidden z-[7] flex justify-center items-center">
                <div className="w-[42px] h-[46.667px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-13/vqOoD1wwb0.png)] bg-[length:100%_100%] bg-no-repeat relative z-[8] " />
              </div>
            </div>
            <div className="w-full h-[83.26%] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-13/TzRKwKqjBT.png)] bg-[length:100%_100%] bg-no-repeat absolute top-[16.74%] start-0 z-[4]" />
            <span className="flex w-[275px] h-[26.43%] justify-center items-start text-[20px] font-semibold leading-[30px] text-[#fff] absolute top-[45.37%] start-[4.32%] text-center z-[5]">
              كل الخدمات والتخصصات التي تحتاجها
            </span>
          </div>
        </div>
        <div className="flex w-full max-w-[480px] flex-col gap-[32px] items-center   relative z-[21]">
          <div className="h-[290px] self-stretch  bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-13/Z6UVEmXVtZ.png)] bg-contain md:bg-cover bg-no-repeat relative z-[22]" />
          <div className="w-[284px] h-[15px]  bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-13/b2JSAU4rDG.png)] bg-cover bg-no-repeat relative z-[23]" />
        </div>
      </div>
      <div className="flex w-[255px] h-[56px] pt-[8px] pr-[16px] pb-[8px] pl-[16px] gap-[10px] justify-center items-center  bg-[#143087] rounded-[8px] border-solid border border-[#143087] relative z-[29] mt-[56px] mx-auto">
       
        <span className="h-[28px] shrink-0  basis-auto text-[18px] font-medium leading-[28px] text-[#fff] relative text-start  z-[32]">
          اطلب الكارت الطبي الان
        </span>
         <div className="w-[24px] h-[24px]  relative overflow-hidden z-30">
          <div className="w-[6px] h-[12px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-13/8uahaxtM0H.png)] bg-[length:100%_100%] bg-no-repeat relative z-[31] mt-[6px]  ms-[9px]" />
        </div>
      </div>
      <div className="w-[1280px] h-[913px]  rounded-[32px] absolute top-0 start-1/2 translate-x-[-50%] translate-y-0" />
    </div>

      </div>
    </div>
  );
};

export default Home;
