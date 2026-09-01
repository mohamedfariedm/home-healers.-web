"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";

export default function OfferError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const params = useParams();
  const locale = (params?.locale as string) || "ar";
  const copy =
    locale === "en"
      ? {
          title: "We couldn't load this offer right now.",
          retry: "Retry",
        }
      : {
          title: "تعذر تحميل هذا العرض حالياً.",
          retry: "إعادة المحاولة",
        };

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex min-h-[50vh] max-w-xl flex-col items-center justify-center px-4 py-20 text-center">
      <h1 className="mb-4 text-2xl font-bold text-[#143087]">{copy.title}</h1>
      <button
        type="button"
        onClick={reset}
        className="inline-flex h-12 items-center rounded-xl bg-primary px-6 font-semibold text-white"
      >
        {copy.retry}
      </button>
    </div>
  );
}
