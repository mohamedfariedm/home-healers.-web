import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { Star, ArrowLeft } from "lucide-react";

const HeroCarousel = dynamic(() => import("./HeroCarousel"));

const HERO_IMAGE_QUALITY = 90;

function Hero({ locale, section }: { locale: string; section: any }) {
  const post = section?.Posts?.[0];
  const heroImages =
    post?.attachment?.map((att: { original: string }) => att.original) ||
    ["/assets/images/homehellers/hero.svg"];
  const alt =
    post?.title || "Physical therapy and rehabilitation services";
  const bookingHref = `${locale === "ar" ? "" : "/en"}/booking`;

  return (
    <div className="w-full xl:max-w-[1280px] relative mx-auto pb-8 px-4 lg:px-0">
      <div className="flex relative flex-col-reverse xl:flex-row gap-10 items-center">
        <div
          className="absolute top-20 right-0 left-[50px] bottom-0 bg-[url(/assets/images/homehellers/dots.svg)] bg-contain -z-0"
          aria-hidden
        />

        <div className="relative w-full xl:w-1/2 flex flex-col gap-8 justify-center bg-no-repeat bg-contain">
          <h2 className="text-[#1e1e1e] text-2xl sm:text-3xl lg:text-4xl font-semibold leading-snug text-start relative z-10">
            {post?.title ||
              "Physical Therapy and Rehabilitation Services"}
          </h2>

          <p className="text-[#1e1e1e] text-base sm:text-lg leading-relaxed text-start">
            {post?.description ||
              "A specialized application and website providing in-home physical therapy and medical rehabilitation services through highly qualified specialists."}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 items-center relative z-10">
            <div
              className="w-[200px] h-[56px] bg-[url(/assets/images/homehellers/rating.svg)] bg-cover bg-no-repeat"
              aria-hidden
            />
            <div className="flex flex-col gap-1">
              <span className="text-sm sm:text-base font-semibold text-[#1e1e1e] whitespace-nowrap">
                {locale === "ar" ? "تقيم المرضي" : "Patient Rating"}
              </span>
              <div className="flex gap-1 items-center" aria-hidden>
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 text-yellow-400 fill-yellow-400"
                  />
                ))}
              </div>
            </div>
          </div>

          <Link className="rounded-md w-fit" href={bookingHref}>
            <span className="flex items-center gap-3 px-5 py-3 bg-[#143087] rounded-2xl w-fit hover:bg-[#0f245f] transition z-10 relative text-white text-base sm:text-lg font-medium">
              {locale === "ar" ? "احجز جلستك الان" : " Book Your Session Now"}
              <ArrowLeft className="w-6 h-6 text-white" />
            </span>
          </Link>
        </div>

        <div className="w-full xl:w-auto z-10 max-w-[727px]">
          {heroImages.length > 1 ? (
            <HeroCarousel
              images={heroImages}
              alt={alt}
              quality={HERO_IMAGE_QUALITY}
            />
          ) : (
            <div className="w-full max-w-[727px] h-[624px]">
              <div className="relative w-full h-full xl:w-[727px] xl:mx-0 mx-auto">
                <Image
                  src={heroImages[0]}
                  alt={alt}
                  fill
                  priority
                  quality={HERO_IMAGE_QUALITY}
                  sizes="(max-width: 768px) 100vw, 727px"
                  className="object-cover object-center"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Hero;
