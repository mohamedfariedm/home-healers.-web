"use client";

import { motion } from "framer-motion";
import React from "react";
import parse from "html-react-parser"; // Import html-react-parser

// Mock related posts (can be replaced with dynamic data if available)
const relatedPosts = [
  {
    title: "تأهيل مابعد العمليات الجراحية",
    date: "3 ديسمبر 2025",
    image: "https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-18/DcZcfg1h8D.png",
  },
  {
    title: "تأهيل مابعد العمليات الجراحية",
    date: "3 ديسمبر 2025",
    image: "https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-18/DcZcfg1h8D.png",
  },
  {
    title: "تأهيل مابعد العمليات الجراحية",
    date: "3 ديسمبر 2025",
    image: "https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-18/DcZcfg1h8D.png",
  },
];

// Mock tags (can be replaced with dynamic data if available)
const tags = ["معلومات طبية", "صحة وطب", "معلومات ثقافة طبية"];

export default function BlogRelatedSection({ data, locale }: { data: any, locale: string }) {
  console.log("BlogRelatedSection Data:", data);

  // Format date function
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ar-EG", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <motion.div
      className="flex flex-col lg:flex-row my-[106px] gap-10 max-w-screen-xl mx-auto"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={{
        hidden: { opacity: 0, y: 40 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { staggerChildren: 0.15, ease: "easeOut" },
        },
      }}
    >
      {/* Left Column */}
      <motion.div
        className="w-full lg:w-[348px] flex flex-col gap-5"
        variants={{
          hidden: { opacity: 0, x: -40 },
          visible: { opacity: 1, x: 0, transition: { duration: 0.6 } },
        }}
      >
        <h3 className="text-right text-[30px] font-medium text-[#1e1e1e]">
          مواضيع <span className="text-[#62a0f6]">متعلقة</span>
        </h3>

        {relatedPosts.map(({ title, date, image }, index) => (
          <motion.div
            key={index}
            className="flex gap-4 items-center border-b border-[#d0d5dd] pb-5 cursor-pointer"
            whileHover={{ scale: 1.03, boxShadow: "0 8px 15px rgba(0,0,0,0.1)" }}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ delay: index * 0.15 }}
          >
            <div
              className="w-[104px] h-[104px] rounded-md bg-cover bg-no-repeat"
              style={{ backgroundImage: `url(${image})` }}
            />
            <div className="flex flex-col items-start gap-1">
              <p className="text-right text-lg text-[#1e1e1e] leading-[30px]">{title}</p>
              <span className="text-xs text-[#62a0f6]">{date}</span>
            </div>
          </motion.div>
        ))}

        <h3 className="text-right text-[30px] font-medium text-[#1e1e1e] mt-8">هاشتجات</h3>

        <div className="flex flex-wrap justify-start gap-4">
          {tags.map((tag, i) => (
            <motion.div
              key={i}
              className="border border-[#d0d5dd] rounded-md px-2 py-1 cursor-pointer"
              whileHover={{ scale: 1.1, backgroundColor: "#62a0f6", borderColor: "#62a0f6" }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <span className="text-[#736b7a] text-lg hover:text-white">{tag}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Right Column */}
      <motion.div
        className="flex-1 flex flex-col gap-6"
        variants={{
          hidden: { opacity: 0, x: 40 },
          visible: { opacity: 1, x: 0, transition: { duration: 0.6 } },
        }}
      >
        <motion.div
          className="rounded-[24px] bg-cover bg-no-repeat h-[300px] md:h-[456px] w-full"
          style={{
            backgroundImage: `url(${data.image[0]?.thumbnail || "/assets/images/placeholder.jpg"})`,
          }}
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />

        <div className="flex flex-col gap-2 items-start">
          <span className="text-[#62a0f6] text-sm font-medium">{formatDate(data.date)}</span>

          <div className="flex flex-col gap-6 items-start">
            <h2 className="text-2xl md:text-[30px] font-medium text-right text-[#1e1e1e]">
              {data.name}
            </h2>
            <div className="text-right text-[#475467] text-base md:text-xl leading-loose">
              {parse(data.description)}
            </div>
          </div>
        </div>

        <motion.div
          className="flex justify-end cursor-pointer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center gap-2 border border-[#143087] rounded-md px-2 py-2 w-fit hover:bg-[#143087] hover:text-white transition-colors duration-300">
            <span className="text-sm font-medium text-[#143087] hover:text-white">مشاركة المقال</span>
            <div
              className="w-6 h-6 bg-cover bg-no-repeat"
              style={{
                backgroundImage:
                  "url('https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-18/ZPsHKGyuOB.png')",
              }}
            />
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}