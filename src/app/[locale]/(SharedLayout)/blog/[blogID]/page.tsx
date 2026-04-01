import initTranslations from "@/app/i18n";
import Features from "@/components/Animations/features";
import BlogRelatedSection from "./_components/BlogSection";
import ClientAPI from "@/app/api/api";
import { createMetadata } from "@/lib/seo";
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; blogID: string }>;
}) {
  const { locale, blogID } = await params;
  const { t } = await initTranslations(locale, ["homepage"]);
  const settings = await ClientAPI.getSettings(locale);
  const seo = settings?.data[0]?.setting?.seo["blogs"];
  const { data } = await ClientAPI.getSingleBlog(blogID, locale);

  // Base metadata from global blogs seo then override with blog-specific meta
  const baseMeta = createMetadata(seo, locale, "/blog", {
    title: data?.meta_title[locale] ||data?.meta_title|| "Home Hellers",
  });

  return {
    ...baseMeta,
    title: data?.meta_title[locale] ||data?.meta_title|| baseMeta.title,
    description: data?.meta_description[locale] || data?.meta_description|| baseMeta.description,
  };
}
async function page({
  params,
}: {
  params: Promise<{ locale: "ar" | "en"; blogID: string }>;
}) {
  const { locale, blogID } = await params;
  const { t } = await initTranslations(locale, ["blog"]);
  const { data } = await ClientAPI.getSingleBlog(blogID, locale);

  return (
    <div className="main-container w-full  mx-auto relative">
      <h1 className="absolute text-4xl font-bold text-center mb-4 -z-50">
        {data?.meta_title[locale]|| data?.meta_title || "Blog Details"}
      </h1>
      <div
        className="w-full h-[250px] relative bg-no-repeat bg-cover bg-center"
        style={{
          backgroundImage:
            "url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-18/DFhQezQ5hS.png)",
        }}
      >
        <div
          className="absolute inset-0 w-full h-full bg-no-repeat bg-cover"
          style={{
            backgroundImage:
              "url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-18/0owx2TM42T.png)",
          }}
        >
          {/* Top Right Decorative Icons */}
          <div className="absolute top-[19.2%] left-[70.76%] w-[2.01%] h-[56.4%]">
            <div
              className="w-[29px] h-[29px] bg-no-repeat bg-cover"
              style={{
                backgroundImage:
                  "url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-18/4QUzxCKOhU.png)",
              }}
            />
            <div
              className="w-[29px] h-[29px] mt-[83px] bg-no-repeat bg-cover"
              style={{
                backgroundImage:
                  "url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-18/803XMdkNFA.png)",
              }}
            />
          </div>

          {/* Center Content */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
            <div className="text-white text-[24px] font-semibold leading-[32px]">
              {t("hero.title", { ns: "blog" })}
            </div>
            <div className="mt-2 flex justify-center items-center gap-2">
              <span className="text-[#62a0f6] text-sm font-semibold">
                {t("hero.breadcrumb", { ns: "blog" })}
              </span>
              <div
                className="w-4 h-4 bg-no-repeat bg-cover"
                style={{
                  backgroundImage:
                    "url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-18/5HzeZiBmtr.png)",
                }}
              />
              <span className="text-white text-sm font-semibold">
                {t("hero.home", { ns: "blog" })}
              </span>
            </div>
          </div>

          {/* Decorative Elements */}
          <div
            className="absolute top-[34%] left-[14.44%] w-[2.01%] h-[11.6%] bg-no-repeat bg-cover"
            style={{
              backgroundImage:
                "url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-18/e0Abrtvom6.png)",
            }}
          />
          <div
            className="absolute top-[41.6%] left-[93.13%] w-[2.01%] h-[11.6%] bg-no-repeat bg-cover"
            style={{
              backgroundImage:
                "url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-18/1XdOKqGhLn.png)",
            }}
          />
          <div
            className="absolute top-[62.8%] left-[6.88%] w-[1.67%] h-[9.6%] bg-no-repeat bg-cover"
            style={{
              backgroundImage:
                "url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-18/3yY0wTn197.png)",
            }}
          />
        </div>
      </div>

      <BlogRelatedSection data={data} locale={locale} />
    </div>
  );
}

export default page;
