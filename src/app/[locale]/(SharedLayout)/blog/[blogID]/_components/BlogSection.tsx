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
import { demoteH1, normalizeCmsHtml } from "@/lib/parse-cms-html";
import { blogHref, formatApiDate, getBlogSlug, getNewsTitle } from "@/lib/slugs";
import { toSecureMediaUrl } from "@/lib/image-url";

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

const FALLBACK_IMAGE = "/assets/images/homehellers/guidance_physical-therapy.svg";

function resolveBlogImage(source: unknown): string {
  if (!source) return FALLBACK_IMAGE;
  if (typeof source === "string") {
    return toSecureMediaUrl(source) || FALLBACK_IMAGE;
  }
  const first = Array.isArray(source) ? source[0] : source;
  if (!first) return FALLBACK_IMAGE;
  if (typeof first === "string") {
    return toSecureMediaUrl(first) || FALLBACK_IMAGE;
  }
  return (
    toSecureMediaUrl(
      first.original ||
        first.thumbnail ||
        first.converted ||
        first.url ||
        "",
    ) || FALLBACK_IMAGE
  );
}

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
    if (typeof value === "string") return value;
    if (value && typeof value === "object") {
      if (loc in value) return value[loc] ?? "";
      if ("en" in value) return value.en ?? "";
      if ("ar" in value) return value.ar ?? "";
    }
    return value ?? "";
  };

  // Localized date — API sends DD-MM-YYYY
  const formatDate = (dateString?: string) => formatApiDate(dateString, locale);

  // Related blogs from data
  const relatedBlogs =
    data?.related_blogs?.map((blog: any) => ({
      title:
        getNewsTitle(blog, locale) ||
        (isRTL ? "عنوان غير متوفر" : "Untitled"),
      date: formatDate(blog.date),
      image: resolveBlogImage(blog.image),
      slug: getBlogSlug(blog, locale),
    })) ?? [];

  // Tags (support both plain strings or localized objects)
  const blogTags: string[] =
    data?.tags?.map((tag: any) =>
      typeof tag === "string" ? tag : getLocalized(tag, locale)
    ) ?? [];

  const stripHtml = (html: string) => {
    if (typeof document === "undefined") return html;
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  const shareData = useMemo(() => {
    const title = getNewsTitle(data, locale) || t.fallbackTitle;
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

  return (
    <motion.div
      className="mx-auto mb-10 mt-8 flex max-w-screen-xl flex-col gap-8 px-4 sm:mt-12 sm:gap-10 lg:mt-16 lg:flex-row lg:items-start xl:px-0"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
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
      {/* Article — start side in both RTL and LTR */}
      <motion.div
        className="flex min-w-0 flex-1 flex-col items-stretch gap-5 sm:gap-6"
        variants={{
          hidden: { opacity: 1 },
          visible: { opacity: 1, x: 0, transition: { duration: 0.6 } },
        }}
      >
        <motion.div
          className="relative h-[220px] w-full overflow-hidden rounded-[24px] bg-[#eff6fe] shadow-[0_16px_40px_rgba(20,48,135,0.1)] sm:h-[320px] md:h-[420px] lg:h-[456px]"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <img
            src={resolveBlogImage(data?.image)}
            alt={
              (isRTL ? "صورة المقال " : "Article image ") +
              getNewsTitle(data, locale)
            }
            className="h-full w-full object-cover"
          />
        </motion.div>

        <div className="flex flex-col items-stretch gap-2">
          <span className="text-start text-sm font-medium text-[#62a0f6]">
            {formatDate(data?.date)}
          </span>

          <div className="flex flex-col items-stretch gap-6">
            <h1 className="break-words text-start text-xl font-semibold leading-snug text-[#1e1e1e] sm:text-2xl md:text-[30px]">
              {getNewsTitle(data, locale)}
            </h1>

            <div
              className="editor-content w-full min-w-0 overflow-x-auto"
              dangerouslySetInnerHTML={{
                __html: demoteH1(normalizeCmsHtml(data?.description || "")),
              }}
            />
          </div>
        </div>

        <motion.button
          type="button"
          className="inline-flex w-fit cursor-pointer items-center"
          onClick={() => setIsPopupOpen(true)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.3 }}
        >
          <div className="group flex w-fit items-center gap-2 rounded-xl border border-[#143087] px-3 py-2 transition-colors duration-300 hover:bg-[#143087] hover:text-white">
            <span className="text-sm font-medium text-[#143087] group-hover:text-white">
              {t.shareArticle}
            </span>
            <div
              className="h-6 w-6 bg-cover bg-no-repeat ltr:-scale-x-100"
              style={{
                backgroundImage:
                  "url('/assets/images/shared/blog-section-bg.svg')",
              }}
            />
          </div>
        </motion.button>
      </motion.div>

      {/* Sidebar — end side in both RTL and LTR */}
      <motion.aside
        className="flex w-full min-w-0 flex-col gap-5 lg:sticky lg:top-28 lg:w-[348px] lg:shrink-0"
        variants={{
          hidden: { opacity: 1, x: isRTL ? -40 : 40 },
          visible: { opacity: 1, x: 0, transition: { duration: 0.6 } },
        }}
      >
        <h3 className="text-start text-2xl font-semibold text-[#1e1e1e] sm:text-[28px]">
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
                href={blogHref(locale, slug)}
                key={`${slug}-${index}`}
              >
                <motion.div
                  className="flex min-w-0 cursor-pointer items-center gap-3 rounded-2xl border border-transparent p-2 pb-4 sm:gap-4"
                  whileHover={{
                    scale: 1.01,
                    boxShadow: "0 8px 15px rgba(20,48,135,0.08)",
                  }}
                  variants={{
                    hidden: { opacity: 1, y: 20 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  transition={{ delay: index * 0.15 }}
                >
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-[#eff6fe] sm:h-[88px] sm:w-[88px]">
                    <img
                      src={image}
                      alt={title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col items-start gap-1 border-b border-[#d0d5dd] pb-3">
                    <p className="line-clamp-2 break-words text-start text-base font-medium leading-7 text-[#1e1e1e] sm:text-lg sm:leading-[30px]">
                      {title}
                    </p>
                    <span className="text-start text-xs text-[#62a0f6]">{date}</span>
                  </div>
                </motion.div>
              </Link>
            )
          )
        ) : (
          <p className="text-start text-gray-600">{t.noRelated}</p>
        )}

        <h3 className="mt-4 text-start text-2xl font-semibold text-[#1e1e1e] sm:text-[28px]">
          {t.tags}
        </h3>

        <div className="flex flex-wrap justify-start gap-2 sm:gap-3">
          {blogTags.length > 0 ? (
            blogTags.map((tag: string, i: number) => (
              <motion.div
                key={`${tag}-${i}`}
                className="cursor-pointer rounded-full border border-[#d0d5dd] px-3 py-1.5"
                whileHover={{
                  scale: 1.05,
                  backgroundColor: "#62a0f6",
                  borderColor: "#62a0f6",
                }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.3 }}
                aria-label={(isRTL ? "هاشتاج " : "Tag ") + tag}
              >
                <span className="text-sm text-[#736b7a] hover:text-white sm:text-base">
                  {tag}
                </span>
              </motion.div>
            ))
          ) : (
            <p className="text-start text-gray-600">{t.noTags}</p>
          )}
        </div>
      </motion.aside>

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
              className={`mx-4 w-full max-w-md rounded-2xl border border-[#d0d5dd] bg-gradient-to-br from-white to-[#f0f6ff] p-5 shadow-xl sm:p-8`}
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
              dir={isRTL ? "rtl" : "ltr"}
              lang={lang}
            >
              <h3
                className={`text-start text-2xl font-semibold text-[#1e1e1e] mb-6`}
              >
                {t.shareArticle}
              </h3>

              <div className="grid grid-cols-1 gap-4">
                <motion.button
                  className={`flex items-center gap-3 border border-[#143087] rounded-lg px-4 py-3 text-[#143087] hover:bg-[#143087] hover:text-white transition-colors duration-300 text-start`}
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
                  className={`flex items-center gap-3 border border-[#143087] rounded-lg px-4 py-3 text-[#143087] hover:bg-[#143087] hover:text-white transition-colors duration-300 text-start`}
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
                  className={`flex items-center gap-3 border border-[#143087] rounded-lg px-4 py-3 text-[#143087] hover:bg-[#143087] hover:text-white transition-colors duration-300 text-start`}
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
                  className={`flex items-center gap-3 border border-[#143087] rounded-lg px-4 py-3 text-[#143087] hover:bg-[#143087] hover:text-white transition-colors duration-300 text-start`}
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
                  className={`flex items-center gap-3 border border-[#143087] rounded-lg px-4 py-3 text-[#143087] hover:bg-[#143087] hover:text-white transition-colors duration-300 text-start`}
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
                className={`mt-6 text-[#62a0f6] text-base font-medium text-start w-full hover:underline`}
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
