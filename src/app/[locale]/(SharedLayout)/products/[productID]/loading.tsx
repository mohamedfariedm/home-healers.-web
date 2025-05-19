import { Container } from "@/components/Layout";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

export default function Loading() {
  return (
    <Container>
      <div className="blog_details--content py-16 md:py-24">
        <div className="w-full lg:w-4/6 mx-auto">
          {/* Pre-heading skeleton */}
          <Skeleton className="h-6 w-32 mx-auto mb-3" />

          {/* Heading skeleton */}
          <Skeleton className="h-10 w-3/4 mx-auto mb-5" />

          {/* Sub-heading skeleton */}
          <Skeleton className="h-8 w-5/6 mx-auto" />
        </div>

        {/* Tags skeleton */}
        <div className="blog_details--tags mb-12 md:mb-16 mt-8 flex gap-2 justify-center">
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>

        {/* Main image skeleton */}
        <Skeleton className="w-full h-[450px] mb-16 md:mb-24" />

        {/* Content skeleton */}
        <div className="max-w-3xl mx-auto space-y-6">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-24 w-full" />
        </div>

        <Separator className="my-6 max-w-3xl mx-auto" />

        {/* Footer skeleton */}
        <div className="max-w-3xl mx-auto flex flex-col md:flex-row md:justify-between md:items-center gap-8">
          <div className="flex items-center gap-3">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
          <div className="flex gap-3">
            <Skeleton className="h-10 w-10 rounded-md" />
            <Skeleton className="h-10 w-10 rounded-md" />
            <Skeleton className="h-10 w-10 rounded-md" />
            <Skeleton className="h-10 w-10 rounded-md" />
          </div>
        </div>
      </div>

      {/* Suggestions section skeleton */}
      <div className="blog_details--suggestions">
        <Separator />
        <div className="w-full my-16 md:my-24">
          <div className="w-full flex justify-between items-start mb-12 md:mb-16 gap-5">
            <div className="w-full lg:w-4/6">
              <Skeleton className="h-6 w-32 mb-3" />
              <Skeleton className="h-10 w-3/4 mb-5" />
              <Skeleton className="h-8 w-5/6" />
            </div>
            <Skeleton className="h-12 w-32 hidden lg:block" />
          </div>

          {/* Blog cards skeleton */}
          <div className="grid grid-cols-repeat_300 gap-8 w-full justify-items-center my-12 md:my-16">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="w-full max-w-[450px]">
                <Skeleton className="h-60 w-full rounded-2xl mb-5" />
                <div className="space-y-4">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-16 w-full" />
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Skeleton className="h-12 w-full max-w-[450px] mx-auto mt-12 lg:hidden" />
        </div>
        <Separator />
      </div>
    </Container>
  );
}
