import { Arrow } from "@/components/Animations/arrowDown";
import { TFunction } from "i18next";
import React from "react";

function BeCloser({ t,homeData }: { t: TFunction,homeData:any }) {
  return (
    <div className="main-container flex w-full xl:w-[1440px]  flex-col gap-[8px] justify-center items-center flex-nowrap relative mx-auto my-0">
      <div className="flex flex-col xl:flex-row w-full xl:w-[1200px] bg-[url(/assets/images/beCloser/frame.svg)] bg-cover bg-right pt-[40px] pr-[40px] pb-[40px] pl-[40px] justify-between items-center shrink-0 flex-nowrap xl:rounded-[32px] relative">
        <div className="w-full xl:w-[456.13px] h-[259.747px]  shrink-0 relative z-[9]">
          <div
            style={{ backgroundImage: `url(/assets/images/beCloser/Group.svg)` }}
            className="w-full h-full bg-contain xl:bg-cover bg-no-repeat ltr:rotate-y-180 absolute top-0 left-0 z-10"
          />
        </div>
        <div className="flex w-full xl:w-[608px] flex-col gap-[40px] items-start shrink-0 flex-nowrap relative z-[1]">
          <div className="flex flex-col gap-[16px] items-start self-stretch shrink-0 flex-nowrap relative z-[2]">
            <span className="flex w-full xl:w-[608px] xl:h-[36px] justify-start items-start shrink-0 basis-auto text-[20px] font-bold leading-[36px] text-[#fff] relative text-start xl:whitespace-nowrap z-[3]">
              {homeData?.data?.sections[6]?.Posts[0]?.title}
            </span>
            <span className="flex xl:w-[608px] xl:h-[58px] justify-start items-start shrink-0 text-[16px] font-medium leading-[29.12px] text-[#dbdbdb] relative text-start z-[4]">
              {homeData?.data?.sections[6]?.Posts[0]?.description}
            </span>
          </div>
          <button className="w-full sm:w-[340px] h-[56px] shrink-0 border-none relative z-[5] pointer">
            <div className="w-full h-full bg-[#5f3f23] rounded-[36px] absolute top-0 left-0 z-[6]" />
            <div
              style={{ backgroundImage: `url(/assets/images/beCloser/sendIcon.svg)` }}
              className="w-[11.76%] h-[71.43%] bg-contain xl:bg-cover bg-no-repeat absolute top-[14.29%] left-[2.35%] z-[7]"
            />
            <span className="flex h-[25px] justify-start items-start text-[14px] font-medium opacity-[0.55] leading-[25px] text-[#dbdbdb] absolute top-[calc(50%-12px)] left-[62.06%] text-end whitespace-nowrap z-[8]">
              {t("be_closer.email_placeholder")}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default BeCloser;
