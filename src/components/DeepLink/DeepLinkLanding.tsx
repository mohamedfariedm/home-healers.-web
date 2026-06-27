"use client";

import { useEffect } from "react";
import Image from "next/image";
import {
  buildAppOpenUrl,
  isInAppBrowser,
  type DeepLinkRoute,
  DEEP_LINK_COPY,
} from "@/lib/deep-link";

type DeepLinkLandingProps = {
  route: DeepLinkRoute;
  locale: string;
  targetUrl: string;
  androidUrl: string;
  iosUrl: string;
};

export default function DeepLinkLanding({
  route,
  locale,
  targetUrl,
  androidUrl,
  iosUrl,
}: DeepLinkLandingProps) {
  const copy = DEEP_LINK_COPY[route][locale === "en" ? "en" : "ar"];
  const appOpenUrl = buildAppOpenUrl(targetUrl);
  const isRtl = locale !== "en";

  useEffect(() => {
    if (typeof window === "undefined") return;

    const ua = navigator.userAgent || "";
    if (!isInAppBrowser(ua)) return;

    window.location.href = appOpenUrl;
  }, [appOpenUrl]);

  const openApp = () => {
    window.location.href = appOpenUrl;
  };

  return (
    <div
      dir={isRtl ? "rtl" : "ltr"}
      className="min-h-[60vh] flex items-center justify-center px-4 py-16"
    >
      <div className="w-full max-w-lg text-center flex flex-col items-center gap-8">
        <Image
          src="/assets/images/logo.svg"
          alt="Home Healers"
          width={160}
          height={48}
          className="h-12 w-auto"
        />

        <div className="flex flex-col gap-3">
          <h1 className="text-2xl md:text-3xl font-bold text-[#143087]">
            {copy.title}
          </h1>
          <p className="text-base text-gray-600 leading-relaxed">
            {copy.description}
          </p>
        </div>

        <div className="flex flex-col gap-3 w-full max-w-xs">
          <button
            type="button"
            onClick={openApp}
            className="w-full px-6 py-4 bg-[#143087] text-white font-semibold rounded-xl hover:bg-[#0f2666] transition-colors"
          >
            {locale === "en" ? "Open in App" : "افتح في التطبيق"}
          </button>

          <a
            href={androidUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full px-6 py-4 bg-white border-2 border-[#143087] text-[#143087] font-semibold rounded-xl hover:bg-[#f0f4ff] transition-colors"
          >
            {locale === "en" ? "Get it on Google Play" : "حمّل من Google Play"}
          </a>

          <a
            href={iosUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full px-6 py-4 bg-white border-2 border-[#143087] text-[#143087] font-semibold rounded-xl hover:bg-[#f0f4ff] transition-colors"
          >
            {locale === "en" ? "Download on App Store" : "حمّل من App Store"}
          </a>
        </div>
      </div>
    </div>
  );
}
