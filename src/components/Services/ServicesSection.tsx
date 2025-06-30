"use client";

import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import parse from "html-react-parser";

const AnimatedServicesSection = ({ locale, data }: { locale: string, data: any }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  console.log("Data in AnimatedServicesSection:", data);

  // Use provided data or fallback to empty array
  const services = data || [];
  const activeService = services[activeIndex] || {};

  return (
    <motion.div
      className="max-w-screen-xl mx-auto px-4 mt-12 flex flex-col lg:flex-row gap-8"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.3 }}
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { staggerChildren: 0.15, when: "beforeChildren" },
        },
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
        {services.map((service: any, idx: number) => {
          const isActive = idx === activeIndex;
          return (
            <motion.button
              key={idx}
              className={`flex items-center gap-[10px] p-3 border rounded-md focus:outline-none transition-transform ${
                isActive
                  ? "bg-[#EFF6FE] border-[#62A0F6]"
                  : "border-[#62A0F6]"
              }`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              whileHover={{ scale: 1.05, boxShadow: "0 4px 10px rgba(98, 160, 246, 0.4)" }}
              onClick={() => setActiveIndex(idx)}
              aria-pressed={isActive}
            >
              <div
                className={`w-10 h-10 flex items-center justify-center rounded-full ${
                  isActive ? "bg-[#62A0F6]" : ""
                }`}
              >
                <img
                  src="/assets/images/homehellers/Injury.svg"
                  className="w-5 h-5 object-contain"
                  alt={service.name[locale]}
                />
              </div>
              <span className="text-[#62A0F6] text-base font-medium text-right">
                {service.name[locale]}
              </span>
            </motion.button>
          );
        })}
      </motion.div>

      {/* Main Service */}
      <motion.div
        className="flex-1 flex flex-col gap-8"
        key={activeService.id || activeIndex} // force re-render/animate on active change
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div
          className="h-72 lg:h-[456px] bg-cover bg-no-repeat rounded-2xl"
          style={{
            backgroundImage: `url(${
              activeService.image?.[0]?.thumbnail || "/assets/images/homehellers/Injury.svg"
            })`,
          }}
        />
        <div className="text-right flex flex-col gap-6">
          <h3 className="text-2xl font-medium text-[#1e1e1e]">
            {activeService.name?.[locale] || "خدمة غير متوفرة"}
          </h3>
          <div className="text-lg leading-8 text-[#475467] max-h-[200px] overflow-hidden">
            {activeService.description?.[locale]
              ? parse(activeService.description[locale])
              : "وصف الخدمة غير متوفر حالياً."}
          </div>
          <Link
            href="/specialty/subspecialty"
            className="bg-[#143087] text-white flex items-center hover:scale-105 duration-300 transition-all justify-center gap-2 px-6 py-3 rounded-md w-fit self-end"
          >
            {locale === "ar" ? "احجز جلستك العلاجية الان" : "Book Your Therapy Session Now"}
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AnimatedServicesSection;