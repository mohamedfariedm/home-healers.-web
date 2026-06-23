"use client";

import { useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

type HeroCarouselProps = {
  images: string[];
  alt: string;
  quality?: number;
};

export default function HeroCarousel({
  images,
  alt,
  quality = 90,
}: HeroCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <>
      <div className="hidden xl:flex gap-3 items-center absolute bottom-0 left-[355px] z-[1000]">
        {images.map((_, i) => (
          <div
            key={i}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              activeIndex === i
                ? "bg-[url(/assets/images/homepage/hero-pagination-dot.svg)] bg-cover bg-no-repeat"
                : "bg-[#cee2fc]"
            }`}
          />
        ))}
      </div>

      <Swiper
        modules={[Autoplay]}
        slidesPerView={1}
        loop
        autoplay={{ delay: 4000 }}
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
        className="w-full max-w-[727px]"
      >
        {images.map((src, i) => (
          <SwiperSlide key={`${src}-${i}`}>
            <div className="w-full max-w-[727px] h-[624px]">
              <div className="relative w-full h-full xl:w-[727px] xl:mx-0 mx-auto">
                <Image
                  src={src}
                  alt={alt}
                  fill
                  priority={i === 0}
                  quality={quality}
                  loading={i === 0 ? "eager" : "lazy"}
                  sizes="(max-width: 768px) 100vw, 727px"
                  className="object-cover object-center"
                />
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
}
