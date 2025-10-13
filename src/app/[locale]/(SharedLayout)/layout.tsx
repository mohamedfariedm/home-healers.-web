import ClientAPI from "@/app/api/api";
import { Footer, Header } from "@/components/Layout";
import FloatingContact from "@/components/FloatingContact"; // 👈 add this import

export default async function Layout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const homeData = await ClientAPI.getHomeData(locale);
  const footerSection = homeData?.data?.sections.find(
    (section: any) => section?.id === 6
  );

  return (
    <>
      <Header locale={locale} />
      {children}
      <Footer section={footerSection} locale={locale} />
      <FloatingContact /> {/* 👈 Add here */}
    </>
  );
}
