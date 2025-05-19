import React from "react";
import initTranslations from "@/app/i18n";
import Link from "next/link";

async function Footer({ locale }: { locale: string }) {
  const { t } = await initTranslations(locale, ["common"]);

  // Social media icons with URLs
  const socialIcons = [
    { url: "#", icon: "/assets/images/socialicons/snapchat.svg" },
    { url: "#", icon: "/assets/images/socialicons/new-twitter.svg" },
    { url: "#", icon: "/assets/images/socialicons/whatsapp.svg" },
    { url: "#", icon: "/assets/images/socialicons/linkedin.svg" },
    { url: "#", icon: "/assets/images/socialicons/instagram.svg" },
  ];

  // Footer navigation links
  const links = [
    { title: t("footer.home"), url: "/" },
    { title: t("footer.products"), url: "/products" },
    { title: t("footer.about"), url: "/about" },
    { title: t("footer.contact"), url: "/contact" },
    { title: t("footer.blogs"), url: "/blogs" },
    { title: t("footer.expo"), url: "/expo" },
    { title: t("footer.faq"), url: "/faq" },
  ]; 

  return (
    <div className=" main-container flex w-full   flex-col gap-px items-start flex-nowrap relative mx-auto my-0">
      <div className="flex flex-col xl:flex-row justify-between items-center mt-12  xl:h-[207px] pt-[75px] xl:pr-[80px] pb-[75px] xl:pl-[80px] gap-[24px] xl:gap-[10px]  self-stretch  flex-nowrap bg-[#143087] border-solid border-t border-t-[#736b7a] relative">
        
        
        <div className="flex  xl:h-[160px] flex-col gap-[36px] xl:gap-[12px] items-start  flex-nowrap  z-[5]">
          <div className="flex xl:w-[736px] gap-[24px] xl:gap-[12px] justify-center items-center  flex-wrap relative z-[6]">
            <div className="xl:w-[160px] xl:h-[160px]  relative overflow-hidden z-[12]">
              <div className="w-[114.738px] h-[127.025px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-12/gwWGBiNjti.png)] bg-[length:100%_100%] bg-no-repeat relative z-[13] mt-[16.5px] mr-0 mb-0 xl:ml-[22.575px]" />
            </div>
            <div className="flex xl:w-[564px] flex-col gap-[24px] xl:gap-[12px] items-start  flex-nowrap relative z-[7]">
              <div className="flex gap-[10px] justify-start items-start self-stretch  flex-nowrap relative z-[8]">
                <div className="xl:w-[275px]   text-[20px] font-semibold leading-[30px] relative text-start z-[9]">
                  <span className=" text-[20px] font-semibold leading-[30px] text-[#fff] relative text-start">
                    اذا كان لديك أي{" "}
                  </span>
                  <span className=" text-[20px] font-semibold leading-[30px] text-[#fff] relative text-start">
                    استفسار
                  </span>
                  <span className=" text-[20px] font-semibold leading-[30px] text-[#fff] relative text-start">
                    {" "}
                    فلا تردد !
                  </span>
                </div>
              </div>
              <div className="flex gap-[10px] justify-center items-center self-stretch  flex-nowrap relative z-10">
                <span className="flex xl:w-[564px] xl:h-[24px] justify-start items-start  basis-auto  text-[16px] font-normal leading-[24px] text-[#fff] relative text-start  z-[11]">
                  قم بالتواصل معنا وسنرد عليك في أسرع وقت ممكن
                </span>
              </div>
            </div>
            
          </div>
        </div>
        <div className="flex  xl:h-[56px] pt-[8px] pr-[16px] pb-[8px] pl-[16px]  gap-[10px] justify-center items-center  flex-nowrap bg-[#62a0f6] rounded-[8px] relative z-[1]">
          <span className="xl:h-[28px]  basis-auto  text-[18px] font-medium leading-[28px] text-[#fff] relative text-start  z-[4]">
            التواصل عبر الواتساب
          </span>
          <div className="w-[24px] h-[24px]  relative overflow-hidden z-[2]">
            <div className="w-[20px] h-[20px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-12/dQL3C1PTC2.png)] bg-[length:100%_100%] bg-no-repeat relative z-[3] mt-[2px] mr-0 mb-0 ml-[2px]" />
          </div>
          
        </div>
      </div>

<div className="w-full bg-[#eff6fe] relative overflow-hidden px-4 md:px-8 lg:px-[60px] py-10">
  <div className="max-w-[1440px] mx-auto flex flex-col lg:flex-row justify-center items-center gap-10 lg:gap-20">
    <div className="w-full max-w-[438px] h-[432px]">
      <div className="flex w-full max-w-[380px] flex-col gap-[32px] items-center relative z-[78] mt-[84px] mx-auto">
        <div className="flex w-full max-w-[321.191px] flex-col gap-[24px] items-center relative z-[79]">
          <div className="flex gap-[14.075px] items-center relative z-[80]">
            <div className="w-[63.058px] h-[60.301px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-12/SKp7H4bUnm.png)] bg-cover bg-no-repeat relative z-[81]" />
            <div className="w-[57.058px] h-[71.814px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-12/PWe640v7e4.png)] bg-cover bg-no-repeat relative z-[82]" />
          </div>
          <div className="flex justify-center items-center w-full relative z-[83]">
            <span className="text-[12px] font-light leading-[16px] text-[#1e1e1e] text-center z-[84]">
              العلامة التجارية Home Healers مسجل بمعروف برقم 217470
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-[32px] items-center w-full relative z-[85]">
          <div className="flex justify-center items-center w-full relative z-[86]">
            <span className="text-[12px] font-medium leading-[24px] text-[#1e1e1e] text-center z-[87]">
              تطبيق وموقع إلكتروني متخصص في تقديم خدمات العلاج
              <br /> الطبيعي والتأهيل الطبي للعملاء في منازلهم
            </span>
          </div>
          <div className="flex gap-[28px] items-center relative z-[88]">
            <div className="flex w-[40px] h-[40px] p-2 items-center bg-[#62a0f6] rounded-[8px] relative z-[95]">
              <div className="w-[24px] h-[24px] flex justify-center items-center relative overflow-hidden z-[96]">
                <div className="w-[20px] h-[20px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-12/xbofKUrvfM.png)] bg-cover bg-no-repeat relative" />
              </div>
            </div>
            <div className="flex w-[40px] h-[40px] p-2 items-center bg-[#62a0f6] rounded-[8px] relative z-[92]">
              <div className="w-[24px] h-[24px] flex justify-center items-center relative overflow-hidden z-[93]">
                <div className="w-[20px] h-[20px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-12/ejCSBuhAsH.png)] bg-cover bg-no-repeat relative" />
              </div>
            </div>
            <div className="flex w-[40px] h-[40px] p-2 items-center bg-[#62a0f6] rounded-[8px] relative z-[89]">
              <div className="w-[24px] h-[24px] flex justify-center items-center relative overflow-hidden z-[90]">
                <div className="w-[14px] h-[20px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-12/Mok2MoGDLG.png)] bg-cover bg-no-repeat relative" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full h-[432px] opacity-60 absolute top-0 right-0 z-[77]" />
    </div>

    <div className="flex items-start  w-full justify-between  flex-wrap gap-10 lg:gap-20 max-w-[832px]">
      {/* <!-- You can now insert your 3 section blocks here unchanged -->
      <!-- Just wrap each group in w-full sm:w-auto or use flex-1 if needed --> */}
      <div className="flex w-[135px] flex-col gap-[32px] items-start  flex-nowrap relative z-[58]">
            <div className="flex w-[117px] flex-col gap-[9px] items-start  flex-nowrap relative z-[59]">
              <div className="flex gap-[10px] justify-center items-center self-stretch  flex-nowrap relative z-[60]">
                <span className="h-[30px]  basis-auto  text-[20px] font-semibold leading-[30px] text-[#143087] relative text-start  z-[61]">
                  روابط سريعة
                </span>
              </div>
              <div className="w-[40px] h-[6px]  bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-12/1tXT90JNoT.png)] bg-cover bg-no-repeat relative z-[62]" />
            </div>
            <div className="flex flex-col gap-[16px] items-start self-stretch  flex-nowrap relative z-[63]">
              <div className="flex w-[81px] gap-[10px] justify-center items-center  flex-nowrap relative z-[64]">
                <span className="h-[24px]  basis-auto  text-[16px] font-normal leading-[24px] text-[#1e1e1e] relative text-start  z-[65]">
                  الرئيسية
                </span>
              </div>
              <div className="flex w-[129px] gap-[10px] justify-center items-center  flex-nowrap relative z-[66]">
                <span className="h-[24px]  basis-auto  text-[16px] font-normal leading-[24px] text-[#1e1e1e] relative text-start  z-[67]">
                  عن هوم هيليرز
                </span>
              </div>
              <div className="flex w-[76px] gap-[10px] justify-center items-center  flex-nowrap relative z-[68]">
                <span className="h-[24px]  basis-auto  text-[16px] font-normal leading-[24px] text-[#1e1e1e] relative text-start  z-[69]">
                  خدماتنا
                </span>
              </div>
              <div className="flex w-[139px] gap-[10px] justify-center items-center  flex-nowrap relative z-[70]">
                <span className="h-[24px]  basis-auto  text-[16px] font-normal leading-[24px] text-[#1e1e1e] relative text-start  z-[71]">
                  المنتجات الطبية
                </span>
              </div>
              <div className="flex w-[80px] gap-[10px] justify-center items-center  flex-nowrap relative z-[72]">
                <span className="h-[24px]  basis-auto  text-[16px] font-normal leading-[24px] text-[#1e1e1e] relative text-start  z-[73]">
                  المدونة
                </span>
              </div>
              <div className="flex w-[110px] gap-[10px] justify-center items-center  flex-nowrap relative z-[74]">
                <span className="h-[24px]  basis-auto  text-[16px] font-normal leading-[24px] text-[#1e1e1e] relative text-start  z-[75]">
                  تواصل معنا
                </span>
              </div>
            </div>
          </div>
          
          
          <div className="flex w-[172px] flex-col gap-[24px] items-start  flex-nowrap relative z-40">
            <div className="flex w-[129px] flex-col gap-[9px] items-start  flex-nowrap relative z-[41]">
              <div className="flex gap-[10px] justify-center items-center self-stretch  flex-nowrap relative z-[42]">
                <span className="h-[30px]  basis-auto  text-[20px] font-semibold leading-[30px] text-[#143087] relative text-start  z-[43]">
                  حمل التطبيق
                </span>
              </div>
              <div className="w-[40px] h-[6px]  bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-12/Q6CctxZby4.png)] bg-cover bg-no-repeat relative z-[44]" />
            </div>
            <div className="flex flex-col gap-[12px] items-start self-stretch  flex-nowrap relative z-[45]">
              <div className="flex w-[172px] pt-[16px] pr-[20px] pb-[16px] pl-[20px] gap-[16px] justify-center items-center  flex-nowrap bg-[#143087] rounded-[8px] relative z-[46]">
                <div className="flex w-[132px] gap-[16px] items-center  flex-nowrap relative z-[47]">
                  <div className="w-[32px] h-[32px]  bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-12/f3GhWRCGPf.png)] bg-cover bg-no-repeat relative overflow-hidden z-[51]" />
                  
                  <div className="flex w-[84px] flex-col gap-[4px] items-start  flex-nowrap relative z-[48]">
                    <span className="h-[16px]  basis-auto  text-[12px] font-normal leading-[16px] text-[#fff] relative text-start  z-[49]">
                      حمل التطبيق
                    </span>
                    <span className="h-[20px]  basis-auto  text-[14px] font-semibold leading-[20px] text-[#fff] relative text-start  z-50">
                      Google Play
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex pt-[16px] pr-[20px] pb-[16px] pl-[20px] gap-[16px] justify-center items-center self-stretch  flex-nowrap bg-[#143087] rounded-[8px] relative z-[52]">
                <div className="flex w-[121px] gap-[16px] items-center  flex-nowrap relative z-[53]">
                  <div className="w-[32px] h-[32px]  bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-12/GrVtXLn6Og.png)] bg-cover bg-no-repeat relative overflow-hidden z-[57]" />
                  
                  <div className="flex w-[73px] flex-col gap-[4px] items-start  flex-nowrap relative z-[54]">
                    <span className="h-[16px]  basis-auto  text-[12px] font-normal leading-[16px] text-[#fff] relative text-start  z-[55]">
                      حمل التطبيق
                    </span>
                    <span className="h-[20px]  basis-auto  text-[14px] font-semibold leading-[20px] text-[#fff] relative text-start  z-[56]">
                      App Store
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex w-[298px] flex-col gap-[32px] items-start  flex-nowrap relative z-[18]">
            <div className="flex w-[135px] flex-col gap-[32px] items-start  flex-nowrap relative z-[19]">
              <div className="flex w-[114px] flex-col gap-[9px] items-start  flex-nowrap relative z-20">
                <div className="flex gap-[10px] justify-center items-center self-stretch  flex-nowrap relative z-[21]">
                  <span className="h-[30px]  basis-auto  text-[20px] font-semibold leading-[30px] text-[#143087] relative text-start  z-[22]">
                    تواصل معنا
                  </span>
                </div>
                <div className="w-[40px] h-[6px]  bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-12/JsXDV3xffp.png)] bg-cover bg-no-repeat relative z-[23]" />
              </div>
            </div>
            <div className="flex flex-col gap-[24px] items-start self-stretch  flex-nowrap relative z-[24]">
              <div className="flex gap-[12px] justify-start items-start self-stretch  flex-nowrap relative z-[25]">
                <div className="w-[24px] h-[24px]  relative overflow-hidden z-[28]">
                  <div className="w-[16px] h-[20px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-12/KZx9WMQ2oO.png)] bg-[length:100%_100%] bg-no-repeat relative z-[29] mt-[2px] mr-0 mb-0 ml-[4px]" />
                </div>
                <div className="flex w-[180px] gap-[10px] justify-center items-center  flex-nowrap relative z-[26]">
                  <div className="w-[180px]   text-[14px] font-normal leading-[20px] relative text-start  z-[27]">
                    <span className=" text-[14px] font-normal leading-[20px] text-[#1e1e1e] relative text-start">
                      الرياض - شارع الامير عبدالعزيز
                      <br /> بن مساعد بن جلوي
                    </span>
                  </div>
                </div>
                
              </div>
              <div className="flex w-[298px] gap-[12px] justify-center items-center  flex-nowrap relative z-30">
<div className="w-[24px] h-[24px]  relative overflow-hidden z-[33]">
                  <div className="w-[20px] h-[17px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-12/YMvEXnJGd2.png)] bg-[length:100%_100%] bg-no-repeat relative z-[34] mt-[3.5px] mr-0 mb-0 ml-[2px]" />
                </div>
<div className="flex w-[262px] gap-[10px] justify-center items-center  flex-nowrap relative z-[31]">
                  
                  <div className="w-[262px]   text-[14px] font-normal leading-[20px] relative text-start  z-[32]">
                    <span className=" text-[14px] font-normal leading-[20px] text-[#1e1e1e] relative text-start">
                      customer.service@home-healers.com
                    </span>
                  </div>
                </div>
                
              </div>
              <div className="flex w-[115px] gap-[12px] justify-center items-center  flex-nowrap relative z-[35]">
                <div className="w-[24px] h-[24px]  relative overflow-hidden z-[38]">
                  <div className="w-[20px] h-[20px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-12/c4wQnrL1nf.png)] bg-[length:100%_100%] bg-no-repeat relative z-[39] mt-[2px] mr-0 mb-0 ml-[2px]" />
                </div>
                <div className="flex w-[79px] gap-[10px] justify-center items-center  flex-nowrap relative z-[36]">
                  <div className="w-[79px]   text-[14px] font-normal leading-[20px] relative text-start  z-[37]">
                    <span className=" text-[14px] font-normal leading-[20px] text-[#1e1e1e] relative text-start">
                      0551172232
                    </span>
                  </div>
                </div>
                
              </div>
            </div>
          </div>
    </div>
  </div>
</div>

      <div className="flex w-full flex-col items-start">
  <div className="w-full bg-[#eff6fe] py-4">
    <div className="flex flex-wrap justify-center items-center gap-6 max-w-[1200px] mx-auto px-4">
      {/* <div className="w-[44px] h-[44px] rounded-[5px] relative z-[101]" /> */}
      <div className="w-[56px] h-[17px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-12/EGBeNfjh4v.png)] bg-cover bg-no-repeat relative overflow-hidden z-[102]" />
      <div className="w-[44px] h-[44px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-12/ZcLPTdQTEC.png)] bg-cover bg-no-repeat relative overflow-hidden z-[103]" />
      <div className="w-[30px] h-[36px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-12/2uanR5T9Rg.png)] bg-cover bg-no-repeat relative overflow-hidden z-[104]" />
      <div className="w-[72.423px] h-[32.001px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-12/Lqu4Zva9bZ.png)] bg-[length:100%_100%] bg-no-repeat relative z-[105]" />
      <div className="w-[39.944px] h-[24.386px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-12/jNgEQAgqyw.png)] bg-[length:100%_100%] bg-no-repeat relative z-[107]" />
    </div>
  </div>

  <div className="w-full bg-[#eff6fe] border-t border-b border-[#1a191a] py-4">
    <div className="flex flex-col lg:flex-row justify-between items-center gap-4 max-w-[1280px] mx-auto px-4">
      <div className="flex flex-col sm:flex-row gap-4 items-center z-[111]">
        <span className="text-[16px] font-medium leading-[24px] text-[#1e1e1e] z-[112]">الشروط والاحكام</span>
        <span className="text-[16px] font-medium leading-[24px] text-[#1e1e1e] z-[113]">السياسة الخصوصية</span>
      </div>
      <span className="text-[16px] font-medium leading-[24px] text-[#1e1e1e] text-center z-[110]">
        © 2023 جميع الحقوق محفوظة | Homehealers
      </span>
    </div>
  </div>
</div>
    </div>
  );
}

export default Footer;
