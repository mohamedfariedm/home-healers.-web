"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { ShowMore } from "@/components/Animations/ShowMore";
import { AboutAppTwoColumns } from ".";

function AboutApp() {
  const icons = [
    "/assets/images/homehellers/elements.svg",
    "/assets/images/homehellers/elements-1.svg",
    "/assets/images/homehellers/guidance_physical-therapy.svg",
  ];
  return (
    <div className="flex w-full xl:w-[1280px] flex-col gap-[100px] items-start flex-nowrap relative z-[487] mt-[91px] mx-auto">
      {/* Section Header */}
      <motion.div
        className="flex flex-col items-center gap-8 w-full relative"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: false, amount: 0.5 }}
      >
        <div className="flex flex-col items-center gap-12 w-full max-w-3xl text-center">
          <span className="text-primary text-base font-medium">
            خدمات العلاج الطبيعي والتأهيل
          </span>
          <h2 className="text-2xl sm:text-3xl font-semibold leading-10 text-gray-900">
            مجموعة من <span className="text-primary">الخدمات</span> الطبية
            المتنوعة
          </h2>
        </div>

        {/* Service Card */}
        <motion.div
          className="w-full max-w-[1280px] flex flex-wrap justify-center gap-7"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          viewport={{ once: false, amount: 0.5 }}
        >
          {/* Card 1 */}
          <div className="relative bg-[#0077b7] rounded-3xl w-[299px] h-[352px] px-2 py-10 hover:shadow-2xl hover:scale-105 transition-all  duration-300">
            <div className="absolute top-6 left-2 flex flex-col items-start gap-4 px-2">
              <div className="bg-white rounded-full w-24 h-24 flex items-center justify-center">
                <div className="w-16 h-16 bg-[url('/assets/images/homehellers/Injury.svg')] bg-contain bg-no-repeat" />
              </div>
              <div className="text-white">
                <h3 className="text-lg font-semibold leading-7">
                  تأهيل مابعد العمليات
                  <br />
                  الجراحية
                </h3>
                <p className="text-sm font-light leading-8 mt-1">
                  دعم المرضى في فترة التعافي بعد العمليات الجراحية.
                </p>
              </div>
            </div>

            <ShowMore />
          </div>
          {/* Card 2 */}
          <div className="relative bg-[#0077b7] rounded-3xl w-[299px] h-[352px] px-2 py-10 hover:shadow-2xl hover:scale-105 transition-all  duration-300">
            <div className="absolute top-6 left-2 flex flex-col items-start gap-4 px-2">
              <div className="bg-white rounded-full w-24 h-24 flex items-center justify-center">
                <div className="w-16 h-16 bg-[url('/assets/images/homehellers/Injury.svg')] bg-contain bg-no-repeat" />
              </div>
              <div className="text-white">
                <h3 className="text-lg font-semibold leading-7">
                  تأهيل مابعد العمليات
                  <br />
                  الجراحية
                </h3>
                <p className="text-sm font-light leading-8 mt-1">
                  دعم المرضى في فترة التعافي بعد العمليات الجراحية.
                </p>
              </div>
            </div>

            <ShowMore />
          </div>
        </motion.div>

        {/* CTA Button */}
        <motion.div
          className="mt-6"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        >
          <button className="flex items-center gap-2 px-4 py-2 bg-[#143087] text-white rounded-md text-lg font-medium border border-[#143087]">
            جميع الخدمات
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
        </motion.div>

        {/* Slider Dots */}
        <div className="flex gap-6 mt-6">
          <div className="w-2.5 h-2.5 bg-[#cee2fc] rounded-full" />
          <div className="w-2.5 h-2.5 bg-[#cee2fc] rounded-full" />
          <div className="w-2.5 h-2.5 bg-[url('https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-11/RLrCWzKCGD.png')] bg-cover bg-no-repeat rounded-full" />
        </div>
      </motion.div>

      {/* Two Column Layout */}
      <AboutAppTwoColumns />
    </div>
  );
}

export default AboutApp;
