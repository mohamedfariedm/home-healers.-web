import initTranslations from "@/app/i18n";
import ClientAPI from "@/app/api/api";
import { HeroBanner } from "@/components/AboutUs";

export const dynamic = "force-dynamic";

type Props = { params: { locale: string } };

export async function generateMetadata({ params: { locale } }: Props) {
  const settings = await ClientAPI.getSettings(locale);
  const seo = settings?.data[0]?.setting?.seo["about-us"];

  // Use shared helper so about/privacy/terms follow same structure
  const { createMetadata } = await import("@/lib/seo");
  return createMetadata(seo, locale, "/privacy", {
    title: "General Conditions",
  });
}

export default async function ConditionsPage({ params: { locale } }: Props) {
  const { t } = await initTranslations(locale, ["common"]);
  const settings = await ClientAPI.getSettings(locale);

  const pages = settings?.data[0]?.setting;
  const conditions = pages?.conditions?.[locale];

  return (
    <>
      <div className="min-h-screen bg-white">
        {/* Title behind hero */}
        <h1 className="absolute text-4xl font-bold text-center mb-4 -z-50">
          {conditions?.title}
        </h1>

        {/* HERO */}
        <HeroBanner
          title={conditions?.title}
          breadcrumbItems={[
            { label: locale === "ar" ? "الرئيسية" : "Home" },
            {
              label: locale === "ar" ? "الشروط العامة" : "General Conditions",
              isActive: true,
            },
          ]}
        />

        {/* CONTENT BODY */}
        <div className="flex flex-col items-center gap-14 mt-24 w-full mx-auto px-4">
          <div className="max-w-4xl w-full">
            {/* Items list */}
            <div className="space-y-10">
              {conditions?.items?.map((item: any, index: number) => (
                <div
                  key={index}
                  className="
            group 
            bg-gradient-to-tr from-white to-blue-50/20 
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
                    {item.heading}
                  </h2>

                  {/* Content */}
                  <div
                    className="
              text-gray-700 
              leading-8 
              text-[15px]
              prose prose-blue max-w-none
            "
                    dangerouslySetInnerHTML={{ __html: item.content }}
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
