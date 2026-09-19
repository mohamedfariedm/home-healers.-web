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
    <div className="min-h-screen bg-gradient-to-br from-[#eff6fe] via-white to-[#ebfdf2]">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#143087] via-[#1d3fa3] to-[#62a0f6] py-16 text-white sm:py-20">
        <div className="absolute inset-0 bg-[url('/assets/images/medical-pattern.png')] opacity-10"></div>
        <div className="container relative z-10 mx-auto px-4 text-center">
          <h1 className="mb-5 text-3xl font-extrabold leading-tight sm:mb-6 sm:text-4xl md:text-5xl">
            {seo?.[locale]?.h1 ||
              t("hero.title", { defaultValue: "Join Our Medical Team" })}
          </h1>
          <p className="mx-auto mb-8 max-w-3xl text-base text-blue-100 sm:text-xl md:text-2xl">
            {t("hero.subtitle", {
              defaultValue:
                "Apply to become part of our world-class healthcare network. Your expertise can make a difference in patients' lives.",
            })}
          </p>
          <a
            href="#apply-form"
            className="inline-block rounded-full bg-white px-8 py-3 font-semibold text-[#143087] shadow-[0_12px_28px_rgba(8,20,60,0.2)] transition-all duration-300 hover:bg-[#eff6fe]"
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
