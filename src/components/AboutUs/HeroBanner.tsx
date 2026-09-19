import React from "react";
import PageHero from "@/components/Shared/PageHero";
import type { HeroBreadcrumbItem } from "@/components/Shared/HeroBreadcrumb";

interface HeroBannerProps {
  title: string;
  breadcrumbItems: HeroBreadcrumbItem[];
}

const HeroBanner: React.FC<HeroBannerProps> = ({ title, breadcrumbItems }) => {
  return <PageHero title={title} breadcrumbItems={breadcrumbItems} />;
};

export default HeroBanner;
