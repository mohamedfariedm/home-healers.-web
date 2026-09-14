import { cn } from "@/lib/utils";
import { isRichTextEmpty } from "@/lib/offers";
import { demoteH1, normalizeCmsHtml } from "@/lib/parse-cms-html";

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
      dangerouslySetInnerHTML={{
        __html: demoteH1(normalizeCmsHtml(html as string)),
      }}
    />
  );
}
