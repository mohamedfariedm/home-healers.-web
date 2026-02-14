"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";

function Banner({ banner }: { banner: any }) {
  const bannerRef = useRef<HTMLDivElement>(null);

  const isInView = useInView(bannerRef, {
    once: false,
    amount: 0.3,
  });

  const bannerVariants = {
    hidden: { scale: 1.5, opacity: 0 },
    visible: { scale: 1, opacity: 1 },
  };

  return (
    <div ref={bannerRef} className="my-14 overflow-hidden rounded-[24px]">
      <motion.img
        src={banner?.attachment?.original}
        alt="Banner"
        className="w-full h-auto block"
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={bannerVariants}
        transition={{
          type: "spring",
          stiffness: 50,
          damping: 25,
          delay: 0.3,
        }}
      />
    </div>
  );
}

export default Banner;
