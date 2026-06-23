import initTranslations from "@/app/i18n";
import React from "react";
import ContactSection from "./_components/ContactForm";
import MapComponent from "./_components/MapComponent";
import ClientAPI from "@/app/api/api";
import { Bannar } from "../(homepage)/_components";
import { createMetadata } from "@/lib/seo";
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const { t } = await initTranslations(locale, ["homepage"]);
  const settings = await ClientAPI.getSettings(locale);
  const seo = settings?.data[0]?.setting?.seo["contact"];

  return createMetadata(seo, locale, "/contact", {
    title: "Home Hellers",
  });
}

async function page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const { t } = await initTranslations(locale, ["contactUs"]);
  const settings = await ClientAPI.getSettings(locale);

  const homeBanners = settings?.data?.[0]?.setting?.banners?.filter(
    (banner: any) => banner.page === "contact"&& banner.type === "web"
  );
  return (
    <>
      <div className="main-container w-full bg-white relative overflow-hidden mx-auto">
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
                {t("hero.title")}
              </h1>
              <div className="mt-2 flex justify-center items-center gap-2">
                <span className="text-[#62a0f6] text-sm font-semibold">
                  {t("hero.breadcrumb")}
                </span>
                <div
                  className="w-4 h-4 bg-no-repeat bg-cover"
                  style={{
                    backgroundImage:
                      "url(/assets/images/shared/hero-banner/hero-breadcrumb-arrow.svg)",
                  }}
                />
                <span className="text-white text-sm font-semibold">
                  {t("hero.home")}
                </span>
              </div>
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
        <ContactSection settings={settings} />
        <MapComponent />
        {homeBanners?.length > 0 &&
          homeBanners.map((banner: any, index: number) => (
            <Bannar key={index} banner={banner} />
          ))}
      </div>
    </>
  );
}

export default page;
