"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Star, ArrowLeft } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

function Hero({ locale, section }: { locale: string; section: any }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: "-100px" });
  const [activeIndex, setActiveIndex] = useState(0);

  // Use attachment images or fallback to default
  const heroImages = section?.Posts?.[0]?.attachment?.map((att: any) => att.original) || [
    "/assets/images/homehellers/hero.svg",
  ];

  return (
    <div ref={ref} className="w-full xl:max-w-[1280px] relative mx-auto pb-8 px-4 lg:px-0">
      {/* Dots (custom pagination) */}
      <motion.div
        className="hidden xl:flex gap-3 items-center absolute bottom-0 left-[355px] z-[1000]"
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ delay: 0.5 }}
      >
        {heroImages.map((_:any, i: number) => (
          <div
            key={i}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              activeIndex === i
                ? "bg-[url('https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-05/FVk8PDuEGs.png')] bg-cover bg-no-repeat"
                : "bg-[#cee2fc]"
            }`}
          />
        ))}
      </motion.div>

      <div className="flex relative flex-col-reverse xl:flex-row gap-10 items-center">
        <motion.div
          className="absolute top-20 right-0 left-[50px] bottom-0 bg-[url(/assets/images/homehellers/dots.svg)] bg-contain -z-0"
          animate={{ opacity: 1, y: [0, 50, 0] }}
          transition={{ duration: 3, ease: "easeInOut", repeat: Infinity }}
        />

        <motion.div
          className="relative w-full xl:w-1/2 flex flex-col gap-8 justify-center bg-no-repeat bg-contain"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <motion.div
            className="text-[#1e1e1e] text-2xl sm:text-3xl lg:text-4xl font-semibold leading-snug text-start xl:text-right relative z-10"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.3 }}
          >
            {section?.Posts?.[0]?.title || "Physical Therapy and Rehabilitation Services"}
          </motion.div>

          <motion.div
            className="text-[#1e1e1e] text-base sm:text-lg leading-relaxed text-start xl:text-right"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.4 }}
          >
            {section?.Posts?.[0]?.description ||
              "A specialized application and website providing in-home physical therapy and medical rehabilitation services through highly qualified specialists."}
          </motion.div>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 items-center relative z-10"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.5 }}
          >
            <div className="w-[200px] h-[56px] bg-[url(/assets/images/homehellers/rating.svg)] bg-cover bg-no-repeat" />
            <div className="flex flex-col gap-1">
              <span className="text-sm sm:text-base font-semibold text-[#1e1e1e] whitespace-nowrap">
                تقيم المرضي
              </span>
              <motion.div
                className="flex gap-1 items-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.6 }}
              >
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{ scale: [1, 1.25, 1] }}
                    transition={{ duration: 2, repeat: Infinity, repeatType: "loop", delay: i * 0.2, ease: "easeInOut" }}
                  >
                    <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.div>

          <Link href={`/${locale}/specialty/subspecialty`}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-3 px-5 py-3 bg-[#143087] rounded-md w-fit hover:bg-[#0f245f] transition z-10 relative"
            >
              <span className="text-white text-base sm:text-lg font-medium">
            احجز جلستك الآن
              </span>
              <ArrowLeft className="w-6 h-6 text-white" />
            </motion.div>
          </Link>
        </motion.div>

        <div className="w-full xl:w-auto relative z-10 max-w-[727px]">
          <Swiper
            modules={[Pagination, Autoplay]}
            slidesPerView={1}
            loop
            autoplay={{ delay: 4000 }}
            onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
            className="w-full max-w-[727px]"
          >
            {heroImages.map((src: string, i: number) => (
              <SwiperSlide key={i}>
                <div className="w-full max-w-[727px] h-[624px]">
                  <motion.div
                    className="w-[727px] h-full bg-cover bg-center bg-no-repeat"
                    style={{ backgroundImage: `url(${src})` }}
                    initial={{ opacity: 1, y: -30 }}
                    animate={isInView ? { opacity: 1, y: [0, 10, 0] } : { opacity: 1, y: -30 }}
                    transition={{ duration: 4, ease: "easeInOut", repeat: Infinity }}
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
}

export default Hero;