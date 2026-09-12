import initTranslations from "@/app/i18n";
import { CategoryServicesSection } from "@/components/Categories";
import { Bannar } from "../../../(homepage)/_components";
import { slimBanner, slimCategoryForServicePage } from "@/lib/public-payload";
import {
  buildCanonicalUrl,
  buildCategoryServiceAlternates,
  createMetadata,
} from "@/lib/seo";
import {
  createBreadcrumbSchema,
  createServiceSchema,
  renderJsonLd,
} from "@/lib/structured-data";
import {
  getCachedCategory,
  getCachedServiceBySlug,
  getCachedSettings,
} from "@/lib/cached-api";
import { HeroBreadcrumb } from "@/components/Shared/HeroBreadcrumb";
import { localePath } from "@/lib/offers";
import {
  categoryHref,
  getActiveServices,
  getCategorySlug,
  getServiceSlug,
  isActiveRecord,
  serviceHref,
  unwrapDetail,
} from "@/lib/slugs";
import { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import type { Category, Service } from "@/types/booking";

export const dynamic = "force-dynamic";

async function loadCategoryService(
  locale: string,
  categoryKey: string,
  serviceKey: string,
) {
  const decodedCategory = decodeURIComponent(categoryKey);
  const decodedService = decodeURIComponent(serviceKey);

  const [categoryRes, serviceRes] = await Promise.all([
    getCachedCategory(locale, decodedCategory),
    getCachedServiceBySlug(locale, decodedService),
  ]);

  const category = unwrapDetail<Category>(categoryRes);
  const service = unwrapDetail<Service>(serviceRes);

  if (!category || !isActiveRecord(category)) return null;
  if (!service || !isActiveRecord(service)) return null;

  const activeServices = getActiveServices(category.services);
  const belongsToCategory =
    (service.category?.id != null && service.category.id === category.id) ||
    getCategorySlug(service.category, locale) ===
      getCategorySlug(category, locale) ||
    activeServices.some(
      (item) =>
        getServiceSlug(item, locale) === getServiceSlug(service, locale),
    );

  if (!belongsToCategory) return null;

  return {
    category: { ...category, services: activeServices },
    service,
    requestedCategory: decodedCategory,
    requestedService: decodedService,
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string; serviceSlug: string }>;
}): Promise<Metadata> {
  const { locale, slug, serviceSlug } = await params;
  const fallbackPath = `/categories/${slug}/${serviceSlug}`;

  try {
    const loaded = await loadCategoryService(locale, slug, serviceSlug);
    if (!loaded) {
      return createMetadata(
        null,
        locale,
        fallbackPath,
        { title: "Home Healers" },
        { preferPathCanonical: true },
      );
    }

    const categorySlug =
      getCategorySlug(loaded.category, locale) || loaded.requestedCategory;
    const localizedServiceSlug =
      getServiceSlug(loaded.service, locale) || loaded.requestedService;
    const path = `/categories/${encodeURIComponent(categorySlug)}/${encodeURIComponent(localizedServiceSlug)}`;
    const canonical = buildCanonicalUrl(locale, path);

    const title =
      (typeof loaded.service.meta_title === "object"
        ? loaded.service.meta_title?.[locale]
        : loaded.service.meta_title) ||
      loaded.service.name ||
      loaded.category.name ||
      "Home Healers";

    const description =
      (typeof loaded.service.meta_description === "object"
        ? loaded.service.meta_description?.[locale]
        : loaded.service.meta_description) ||
      (typeof loaded.service.description === "string"
        ? loaded.service.description.replace(/<[^>]+>/g, "").slice(0, 160)
        : "") ||
      `Services in ${loaded.category.name}`;

    const image =
      loaded.service.image?.[0]?.original || "/assets/images/favicon.ico";

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
        languages: buildCategoryServiceAlternates(
          loaded.category.slug,
          loaded.service.slug,
          localizedServiceSlug,
          categorySlug,
        ),
      },
      openGraph: {
        ...baseMeta.openGraph,
        title,
        description,
        url: canonical,
        images: [{ url: image }],
      },
      twitter: {
        ...baseMeta.twitter,
        title,
        description,
        images: [image],
      },
    };
  } catch (error) {
    console.error("Error generating category service metadata:", error);
    return createMetadata(
      null,
      locale,
      fallbackPath,
      { title: "Home Healers" },
      { preferPathCanonical: true },
    );
  }
}

export default async function CategoryServicePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string; serviceSlug: string }>;
}) {
  const { locale, slug, serviceSlug } = await params;
  const { t } = await initTranslations(locale, ["common"]);
  const loaded = await loadCategoryService(locale, slug, serviceSlug);

  if (!loaded) {
    notFound();
  }

  const categorySlug = getCategorySlug(loaded.category, locale);
  const canonicalServiceSlug = getServiceSlug(loaded.service, locale);
  const nestedCategorySlug = getCategorySlug(loaded.service.category, locale);

  if (nestedCategorySlug && categorySlug && nestedCategorySlug !== categorySlug) {
    permanentRedirect(
      serviceHref(locale, nestedCategorySlug, canonicalServiceSlug),
    );
  }

  if (
    (categorySlug && categorySlug !== loaded.requestedCategory) ||
    (canonicalServiceSlug && canonicalServiceSlug !== loaded.requestedService)
  ) {
    permanentRedirect(
      serviceHref(
        locale,
        categorySlug || loaded.requestedCategory,
        canonicalServiceSlug || loaded.requestedService,
      ),
    );
  }

  const settings = await getCachedSettings(locale);
  const homeBanners = settings?.data?.[0]?.setting?.banners?.filter(
    (b: { page: string }) => b.page === "categories",
  );

  const serviceName = loaded.service.name || loaded.category.name || "Home Healers";
  const serviceDescription =
    (typeof loaded.service.meta_description === "object"
      ? loaded.service.meta_description?.[locale]
      : loaded.service.meta_description) ||
    (typeof loaded.service.description === "string"
      ? loaded.service.description.replace(/<[^>]+>/g, "").slice(0, 160)
      : `Services in ${loaded.category.name}`);
  const serviceUrl = buildCanonicalUrl(
    locale,
    `/categories/${encodeURIComponent(categorySlug || loaded.requestedCategory)}/${encodeURIComponent(canonicalServiceSlug || loaded.requestedService)}`,
  );

  return (
    <div className="main-container w-full bg-[#fff] relative overflow-hidden mx-auto my-0 pb-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: renderJsonLd(
            createServiceSchema({
              name: serviceName,
              description: String(serviceDescription || serviceName),
              provider: {
                name: "Home Healers",
                url: "https://home-healers.com",
              },
              areaServed: "Saudi Arabia",
              serviceType: loaded.category.name,
            }),
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: renderJsonLd(
            createBreadcrumbSchema([
              { name: "Home", url: buildCanonicalUrl(locale, "") },
              {
                name: loaded.category.name || "Categories",
                url: buildCanonicalUrl(
                  locale,
                  `/categories/${encodeURIComponent(categorySlug || loaded.requestedCategory)}`,
                ),
              },
              { name: serviceName, url: serviceUrl },
            ]),
          ),
        }}
      />
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
            <h1 className="text-white text-[24px] font-semibold leading-[32px]">
              {loaded.service.name || loaded.category.name}
            </h1>
            <HeroBreadcrumb
              items={[
                {
                  label: t("categories.hero.home", { ns: "common" }),
                  href: localePath(locale, "/"),
                },
                {
                  label: t("categories.hero.breadcrumb", { ns: "common" }),
                  href: localePath(locale, "/categories"),
                },
                {
                  label: loaded.category.name,
                  href: categoryHref(
                    locale,
                    categorySlug || loaded.requestedCategory,
                  ),
                },
                {
                  label: loaded.service.name || loaded.category.name,
                  isActive: true,
                },
              ]}
            />
          </div>
        </div>
      </div>

      <CategoryServicesSection
        locale={locale}
        category={slimCategoryForServicePage(
          loaded.category,
          canonicalServiceSlug || loaded.requestedService,
          locale,
        )}
        activeServiceSlug={canonicalServiceSlug || loaded.requestedService}
      />

      {homeBanners?.length > 0 &&
        homeBanners.map((banner: { id?: number }, index: number) => (
          <Bannar key={banner.id ?? index} banner={slimBanner(banner)} />
        ))}
    </div>
  );
}
