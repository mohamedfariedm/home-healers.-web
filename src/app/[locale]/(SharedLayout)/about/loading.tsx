import { Container } from "@/components/Layout";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <section>
      <Container className="min-h-screen">
        <div className="w-full lg:w-4/6 py-16 md:py-24">
          <Skeleton className="h-4 w-24 mb-3" />
          <Skeleton className="h-8 w-full max-w-md mb-5" />
          <Skeleton className="h-6 w-full max-w-lg" />
        </div>

        {/* Main Blog Card Skeleton */}
        <div className="w-full h-[500px] relative rounded-2xl overflow-hidden mb-12">
          <Skeleton className="w-full h-full" />
          <div className="absolute bottom-0 left-0 right-0 p-7">
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2 mb-4" />
            <div className="flex items-center gap-3">
              <Skeleton className="w-10 h-10 rounded-full" />
              <div>
                <Skeleton className="h-4 w-24 mb-1" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
          </div>
        </div>

        {/* Blog Filters Skeleton */}
        <div className="mt-12 md:mt-[72px] mb-12 md:mb-16 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex gap-4 grow overflow-x-hidden">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-7 w-20" />
            ))}
          </div>
          <Skeleton className="h-10 w-60" />
        </div>

        {/* Blog List Skeleton */}
        <div className="grid grid-cols-repeat_300 gap-8 w-full">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="w-full max-w-[450px]">
              <Skeleton className="w-full h-60 rounded-2xl mb-5" />
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-full mb-4" />
              <div className="flex items-center gap-3">
                <Skeleton className="w-10 h-10 rounded-full" />
                <div>
                  <Skeleton className="h-4 w-24 mb-1" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
