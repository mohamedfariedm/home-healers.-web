import { cn } from "@/lib/utils";
import {
  HeroBreadcrumb,
  type HeroBreadcrumbItem,
} from "./HeroBreadcrumb";

type PageHeroProps = {
  title: string;
  breadcrumbItems: HeroBreadcrumbItem[];
  titleAs?: "h1" | "p";
  className?: string;
};

const HERO_BG = "/assets/images/shared/hero-banner/hero-bg-main.webp";
const HERO_LAYER = "/assets/images/shared/hero-banner/hero-layer-2.webp";

export function PageHero({
  title,
  breadcrumbItems,
  titleAs = "h1",
  className,
}: PageHeroProps) {
  const Title = titleAs;

  return (
    <section
      className={cn("page-hero", className)}
      aria-label={title}
      style={{ position: "relative", minHeight: 200 }}
    >
      {/* Static WebP + fetchPriority — same assets, no optimizer round-trip on LCP */}
      <div className="page-hero__bg" aria-hidden>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={HERO_BG}
          alt=""
          width={1920}
          height={600}
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
      </div>
      <div className="page-hero__layer" aria-hidden>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={HERO_LAYER}
          alt=""
          width={1920}
          height={600}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
      </div>
      <div className="page-hero__glow" aria-hidden />
      <div className="page-hero__content">
        <Title className="page-hero__title">{title}</Title>
        <HeroBreadcrumb items={breadcrumbItems} />
      </div>
    </section>
  );
}

export default PageHero;
