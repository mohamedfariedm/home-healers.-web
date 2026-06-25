"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Category } from "@/types/booking";

const CategoriesGrid = ({
  locale,
  categories,
  className = "",
}: {
  locale: string;
  categories: Category[];
  className?: string;
}) => {
  const prefix = locale === "ar" ? "" : "/en";

  if (!categories.length) {
    return (
      <p className="text-center text-gray-600 w-full">
        {locale === "ar" ? "لا توجد تخصصات متاحة." : "No categories available."}
      </p>
    );
  }

  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${className}`}
    >
      {categories.map((category, idx) => (
        <motion.div
          key={category.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: idx * 0.08 }}
          viewport={{ once: true, amount: 0.2 }}
          whileHover={{ scale: 1.03, boxShadow: "0 8px 24px rgba(98, 160, 246, 0.2)" }}
        >
          <Link
            href={`${prefix}/categories/${category.id}`}
            className="flex flex-col items-center gap-4 p-6 rounded-xl border-2 border-gray-200 bg-white hover:border-[#62a0f6] transition-all h-full"
          >
            <div className="w-20 h-20 bg-[#eff6fe] rounded-full flex items-center justify-center overflow-hidden">
              <img
                src={
                  category.image?.[0]?.original ||
                  "/assets/images/homehellers/Injury.svg"
                }
                alt={category.name}
                className="w-12 h-12 object-cover rounded-full"
              />
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-[#1e1e1e] mb-1">{category.name}</h3>
              <p className="text-sm text-[#62a0f6]">
                {category.services?.length || 0}{" "}
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
