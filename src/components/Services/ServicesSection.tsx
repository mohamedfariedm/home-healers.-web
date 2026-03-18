"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import parse from "html-react-parser";

const AnimatedServicesSection = ({
  locale,
  data,
}: {
  locale: string;
  data: any;
}) => {
  const pathname = usePathname();
  const [activeIndex, setActiveIndex] = useState(0);

  // Ensure services is an array, fallback to empty array if undefined
  const services = Array.isArray(data) ? data : [];
  const activeService = services[activeIndex] || {};
  console.log("Active Service:", activeService);

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

  // Extract slug from pathname and set activeIndex
  useEffect(() => {
    if (!pathname || !services.length) return;

    const pathParts = pathname.split("/");
    const currentSlug = decodeURIComponent(pathParts[pathParts.length - 1]);

    const foundIndex = services.findIndex(
      (service: any) => getLocalized(service.slug, locale) === currentSlug
    );

    if (foundIndex !== -1) {
      setActiveIndex(foundIndex);
    } else {
      setActiveIndex(0); // Fallback to first service if no match
    }
  }, [pathname, locale, services]);

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
          <h3 className="text-2xl font-medium text-[#1e1e1e]">
            {getLocalized(activeService.name, locale) || "خدمة غير متوفرة"}
          </h3>
          <div className="text-lg leading-8 text-[#475467] overflow-hidden">
            {activeService.description
              ? parse(activeService.description)
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
