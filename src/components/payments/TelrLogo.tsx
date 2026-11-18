import { cn } from "@/lib/utils";

type TelrLogoProps = {
  className?: string;
  /** White mark for dark / gradient buttons */
  light?: boolean;
  showWordmark?: boolean;
};

/**
 * Telr payment mark used on checkout CTAs.
 * Wordmark color matches Telr brand teal (#00a9a5).
 */
export default function TelrLogo({
  className,
  light = false,
  showWordmark = true,
}: TelrLogoProps) {
  const ink = light ? "#ffffff" : "#00a9a5";

  return (
    <span
      className={cn("inline-flex items-center gap-1.5", className)}
      aria-hidden={!showWordmark}
    >
      <svg
        viewBox="0 0 24 24"
        className="size-5 shrink-0"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <rect
          width="24"
          height="24"
          rx="6"
          fill={light ? "rgba(255,255,255,0.18)" : "#E6F7F6"}
        />
        <path
          d="M6.5 8.25h11v2.1h-4.15v7.4h-2.7v-7.4H6.5v-2.1Z"
          fill={ink}
        />
      </svg>
      {showWordmark ? (
        <span
          className="text-[15px] font-extrabold lowercase leading-none tracking-tight"
          style={{
            color: ink,
            fontFamily:
              "Arial Black, Arial Rounded MT Bold, Arial, sans-serif",
            fontStyle: "italic",
          }}
        >
          telr
        </span>
      ) : null}
      <span className="sr-only">Telr</span>
    </span>
  );
}
