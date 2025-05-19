import { Arrow } from "@/components/Animations/arrowDown";
import { TFunction } from "i18next";
import React from "react";

function CofeTrip({ t,homeData }: { t: TFunction,homeData:any }) {
  return (
    <div className="main-container flex w-full xl:w-[1440px]  flex-col gap-[8px] items-start flex-nowrap relative mx-auto my-0">
    <div className="w-full xl:w-[1442px] sm:h-[469.067px] xl:flex rtl:xl:justify-end shrink-0 bg-[url(/assets/images/cofetrip/Vector.svg)] bg-contain md:bg-cover bg-no-repeat relative z-[1]">
      <div className="flex w-full xl:w-[772px] flex-col gap-[48px] items-start flex-nowrap relative z-[2] xl:mt-[169px] ltr:xl:ms-[96px] rtl:xl:ml-[150px]">
        <div className="flex w-full xl:w-[554px] flex-col gap-[16px] justify-center items-end shrink-0 flex-nowrap relative z-[3]">
          <div className="flex w-full xl:w-[554px] flex-col items-start shrink-0 flex-nowrap relative z-[4]">
            <span className="xl:h-[36px] self-stretch shrink-0 basis-auto  text-[20px] font-bold leading-[36px] text-[#f8992f] relative text-start xl:whitespace-nowrap z-[5]">
            {homeData?.data?.sections[2]?.title}
            </span>
          </div>
          <span className="flex w-full xl:w-[554px] xl:h-[58px] items-start shrink-0  text-[16px] font-medium leading-[29.12px] text-[#dbdbdb] relative z-[6]">
          {homeData?.data?.sections[2]?.Posts[0]?.description}
          </span>
        </div>
        <div className="flex gap-px items-center self-stretch shrink-0 flex-wrap xl:flex-nowrap relative z-[7]">
          {homeData?.data?.sections[2]?.Posts.slice(1,100).map((text:any, index:any) => (
            <React.Fragment key={index}>
              <div className="flex rtl:w-[125px] flex-col gap-[16px] items-center shrink-0 flex-nowrap relative z-[8]">
                <div
                style={{ 
                  backgroundImage: `url(${ 
                    Array.isArray(text?.attachment) 
                      ? text?.attachment[0]?.original 
                      : text?.attachment || '/assets/images/cofetrip/1.svg' 
                  })` 
                }}
                className="w-[48px] h-[48px] shrink-0  bg-cover bg-no-repeat relative overflow-hidden z-[9]" />
                <span className="h-[29px] self-stretch shrink-0 basis-auto  text-[16px] font-medium leading-[29px] text-[#dbdbdb] relative text-center whitespace-nowrap z-10">
                  {text?.title}
                </span>
              </div>
              {index !== 4 && (
                <div className="w-[30px] h-[24px] shrink-0 relative z-[11]">
                  <div className="w-[30px] h-[15.283px] bg-[url(/assets/images/cofetrip/arrow.svg)] bg-cover bg-no-repeat relative overflow-hidden z-[12] mt-0 mr-0 mb-0 ml-0" />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  </div>
  
  );
}

export default CofeTrip;
