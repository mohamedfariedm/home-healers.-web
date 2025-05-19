import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { IBlog } from "@/types";
import { TFunction } from "i18next";
import Image from "next/image";
import Link from "next/link";
import { FiArrowUpRight } from "react-icons/fi";

export default function BlogCard({
  blog,
  main,
  t,
}: {
  blog: IBlog;
  main?: boolean;
  t?: TFunction;
}) {
  return (
    <Link
      href={`/blog/${blog?.id}`}
      className={cn("w-full justify-self-center ", !main && "max-w-[450px]")}
    >
      <Card
        className={cn(
          " w-full  rounded-none shadow-none border-none group bg-transparent relative "
        )}
      >
        <div
          className={cn(
            "blog__card--overlay absolute inset-0 hidden ",
            main &&
              "bg-gradient-to-b from-transparent to-black/40 rounded-2xl z-10 md:block"
          )}
        />
        <div
          className={cn(
            "h-60 relative rounded-2xl overflow-hidden mb-5",
            main && "md:h-[500px] md:mb-0"
          )}
        >
          <Image
            src={blog.image}
            alt={blog.title}
            fill
            className="scale-105 transition ease-in-out group-hover:scale-100 duration-500 object-cover"
          />
        </div>
        <CardContent
          className={cn(
            "w-full",
            main && "md:absolute bottom-0   p-4 md:p-7 z-20 "
          )}
        >
          <CardHeader className={cn("", main && "md:space-y-0 md:gap-2")}>
            <p
              className={cn(
                "text-text-brand-secondary-700 text-sm font-semibold leading-tight",
                main && "md:hidden"
              )}
            >
              {blog.type}
            </p>
            <div
              className={cn(
                "my-2 flex items-start gap-2 w-full min-h-[60px] bg -red-400",
                main && "md:min-h-0 md:my-0 "
              )}
            >
              <CardTitle className="grow line-clamp-2 link__underline">
                {blog.title}
              </CardTitle>
              <div className="shrink-0 w-6 h-6  relative  overflow-hidden">
                <div className="rtl:flip">
                  <FiArrowUpRight className=" text-xl  absolute inset-0 group-hover:translate-x-5 group-hover:-translate-y-5 transition ease-in-out duration-500  " />
                </div>
                <div className="rtl:flip">
                  <FiArrowUpRight className=" text-xl  absolute inset-0 -translate-x-5 translate-y-5 group-hover:translate-x-0 group-hover:translate-y-0 transition ease-in-out duration-500" />
                </div>
              </div>
            </div>
            <CardDescription
              className={cn(
                "line-clamp-2 ",
                main && "md:text-text-primary-900"
              )}
            >
              {blog.short_desc}
            </CardDescription>
          </CardHeader>
          <CardFooter
            className={cn(
              "mt-6 flex items-center justify-start gap-3",
              main && "md:justify-between"
            )}
          >
            <div className="flex items-start gap-8">
              {/*//* Avatar */}
              <div className="flex flex-col gap-2">
                <h5
                  className={cn(
                    "hidden text-text-primary-900 text-sm",
                    main && "md:block "
                  )}
                >
                  {t?.("BlogCard.written_by")}
                </h5>
                <div className="flex items-center justify-start gap-3">
                  <Avatar>
                    <AvatarImage src={blog?.avatar} alt={blog?.publisher?.name} />
                    <AvatarFallback>{blog?.publisher?.name}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h5 className="text-sm font-semibold leading-tight text-text-primary-900">
                      {blog?.publisher?.name}
                    </h5>
                    <h6
                      className={cn(
                        "text-sm font-normal leading-tight  text-text-tertiary-600",
                        main && "md:hidden"
                      )}
                    >
                      {blog?.created_at}
                    </h6>
                  </div>
                </div>
              </div>
              {/*//* Date */}
              <div className={cn("hidden", main && "md:flex flex-col gap-4")}>
                <h5 className={cn(" text-text-primary-900 text-sm")}>
                  {t?.("BlogCard.published_on")}
                </h5>
                <h6 className="text-text-primary-900 text-base">{blog?.created_at}</h6>
              </div>
            </div>
            {/*//* tags */}
            <div className={cn("hidden", main && "md:flex flex-col gap-4")}>
              <h5 className={cn(" text-text-primary-900 text-sm")}>
                {t?.("BlogCard.tags")}
              </h5>
              <div className="flex gap-2">
                  <Link
                    key={blog.type}
                    href={{
                      pathname: "/blog",
                      query: { tag:blog.type },
                    }}
                    className="leading-tight px-2.5 py-0.5 rounded-full border border-text-primary-900 text-text-primary-900 text-sm"
                  >
                    {blog.type}
                  </Link>
              </div>
            </div>
          </CardFooter>
        </CardContent>
      </Card>
    </Link>
  );
}
