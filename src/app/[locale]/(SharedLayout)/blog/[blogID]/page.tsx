import initTranslations from "@/app/i18n";
import BlogRelatedSection from "./_components/BlogSection";
import BlogLeadForm from "./_components/BlogLeadForm";
import ClientAPI from "@/app/api/api";
import {
  buildCanonicalUrl,
  buildLanguageAlternates,
  createMetadata,
} from "@/lib/seo";
import { getCachedSingleBlog } from "@/lib/cached-api";
import {
  blogHref,
  getBlogSlug,
  getNewsTitle,
  unwrapDetail,
} from "@/lib/slugs";
import { notFound, permanentRedirect } from "next/navigation";

export const dynamic = "force-dynamic";

async function loadBlog(locale: string, param: string) {
  const decoded = decodeURIComponent(param);

  const bySlug = await getCachedSingleBlog(decoded, locale);
  const slugData = unwrapDetail<Record<string, unknown>>(bySlug);
  if (slugData) return { data: slugData, fromId: false, requested: decoded };

  if (/^\d+$/.test(decoded)) {
    const byId = await ClientAPI.getNewsItem(decoded, locale);
    const data = unwrapDetail<Record<string, unknown>>(byId);
    if (data) return { data, fromId: true, requested: decoded };
  }

  return null;
}

function localizedMeta(
  value: unknown,
  locale: string,
): string {
  if (typeof value === "string") return value;
  if (value && typeof value === "object") {
    const record = value as Record<string, string>;
    return record[locale] || record.en || record.ar || "";
  }
  return "";
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; blogID: string }>;
}) {
  const { locale, blogID } = await params;
  const settings = await ClientAPI.getSettings(locale);
  const seo = settings?.data?.[0]?.setting?.seo?.["blogs"];
  const loaded = await loadBlog(locale, blogID);
  const data = loaded?.data;
  const blogSlug = getBlogSlug(data) || decodeURIComponent(blogID);
  const path = `/blog/${encodeURIComponent(blogSlug)}`;
  const canonical = buildCanonicalUrl(locale, path);
  const title =
    localizedMeta(data?.meta_title, locale) ||
    getNewsTitle(data, locale) ||
    "Home Healers";
  const description = localizedMeta(data?.meta_description, locale);

  const baseMeta = createMetadata(
    seo,
    locale,
    path,
    { title, ogType: "article" },
    { preferPathCanonical: true },
  );

  return {
    ...baseMeta,
    title: title || baseMeta.title,
    description: description || baseMeta.description,
    alternates: {
      canonical,
      languages: buildLanguageAlternates(path),
    },
  };
}

async function page({
  params,
}: {
  params: Promise<{ locale: "ar" | "en"; blogID: string }>;
}) {
  const { locale, blogID } = await params;
  const { t } = await initTranslations(locale, ["blog"]);
  const loaded = await loadBlog(locale, blogID);

  if (!loaded) {
    notFound();
  }

  const blogSlug = getBlogSlug(loaded.data);
  if (blogSlug && (loaded.fromId || blogSlug !== loaded.requested)) {
    permanentRedirect(blogHref(locale, blogSlug));
  }

  return (
    <div className="main-container w-full  mx-auto relative">
      <div
        className="w-full h-[250px] relative bg-no-repeat bg-cover bg-center"
        style={{
          backgroundImage:
            "url(/assets/images/shared/hero-banner/hero-bg-main.png)",
        }}
      >
        <div
          className="absolute inset-0 w-full h-full bg-no-repeat bg-cover"
          style={{
            backgroundImage:
              "url(/assets/images/shared/hero-banner/hero-layer-2.png)",
          }}
        >
          <div className="absolute top-[19.2%] left-[70.76%] w-[2.01%] h-[56.4%]">
            <div
              className="w-[29px] h-[29px] bg-no-repeat bg-cover"
              style={{
                backgroundImage:
                  "url(/assets/images/shared/hero-banner/hero-deco-1.svg)",
              }}
            />
            <div
              className="w-[29px] h-[29px] mt-[83px] bg-no-repeat bg-cover"
              style={{
                backgroundImage:
                  "url(/assets/images/shared/hero-banner/hero-deco-2.svg)",
              }}
            />
          </div>

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
                    "url(/assets/images/shared/hero-banner/hero-breadcrumb-arrow.svg)",
                }}
              />
              <span className="text-white text-sm font-semibold">
                {t("hero.home", { ns: "blog" })}
              </span>
            </div>
          </div>

          <div
            className="absolute top-[34%] left-[14.44%] w-[2.01%] h-[11.6%] bg-no-repeat bg-cover"
            style={{
              backgroundImage:
                "url(/assets/images/shared/hero-banner/hero-deco-3.svg)",
            }}
          />
          <div
            className="absolute top-[41.6%] left-[93.13%] w-[2.01%] h-[11.6%] bg-no-repeat bg-cover"
            style={{
              backgroundImage:
                "url(/assets/images/shared/hero-banner/hero-deco-4.svg)",
            }}
          />
          <div
            className="absolute top-[62.8%] left-[6.88%] w-[1.67%] h-[9.6%] bg-no-repeat bg-cover"
            style={{
              backgroundImage:
                "url(/assets/images/shared/hero-banner/hero-deco-5.svg)",
            }}
          />
        </div>
      </div>

      <BlogRelatedSection data={loaded.data} locale={locale} />
      <BlogLeadForm
        locale={locale}
        blogTitle={getNewsTitle(loaded.data, locale)}
      />
    </div>
  );
}

export default page;
