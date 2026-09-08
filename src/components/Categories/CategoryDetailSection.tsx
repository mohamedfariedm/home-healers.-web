"use client";

import { motion } from "framer-motion";
import { ArrowLeft, ArrowUpLeft, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { isRichTextEmpty, localePath } from "@/lib/offers";
import { getPlainTextFromHtml, parseCmsHtml } from "@/lib/parse-cms-html";
import { getLocalizedValue } from "@/lib/seo";
import {
  getActiveServices,
  getCategorySlug,
  getServiceSlug,
  serviceHref,
} from "@/lib/slugs";
import type { Category, Service } from "@/types/booking";

const getLocalized = (value: unknown, loc: string) => {
  if (typeof value === "string") return value;
  if (typeof value === "object" && value !== null && loc in value) {
    return (value as Record<string, string>)[loc];
  }
  if (typeof value === "object" && value !== null && "ar" in value) {
    return (value as Record<string, string>).ar;
  }
  return "";
};

const CategoryDetailSection = ({
  locale,
  category,
}: {
  locale: string;
  category: Category;
}) => {
  const isRTL = locale === "ar";
  const categorySlug = getCategorySlug(category, locale);
  const services: Service[] = getActiveServices(category.services);
  const description = getLocalizedValue(category.description, locale);
  const hasDescription = !isRichTextEmpty(description);
  const image =
    category.image?.[0]?.original ||
    category.icon?.[0]?.original ||
    "/assets/images/homehellers/Injury.svg";

  return (
    <motion.div
      className="max-w-screen-xl mx-auto px-4 mt-12 mb-16 flex flex-col gap-10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-start">
        <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-3xl bg-[#eff6fe] ring-1 ring-[#d7e7fb]">
          <img src={image} alt={category.name} className="h-14 w-14 object-contain" />
        </div>
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl sm:text-3xl font-semibold text-[#1e1e1e]">
            {category.name}
          </h1>
          <p className="text-[#62a0f6] text-sm font-semibold">
            {services.length}{" "}
            {isRTL
              ? services.length === 1
                ? "خدمة في هذا التخصص"
                : "خدمات في هذا التخصص"
              : services.length === 1
                ? "service in this specialty"
                : "services in this specialty"}
          </p>
        </div>
      </div>

      {hasDescription ? (
        <div className="rounded-[24px] border border-[#e6eef8] bg-white p-6 sm:p-8 shadow-[0_10px_30px_rgba(20,48,135,0.04)]">
          <div
            className={`offer-prose category-prose max-w-none text-[#475467] ${
              isRTL ? "text-right" : "text-left"
            }`}
          >
            {parseCmsHtml(description, { keepHeadings: true })}
          </div>
        </div>
      ) : null}

      {services.length > 0 ? (
        <section className="flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
            <div>
              <span className="text-sm font-medium text-[#62a0f6]">
                {isRTL ? "خدمات التخصص" : "Specialty services"}
              </span>
              <h2 className="text-xl sm:text-2xl font-semibold text-[#1e1e1e] mt-1">
                {isRTL ? "اختر الخدمة المناسبة" : "Choose the right service"}
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {services.map((service, idx) => {
              const serviceName = getLocalized(service.name, locale) || service.name;
              const href = serviceHref(
                locale,
                categorySlug,
                getServiceSlug(service, locale),
              );
              const excerpt = service.description
                ? getPlainTextFromHtml(service.description).slice(0, 140)
                : "";

              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                >
                  <Link
                    href={href}
                    className="group flex h-full flex-col overflow-hidden rounded-[24px] border border-[#e6eef8] bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[#62a0f6] hover:shadow-[0_18px_40px_rgba(20,48,135,0.12)]"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-[#eff6fe] ring-1 ring-[#d7e7fb]">
                        <img
                          src={
                            service.icon?.[0]?.original ||
                            service.image?.[0]?.thumbnail ||
                            service.image?.[0]?.original ||
                            "/assets/images/homehellers/Injury.svg"
                          }
                          alt={serviceName}
                          className="h-10 w-10 rounded-xl object-cover"
                        />
                      </div>
                      <h3 className="text-lg font-semibold leading-7 text-[#1e1e1e] transition-colors duration-300 group-hover:text-[#143087]">
                        {serviceName}
                      </h3>
                    </div>

                    {excerpt ? (
                      <p className="mt-4 text-sm leading-6 text-[#475467] line-clamp-3">
                        {excerpt}
                      </p>
                    ) : null}

                    <div className="mt-auto flex items-center gap-2 pt-5 text-sm font-medium text-[#62a0f6]">
                      <span>
                        {isRTL ? "عرض تفاصيل الخدمة" : "View service details"}
                      </span>
                      {isRTL ? (
                        <ArrowUpLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-0.5 group-hover:-translate-y-0.5" />
                      ) : (
                        <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      )}
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </section>
      ) : (
        <p className="text-center text-gray-600">
          {isRTL
            ? "لا توجد خدمات في هذا التخصص حالياً."
            : "No services in this specialty yet."}
        </p>
      )}

      <div className="flex justify-center">
        <Link
          href={localePath(locale, "/booking")}
          className="bg-[#143087] text-white flex items-center hover:scale-105 duration-300 transition-all justify-center gap-2 px-6 py-3 rounded-xl"
        >
          {isRTL ? "احجز جلستك العلاجية الان" : "Book Your Therapy Session Now"}
          <ArrowLeft className="w-4 h-4" />
        </Link>
      </div>
    </motion.div>
  );
};

export default CategoryDetailSection;
