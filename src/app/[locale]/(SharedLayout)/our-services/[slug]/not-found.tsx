"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

export default function ServiceNotFound() {
  const params = useParams();
  const locale = (params?.locale as string) || "ar";
  const prefix = locale === "ar" ? "" : "/en";
  const copy =
    locale === "en"
      ? {
          title: "Service not found",
          body: "This service is not available or is no longer published.",
          back: "Back to services",
        }
      : {
          title: "الخدمة غير موجودة",
          body: "هذه الخدمة غير متاحة أو لم تعد منشورة.",
          back: "العودة إلى الخدمات",
        };

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-4 py-20 text-center">
      <h1 className="mb-4 text-3xl font-bold text-[#143087]">{copy.title}</h1>
      <p className="mb-8 text-[#4a5568]">{copy.body}</p>
      <Link
        href={`${prefix}/our-services`}
        className="inline-flex h-12 items-center rounded-xl bg-primary px-6 font-semibold text-white"
      >
        {copy.back}
      </Link>
    </div>
  );
}
