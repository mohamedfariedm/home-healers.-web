const SITE_URL =
  process.env.NEXT_PUBLIC_WEBSITE_URL || "https://home-healers.com";

const LLMS_TXT = `# Home Healers

> In-home physiotherapy and medical rehabilitation services across Saudi Arabia.

Home Healers connects patients with licensed specialists for physical therapy, rehabilitation, and related medical services at home.

## Main pages

- [Home](${SITE_URL}/): Overview of Home Healers services
- [About](${SITE_URL}/about): Company, doctors, partners, and FAQs
- [Categories](${SITE_URL}/categories): Medical specialties
- [Offers](${SITE_URL}/offers): Treatment packages
- [Blog](${SITE_URL}/blog): Health articles
- [Booking](${SITE_URL}/booking): Book a home session
- [Contact](${SITE_URL}/contact): Contact and locations
- [Doctors apply](${SITE_URL}/doctors-apply): Join the medical team
- [Privacy](${SITE_URL}/privacy)
- [Terms](${SITE_URL}/terms)

## English

- [Home EN](${SITE_URL}/en)
- [About EN](${SITE_URL}/en/about)
- [Categories EN](${SITE_URL}/en/categories)
- [Offers EN](${SITE_URL}/en/offers)
- [Blog EN](${SITE_URL}/en/blog)
- [Booking EN](${SITE_URL}/en/booking)
- [Contact EN](${SITE_URL}/en/contact)

## Optional

- [Sitemap](${SITE_URL}/sitemap.xml)
`;

export function GET() {
  return new Response(LLMS_TXT, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
