"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { toSecureMediaUrl } from "@/lib/image-url";

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

  const src = toSecureMediaUrl(banner?.attachment?.original);

  return (
    <div ref={bannerRef} className="my-14 overflow-hidden rounded-[24px]">
      {src ? (
        <motion.img
          src={src}
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
      ) : null}
    </div>
  );
}

export default Banner;
