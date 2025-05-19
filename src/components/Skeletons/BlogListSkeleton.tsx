import BlogCardSkeleton from "./BlogCardSkeleton";

function BlogListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid grid-cols-repeat_300 gap-8 w-full">
      {Array.from({ length: count }).map((_, i) => (
        <BlogCardSkeleton key={i} />
      ))}
    </div>
  );
}

export default BlogListSkeleton;
