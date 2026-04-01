import initTranslations from "@/app/i18n";
import ClientAPI from "@/app/api/api";
import { createMetadata } from "@/lib/seo";
import InviteDoctorHandler from "./_components/invite-doctor-handler";

export const dynamic = "force-dynamic";

type Props = {
  params: { locale: string; token: string };
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string; token: string }> }) {
  const { locale } = await params;
  const { t } = await initTranslations(locale, ["invite-doctor"]);
  const settings = await ClientAPI.getSettings(locale);
  const seo = settings?.data?.[0]?.setting?.seo?.["invite-doctor"];

  return createMetadata(seo, locale, "/invite-doctor", {
    title: t("meta.title"),
    description: t("meta.description"),
  });
}

async function InviteDoctorPage({ params }: { params: Promise<{ locale: string; token: string }> }) {
  const { locale, token } = await params;
  const { t } = await initTranslations(locale, ["common"]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8 sm:py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <InviteDoctorHandler token={token} locale={locale} />
      </div>
    </main>
  );
}

export default InviteDoctorPage;
