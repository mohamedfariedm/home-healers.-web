"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { parseCmsHtml } from "@/lib/parse-cms-html";
import { localePath } from "@/lib/offers";
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

const CategoryServicesSection = ({
  locale,
  category,
  activeServiceSlug,
}: {
  locale: string;
  category: Category;
  activeServiceSlug?: string;
}) => {
  const categorySlug = getCategorySlug(category, locale);
  const services: Service[] = getActiveServices(category.services);

  const activeIndex = useMemo(() => {
    if (!services.length) return 0;
    if (!activeServiceSlug) return 0;
    const decoded = decodeURIComponent(activeServiceSlug);
    const found = services.findIndex(
      (service) => getServiceSlug(service, locale) === decoded,
    );
    return found !== -1 ? found : 0;
  }, [services, activeServiceSlug, locale]);

  const activeService = services[activeIndex] || ({} as Service);
  const serviceTitle =
    getLocalized(activeService.name, locale) ||
    (locale === "ar" ? "خدمة غير متوفرة" : "Service unavailable");
  const activeSlug = getServiceSlug(activeService, locale);

  return (
    <motion.div
      className="mx-auto mt-8 flex max-w-screen-xl flex-col gap-8 px-4 sm:mt-12"
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
        <h2 className="text-2xl sm:text-3xl font-semibold text-[#1e1e1e]">
          {category.name}
        </h2>
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
              const href = serviceHref(
                locale,
                categorySlug,
                getServiceSlug(service, locale),
              );

              return (
                <Link
                  key={service.id}
                  href={href}
                  className={`flex w-full items-center gap-3 rounded-2xl border p-3 text-start transition-all hover:-translate-y-0.5 ${
                    isActive
                      ? "border-[#62A0F6] bg-[#EFF6FE] shadow-[0_10px_24px_rgba(98,160,246,0.14)]"
                      : "border-[#d7e4f8] bg-white hover:border-[#62A0F6]"
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
                </Link>
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
                {activeSlug && !activeServiceSlug ? (
                  <Link
                    href={serviceHref(locale, categorySlug, activeSlug)}
                    className="border border-[#143087] text-[#143087] flex items-center hover:scale-105 duration-300 transition-all justify-center gap-2 px-6 py-3 rounded-xl"
                  >
                    {locale === "ar" ? "عرض تفاصيل الخدمة" : "View Service Details"}
                  </Link>
                ) : null}
                <Link
                  href={localePath(locale, "/booking")}
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
