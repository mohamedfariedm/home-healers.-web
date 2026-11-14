"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { toSecureMediaUrl } from "@/lib/image-url";

interface PartnerLogoProps {
  image: string;
  alt: string;
}

const PartnerLogo: React.FC<PartnerLogoProps> = ({ image, alt }) => {
  return (
    <div className="relative mx-auto h-[120px] w-[120px] transition-transform duration-300 sm:h-[180px] sm:w-[180px] md:hover:scale-105 lg:h-[230px] lg:w-[230px]">
      <Image
        src={image}
        alt={alt}
        fill
        sizes="(max-width: 640px) 120px, (max-width: 1024px) 180px, 230px"
        className="object-contain object-center"
        quality={65}
      />
    </div>
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
    data?.Posts?.[0]?.attachment
      ?.map((att: any) =>
        toSecureMediaUrl(att.thumbnail || att.original || ""),
      )
      .filter(Boolean) || [];

  const prevRef = useRef<HTMLDivElement>(null);
  const nextRef = useRef<HTMLDivElement>(null);

  return (
    <div className="mx-auto mb-12 mt-12 flex w-full max-w-screen-xl flex-col items-center gap-8 overflow-x-hidden px-4 sm:mb-16 sm:mt-16 sm:gap-10 lg:mb-24 lg:mt-24 lg:gap-14">
      <div className="flex flex-col items-center gap-3 text-center">
        <span className="text-sm font-medium leading-6 text-[#62a0f6] sm:text-base">
          {data?.title}{" "}
        </span>
        <h2 className="text-[22px] font-semibold leading-8 text-[#1e1e1e] sm:text-[28px] sm:leading-10 lg:text-[30px]">
          {data?.Posts?.[0]?.title}
        </h2>
      </div>

      <Swiper
        modules={[Navigation, Autoplay]}
        spaceBetween={16}
        slidesPerView={2}
        // No autoplay on first paint — Lighthouse scrolls and was paying for
        // continuous Swiper timers on /about. Users still get loop + arrows.
        loop={partnerLogos.length > 2}
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
          640: { slidesPerView: 3 },
          1024: { slidesPerView: 4 },
        }}
        className="w-full"
      >
        {partnerLogos.map((image, index) => (
          <SwiperSlide key={`${image}-${index}`}>
            <PartnerLogo
              image={image}
              alt={
                locale === "ar"
                  ? `شريك ${index + 1}`
                  : `Partner ${index + 1}`
              }
            />
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="flex items-center gap-4">
        <NavigationArrow direction="prev" buttonRef={prevRef} />
        <NavigationArrow direction="next" buttonRef={nextRef} />
      </div>
    </div>
  );
};

export default PartnersSection;
