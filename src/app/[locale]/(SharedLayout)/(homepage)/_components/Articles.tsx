import { Arrow } from "@/components/Animations/arrowDown";
import { TFunction } from "i18next";
import React from "react";
import Blogs from "./Blogs";
import HomeAPI from "../../../../api/api";
import Link from "next/link";

interface ArticleData {
  title: string;
  description: string;
  url: string;
}
function Articles({ t,homeData,NewsData }: { t: TFunction,homeData:any,NewsData:any }) {


  const data : ArticleData[]=[
    {
      title: t("articles.list.0.title"),
      description: t("articles.list.0.description"),
      url: "/assets/images/articles/3.svg",
    },
    {
      title: t("articles.list.1.title"),
      description: t("articles.list.1.description"),
      url: "/assets/images/articles/2.svg",
    },
    {
      title: t("articles.list.2.title"),
      description: t("articles.list.2.description"),
      url: "/assets/images/articles/1.svg",
    },
  ]
  return (
    <div className="main-container flex w-full xl:w-[1440px] pt-[96px] pr-0 pb-[96px] pl-0 flex-col gap-[48px] items-center flex-nowrap relative mx-auto my-0">
      <div className="flex w-full xl:w-[712px] flex-col gap-[16px] justify-center items-start shrink-0 flex-nowrap relative">
        <div className="flex flex-col items-center self-stretch shrink-0 flex-nowrap relative z-[1]">
          <span className="flex w-full xl:w-[382px] xl:h-[36px] justify-center items-center shrink-0 basis-auto text-[20px] font-bold leading-[36px] text-[#f8992f] relative text-start whitespace-nowrap z-[2]">
            {homeData?.data?.sections[5].Posts[0]?.title}
          </span>
        </div>
        <span className="flex w-full xl:w-[712px] xl:h-[58px] justify-center items-center shrink-0 text-[16px] font-medium leading-[29.12px] text-[#dbdbdb] relative text-center z-[3]">
          {homeData?.data?.sections[5].Posts[0]?.description}
        </span>
      </div>
      <Blogs t={t} data={NewsData?.data} />
      <Link href={'/blogs'} className="flex hover:bg-white transition-all duration-500 cursor-pointer w-[170px] pt-[8px] pr-[24px] pb-[8px] pl-[24px] flex-col gap-[8px] justify-center items-center shrink-0 flex-nowrap rounded-[41px] border-solid border border-[#f8992f] relative z-[26] pointer">
        <span className="h-[29px] shrink-0 basis-auto text-[16px] font-medium leading-[29px] text-[#f8992f] relative text-left whitespace-nowrap z-[27]">
          {t("articles.all_articles")}
        </span>
      </Link>
    </div>
  );
}

export default Articles;
