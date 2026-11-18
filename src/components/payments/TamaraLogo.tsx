import { cn } from "@/lib/utils";

type TamaraLogoProps = {
  className?: string;
  light?: boolean;
};

/** Compact Tamara mark for payment method cards. */
export default function TamaraLogo({ className, light = false }: TamaraLogoProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-0.5",
        light ? "bg-white/20" : "bg-[#F8E8F1]",
        className
      )}
      aria-hidden
    >
      <span
        className={cn(
          "text-[12px] font-extrabold lowercase leading-none tracking-tight",
          light ? "text-white" : "text-[#C480A5]"
        )}
        style={{ fontFamily: "Arial Black, Arial, sans-serif" }}
      >
        tamara
      </span>
      <span className="sr-only">Tamara</span>
    </span>
  );
}
