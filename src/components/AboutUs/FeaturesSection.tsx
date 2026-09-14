"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useIsMobile } from "@/Hooks/use-mobile";

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
  simplifyMotion: boolean;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
  simplifyMotion,
}) => {
  return (
    <motion.div
      className="flex min-w-0 cursor-pointer items-start gap-4 sm:items-center sm:gap-6"
      initial={{ opacity: 0, y: simplifyMotion ? 12 : 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: simplifyMotion ? 0.4 : 0.55, ease: "easeOut" }}
      whileHover={simplifyMotion ? undefined : { scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex h-[84px] w-[68px] shrink-0 items-center justify-center rounded-[5px] bg-[#62A0F6] px-3 py-5 sm:h-[120px] sm:w-[96px] sm:px-[20px] sm:py-[32px]">
        <div
          className="h-10 w-10 bg-contain bg-center bg-no-repeat sm:h-[52.5px] sm:w-[52.5px]"
          style={{ backgroundImage: `url(${icon})` }}
        />
      </div>
      <div className="flex min-w-0 flex-col items-start text-start">
        <span className="text-base font-semibold text-white sm:text-lg">
          {title}
        </span>
        <span className="text-sm font-light leading-6 text-white sm:text-base sm:leading-7">
          {description}
        </span>
      </div>
    </motion.div>
  );
};

const FeaturesSection = ({ data, locale }: { data: any; locale: string }) => {
  const isMobile = useIsMobile();
  const prefersReducedMotion = useReducedMotion();
  const simplifyMotion = isMobile || !!prefersReducedMotion;

  const features = (data?.Posts || [])
    .filter((post: any) => post.id !== 12)
    .map((post: any) => ({
      icon: post.attachment?.[0]?.original || "https://via.placeholder.com/52",
      title: post.title,
      description: post.description,
    }));

  const subtitlePost = data?.Posts?.find((post: any) => post.id === 12);
  const subtitle =
    subtitlePost?.title || "مزايا تجعل هوم هيليرز الخيار الأول في الوطن العربي";

  const words = subtitle.split(" ");
  const subtitleParts = {
    before: `${words[0] || ""} ${words[1] || ""}`.trim(),
    highlight: words.length > 2 ? `${words[2]} ${words[3] || ""}`.trim() : "",
    after: words.slice(4).join(" ") || "",
  };

  return (
    <div className="mx-auto mt-12 flex w-full flex-col items-center gap-8 overflow-x-hidden sm:mt-16 sm:gap-10 lg:mt-24 lg:gap-14">
      <div className="flex max-w-screen-xl flex-col items-center gap-3 px-4 text-center">
        <span className="text-sm font-medium text-[#62a0f6] sm:text-base">
          {data?.title}
        </span>
        <h2 className="text-[22px] font-semibold leading-[1.4] text-[#1e1e1e] sm:text-[28px] lg:text-[30px]">
          <span>{subtitleParts.before}</span>
          {subtitleParts.before ? " " : null}
          <span className="text-[#62a0f6]">{subtitleParts.highlight}</span>
          {subtitleParts.after ? " " : null}
          <span>{subtitleParts.after}</span>
        </h2>
      </div>

      <div className="grid w-full grid-cols-1 gap-6 bg-[linear-gradient(135deg,_#143087_0%,_#111F4C_100%)] px-4 py-8 sm:gap-8 sm:px-8 sm:py-10 md:grid-cols-2 lg:gap-[43px] lg:p-[56px] xl:grid-cols-3">
        {features.map((feature: any, index: number) => (
          <FeatureCard
            key={index}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
            simplifyMotion={simplifyMotion}
          />
        ))}
      </div>
    </div>
  );
};

export default FeaturesSection;
