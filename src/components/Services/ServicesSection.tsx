"use client";

import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import React, { useState } from "react";

interface SideService {
  text: string;
  icon: string;
}

const sideServices: SideService[] = [
  { text: "تأهيل مابعد العمليات الجراحية", icon: "RAxcwBhKqg.png" },
  { text: "تأهيل الأطفال بمختلف الأعمار", icon: "zDOkTCzaEX.png" },
  { text: "علاج آلام العضلات والمفاصل", icon: "MQC2zoUZQM.png" },
  { text: "علاج الإصابات العضلية المختلفة", icon: "WG9Qhmvk1g.png" },
  { text: "تأهيل قلبي رئوي", icon: "1OTWy7DGWu.png" },
  { text: "مشاكل صحة المرأة", icon: "Xm3qJH6fOY.png" },
  { text: "اصابات الجهاز العصبي", icon: "Lrmqrcp4zr.png" },
  { text: "علاج طبيعي عام", icon: "MRi59rHcwQ.png" },
];

// Dummy data for main content for each service
const mainContents = {
  "تأهيل مابعد العمليات الجراحية": {
    image: "Owgiscuwbo.png",
    title: "تأهيل مابعد العمليات الجراحية",
    description: `إعادة التأهيل بعد الجراحة هي مرحلة حاسمة في رحلة التعافي، فهي لا تقل أهمية عن العملية الجراحية نفسها. 
    سواء كنت قد خضعت لجراحة عظمية، عصبية، قلبية، أو أي نوع آخر من العمليات، فإن برنامج إعادة التأهيل المصمم خصيصًا لك 
    سيساعدك على استعادة قوتك، حركتك، واستقلاليتك بأمان وفعالية. الأسباب الرئيسية التي تجعل إعادة التأهيل بعد الجراحة ضرورية 
    1. استعادة القوة العضلية المفقودة بعد الجراحة، وخاصة إذا تطلبت فترة راحة طويلة، تفقد العضلات قوتها وكفاءتها. تساعد تمارين إعادة التأهيل على: تقوية العضلات الضعيفة`,
  },
  // Add other main content objects for other services as needed
};

const AnimatedServicesSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeService = sideServices[activeIndex];

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
        {sideServices.map(({ text, icon }, idx) => {
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
                  src={`https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-05/${icon}`}
                  className="w-5 h-5"
                  alt={text}
                />
              </div>
              <span className="text-[#62A0F6] text-base font-medium text-right">
                {text}
              </span>
            </motion.button>
          );
        })}
      </motion.div>

      {/* Main Service */}
      <motion.div
        className="flex-1 flex flex-col gap-8"
        key={activeService.text} // force re-render/animate on active change
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div
          className="h-72 lg:h-[456px] bg-cover bg-no-repeat rounded-2xl"
          style={{
            backgroundImage: `url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-05/${
                //@ts-ignore
                mainContents[activeService.text]?.image || "Owgiscuwbo.png"
              })`,
          }}
        />
        <div className="text-right flex flex-col gap-6">
          <h3 className="text-2xl font-medium text-[#1e1e1e]">
            
            {
            //@ts-ignore
            mainContents[activeService.text]?.title || activeService.text}
          </h3>
          <p className="text-lg leading-8 text-[#475467] whitespace-pre-line">
            {
                        //@ts-ignore
            mainContents[activeService.text]?.description ||
              "وصف الخدمة غير متوفر حالياً."}
          </p>
          <button className="bg-[#143087] text-white flex items-center justify-center gap-2 px-6 py-3 rounded-md w-fit self-end">
            
            احجز جلستك العلاجية الان
            <ArrowLeft className="w-4 h-4"/>
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AnimatedServicesSection;
