"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
  buildAndroidAppLinkIntentUrl,
  buildAppOpenUrl,
  getMobilePlatform,
  isFacebookOrInstagram,
  type DeepLinkRoute,
  DEEP_LINK_COPY,
  type MobilePlatform,
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
  const isRtl = locale !== "en";
  const [platform, setPlatform] = useState<MobilePlatform>("desktop");

  const openInAppHref = useMemo(() => {
    if (platform === "android") {
      return buildAndroidAppLinkIntentUrl(targetUrl);
    }
    return targetUrl;
  }, [platform, targetUrl]);

  useEffect(() => {
    const ua = navigator.userAgent || "";
    setPlatform(getMobilePlatform(ua));

    // Custom scheme only inside Facebook / Instagram in-app browser
    if (isFacebookOrInstagram(ua)) {
      window.location.href = buildAppOpenUrl(targetUrl);
    }
  }, [targetUrl]);

  const isMobile = platform !== "desktop";
  const storeUrl = platform === "android" ? androidUrl : iosUrl;

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
            href={openInAppHref}
            className="w-full px-6 py-4 bg-[#143087] text-white font-semibold rounded-xl hover:bg-[#0f2666] transition-colors"
          >
            {locale === "en" ? "Open in App" : "افتح في التطبيق"}
          </a>

          {isMobile ? (
            <a
              href={storeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full px-6 py-4 bg-white border-2 border-[#143087] text-[#143087] font-semibold rounded-xl hover:bg-[#f0f4ff] transition-colors"
            >
              {locale === "en" ? "Download the App" : "حمّل التطبيق"}
            </a>
          ) : (
            <>
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
            </>
          )}
        </div>
      </div>
    </div>
  );
}
