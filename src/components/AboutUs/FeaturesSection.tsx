"use client";

import React from "react";
import { motion } from "framer-motion";

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => {
  return (
    <motion.div
      className="flex items-center gap-6 cursor-pointer"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.5 }}
      transition={{ duration: 0.6, ease: "easeOut" }}

      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className="w-[96px] h-[120px] px-[20px] py-[32px] flex items-center justify-center bg-[#62A0F6] rounded-[5px]">
        <div
          className="w-[52.5px] h-[52.5px] bg-contain bg-no-repeat"
          style={{ backgroundImage: `url(${icon})` }}
        />
      </div>
      <div className="flex flex-col items-start text-start">
        <span className="text-white text-lg font-semibold">{title}</span>
        <span className="text-white text-base font-light leading-7">{description}</span>
      </div>
    </motion.div>
  );
};

const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: "https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-18/a0EeWAUs0T.png",
      title: "تعالج وانت في منزلك",
      description: "يمكنك حجز جلسات حيث يأتي لك الطبيب في منزلك أينما توجد",
    },
    {
      icon: "https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-18/j71hUz4G23.png",
      title: "أكثر من 15K حالة علاجية",
      description:
        "عملاؤنا يشعرون بالسعادة والايجابية خلال رحلتهم العلاجية عبر هوم هيليرز",
    },
    {
      icon: "https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-18/Mdh41mJVz1.png",
      title: "خطط علاجية مخصصة لك",
      description: "أكثر من 60 خدمة طبية متنوعة وأكثر من 120 دكتور علاج طبيعي.",
    },
  ];

  return (
    <div className="flex flex-col items-center gap-14 mt-24 w-full mx-auto">
      {/* Section Heading */}
      <div className="flex flex-col items-center gap-3 text-center">
        <span className="text-[#62a0f6] text-base font-medium">لماذا هــومهيليرز ؟</span>
        <h2 className="text-[28px] sm:text-[30px] font-semibold leading-[1.4] text-[#1e1e1e]">
          <span>مزايا تجعل </span>
          <span className="text-[#62a0f6]">هوم هيليرز</span>
          <span> الخيار الأول في الوطن العربي</span>
        </h2>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-[43px] w-full bg-[linear-gradient(135deg,_#143087_0%,_#111F4C_100%)] p-[56px]">
        {features.map((feature, index) => (
          <FeatureCard
            key={index}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
          />
        ))}
      </div>
    </div>
  );
};

export default FeaturesSection;
