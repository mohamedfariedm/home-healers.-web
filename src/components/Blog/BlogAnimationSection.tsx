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
    scale: 1.02,
    boxShadow: "0 12px 22px rgba(0,0,0,0.12)",
    transition: { duration: 0.3, ease: "easeOut" },
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
  const formatPage = (page: number) =>
    page.toLocaleString(isRTL ? "ar-EG" : "en-US");

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
        className="mx-auto max-w-screen-xl px-4 py-10 sm:px-6 sm:py-16"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        dir={isRTL ? "rtl" : "ltr"}
      >
        <div
          className={`grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 xl:grid-cols-3 xl:gap-10 ${
            isRTL ? "text-right" : "text-left"
          }`}
        >
          {currentCards.map((card: any) => {
            const href = blogHref(locale, getBlogSlug(card, locale));
            const title = getNewsTitle(card, locale);
            const img =
              card?.image?.[0]?.original || "/assets/images/placeholder.jpg";
            return (
              <Link
                href={href}
                key={card.id}
                className="min-w-0 rounded-[24px] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#62a0f6]"
              >
                <motion.div
                  className="relative mx-auto flex h-full w-full max-w-[400px] flex-col overflow-hidden rounded-[24px] border border-[#d7e4f8] bg-white shadow-[0_10px_30px_rgba(20,48,135,0.08)]"
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover="hover"
                  whileTap="tap"
                >
                  <div
                    className="mx-3 mt-3 h-[180px] rounded-[20px] bg-cover bg-center bg-no-repeat sm:mx-4 sm:mt-4 sm:h-[220px] md:h-[248px]"
                    style={{
                      backgroundImage: `url(${img})`,
                    }}
                    aria-label={title}
                  />

                  <div
                    className={`flex flex-1 flex-col gap-3 px-4 pt-4 pb-20 sm:gap-4 sm:px-6 ${
                      isRTL ? "text-right" : "text-left"
                    }`}
                  >
                    <span className="text-sm font-medium text-[#62a0f6]">
                      {formatDate(card?.date)}
                    </span>
                    <h3 className="line-clamp-2 break-words text-lg font-semibold text-[#1e1e1e] sm:text-xl">
                      {title}
                    </h3>
                    <p className="line-clamp-3 text-sm font-light leading-7 text-[#1e1e1e] sm:leading-8">
                      {truncateDescription(card?.description)}
                    </p>
                  </div>

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
          className="mt-8 mb-10 flex w-full justify-center px-4 sm:mt-12"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          dir={isRTL ? "rtl" : "ltr"}
        >
          <div className="flex max-w-full flex-wrap items-center justify-center gap-3 select-none sm:gap-6">
            <motion.button
              onClick={goPrev}
              disabled={activePage === 1}
              aria-label={t.prev}
              aria-disabled={activePage === 1}
              className="p-2 rounded-full text-[#143087] disabled:opacity-40 disabled:cursor-not-allowed hover:scale-110 transition-transform"
              type="button"
            >
              {isRTL ? (
                <ChevronRight size={28} strokeWidth={2} />
              ) : (
                <ChevronLeft size={28} strokeWidth={2} />
              )}
            </motion.button>

            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => {
                  const isActive = page === activePage;
                  const withinWindow =
                    page === 1 ||
                    page === totalPages ||
                    (page >= activePage - 1 && page <= activePage + 1);

                  const showEllipsisBefore =
                    page === activePage - 2 && activePage > 3;
                  const showEllipsisAfter =
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
                        {formatPage(page)}
                      </motion.button>
                    );
                  }
                  if (showEllipsisBefore || showEllipsisAfter) {
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

            <motion.button
              onClick={goNext}
              disabled={activePage === totalPages}
              aria-label={t.next}
              aria-disabled={activePage === totalPages}
              className="p-2 rounded-full text-[#143087] disabled:opacity-40 disabled:cursor-not-allowed hover:scale-110 transition-transform"
              type="button"
            >
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
