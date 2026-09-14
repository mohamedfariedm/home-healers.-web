"use client";

import React, { useState, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import type SwiperCore from "swiper";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import DoctorCard from "./doctor-card";
import DoctorModal from "./doctor-modal";
import { doctorsTranslations } from "@/translations/doctors";
import { Doctor, DoctorsSectionData } from "@/types/doctors";
import { useIsMobile } from "@/Hooks/use-mobile";

interface DoctorsSectionProps {
  data?: DoctorsSectionData;
  locale: string;
  doctorsData: Doctor[];
}

const DoctorsSection: React.FC<DoctorsSectionProps> = ({
  data,
  locale = "ar",
  doctorsData = [],
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const swiperRef = useRef<SwiperCore>();
  const isMobile = useIsMobile();
  const prefersReducedMotion = useReducedMotion();
  const simplifyMotion = isMobile || !!prefersReducedMotion;

  const translations =
    doctorsTranslations[locale as keyof typeof doctorsTranslations] ||
    doctorsTranslations.ar;
  const isRTL = locale === "ar";

  const handleDotClick = (index: number) => {
    swiperRef.current?.slideTo(index);
  };

  const handleDoctorClick = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDoctor(null);
  };

  const subtitle = data?.Posts?.[0]?.title || translations.sectionTitle;
  const words = subtitle.split(" ");
  const subtitleParts = {
    before: words.slice(0, 3).join(" "),
    highlight: words[3] || "",
    after: words.slice(4).join(" "),
  };

  if (!doctorsData || doctorsData.length === 0) {
    return (
      <div className="mx-auto mt-12 w-full max-w-screen-xl px-4 py-10 text-center sm:mt-16 lg:mt-24">
        <div className="text-lg text-gray-500">{translations.noData}</div>
      </div>
    );
  }

  return (
    <>
      <section className="mx-auto mt-12 w-full max-w-screen-xl overflow-x-hidden px-4 py-6 sm:mt-16 sm:py-8 lg:mt-24">
        <div className="flex flex-col items-center gap-10 sm:gap-14 lg:gap-16">
          <motion.div
            className="flex max-w-4xl flex-col items-center gap-3 text-center sm:gap-4"
            initial={{ opacity: 0, y: simplifyMotion ? 10 : 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: simplifyMotion ? 0.4 : 0.55 }}
          >
            <span className="text-sm font-semibold uppercase leading-6 tracking-wide text-[#62a0f6] sm:text-base">
              {data?.title || translations.sectionTitle}
            </span>
            <h2 className="text-[22px] font-bold leading-tight text-[#1e1e1e] sm:text-3xl">
              {subtitleParts.before && <span>{subtitleParts.before} </span>}
              {subtitleParts.highlight && (
                <span className="relative text-[#62a0f6]">
                  {subtitleParts.highlight}
                  <motion.div
                    className="absolute -bottom-2 left-0 right-0 h-1 bg-[#62a0f6] opacity-30"
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: simplifyMotion ? 0.4 : 0.8, delay: 0.2 }}
                  />
                </span>
              )}
              {subtitleParts.after && <span> {subtitleParts.after}</span>}
            </h2>
          </motion.div>

          <div className="relative w-full overflow-hidden">
            <div className="absolute top-1/2 left-0 z-10 hidden -translate-y-1/2 md:block lg:left-2">
              <button
                onClick={() => swiperRef.current?.slidePrev()}
                className="group flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-lg backdrop-blur-sm transition-all duration-300 hover:bg-[#62a0f6] hover:shadow-xl lg:h-12 lg:w-12"
                aria-label="Previous doctor"
              >
                <ChevronLeft
                  size={20}
                  className="text-[#62a0f6] transition-colors group-hover:text-white"
                />
              </button>
            </div>

            <div className="absolute top-1/2 right-0 z-10 hidden -translate-y-1/2 md:block lg:right-2">
              <button
                onClick={() => swiperRef.current?.slideNext()}
                className="group flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-lg backdrop-blur-sm transition-all duration-300 hover:bg-[#62a0f6] hover:shadow-xl lg:h-12 lg:w-12"
                aria-label="Next doctor"
              >
                <ChevronRight
                  size={20}
                  className="text-[#62a0f6] transition-colors group-hover:text-white"
                />
              </button>
            </div>

            <Swiper
              modules={[Autoplay, Navigation, Pagination]}
              spaceBetween={16}
              slidesPerView={1}
              autoplay={
                prefersReducedMotion
                  ? false
                  : {
                      delay: 4000,
                      disableOnInteraction: false,
                      pauseOnMouseEnter: true,
                    }
              }
              loop={doctorsData.length > 3}
              dir={isRTL ? "rtl" : "ltr"}
              onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
              onBeforeInit={(swiper) => {
                swiperRef.current = swiper;
              }}
              breakpoints={{
                640: { slidesPerView: 1, spaceBetween: 20 },
                768: { slidesPerView: 2, spaceBetween: 24 },
                1024: { slidesPerView: 3, spaceBetween: 30 },
                1280: { slidesPerView: 3, spaceBetween: 35 },
              }}
              className="w-full !pb-10 sm:!pb-16"
            >
              {doctorsData.map((doctor) => (
                <SwiperSlide key={doctor.id} className="!h-auto px-1 sm:px-2">
                  <DoctorCard
                    doctor={doctor}
                    onClick={() => handleDoctorClick(doctor)}
                    translations={translations}
                    locale={locale}
                    simplifyMotion={simplifyMotion}
                  />
                </SwiperSlide>
              ))}
            </Swiper>

            <div className="mt-6 flex justify-center gap-3 sm:mt-8">
              {doctorsData.map((_, index) => (
                <motion.button
                  key={index}
                  onClick={() => handleDotClick(index)}
                  className={`h-2.5 w-2.5 rounded-full transition-all duration-300 sm:h-3 sm:w-3 ${
                    activeIndex === index
                      ? "scale-125 bg-[#62a0f6]"
                      : "bg-[#cee2fc] hover:bg-[#a8c8f0]"
                  }`}
                  whileHover={simplifyMotion ? undefined : { scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <DoctorModal
        doctor={selectedDoctor}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        locale={locale}
        translations={translations}
      />
    </>
  );
};

export default DoctorsSection;
