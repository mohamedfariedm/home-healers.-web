import Link from "next/link";
import Image from "next/image";
import { Star, ArrowLeft } from "lucide-react";
import { getHeroImageUrls } from "@/lib/image-url";
import HeroCarousel from "./HeroCarousel";

const HERO_IMAGE_QUALITY = 90;

function Hero({ locale, section }: { locale: string; section: any }) {
  const post = section?.Posts?.[0];
  const heroImages = getHeroImageUrls(post?.attachment);
  const alt =
    post?.title || "Physical therapy and rehabilitation services";
  const bookingHref = `${locale === "ar" ? "" : "/en"}/booking`;

  return (
    <div className="relative mx-auto w-full max-w-7xl px-4 pb-8 sm:px-6 md:pb-12 lg:px-8">
      <div className="relative flex flex-col-reverse items-center gap-8 xl:flex-row xl:gap-12">
        <div
          className="pointer-events-none absolute top-16 right-0 left-8 bottom-0 -z-0 hidden bg-[url(/assets/images/homehellers/dots.svg)] bg-contain opacity-60 sm:block"
          aria-hidden
        />

        <div className="relative flex w-full flex-col justify-center gap-6 bg-contain bg-no-repeat xl:w-1/2 xl:gap-8">
          <h1 className="relative z-10 text-start text-2xl font-semibold leading-snug text-[#1e1e1e] sm:text-3xl lg:text-4xl lg:leading-tight">
            {post?.title ||
              "Physical Therapy and Rehabilitation Services"}
          </h1>

          <p className="max-w-xl text-start text-base leading-relaxed text-[#475467] sm:text-lg">
            {post?.description ||
              "A specialized application and website providing in-home physical therapy and medical rehabilitation services through highly qualified specialists."}
          </p>

          <div className="relative z-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <div
              className="h-[56px] w-[200px] bg-[url(/assets/images/homehellers/rating.svg)] bg-cover bg-no-repeat"
              aria-hidden
            />
            <div className="flex flex-col gap-1">
              <span className="whitespace-nowrap text-sm font-semibold text-[#1e1e1e] sm:text-base">
                {locale === "ar" ? "تقيم المرضي" : "Patient Rating"}
              </span>
              <div className="flex items-center gap-1" aria-hidden>
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-5 w-5 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>
            </div>
          </div>

          <Link className="w-fit rounded-2xl" href={bookingHref}>
            <span className="relative z-10 flex w-fit items-center gap-3 rounded-2xl bg-[#143087] px-5 py-3 text-base font-semibold text-white shadow-[0_12px_28px_rgba(20,48,135,0.28)] transition hover:bg-[#0f245f] sm:text-lg">
              {locale === "ar" ? "احجز جلستك الان" : " Book Your Session Now"}
              <ArrowLeft className="h-6 w-6 text-white" />
            </span>
          </Link>
        </div>

        <div className="z-10 w-full max-w-[727px] xl:w-auto">
          <div className="relative mx-auto h-[280px] w-full overflow-hidden rounded-3xl bg-[#eef4ff] shadow-[0_18px_50px_rgba(20,48,135,0.14)] xs:h-[340px] sm:h-[420px] md:h-[480px] xl:mx-0 xl:h-[560px] xl:w-[640px] 2xl:h-[600px] 2xl:w-[720px]">
            <Image
              src={heroImages[0]}
              alt={alt}
              fill
              priority
              quality={HERO_IMAGE_QUALITY}
              sizes="(max-width: 768px) 100vw, 727px"
              className="object-cover object-center"
            />
            {heroImages.length > 1 ? (
              <div className="absolute inset-0">
                <HeroCarousel
                  images={heroImages}
                  alt={alt}
                  quality={HERO_IMAGE_QUALITY}
                />
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hero;
