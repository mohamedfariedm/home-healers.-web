import initTranslations from "@/app/i18n";
import BookingFlow from "./_components/booking-flow";

type PageProps = {
  params: { locale: string };
};

 async function Page({ params: { locale } }: PageProps) {
  const { t } = await initTranslations(locale, ["aboutUs"]);
  return (
<BookingFlow/>
);
}

export default Page;
