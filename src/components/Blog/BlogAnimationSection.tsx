"use client";

import { motion } from "framer-motion";
import React, { useMemo, useState } from "react";
import { ShowMore } from "../Animations/ShowMore";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { blogHref, formatApiDate, getBlogSlug, getNewsTitle } from "@/lib/slugs";

// ===== Settings =====
const ITEMS_PER_PAGE = 9;

// ===== Animations =====
const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
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
    transition: { staggerChildren: 0.15, ease: [0.4, 0, 0.2, 1] },
  },
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

type BlogAnimationSectionProps = {
  locale: string;
  data: any[];
};

const BlogAnimationSection = ({
  locale,
  data = [],
}: BlogAnimationSectionProps) => {
  const isRTL = locale === "ar";
  const [activePage, setActivePage] = useState(1);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil((data?.length || 0) / ITEMS_PER_PAGE)),
    [data]
  );
  const startIndex = (activePage - 1) * ITEMS_PER_PAGE;
  const currentCards = useMemo(
    () => data?.slice(startIndex, startIndex + ITEMS_PER_PAGE) || [],
    [data, startIndex]
  );

  const goPrev = () => setActivePage((p) => Math.max(1, p - 1));
  const goNext = () => setActivePage((p) => Math.min(totalPages, p + 1));

  const formatDate = (dateString: string) => formatApiDate(dateString, locale);

  // Strip HTML for teaser text
  const truncateDescription = (html: string, maxLength: number = 120) => {
    if (!html) return "";
    const text = html
      .replace(/<[^>]+>/g, "")
      .replace(/\s+/g, " ")
      .trim();
    return text.length > maxLength ? text.slice(0, maxLength) + "…" : text;
  };

  // Localized strings
  const t = {
    prev: isRTL ? "الصفحة السابقة" : "Previous Page",
    next: isRTL ? "الصفحة التالية" : "Next Page",
  };

  if (!data || data.length === 0) return null;

  return (
    <>
      <motion.div
        className="max-w-screen-xl mx-auto px-4 py-16"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        dir={isRTL ? "rtl" : "ltr"}
      >
        <div
          className={`grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-10 ${
            isRTL ? "text-right" : "text-left"
          }`}
        >
          {currentCards.map((card: any) => {
            const href = blogHref(locale, getBlogSlug(card));
            const title = getNewsTitle(card, locale);
            const img =
              card?.image?.[0]?.original || "/assets/images/placeholder.jpg";
            return (
              <Link
                href={href}
                key={card.id}
                className="focus:outline-none focus:ring-2 focus:ring-[#62a0f6] rounded-[24px]"
              >
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
                      backgroundImage: `url(${img})`,
                      transformStyle: "preserve-3d",
                    }}
                    aria-label={title}
                  />

                  {/* Content */}
                  <div
                    className={`flex flex-col gap-5 px-6 pt-4 ${
                      isRTL ? "text-right" : "text-left"
                    }`}
                  >
                    <span className="text-[#62a0f6] text-sm font-medium">
                      {formatDate(card?.date)}
                    </span>
                    <h3 className="text-xl font-semibold text-[#1e1e1e]">
                      {title}
                    </h3>
                    <p className="text-sm text-[#1e1e1e] leading-8 font-light">
                      {truncateDescription(card?.description)}
                    </p>
                  </div>

                  {/* Button */}
                  <ShowMore locale={locale} />
                </motion.div>
              </Link>
            );
          })}
        </div>
      </motion.div>

      {/* Pagination */}
      {totalPages > 1 && (
        <motion.div
          className="w-full flex justify-center mt-12"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          dir={isRTL ? "rtl" : "ltr"}
        >
          <div
            className={`flex items-center gap-6 select-none ${
              isRTL ? "flex-row-reverse" : ""
            }`}
          >
            {/* Prev */}
            <motion.button
              onClick={goPrev}
              disabled={activePage === 1}
              aria-label={t.prev}
              aria-disabled={activePage === 1}
              className={`p-2 rounded-full text-[#143087] disabled:opacity-40 disabled:cursor-not-allowed 
                          hover:scale-110 transition-transform`}
              type="button"
            >
              {/* For RTL, previous means pointing right */}
              {isRTL ? (
                <ChevronRight size={28} strokeWidth={2} />
              ) : (
                <ChevronLeft size={28} strokeWidth={2} />
              )}
            </motion.button>

            {/* Page Numbers */}
            <div
              className={`flex items-center rounded-full ${
                isRTL ? "flex-row-reverse" : ""
              } gap-6`}
            >
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => {
                  const isActive = page === activePage;
                  // show first, last, and neighbors
                  const withinWindow =
                    page === 1 ||
                    page === totalPages ||
                    (page >= activePage - 1 && page <= activePage + 1);

                  const showEllipsisLeft =
                    page === activePage - 2 && activePage > 3;
                  const showEllipsisRight =
                    page === activePage + 2 && activePage < totalPages - 2;

                  if (withinWindow) {
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
                        type="button"
                      >
                        {page}
                      </motion.button>
                    );
                  } else if (showEllipsisLeft || showEllipsisRight) {
                    return (
                      <span
                        key={`ellipsis-${page}`}
                        className="text-xs font-medium select-none"
                      >
                        …
                      </span>
                    );
                  }
                  return null;
                }
              )}
            </div>

            {/* Next */}
            <motion.button
              onClick={goNext}
              disabled={activePage === totalPages}
              aria-label={t.next}
              aria-disabled={activePage === totalPages}
              className={`p-2 rounded-full text-[#143087] disabled:opacity-40 disabled:cursor-not-allowed 
                          hover:scale-110 transition-transform`}
              type="button"
            >
              {/* For RTL, next means pointing left */}
              {isRTL ? (
                <ChevronLeft size={28} strokeWidth={2} />
              ) : (
                <ChevronRight size={28} strokeWidth={2} />
              )}
            </motion.button>
          </div>
        </motion.div>
      )}
    </>
  );
};

export default BlogAnimationSection;
