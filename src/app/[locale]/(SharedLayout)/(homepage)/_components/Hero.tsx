import { cn } from "@/lib/utils";
import { TFunction } from "i18next";
import Link from "next/link";

const Dot = ({ className = "", image = "" }: { className?: string; image?: string }) => (
  <div
    className={cn("w-4 h-4 rounded-full absolute bg-cover bg-no-repeat", className)}
    style={{ backgroundImage: image ? `url(${image})` : undefined }}
  />
);

const Hero = ({ t, homeData }: { t: TFunction; homeData: any }) => {
  return (
    <div className="w-full xl:max-w-[1280px] relative overflow-hidden mx-auto pb-8 px-4 lg:px-0">
      {/* Slider dots (hidden on mobile) */}
      <div className="hidden xl:flex gap-6 items-center absolute bottom-0 left-[355px]">
        <div className="w-2.5 h-2.5 bg-[#cee2fc] rounded-full" />
        <div className="w-2.5 h-2.5 bg-[#cee2fc] rounded-full" />
        <div
          className="w-2.5 h-2.5 bg-cover bg-no-repeat rounded-full"
          style={{ backgroundImage: "url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-05/FVk8PDuEGs.png)" }}
        />
      </div>

      {/* Layout */}
      <div className="flex relative flex-col-reverse xl:flex-row gap-10 items-center">
        {/* Text Content */}
          <div className="absolute top-20 right-0 left-[50px] bottom-0 bg-[url(/assets/images/homehellers/dots.svg)] -z-0"></div>
        <div className="relative w-full xl:w-1/2 flex flex-col gap-8 justify-center   bg-no-repeat bg-contain ">
          {/* Heading */}
          <div className="text-[#1e1e1e] text-2xl sm:text-3xl lg:text-4xl font-semibold leading-snug text-start xl:text-right relative z-10">
            خدمات <span className="text-[#62a0f6]">العلاج الطبيعي</span> والتأهيل الطبي المنزلي
          </div>

          {/* Description */}
          <div className="text-[#1e1e1e] text-base sm:text-lg leading-relaxed text-start xl:text-right">
            تطبيق وموقع إلكتروني متخصص في تقديم خدمات العلاج الطبيعي والتأهيل الطبي للعملاء في منازلهم، عبر أخصائيين مؤهلين وذوي كفاءة عالية
          </div>

          {/* Badge Row */}
          <div className="flex flex-col sm:flex-row gap-4 items-start relative z-10">
            <div className="w-[200px] h-[56px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-05/0E9HyRbA6y.png)] bg-cover bg-no-repeat" />
            <div className="flex flex-col gap-1">
              <span className="text-sm sm:text-base font-semibold text-[#1e1e1e] whitespace-nowrap">
                تقييم المرضي
              </span>
              <div className="h-5 w-full bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-05/t9frAmWHWK.png)] bg-cover bg-no-repeat" />
            </div>
          </div>

          {/* Call to Action */}
          <Link href="#booking">
            <div className="flex items-center gap-3 px-5 py-3 bg-[#143087] rounded-md w-fit hover:bg-[#0f245f] transition z-10 relative">
              <span className="text-white text-base sm:text-lg font-medium">احجز جلستك الان</span>
              <div className="w-6 h-6 bg-[url('https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-05/N8cpS2Xby9.png')] bg-cover bg-no-repeat" />
            </div>
          </Link>
        </div>

        {/* Image */}
        <div className="w-full xl:w-auto relative z-10">
        <div className="xl:w-[727px] h-[624px] bg-[url(/assets/images/homehellers/hero.svg)] bg-cover bg-center xl:bg-contain bg-no-repeat  " />
        </div>
      </div>
    </div>
  );
};

export default Hero;
