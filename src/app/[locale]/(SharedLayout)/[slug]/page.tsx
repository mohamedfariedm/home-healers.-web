import ClientAPI from "@/app/api/api";
import { notFound } from "next/navigation";
import LandingPageRenderer from "@/components/LandingPage/LandingPageRenderer";
import { buildCanonicalUrl, buildLanguageAlternates, ogLocale } from "@/lib/seo";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

type Props = {
  params: { locale: string; slug: string };
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  try {
    const settings = await ClientAPI.getSettings(locale);
    const landingPages = settings?.data?.[0]?.setting?.landing_pages || [];
    const landingPage = landingPages.find(
      (page: any) => page.slug === slug
    );

    if (!landingPage) {
      return {
        title: "Page Not Found",
      };
    }

    const seo = landingPage.seo || {};
    const metaTitle = seo.meta_title?.[locale] || landingPage.meta_title?.[locale] || landingPage.title?.[locale];
    const metaDescription = seo.meta_description?.[locale] || landingPage.meta_description?.[locale] || landingPage.description?.[locale];

    const path = `/${slug}`;
    const canonical = seo.canonical_url || buildCanonicalUrl(locale, path);

    return {
      title: metaTitle,
      description: metaDescription,
      keywords: seo.meta_keywords?.[locale],
      authors: [{ name: seo.author || "Home Healers" }],
      openGraph: {
        title: seo.og_title?.[locale] || metaTitle,
        description: seo.og_description?.[locale] || metaDescription,
        images: seo.og_image ? [seo.og_image] : [],
        type: seo.og_type || "website",
        url: seo.og_url || canonical,
        siteName: seo.og_site_name || "Home Healers",
        locale: seo.og_locale?.[locale] || ogLocale(locale),
      },
      twitter: {
        card: seo.twitter_card || "summary_large_image",
        title: seo.twitter_title?.[locale] || metaTitle,
        description: seo.twitter_description?.[locale] || metaDescription,
        images: seo.twitter_image ? [seo.twitter_image] : [],
        site: seo.twitter_site,
        creator: seo.twitter_creator,
      },
      robots: seo.meta_robots || "index, follow",
      alternates: {
        canonical,
        languages: buildLanguageAlternates(path),
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Landing Page",
    };
  }
}

async function LandingPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  try {
        
    // Get landing page from settings (landing_pages array)
    const settings = await ClientAPI.getSettings(locale);
        
    const landingPages = settings?.data?.[0]?.setting?.landing_pages || [];
                
    const landingPage = landingPages.find((page: any) => page.slug === slug);
    
    if (!landingPage) {
      console.error("❌ Landing page not found for slug:", slug);
      notFound();
    }
    
    
    // Sort sections by order
    const sortedSections = (landingPage.sections || []).sort(
      (a: any, b: any) => (a.order || 0) - (b.order || 0)
    );

    return (
      <div className="w-full min-h-screen bg-white">
        {/* Hidden H1 for SEO */}
        <h1 className="absolute text-4xl font-bold text-center mb-4 -z-50">
          {landingPage.seo?.h1_tag?.[locale] || landingPage.title?.[locale]}
        </h1>

        {/* Render all sections */}
        <LandingPageRenderer
          sections={sortedSections}
          locale={locale}
          settings={settings}
        />
      </div>
    );
  } catch (error) {
    console.error("Error loading landing page:", error);
    notFound();
  }
}

export default LandingPage;
