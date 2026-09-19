"use client";
import { useRef } from "react";
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
        <motion.img
          src={src}
          alt="Banner"
          className="block h-auto w-full"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={bannerVariants}
          transition={{
            type: "spring",
            stiffness: simplifyMotion ? 80 : 50,
            damping: 25,
            delay: simplifyMotion ? 0 : 0.2,
          }}
        />
      ) : null}
    </div>
  );
}

export default Banner;
