"use client";
import React from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
function BeCloser({ locale, section }: { locale: string; section: any }) {
  return (
    <div className="main-container flex justify-center items-center rtl:ltr ltr:rtl relative w-full max-w-[1280px] mx-auto h-auto px-4 lg:px-0">
      {/* Background layer */}
      <div className="relative w-full max-w-[1280px] h-[626px] bg-[#143087] rounded-[32px] top-0 left-1/2 transform -translate-x-1/2" />

      {/* Background animated layers */}
      <motion.div
        className="absolute w-[90%] bg-[url('/assets/images/homehellers/firstlayer.svg')] bg-cover bg-no-repeat xl:max-w-[585.48px] h-[586px] top-1/2 left-4 lg:left-[55px] transform -translate-y-1/2 hidden md:flex opacity-30 xl:opacity-100 xl:z-[37]"
        animate={{ scaleZ: [1, 1.1, 1] }}
        transition={{ duration: 1, repeat: Infinity, repeatType: "loop", ease: "easeInOut" }}
      />
      <motion.div
        className="absolute w-[90%] bg-[url('/assets/images/homehellers/secondlayer.svg')] bg-cover bg-no-repeat xl:max-w-[585.48px] h-[586px] top-1/2 left-4 lg:left-[55px] transform -translate-y-1/2 hidden md:flex opacity-30 xl:opacity-100 xl:z-[37]"
        animate={{ scaleZ: [1, 1.1, 1], opacity: [0.3, 1, 0.3] }}
        transition={{ duration: 2, repeat: Infinity, delay: 0.5, repeatType: "loop", ease: "easeInOut" }}
      />

      {/* Text Content */}
      <div className="absolute flex flex-col gap-8 items-center justify-center w-[85%] xl:w-[90%] xl:max-w-[534px] h-auto top-[32px] lg:end-4 lg:left-[714px] z-[1]">
        {/* Section title */}
        <div className="flex flex-col gap-4 items-end w-full">
          <div className="w-full xl:max-w-[301px]">
            <span className="block text-[28px] lg:text-[36px] font-bold leading-[1.2] text-white text-end">
              {section.title}
            </span>
          </div>
          {/* First post description as intro */}
          {section.Posts[0]?.title && (
            <div className="w-full xl:max-w-[452px]">
              <span className="block text-[14px] lg:text-[16px] leading-[24px] text-white text-end">
                {section.Posts[0].title}
              </span>
            </div>
          )}
        </div>

        {/* Cards */}
        <div className="flex flex-col gap-6 w-full">
          {section.Posts.slice(1).map((post: any) => (
            <motion.div
              key={post.id}
              className="relative h-[210px] w-full"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.5 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            >
              <div className="absolute inset-0 bg-white rounded-[24px] z-10" />
              {/* Thumbnail image */}
              <div
                className="absolute top-0 end-0 w-[141px] h-full bg-cover bg-no-repeat rounded-[24px] z-20"
                style={{
                  backgroundImage: `url(${post.attachment?.[0]?.thumbnail || "/default-image.svg"})`,
                }}
              />
              <div className="absolute left-[-6%] top-1/2 transform -translate-y-1/2 w-[76.78%] h-[154px] flex flex-col gap-5 items-end z-30">
                <div className="flex flex-col gap-4 items-end w-full">
                  <span className="text-[#62a0f6] font-bold text-[16px] lg:text-[20px] leading-[30px] text-end">
                    {post.title}
                  </span>
                  {post.description && (
                    <p className="text-[14px] lg:text-[16px] w-full md:w-[328px] leading-[24px] text-[#1e1e1e] text-end">
                      {post.description}
                    </p>
                  )}
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="flex items-center gap-2 bg-[#143087] text-white text-sm font-medium px-4 py-2 rounded-md"
                >
                  <Link
                    href={`/${locale}/specialty/subspecialty`}
                    className="flex items-center gap-2 text-white"
                  >
                    <ArrowLeft className="w-6 h-6" />
                    احجز استشارتك الان
                  </Link>
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default BeCloser;
