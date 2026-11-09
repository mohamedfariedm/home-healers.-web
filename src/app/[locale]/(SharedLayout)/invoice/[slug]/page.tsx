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

function firstInvoice(payload: unknown) {
  if (!payload || typeof payload !== "object") return null;
  const data = (payload as { data?: unknown }).data;
  if (Array.isArray(data)) {
    const row = data[0];
    return row && typeof row === "object" ? row : null;
  }
  if (data && typeof data === "object") return data;
  return null;
}

async function page({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  let invoice: Record<string, unknown> | null = null;
  try {
    const data = await ClientAPI.getInvoices(slug, locale);
    invoice = firstInvoice(data) as Record<string, unknown> | null;
  } catch {
    invoice = null;
  }

  if (!invoice || !invoice.invoice_number) {
    const isAr = locale === "ar";
    return (
      <div
        className="mx-auto max-w-lg px-4 py-16 text-center"
        dir={isAr ? "rtl" : "ltr"}
      >
        <h1 className="text-xl font-semibold">
          {isAr ? "الفاتورة غير متاحة" : "Invoice unavailable"}
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          {isAr
            ? "تعذر العثور على هذه الفاتورة. تحقق من الرابط أو حاول لاحقاً."
            : "This invoice could not be found. Check the link or try again later."}
        </p>
      </div>
    );
  }

  return <InvoiceView invoiceData={invoice as never} />;
}

export default page;
