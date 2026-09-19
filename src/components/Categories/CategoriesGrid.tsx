"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Category } from "@/types/booking";
import { categoryHrefFrom, getActiveServices } from "@/lib/slugs";
import { toSecureMediaUrl } from "@/lib/image-url";

const CategoriesGrid = ({
  locale,
  categories,
  className = "",
}: {
  locale: string;
  categories: Category[];
  className?: string;
}) => {
  if (!categories.length) {
    return (
      <p className="w-full text-center text-gray-600">
        {locale === "ar" ? "لا توجد تخصصات متاحة." : "No categories available."}
      </p>
    );
  }

  return (
    <div
      className={`grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4 ${className}`}
    >
      {categories.map((category, idx) => (
        <motion.div
          key={category.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: idx * 0.06 }}
          viewport={{ once: true, amount: 0.2 }}
        >
          <Link
            href={categoryHrefFrom(locale, category)}
            className="group relative flex h-full flex-col items-center gap-4 overflow-hidden rounded-[24px] border border-[#e6eef8] bg-white p-6 text-center shadow-[0_8px_30px_rgba(20,48,135,0.05)] transition-all duration-300 hover:-translate-y-1 hover:border-[#62a0f6] hover:shadow-[0_18px_40px_rgba(20,48,135,0.12)]"
          >
            <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl bg-[#eff6fe] ring-1 ring-[#d7e7fb]">
              <img
                src={
                  toSecureMediaUrl(category.image?.[0]?.original) ||
                  "/assets/images/homehellers/Injury.svg"
                }
                alt={category.name}
                className="h-12 w-12 object-contain"
              />
            </div>
            <div>
              <h3 className="mb-1 font-semibold text-[#1e1e1e] transition-colors group-hover:text-[#143087]">
                {category.name}
              </h3>
              <p className="text-sm font-medium text-[#62a0f6]">
                {getActiveServices(category.services).length}{" "}
                {locale === "ar" ? "خدمة" : "services"}
              </p>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
};

export default CategoriesGrid;
