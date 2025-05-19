import {
  Card,
  CardFooter,
  CardHeader
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function BlogCardSkeleton() {
  return (
    <Card className="w-full rounded-none shadow-none border-none bg-transparent ">
      <Skeleton className="h-60 w-full rounded-2xl mb-5" />
      <CardHeader>
        <Skeleton className="h-4 w-24 mb-2" />
        <div className="my-2 flex items-start gap-2 w-full">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-6 shrink-0" />
        </div>
        <Skeleton className="h-4 w-full mt-2" />
        <Skeleton className="h-4 w-3/4 mt-2" />
      </CardHeader>
      <CardFooter className="mt-6 flex items-center justify-start gap-3">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div>
          <Skeleton className="h-4 w-24 mb-2" />
          <Skeleton className="h-4 w-32" />
        </div>
      </CardFooter>
    </Card>
  );
}
