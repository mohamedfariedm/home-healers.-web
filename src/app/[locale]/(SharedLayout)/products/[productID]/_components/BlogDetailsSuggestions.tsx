import { BlogList, Heading, PreHeading, SubHeading } from "@/components/Main";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { allBlogs } from "@/constants/temp";
import { TFunction } from "i18next";
import Link from "next/link";
import React from "react";

function BlogDetailsSuggestions({ t ,blogs}: { t: TFunction,blogs:any }) {
  return (
    <div className="blog_details--suggestions">
      <Separator />

      <div className="w-full my-16 md:my-24">
        <div className="w-full flex justify-between items-start mb-12 md:mb-16 gap-5">
          <div className="w-full lg:w-4/6  ">
            <PreHeading className="text-start">
              {t("suggestions.PreHeading")}
            </PreHeading>
            <Heading className="mt-3 mb-5 text-start text-2xl md:text-3xl">
              {t("suggestions.Heading")}
            </Heading>
            <SubHeading className="text-start">
              {t("suggestions.SubHeading")}
            </SubHeading>
          </div>

          <Button asChild className="h-12 hidden lg:flex">
            <Link href="/blog">{t("suggestions.cta")}</Link>
          </Button>
        </div>

        <BlogList
          blogs={blogs}
          t={t}
          className="my-12  md:my-16"
        />

        <Button
          asChild
          className="h-12 flex  lg:hidden w-full max-w-[450px] mx-auto mt-12"
        >
          <Link href="/blog">{t("suggestions.cta")}</Link>
        </Button>
      </div>

      <Separator />
    </div>
  );
}

export default BlogDetailsSuggestions;
