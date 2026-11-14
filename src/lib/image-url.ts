type ImageAttachment = {
  original?: string;
  thumbnail?: string;
  converted?: string;
  url?: string;
};

const INSECURE_MEDIA_HOSTS = [
  "backend.home-healers.com",
  "development.home-healers.com",
];

/** Upgrade first-party media to HTTPS so Lighthouse does not flag mixed content. */
export function toSecureMediaUrl(url?: string | null): string {
  if (!url) return "";
  try {
    if (url.startsWith("//")) {
      return toSecureMediaUrl(`https:${url}`);
    }
    if (!url.startsWith("http://")) return url;
    const parsed = new URL(url);
    if (INSECURE_MEDIA_HOSTS.includes(parsed.hostname)) {
      parsed.protocol = "https:";
      return parsed.toString();
    }
  } catch {
    return url;
  }
  return url;
}

/** Prefer smaller variants for list cards; use getHeroImageUrls for hero. */
export function getOptimizedImageUrl(
  attachment?: ImageAttachment | null,
): string {
  if (!attachment) return "";
  return toSecureMediaUrl(
    attachment.thumbnail ||
      attachment.converted ||
      attachment.original ||
      attachment.url ||
      "",
  );
}

/** Dedupe same asset served from different hosts (backend vs development). */
function heroDedupeKey(url: string): string {
  try {
    const parsed = new URL(url, "https://home-healers.com");
    return decodeURIComponent(parsed.pathname).toLowerCase();
  } catch {
    return url.toLowerCase();
  }
}

export function getHeroImageUrls(
  attachments?: ImageAttachment[] | ImageAttachment | null,
  fallback = "/assets/images/homehellers/hero.webp",
): string[] {
  const list = Array.isArray(attachments)
    ? attachments.flatMap((item) => (Array.isArray(item) ? item : [item]))
    : attachments
      ? [attachments]
      : [];
  const seen = new Set<string>();
  const urls: string[] = [];
  for (const att of list) {
    const url = toSecureMediaUrl(
      typeof att === "string"
        ? att
        : att?.original || att?.converted || att?.url || "",
    );
    if (!url) continue;
    const key = heroDedupeKey(url);
    if (seen.has(key)) continue;
    seen.add(key);
    urls.push(url);
  }
  return urls.length ? urls : [fallback];
}
