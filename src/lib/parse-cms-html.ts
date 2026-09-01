import parse from "html-react-parser";

/** CMS fields sometimes include h1–h6; downgrade to p so page/card headings stay correct. */
function downgradeHeadings(html: string): string {
  return html
    .replace(/<h[1-6](\s[^>]*)?>/gi, "<p$1>")
    .replace(/<\/h[1-6]>/gi, "</p>");
}

/** Decode entity-escaped HTML from CMS text editors (e.g. &lt;p&gt; → <p>). */
export function normalizeCmsHtml(html: string): string {
  if (!html) return "";

  const trimmed = html.trim();
  if (trimmed.includes("&lt;") && !trimmed.includes("<")) {
    return trimmed
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&amp;/g, "&")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&nbsp;/g, " ");
  }

  return trimmed;
}

export function getPlainTextFromHtml(html: string): string {
  return normalizeCmsHtml(html)
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function parseCmsHtml(html: string) {
  return parse(downgradeHeadings(normalizeCmsHtml(html)));
}
