"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { parseCmsHtml } from "@/lib/parse-cms-html";
import type { Category, Service } from "@/types/booking";

const getLocalized = (value: any, loc: string) => {
  if (typeof value === "object" && value !== null && loc in value) {
    return value[loc];
  }
  if (typeof value === "object" && value !== null && "ar" in value) {
    return value.ar;
  }
  return value || "";
};

const CategoryServicesSection = ({
  locale,
  category,
}: {
  locale: string;
  category: Category;
}) => {
  const prefix = locale === "ar" ? "" : "/en";
  const services: Service[] = category.services || [];
  const [activeIndex, setActiveIndex] = useState(0);

  const activeService = services[activeIndex] || {};
  const serviceTitle =
    getLocalized(activeService.name, locale) ||
    (locale === "ar" ? "خدمة غير متوفرة" : "Service unavailable");
  const activeServiceSlug = getLocalized(activeService.slug, locale);

  return (
    <motion.div
      className="max-w-screen-xl mx-auto px-4 mt-12 flex flex-col gap-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="w-24 h-24 bg-[#eff6fe] rounded-full flex items-center justify-center overflow-hidden">
          <img
            src={
              category.image?.[0]?.original ||
              "/assets/images/homehellers/Injury.svg"
            }
            alt={category.name}
            className="w-16 h-16 object-cover rounded-full"
          />
        </div>
        <h1 className="text-2xl sm:text-3xl font-semibold text-[#1e1e1e]">
          {category.name}
        </h1>
        <p className="text-gray-600">
          {services.length}{" "}
          {locale === "ar" ? "خدمة في هذا التخصص" : "services in this category"}
        </p>
      </div>

      {services.length > 0 ? (
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-[380px] flex flex-col gap-4">
            {services.map((service, idx) => {
              const isActive = idx === activeIndex;
              const serviceName = getLocalized(service.name, locale);

              return (
                <button
                  key={service.id}
                  type="button"
                  onClick={() => setActiveIndex(idx)}
                  className={`flex items-center gap-[10px] p-3 border rounded-md transition-transform hover:scale-[1.02] text-start w-full ${
                    isActive
                      ? "bg-[#EFF6FE] border-[#62A0F6]"
                      : "border-[#62A0F6]"
                  }`}
                >
                  <div
                    className={`w-10 h-10 flex items-center justify-center rounded-full ${
                      isActive ? "bg-[#62A0F6]" : ""
                    }`}
                  >
                    <img
                      src={
                        service.icon?.[0]?.original ||
                        service.image?.[0]?.thumbnail ||
                        "/assets/images/homehellers/Injury.svg"
                      }
                      className="w-10 h-10 rounded-full object-cover"
                      alt={serviceName}
                    />
                  </div>
                  <span className="text-[#62A0F6] text-base font-medium">
                    {serviceName}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex-1 flex flex-col gap-8">
            <div
              className="h-72 lg:h-[456px] bg-cover bg-no-repeat rounded-2xl"
              style={{
                backgroundImage: `url(${
                  activeService.image?.[0]?.original ||
                  "/assets/images/homehellers/Injury.svg"
                })`,
              }}
              role="img"
              aria-label={serviceTitle}
            />
            <div className="text-start flex flex-col gap-6">
              <h2 className="text-2xl font-medium text-[#1e1e1e]">
                {serviceTitle}
              </h2>
              <div className="text-lg leading-8 text-[#475467] overflow-hidden">
                {activeService.description
                  ? parseCmsHtml(activeService.description)
                  : locale === "ar"
                    ? "وصف الخدمة غير متوفر حالياً."
                    : "Service description is not available."}
              </div>
              <div className="flex flex-wrap gap-3 self-end">
                {activeServiceSlug ? (
                  <Link
                    href={`${prefix}/our-services/${activeServiceSlug}`}
                    className="border border-[#143087] text-[#143087] flex items-center hover:scale-105 duration-300 transition-all justify-center gap-2 px-6 py-3 rounded-xl"
                  >
                    {locale === "ar" ? "عرض تفاصيل الخدمة" : "View Service Details"}
                  </Link>
                ) : null}
                <Link
                  href={`${prefix}/booking`}
                  className="bg-[#143087] text-white flex items-center hover:scale-105 duration-300 transition-all justify-center gap-2 px-6 py-3 rounded-xl"
                >
                  {locale === "ar"
                    ? "احجز جلستك العلاجية الان"
                    : "Book Your Therapy Session Now"}
                  <ArrowLeft className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-600">
          {locale === "ar"
            ? "لا توجد خدمات في هذا التخصص حالياً."
            : "No services in this category yet."}
        </p>
      )}
    </motion.div>
  );
};

export default CategoryServicesSection;
