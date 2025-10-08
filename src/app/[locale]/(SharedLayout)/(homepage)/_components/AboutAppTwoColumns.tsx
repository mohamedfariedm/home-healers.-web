"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { ShowMore } from "@/components/Animations/ShowMore";
import parse from "html-react-parser";

function AboutApp({
  locale,
  aboutHomeSection,
}: {
  locale: string;
  aboutHomeSection?: any;
}) {
  // Extract the latest three posts for list items and icons
  const latestPosts = aboutHomeSection?.Posts?.slice(1, 4) || [];

  return (
    <>
      {/* Two Column Layout */}
      <div className="flex rtl:ltr ltr:rtl flex-col xl:flex-row gap-6 items-center mb-[91px] justify-between w-full px-4 xl:px-0">
        {/* Visual Block (left) */}
        <motion.div
          className="relative w-full xl:w-[597px] h-[531px] bg-contain bg-no-repeat"
          style={{
            backgroundImage: `url(${
              aboutHomeSection?.Posts?.[0]?.attachment?.[0]?.original ||
              "/assets/images/homehellers/about.svg"
            })`,
          }}
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
              {locale === "ar" ? "عن هوم هيليرز" : "About Home Healers"}
            </span>
            <h2 className="text-2xl xl:text-[30px] font-semibold text-[#1e1e1e]">
              {aboutHomeSection?.Posts?.[0]?.title || ""}
            </h2>
            <div className="text-lg leading-8 text-[#1e1e1e]">
              {aboutHomeSection?.Posts?.[0]?.description
                ? parse(aboutHomeSection?.Posts[0]?.description)
                : ""}
            </div>
          </div>

          <div className="flex flex-col items-end gap-4 text-end">
            {latestPosts.map((post: any, i: number) => (
              <motion.div
                key={i}
                className="flex items-center gap-3"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.2 }}
                viewport={{ once: false, amount: 0.5 }}
              >
                <span className="text-base xl:text-lg font-light text-[#1e1e1e]">
                  {post.title}
                </span>
                <div
                  className="w-6 h-6 bg-cover bg-center bg-no-repeat"
                  style={{
                    backgroundImage: `url(${post.attachment?.[0]?.original})`,
                  }}
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
              className="w-14 h-14 bg-[#62a0f6] rounded-full flex items-center justify-center rotate-180"
            >
              <div
                className="w-8 h-8 bg-cover bg-center bg-no-repeat"
                style={{
                  backgroundImage:
                    "url('/assets/images/homehellers/vedio.svg')",
                }}
              />
            </motion.div>
            <motion.button
              className="flex items-center gap-3 px-4 py-2 bg-[#143087] text-white rounded-xl text-lg font-medium"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Link
                className="flex items-center gap-3 bg-[#143087] text-white rounded-md text-lg font-medium"
                href={`${locale === "ar" ? "" : "/en"}/about`}
              >
                <ArrowLeft className="w-6 h-6 ml-2 text-white" />
                {locale === "ar" ? "اكتشف المزيد" : "Discover More"}
              </Link>
            </motion.button>
          </div>
        </motion.div>
      </div>
    </>
  );
}

export default AboutApp;
