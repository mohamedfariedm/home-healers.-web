import { FeatureCard } from "@/components/Cards";
import { Heading, PreHeading, SubHeading } from "@/components/Main";
import { featuresList } from "@/constants";
import { cn } from "@/lib/utils";
import { TFunction } from "i18next";
import React from "react";

function Features({ t, className }: { t: TFunction; className?: string }) {
  const features = featuresList(t);
  return (
    <section className={cn("w-full ", className)}>
      <div className="w-full lg:w-4/6 mb-6 md:mb-24 mx-auto">
        <PreHeading>{t("features.PreHeading")}</PreHeading>
        <Heading className="mt-3 mb-5">{t("features.Heading")}</Heading>
        <SubHeading className="">{t("features.SubHeading")}</SubHeading>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-11 gap-x-5 gap-y-6">
        {features.map((feature, index) => (
          <FeatureCard
            key={index}
            feature={feature}
            index={index}
            className={cn(
              " ",
              index % 4 === 0 || index % 4 === 3
                ? "lg:col-span-6"
                : "lg:col-span-5"
            )}
          />
        ))}
      </div>
    </section>
  );
}

export default Features;
