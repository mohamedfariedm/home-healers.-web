"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { ShowMore } from "@/components/Animations/ShowMore";

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
      <div className="flex rtl:ltr ltr:rtl flex-col xl:flex-row gap-6 items-center justify-between w-full px-4 xl:px-0">
        {/* Visual Block (left) */}
        <motion.div
          className="relative w-full xl:w-[597px] h-[531px] bg-[url('/assets/images/homehellers/about.svg')] sm:bg-contain bg-no-repeat"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: false, amount: 0.5 }}
        />

        {/* Content Block (right) */}
        <motion.div
          className="w-full xl:w-[660px] flex flex-col items-end gap-8"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: false, amount: 0.5 }}
        >
          <div className="flex flex-col items-end gap-4 text-end">
            <span className="text-[#62a0f6] text-base font-medium">
              عن هوم هيليرز
            </span>
            <h2 className="text-2xl xl:text-[30px] font-semibold text-[#1e1e1e]">
              خدمات العلاج الطبيعي والتأهيل الطبي المنزلي
            </h2>
            <p className="text-lg leading-8 text-[#1e1e1e]">
              منصة سعودية متخصصة في توفير خدمة العلاج الطبيعي والتأهيل الطبي
              المنزلي للعملاء في منازلهم بواسطة اختصاصيين مصنفين ومتميزين بكفاءة
              عالية طوال أيام الأسبوع وعلي مدار ٢٤ ساعة
            </p>
          </div>

          <div className="flex flex-col items-end gap-4 text-end">
            {[
              "خدمة طوال الـ 24 شاعة",
              "تقدم منصة هوميلرز الطبية أكثر من 60 خدمة طبية",
              "أكثر من 100 أخصائي علاج طبيعي",
            ].map((text, i) => (
              <motion.div
                key={i}
                className="flex items-center gap-3"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.2 }}
                viewport={{ once: false, amount: 0.5 }}
              >
                <span className="text-base xl:text-lg font-light text-[#1e1e1e]">
                  {text}
                </span>
                <div
                  className="w-6 h-6 bg-cover bg-center bg-no-repeat"
                  style={{ backgroundImage: `url(${icons[i]})` }}
                />
              </motion.div>
            ))}
          </div>

          <div className="flex items-center gap-6 mt-4">
            <motion.div
            animate={{
      rotate: [0, 5, -5, 5, 0],
      scale: [1, 1.05, 1, 1.05, 1],
    }}
    transition={{
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut",
    }}
            className="w-14 h-14 bg-[#62a0f6] rounded-full flex items-center justify-center rotate-180">
  <div
    className="w-8 h-8 bg-cover bg-center bg-no-repeat bg-[url('/assets/images/homehellers/vedio.svg')]"
    
  />
</motion.div>
            <motion.button
              className="flex items-center gap-3 px-4 py-2 bg-[#143087] text-white rounded-md text-lg font-medium"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <ArrowLeft className="w-6 h-6 ml-2 text-white" />
              اكــــتشف المزيد
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default AboutApp;
