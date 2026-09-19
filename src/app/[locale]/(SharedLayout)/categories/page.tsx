import initTranslations from "@/app/i18n";
import { CategoriesGrid } from "@/components/Categories";
import { Bannar } from "../(homepage)/_components";
import { createMetadata } from "@/lib/seo";
import { getCachedCategories, getCachedSettings } from "@/lib/cached-api";
import { slimBanner, slimCategoryCard } from "@/lib/public-payload";
import { PageHero } from "@/components/Shared/PageHero";
import { localePath } from "@/lib/offers";
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const settings = await getCachedSettings(locale);
  const seo = settings?.data[0]?.setting?.seo?.["categories"];

  return createMetadata(seo, locale, "/categories", {
    title: "Home Healers | Categories",
    description: "Browse our medical specialties and categories",
  });
}

export default async function CategoriesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const { t } = await initTranslations(locale, ["common"]);
  const [categoriesData, settings] = await Promise.all([
    getCachedCategories(locale),
    getCachedSettings(locale),
  ]);

  const homeBanners = settings?.data?.[0]?.setting?.banners?.filter(
    (b: { page: string }) => b.page === "categories",
  );

  return (
    <div className="page-shell bg-white">
      <PageHero
        title={t("categories.hero.title", { ns: "common" })}
        breadcrumbItems={[
          {
            label: t("categories.hero.home", { ns: "common" }),
            href: localePath(locale, "/"),
          },
          {
            label: t("categories.hero.breadcrumb", { ns: "common" }),
            isActive: true,
          },
        ]}
      />

      <div className="mx-auto max-w-screen-xl px-4 py-10 sm:py-12 lg:py-16">
        <CategoriesGrid
          locale={locale}
          categories={(categoriesData?.data || []).map(slimCategoryCard)}
        />
      </div>

      {homeBanners?.length > 0 &&
        homeBanners.map((banner: { id?: number }, index: number) => (
          <Bannar key={banner.id ?? index} banner={slimBanner(banner)} />
        ))}
    </div>
  );
}
