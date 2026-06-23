"use client";

import React from "react";
import { motion } from "framer-motion";

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
}) => {
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
        <span className="text-white text-base font-light leading-7">
          {description}
        </span>
      </div>
    </motion.div>
  );
};

const FeaturesSection = ({ data, locale }: { data: any; locale: string }) => {
  // Map the Posts array to the features structure
    
  const features = data?.Posts.filter((post: any) => post.id !== 12).map(
    (post: any) => ({
      icon: post.attachment?.[0]?.original || "https://via.placeholder.com/52", // Fallback image if none provided
      title: post.title,
      description: post.description,
    })
  );

  const subtitlePost = data?.Posts.find((post: any) => post.id === 12);
  const subtitle =
    subtitlePost?.title || "مزايا تجعل هوم هيليرز الخيار الأول في الوطن العربي";

  // Split the subtitle into words
  const words = subtitle.split(" ");
  // Combine the second and third words (index 1 and 2) for the highlight
  const subtitleParts = {
    before: `${words[0]} ${words[1]} ` || "", // First word
    highlight: words.length > 2 ? `${words[2]} ${words[3]}` : words[1] || "", // Second and third words
    after: words.slice(4).join(" ") || "", // Remaining words
  };

  return (
    <div className="flex flex-col items-center gap-14 mt-24 w-full mx-auto">
      {/* Section Heading */}
      <div className="flex flex-col items-center gap-3 text-center">
        <span className="text-[#62a0f6] text-base font-medium">
          {data?.title}
        </span>
        <h2 className="text-[28px] sm:text-[30px] font-semibold leading-[1.4] text-[#1e1e1e]">
          <span>{subtitleParts.before}</span>
          <span className="text-[#62a0f6]">{subtitleParts.highlight}</span>
          <span>{subtitleParts.after}</span>
        </h2>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-[43px] w-full bg-[linear-gradient(135deg,_#143087_0%,_#111F4C_100%)] p-[56px]">
        {features.map((feature: any, index: number) => (
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
