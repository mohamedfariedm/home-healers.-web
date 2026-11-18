import { cn } from "@/lib/utils";

type TabbyLogoProps = {
  className?: string;
};

/** Compact Tabby mark for checkout method rows. */
export default function TabbyLogo({ className }: TabbyLogoProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md bg-[#3FF0C0] px-2 py-0.5",
        className
      )}
      aria-hidden
    >
      <span
        className="text-[12px] font-extrabold lowercase leading-none tracking-tight text-[#0b1a16]"
        style={{ fontFamily: "Arial Black, Arial, sans-serif" }}
      >
        tabby
      </span>
      <span className="sr-only">Tabby</span>
    </span>
  );
}
