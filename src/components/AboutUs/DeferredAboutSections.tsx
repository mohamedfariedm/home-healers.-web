"use client";

import nextDynamic from "next/dynamic";

const DoctorsSection = nextDynamic(
  () => import("@/components/AboutUs/DoctorsSection"),
  { ssr: false, loading: () => null },
);
const FaqSection = nextDynamic(
  () => import("@/components/AboutUs/FaqSection"),
  { ssr: false, loading: () => null },
);
const PartnersSection = nextDynamic(
  () => import("@/components/AboutUs/PartnersSection"),
  { ssr: false, loading: () => null },
);

export function DeferredDoctorsSection(props: any) {
  return <DoctorsSection {...props} />;
}

export function DeferredFaqSection(props: any) {
  return <FaqSection {...props} />;
}

export function DeferredPartnersSection(props: any) {
  return <PartnersSection {...props} />;
}
