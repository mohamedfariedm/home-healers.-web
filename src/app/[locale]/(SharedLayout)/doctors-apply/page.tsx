import initTranslations from "@/app/i18n";
import ClientAPI from "@/app/api/api";
import DoctorRegistrationForm from "@/components/doctor-registration-form";
import { buildCanonicalUrl, buildLanguageAlternates } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const { t } = await initTranslations(locale, ["doctor-apply"]);
  const settings = await ClientAPI.getSettings(locale);
  const seo = settings?.data[0]?.setting?.seo["doctor-apply"] || {};

  const path = "/doctors-apply";
  const canonical = seo?.canonical || buildCanonicalUrl(locale, path);

  return {
    title: t("seo.title", {
      defaultValue: seo?.title || "Join Home Hellers Medical Team",
    }),
    description: t("seo.description", {
      defaultValue:
        seo?.description ||
        "Apply to become a doctor in our world-class healthcare network",
    }),
    keywords: t("seo.keywords", {
      defaultValue:
        seo?.keywords ||
        "Home Hellers, doctor application, healthcare, medical professionals",
    }),
    alternates: {
      canonical,
      languages: buildLanguageAlternates(path),
    },
    icons: {
      icon: "/assets/images/favicon.ico",
    },
    openGraph: {
      type: "website",
      title: t("seo.og_title", {
        defaultValue: seo?.og_title || "Join Home Hellers Medical Team",
      }),
      description: t("seo.og_description", {
        defaultValue:
          seo?.og_description ||
          "Apply to become a doctor in our world-class healthcare network",
      }),
      url: seo?.canonical || buildCanonicalUrl(locale, path),
      images: [
        {
          url: seo?.og_image || "/assets/images/doctor-apply-og.jpg",
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t("seo.twitter_title", {
        defaultValue: seo?.twitter_title || "Join Home Hellers Medical Team",
      }),
      description: t("seo.twitter_description", {
        defaultValue:
          seo?.twitter_description ||
          "Apply to become a doctor in our world-class healthcare network",
      }),
      images: [seo?.twitter_image || "/assets/images/doctor-apply-og.jpg"],
    },
  };
}

async function DoctorApplyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const { t } = await initTranslations(locale, ["doctor-apply"]);
  const nationalities = await ClientAPI.getNationalities(locale);
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-700 to-indigo-800 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-opacity-50 bg-[url('/assets/images/medical-pattern.png')] opacity-10"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6 animate-fade-in-up">
            {t("hero.title", { defaultValue: "Join Our Medical Team" })}
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto mb-8 animate-fade-in-up animation-delay-200">
            {t("hero.subtitle", {
              defaultValue:
                "Apply to become part of our world-class healthcare network. Your expertise can make a difference in patients' lives.",
            })}
          </p>
          <a
            href="#apply-form"
            className="inline-block bg-white text-blue-700 font-semibold py-3 px-8 rounded-full hover:bg-blue-100 transition-all duration-300 animate-fade-in-up animation-delay-400"
          >
            {t("hero.cta", { defaultValue: "Start Your Application" })}
          </a>
        </div>
      </section>

      {/* Form Section */}
      <main id="apply-form" className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
              {t("form.title", { defaultValue: "Doctor Application Form" })}
            </h2>
            <p className="text-gray-600 text-center mb-8 max-w-2xl mx-auto">
              {t("form.subtitle", {
                defaultValue:
                  "Please fill out the form below with accurate details to join our medical team.",
              })}
            </p>
            {nationalities && (
              <DoctorRegistrationForm
                nationalityOptions={nationalities?.data}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default DoctorApplyPage;
