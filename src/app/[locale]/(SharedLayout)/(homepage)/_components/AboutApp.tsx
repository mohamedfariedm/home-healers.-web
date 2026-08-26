"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowUpLeft, ArrowUpRight } from "lucide-react";
import { AboutAppTwoColumns } from ".";
import { localePath } from "@/lib/offers";
import { categoryFirstServiceHref, getActiveServices } from "@/lib/slugs";

function AboutApp({
  locale,
  section,
  data,
  aboutHomeSection,
}: {
  locale: string;
  section: any;
  data?: any;
  aboutHomeSection?: any;
}) {
  const isRTL = locale === "ar";
  const categories = (data || []).slice(0, 6);

  return (
    <div
      className="flex w-full max-w-[1280px] flex-col gap-[80px] xl:gap-[100px] items-stretch relative z-[487] mt-[72px] xl:mt-[91px] mx-auto px-4"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <section className="w-full">
        <motion.div
          className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <div className="text-start max-w-2xl">
            <span className="text-sm text-[#62a0f6] font-medium block mb-2">
              {section?.title ||
                (isRTL ? "تخصصاتنا الطبية" : "Our medical specialties")}
            </span>
            <h2 className="text-2xl lg:text-3xl font-semibold text-[#1e1e1e] leading-snug">
              {isRTL ? (
                <>
                  مجموعة من{" "}
                  <span className="text-[#62a0f6]">التخصصات</span> الطبية
                  المتنوعة
                </>
              ) : (
                <>
                  A range of{" "}
                  <span className="text-[#62a0f6]">medical specialties</span>
                </>
              )}
            </h2>
          </div>
          <Link
            href={localePath(locale, "/categories")}
            className="flex items-center gap-3 rounded-xl bg-[#143087] text-white px-4 py-2.5 hover:scale-105 transition-transform duration-300 shrink-0"
          >
            <span className="text-base font-medium">
              {isRTL ? "جميع التخصصات" : "All Specialties"}
            </span>
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </motion.div>

        {categories.length > 0 ? (
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {categories.map((category: any, index: number) => {
              const serviceCount = getActiveServices(category.services).length;
              const href = categoryFirstServiceHref(locale, category);

              return (
                <motion.div
                  key={category.id ?? index}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.06 }}
                  viewport={{ once: true, amount: 0.2 }}
                >
                  <Link
                    href={href}
                    className="group relative flex h-full flex-col overflow-hidden rounded-[24px] border border-[#e6eef8] bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#62a0f6] hover:shadow-[0_18px_40px_rgba(20,48,135,0.12)]"
                  >
                    <div className="pointer-events-none absolute -top-16 -end-16 h-36 w-36 rounded-full bg-[#eff6fe] opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100" />

                    <div className="relative flex items-start justify-between gap-4">
                      <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-[#eff6fe] ring-1 ring-[#d7e7fb]">
                        <img
                          src={
                            category.image?.[0]?.original ||
                            "/assets/images/homehellers/Injury.svg"
                          }
                          alt=""
                          className="h-10 w-10 object-contain"
                        />
                      </div>
                      <span className="rounded-full bg-[#eff6fe] px-3 py-1 text-xs font-semibold text-[#143087]">
                        {serviceCount}{" "}
                        {isRTL
                          ? serviceCount === 1
                            ? "خدمة"
                            : "خدمات"
                          : serviceCount === 1
                            ? "service"
                            : "services"}
                      </span>
                    </div>

                    <h3 className="relative mt-6 text-lg font-semibold leading-7 text-[#1e1e1e] transition-colors duration-300 group-hover:text-[#143087]">
                      {category.name}
                    </h3>

                    <div className="relative mt-auto flex items-center gap-2 pt-5 text-sm font-medium text-[#62a0f6]">
                      <span>
                        {isRTL ? "استكشف التخصص" : "Explore specialty"}
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
        ) : (
          <p className="mt-10 text-center text-gray-600">
            {isRTL ? "لا توجد تخصصات متاحة." : "No specialties available."}
          </p>
        )}
      </section>

      <AboutAppTwoColumns aboutHomeSection={aboutHomeSection} locale={locale} />
    </div>
  );
}

export default AboutApp;
