"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

export default function OfferNotFound() {
  const params = useParams();
  const locale = (params?.locale as string) || "ar";
  const prefix = locale === "ar" ? "" : "/en";
  const copy =
    locale === "en"
      ? {
          title: "This offer is no longer available",
          body: "The offer you are looking for has ended or is not currently published.",
          back: "Back to offers",
        }
      : {
          title: "هذا العرض لم يعد متاحاً",
          body: "العرض الذي تبحث عنه انتهى أو لم يعد منشوراً.",
          back: "العودة إلى العروض",
        };

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-4 py-20 text-center">
      <h1 className="mb-4 text-3xl font-bold text-[#143087]">{copy.title}</h1>
      <p className="mb-8 text-[#4a5568]">{copy.body}</p>
      <Link
        href={`${prefix}/offers`}
        className="inline-flex h-12 items-center rounded-xl bg-primary px-6 font-semibold text-white"
      >
        {copy.back}
      </Link>
    </div>
  );
}
