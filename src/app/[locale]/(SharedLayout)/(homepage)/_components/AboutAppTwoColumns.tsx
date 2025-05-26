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
  return (<>

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
</>  );
}

export default AboutApp;
