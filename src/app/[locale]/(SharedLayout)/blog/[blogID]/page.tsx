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
import { getCachedBlogs, getCachedSettings, getCachedSingleBlog } from "@/lib/cached-api";
import { hydrateRelatedBlogs } from "@/lib/public-payload";
import {
  blogHref,
  getBlogSlug,
  getNewsTitle,
  unwrapDetail,
} from "@/lib/slugs";
import { PageHero } from "@/components/Shared/PageHero";
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
  const [{ t }, loaded, blogsRes] = await Promise.all([
    initTranslations(locale, ["blog"]),
    loadBlog(locale, blogID),
    getCachedBlogs(locale).catch(() => ({ data: [] as any[] })),
  ]);

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
    <div className="page-shell">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: renderJsonLd(articleSchema) }}
      />
      <PageHero
        titleAs="p"
        title={t("hero.title", { ns: "blog" })}
        breadcrumbItems={[
          {
            label: t("hero.home", { ns: "blog" }),
            href: localePath(locale, "/"),
          },
          {
            label: t("hero.breadcrumb", { ns: "blog" }),
            href: localePath(locale, "/blog"),
          },
          {
            label: articleTitle || t("hero.breadcrumb", { ns: "blog" }),
            isActive: true,
          },
        ]}
      />

      <BlogRelatedSection
        data={{
          ...loaded.data,
          related_blogs: hydrateRelatedBlogs(
            loaded.data.related_blogs,
            blogsRes?.data || [],
            locale,
          ),
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
