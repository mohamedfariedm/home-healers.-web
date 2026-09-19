"use client";
import React from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { toSecureMediaUrl } from "@/lib/image-url";

function BeCloser({ locale, section }: { locale: string; section: any }) {
  return (
    <div className="relative mx-auto my-8 w-full max-w-[1280px] px-4 md:my-12">
      <div className="relative flex flex-col items-center justify-between gap-6 overflow-hidden rounded-[24px] bg-[#143087] px-4 py-8 md:p-10 lg:flex-row lg:p-12">
      {/* Background Layer */}

      {/* Background Animated Layers */}
      <motion.div
        className="absolute w-[90%] max-w-[585px] h-[586px] bg-[url('/assets/images/homehellers/firstlayer.svg')] bg-contain bg-no-repeat top-1/2 end-4 transform -translate-y-1/2 hidden md:block opacity-30 xl:opacity-100 z-10"
        animate={{ scaleZ: [1, 1.1, 1] }}
        transition={{
          duration: 1,
          repeat: Infinity,
          repeatType: "loop",
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute w-[90%] max-w-[585px] h-[586px] bg-[url('/assets/images/homehellers/secondlayer.svg')] bg-contain bg-no-repeat top-1/2 end-4 transform -translate-y-1/2 hidden md:block opacity-30 xl:opacity-100 z-10"
        animate={{ scaleZ: [1, 1.1, 1], opacity: [0.3, 1, 0.3] }}
        transition={{
          duration: 2,
          repeat: Infinity,
          delay: 0.5,
          repeatType: "loop",
          ease: "easeInOut",
        }}
      />

      {/* Text Section */}
      <div className="relative z-20 w-full max-w-xl flex flex-col gap-8 text-white">
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold leading-tight">
            {section?.title}
          </h2>
          {section?.Posts[0]?.title && (
            <p className="text-sm md:text-base lg:text-lg text-white leading-relaxed">
              {section?.Posts[0].title}
            </p>
          )}
        </div>

        {/* Cards */}
        <div className="flex flex-col gap-6 w-full">
          {section?.Posts.slice(1).map((post: any) => (
            <motion.div
              key={post.id}
              className="relative w-full flex flex-col md:flex-row bg-white rounded-[24px] overflow-hidden shadow-md z-20"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.5 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            >
              {/* Image */}
              <div
                className="h-[180px] w-full bg-cover bg-center md:h-auto md:w-[140px]"
                style={{
                  backgroundImage: `url(${
                    toSecureMediaUrl(post.attachment?.[0]?.original) ||
                    "/assets/images/homehellers/Injury.svg"
                  })`,
                }}
              />

              {/* Content */}
              <div className="flex flex-col justify-between p-4 flex-1 gap-3">
                <div>
                  <h3 className="text-lg lg:text-xl font-bold text-[#143087] mb-2">
                    {post.title}
                  </h3>
                  {post.description && (
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {post.description}
                    </p>
                  )}
                </div>
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    href={`${locale === "ar" ? "" : "/en"}/booking`}
                    className="inline-flex items-center gap-2 bg-[#143087] text-white px-4 py-2 rounded-xl text-sm font-medium transition duration-300"
                  >
                    {locale === "ar"
                      ? "احجز استشارتك الان"
                      : "Book your consultation now"}{" "}
                    <ArrowLeft className="w-5 h-5" />
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      </div>
    </div>
  );
}

export default BeCloser;
