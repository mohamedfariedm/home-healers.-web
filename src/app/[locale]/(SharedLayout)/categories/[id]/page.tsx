import ClientAPI from "@/app/api/api";
import initTranslations from "@/app/i18n";
import { CategoryServicesSection } from "@/components/Categories";
import { Bannar } from "../../(homepage)/_components";
import { createMetadata } from "@/lib/seo";
import { notFound } from "next/navigation";
import type { Category } from "@/types/booking";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const categoriesData = await ClientAPI.getCategories(locale);
  const category = categoriesData?.data?.find(
    (c: Category) => String(c.id) === id,
  );

  return createMetadata(null, locale, `/categories/${id}`, {
    title: category?.name
      ? `${category.name} | Home Hellers`
      : "Home Hellers | Category",
    description: category?.name
      ? `Services in ${category.name}`
      : "Category details",
  });
}

export default async function CategoryDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const { t } = await initTranslations(locale, ["common"]);
  const categoriesData = await ClientAPI.getCategories(locale);

  console.log(
    "[Category Detail API Response]",
    JSON.stringify(categoriesData, null, 2),
  );

  const category = categoriesData?.data?.find(
    (c: Category) => String(c.id) === id,
  );

  if (!category) {
    notFound();
  }

  console.log(
    `[Category Detail - ID ${id}]`,
    JSON.stringify(category, null, 2),
  );

  const settings = await ClientAPI.getSettings(locale);
  const homeBanners = settings?.data?.[0]?.setting?.banners?.filter(
    (b: { page: string }) => b.page === "categories",
  );
  const prefix = locale === "ar" ? "" : "/en";

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
              {category.name}
            </div>
            <div className="mt-2 flex justify-center items-center gap-2 flex-wrap">
              <span className="text-[#62a0f6] text-sm font-semibold">
                {category.name}
              </span>
              <div
                className="w-4 h-4 bg-no-repeat bg-cover"
                style={{
                  backgroundImage:
                    "url(/assets/images/shared/hero-banner/hero-breadcrumb-arrow.svg)",
                }}
              />
              <a
                href={`${prefix}/categories`}
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
                href={prefix || "/"}
                className="text-white text-sm font-semibold hover:underline"
              >
                {t("categories.hero.home", { ns: "common" })}
              </a>
            </div>
          </div>
        </div>
      </div>

      <CategoryServicesSection locale={locale} category={category} />

      {homeBanners?.length > 0 &&
        homeBanners.map((banner: { id?: number }, index: number) => (
          <Bannar key={banner.id ?? index} banner={banner} />
        ))}
    </div>
  );
}
