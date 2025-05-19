"use client";


// import { TFunction } from "i18next";
import Link from "next/link";
import React from "react";
import { useTranslation } from "react-i18next";

const BreadCrumb: React.FC<{
  className?: string;
  //  t: TFunction ,
   name:string,
   name2?:string,
   title:any,
   description?:string,
   value?:string
}> = ({ className,name,title,description,name2,value}) => {
  const {t}= useTranslation(value)


  return (
    <div className="main-container flex w-full xl:w-[1440px] xs:pt-[96px] pr-0 pb-[96px] pl-0 mt-[165px]  flex-col gap-[16px] items-center flex-nowrap relative mx-auto my-0">

<div className="main-container flex  gap-[12px] items-center flex-nowrap relative mx-auto ">
      <div className="flex  justify-center items-center shrink-0 flex-nowrap relative">
      <Link href="/" className="h-[20px] shrink-0 basis-auto  text-[14px] font-medium leading-[20px] text-[#DCDCDC]  relative text-left whitespace-nowrap z-[3]">
{t("home")}
      </Link>
       
      </div>
      <div
      style={{ backgroundImage: "url(/assets/images/breadCrumbArrow.svg)" }}
      className="w-[24px] h-[24px] shrink-0  bg-cover bg-no-repeat relative z-[2] ltr:rotate-180"/>
      <span className="h-[20px] shrink-0 basis-auto text-[#DCDCDC]  text-[14px] font-semibold leading-[20px]  relative text-left whitespace-nowrap z-[1]">
{name}
        </span>
        {name2 &&
        <>
        <div
        style={{ backgroundImage: "url(/assets/images/breadCrumbArrow.svg)" }}
        className="w-[24px] h-[24px] shrink-0  bg-cover bg-no-repeat relative z-[2] ltr:rotate-180"/>
        <span className="h-[20px] shrink-0 basis-auto text-[#DCDCDC]  text-[14px] font-semibold leading-[20px]  relative text-left whitespace-nowrap z-[1]">
  {name2}
          </span>
        
        </>
        }
        </div>
    <div className="flex w-full xl:w-[784px] flex-col gap-[8px] items-center shrink-0 flex-nowrap relative z-[4]">
        <span className="flex w-full xl:w-[641px] xl:h-[58px] justify-center items-start shrink-0 basis-auto  text-[32px] font-bold leading-[58px] text-[#fff] relative text-center xl:whitespace-nowrap z-[5]">
{title}
        </span>
        {
          description &&
<span className="flex w-full xl:w-[784px] xl:h-[75px] justify-center items-start shrink-0  text-[14px] font-medium leading-[25.48px] text-[#dbdbdb] relative text-center z-[6]">
{description}
        </span>        }
        
      </div>
    </div>
  );
};

export const BreadCrumbComponent = React.memo(BreadCrumb);
