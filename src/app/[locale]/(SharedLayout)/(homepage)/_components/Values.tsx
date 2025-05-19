import { ValueCard } from "@/components/Cards";
import { Heading, PreHeading, SubHeading } from "@/components/Main";
import { Button } from "@/components/ui/button";
import { valuesList } from "@/constants/with-elements";
import { TFunction } from "i18next";
import Link from "next/link";
import React from "react";

function Values({ t }: { t: TFunction }) {
  const values = valuesList(t);
  return (
    <section className="w-full py-16 md:py-24">
      <div className="w-full flex justify-between items-start mb-12 md:mb-16 gap-5">
        <div className="w-full lg:w-4/6  ">
          <PreHeading className="text-start">
            {t("values.PreHeading")}
          </PreHeading>
          <Heading className="mt-3 mb-5 text-start">
            {t("values.Heading")}
          </Heading>
          <SubHeading className="text-start">
            {t("values.SubHeading")}
          </SubHeading>
        </div>
        <Button asChild className="h-12 hidden lg:flex">
          <Link target="_blank" href={process.env.NEXT_PUBLIC_APP_URL!}>
            {t("values.cta")}
          </Link>
        </Button>
      </div>
      <div className="grid grid-cols-repeat_250 gap-6">
        {values.map((value, index) => (
          <ValueCard key={index} value={value} />
        ))}
      </div>
    </section>
  );
}

export default Values;
