"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, Star } from "lucide-react";
import { parseCmsHtml } from "@/lib/parse-cms-html";
import { toSecureMediaUrl } from "@/lib/image-url";
import { useIsMobile } from "@/Hooks/use-mobile";

function AboutCollage({
  locale,
  title,
}: {
  locale: string;
  title?: string;
}) {
  const alt =
    title || (locale === "ar" ? "عن هوم هيليرز" : "About Home Healers");

  return (
    <div
      className="relative mx-auto aspect-[611/540] w-full max-w-[597px]"
      aria-label={alt}
    >
      {/* Tall left photo */}
      <div className="absolute inset-y-0 start-0 w-[58%] overflow-hidden rounded-2xl">
        <Image
          src="/assets/images/homehellers/about-photo-1.webp"
          alt=""
          fill
          priority
          sizes="(max-width: 1280px) 60vw, 350px"
          className="object-cover object-[center_20%]"
          quality={80}
        />
      </div>

      {/* Experience card */}
      <div className="absolute end-0 top-[1%] flex h-[42%] w-[37.5%] flex-col items-center justify-center rounded-2xl bg-[#eff6fe] px-3 text-center">
        <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-[#62a0f6] sm:mb-4 sm:h-[83px] sm:w-[83px]">
          <Star className="h-7 w-7 fill-white text-white sm:h-9 sm:w-9" />
        </div>
        <p className="text-2xl font-bold leading-none text-[#143087] sm:text-[34px]">
          +20
        </p>
        <p className="mt-1 text-sm font-semibold text-[#143087] sm:mt-2 sm:text-lg">
          {locale === "ar" ? "سنوات خبرة" : "Years Experience"}
        </p>
      </div>

      {/* Overlapping bottom photo */}
      <div className="absolute bottom-0 end-0 h-[54.5%] w-[66%] overflow-hidden rounded-[23px] border-[10px] border-white bg-white shadow-[0_12px_30px_rgba(20,48,135,0.08)] sm:border-[14px]">
        <Image
          src="/assets/images/homehellers/about-photo-2.webp"
          alt=""
          fill
          sizes="(max-width: 1280px) 65vw, 400px"
          className="object-cover object-center"
          quality={80}
        />
      </div>
    </div>
  );
}

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
  const post = aboutHomeSection?.Posts?.[0];

  // Keep collage on the visual left and copy on the right (matches original design).
  const rowDir = locale === "ar" ? "ltr" : "rtl";
  const copyAlign = locale === "ar" ? "items-end text-end" : "items-start text-start";

  return (
    <div
      className={`flex w-full min-w-0 max-w-full flex-col items-center gap-10 xl:flex-row xl:items-center xl:justify-between xl:gap-14 ${
        showCta ? "mb-10 xl:mb-[91px]" : "mb-6"
      }`}
      dir={rowDir}
    >
      <motion.div
        className="w-full min-w-0 max-w-[597px] shrink-0 xl:w-[48%]"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: simplifyMotion ? 0.4 : 0.7, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.2 }}
      >
        <AboutCollage locale={locale} title={post?.title} />
      </motion.div>

      <motion.div
        className={`flex w-full min-w-0 max-w-[660px] flex-col gap-6 sm:gap-8 xl:w-[48%] xl:max-w-none ${copyAlign}`}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: simplifyMotion ? 0.4 : 0.7, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className={`flex w-full min-w-0 flex-col gap-4 ${copyAlign}`}>
          <span className="text-sm font-medium text-[#62a0f6] sm:text-base">
            {locale === "ar" ? "عن هوم هيليرز" : "About Home Healers"}
          </span>
          <h2 className="max-w-full break-words text-xl font-semibold leading-snug text-[#1e1e1e] sm:text-2xl xl:text-[30px] xl:leading-10">
            {post?.title || ""}
          </h2>
          <div className="editor-content w-full min-w-0 max-w-full break-words text-base leading-7 text-[#1e1e1e] sm:text-lg sm:leading-8 [&_img]:h-auto [&_img]:max-w-full [&_table]:block [&_table]:max-w-full [&_table]:overflow-x-auto">
            {post?.description ? parseCmsHtml(post.description) : ""}
          </div>
        </div>

        {latestPosts.length > 0 ? (
          <div className={`flex flex-col gap-4 ${copyAlign}`}>
            {latestPosts.map((item: any, i: number) => (
              <motion.div
                key={item?.id ?? i}
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
                  {item.title}
                </span>
                <div
                  className="h-6 w-6 shrink-0 bg-cover bg-center bg-no-repeat"
                  style={{
                    backgroundImage: `url(${toSecureMediaUrl(item.attachment?.[0]?.original)})`,
                  }}
                />
              </motion.div>
            ))}
          </div>
        ) : null}

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
                data-gtm-event="about_click"
                data-gtm-location="homepage_about"
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
