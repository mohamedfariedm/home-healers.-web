import { Arrow } from "@/components/Animations/arrowDown";
import { TFunction } from "i18next";
import React from "react";

function Certifications({ t }: { t: TFunction }) {
  return (
    <div className="main-container w-full lg:w-[1152px] lg:h-[381px] relative mx-auto my-0">
      <div className="w-[150px] lg:w-[296.986px] h-[200px] lg:h-[298px] bg-[url(/assets/images/certifications/certificate.svg)] xl:bg-cover bg-no-repeat lg:absolute lg:top-[42px] lg:end-0 z-[2] mx-auto bg-contain" />

      <div className="flex justify-center items-center lg:block w-full lg:w-[1008px] h-[381px] sm:bg-[url(/assets/images/certifications/Rectangle27.svg)] bg-cover bg-no-repeat rounded-[64px] lg:absolute top-0 end-[144px]">
        <div className="flex lg:w-[660px] flex-col gap-[32px] items-end flex-nowrap relative z-[3] lg:mt-[50px] lg:ms-[100px] mb-0 lg:me-[248px]">
          <span className="lg:h-[44px] bukra-semi-bold self-stretch shrink-0 basis-auto text-[24px] font-bold leading-[43.68px] text-[#5d9d9f] relative text-start lg:whitespace-nowrap z-[4]">
            {t("certifications.title")}
          </span>
          <div className="flex flex-col gap-[16px] items-start self-stretch shrink-0 flex-nowrap relative z-[5]">
            <span className="flex lg:w-[650px] lg:h-[58px] items-start self-stretch shrink-0 text-[16px] font-medium leading-[29.12px] text-[#90bbbd] relative text-start z-[6]">
              {t("certifications.description1")}
            </span>
            <span className="flex lg:w-[660px] lg:h-[58px] items-start self-stretch shrink-0 text-[16px] font-medium leading-[29.12px] text-[#90bbbd] relative text-start z-[7]">
              {t("certifications.description2")}
            </span>
            <span className="flex lg:w-[660px] lg:h-[58px] items-start self-stretch shrink-0 text-[16px] font-medium leading-[29.12px] text-[#90bbbd] relative text-start z-[8]">
              {t("certifications.description3")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Certifications;
