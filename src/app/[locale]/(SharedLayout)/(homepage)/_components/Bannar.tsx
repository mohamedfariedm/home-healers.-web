"use client";
import { useRef } from "react";
import Image from "next/image";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { toSecureMediaUrl } from "@/lib/image-url";
import { useIsMobile } from "@/Hooks/use-mobile";

function Banner({ banner }: { banner: any }) {
  const bannerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const prefersReducedMotion = useReducedMotion();
  const simplifyMotion = isMobile || !!prefersReducedMotion;

  const isInView = useInView(bannerRef, {
    once: true,
    amount: 0.2,
  });

  const bannerVariants = {
    hidden: { scale: simplifyMotion ? 1.08 : 1.5, opacity: 0 },
    visible: { scale: 1, opacity: 1 },
  };

  const src = toSecureMediaUrl(banner?.attachment?.original);

  return (
    <div
      ref={bannerRef}
      className="mx-4 my-8 overflow-hidden rounded-2xl sm:mx-6 sm:my-14 sm:rounded-[24px] lg:mx-auto lg:max-w-7xl"
    >
      {src ? (
        <motion.div
          className="relative aspect-[16/6] w-full min-h-[140px] sm:min-h-[180px]"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={bannerVariants}
          transition={{
            type: "spring",
            stiffness: simplifyMotion ? 80 : 50,
            damping: 25,
            delay: simplifyMotion ? 0 : 0.2,
          }}
        >
          <Image
            src={src}
            alt="Banner"
            fill
            sizes="(max-width: 1280px) 100vw, 1280px"
            className="object-cover object-center"
            quality={70}
          />
        </motion.div>
      ) : null}
    </div>
  );
}

export default Banner;
