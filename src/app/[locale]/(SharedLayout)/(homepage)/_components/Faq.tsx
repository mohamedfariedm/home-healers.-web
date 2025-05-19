"use client";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

function Faq() {
  const { t } = useTranslation("homepage");
  const [activeButtons, setActiveButtons] = useState<number[]>([]);

  const toggleDropdown = (index: number) => {
    setActiveButtons((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const faqs = [
    {
      question: t("faq.q1.question"),
      answer: t("faq.q1.answer"),
    },
    {
      question: t("faq.q2.question"),
      answer: t("faq.q2.answer"),
    },
    {
      question: t("faq.q3.question"),
      answer: t("faq.q3.answer"),
    },
    {
      question: t("faq.q4.question"),
      answer: t("faq.q4.answer"),
    },
    {
      question: t("faq.q5.question"),
      answer: t("faq.q5.answer"),
    },
    {
      question: t("faq.q6.question"),
      answer: t("faq.q6.answer"),
    },
  ];

  return (
    <div className="main-container flex w-full lg:w-[1152px] flex-col gap-[32px] items-start flex-nowrap relative mx-auto my-0">
      <div className="w-full lg:w-[1152px] h-[374px] relative mx-auto my-0">
        <div className="w-full lg:w-[1152px] h-[374px] bg-[url(/assets/images/faq/frame.svg)]  bg-cover bg-no-repeat rounded-[32px] absolute top-0 end-0" />
        <div className="flex w-full lg:w-[466px] h-[150px] flex-col gap-[24px] flex-nowrap absolute top-[112px] lg:end-[576px] z-[1]">
          <span className="h-[36px] self-stretch shrink-0 basis-auto text-[24px] font-semibold leading-[36px] text-[#fff] relative text-start whitespace-nowrap z-[2]">
            {t("faq.title")}
          </span>
          <span className="flex w-full lg:w-[466px] h-[90px] items-start self-stretch shrink-0 text-[16px] font-medium leading-[30.4px] text-[#f8fbfc] relative text-start z-[3]">
            {t("faq.description")}
          </span>
        </div>
      </div>

      <div className="flex gap-[24px] items-start self-stretch shrink-0 flex-wrap relative z-[1] transition-all duration-1000 ease-in-out">
        {faqs.map((item, index) => (
          <button
            key={index}
            className={`flex transition-all duration-1000 ease-in-out ${
              activeButtons.includes(index)
                ? "w-full lg:w-[564px] flex-col gap-[40px] h-auto"
                : "w-full lg:w-[564px] flex-row gap-[72px] h-[auto]"
            } pt-[16px] pr-[32px] pb-[16px] pl-[32px] justify-between items-center flex-nowrap bg-[#f8fbfc] rounded-[16px] border-none relative z-[2] pointer`}
            onClick={() => toggleDropdown(index)}
          >
            <>
              <div className="transition-all duration-1000 ease-in-out w-full">
                <div className="w-[333px] h-[62px] shrink-0 rtl:bg-[url(/assets/images/faq/rectangle.svg)]  bg-cover bg-no-repeat rounded-tl-[4.5px] rounded-tr-[16px] rounded-br-[16px] rounded-bl-[4.5px] absolute top-0 start-0 z-[5]">
                  <div className="w-[4px] h-[25px] bg-[#5d9d9f] rounded-[4.5px] absolute top-[19px] start-0 z-[4]" />
                </div>
                <div className="w-full flex justify-between items-center relative">
                  <span className="flex w-[211px] h-[30px] items-start shrink-0 basis-auto text-[16px] font-medium leading-[30px] text-[#5d9d9f] relative text-start whitespace-nowrap z-[2]">
                    {item.question}
                  </span>
                  <div
                    className={`w-[24px] h-[24px] shrink-0 bg-cover bg-no-repeat relative z-[1]`}
                    style={{
                      backgroundImage: `url(${
                        activeButtons.includes(index)
                          ? "/assets/images/faq/remove-02.svg"
                          : "/assets/images/faq/cancel-02.svg"
                      })`,
                    }}
                  />
                </div>
                <span
                  className={
                    activeButtons.includes(index)
                      ? "flex w-full lg:w-[500px] h-[130px] items-end self-stretch shrink-0 text-[14px] font-normal leading-[25.48px] text-[#90bbbd] tracking-[0.28px] relative text-start z-[3] transition-all duration-500 ease-in-out opacity-100"
                      : "h-[0px] opacity-0 transition-all duration-500 ease-in-out"
                  }
                >
                  {activeButtons.includes(index) ? item.answer : ""}
                </span>
              </div>
            </>
          </button>
        ))}
      </div>
    </div>
  );
}

export default Faq;
