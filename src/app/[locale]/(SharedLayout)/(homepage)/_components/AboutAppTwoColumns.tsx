"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { parseCmsHtml } from "@/lib/parse-cms-html";
import { toSecureMediaUrl } from "@/lib/image-url";
import { useIsMobile } from "@/Hooks/use-mobile";

function AboutApp({
  locale,
  aboutHomeSection,
  showCta = true,
}: {
  locale: string;
  aboutHomeSection?: any;
  showCta?: boolean;
}) {
  const latestPosts = aboutHomeSection?.Posts?.slice(1, 4) || [];
  const isMobile = useIsMobile();
  const prefersReducedMotion = useReducedMotion();
  const simplifyMotion = isMobile || !!prefersReducedMotion;

  return (
    <div
      className={`flex w-full flex-col items-center justify-between gap-8 overflow-hidden rtl:ltr ltr:rtl xl:flex-row xl:gap-6 ${
        showCta ? "mb-10 xl:mb-[91px]" : ""
      }`}
    >
      <motion.div
        className="relative aspect-[597/531] w-full max-w-[597px] overflow-hidden bg-contain bg-center bg-no-repeat xl:w-[597px]"
        style={{
          backgroundImage: `url(${
            toSecureMediaUrl(
              aboutHomeSection?.Posts?.[0]?.attachment?.[0]?.original,
            ) || "/assets/images/homehellers/about.svg"
          })`,
        }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: simplifyMotion ? 0.4 : 0.7, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.2 }}
      />

      <motion.div
        className="flex w-full max-w-[660px] flex-col items-end gap-6 sm:gap-8 xl:w-[660px]"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: simplifyMotion ? 0.4 : 0.7, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="flex flex-col items-end gap-4 text-end">
          <span className="text-sm font-medium text-[#62a0f6] sm:text-base">
            {locale === "ar" ? "عن هوم هيليرز" : "About Home Healers"}
          </span>
          <h2 className="text-xl font-semibold text-[#1e1e1e] sm:text-2xl xl:text-[30px]">
            {aboutHomeSection?.Posts?.[0]?.title || ""}
          </h2>
          <div className="text-base leading-7 text-[#1e1e1e] sm:text-lg sm:leading-8">
            {aboutHomeSection?.Posts?.[0]?.description
              ? parseCmsHtml(aboutHomeSection?.Posts[0]?.description)
              : ""}
          </div>
        </div>

        <div className="flex flex-col items-end gap-4 text-end">
          {latestPosts.map((post: any, i: number) => (
            <motion.div
              key={i}
              className="flex items-center gap-3"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{
                delay: simplifyMotion ? 0.08 * i : 0.2 + i * 0.15,
                duration: 0.4,
              }}
              viewport={{ once: true, amount: 0.2 }}
            >
              <span className="text-sm font-light text-[#1e1e1e] sm:text-base xl:text-lg">
                {post.title}
              </span>
              <div
                className="h-6 w-6 shrink-0 bg-cover bg-center bg-no-repeat"
                style={{
                  backgroundImage: `url(${toSecureMediaUrl(post.attachment?.[0]?.original)})`,
                }}
              />
            </motion.div>
          ))}
        </div>

        {showCta ? (
          <div className="mt-2 flex items-center gap-4 sm:mt-4 sm:gap-6">
            <motion.div
              animate={
                simplifyMotion
                  ? undefined
                  : {
                      rotate: [0, 5, -5, 5, 0],
                      scale: [1, 1.05, 1, 1.05, 1],
                    }
              }
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="flex h-12 w-12 rotate-180 items-center justify-center rounded-full bg-[#62a0f6] sm:h-14 sm:w-14"
            >
              <div
                className="h-7 w-7 bg-cover bg-center bg-no-repeat sm:h-8 sm:w-8"
                style={{
                  backgroundImage:
                    "url('/assets/images/homehellers/vedio.svg')",
                }}
              />
            </motion.div>
            <motion.div
              whileHover={simplifyMotion ? undefined : { scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Link
                className="flex items-center gap-3 rounded-xl bg-[#143087] px-4 py-2 text-base font-medium text-white sm:text-lg"
                href={`${locale === "ar" ? "" : "/en"}/about`}
              >
                <ArrowLeft className="ml-2 h-5 w-5 text-white sm:h-6 sm:w-6" />
                {locale === "ar" ? "اكتشف المزيد" : "Discover More"}
              </Link>
            </motion.div>
          </div>
        ) : null}
      </motion.div>
    </div>
  );
}

export default AboutApp;
