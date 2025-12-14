import ClientAPI from "@/app/api/api";
import initTranslations from "@/app/i18n";
import { AnimatedServicesSection } from "@/components/Services";
import { Bannar } from "../../(homepage)/_components";
export const dynamic = "force-dynamic";

type props = {
  params: { locale: string; slug: string };
};

export async function generateMetadata({
  params: { locale, slug },
}: {
  params: { locale: string; slug: string };
}) {
  const { t } = await initTranslations(locale, ["homepage"]);

  // Global SEO fallback
  const settings = await ClientAPI.getSettings(locale);
  const globalSeo = settings?.data?.[0]?.setting?.seo?.["services"];

  // Try to fetch single service data for custom meta info
  let serviceData: any = null;
  try {
    const res = await ClientAPI.getAllServicesSlug(locale, slug);
    serviceData = res?.data ?? null;
  } catch (err) {
    console.warn("Failed to fetch service slug data:", err);
  }

  const title =
    serviceData?.meta_title?.[locale] ||
    globalSeo?.title ||
    serviceData?.name?.[locale] ||
    "Home Healers";

  const description =
    serviceData?.meta_description?.[locale] ||
    globalSeo?.description ||
    "Home Healers app";

  const image =
    serviceData?.image?.[0]?.original ||
    globalSeo?.og_image ||
    "/assets/images/favicon.ico";

  return {
    title,
    description,
    keywords:
      globalSeo?.keywords || "Home Healers, services, healthcare, clinics",
    alternates: {
      canonical: `https://home-healers.com/${
        locale === "ar" ? "" : "en"
      }/our-services/${slug}`,
    },
    icons: { icon: "/assets/images/favicon.ico" },
    openGraph: {
      title,
      description,
      url: `https://home-healers.com/${
        locale === "ar" ? "" : "en"
      }/our-services/${slug}`,
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

async function page({ params: { locale, slug } }: props) {
  const { t } = await initTranslations(locale, ["common"]);
  const servicesData = await ClientAPI.getAllServices(locale);

  const settings = await ClientAPI.getSettings(locale);
  console.log("servicesData", servicesData);

  console.log("slug", slug);
  // Try to fetch single service data for custom meta info
  let serviceData: any = null;
  try {
    const res = await ClientAPI.getAllServicesSlug(locale, slug);
    serviceData = res?.data ?? null;
  } catch (err) {
    console.warn("Failed to fetch service slug data:", err);
  }

  const title =
    serviceData?.meta_title?.[locale] ||
    serviceData?.name?.[locale] ||
    "Home Healers";
  const homeBanners = settings?.data?.[0]?.setting?.banners?.filter(
    (banner: any) => banner.page === "services"
  );

  return (
    <>
      <div className="main-container w-full  bg-[#fff] relative overflow-hidden mx-auto my-0">
        <h1 className="absolute text-4xl font-bold text-center mb-4 -z-50">
          {title}
        </h1>

        <div
          className="w-full h-[250px] relative bg-no-repeat bg-cover bg-center"
          style={{
            backgroundImage:
              "url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-18/DFhQezQ5hS.png)",
          }}
        >
          <div
            className="absolute inset-0 w-full h-full bg-no-repeat bg-cover"
            style={{
              backgroundImage:
                "url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-18/0owx2TM42T.png)",
            }}
          >
            {/* Top Right Decorative Icons */}
            <div className="absolute top-[19.2%] left-[70.76%] w-[2.01%] h-[56.4%]">
              <div
                className="w-[29px] h-[29px] bg-no-repeat bg-cover"
                style={{
                  backgroundImage:
                    "url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-18/4QUzxCKOhU.png)",
                }}
              />
              <div
                className="w-[29px] h-[29px] mt-[83px] bg-no-repeat bg-cover"
                style={{
                  backgroundImage:
                    "url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-18/803XMdkNFA.png)",
                }}
              />
            </div>

            {/* Center Content */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
              <div className="text-white text-[24px] font-semibold leading-[32px]">
                {t("services.hero.title", { ns: "common" })}
              </div>
              <div className="mt-2 flex justify-center items-center gap-2">
                <span className="text-[#62a0f6] text-sm font-semibold">
                  {t("services.hero.breadcrumb", { ns: "common" })}
                </span>
                <div
                  className="w-4 h-4 bg-no-repeat bg-cover"
                  style={{
                    backgroundImage:
                      "url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-18/5HzeZiBmtr.png)",
                  }}
                />
                <span className="text-white text-sm font-semibold">
                  {t("services.hero.home", { ns: "common" })}
                </span>
              </div>
            </div>

            {/* Decorative Elements */}
            <div
              className="absolute top-[34%] left-[14.44%] w-[2.01%] h-[11.6%] bg-no-repeat bg-cover"
              style={{
                backgroundImage:
                  "url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-18/e0Abrtvom6.png)",
              }}
            />
            <div
              className="absolute top-[41.6%] left-[93.13%] w-[2.01%] h-[11.6%] bg-no-repeat bg-cover"
              style={{
                backgroundImage:
                  "url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-18/1XdOKqGhLn.png)",
              }}
            />
            <div
              className="absolute top-[62.8%] left-[6.88%] w-[1.67%] h-[9.6%] bg-no-repeat bg-cover"
              style={{
                backgroundImage:
                  "url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-18/3yY0wTn197.png)",
              }}
            />
          </div>
        </div>

        <AnimatedServicesSection data={servicesData?.data} locale={locale} />

        {homeBanners?.length > 0 &&
          homeBanners.map((banner: any, index: number) => (
            <Bannar key={index} banner={banner} />
          ))}
      </div>
    </>
  );
}

export default page;
