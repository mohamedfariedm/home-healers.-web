const SITE_URL = process.env.NEXT_PUBLIC_WEBSITE_URL || "https://home-healers.com";

/** Build a locale-aware absolute URL. Path must start with "/" or be "" for homepage. */
export function buildCanonicalUrl(locale: string, path = ""): string {
    const normalizedPath = path.startsWith("/") ? path : path ? `/${path}` : "";
    const localePrefix = locale === "ar" ? "" : "/en";
    return `${SITE_URL}${localePrefix}${normalizedPath}`;
}

export function getLocalizedValue(value: unknown, locale: string): string {
    if (value && typeof value === "object") {
        const record = value as Record<string, string>;
        return record[locale] ?? record.ar ?? record.en ?? "";
    }
    return typeof value === "string" ? value : "";
}

export function buildLanguageAlternates(path = ""): Record<string, string> {
    const ar = buildCanonicalUrl("ar", path);
    return {
        ar,
        en: buildCanonicalUrl("en", path),
        "x-default": ar,
    };
}

/** Build hreflang alternates when each locale has its own slug segment. */
export function buildLocalizedSlugAlternates(
    basePath: string,
    slug: unknown,
    fallbackSlug = "",
): Record<string, string> {
    const arSlug = getLocalizedValue(slug, "ar") || fallbackSlug;
    const enSlug = getLocalizedValue(slug, "en") || fallbackSlug;
    const ar = buildCanonicalUrl("ar", `${basePath}/${arSlug}`);

    return {
        ar,
        en: buildCanonicalUrl("en", `${basePath}/${enSlug}`),
        "x-default": ar,
    };
}

export function createMetadata(
    seo: any,
    locale: string,
    path = "",
    defaults: any = {},
    options?: { preferPathCanonical?: boolean },
) {
    const canonical = options?.preferPathCanonical
        ? buildCanonicalUrl(locale, path)
        : seo?.[locale]?.canonical || buildCanonicalUrl(locale, path);
    const title = seo?.[locale]?.title || defaults.title || "Home Hellers";
    const description = seo?.[locale]?.description || defaults.description || "Home Hellers app";
    const keywords = seo?.[locale]?.keywords || defaults.keywords || "Home Hellers, services, healthcare, clinics";

    const meta: any = {
        title,
        description,
        keywords,
        alternates: {
            canonical,
            languages: buildLanguageAlternates(path),
        },
        icons: { icon: "/assets/images/favicon.ico" },
        openGraph: {
            type: seo?.[locale]?.og_type || defaults.ogType || "website",
            title: seo?.[locale]?.og_title || title,
            description: seo?.[locale]?.og_description || description,
            url: canonical,
            siteName: seo?.[locale]?.og_site_name || "Home Healers",
            locale: seo?.[locale]?.og_locale || (locale === "ar" ? "ar_SA" : "en_US"),
            images: [
                {
                    url: seo?.[locale]?.og_image || "/assets/images/favicon.ico",
                    width: 1200,
                    height: 630,
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: seo?.[locale]?.twitter_title || title,
            description: seo?.[locale]?.twitter_description || description,
            images: [seo?.[locale]?.twitter_image || "/assets/images/favicon.ico"],
        },
    };

    // include verification if present (e.g., google verification key)
    if (seo?.[locale]?.verification) {
        meta.verification = seo.verification;
    }

    return meta;
}
