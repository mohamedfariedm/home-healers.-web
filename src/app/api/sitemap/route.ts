import ClientAPI from "../api";
import { buildCanonicalUrl } from "@/lib/seo";

export const dynamic = "force-dynamic";

const STATIC_PATHS = [
  "",
  "/about",
  "/contact",
  "/blog",
  "/categories",
  "/offers",
  "/booking",
  "/doctors-apply",
  "/privacy",
  "/terms",
];

function fallbackSitemap() {
  const urls = STATIC_PATHS.flatMap((path) => {
    const ar = buildCanonicalUrl("ar", path);
    const en = buildCanonicalUrl("en", path);
    return [ar, en]
      .map(
        (loc) => `  <url>
    <loc>${loc}</loc>
    <changefreq>daily</changefreq>
    <priority>${path === "" ? "1.0" : "0.8"}</priority>
  </url>`,
      )
      .join("\n");
  }).join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
}

export async function GET() {
  try {
    const response = await ClientAPI.getSiteMap("sitemaps/sitemap.xml");
    const xml = typeof response === "string" ? response : JSON.stringify(response);

    if (xml && xml.includes("<urlset")) {
      return new Response(xml, {
        status: 200,
        headers: {
          "Content-Type": "application/xml; charset=utf-8",
          "Cache-Control": "no-store, must-revalidate",
        },
      });
    }
  } catch (error) {
    console.error("Error generating sitemap:", error);
  }

  return new Response(fallbackSitemap(), {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "no-store, must-revalidate",
    },
  });
}
