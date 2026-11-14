import Image from "next/image";
import { TFunction } from "i18next";
import Link from "next/link";
import { blogHref, getBlogSlug, getNewsTitle } from "@/lib/slugs";
import { toSecureMediaUrl } from "@/lib/image-url";

interface ArticleData {
  id: any;
  name: string | { en?: string; ar?: string };
  description: string;
  image: any;
  slug?: string | { en?: string; ar?: string };
}
function Blogs({
  t,
  data,
  locale = "ar",
}: {
  t: TFunction;
  data: ArticleData[];
  locale?: string;
}) {
  return (
    <div className="relative z-[4] flex w-full flex-wrap items-center justify-center gap-[24px] xl:w-[1152px]">
      {data?.map((article, index) => {
        const src =
          toSecureMediaUrl(article.image?.[0]?.thumbnail) ||
          toSecureMediaUrl(article.image?.[0]?.original) ||
          "/assets/images/doctorMale.webp";
        return (
          <Link
            href={blogHref(
              locale,
              getBlogSlug(article, locale) || String(article?.id || ""),
            )}
            key={index}
            className="group relative z-[5] flex w-full shrink-0 flex-col items-start overflow-hidden xs:h-[465px] xs:w-[368px]"
          >
            <div className="relative z-[6] h-[250px] w-full shrink-0 overflow-hidden xs:w-[368px]">
              <Image
                src={src}
                alt={getNewsTitle(article, locale) || ""}
                fill
                sizes="(max-width: 480px) 100vw, 368px"
                className="object-cover object-center transition-transform duration-300 group-hover:scale-110"
                quality={70}
              />
            </div>
            <div className="relative z-[7] flex shrink-0 flex-col items-start gap-[24px] self-stretch rounded-[16px] rounded-tl-none rounded-tr-none bg-[#371f0b] bg-cover bg-no-repeat pb-[24px] pl-[16px] pr-[16px] pt-[16px] transition-all duration-300 group-hover:bg-[url(/assets/images/articles/hover.svg)] xs:h-[215px]">
              <div className="relative z-[8] flex w-full shrink-0 flex-col items-start gap-[12px] xs:w-[336px]">
                <span className="relative z-[9] line-clamp-1 flex w-full shrink-0 basis-auto items-start justify-start text-start text-[16px] font-semibold leading-[29px] text-[#fff] xs:w-[336px] xs:whitespace-nowrap">
                  {getNewsTitle(article, locale)}
                </span>
                <span className="relative z-10 line-clamp-3 flex w-full shrink-0 items-start justify-start text-start text-[14px] font-normal leading-[27px] text-[#dbdbdb] xs:h-[81px] xs:w-[336px]">
                  {article.description}
                </span>
              </div>
              <span className="relative z-[11] h-[29px] shrink-0 basis-auto self-stretch whitespace-nowrap text-start text-[16px] font-normal leading-[29px] text-[#dbdbdb]">
                {t("articles.read_more")}
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

export default Blogs;
