"use client";

import { AnimatePresence, motion } from "framer-motion";
import React, { useMemo, useState } from "react";
import {
  FaEnvelope,
  FaFacebook,
  FaInstagram,
  FaLink,
  FaTwitter,
} from "react-icons/fa";
import { toast } from "sonner";
import Link from "next/link";

// ---- Simple i18n dictionary ----
const dict = {
  ar: {
    relatedTopics: "مواضيع",
    related: "متعلقة",
    tags: "هاشتجات",
    noRelated: "لا توجد مواضيع متعلقة متاحة.",
    noTags: "لا توجد هاشتجات متاحة.",
    shareArticle: "مشاركة المقال",
    shareOn: {
      facebook: "مشاركة عبر فيسبوك",
      twitter: "مشاركة عبر تويتر",
      instagram: "مشاركة عبر إنستغرام",
      email: "مشاركة عبر البريد الإلكتروني",
      copy: "نسخ الرابط",
    },
    toasts: {
      fb: "تم مشاركة المقال على فيسبوك!",
      tw: "تم مشاركة المقال على تويتر!",
      ig: "انسخ الرابط لمشاركته في قصة إنستغرام!",
      mail: "تم مشاركة المقال عبر البريد الإلكتروني!",
      copyOk: "تم نسخ الرابط إلى الحافظة!",
      copyErr: "حدث خطأ أثناء نسخ الرابط.",
    },
    close: "إغلاق",
    fallbackTitle: "مقال جديد",
    fallbackDesc: "تحقق من هذا المقال الرائع!",
  },
  en: {
    relatedTopics: "Related",
    related: "Topics",
    tags: "Tags",
    noRelated: "No related topics available.",
    noTags: "No tags available.",
    shareArticle: "Share Article",
    shareOn: {
      facebook: "Share on Facebook",
      twitter: "Share on X (Twitter)",
      instagram: "Share on Instagram",
      email: "Share via Email",
      copy: "Copy link",
    },
    toasts: {
      fb: "Shared to Facebook!",
      tw: "Shared to X (Twitter)!",
      ig: "Copy the link to share in your Instagram story!",
      mail: "Shared via email!",
      copyOk: "Link copied to clipboard!",
      copyErr: "Failed to copy the link.",
    },
    close: "Close",
    fallbackTitle: "New article",
    fallbackDesc: "Check out this great article!",
  },
};

type Locale = keyof typeof dict;

export default function BlogRelatedSection({
  data,
  locale,
}: {
  data: any;
  locale: Locale;
}) {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const t = dict[locale] ?? dict.ar;
  const isRTL = locale === "ar";
  const lang = isRTL ? "ar" : "en";

  // Helper to get localized value from { ar?: string, en?: string } or plain string
  const getLocalized = (value: any, loc: Locale): string => {
    if (value && typeof value === "object") {
      if (loc in value) return value[loc] ?? "";
      if ("ar" in value) return value.ar ?? ""; // fallback to Arabic
    }
    return value ?? "";
  };

  // Strip HTML for plain text (for sharing)
  const stripHtml = (html: string) => {
    if (typeof document === "undefined") return html;
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  // Localized date
  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    // Use Arabic Egypt for AR, and a sensible EN locale otherwise
    const localeForDate = isRTL ? "ar-EG" : "en-US";
    try {
      return date.toLocaleDateString(localeForDate, {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } catch {
      return date.toDateString();
    }
  };

  // Related blogs from data
  const relatedBlogs =
    data?.related_blogs?.map((blog: any) => ({
      title:
        getLocalized(blog.name, locale) ||
        (isRTL ? "عنوان غير متوفر" : "Untitled"),
      date: formatDate(blog.date),
      image: blog.image?.[0]?.original || "/assets/images/placeholder.jpg",
      slug: getLocalized(blog.slug, locale),
    })) ?? [];

  // Tags (support both plain strings or localized objects)
  const blogTags: string[] =
    data?.tags?.map((tag: any) =>
      typeof tag === "string" ? tag : getLocalized(tag, locale)
    ) ?? [];

  // Share payload
  const shareData = useMemo(() => {
    const title = getLocalized(data?.name, locale) || t.fallbackTitle;
    const text = data?.description
      ? stripHtml(data.description)
      : t.fallbackDesc;
    const url = typeof window !== "undefined" ? window.location.href : "";
    return { title, text, url };
  }, [data?.name, data?.description, locale, t]);

  // Share handlers
  const handleFacebookShare = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      shareData.url
    )}`;
    window.open(facebookUrl, "_blank", "noopener,noreferrer");
    setIsPopupOpen(false);
    toast.success(t.toasts.fb, { duration: 3000 });
  };

  const handleTwitterShare = () => {
    const twitterUrl = `https://x.com/intent/tweet?text=${encodeURIComponent(
      `${shareData.title}\n${shareData.text}`
    )}&url=${encodeURIComponent(shareData.url)}`;
    window.open(twitterUrl, "_blank", "noopener,noreferrer");
    setIsPopupOpen(false);
    toast.success(t.toasts.tw, { duration: 3000 });
  };

  const handleInstagramShare = () => {
    setIsPopupOpen(false);
    toast.success(t.toasts.ig, { duration: 3000 });
  };

  const handleEmailShare = () => {
    const emailUrl = `mailto:?subject=${encodeURIComponent(
      shareData.title
    )}&body=${encodeURIComponent(shareData.text + "\n" + shareData.url)}`;
    window.open(emailUrl, "_blank");
    setIsPopupOpen(false);
    toast.success(t.toasts.mail, { duration: 3000 });
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareData.url);
      toast.success(t.toasts.copyOk, { duration: 3000 });
    } catch (err) {
      console.error("Error copying link:", err);
      toast.error(t.toasts.copyErr, { duration: 3000 });
    }
    setIsPopupOpen(false);
  };

  // Handy dir-aware classes
  const textDir = isRTL ? "text-right" : "text-left";
  const justifyStart = isRTL ? "items-start" : "items-start"; // same, but kept for clarity
  const tagContainerJustify = isRTL ? "justify-start" : "justify-start"; // both fine

  return (
    <motion.div
      className={`flex flex-col lg:flex-row my-[106px] gap-10 max-w-screen-xl mx-auto`}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={{
        hidden: { opacity: 1, y: 40 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { staggerChildren: 0.15, ease: "easeOut" },
        },
      }}
      dir={isRTL ? "rtl" : "ltr"}
      lang={lang}
    >
      {/* Left Column */}
      <motion.div
        className="w-full lg:w-[348px] flex flex-col gap-5"
        variants={{
          hidden: { opacity: 1, x: isRTL ? -40 : 40 },
          visible: { opacity: 1, x: 0, transition: { duration: 0.6 } },
        }}
      >
        <h3 className={`${textDir} text-[30px] font-medium text-[#1e1e1e]`}>
          {t.relatedTopics} <span className="text-[#62a0f6]">{t.related}</span>
        </h3>

        {relatedBlogs.length > 0 ? (
          relatedBlogs.map(
            (
              {
                title,
                date,
                image,
                slug,
              }: { title: string; date: string; image: string; slug: string },
              index: number
            ) => (
              <Link
                href={`${locale === "ar" ? "" : "/en"}/blog/${slug}`}
                key={`${slug}-${index}`}
              >
                <motion.div
                  className="flex gap-4 items-center border-b border-[#d0d5dd] pb-5 cursor-pointer"
                  whileHover={{
                    scale: 1.03,
                    boxShadow: "0 8px 15px rgba(0,0,0,0.1)",
                  }}
                  variants={{
                    hidden: { opacity: 1, y: 20 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  transition={{ delay: index * 0.15 }}
                >
                  <div
                    className="w-[104px] h-[104px] rounded-md bg-cover bg-no-repeat"
                    style={{ backgroundImage: `url(${image})` }}
                    role="img"
                    aria-label={
                      (isRTL ? "صورة للمقال " : "Thumbnail for ") + title
                    }
                  />
                  <div className={`flex flex-col ${justifyStart} gap-1`}>
                    <p
                      className={`${textDir} text-lg text-[#1e1e1e] leading-[30px]`}
                    >
                      {title}
                    </p>
                    <span className="text-xs text-[#62a0f6]">{date}</span>
                  </div>
                </motion.div>
              </Link>
            )
          )
        ) : (
          <p className={`${textDir} text-gray-600`}>{t.noRelated}</p>
        )}

        <h3
          className={`${textDir} text-[30px] font-medium text-[#1e1e1e] mt-8`}
        >
          {t.tags}
        </h3>

        <div className={`flex flex-wrap scale-90 ${tagContainerJustify} gap-4`}>
          {blogTags.length > 0 ? (
            blogTags.map((tag: string, i: number) => (
              <motion.div
                key={`${tag}-${i}`}
                className="border border-[#d0d5dd] rounded-md px-2 py-1 cursor-pointer"
                whileHover={{
                  scale: 1.1,
                  backgroundColor: "#62a0f6",
                  borderColor: "#62a0f6",
                }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.3 }}
                aria-label={(isRTL ? "هاشتاج " : "Tag ") + tag}
              >
                <span className="text-[#736b7a] text-lg hover:text-white">
                  {tag}
                </span>
              </motion.div>
            ))
          ) : (
            <p className={`${textDir} text-gray-600`}>{t.noTags}</p>
          )}
        </div>
      </motion.div>

      {/* Right Column */}
      <motion.div
        className="flex-1 flex items-start flex-col gap-6"
        variants={{
          hidden: { opacity: 1 },
          visible: { opacity: 1, x: 0, transition: { duration: 0.6 } },
        }}
      >
        <motion.div
          className="rounded-[24px] bg-cover bg-no-repeat h-[300px] md:h-[456px] w-full"
          style={{
            backgroundImage: `url(${
              data?.image?.[0]?.original || "/assets/images/placeholder.jpg"
            })`,
          }}
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          role="img"
          aria-label={
            (isRTL ? "صورة المقال " : "Article image ") +
            getLocalized(data?.name, locale)
          }
        />

        <div className={`flex flex-col gap-2 ${justifyStart}`}>
          <span className="text-[#62a0f6] text-sm font-medium">
            {formatDate(data?.date)}
          </span>

          <div className={`flex flex-col gap-6 ${justifyStart}`}>
            <h2
              className={`${textDir} text-2xl md:text-[30px] font-medium text-[#1e1e1e]`}
            >
              {getLocalized(data?.name, locale)}
            </h2>

            {/* If you prefer HTML parsing with sanitation, plug your sanitizer here */}
            <div
              className="editor-content"
              dangerouslySetInnerHTML={{
                __html: data?.description || "",
              }}
            />
          </div>
        </div>

        <motion.span
          className={`flex ${
            isRTL ? "justify-end" : "justify-start"
          } w-fit cursor-pointer`}
          onClick={() => setIsPopupOpen(true)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center gap-2 border border-[#143087] rounded-md px-2 py-2 w-fit group hover:bg-[#143087] hover:text-white transition-colors duration-300">
            <span className="text-sm font-medium text-[#143087] group-hover:text-white">
              {t.shareArticle}
            </span>
            <div
              className="w-6 h-6 bg-cover bg-no-repeat"
              style={{
                backgroundImage:
                  "url('/assets/images/shared/blog-section-bg.svg')",
              }}
            />
          </div>
        </motion.span>
      </motion.div>

      {/* Share Popup */}
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
              className={`bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-xl border border-[#d0d5dd] bg-gradient-to-br from-white to-[#f0f6ff]`}
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
              dir={isRTL ? "rtl" : "ltr"}
              lang={lang}
            >
              <h3
                className={`${textDir} text-2xl font-semibold text-[#1e1e1e] mb-6`}
              >
                {t.shareArticle}
              </h3>

              <div className="grid grid-cols-1 gap-4">
                <motion.button
                  className={`flex items-center gap-3 border border-[#143087] rounded-lg px-4 py-3 text-[#143087] hover:bg-[#143087] hover:text-white transition-colors duration-300 ${textDir}`}
                  onClick={handleFacebookShare}
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  }}
                  whileTap={{ scale: 0.95 }}
                  aria-label={t.shareOn.facebook}
                >
                  <FaFacebook className="text-xl" />
                  <span className="flex-1">{t.shareOn.facebook}</span>
                </motion.button>

                <motion.button
                  className={`flex items-center gap-3 border border-[#143087] rounded-lg px-4 py-3 text-[#143087] hover:bg-[#143087] hover:text-white transition-colors duration-300 ${textDir}`}
                  onClick={handleTwitterShare}
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  }}
                  whileTap={{ scale: 0.95 }}
                  aria-label={t.shareOn.twitter}
                >
                  <FaTwitter className="text-xl" />
                  <span className="flex-1">{t.shareOn.twitter}</span>
                </motion.button>

                <motion.button
                  className={`flex items-center gap-3 border border-[#143087] rounded-lg px-4 py-3 text-[#143087] hover:bg-[#143087] hover:text-white transition-colors duration-300 ${textDir}`}
                  onClick={handleInstagramShare}
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  }}
                  whileTap={{ scale: 0.95 }}
                  aria-label={t.shareOn.instagram}
                >
                  <FaInstagram className="text-xl" />
                  <span className="flex-1">{t.shareOn.instagram}</span>
                </motion.button>

                <motion.button
                  className={`flex items-center gap-3 border border-[#143087] rounded-lg px-4 py-3 text-[#143087] hover:bg-[#143087] hover:text-white transition-colors duration-300 ${textDir}`}
                  onClick={handleEmailShare}
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  }}
                  whileTap={{ scale: 0.95 }}
                  aria-label={t.shareOn.email}
                >
                  <FaEnvelope className="text-xl" />
                  <span className="flex-1">{t.shareOn.email}</span>
                </motion.button>

                <motion.button
                  className={`flex items-center gap-3 border border-[#143087] rounded-lg px-4 py-3 text-[#143087] hover:bg-[#143087] hover:text-white transition-colors duration-300 ${textDir}`}
                  onClick={handleCopyLink}
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  }}
                  whileTap={{ scale: 0.95 }}
                  aria-label={t.shareOn.copy}
                >
                  <FaLink className="text-xl" />
                  <span className="flex-1">{t.shareOn.copy}</span>
                </motion.button>
              </div>

              <motion.button
                className={`mt-6 text-[#62a0f6] text-base font-medium ${textDir} w-full hover:underline`}
                onClick={() => setIsPopupOpen(false)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label={t.close}
              >
                {t.close}
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
