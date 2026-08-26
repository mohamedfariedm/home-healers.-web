"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

export default function BlogNotFound() {
  const params = useParams();
  const locale = (params?.locale as string) || "ar";
  const prefix = locale === "ar" ? "" : "/en";
  const copy =
    locale === "en"
      ? {
          title: "Article not found",
          body: "This article is not available or has been moved.",
          back: "Back to articles",
        }
      : {
          title: "المقال غير موجود",
          body: "هذا المقال غير متاح أو تم نقله.",
          back: "العودة إلى المقالات",
        };

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-4 py-20 text-center">
      <h1 className="mb-4 text-3xl font-bold text-[#143087]">{copy.title}</h1>
      <p className="mb-8 text-[#4a5568]">{copy.body}</p>
      <Link
        href={`${prefix}/blog`}
        className="inline-flex h-12 items-center rounded-xl bg-primary px-6 font-semibold text-white"
      >
        {copy.back}
      </Link>
    </div>
  );
}
