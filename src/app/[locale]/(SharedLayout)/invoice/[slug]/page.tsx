import ClientAPI from "@/app/api/api";
import initTranslations from "@/app/i18n";
import InvoiceView from "@/components/invoiceView";
import { createNoIndexMetadata } from "@/lib/seo";
export const dynamic = "force-dynamic";

type Props = {
  params: { locale: string; slug: string };
};

// Static metadata for Invoice Page SEO
export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const { t } = await initTranslations(locale, ["invoice"]);

  return createNoIndexMetadata(locale, `/invoice/${slug}`, {
    title: t("invoice_page.title", { invoiceId: slug }),
    description: t("invoice_page.description"),
  });
}

async function page({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const { t } = await initTranslations(locale, ["invoice"]);
  const data = await ClientAPI.getInvoices(slug, locale);
  return <InvoiceView invoiceData={data?.data[0]} />;
}

export default page;
