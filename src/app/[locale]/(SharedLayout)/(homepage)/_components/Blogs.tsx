import { Heading, PreHeading, SubHeading } from "@/components/Main";
import { BlogListSkeleton } from "@/components/Skeletons";
import { Button } from "@/components/ui/button";
import { TFunction } from "i18next";
import dynamic from "next/dynamic";
import Link from "next/link";

interface ArticleData {
  id: any;
  name: string;
  description: string;
  image: any;
}
function Blogs({ t,data }: {t: TFunction,data:ArticleData[] }) {
  return (
<div className="flex w-full xl:w-[1152px] gap-[24px] items-center justify-center shrink-0 flex-wrap  relative z-[4]">
        {
        data?.map((article, index) => (
          <Link
            href={`/blogs/${article?.id}`}
            key={index}
            className="flex w-full xs:w-[368px] xs:h-[465px] flex-col overflow-hidden items-start shrink-0 flex-nowrap relative z-[5] group"
          >
            <div
              style={{ backgroundImage: `url(${article.image[0]?.original})` }}
              className="w-full xs:w-[368px] h-[250px] shrink-0 group-hover:scale-110 transition-all duration-300  bg-cover bg-no-repeat relative z-[6]"
            />
            <div className="flex xs:h-[215px] pt-[16px] pr-[16px] pb-[24px] pl-[16px] flex-col gap-[24px] items-start self-stretch shrink-0 flex-nowrap bg-[#371f0b] group-hover:bg-[url(/assets/images/articles/hover.svg)] transition-all duration-300 bg-cover bg-no-repeat rounded-[16px] rounded-tl-none rounded-tr-none rounded-br-[16px] rounded-bl-[16px] relative z-[7]">
              <div className="flex w-full xs:w-[336px] flex-col gap-[12px] items-start shrink-0 flex-nowrap relative z-[8]">
                <span className="flex w-full line-clamp-1 xs:w-[336px]  justify-start items-start shrink-0 basis-auto text-[16px] font-semibold leading-[29px] text-[#fff] relative text-start xs:whitespace-nowrap z-[9]">
                  {article.name}
                </span>
                <span className="flex w-full line-clamp-3 xs:w-[336px] xs:h-[81px] justify-start items-start shrink-0 text-[14px] font-normal leading-[27px] text-[#dbdbdb] relative text-start z-10">
                  {article.description}
                </span>
              </div>
              <span className="h-[29px] self-stretch shrink-0 basis-auto text-[16px] font-normal leading-[29px] text-[#dbdbdb] relative text-start whitespace-nowrap z-[11]">
                {t("articles.read_more")}
              </span>
            </div>
          </Link>
        ))}
      </div>
  );
}

export default Blogs;
