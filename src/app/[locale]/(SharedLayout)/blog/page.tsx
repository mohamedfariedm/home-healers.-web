import initTranslations from "@/app/i18n";
import { BlogAnimationSection } from "@/components/Blog";
import { Bannar } from "../(homepage)/_components";
import { createMetadata } from "@/lib/seo";
import { getCachedBlogs, getCachedSettings } from "@/lib/cached-api";
import { slimBanner } from "@/lib/public-payload";
import { HeroBreadcrumb } from "@/components/Shared/HeroBreadcrumb";
import { localePath } from "@/lib/offers";
export const dynamic = "force-dynamic";

type props = {
  params: { locale: string };
  searchParams: {
    page: string | undefined;
    tag: string | undefined;
    sort: string | undefined;
  };
};

interface ArticleData {
  name: string;
  description: string;
  url: string;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const settings = await getCachedSettings(locale);
  const seo = settings?.data[0]?.setting?.seo["blogs"];

  return createMetadata(seo, locale, "/blog", {
    title: "Home Healers | Blog",
    description: "Health articles and physiotherapy tips from Home Healers",
  });
}
async function page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const { t } = await initTranslations(locale, ["blog"]);
  const [{ data }, settings] = await Promise.all([
    getCachedBlogs(locale).catch(() => ({ data: [] })),
    getCachedSettings(locale),
  ]);

  const homeBanners = settings?.data?.[0]?.setting?.banners?.filter(
    (banner: any) => banner.page === "blogs"&& banner.type === "web"
  );

  return (
    <>
      <div className="main-container relative mx-auto my-0 w-full overflow-x-hidden bg-[#fff]">
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
              <h1 className="text-xl font-semibold leading-8 text-white sm:text-[24px]">
                {t("hero.title")}
              </h1>
              <HeroBreadcrumb
                items={[
                  {
                    label: t("hero.home"),
                    href: localePath(locale, "/"),
                  },
                  {
                    label: t("hero.breadcrumb"),
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

        <BlogAnimationSection
          data={data || []}
          locale={locale}
        />

        {homeBanners?.length > 0 &&
          homeBanners.map((banner: any, index: number) => (
            <Bannar key={index} banner={slimBanner(banner)} />
          ))}
      </div>
    </>
  );
}

export default page;
