import ClientAPI from "@/app/api/api";
import initTranslations from "@/app/i18n";
import { CategoriesGrid } from "@/components/Categories";
import { Bannar } from "../(homepage)/_components";
import { createMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const settings = await ClientAPI.getSettings(locale);
  const seo = settings?.data[0]?.setting?.seo?.["categories"];

  return createMetadata(seo, locale, "/categories", {
    title: "Home Hellers | Categories",
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
  const categoriesData = await ClientAPI.getCategories(locale);
  const settings = await ClientAPI.getSettings(locale);

  console.log(
    "[Categories Page API Response]",
    JSON.stringify(categoriesData, null, 2),
  );

  const seo = settings?.data[0]?.setting?.seo["categories"];
  const homeBanners = settings?.data?.[0]?.setting?.banners?.filter(
    (b: { page: string }) => b.page === "categories",
  );

  return (
    <div className="main-container w-full bg-[#fff] relative overflow-hidden mx-auto my-0">
      <h1 className="absolute text-4xl font-bold text-center mb-4 -z-50">
        {seo?.[locale]?.title || t("categories.hero.title", { ns: "common" })}
      </h1>

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
            <div className="text-white text-[24px] font-semibold leading-[32px]">
              {t("categories.hero.title", { ns: "common" })}
            </div>
            <div className="mt-2 flex justify-center items-center gap-2">
              <span className="text-[#62a0f6] text-sm font-semibold">
                {t("categories.hero.breadcrumb", { ns: "common" })}
              </span>
              <div
                className="w-4 h-4 bg-no-repeat bg-cover"
                style={{
                  backgroundImage:
                    "url(/assets/images/shared/hero-banner/hero-breadcrumb-arrow.svg)",
                }}
              />
              <span className="text-white text-sm font-semibold">
                {t("categories.hero.home", { ns: "common" })}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 py-12">
        <CategoriesGrid
          locale={locale}
          categories={categoriesData?.data || []}
        />
      </div>

      {homeBanners?.length > 0 &&
        homeBanners.map((banner: { id?: number }, index: number) => (
          <Bannar key={banner.id ?? index} banner={banner} />
        ))}
    </div>
  );
}
