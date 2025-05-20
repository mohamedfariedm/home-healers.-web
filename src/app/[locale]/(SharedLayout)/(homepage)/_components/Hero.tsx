"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Star ,ArrowLeft} from "lucide-react"; // or use Heroicons / your own

const Dot = ({ className = "", image = "" }: { className?: string; image?: string }) => (
  <div
    className={cn("w-4 h-4 rounded-full absolute bg-cover bg-no-repeat", className)}
    style={{ backgroundImage: image ? `url(${image})` : undefined }}
  />
);

function Hero() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: "-100px" }); // re-trigger when visible again

  return (
    <div ref={ref} className="w-full xl:max-w-[1280px] relative  mx-auto pb-8 px-4 lg:px-0">
      {/* Dots */}
      <motion.div
        className="hidden xl:flex gap-6 items-center absolute bottom-0 left-[355px]"
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ delay: 0.5 }}
      >
        <div className="w-2.5 h-2.5 bg-[#cee2fc] rounded-full" />
        <div className="w-2.5 h-2.5 bg-[#cee2fc] rounded-full" />
        <div
          className="w-2.5 h-2.5 bg-cover bg-no-repeat rounded-full"
          style={{ backgroundImage: "url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-05/FVk8PDuEGs.png)" }}
        />
      </motion.div>

      {/* Layout */}
      <div className="flex relative flex-col-reverse xl:flex-row gap-10 items-center">
        {/* Floating dots background */}
        <motion.div
          className="absolute top-20 right-0 left-[50px] bottom-0 bg-[url(/assets/images/homehellers/dots.svg)] bg-contain -z-0"
          animate={{ opacity: 1, y: [0, 50, 0] }} // animate up and down
          transition={{
            duration: 3,
            ease: "easeInOut",
            repeat: Infinity,
          }}
        />

        {/* Text Section */}
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
            خدمات <span className="text-[#62a0f6]">العلاج الطبيعي</span> والتأهيل الطبي المنزلي
          </motion.div>

          <motion.div
            className="text-[#1e1e1e] text-base sm:text-lg leading-relaxed text-start xl:text-right"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.4 }}
          >
            تطبيق وموقع إلكتروني متخصص في تقديم خدمات العلاج الطبيعي والتأهيل الطبي للعملاء في منازلهم، عبر أخصائيين مؤهلين وذوي كفاءة عالية
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
                تقييم المرضي
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
    transition={{
      duration: 2,
      repeat: Infinity,
      repeatType: "loop",
      delay: i * 0.2, // stagger start for each star
      ease: "easeInOut",
    }}
  >
    <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
  </motion.div>
))}
</motion.div>  
          </div>
          </motion.div>

          <Link href="#booking">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-3 px-5 py-3 bg-[#143087] rounded-md w-fit hover:bg-[#0f245f] transition z-10 relative"
            >
              <span className="text-white text-base sm:text-lg font-medium">احجز جلستك الان</span>
              <ArrowLeft className="w-6 h-6 text-white" />
            </motion.div>
          </Link>
        </motion.div>

        {/* Hero Image */}
        <motion.div
          className="w-full xl:w-auto relative z-10"
          initial={{ opacity: 1, y: -30 }}
          animate={isInView ? { opacity: 1, y: [0, 10, 0] } : { opacity: 1, y: -30 }}
          transition={{ duration: 4, ease: "easeInOut", repeat: Infinity }}
        >
          <div className="xl:w-[727px] h-[624px] bg-[url(/assets/images/homehellers/hero.svg)] bg-cover bg-center xl:bg-contain bg-no-repeat" />
        </motion.div>
      </div>
    </div>
  );
}

export default Hero;
