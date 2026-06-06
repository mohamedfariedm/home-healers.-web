import parse from "html-react-parser";

/** CMS fields sometimes include h1–h6; downgrade to p so page/card headings stay correct. */
function downgradeHeadings(html: string): string {
  return html
    .replace(/<h[1-6](\s[^>]*)?>/gi, "<p$1>")
    .replace(/<\/h[1-6]>/gi, "</p>");
}

export function parseCmsHtml(html: string) {
  return parse(downgradeHeadings(html));
}
