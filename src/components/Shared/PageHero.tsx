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
    >
      <div className="page-hero__bg" aria-hidden />
      <div className="page-hero__layer" aria-hidden />
      <div className="page-hero__glow" aria-hidden />
      <div className="page-hero__content">
        <Title className="page-hero__title">{title}</Title>
        <HeroBreadcrumb items={breadcrumbItems} />
      </div>
    </section>
  );
}

export default PageHero;
