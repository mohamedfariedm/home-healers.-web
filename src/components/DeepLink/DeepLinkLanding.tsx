"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  buildAndroidIntentUrl,
  buildAppOpenUrl,
  getMobilePlatform,
  APP_OPEN_TIMEOUT_MS,
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

type ViewState = "detecting" | "landing" | "redirecting";

function tryOpenApp(
  platform: "android" | "ios",
  appOpenUrl: string,
  targetUrl: string,
  storeUrl: string,
) {
  if (platform === "android") {
    window.location.href = buildAndroidIntentUrl(targetUrl, storeUrl);
    return;
  }

  window.location.href = appOpenUrl;

  const startedAt = Date.now();
  const fallbackTimer = window.setTimeout(() => {
    if (document.hidden || Date.now() - startedAt > APP_OPEN_TIMEOUT_MS + 500) {
      return;
    }
    window.location.href = storeUrl;
  }, APP_OPEN_TIMEOUT_MS);

  const onVisibilityChange = () => {
    if (document.hidden) {
      window.clearTimeout(fallbackTimer);
    }
  };

  document.addEventListener("visibilitychange", onVisibilityChange);

  return () => {
    window.clearTimeout(fallbackTimer);
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
  const appOpenUrl = buildAppOpenUrl(targetUrl);
  const isRtl = locale !== "en";
  const [view, setView] = useState<ViewState>("detecting");

  useEffect(() => {
    const platform = getMobilePlatform(navigator.userAgent || "");

    if (platform === "desktop") {
      setView("landing");
      return;
    }

    setView("redirecting");
    const storeUrl = platform === "android" ? androidUrl : iosUrl;
    return tryOpenApp(platform, appOpenUrl, targetUrl, storeUrl);
  }, [appOpenUrl, targetUrl, androidUrl, iosUrl]);

  if (view !== "landing") {
    return (
      <div
        dir={isRtl ? "rtl" : "ltr"}
        className="min-h-[60vh] flex items-center justify-center px-4 py-16"
      >
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#143087] border-t-transparent" />
          <p className="text-base font-medium text-[#143087]">
            {locale === "en" ? "Opening Home Healers..." : "جاري فتح هوم هيلرز..."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      dir={isRtl ? "rtl" : "ltr"}
      className="min-h-[60vh] flex items-center justify-center px-4 py-16"
    >
      <div className="w-full max-w-lg text-center flex flex-col items-center gap-8">

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
            href={androidUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full px-6 py-4 bg-[#143087] text-white font-semibold rounded-xl hover:bg-[#0f2666] transition-colors"
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
