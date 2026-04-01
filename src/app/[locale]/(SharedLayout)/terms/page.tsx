import initTranslations from "@/app/i18n";
import ClientAPI from "@/app/api/api";
import { HeroBanner } from "@/components/AboutUs";

export const dynamic = "force-dynamic";

type Props = { params: { locale: string } };

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const settings = await ClientAPI.getSettings(locale);
  const seo = settings?.data[0]?.setting?.seo["about-us"];

  const { createMetadata } = await import("@/lib/seo");
  return createMetadata(seo, locale, "/terms", { title: "Terms & Conditions" });
}

export default async function TermsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const { t } = await initTranslations(locale, ["common", "terms"]);
  const settings = await ClientAPI.getSettings(locale);

  const pages = settings?.data[0]?.setting;
  const terms = pages?.terms?.[locale];

  return (
    <>
      <div className="min-h-screen bg-white">
        {/* Page Title (behind hero like About Us) */}
        <h1 className="absolute text-4xl font-bold text-center mb-4 -z-50">
          {terms?.title}
        </h1>

        {/* HERO SECTION */}
        <HeroBanner
          title={terms?.title}
          breadcrumbItems={[
            { label: t("home", { ns: "common" }) },
            {
              label: t("breadCrumb", { ns: "terms" }),
              isActive: true,
            },
          ]}
        />

        {/* CONTENT */}
        <div className="flex flex-col items-center gap-14 mt-24 w-full mx-auto px-4">
          <div className="max-w-4xl w-full">
            {/* Sections */}
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
                  {/* Heading */}
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

                  {/* Content */}
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
