"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";

interface LandingBannerProps {
  section: any;
  locale: string;
}

// Helper function to extract image URL from various data structures
const getImageUrl = (section: any): string | null => {
  // Try section.image first (direct string)
  if (section.image && typeof section.image === "string" && section.image.trim() !== "") {
    return section.image.trim();
  }
  
  // Try section.attachment.original
  if (section.attachment) {
    if (typeof section.attachment === "object") {
      if (section.attachment.original && typeof section.attachment.original === "string" && section.attachment.original.trim() !== "") {
        return section.attachment.original.trim();
      }
    }
  }
  
  return null;
};

export default function LandingBanner({
  section,
  locale,
}: LandingBannerProps) {
  const bannerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(bannerRef, {
    once: false,
    amount: 0.3,
  });

  const title = section.title?.[locale] || "";
  const content = section.content?.[locale] || "";
  const image = getImageUrl(section);

  const bannerVariants = {
    hidden: { scale: 1.5, opacity: 0 },
    visible: { scale: 1, opacity: 1 },
  };

  return (
    <div ref={bannerRef} className="w-full max-w-7xl mx-auto px-4 lg:px-0">
      <motion.div
        className="w-full h-[300px] my-14 rounded-[24px] overflow-hidden bg-center bg-cover relative flex items-center justify-center"
        style={
          image && typeof image === "string"
            ? {
                backgroundImage: `url(${image})`,
              }
            : {
                backgroundColor: "#143087",
              }
        }
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={bannerVariants}
        transition={{
          type: "spring",
          stiffness: 50,
          damping: 25,
          delay: 0.3,
        }}
      >
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/30" />
        
        {/* Content */}
        <div className="relative z-10 text-center px-6">
          {title && (
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              {title}
            </h2>
          )}
          {content && (
            <p className="text-lg sm:text-xl text-white max-w-2xl">
              {content}
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
}
