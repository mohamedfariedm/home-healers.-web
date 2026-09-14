"use client";

import React, { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PartnerLogoProps {
  image: string;
}

const PartnerLogo: React.FC<PartnerLogoProps> = ({ image }) => {
  return (
    <div
      className="mx-auto h-[120px] w-[120px] bg-contain bg-center bg-no-repeat transition-transform duration-300 sm:h-[180px] sm:w-[180px] lg:h-[230px] lg:w-[230px] md:hover:scale-105"
      style={{ backgroundImage: `url(${image})` }}
    />
  );
};

interface NavigationArrowProps {
  direction: "next" | "prev";
  buttonRef: React.RefObject<HTMLDivElement>;
}

const NavigationArrow: React.FC<NavigationArrowProps> = ({
  direction,
  buttonRef,
}) => {
  const Icon = direction === "next" ? ChevronRight : ChevronLeft;

  return (
    <div
      ref={buttonRef}
      className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-[#143087] text-[#143087] transition-all duration-300 hover:bg-[#143087] hover:text-white sm:h-12 sm:w-12 lg:h-14 lg:w-14"
      aria-label={direction === "next" ? "Next" : "Previous"}
    >
      <Icon size={22} className="sm:hidden" />
      <Icon size={28} className="hidden sm:block" />
    </div>
  );
};

const PartnersSection = ({ data, locale }: { data: any; locale: string }) => {
  
  const partnerLogos: string[] =
    data?.Posts?.[0]?.attachment?.map((att: any) => att.original) || [];

  const prevRef = useRef<HTMLDivElement>(null);
  const nextRef = useRef<HTMLDivElement>(null);

  return (
    <div className="mx-auto mb-12 mt-12 flex w-full max-w-screen-xl flex-col items-center gap-8 overflow-x-hidden px-4 sm:mb-16 sm:mt-16 sm:gap-10 lg:mb-24 lg:mt-24 lg:gap-14">
      {/* Heading */}
      <div className="flex flex-col items-center gap-3 text-center">
        <span className="text-sm font-medium leading-6 text-[#62a0f6] sm:text-base">
          {data?.title}{" "}
        </span>
        <h2 className="text-[22px] font-semibold leading-8 text-[#1e1e1e] sm:text-[28px] sm:leading-10 lg:text-[30px]">
          {data?.Posts?.[0]?.title}
        </h2>
      </div>

      {/* Partner Logos Slider */}
      <Swiper
        modules={[Navigation, Autoplay]}
        spaceBetween={16}
        slidesPerView={2}
        autoplay={{ delay: 2500 }}
        loop
        navigation={{
          prevEl: prevRef.current,
          nextEl: nextRef.current,
        }}
        onBeforeInit={(swiper) => {
          // @ts-ignore
          swiper.params.navigation.prevEl = prevRef.current;
          // @ts-ignore
          swiper.params.navigation.nextEl = nextRef.current;
        }}
        breakpoints={{
          480: { slidesPerView: 2, spaceBetween: 20 },
          640: { slidesPerView: 2, spaceBetween: 24 },
          768: { slidesPerView: 3, spaceBetween: 24 },
          1024: { slidesPerView: 4, spaceBetween: 30 },
        }}
        className="w-full"
      >
        {partnerLogos.map((logo, i) => (
          <SwiperSlide key={i} className="flex items-center justify-center">
            <PartnerLogo image={logo} />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Navigation Arrows */}
      <div className="mt-2 flex gap-6 sm:mt-4 sm:gap-10">
        <NavigationArrow direction="next" buttonRef={nextRef} />
        <NavigationArrow direction="prev" buttonRef={prevRef} />
      </div>
    </div>
  );
};

export default PartnersSection;
