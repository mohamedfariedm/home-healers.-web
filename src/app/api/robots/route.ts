const SITE_URL =
  process.env.NEXT_PUBLIC_WEBSITE_URL || "https://home-healers.com";

const ROBOTS_TXT = `User-agent: *
Allow: /
Allow: /en
Disallow: /admin
Disallow: /api
Disallow: /invoice
Disallow: /en/invoice
Disallow: /success
Disallow: /en/success
Disallow: /failed
Disallow: /en/failed
Disallow: /canceled
Disallow: /en/canceled
Disallow: /review
Disallow: /en/review
Disallow: /reservations/review
Disallow: /en/reservations/review
Disallow: /invite-doctor
Disallow: /en/invite-doctor

User-agent: AdsBot-Google
Allow: /

User-agent: Bingbot
Allow: /

User-agent: Twitterbot
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`;

export const dynamic = "force-static";

export function GET() {
  return new Response(ROBOTS_TXT, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
