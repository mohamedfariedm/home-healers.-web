export function createMetadata(seo: any, locale: string, path = "", defaults: any = {}) {
    const base = `https://home-healers.com`;
    const canonical = seo?.[locale]?.canonical || `${base}${locale === "ar" ? "" : "/en"}${path}`;
    const title = seo?.[locale]?.title || defaults.title || "Home Hellers";
    const description = seo?.[locale]?.description || defaults.description || "Home Hellers app";
    const keywords = seo?.[locale]?.keywords || defaults.keywords || "Home Hellers, services, healthcare, clinics";

    const meta: any = {
        title,
        description,
        keywords,
        alternates: { canonical },
        icons: { icon: "/assets/images/favicon.ico" },
        openGraph: {
            title: seo?.[locale]?.og_title || title,
            description: seo?.[locale]?.og_description || description,
            url: canonical,
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
