"use client";

import { motion } from "framer-motion";
import React, { useState } from "react";
import { ShowMore } from "../Animations/ShowMore";
import { ChevronLeft, ChevronRight } from "lucide-react";

const cardsData = Array(9).fill({
  image: "jdGR6vHAgn.png",
  icon: "1di6rA4HpR.png",
});

const TOTAL_PAGES = 20;

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
  hover: {
    scale: 1.06,
    boxShadow: "0 15px 25px rgba(0,0,0,0.2)",
    rotateX: 5,
    rotateY: 5,
    transition: { duration: 0.4, ease: "easeOut" },
  },
  tap: { scale: 0.98 },
};

const containerVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      staggerChildren: 0.15,
      ease: [0.4, 0, 0.2, 1], // smooth cubic-bezier easeOut
    },
  },
};

const arrowVariants = {
  rest: { scale: 1, boxShadow: "0px 0px 0px rgba(0,0,0,0)" },
  hover: { scale: 1.15, boxShadow: "0px 5px 10px rgba(0,0,0,0.15)" },
  disabled: { scale: 1, boxShadow: "none", opacity: 0.4, pointerEvents: "none" },
};

const pageVariants = {
  initial: { scale: 1, color: "#1e1e1e" },
  active: {
    scale: 1.3,
    color: "#62a0f6",
    transition: { type: "spring", stiffness: 300, damping: 20 },
  },
  hover: { scale: 1.2, color: "#4287f5" },
};

const BlogAnimationSection = () => {
  const [activePage, setActivePage] = useState(2);

  // For demo, cards stay the same on all pages
  const cards = cardsData;

  const goPrev = () => {
    if (activePage > 1) setActivePage(activePage - 1);
  };

  const goNext = () => {
    if (activePage < TOTAL_PAGES) setActivePage(activePage + 1);
  };

  return (
    <>
      <motion.div
        className="max-w-screen-xl mx-auto px-4 py-16"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-10">
          {cards.map((card, i) => (
            <motion.div
              key={i}
              className="relative w-full max-w-[400px] h-[550px] bg-[#eff6fe] rounded-[24px] overflow-hidden mx-auto cursor-pointer shadow-md"
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              whileTap="tap"
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* Image */}
              <div
                className="h-[268px] bg-cover bg-no-repeat rounded-[20px] m-4"
                style={{
                  backgroundImage: `url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-18/${card.image})`,
                  transformStyle: "preserve-3d",
                }}
              />

              {/* Content */}
              <div className="flex flex-col gap-5 px-6 pt-4 text-right">
                <span className="text-[#62a0f6] text-sm font-medium">3 ديسمبر 2025</span>
                <h3 className="text-xl font-semibold text-[#1e1e1e] whitespace-nowrap">
                  اخر تطورات المجال الطبي
                </h3>
                <p className="text-sm text-[#1e1e1e] leading-8 font-light">
                  هنا يكتب وصف بسيط عن المنتج في سطرين كمثال , هنا يكتب وصف بسيط عن المنتج في سطرين كمثال.
                </p>
              </div>

              {/* Button */}
              <ShowMore />
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Pagination */}
      <motion.div
        className="w-full flex justify-center mt-12"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="flex items-center gap-6 select-none">
          {/* Previous Arrow */}
          <motion.button
            onClick={goPrev}
            disabled={activePage === 1}
            aria-label="Previous Page"
            aria-disabled={activePage === 1}
                        // @ts-ignore

            variants={arrowVariants}
            initial="rest"
            animate={activePage === 1 ? "disabled" : "rest"}
            whileHover={activePage !== 1 ? "hover" : undefined}
            className="p-2 rounded-full text-[#143087]"
            style={{ cursor: activePage === 1 ? "not-allowed" : "pointer" }}
          >
            <ChevronLeft size={28} strokeWidth={2} />
          </motion.button>

          {/* Page Numbers */}
          <div className="flex gap-6 items-center rounded-full">
            {[1, 2, 3, "...", TOTAL_PAGES].map((page, idx) => {
              const isActive = page === activePage;
              const isEllipsis = page === "...";
              return (
                <motion.button
                  key={idx}
                  onClick={() => !isEllipsis && setActivePage(page as number)}
                  disabled={isEllipsis}
                  aria-current={isActive ? "page" : undefined}
                  variants={pageVariants}
                  initial="initial"
                  animate={isActive ? "active" : "initial"}
                  whileHover={!isActive && !isEllipsis ? "hover" : undefined}
                  className={`text-xs font-medium cursor-pointer ${
                    isEllipsis ? "cursor-default select-none" : ""
                  }`}
                  style={{
                    pointerEvents: isEllipsis ? "none" : "auto",
                  }}
                >
                  {page}
                </motion.button>
              );
            })}
          </div>

          {/* Next Arrow */}
          <motion.button
            onClick={goNext}
            disabled={activePage === TOTAL_PAGES}
            aria-label="Next Page"
            aria-disabled={activePage === TOTAL_PAGES}
            // @ts-ignore
            variants={arrowVariants}
            initial="rest"
            animate={activePage === TOTAL_PAGES ? "disabled" : "rest"}
            whileHover={activePage !== TOTAL_PAGES ? "hover" : undefined}
            className="p-2 rounded-full text-[#143087]"
            style={{ cursor: activePage === TOTAL_PAGES ? "not-allowed" : "pointer" }}
          >
            <ChevronRight size={28} strokeWidth={2} />
          </motion.button>
        </div>
      </motion.div>
    </>
  );
};

export default BlogAnimationSection;
