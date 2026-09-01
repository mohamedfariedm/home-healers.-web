import { cn } from "@/lib/utils";
import { getPlainTextFromHtml, normalizeCmsHtml } from "@/lib/parse-cms-html";

type FaqAnswerProps = {
  html: string;
  className?: string;
  clamp?: boolean;
};

/** Renders CMS FAQ answers as HTML instead of showing raw tags. */
export default function FaqAnswer({ html, className, clamp }: FaqAnswerProps) {
  const normalized = normalizeCmsHtml(html);
  if (!getPlainTextFromHtml(normalized)) return null;

  return (
    <div
      className={cn("editor-content", clamp && "line-clamp-6", className)}
      dangerouslySetInnerHTML={{ __html: normalized }}
    />
  );
}
