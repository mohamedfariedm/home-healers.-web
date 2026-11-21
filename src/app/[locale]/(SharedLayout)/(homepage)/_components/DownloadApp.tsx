"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import AppHeader from "./AppHeader";
import AppRating from "./AppRating";
import DownloadButtons from "./DownloadButtons";

function DownloadApp({ section, locale }: { section: any; locale: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, {
    once: false,
    amount: 0.3,
  });

  const post = section?.Posts?.[0];

  return (
    <div className="relative mx-4 my-12 overflow-hidden rounded-[32px] bg-[#eff6fe] shadow-[0_18px_50px_rgba(20,48,135,0.08)] sm:mx-6 lg:mx-auto lg:max-w-7xl">
      <div className="flex flex-col lg:flex-row">
        {/* End side with content - becomes bottom on mobile */}
        <div className="relative flex w-full flex-col justify-center p-6 lg:w-1/2 lg:p-10">
          <div className="relative z-10 flex flex-col items-start gap-8">
            <AppHeader title={section?.title} description={post?.description} />
            <AppRating locale={locale} />
            <DownloadButtons locale={locale} />
          </div>
        </div>

        {/* Left side with app image - becomes top on mobile */}
        <div ref={containerRef} className="relative w-full lg:w-1/2">
          {/* First Image (coming from left to right) */}
          <motion.div
            className="absolute top-0 left-0 z-10 h-full w-full"
            initial={{ x: "-100%" }}
            animate={isInView ? { x: 0 } : { x: "-100%" }}
            transition={{
              type: "spring",
              stiffness: 100,
              damping: 25,
              restDelta: 0.001,
            }}
          >
            <img
              src="/assets/images/homehellers/Elements1.svg"
              alt=""
              width={640}
              height={640}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover"
            />
          </motion.div>

          {/* Second Image (coming from bottom to top) */}
          <motion.div
            className="relative z-20 mx-auto px-4 py-6 lg:mx-0 lg:p-0"
            initial={{ y: "100%" }}
            animate={isInView ? { y: 0 } : { y: "100%" }}
            transition={{
              type: "spring",
              stiffness: 100,
              damping: 25,
              delay: 0.2,
              restDelta: 0.001,
            }}
          >
            <img
              src="/assets/images/homehellers/landing_page_01.svg"
              alt="App screenshot"
              width={448}
              height={560}
              loading="lazy"
              decoding="async"
              className="mx-auto h-auto w-full max-w-xs object-contain lg:mx-8 lg:max-w-md"
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default DownloadApp;
