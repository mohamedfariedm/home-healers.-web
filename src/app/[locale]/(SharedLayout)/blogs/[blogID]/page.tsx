import initTranslations from "@/app/i18n";
import Features from "@/components/Animations/features";
import BlogRelatedSection from "./_components/BlogSection";
import ClientAPI from "@/app/api/api";
export const dynamic = "force-dynamic";


export async function generateMetadata({
  params: { locale, blogID },
}: {
  params: { locale: string; blogID: string };
}) {
  const { t } = await initTranslations(locale, ["homepage"]);
  const settings = await ClientAPI.getSettings(locale);
  const seo = settings.data[0].setting.seo["blogs"];
  const {data} = await ClientAPI.getSingleBlog(blogID,locale);

  return {
    title: data.meta_title || "Home Hellers",
    description: data.meta_description || "Home Hellers app",
    keywords: seo.keywords || "Home Hellers, services, healthcare, clinics", // customize if needed
    alternates: {
      canonical: seo.canonical || `https://home-hellers.com/${locale}`,
    },
    icons: {
      icon: "/assets/images/favicon.ico",
    },
    openGraph: {
      title: seo.og_title || "Home Hellers",
      description: seo.og_description || "Home Hellers app",
      url: seo.canonical || `https://home-hellers.com/${locale}`,
      images: [
        {
          url: seo.og_image || "/assets/images/favicon.ico",
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: seo.twitter_title || "Home Hellers",
      description: seo.twitter_description || "Home Hellers app",
      images: [seo.twitter_image || "/assets/images/favicon.ico"],
    },
  };
}
async function page({
  params: { locale, blogID },
}: {
  params: { locale: string; blogID: string };
}) {

  const {data} = await ClientAPI.getSingleBlog(blogID,locale);
console.log("Blog Data:", data);


  return (
<div className="main-container w-full  mx-auto relative">
     <div className="w-full h-[250px] relative bg-no-repeat bg-cover bg-center" style={{ backgroundImage: 'url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-18/DFhQezQ5hS.png)' }}>
  <div className="absolute inset-0 w-full h-full bg-no-repeat bg-cover" style={{ backgroundImage: 'url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-18/0owx2TM42T.png)' }}>
    
    {/* Top Right Decorative Icons */}
    <div className="absolute top-[19.2%] left-[70.76%] w-[2.01%] h-[56.4%]">
      <div className="w-[29px] h-[29px] bg-no-repeat bg-cover" style={{ backgroundImage: 'url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-18/4QUzxCKOhU.png)' }} />
      <div className="w-[29px] h-[29px] mt-[83px] bg-no-repeat bg-cover" style={{ backgroundImage: 'url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-18/803XMdkNFA.png)' }} />
    </div>

    {/* Center Content */}
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
      <div className="text-white text-[24px] font-semibold leading-[32px]">
        المدونة
      </div>
      <div className="mt-2 flex justify-center items-center gap-2">
        <span className="text-[#62a0f6] text-sm font-semibold">المدونة</span>
        <div className="w-4 h-4 bg-no-repeat bg-cover" style={{ backgroundImage: 'url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-18/5HzeZiBmtr.png)' }} />
        <span className="text-white text-sm font-semibold">الرئيسية</span>
      </div>
    </div>

    {/* Decorative Elements */}
    <div className="absolute top-[34%] left-[14.44%] w-[2.01%] h-[11.6%] bg-no-repeat bg-cover" style={{ backgroundImage: 'url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-18/e0Abrtvom6.png)' }} />
    <div className="absolute top-[41.6%] left-[93.13%] w-[2.01%] h-[11.6%] bg-no-repeat bg-cover" style={{ backgroundImage: 'url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-18/1XdOKqGhLn.png)' }} />
    <div className="absolute top-[62.8%] left-[6.88%] w-[1.67%] h-[9.6%] bg-no-repeat bg-cover" style={{ backgroundImage: 'url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-18/3yY0wTn197.png)' }} />

  </div>
</div>

<BlogRelatedSection data={data} locale={locale}/>
</div>
  );
}

export default page;
