import initTranslations from "@/app/i18n";
import ClientAPI from "@/app/api/api";
import DoctorRegistrationForm from "@/components/doctor-registration-form";
import { getCachedSettings } from "@/lib/cached-api";
import { createMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

function getDoctorsApplySeo(settings: any) {
  return (
    settings?.data?.[0]?.setting?.seo?.["doctors-apply"] ||
    settings?.data?.[0]?.setting?.seo?.["doctor-apply"]
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const { t } = await initTranslations(locale, ["doctor-apply"]);
  const settings = await getCachedSettings(locale);
  const seo = getDoctorsApplySeo(settings);

  return createMetadata(seo, locale, "/doctors-apply", {
    title: t("seo.title", {
      defaultValue: "Join Home Healers Medical Team",
    }),
    description: t("seo.description", {
      defaultValue:
        "Apply to become a doctor in our world-class healthcare network",
    }),
    keywords: t("seo.keywords", {
      defaultValue:
        "Home Healers, doctor application, healthcare, medical professionals",
    }),
  });
}

async function DoctorApplyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const { t } = await initTranslations(locale, ["doctor-apply"]);
  const [nationalities, settings] = await Promise.all([
    ClientAPI.getNationalities(locale),
    getCachedSettings(locale),
  ]);
  const seo = getDoctorsApplySeo(settings);
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-700 to-indigo-800 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-opacity-50 bg-[url('/assets/images/medical-pattern.png')] opacity-10"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6 animate-fade-in-up">
            {seo?.[locale]?.h1 ||
              t("hero.title", { defaultValue: "Join Our Medical Team" })}
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
