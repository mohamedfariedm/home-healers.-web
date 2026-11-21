import { cn } from "@/lib/utils";

type AcceptedCardBrandsProps = {
  className?: string;
  size?: "sm" | "md";
};

const BRANDS = ["mada", "VISA", "MC"] as const;

/** Visual hint that Seamless card checkout accepts mada / Visa / Mastercard. */
export default function AcceptedCardBrands({
  className,
  size = "sm",
}: AcceptedCardBrandsProps) {
  return (
    <div
      className={cn("flex shrink-0 items-center gap-1", className)}
      aria-label="mada, Visa, Mastercard"
    >
      {BRANDS.map((brand) => (
        <span
          key={brand}
          className={cn(
            "inline-flex items-center rounded border border-[#e5ebf5] bg-white font-bold tracking-wide text-[#5b6b86]",
            size === "sm"
              ? "h-5 px-1.5 text-[9px]"
              : "h-6 px-2 text-[10px]",
          )}
        >
          {brand}
        </span>
      ))}
    </div>
  );
}
