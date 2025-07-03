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
    <div ref={bannerRef}>
      <motion.div
        className="w-full h-[300px] my-14 rounded-[24px] overflow-hidden bg-center bg-cover"
        style={{
          backgroundImage: `url(${banner?.attachment?.original})`,
        }}
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
