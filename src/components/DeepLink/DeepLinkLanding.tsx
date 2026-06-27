"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  buildAndroidAppLinkIntentUrl,
  buildAppOpenUrl,
  getMobilePlatform,
  isFacebookOrInstagram,
  STORE_FALLBACK_MS,
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

function scheduleStoreFallback(storeUrl: string) {
  const timer = window.setTimeout(() => {
    if (!document.hidden) {
      window.location.replace(storeUrl);
    }
  }, STORE_FALLBACK_MS);

  const onVisibilityChange = () => {
    if (document.hidden) {
      window.clearTimeout(timer);
    }
  };

  document.addEventListener("visibilitychange", onVisibilityChange);

  return () => {
    window.clearTimeout(timer);
    document.removeEventListener("visibilitychange", onVisibilityChange);
  };
}

export default function DeepLinkLanding({
  route,
  locale,
  targetUrl,
  androidUrl,
  iosUrl,
}: DeepLinkLandingProps) {
  const copy = DEEP_LINK_COPY[route][locale === "en" ? "en" : "ar"];
  const isRtl = locale !== "en";
  const [isDesktop, setIsDesktop] = useState<boolean | null>(null);

  useEffect(() => {
    const ua = navigator.userAgent || "";
    const platform = getMobilePlatform(ua);

    if (platform === "desktop") {
      setIsDesktop(true);
      return;
    }

    setIsDesktop(false);
    const storeUrl = platform === "android" ? androidUrl : iosUrl;

    // Facebook / Instagram: custom scheme, then store if app did not open
    if (isFacebookOrInstagram(ua)) {
      window.location.replace(buildAppOpenUrl(targetUrl));
      return scheduleStoreFallback(storeUrl);
    }

    // Android: App Link intent — opens app or Play Store automatically
    if (platform === "android") {
      window.location.replace(
        buildAndroidAppLinkIntentUrl(targetUrl, storeUrl),
      );
      return;
    }

    // iOS: custom scheme, then App Store if app did not open
    window.location.replace(buildAppOpenUrl(targetUrl));
    return scheduleStoreFallback(storeUrl);
  }, [targetUrl, androidUrl, iosUrl]);

  // Mobile: no landing page — brief redirect only
  if (isDesktop !== true) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#143087] border-t-transparent" />
      </div>
    );
  }

  return (
    <div
      dir={isRtl ? "rtl" : "ltr"}
      className="min-h-[60vh] flex items-center justify-center px-4 py-16"
    >
      <div className="w-full max-w-lg text-center flex flex-col items-center gap-8">
        {/* <Image
          src="/assets/images/logo.svg"
          alt="Home Healers"
          width={160}
          height={48}
          className="h-12 w-auto"
        /> */}

        <div className="flex flex-col gap-3">
          <h1 className="text-2xl md:text-3xl font-bold text-[#143087]">
            {copy.title}
          </h1>
          <p className="text-base text-gray-600 leading-relaxed">
            {copy.description}
          </p>
        </div>

        <div className="flex flex-col gap-3 w-full max-w-xs">
          <a
            href={targetUrl}
            className="w-full px-6 py-4 bg-[#143087] text-white font-semibold rounded-xl hover:bg-[#0f2666] transition-colors"
          >
            {locale === "en" ? "Open in App" : "افتح في التطبيق"}
          </a>
          <a
            href={androidUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full px-6 py-4 bg-white border-2 border-[#143087] text-[#143087] font-semibold rounded-xl hover:bg-[#f0f4ff] transition-colors"
          >
            {locale === "en" ? "Download the App (Google Play)" : "حمّل التطبيق (Google Play)"}
          </a>
          <a
            href={iosUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full px-6 py-4 bg-white border-2 border-[#143087] text-[#143087] font-semibold rounded-xl hover:bg-[#f0f4ff] transition-colors"
          >
            {locale === "en" ? "Download the App (App Store)" : "حمّل التطبيق (App Store)"}
          </a>
        </div>
      </div>
    </div>
  );
}
