import ClientAPI from "@/app/api/api";
import initTranslations from "@/app/i18n";
import { CategoryDetailSection } from "@/components/Categories";
import { Bannar } from "../../(homepage)/_components";
import { getCachedCategory } from "@/lib/cached-api";
import { localePath } from "@/lib/offers";
import { getPlainTextFromHtml } from "@/lib/parse-cms-html";
import {
  buildCanonicalUrl,
  buildLocalizedSlugAlternates,
  createMetadata,
  getLocalizedValue,
} from "@/lib/seo";
import {
  categoryHref,
  getActiveServices,
  getCategorySlug,
  isActiveRecord,
  unwrapDetail,
} from "@/lib/slugs";
import type { Category } from "@/types/booking";
import { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";

export const dynamic = "force-dynamic";

async function loadCategory(locale: string, key: string) {
  const decoded = decodeURIComponent(key);
  const res = await getCachedCategory(locale, decoded);
  const category = unwrapDetail<Category>(res);
  if (!category || !isActiveRecord(category)) return null;

  return {
    category: { ...category, services: getActiveServices(category.services) },
    requestedSlug: decoded,
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const loaded = await loadCategory(locale, slug);

  if (!loaded) {
    return createMetadata(null, locale, `/categories/${slug}`, {
      title: "Home Healers | Category",
    });
  }

  const categorySlug =
    getCategorySlug(loaded.category, locale) || loaded.requestedSlug;
  const path = `/categories/${encodeURIComponent(categorySlug)}`;
  const canonical = buildCanonicalUrl(locale, path);
  const title =
    getLocalizedValue(loaded.category.meta_title, locale) ||
    (loaded.category.name
      ? `${loaded.category.name} | Home Healers`
      : "Home Healers | Category");
  const description =
    getLocalizedValue(loaded.category.meta_description, locale) ||
    getPlainTextFromHtml(
      getLocalizedValue(loaded.category.description, locale),
    ).slice(0, 160) ||
    (loaded.category.name
      ? `Services in ${loaded.category.name}`
      : "Category details");
  const ogTitle =
    getLocalizedValue(loaded.category.og_title, locale) || title;
  const ogDescription =
    getLocalizedValue(loaded.category.og_description, locale) || description;
  const image =
    loaded.category.image?.[0]?.original ||
    loaded.category.icon?.[0]?.original ||
    "/assets/images/favicon.ico";

  const baseMeta = createMetadata(
    null,
    locale,
    path,
    { title, description },
    { preferPathCanonical: true },
  );

  return {
    ...baseMeta,
    title,
    description,
    alternates: {
      canonical,
      languages: buildLocalizedSlugAlternates(
        "/categories",
        loaded.category.slug,
        categorySlug,
      ),
    },
    openGraph: {
      ...baseMeta.openGraph,
      title: ogTitle,
      description: ogDescription,
      url: canonical,
      images: [{ url: image, width: 1200, height: 630 }],
    },
    twitter: {
      ...baseMeta.twitter,
      title: ogTitle,
      description: ogDescription,
      images: [image],
    },
  };
}

export default async function CategoryDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const { t } = await initTranslations(locale, ["common"]);
  const loaded = await loadCategory(locale, slug);

  if (!loaded) {
    notFound();
  }

  const categorySlug = getCategorySlug(loaded.category, locale);
  if (categorySlug && categorySlug !== loaded.requestedSlug) {
    permanentRedirect(categoryHref(locale, categorySlug));
  }

  const settings = await ClientAPI.getSettings(locale);
  const homeBanners = settings?.data?.[0]?.setting?.banners?.filter(
    (b: { page: string }) => b.page === "categories",
  );

  return (
    <div className="main-container w-full bg-[#fff] relative overflow-hidden mx-auto my-0 pb-12">
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
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center px-4">
            <div className="text-white text-[24px] font-semibold leading-[32px]">
              {loaded.category.name}
            </div>
            <div className="mt-2 flex justify-center items-center gap-2 flex-wrap">
              <span className="text-[#62a0f6] text-sm font-semibold">
                {loaded.category.name}
              </span>
              <div
                className="w-4 h-4 bg-no-repeat bg-cover"
                style={{
                  backgroundImage:
                    "url(/assets/images/shared/hero-banner/hero-breadcrumb-arrow.svg)",
                }}
              />
              <a
                href={localePath(locale, "/categories")}
                className="text-white text-sm font-semibold hover:underline"
              >
                {t("categories.hero.breadcrumb", { ns: "common" })}
              </a>
              <div
                className="w-4 h-4 bg-no-repeat bg-cover"
                style={{
                  backgroundImage:
                    "url(/assets/images/shared/hero-banner/hero-breadcrumb-arrow.svg)",
                }}
              />
              <a
                href={localePath(locale, "/")}
                className="text-white text-sm font-semibold hover:underline"
              >
                {t("categories.hero.home", { ns: "common" })}
              </a>
            </div>
          </div>
        </div>
      </div>

      <CategoryDetailSection locale={locale} category={loaded.category} />

      {homeBanners?.length > 0 &&
        homeBanners.map((banner: { id?: number }, index: number) => (
          <Bannar key={banner.id ?? index} banner={banner} />
        ))}
    </div>
  );
}
