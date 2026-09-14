import initTranslations from "@/app/i18n";
import BlogRelatedSection from "./_components/BlogSection";
import BlogLeadForm from "./_components/BlogLeadForm";
import ClientAPI from "@/app/api/api";
import {
  buildCanonicalUrl,
  buildLocalizedSlugAlternates,
  createMetadata,
} from "@/lib/seo";
import { createArticleSchema, renderJsonLd } from "@/lib/structured-data";
import { getCachedSettings, getCachedSingleBlog } from "@/lib/cached-api";
import { slimBlogForHome } from "@/lib/public-payload";
import {
  blogHref,
  getBlogSlug,
  getNewsTitle,
  unwrapDetail,
} from "@/lib/slugs";
import { HeroBreadcrumb } from "@/components/Shared/HeroBreadcrumb";
import { localePath } from "@/lib/offers";
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
  const settings = await getCachedSettings(locale);
  const seo = settings?.data?.[0]?.setting?.seo?.["blogs"];
  const loaded = await loadBlog(locale, blogID);
  const data = loaded?.data;
  const blogSlug = getBlogSlug(data, locale) || decodeURIComponent(blogID);
  const path = `/blog/${encodeURIComponent(blogSlug)}`;
  const canonical = buildCanonicalUrl(locale, path);
  const title =
    localizedMeta(data?.meta_title, locale) ||
    getNewsTitle(data, locale) ||
    "Home Healers";
  const description = localizedMeta(data?.meta_description, locale);

  const image =
    (data?.image as { original?: string }[] | undefined)?.[0]?.original ||
    undefined;
  const baseMeta = createMetadata(
    seo,
    locale,
    path,
    { title, description, ogType: "article" },
    { preferPathCanonical: true },
  );

  return {
    ...baseMeta,
    title: title || baseMeta.title,
    description: description || baseMeta.description,
    alternates: {
      canonical,
      languages: buildLocalizedSlugAlternates("/blog", data?.slug, blogSlug),
    },
    openGraph: {
      ...baseMeta.openGraph,
      type: "article",
      title,
      description: description || baseMeta.description,
      url: canonical,
      images: image
        ? [{ url: image, width: 1200, height: 630, alt: title }]
        : baseMeta.openGraph?.images,
    },
    twitter: {
      ...baseMeta.twitter,
      title,
      description: description || baseMeta.description,
      images: image ? [image] : baseMeta.twitter?.images,
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

  const blogSlug = getBlogSlug(loaded.data, locale);
  if (blogSlug && (loaded.fromId || blogSlug !== loaded.requested)) {
    permanentRedirect(blogHref(locale, blogSlug));
  }

  const articleTitle = getNewsTitle(loaded.data, locale);
  const articleImage = (
    loaded.data?.image as { original?: string }[] | undefined
  )?.[0]?.original;
  const publisher = loaded.data?.publisher as { name?: string } | undefined;
  const articleSchema = createArticleSchema({
    headline: articleTitle || "Home Healers",
    description: localizedMeta(loaded.data?.meta_description, locale),
    image: articleImage,
    datePublished: localizedMeta(loaded.data?.date, locale) || localizedMeta(loaded.data?.created_at, locale),
    dateModified: localizedMeta(loaded.data?.updated_at, locale) || localizedMeta(loaded.data?.date, locale),
    authorName: publisher?.name || "Home Healers",
    url: buildCanonicalUrl(
      locale,
      `/blog/${encodeURIComponent(blogSlug || decodeURIComponent(blogID))}`,
    ),
  });

  return (
    <div className="main-container relative mx-auto w-full overflow-x-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: renderJsonLd(articleSchema) }}
      />
      <div
        className="relative h-[200px] w-full overflow-hidden bg-cover bg-center bg-no-repeat sm:h-[250px]"
        style={{
          backgroundImage:
            "url(/assets/images/shared/hero-banner/hero-bg-main.png)",
        }}
      >
        <div
          className="absolute inset-0 h-full w-full bg-cover bg-no-repeat"
          style={{
            backgroundImage:
              "url(/assets/images/shared/hero-banner/hero-layer-2.png)",
          }}
        >
          <div className="pointer-events-none absolute top-[19.2%] left-[70.76%] hidden h-[56.4%] w-[2.01%] md:block">
            <div
              className="h-[29px] w-[29px] bg-cover bg-no-repeat"
              style={{
                backgroundImage:
                  "url(/assets/images/shared/hero-banner/hero-deco-1.svg)",
              }}
            />
            <div
              className="mt-[83px] h-[29px] w-[29px] bg-cover bg-no-repeat"
              style={{
                backgroundImage:
                  "url(/assets/images/shared/hero-banner/hero-deco-2.svg)",
              }}
            />
          </div>

          <div className="absolute top-1/2 left-1/2 w-[90%] max-w-[640px] -translate-x-1/2 -translate-y-1/2 px-4 text-center">
            <p className="text-xl font-semibold leading-8 text-white sm:text-[24px]">
              {t("hero.title", { ns: "blog" })}
            </p>
            <HeroBreadcrumb
              items={[
                {
                  label: t("hero.home", { ns: "blog" }),
                  href: localePath(locale, "/"),
                },
                {
                  label: t("hero.breadcrumb", { ns: "blog" }),
                  href: localePath(locale, "/blog"),
                  isActive: true,
                },
              ]}
            />
          </div>

          <div
            className="pointer-events-none absolute top-[34%] left-[14.44%] hidden h-[11.6%] w-[2.01%] bg-cover bg-no-repeat md:block"
            style={{
              backgroundImage:
                "url(/assets/images/shared/hero-banner/hero-deco-3.svg)",
            }}
          />
          <div
            className="pointer-events-none absolute top-[41.6%] left-[93.13%] hidden h-[11.6%] w-[2.01%] bg-cover bg-no-repeat md:block"
            style={{
              backgroundImage:
                "url(/assets/images/shared/hero-banner/hero-deco-4.svg)",
            }}
          />
          <div
            className="pointer-events-none absolute top-[62.8%] left-[6.88%] hidden h-[9.6%] w-[1.67%] bg-cover bg-no-repeat md:block"
            style={{
              backgroundImage:
                "url(/assets/images/shared/hero-banner/hero-deco-5.svg)",
            }}
          />
        </div>
      </div>

      <BlogRelatedSection
        data={{
          ...loaded.data,
          related_blogs: (Array.isArray(loaded.data.related_blogs)
            ? loaded.data.related_blogs
            : []
          ).map(slimBlogForHome),
        }}
        locale={locale}
      />
      <BlogLeadForm
        locale={locale}
        blogTitle={getNewsTitle(loaded.data, locale)}
      />
    </div>
  );
}

export default page;
