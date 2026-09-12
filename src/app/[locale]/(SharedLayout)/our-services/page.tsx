import initTranslations from "@/app/i18n";
import { AnimatedServicesSection } from "@/components/Services";
import { Bannar } from "../(homepage)/_components";
import { createMetadata } from "@/lib/seo";
import { getCachedServices, getCachedSettings } from "@/lib/cached-api";
import { slimBanner, slimServiceForList } from "@/lib/public-payload";
import { HeroBreadcrumb } from "@/components/Shared/HeroBreadcrumb";
import { localePath } from "@/lib/offers";
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const { t } = await initTranslations(locale, ["homepage"]);
  const settings = await getCachedSettings(locale);
  const seo = settings?.data[0]?.setting?.seo?.["services"];

  return createMetadata(seo, locale, "/our-services", {
    title: "Home Healers | Services",
    description: "Discover our medical and therapeutic services",
  });
}

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const { t } = await initTranslations(locale, ["common"]);
  const [servicesData, settings] = await Promise.all([
    getCachedServices(locale),
    getCachedSettings(locale),
  ]);

  const homeBanners = settings?.data?.[0]?.setting?.banners?.filter(
    (b: any) => b.page === "services"
  );

  return (
    <div className="main-container w-full  bg-[#fff] relative overflow-hidden mx-auto my-0">
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
          {/* Top Right Decorative Icons */}
          <div className="absolute top-[19.2%] left-[70.76%] w-[2.01%] h-[56.4%]">
            <div
              className="w-[29px] h-[29px] bg-no-repeat bg-cover"
              style={{
                backgroundImage:
                  "url(/assets/images/shared/hero-banner/hero-deco-1.svg)",
              }}
            />
            <div
              className="w-[29px] h-[29px] mt-[83px] bg-no-repeat bg-cover"
              style={{
                backgroundImage:
                  "url(/assets/images/shared/hero-banner/hero-deco-2.svg)",
              }}
            />
          </div>

          {/* Center Content */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
            <h1 className="text-white text-[24px] font-semibold leading-[32px]">
              {t("services.hero.title", { ns: "common" })}
            </h1>
            <HeroBreadcrumb
              items={[
                {
                  label: t("services.hero.home", { ns: "common" }),
                  href: localePath(locale, "/"),
                },
                {
                  label: t("services.hero.breadcrumb", { ns: "common" }),
                  isActive: true,
                },
              ]}
            />
          </div>

          {/* Decorative Elements */}
          <div
            className="absolute top-[34%] left-[14.44%] w-[2.01%] h-[11.6%] bg-no-repeat bg-cover"
            style={{
              backgroundImage:
                "url(/assets/images/shared/hero-banner/hero-deco-3.svg)",
            }}
          />
          <div
            className="absolute top-[41.6%] left-[93.13%] w-[2.01%] h-[11.6%] bg-no-repeat bg-cover"
            style={{
              backgroundImage:
                "url(/assets/images/shared/hero-banner/hero-deco-4.svg)",
            }}
          />
          <div
            className="absolute top-[62.8%] left-[6.88%] w-[1.67%] h-[9.6%] bg-no-repeat bg-cover"
            style={{
              backgroundImage:
                "url(/assets/images/shared/hero-banner/hero-deco-5.svg)",
            }}
          />
        </div>
      </div>

      {/* Services Section */}
      <AnimatedServicesSection
        data={(servicesData?.data || []).map((service: any, index: number) =>
          slimServiceForList(service, { includeFullDescription: index === 0 }),
        )}
        locale={locale}
      />

      {/* Optional Banners */}
      {homeBanners?.length > 0 &&
        homeBanners.map((banner: any, i: number) => (
          <Bannar key={i} banner={slimBanner(banner)} />
        ))}
    </div>
  );
}
