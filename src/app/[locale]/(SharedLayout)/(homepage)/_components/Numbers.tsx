import { Arrow } from "@/components/Animations/arrowDown";
import { TFunction } from "i18next";
import React from "react";

const ButtonCard = ({ value, description, image1 }: { value: string; description: string; image1: string }) => (
  <div className="w-[270px] h-[120px] justify-center items-center flex shrink-0 border-none relative cursor-pointer group">
    <div className="flex gap-[18px] items-center flex-nowrap relative justify-center z-10 group">
      <div
        className="w-[64px] h-[64px] shrink-0 bg-cover bg-no-repeat relative overflow-hidden"
        style={{ backgroundImage: `url(${image1})` }}
      />
      <div className="flex flex-col items-start shrink-0 flex-nowrap">
        <span className="text-[32px] font-semibold leading-[48px] text-[#5d9d9f]">
          {value}
        </span>
        <span className="text-[16px] font-medium leading-[24px] text-[#90bbbd]">
          {description}
        </span>
      </div>
    </div>
    <div className="w-[270px] h-[120px] rounded-[24px] absolute top-0 left-0 overflow-hidden">
      <div className="w-[270px] h-[120px] rounded-[24px] absolute top-0 left-0 bg-contain bg-[url(/assets/images/numbers/after.svg)] group-hover:bg-[url(/assets/images/numbers/before.svg)] transition-all duration-500 ease-in-out" />
    </div>
  </div>
);

function Numbers({ t }: { t: TFunction }) {
  const data = [
    {
      value: t("numbers.yearsInMarket.value"),
      description: t("numbers.yearsInMarket.description"),
      image1: "/assets/images/numbers/1.svg",
    },
    {
      value: t("numbers.employees.value"),
      description: t("numbers.employees.description"),
      image1: "/assets/images/numbers/2.svg",
    },
    {
      value: t("numbers.branches.value"),
      description: t("numbers.branches.description"),
      image1: "/assets/images/numbers/3.svg",
    },
    {
      value: t("numbers.customers.value"),
      description: t("numbers.customers.description"),
      image1: "/assets/images/numbers/4.svg",
    },
  ];

  return (
    <div className="main-container flex w-full xl:w-[1152px] flex-col gap-[40px] items-center flex-nowrap relative mx-auto my-0">
      <div
        className="w-[162px] h-[69px] shrink-0 bg-cover bg-no-repeat relative overflow-hidden"
        style={{ backgroundImage: "url(/assets/images/numbers/frame.svg)" }}
      />
      <div className="flex gap-[24px] items-center justify-center self-stretch shrink-0 flex-wrap xl:flex-nowrap relative">
        {data.map((item, index) => (
          <ButtonCard key={index} value={item.value} description={item.description} image1={item.image1} />
        ))}
      </div>
    </div>
  );
}

export default Numbers;
