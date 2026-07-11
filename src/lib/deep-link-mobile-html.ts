const PLAY_STORE =
  "https://play.google.com/store/apps/details?id=com.home.healers.app";
const APP_STORE =
  "https://apps.apple.com/sa/app/home-healers/id123456789";

import { DEEP_LINK_ROUTE_NAMES } from "./deep-link";

export { DEEP_LINK_ROUTE_NAMES };

export function matchDeepLinkPath(pathname: string): string | null {
  const normalized = pathname.replace(/^\/(en|ar)(?=\/|$)/, "") || pathname;

  for (const route of DEEP_LINK_ROUTE_NAMES) {
    if (normalized === `/${route}` || normalized.startsWith(`/${route}/`)) {
      return normalized;
    }
  }

  return null;
}

export function isMobileUserAgent(userAgent: string): boolean {
  return /android|iphone|ipad|ipod/i.test(userAgent);
}

export function buildMobileDeepLinkRedirectHtml({
  targetUrl,
  isAndroid,
  isFacebookOrInstagram,
  androidStore = PLAY_STORE,
  iosStore = APP_STORE,
}: {
  targetUrl: string;
  isAndroid: boolean;
  isFacebookOrInstagram: boolean;
  androidStore?: string;
  iosStore?: string;
}): string {
  const storeUrl = isAndroid ? androidStore : iosStore;
  const safeTarget = JSON.stringify(targetUrl);
  const safeStore = JSON.stringify(storeUrl);

  return `<!DOCTYPE html>
<html lang="ar">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Home Healers</title>
  <style>
    body { margin: 0; min-height: 100vh; display: flex; align-items: center; justify-content: center; background: #fff; }
    .spinner { width: 32px; height: 32px; border: 4px solid #143087; border-top-color: transparent; border-radius: 50%; animation: spin 0.8s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }
  </style>
</head>
<body>
  <div class="spinner" aria-hidden="true"></div>
  <script>
    (function () {
      var targetUrl = ${safeTarget};
      var storeUrl = ${safeStore};
      var isAndroid = ${isAndroid ? "true" : "false"};
      var isFacebookOrInstagram = ${isFacebookOrInstagram ? "true" : "false"};

      function appOpenUrl(url) {
        return "homehealers://open?target_url=" + encodeURIComponent(url);
      }

      function androidIntent(url, fallback) {
        var u = new URL(url);
        var path = u.host + u.pathname + u.search;
        return "intent://" + path + "#Intent;scheme=https;package=com.home.healers.app;S.browser_fallback_url=" + encodeURIComponent(fallback) + ";end";
      }

      function scheduleStoreFallback() {
        setTimeout(function () {
          if (!document.hidden) {
            location.replace(storeUrl);
          }
        }, 2500);
      }

      if (isAndroid && !isFacebookOrInstagram) {
        location.replace(androidIntent(targetUrl, storeUrl));
        return;
      }

      location.replace(appOpenUrl(targetUrl));
      scheduleStoreFallback();
    })();
  </script>
</body>
</html>`;
}
