import initTranslations from "@/app/i18n";
import { HeroBanner } from "@/components/AboutUs";
import { getCachedSettings } from "@/lib/cached-api";
import { createMetadata } from "@/lib/seo";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const { t } = await initTranslations(locale, ["terms"]);
  const settings = await getCachedSettings(locale);
  const seo = settings?.data?.[0]?.setting?.seo?.["terms"];
  const terms = settings?.data?.[0]?.setting?.terms?.[locale];

  return createMetadata(seo, locale, "/terms", {
    title: terms?.title || t("title"),
    description: t("introduction"),
    keywords: "Home Healers, terms and conditions, terms of use, healthcare",
  });
}

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const { t } = await initTranslations(locale, ["common", "terms"]);
  const settings = await getCachedSettings(locale);

  const terms = settings?.data?.[0]?.setting?.terms?.[locale];

  return (
    <>
      <div className="min-h-screen bg-white">
        <HeroBanner
          title={terms?.title || t("title", { ns: "terms" })}
          breadcrumbItems={[
            { label: t("home", { ns: "common" }) },
            {
              label: t("breadCrumb", { ns: "terms" }),
              isActive: true,
            },
          ]}
        />

        <div className="flex flex-col items-center gap-14 mt-24 w-full mx-auto px-4">
          <div className="max-w-4xl w-full">
            <div className="space-y-10">
              {terms?.sections?.map((section: any, index: number) => (
                <div
                  key={index}
                  className="
            group 
            bg-gradient-to-tr from-white to-blue-50/30 
            border border-gray-200 
            p-8 rounded-2xl 
            shadow-sm 
            hover:shadow-lg 
            transition-all duration-300
          "
                >
                  <h2
                    className="
              text-2xl 
              font-semibold 
              text-gray-900 
              mb-4 
              group-hover:text-blue-700 
              transition
            "
                  >
                    {section.heading}
                  </h2>

                  <div
                    className="
              text-gray-700 
              leading-8 
              text-[15px]
              prose prose-blue max-w-none
            "
                    dangerouslySetInnerHTML={{ __html: section.content }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
