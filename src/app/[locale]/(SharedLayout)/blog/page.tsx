import initTranslations from "@/app/i18n";
import { BlogAnimationSection } from "@/components/Blog";
import { Bannar } from "../(homepage)/_components";
import { createMetadata } from "@/lib/seo";
import { getCachedBlogs, getCachedSettings } from "@/lib/cached-api";
import { slimBanner } from "@/lib/public-payload";
import { PageHero } from "@/components/Shared/PageHero";
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
      <div className="page-shell bg-white">
        <PageHero
          title={t("hero.title")}
          breadcrumbItems={[
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
