import initTranslations from "@/app/i18n";
import { BreadCrumbComponent } from "@/components/Animations/breadCrumb";
import { Blogs } from "../(homepage)/_components";
import HomeAPI from "../../../api/api";

type props = {
  params: { locale: string };
  searchParams: {
    page: string | undefined;
    tag: string | undefined;
    sort: string | undefined;
  };
};

interface ArticleData {
  name: string;
  description: string;
  url: string;
}


async function page({ params: { locale } }: props) {
  const { t } = await initTranslations(locale, ["blog"]);

  const NewsBlogData = await HomeAPI.getNewsBlogData(locale);

// const data : ArticleData[]=[
//   {
//     title: t("articles.list.0.title"),
//     description: t("articles.list.0.description"),
//     url: "/assets/images/articles/3.svg",
//   },
//   {
//     title: t("articles.list.1.title"),
//     description: t("articles.list.1.description"),
//     url: "/assets/images/articles/2.svg",
//   },
//   {
//     title: t("articles.list.2.title"),
//     description: t("articles.list.2.description"),
//     url: "/assets/images/articles/1.svg",
//   },
//   {
//     title: t("articles.list.1.title"),
//     description: t("articles.list.1.description"),
//     url: "/assets/images/articles/2.svg",
//   },
//   {
//     title: t("articles.list.2.title"),
//     description: t("articles.list.2.description"),
//     url: "/assets/images/articles/1.svg",
//   },
//   {
//     title: t("articles.list.0.title"),
//     description: t("articles.list.0.description"),
//     url: "/assets/images/articles/3.svg",
//   },
//   {
//     title: t("articles.list.2.title"),
//     description: t("articles.list.2.description"),
//     url: "/assets/images/articles/1.svg",
//   },
//   {
//     title: t("articles.list.1.title"),
//     description: t("articles.list.1.description"),
//     url: "/assets/images/articles/2.svg",
//   },
//   {
//     title: t("articles.list.2.title"),
//     description: t("articles.list.2.description"),
//     url: "/assets/images/articles/1.svg",
//   },
// ]
  return (
    <>
    <div className="main-container w-full  bg-[#fff] relative overflow-hidden mx-auto my-0">
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

<div className="max-w-screen-xl mx-auto px-4 py-16">
  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-10">
    {[
      {
        image: "jdGR6vHAgn.png",
        icon: "1di6rA4HpR.png",
      },
      {
        image: "jdGR6vHAgn.png",
        icon: "1di6rA4HpR.png",
      },
      {
        image: "jdGR6vHAgn.png",
        icon: "1di6rA4HpR.png",
      },
      {
        image: "jdGR6vHAgn.png",
        icon: "1di6rA4HpR.png",
      },
      {
        image: "jdGR6vHAgn.png",
        icon: "1di6rA4HpR.png",
      },
      {
        image: "jdGR6vHAgn.png",
        icon: "1di6rA4HpR.png",
      },
      {
        image: "jdGR6vHAgn.png",
        icon: "1di6rA4HpR.png",
      },
      {
        image: "jdGR6vHAgn.png",
        icon: "1di6rA4HpR.png",
      },
      {
        image: "jdGR6vHAgn.png",
        icon: "1di6rA4HpR.png",
      },
    ].map((card, i) => (
      <div
        key={i}
        className="relative w-full max-w-[400px] h-[550px] bg-[#eff6fe] rounded-[24px] overflow-hidden mx-auto"
      >
        {/* Image */}
        <div
          className="h-[268px] bg-cover bg-no-repeat rounded-[20px] m-4"
          style={{
            backgroundImage: `url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-18/${card.image})`,
          }}
        />

        {/* Content */}
        <div className="flex flex-col gap-5 px-6 pt-4 text-right">
          <span className="text-[#62a0f6] text-sm font-medium">3 ديسمبر 2025</span>
          <h3 className="text-xl font-semibold text-[#1e1e1e] whitespace-nowrap">
            اخر تطورات المجال الطبي
          </h3>
          <p className="text-sm text-[#1e1e1e] leading-8 font-light">
            هنا يكتب وصف بسيط عن المنتج في سطرين كمثال , هنا يكتب وصف بسيط عن المنتج في سطرين كمثال.
          </p>
        </div>

        {/* Button */}
        <div className="absolute bottom-6 left-6">
          <div className="relative w-14 h-14">
            <div
              className="absolute w-10 h-10 bg-cover bg-no-repeat z-10"
              style={{
                backgroundImage: `url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-18/${card.icon})`,
              }}
            />
            <div className="absolute top-0 left-0 w-14 h-14 rounded-full border border-white bg-[#143087] z-0" />
            <span className="absolute bottom-[-20px] right-[-16px] text-xs text-white whitespace-nowrap z-20">
              عرض المزيد
            </span>
          </div>
        </div>
      </div>
    ))}
  </div>
</div>

<div className="w-full flex justify-center mt-12">
  <div className="flex items-center gap-6">
    {/* Previous Arrow */}
    <div
      className="w-12 h-12 bg-cover bg-no-repeat"
      style={{
        backgroundImage: `url('https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-18/CTHwZH3wKf.png')`,
      }}
    />

    {/* Page Numbers */}
    <div className="flex gap-6 items-center rounded-full">
      <span className="text-xs font-medium text-[#1e1e1e]">1</span>

      <div className="w-12 h-12 border border-[#62a0f6] rounded-full flex items-center justify-center">
        <span className="text-xs font-medium text-[#62a0f6]">2</span>
      </div>

      <span className="text-xs font-medium text-[#1e1e1e]">3</span>
      <span className="text-sm font-medium text-[#1e1e1e]">.....</span>
      <span className="text-xs font-medium text-[#1e1e1e]">20</span>
    </div>

    {/* Next Arrow */}
    <div
      className="w-12 h-12 bg-cover bg-no-repeat"
      style={{
        backgroundImage: `url('https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-18/tSoizEiGCj.png')`,
      }}
    />
  </div>
</div>
    </div>
    </>
  );
}

export default page;
