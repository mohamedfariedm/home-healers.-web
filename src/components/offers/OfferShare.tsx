"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { Copy, Facebook, Share2 } from "lucide-react";

type OfferShareProps = {
  url: string;
  title: string;
};

export default function OfferShare({ url, title }: OfferShareProps) {
  const { t } = useTranslation("offers");
  const [copied, setCopied] = useState(false);
  const [canNativeShare, setCanNativeShare] = useState(false);
  const encodedUrl = encodeURIComponent(url);
  const encodedText = encodeURIComponent(`${title} ${url}`);

  useEffect(() => {
    setCanNativeShare(typeof navigator !== "undefined" && "share" in navigator);
  }, []);

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success(t("copied"));
    } catch {
      toast.error(t("error"));
    }
  }

  async function nativeShare() {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        /* user cancelled */
      }
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <p className="text-sm font-medium text-[#143087]">{t("share")}</p>
      {canNativeShare ? (
        <button
          type="button"
          onClick={nativeShare}
          className="inline-flex size-10 items-center justify-center rounded-full bg-[#eef4ff] text-[#143087]"
          aria-label={t("shareNative")}
        >
          <Share2 className="size-4" />
        </button>
      ) : null}
      <a
        href={`https://wa.me/?text=${encodedText}`}
        target="_blank"
        rel="noopener"
        className="inline-flex h-10 items-center rounded-full bg-[#eef4ff] px-3 text-sm font-medium text-[#143087]"
      >
        WhatsApp
      </a>
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
        target="_blank"
        rel="noopener"
        className="inline-flex size-10 items-center justify-center rounded-full bg-[#eef4ff] text-[#143087]"
        aria-label="Facebook"
      >
        <Facebook className="size-4" />
      </a>
      <a
        href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodeURIComponent(title)}`}
        target="_blank"
        rel="noopener"
        className="inline-flex h-10 items-center rounded-full bg-[#eef4ff] px-3 text-sm font-medium text-[#143087]"
      >
        X
      </a>
      <button
        type="button"
        onClick={copy}
        className="inline-flex h-10 items-center gap-1 rounded-full bg-[#eef4ff] px-3 text-sm font-medium text-[#143087]"
      >
        <Copy className="size-4" />
        {copied ? t("copied") : t("copyLink")}
      </button>
      <p className="w-full break-all text-xs text-[#4a5568]">
        <span className="sr-only">{t("canonicalUrl")}: </span>
        {url}
      </p>
    </div>
  );
}
