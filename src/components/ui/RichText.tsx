import { cn } from "@/lib/utils";
import { isRichTextEmpty } from "@/lib/offers";

type RichTextProps = {
  html?: string | null;
  className?: string;
};

/** The only HTML injection point for offer body copy. */
export default function RichText({ html, className }: RichTextProps) {
  if (isRichTextEmpty(html)) return null;

  return (
    <div
      className={cn("offer-prose", className)}
      dangerouslySetInnerHTML={{ __html: html as string }}
    />
  );
}
