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

export function getHeroImageUrls(
  attachments?: ImageAttachment[] | ImageAttachment | null,
  fallback = "/assets/images/homehellers/hero.svg",
): string[] {
  const list = Array.isArray(attachments)
    ? attachments.flatMap((item) => (Array.isArray(item) ? item : [item]))
    : attachments
      ? [attachments]
      : [];
  const urls = list
    .map((att) =>
      toSecureMediaUrl(
        typeof att === "string"
          ? att
          : att?.original || att?.converted || att?.url || "",
      ),
    )
    .filter(Boolean);
  return urls.length ? urls : [fallback];
}
