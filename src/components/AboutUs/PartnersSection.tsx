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
      className="w-[180px] h-[180px] sm:w-[200px] sm:h-[200px] lg:w-[230px] lg:h-[230px] bg-cover bg-no-repeat transition-transform duration-300 hover:scale-105"
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
      className="w-14 h-14 border border-[#143087] text-[#143087] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#143087] hover:text-white transition-all duration-300"
      aria-label={direction === "next" ? "Next" : "Previous"}
    >
      <Icon size={28} />
    </div>
  );
};

const PartnersSection = ({ data, locale }: { data: any; locale: string }) => {
  console.log("PartnersSection data:", data, "locale:", locale);

  const partnerLogos: string[] =
    data?.Posts?.[0]?.attachment?.map((att: any) => att.original) || [];

  const prevRef = useRef<HTMLDivElement>(null);
  const nextRef = useRef<HTMLDivElement>(null);

  return (
    <div className="w-full max-w-screen-xl mx-auto mt-24 px-4 flex flex-col gap-14 items-center">
      {/* Heading */}
      <div className="flex flex-col items-center text-center gap-3">
        <span className="text-[#62a0f6] text-base font-medium leading-6">
          {data?.title}{" "}
        </span>
        <h2 className="text-[28px] sm:text-[30px] font-semibold leading-10 text-[#1e1e1e]">
          {data?.Posts[0].title}
        </h2>
      </div>

      {/* Partner Logos Slider */}
      <Swiper
        modules={[Navigation, Autoplay]}
        spaceBetween={30}
        slidesPerView={1}
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
          640: { slidesPerView: 2 },
          768: { slidesPerView: 3 },
          1024: { slidesPerView: 4 },
        }}
        className="w-full"
      >
        {partnerLogos.map((logo, i) => (
          <SwiperSlide key={i}>
            <PartnerLogo image={logo} />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Navigation Arrows */}
      <div className="flex gap-10 mt-6">
        <NavigationArrow direction="next" buttonRef={nextRef} />
        <NavigationArrow direction="prev" buttonRef={prevRef} />
      </div>
    </div>
  );
};

export default PartnersSection;
