import initTranslations from "@/app/i18n";
import { CategoriesGrid } from "@/components/Categories";
import { Bannar } from "../(homepage)/_components";
import { createMetadata } from "@/lib/seo";
import { getCachedCategories, getCachedSettings } from "@/lib/cached-api";
import { slimBanner, slimCategoryCard } from "@/lib/public-payload";
import { HeroBreadcrumb } from "@/components/Shared/HeroBreadcrumb";
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
    <div className="main-container w-full bg-[#fff] relative overflow-hidden mx-auto my-0">
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
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
            <h1 className="text-white text-[24px] font-semibold leading-[32px]">
              {t("categories.hero.title", { ns: "common" })}
            </h1>
            <HeroBreadcrumb
              items={[
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
          </div>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 py-12">
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
