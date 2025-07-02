import initTranslations from "@/app/i18n";
import { AboutAppTwoColumns } from "../(homepage)/_components";
import { DoctorsSection, FaqSection, FeaturesSection, HeroBanner, PartnersSection } from "@/components/AboutUs";
import ClientAPI from "@/app/api/api";

type props = {
  params: { locale: string };
};

async function page({ params: { locale } }: props) {
  const { t } = await initTranslations(locale, ["aboutUs"]);
  const aboutData = await ClientAPI.getAboutUs(locale);
  const doctorsData = await ClientAPI.getDoctors(locale);
  const faqsData = await ClientAPI.getFAQs(locale);
console.log(aboutData, "aboutData");

  return (
    <>
<div className="min-h-screen bg-white">
      <HeroBanner 
        title={"عن هوم هيليرز"}
        breadcrumbItems={[
          { label: "الرئيسية" },
          { label: "عن هوم هيليرز", isActive: true }
        ]}
      />

      <div className="flex flex-col items-center gap-14 mt-24 w-full mx-auto">
        <div className="flex max-w-screen-xl rtl:ltr ltr:rtl flex-col xl:flex-row gap-6 items-center justify-between w-full px-4 xl:px-0">
          {/* This is a placeholder for the AboutAppTwoColumns component which is imported in the original file */}
          <div className="w-full py-8 text-center">
            <AboutAppTwoColumns aboutHomeSection={aboutData?.data?.sections?.[0]} locale={locale} />
          </div>
        </div>
      </div>

      <FeaturesSection data={aboutData?.data?.sections?.[1]} locale={locale} />
      <DoctorsSection doctorsData={doctorsData?.data} data={aboutData?.data?.sections?.[2]} locale={locale} />
      <FaqSection faqsData={faqsData?.data} data={aboutData?.data?.sections?.[3]} locale={locale}  />
      <PartnersSection data={aboutData?.data?.sections?.[4]} locale={locale} />
    </div>
    </>
  );
}

export default page;
