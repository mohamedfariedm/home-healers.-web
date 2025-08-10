"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

type ShowMoreProps = {
  locale?: any;
  dir?: "rtl" | "ltr";
  label?: string;
  /** If provided, renders as <a>; otherwise as <button> */
  href?: string;
  onClick?: () => void;
  /** Corner anchor: auto-flips with RTL when set to "start"/"end" */
  anchor?: "start" | "end"; // start = left in LTR, right in RTL
  className?: string;
};

const ShowMoreBase: React.FC<ShowMoreProps> = ({
  locale = "ar",
  dir,
  label,
  href,
  onClick,
  anchor = "start",
  className = "",
}) => {
  const isRTL = (dir ?? (locale === "ar" ? "rtl" : "ltr")) === "rtl";
  const prefersReducedMotion = useReducedMotion();

  const tLabel = label ?? (isRTL ? "عرض المزيد" : "Show more");

  // Positioning: start/end flips with dir
  const anchorClass =
    anchor === "start"
      ? isRTL
        ? "right-4"
        : "left-4"
      : isRTL
      ? "left-4"
      : "right-4";

  // Icon: point inward (toward the center of the screen)
  const Icon = isRTL ? ArrowLeft /* inward if anchored right */ : ArrowRight;

  // Hover expansion sizes
  const collapsed = { w: 56, h: 56 };
  const expanded = { w: 161, h: 56 };

  const common = (
            <motion.div 
  className="absolute bottom-4 rtl:left-4 ltr:right-4 flex items-center gap-2 group text-white text-xs"
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ delay: 0.3, ease: "easeInOut" }}
>
  <motion.div
    className="relative w-14 h-14 cursor-pointer rounded-full group overflow-visible"
    whileHover={{ width: 161, height: 56, transition: { duration: 0.6, ease: "easeInOut" } }}
    transition={{ 
      type: "spring",
      stiffness: 400,
      damping: 30,
      ease: "easeInOut",
      duration: 0
    }}
    style={{ transformOrigin: "left center" }}
  >
    <motion.div 
      className="absolute inset-0 bg-[#143087] border border-white rounded-full"
      whileHover={{ scale: 1.03, transition: { duration: 0, ease: "easeInOut" } }}
      transition={{ type: "spring", stiffness: 300, damping: 15 }}
    />
    <motion.div 
      className="absolute left-[7px] top-[7px] w-[42px] h-[42px] flex items-center justify-between overflow-visible"
      whileHover={{ width: "100%", height: "100%", left: 0, top: 0, transition: { duration: 0, ease: "easeInOut" } }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <motion.span 
        className="text-white absolute z-20 w-full h-full flex items-center justify-center text-xs font-medium whitespace-nowrap"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1, transition: { duration: 0, ease: "easeInOut" } }}
        transition={{ duration: 0, ease: "easeInOut" }}
      >
       {locale === "ar" ? "عرض المزيد" : "Show more"}
      </motion.span>
     <motion.div
  className="absolute inset-0 flex items-center justify-center rounded-full z-10"
  initial={{ opacity: 1 }}
        whileHover={{ opacity: 0, transition: { duration: 0, ease: "easeInOut" } }}
        transition={{ duration: 0, ease: "easeInOut" }}
>
  <ArrowLeft className="w-6 h-6 text-white -rotate-45 group-hover:hidden" />
</motion.div>
    </motion.div>
  </motion.div>
</motion.div>
  );

  // Render as link or button wrapper to keep focus/hover on the animated node
  if (href) {
    return (
      <Link href={href} aria-label={tLabel} className="relative block">
        {common}
      </Link>
    );
  }
  return (
      common
  );
};

export const ShowMore = React.memo(ShowMoreBase);
