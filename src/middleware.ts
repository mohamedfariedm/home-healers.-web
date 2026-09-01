import { type NextRequest, NextResponse } from "next/server"
import { i18nRouterConfig } from "./i18nRouterConfig"
import {
  buildWebsiteRedirectPath,
  parseDeepLinkRequest,
} from "./lib/deep-link"
import {
  buildMobileDeepLinkRedirectHtml,
  isMobileUserAgent,
  matchDeepLinkPath,
} from "./lib/deep-link-mobile-html"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const userAgent = request.headers.get("user-agent") || ""

  // Deep links: mobile → app/store; desktop → website equivalent
  const deepLinkPath = matchDeepLinkPath(pathname)
  if (deepLinkPath) {
    if (isMobileUserAgent(userAgent)) {
      const targetUrl = `${request.nextUrl.origin}${deepLinkPath}${request.nextUrl.search}`
      const isAndroid = /android/i.test(userAgent)
      const isFacebookOrInstagram = /FBAN|FBAV|FB_IAB|Instagram/i.test(userAgent)

      return new NextResponse(
        buildMobileDeepLinkRedirectHtml({
          targetUrl,
          isAndroid,
          isFacebookOrInstagram,
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "text/html; charset=utf-8",
            "Cache-Control": "no-cache, no-store, must-revalidate",
          },
        },
      )
    }

    const parsed = parseDeepLinkRequest(pathname, request.nextUrl.searchParams)
    if (parsed) {
      const segments = parsed.id ? [parsed.id] : undefined
      const redirectPath = buildWebsiteRedirectPath(
        parsed.locale,
        parsed.route,
        segments,
      )
      return NextResponse.redirect(new URL(redirectPath, request.url))
    }
  }

  // Check if path already has locale prefix
  const hasEnPrefix = pathname.startsWith("/en/") || pathname === "/en"
  const hasArPrefix = pathname.startsWith("/ar/") || pathname === "/ar"

  // Arabic is the default locale (no /ar prefix). Canonicalize /ar and /ar/* so
  // Google does not index duplicate URLs that break reciprocal hreflang.
  if (hasArPrefix) {
    const unprefixedPath = pathname === "/ar" ? "/" : pathname.replace(/^\/ar/, "") || "/"
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = unprefixedPath
    return NextResponse.redirect(redirectUrl, 301)
  }

  // English already has an explicit /en prefix — pass through
  if (hasEnPrefix) {
    const response = NextResponse.next()
    response.cookies.set("NEXT_LOCALE", "en", { path: "/" })
    response.headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload")
    return response
  }

  // Handle defunct /services page with 410 Gone (for SEO/Google Indexing)
  const isServicesPage = pathname === "/services" || pathname === "/en/services"

  if (isServicesPage) {
        return new NextResponse(
      `<!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>410 - Page Gone</title>
          <link href="https://fonts.googleapis.com/css2?family=Alexandria:wght@300;400;600;700&display=swap" rel="stylesheet">
          <style>
              body {
                  margin: 0;
                  padding: 0;
                  font-family: 'Alexandria', sans-serif;
                  background-color: #ffffff;
                  height: 100vh;
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  justify-content: center;
                  overflow: hidden;
              }
              .container {
                  text-align: center;
                  max-width: 600px;
                  padding: 2rem;
              }
              .error-code {
                  font-size: 8rem;
                  font-weight: 700;
                  color: #62a0f6;
                  margin: 0;
                  opacity: 0.1;
                  position: absolute;
                  top: 50%;
                  left: 50%;
                  transform: translate(-50%, -50%);
                  z-index: -1;
              }
              h1 {
                  font-size: 2.5rem;
                  color: #1e1e1e;
                  margin-bottom: 1rem;
              }
              p {
                  font-size: 1.1rem;
                  color: #4a5568;
                  line-height: 1.6;
                  margin-bottom: 2rem;
              }
              .btn {
                  display: inline-block;
                  background-color: #62a0f6;
                  color: white;
                  padding: 1rem 2rem;
                  border-radius: 50px;
                  text-decoration: none;
                  font-weight: 600;
                  transition: all 0.3s ease;
                  box-shadow: 0 10px 20px rgba(98, 160, 246, 0.2);
              }
              .btn:hover {
                  background-color: #4f8ae8;
                  transform: translateY(-2px);
                  box-shadow: 0 15px 30px rgba(98, 160, 246, 0.3);
              }
          </style>
      </head>
      <body>
          <div class="error-code">410</div>
          <div class="container">
              <h1>This Page is Gone</h1>
              <p>The services page you are looking for has been permanently removed. You can find all our current offerings on our homepage.</p>
              <a href="/" class="btn">Back to Home</a>
          </div>
      </body>
      </html>`,
      {
        status: 410,
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
      }
    )
  }

  // For paths without locale prefix, rewrite to /ar/* (default locale)
  // This avoids redirects by using rewrites instead
  
  const url = request.nextUrl.clone()
  url.pathname = `/ar${pathname}`

  const response = NextResponse.rewrite(url)
  response.cookies.set("NEXT_LOCALE", "ar", { path: "/" })
  response.headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload")

  return response
}

export const config = {
  // Exclude API routes, static files, Next.js internals, and common assets
  matcher: "/((?!api|static|.*\\..*|_next|favicon.ico|robots.txt|sitemap.xml).*)",
}
