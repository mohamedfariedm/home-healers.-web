type ImageAttachment = {
  original?: string;
  thumbnail?: string;
  converted?: string;
};

/** Prefer smaller variants for list cards; use getHeroImageUrls for hero. */
export function getOptimizedImageUrl(
  attachment?: ImageAttachment | null,
): string {
  if (!attachment) return "";
  return (
    attachment.thumbnail ||
    attachment.converted ||
    attachment.original ||
    ""
  );
}

export function getHeroImageUrls(
  attachments?: ImageAttachment[] | null,
  fallback = "/assets/images/homehellers/hero.svg",
): string[] {
  if (!attachments?.length) return [fallback];
  const urls = attachments
    .map((att) => att.original || "")
    .filter(Boolean);
  return urls.length ? urls : [fallback];
}
