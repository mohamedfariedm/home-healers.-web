import { formatOfferNumber, toNumber } from "@/lib/offers";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

type OfferRatingProps = {
  rating?: number | null;
  count?: number | null;
  locale: string;
  className?: string;
};

export default function OfferRating({
  rating,
  count,
  locale,
  className,
}: OfferRatingProps) {
  const value = toNumber(rating);
  if (value === null) return null;

  const reviews = toNumber(count);

  return (
    <div className={cn("flex items-center gap-1 text-sm text-[#1e1e1e]", className)}>
      <Star className="size-4 fill-amber-400 text-amber-400" aria-hidden />
      <span className="font-semibold">{value.toFixed(1)}</span>
      {reviews !== null ? (
        <span className="text-[#4a5568]">({formatOfferNumber(reviews, locale)})</span>
      ) : null}
    </div>
  );
}
