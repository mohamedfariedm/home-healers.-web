"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { parseCmsHtml } from "@/lib/parse-cms-html";

const AnimatedServicesSection = ({
  locale,
  data,
  pageTitleAsH1 = false,
  activeSlug,
}: {
  locale: string;
  data: any;
  pageTitleAsH1?: boolean;
  activeSlug?: string;
}) => {
  const pathname = usePathname();

  // Ensure services is an array, fallback to empty array if undefined
  const services = Array.isArray(data) ? data : [];

  // Helper to get localized value
  const getLocalized = (value: any, loc: string) => {
    if (typeof value === "object" && value !== null && loc in value) {
      return value[loc];
    }
    if (typeof value === "object" && value !== null && "ar" in value) {
      return value.ar; // Fallback to Arabic if locale not found
    }
    return value || "";
  };

  const activeIndex = useMemo(() => {
    if (!services.length) return 0;

    const slugFromPath = activeSlug
      ? decodeURIComponent(activeSlug)
      : pathname
        ? decodeURIComponent(pathname.split("/").pop() || "")
        : "";

    const foundIndex = services.findIndex(
      (service: any) => getLocalized(service.slug, locale) === slugFromPath,
    );

    return foundIndex !== -1 ? foundIndex : 0;
  }, [activeSlug, pathname, services, locale]);

  const activeService = services[activeIndex] || {};
  const serviceTitle =
    getLocalized(activeService.name, locale) || "خدمة غير متوفرة";
  const TitleTag = pageTitleAsH1 ? "h1" : "h3";

  return (
    <motion.div
      className="max-w-screen-xl mx-auto px-4 mt-12 flex flex-col lg:flex-row gap-8"
      whileInView="visible"
      viewport={{ once: false, amount: 0.3 }}
      variants={{
        hidden: { opacity: 0, y: 30 },
      }}
    >
      {/* Side Services */}
      <motion.div
        className="w-full lg:w-[380px] flex flex-col gap-4"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.15 } },
        }}
      >
        {services.length > 0 ? (
          services.map((service: any, idx: number) => {
            const isActive = idx === activeIndex;
            const href = `${
              locale === "ar" ? "" : "/en"
            }/our-services/${getLocalized(service.slug, locale)}`;
            const serviceName = getLocalized(service.name, locale);

            return (
              <motion.div
                key={service.id || idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 4px 10px rgba(98, 160, 246, 0.4)",
                }}
              >
                <Link
                  href={href}
                  className={`flex items-center gap-[10px] p-3 border rounded-md focus:outline-none transition-transform ${
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
                        service.icon?.[0]?.original ||service.image?.[0]?.thumbnail||
                        "/assets/images/homehellers/Injury.svg"
                      }
                      className="w-10 h-10 rounded-full object-cover"
                      alt={serviceName}
                    />
                  </div>
                  <span className="text-[#62A0F6] text-base font-medium text-start">
                    {serviceName}
                  </span>
                </Link>
              </motion.div>
            );
          })
        ) : (
          <p className="text-start text-gray-600">لا توجد خدمات متاحة.</p>
        )}
      </motion.div>

      {/* Main Service */}
      <motion.div
        className="flex-1 flex flex-col gap-8"
        key={activeService.id || activeIndex}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div
          className="h-72 lg:h-[456px] bg-cover bg-no-repeat rounded-2xl"
          style={{
            backgroundImage: `url(${
              activeService.image?.[0]?.original ||
              "/assets/images/homehellers/Injury.svg"
            })`,
          }}
          role="img"
          aria-label={`صورة الخدمة ${getLocalized(activeService.name, locale)}`}
        />
        <div className="text-start flex flex-col gap-6">
          <TitleTag className="text-2xl font-medium text-[#1e1e1e]">
            {serviceTitle}
          </TitleTag>
          <div className="text-lg leading-8 text-[#475467] overflow-hidden">
            {activeService.description
              ? parseCmsHtml(activeService.description)
              : "وصف الخدمة غير متوفر حالياً."}
          </div>
          <Link
            href="/booking"
            className="bg-[#143087] text-white flex items-center hover:scale-105 duration-300 transition-all justify-center gap-2 px-6 py-3 rounded-xl w-fit self-end"
          >
            {locale === "ar"
              ? "احجز جلستك العلاجية الان"
              : "Book Your Therapy Session Now"}
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AnimatedServicesSection;
