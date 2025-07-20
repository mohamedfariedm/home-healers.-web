"use client";

import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";
import parse from "html-react-parser";
import { FaEnvelope, FaFacebook, FaInstagram, FaLink, FaTwitter } from "react-icons/fa";
import { toast } from "sonner";
import Link from "next/link";

export default function BlogRelatedSection({ data, locale }: { data: any, locale: string }) {
  console.log("BlogRelatedSection Data:", data);

  const [isPopupOpen, setIsPopupOpen] = useState(false);

  // Format date function
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ar-EG", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // Use dynamic related blogs from data
  const relatedBlogs = data.related_blogs?.map((blog: any) => ({
    title: blog.name?.ar || blog.name || "عنوان غير متوفر",
    date: formatDate(blog.date),
    image: blog.image?.[0]?.thumbnail || "/assets/images/placeholder.jpg",
    slug: blog.slug?.ar,
  })) || [];

  // Use dynamic tags from data
  const blogTags = data.tags || [];

  // Share data
  const shareData = {
    title: data.name || "مقال جديد",
    text: data.description ? parse(data.description).toString() : "تحقق من هذا المقال الرائع!",
    url: typeof window !== "undefined" ? window.location.href : "",
  };

  // Share handlers
  const handleFacebookShare = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareData.url)}`;
    window.open(facebookUrl, "_blank");
    setIsPopupOpen(false);
    toast.success("تم مشاركة المقال على فيسبوك!", { duration: 3000 });
  };

  const handleTwitterShare = () => {
    const twitterUrl = `https://x.com/intent/tweet?text=${encodeURIComponent(shareData.text)}&url=${encodeURIComponent(shareData.url)}`;
    window.open(twitterUrl, "_blank");
    setIsPopupOpen(false);
    toast.success("تم مشاركة المقال على تويتر!", { duration: 3000 });
  };

  const handleInstagramShare = () => {
    setIsPopupOpen(false);
    toast.success("انسخ الرابط لمشاركته في قصة إنستغرام!", { duration: 3000 });
  };

  const handleEmailShare = () => {
    const emailUrl = `mailto:?subject=${encodeURIComponent(shareData.title)}&body=${encodeURIComponent(shareData.text + "\n" + shareData.url)}`;
    window.open(emailUrl, "_blank");
    setIsPopupOpen(false);
    toast.success("تم مشاركة المقال عبر البريد الإلكتروني!", { duration: 3000 });
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareData.url);
      toast.success("تم نسخ الرابط إلى الحافظة!", { duration: 3000 });
    } catch (err) {
      console.error("Error copying link:", err);
      toast.error("حدث خطأ أثناء نسخ الرابط.", { duration: 3000 });
    }
    setIsPopupOpen(false);
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
      dir="rtl"
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

        {relatedBlogs.length > 0 ? (
          relatedBlogs.map(({ title, date, image,slug }: { title: string; date: string; image: string,slug: string }, index: number) => (
                       <Link href={`/${locale}/blogs/${slug}`} key={slug}>

            <motion.div
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
                role="img"
                aria-label={`صورة للمقال ${title}`}
              />
              <div className="flex flex-col items-start gap-1">
                <p className="text-right text-lg text-[#1e1e1e] leading-[30px]">{title}</p>
                <span className="text-xs text-[#62a0f6]">{date}</span>
              </div>
            </motion.div>
            </Link>
          ))
        ) : (
          <p className="text-right text-gray-600">لا توجد مواضيع متعلقة متاحة.</p>
        )}

        <h3 className="text-right text-[30px] font-medium text-[#1e1e1e] mt-8">هاشتجات</h3>

        <div className="flex flex-wrap justify-start gap-4">
          {blogTags.length > 0 ? (
            blogTags.map((tag: string, i: number) => (
              <motion.div
                key={i}
                className="border border-[#d0d5dd] rounded-md px-2 py-1 cursor-pointer"
                whileHover={{ scale: 1.1, backgroundColor: "#62a0f6", borderColor: "#62a0f6" }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.3 }}
                aria-label={`هاشتاج ${tag}`}
              >
                <span className="text-[#736b7a] text-lg hover:text-white">{tag}</span>
              </motion.div>
            ))
          ) : (
            <p className="text-right text-gray-600">لا توجد هاشتجات متاحة.</p>
          )}
        </div>
      </motion.div>

      {/* Right Column */}
      <motion.div
        className="flex-1 flex items-end flex-col gap-6"
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
          role="img"
          aria-label={`صورة المقال ${data.name}`}
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

        <motion.span
          className="flex justify-end w-[fit-content] cursor-pointer"
          onClick={() => setIsPopupOpen(true)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center gap-2 border border-[#143087] rounded-md px-2 py-2 w-fit group hover:bg-[#143087] hover:text-white transition-colors duration-300">
            <span className="text-sm font-medium text-[#143087] group-hover:text-white">مشاركة المقال</span>
            <div
              className="w-6 h-6 bg-cover bg-no-repeat"
              style={{
                backgroundImage:
                  "url('https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-18/ZPsHKGyuOB.png')",
              }}
            />
          </div>
        </motion.span>
      </motion.div>

      {/* Popup Modal */}
      <AnimatePresence>
        {isPopupOpen && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsPopupOpen(false)}
          >
            <motion.div
              className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-xl border border-[#d0d5dd] bg-gradient-to-br from-white to-[#f0f6ff]"
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-right text-2xl font-semibold text-[#1e1e1e] mb-6">مشاركة المقال</h3>
              <div className="grid grid-cols-1 gap-4">
                <motion.button
                  className="flex items-center gap-3 border border-[#143087] rounded-lg px-4 py-3 text-[#143087] hover:bg-[#143087] hover:text-white transition-colors duration-300 text-right"
                  onClick={handleFacebookShare}
                  whileHover={{ scale: 1.05, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="مشاركة عبر فيسبوك"
                >
                  <FaFacebook className="text-xl" />
                  <span className="flex-1">مشاركة عبر فيسبوك</span>
                </motion.button>
                <motion.button
                  className="flex items-center gap-3 border border-[#143087] rounded-lg px-4 py-3 text-[#143087] hover:bg-[#143087] hover:text-white transition-colors duration-300 text-right"
                  onClick={handleTwitterShare}
                  whileHover={{ scale: 1.05, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="مشاركة عبر تويتر"
                >
                  <FaTwitter className="text-xl" />
                  <span className="flex-1">مشاركة عبر تويتر</span>
                </motion.button>
                <motion.button
                  className="flex items-center gap-3 border border-[#143087] rounded-lg px-4 py-3 text-[#143087] hover:bg-[#143087] hover:text-white transition-colors duration-300 text-right"
                  onClick={handleInstagramShare}
                  whileHover={{ scale: 1.05, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="مشاركة عبر إنستغرام"
                >
                  <FaInstagram className="text-xl" />
                  <span className="flex-1">مشاركة عبر إنستغرام</span>
                </motion.button>
                <motion.button
                  className="flex items-center gap-3 border border-[#143087] rounded-lg px-4 py-3 text-[#143087] hover:bg-[#143087] hover:text-white transition-colors duration-300 text-right"
                  onClick={handleEmailShare}
                  whileHover={{ scale: 1.05, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="مشاركة عبر البريد الإلكتروني"
                >
                  <FaEnvelope className="text-xl" />
                  <span className="flex-1">مشاركة عبر البريد الإلكتروني</span>
                </motion.button>
                <motion.button
                  className="flex items-center gap-3 border border-[#143087] rounded-lg px-4 py-3 text-[#143087] hover:bg-[#143087] hover:text-white transition-colors duration-300 text-right"
                  onClick={handleCopyLink}
                  whileHover={{ scale: 1.05, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="نسخ الرابط"
                >
                  <FaLink className="text-xl" />
                  <span className="flex-1">نسخ الرابط</span>
                </motion.button>
              </div>
              <motion.button
                className="mt-6 text-[#62a0f6] text-base font-medium text-right w-full hover:underline"
                onClick={() => setIsPopupOpen(false)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="إغلاق نافذة المشاركة"
              >
                إغلاق
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}