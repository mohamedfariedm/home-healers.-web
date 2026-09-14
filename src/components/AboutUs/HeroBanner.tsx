import React from "react";
import {
  HeroBreadcrumb,
  type HeroBreadcrumbItem,
} from "@/components/Shared/HeroBreadcrumb";

interface HeroBannerProps {
  title: string;
  breadcrumbItems: HeroBreadcrumbItem[];
}

const HeroBanner: React.FC<HeroBannerProps> = ({ title, breadcrumbItems }) => {
  return (
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
            {title}
          </h1>
          <HeroBreadcrumb items={breadcrumbItems} />
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
  );
};

export default HeroBanner;
