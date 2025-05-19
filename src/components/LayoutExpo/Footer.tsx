import React from "react";
import initTranslations from "@/app/i18n";
import Link from "next/link";

async function Footer({ locale }: { locale: string }) {
  const { t } = await initTranslations(locale, ["expo"]);
  
  const handleClick = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    const id = href.replace("#", "");
    const section = document.getElementById(id);
    if (section) {
      const sectionTop = section.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: sectionTop - 100, behavior: "smooth" });
    }
  };

  return (
    <div className="w-full bg-[#37200b] mx-auto">
      <div className="main-container flex w-full max-w-[1440px] pt-8 md:pt-[64px] pb-4 md:pb-[40px] px-4 md:px-[144px] flex-col gap-8 md:gap-[64px] items-center bg-[#37200b] relative mx-auto">
        {/* Top Section */}
        <div className="flex w-full max-w-[1152px] flex-col md:flex-row justify-between items-center gap-8">
          {/* Inquiry Column */}
          <div className="flex w-full md:w-[418px] flex-col gap-4 md:gap-[48px] items-start relative z-[14]">
            <div className="flex w-full flex-col gap-2 md:gap-[16px] items-start relative z-[15]">
              <span className="block w-full md:w-[119px] h-[22px] text-[16px] font-semibold leading-[22px] text-[#fff] text-start whitespace-nowrap z-[16]">
                {t("footer.inquiryQuestion")}
              </span>
              <div className="flex flex-col md:flex-row w-full md:w-[418px] gap-4 md:gap-[24px] items-start relative z-[17]">
                <div className="flex w-full md:w-[173px] gap-4 md:gap-[16px] items-center relative z-[23]">
                  <div className="w-8 h-8 md:w-[32px] md:h-[32px] bg-[url(/assets/images/expo/call.svg)] bg-cover bg-no-repeat relative z-[27]" />
                  <div className="flex flex-col gap-1 justify-center">
                    <span className="block text-[12px] font-normal leading-[18px] text-[#dbdbdb] text-start whitespace-nowrap">
                      {t("footer.callLabel")}
                    </span>
                    <span className="block text-[14px] font-medium leading-[21px] text-[#dbdbdb] text-start whitespace-nowrap">
                      +2 000-111-2222
                    </span>
                  </div>
                </div>
                <div className="flex w-full md:w-[221px] gap-4 md:gap-[16px] items-center relative z-[18]">
                  <div className="w-8 h-8 md:w-[32px] md:h-[32px] bg-[url(/assets/images/expo/mail-large.svg)] bg-cover bg-no-repeat relative z-[22]" />
                  <div className="flex flex-col gap-1 justify-center">
                    <span className="block text-[12px] font-normal leading-[18px] text-[#dbdbdb] text-start whitespace-nowrap">
                      {t("footer.emailLabel")}
                    </span>
                    <span className="block text-[14px] font-medium leading-[21px] text-[#dbdbdb] text-start whitespace-nowrap">
                      info@saudi-uganda.com
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Newsletter Column */}
          <div className="flex w-full md:w-[450px] flex-col gap-4 md:gap-[48px] relative z-[1]">
            <div className="flex w-full md:w-[450px] flex-col gap-4 md:gap-[24px] shrink-0 relative z-[2]">
              <div className="flex w-full md:w-[281px] flex-col gap-2 relative z-[3]">
                <span className="block w-full md:w-[171px] h-[34px] text-[24px] font-semibold leading-[33.6px] text-[#fff] text-start whitespace-nowrap z-[4]">
                  {t("footer.newsletter")}
                </span>
                <span className="block w-full md:w-[281px] xl:h-[21px] text-[14px] font-normal leading-[21px] text-[#dbdbdb] text-start xl:whitespace-nowrap z-[5]">
                  {t("footer.newsletterDesc")}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row w-full md:w-[450px] gap-2 md:gap-[8px] items-start relative z-[6]">
                <div className="relative w-full md:w-[343px] flex flex-col gap-2 overflow-hidden z-[9]">
                  <div className="flex w-full p-3 gap-2 justify-end h-[45px] items-center bg-[#5f3f23] rounded-[12px] border border-[#5f3f23] z-10">
                    
                    <div className="w-4 h-4 bg-[url(/assets/images/expo/mail-large.svg)] bg-cover bg-no-repeat" />
                  </div>
                  <input
                    placeholder={t("footer.enterEmailPlaceholder")}
                    className="absolute outline-none w-full text-[14px] font-normal placeholder:text-[14px] placeholder:text-[#fff] leading-[21px] ps-5 h-[45px] bg-transparent border-none top-0 left-0 z-[13]"
                  />
                </div>
                <button className="flex w-full ltr:md:w-[50%] rtl:md:w-[99px] h-[45px] p-3 gap-2 justify-center items-center bg-[#f8992f] rounded-[12px] border-none overflow-hidden shadow-sm z-[7]">
                  <span className="block text-[14px] font-medium leading-[21px] text-[#fff] text-start whitespace-nowrap">
                    {t("footer.subscribe")}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* Bottom Section */}
        <div className="flex flex-col sm:flex-row w-full gap-6 sm:gap-0 sm:max-w-[1152px] pt-4 md:pt-[40px] justify-between items-center border-t border-t-[#281607] relative z-[28]">
          <div className="flex flex-col sm:flex-row w-full rtl:sm:w-[378px] gap-6 sm:gap-2 md:gap-[32px] items-center relative z-[30]">
            <a href="#about" className="block text-[14px] font-normal leading-[21px] text-[#dbdbdb]  whitespace-nowrap z-[35]">
              {t("footer.about")}
            </a>
            <a href="#products" className="block text-[14px] font-normal leading-[21px] text-[#dbdbdb]  whitespace-nowrap z-[34]">
              {t("footer.products")}
            </a>
            <div className="flex w-full sm:w-[83px]  sm:gap-[8px] justify-center items-center  relative z-[33]">
              <a href="#events" className="block text-[14px] font-normal leading-[21px] text-[#dbdbdb]  whitespace-nowrap z-[34]">
                {t("footer.events")}
              </a>
            </div>
            <div className="flex w-full sm:w-[50px] gap-2 sm:gap-[8px] justify-center items-center  relative z-[31]">
              <a href="#partners" className="block text-[14px] font-normal leading-[21px] text-[#dbdbdb]  whitespace-nowrap z-[32]">
                {t("footer.partners")}
              </a>
            </div>
          </div>
          <span className="block w-full sm:w-[313px] xl:h-[21px] text-[14px] font-normal leading-[21px] text-[#dbdbdb] text-center sm:whitespace-nowrap z-[29]">
            {t("footer.copyright")}
          </span>
        </div>
      </div>
    </div>
  );
}

export default Footer;
