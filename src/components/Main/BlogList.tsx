import { IBlog } from "@/types";
import { BlogCard } from "../Cards";
import { cn } from "@/lib/utils";
import { TFunction } from "i18next";
import { NoItemsFound } from "../Shared";

export default function BlogList({
  blogs,
  className,
  t,
}: {
  blogs: IBlog[];
  className?: string;
  t?: TFunction;
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-repeat_300 gap-8 w-full justify -items-center",
        className
      )}
    >
      {blogs?.length ? (
        blogs.map((blog) => <BlogCard key={blog.id} blog={blog} t={t} />)
      ) : (
        <NoItemsFound items="posts" />
      )}
    </div>
  );
}
