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
    <div className="absolute inset-0 h-full w-full overflow-hidden">
      <div className="absolute bottom-3 start-3 z-[1000] hidden items-center gap-3 xl:flex">
        {images.map((_, i) => (
          <div
            key={i}
            className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${
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
        loop={images.length > 2}
        autoplay={{ delay: 4000 }}
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
        className="h-full w-full"
      >
        {images.map((src, i) => (
          <SwiperSlide key={`${src}-${i}`} className="!h-full">
            <div className="relative h-full w-full">
              {/* Slide 0 stays empty — parent Hero already paints the LCP image */}
              {i === 0 ? (
                <div className="h-full w-full" aria-hidden />
              ) : (
                <Image
                  src={src}
                  alt={alt}
                  fill
                  quality={quality}
                  loading="lazy"
                  sizes="(max-width: 768px) 100vw, 727px"
                  className="object-cover object-center"
                />
              )}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
