# Lighthouse reports (mobile, production `http://localhost:3001`)

Audited after SEO/performance work. Design and image files were not changed.

| Page | Performance | SEO | HTML report |
| --- | ---: | ---: | --- |
| `/` | 75 | 100 | [home-ar.report.html](home-ar.report.html) |
| `/en` | 75 | 100 | [en.report.html](en.report.html) |
| `/about` | 41 | 100 | [about.report.html](about.report.html) |
| `/en/about` | 37 | 100 | [en_about.report.html](en_about.report.html) |
| `/contact` | 77 | 100 | [contact.report.html](contact.report.html) |
| `/en/contact` | 77 | 100 | [en_contact.report.html](en_contact.report.html) |
| `/blog` | 59 | 100 | [blog.report.html](blog.report.html) |
| `/en/blog` | 76 | 100 | [en_blog.report.html](en_blog.report.html) |
| `/categories` | 78 | 100 | [categories.report.html](categories.report.html) |
| `/en/categories` | 77 | 100 | [en_categories.report.html](en_categories.report.html) |
| `/our-services` | 65 | 100 | [our-services.report.html](our-services.report.html) |
| `/en/our-services` | 69 | 100 | [en_our-services.report.html](en_our-services.report.html) |
| `/booking` | 29 | 100 | [booking.report.html](booking.report.html) |
| `/en/booking` | 57 | 100 | [en_booking.report.html](en_booking.report.html) |
| `/doctors-apply` | 80–95 | 92* | [doctors-apply.report.html](doctors-apply.report.html) |
| `/en/doctors-apply` | 79 | 100 | [en_doctors-apply.report.html](en_doctors-apply.report.html) |
| `/privacy` | 77 | 100 | [privacy.report.html](privacy.report.html) |
| `/en/privacy` | 78 | 100 | [en_privacy.report.html](en_privacy.report.html) |
| `/terms` | 77 | 100 | [terms.report.html](terms.report.html) |
| `/en/terms` | 75 | 100 | [en_terms.report.html](en_terms.report.html) |
| `/offers` | — | — | First paint timeout in headless Chrome |
| `/en/offers` | — | — | First paint timeout in headless Chrome |

\* The only SEO miss on `/doctors-apply` was `robots.txt` download failing during that run (Lighthouse could not fetch it). Every on-page SEO check passed. A static `robots.txt` is now in place so this should score 100 after a production restart.

## SEO checks that passed on public pages

- Title, meta description, canonical, hreflang
- Image alt attributes
- Crawlable links and descriptive link text
- HTTP 200, viewport, indexable
- Valid robots.txt when the file is reachable

## Why mobile Performance is not 100

Lighthouse mobile is limited by remote images and page JS, not by missing metadata:

- Oversized backend images (homepage saved ~1.3 MB if resized; about page has ~1.6 MB offscreen images)
- About page DOM is huge (~7,700 nodes)
- Booking first-load JS is ~678 KB
- You asked not to change images or the design

Best mobile Performance in this run: **95** on `/doctors-apply`. Content pages land around **75–78**.
