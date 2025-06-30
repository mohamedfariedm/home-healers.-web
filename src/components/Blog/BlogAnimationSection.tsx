"use client";

import { motion } from "framer-motion";
import React, { useState } from "react";
import { ShowMore } from "../Animations/ShowMore";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import parse from "html-react-parser"; // Import html-react-parser

const ITEMS_PER_PAGE = 9; // Number of cards per page (based on the grid layout)

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

const BlogAnimationSection = ({ locale, data }: { locale: string; data: any }) => {
  const [activePage, setActivePage] = useState(1); // Start at page 1
  const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE); // Calculate total pages based on data length

  // Get the cards for the current page
  const startIndex = (activePage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentCards = data.slice(startIndex, endIndex);

  const goPrev = () => {
    if (activePage > 1) setActivePage(activePage - 1);
  };

  const goNext = () => {
    if (activePage < totalPages) setActivePage(activePage + 1);
  };

  // Format date function
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ar-EG", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // Truncate description to avoid overly long text
  const truncateDescription = (html: string, maxLength: number = 100) => {
    const text = html.replace(/<[^>]+>/g, ""); // Strip HTML tags
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
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
          {currentCards.map((card: any, i: number) => (
            <Link href={`/${locale}/blogs/${card.id}`} key={card.id}>
              <motion.div
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
                    backgroundImage: `url(${card.image[0]?.thumbnail || "/assets/images/placeholder.jpg"})`,
                    transformStyle: "preserve-3d",
                  }}
                />

                {/* Content */}
                <div className="flex flex-col gap-5 px-6 pt-4 text-right">
                  <span className="text-[#62a0f6] text-sm font-medium">{formatDate(card.date)}</span>
                  <h3 className="text-xl font-semibold text-[#1e1e1e] whitespace-wrap">
                    {card.name}
                  </h3>
                  <p className="text-sm text-[#1e1e1e] leading-8 font-light">
                    {truncateDescription(card.description)}
                  </p>
                </div>

                {/* Button */}
                <ShowMore />
              </motion.div>
            </Link>
          ))}
        </div>
      </motion.div>

      {/* Pagination */}
      {totalPages > 1 && (
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
              {[...Array(totalPages)].map((_, idx) => {
                const page = idx + 1;
                const isActive = page === activePage;
                // Show only a subset of page numbers for brevity
                if (
                  page === 1 ||
                  page === totalPages ||
                  (page >= activePage - 1 && page <= activePage + 1)
                ) {
                  return (
                    <motion.button
                      key={page}
                      onClick={() => setActivePage(page)}
                      aria-current={isActive ? "page" : undefined}
                      variants={pageVariants}
                      initial="initial"
                      animate={isActive ? "active" : "initial"}
                      whileHover={!isActive ? "hover" : undefined}
                      className="text-xs font-medium cursor-pointer"
                    >
                      {page}
                    </motion.button>
                    );
                  } else if (
                    (page === activePage - 2 && activePage > 3) ||
                    (page === activePage + 2 && activePage < totalPages - 2)
                  ) {
                    return (
                      <span key={page} className="text-xs font-medium cursor-default select-none">
                        ...
                      </span>
                    );
                  }
                  return null;
                })}
              </div>

              {/* Next Arrow */}
              <motion.button
                onClick={goNext}
                disabled={activePage === totalPages}
                aria-label="Next Page"
                aria-disabled={activePage === totalPages}
                initial="rest"
                animate={activePage === totalPages ? "disabled" : "rest"}
                whileHover={activePage !== totalPages ? "hover" : undefined}
                className="p-2 rounded-full text-[#143087]"
                style={{ cursor: activePage === totalPages ? "not-allowed" : "pointer" }}
              >
                <ChevronRight size={28} strokeWidth={2} />
              </motion.button>
            </div>
          </motion.div>
        )}
      </>
    );
  };
  
  export default BlogAnimationSection;