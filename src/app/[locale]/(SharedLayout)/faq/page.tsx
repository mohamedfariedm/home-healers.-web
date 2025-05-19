"use client";
import React, { useState } from "react";
import { BreadCrumbComponent } from "@/components/Animations/breadCrumb";
import { useTranslation } from "react-i18next";

type Props = {
  params: { locale: string };
};

function Page({ params: { locale } }: Props) {
  const { t } = useTranslation("faq");

  // Manage FAQ state (only one can be open at a time)
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index)); // Close if the same, otherwise open
  };

  // FAQ Questions and Answers from Translation File
  const faqs = [
    { question: t("faq_1_question"), answer: t("faq_1_answer") },
    { question: t("faq_2_question"), answer: t("faq_2_answer") },
    { question: t("faq_3_question"), answer: t("faq_3_answer") },
    { question: t("faq_4_question"), answer: t("faq_4_answer") },
    { question: t("faq_5_question"), answer: t("faq_5_answer") },
  ];

  return (
    <>
      <BreadCrumbComponent value={'faq'} name={t("name")} title={t("title")} description={t("description")} />

      <div className="my-[96px]">
        <div className="main-container flex justify-end xl:w-[1156.638px] xl:h-[507.139px] relative mx-auto my-0">
          <div className="flex w-full xl:w-[650px] xl:h-auto flex-col gap-[16px] items-end flex-nowrap z-[3]">
            {faqs.map((faq, index) => (
              <div key={index} className="w-full xl:w-[650px] flex flex-col gap-[16px]">
                {/* Question with toggle icon */}
                <div className="flex w-full xl:w-[650px] justify-between items-center shrink-0 flex-nowrap relative z-[5]">
                  <span className="flex w-[80%] xl:w-auto xl:h-[33px] justify-start items-start shrink-0 text-[18px] font-semibold leading-[32.76px] text-[#fff] relative text-start xl:whitespace-nowrap z-[7]">
                    {faq.question}
                  </span>
                  <div
                    className="w-[24px] h-[24px] shrink-0 bg-cover bg-no-repeat relative z-[6] cursor-pointer"
                    style={{
                      backgroundImage: `url(${openIndex === index ? "/assets/images/faq/remove.svg" : "/assets/images/faq/cancel.svg"})`,
                    }}
                    onClick={() => toggleFAQ(index)}
                  />
                </div>

                {/* Answer (Visible only when open) */}
                {openIndex === index && (
                  <span className="flex w-full xl:w-[647px] xl:h-auto justify-end items-start shrink-0 text-[18px] font-normal leading-[32.76px] text-[#c4c4c4] relative text-start z-[8]">
                    {faq.answer}
                  </span>
                )}

                {/* Hide separator line for the last item */}
                {index !== faqs.length - 1 && (
                  <div className="w-full xl:w-[650px] bg-[#BABABA] h-px shrink-0 bg-cover bg-no-repeat relative z-[9] my-[16px]" />
                )}
              </div>
            ))}
          </div>

          {/* Background Image */}
          <div
            className="w-[1074.638px] h-[98.03%] bg-cover ltr:rotate-y-180 bg-no-repeat absolute top-[1.97%] start-0 z-[2]"
            style={{ backgroundImage: "url(/assets/images/faq/Vector.svg)" }}
          />
        </div>
      </div>
    </>
  );
}

export default Page;
