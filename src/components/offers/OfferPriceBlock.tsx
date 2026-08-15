import { formatOfferPrice, toNumber } from "@/lib/offers";
import { cn } from "@/lib/utils";

type OfferPriceBlockProps = {
  price: string | number;
  oldPrice?: string | number | null;
  savingsAmount?: string | number | null;
  currency?: string | null;
  locale: string;
  saveLabel?: string;
  className?: string;
};

export default function OfferPriceBlock({
  price,
  oldPrice,
  savingsAmount,
  currency,
  locale,
  saveLabel,
  className,
}: OfferPriceBlockProps) {
  const current = formatOfferPrice(price, currency, locale);
  const previous =
    toNumber(oldPrice) && toNumber(oldPrice) !== toNumber(price)
      ? formatOfferPrice(oldPrice, currency, locale)
      : "";
  const savings =
    toNumber(savingsAmount) && toNumber(savingsAmount)! > 0
      ? formatOfferPrice(savingsAmount, currency, locale)
      : "";

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
        {previous ? (
          <span className="text-sm text-[#4a5568] line-through">{previous}</span>
        ) : null}
        <span className="text-lg font-bold text-[#143087]">{current}</span>
      </div>
      {savings && saveLabel ? (
        <p className="text-sm font-medium text-emerald-700">
          {saveLabel.replace("{{amount}}", savings)}
        </p>
      ) : null}
    </div>
  );
}
