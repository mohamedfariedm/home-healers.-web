import ClientAPI from "@/app/api/api";
import initTranslations from "@/app/i18n";
import InvoiceView from "@/components/invoiceView";
import { log } from "console";
export const dynamic = "force-dynamic";

type Props = {
  params: { locale: string; slug: string };
};

// Static metadata for Invoice Page SEO
export async function generateMetadata({ params: { locale, slug } }: Props) {
  const { t } = await initTranslations(locale, ["invoice"]);

  const title = t("invoice_page.title", { invoiceId: slug });
  const description = t("invoice_page.description");
  const keywords = t("invoice_page.keywords");
  const canonical = `https://home-hellers.com/${
    locale === "ar" ? "" : "en"
  }/invoice/${slug}`;

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical,
    },
    icons: {
      icon: "/assets/images/favicon.ico",
    },
    openGraph: {
      title,
      description,
      url: canonical,
      images: ["/assets/images/invoice-og-image.png"],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/assets/images/invoice-twitter-image.png"],
    },
  };
}

async function page({ params: { locale, slug } }: Props) {
  const { t } = await initTranslations(locale, ["invoice"]);
  const data = await ClientAPI.getInvoices(slug, locale);
  log("Invoice Data:", data);
  return <InvoiceView invoiceData={data?.data[0]} />;
}

export default page;
