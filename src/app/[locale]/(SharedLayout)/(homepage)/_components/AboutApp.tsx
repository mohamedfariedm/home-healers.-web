"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import { ShowMore } from "@/components/Animations/ShowMore";
import { AboutAppTwoColumns } from ".";
import { useState } from "react";
import parse from "html-react-parser";
import "swiper/css";
import "swiper/css/pagination";

function AboutApp({
  locale,
  section,
  data,
  aboutHomeSection,
}: {
  locale: string;
  section: any;
  data?: any;
  aboutHomeSection?: any;
}) {
  const [activeDot, setActiveDot] = useState(0);
  console.log(data);

  // Use provided data or fallback to empty array
  const services = data || [];

  return (
    <div className="flex w-full xl:w-[1280px] flex-col gap-[100px] items-start flex-nowrap relative z-[487] mt-[91px] mx-auto">
      {/* Section Header */}
      <motion.div
        className="flex flex-col items-center gap-8 w-full relative"
        initial={{ opacity: .3, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: false, amount: 0.5 }}
      >
        <div className="flex flex-col items-center gap-12 w-full max-w-3xl text-center">
          <span className="text-primary text-base font-medium">
            {section?.title}
          </span>
          <h2 className="text-2xl sm:text-3xl font-semibold leading-10 text-gray-900">
            {locale === "ar" ? (
              <>
                مجموعة من <span className="text-primary">الخدمات</span> الطبية
                المتنوعة
              </>
            ) : (
              <>
                A range of{" "}
                <span className="text-primary">medical services</span>
              </>
            )}
          </h2>
        </div>

        {/* Swiper Slider with Dynamic Data */}
        <Swiper
          modules={[Pagination, Autoplay]}
          spaceBetween={0}
          slidesPerView={1}
          autoplay={{ delay: 3500 }}
          pagination={{
            clickable: true,
            el: ".custom-dots",
          }}
          loop
          onSlideChange={(swiper) => setActiveDot(swiper.realIndex)}
          breakpoints={{
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 4 },
          }}
          className="w-full max-w-[1280px]"
        >
          {services.map((service: any, i: number) => (
            <SwiperSlide key={i}>
              <Link
                href={`/${locale}/services?id=${service.slug?.[locale]}`}
                className="relative bg-[#0077b7] rounded-3xl w-[299px] h-[352px] px-2 py-10 hover:shadow-2xl hover:scale-105 transition-all duration-300 block mx-auto"
              >
                <div className="absolute top-6 left-2 flex flex-col items-start gap-4 px-2">
                  <div
                  style={{
                        backgroundImage: `url(${
                          service.image?.[0]?.original ||
                          "/assets/images/homehellers/Injury.svg"
                        })`,
                      }}
                  className="bg-cover bg-center bg-no-repeat rounded-full w-24 h-24 flex items-center justify-center">

                  </div>
                  <div className="text-white">
                    <h3 className="text-lg font-semibold leading-7">
                      {service.name[locale]}
                    </h3>
                    <div className="text-sm font-light leading-8 mt-1 max-h-[96px] overflow-hidden text-ellipsis">
                      {parse(service?.description[locale]||"")}
                    </div>
                  </div>
                </div>
                <ShowMore />
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Custom Dots */}
        <div className="flex gap-6 mt-6 custom-dots justify-center">
          {services.map((_: any, index: number) => (
            <div
              key={index}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                index === activeDot ? "bg-[#62a0f6]" : "bg-[#cee2fc]"
              }`}
            />
          ))}
        </div>

        {/* CTA Button */}
        <motion.div
          className="mt-6"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        >
          <Link
            href={`/${locale}/services`}
            className="flex items-center gap-2 px-4 py-2 bg-[#143087] text-white rounded-xl text-lg font-medium border border-[#143087]"
          >
            {locale === "ar" ? "جميع الخدمات" : "All Services"}
            <ArrowLeft className="w-6 h-6 text-white" />
          </Link>
        </motion.div>
      </motion.div>

      {/* Two Column Layout */}
      <AboutAppTwoColumns aboutHomeSection={aboutHomeSection} locale={locale} />
    </div>
  );
}

export default AboutApp;
