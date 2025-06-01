"use client";

import initTranslations from "@/app/i18n";
import React from "react";

type PageProps = {
  params: { locale: string };
};

type CardData = {
  iconUrl: string;
  text: string;
  textColor?: string;
  containerBgColor?: string;
};

const Card: React.FC<CardData & { className?: string }> = ({
  iconUrl,
  text,
  textColor = "#1e1e1e",
  containerBgColor = "#fff",
  className = "",
}) => (
  <div
    className={`relative rounded-2xl border min-h-[174px] border-gray-200 flex-shrink-0 ${className}`}
    style={{ backgroundColor: containerBgColor }}
  >
    <div className="flex flex-col items-center gap-3 w-[166px] relative z-10">
      <div
        className="flex justify-center items-center w-18 h-18 rounded-full bg-[#eff6fe]"
        style={{ minWidth: 72, minHeight: 72 }}
      >
        <div
          className="w-12 h-12 bg-no-repeat bg-contain"
          style={{ backgroundImage: `url(${iconUrl})` }}
        />
      </div>
      <span
        className="text-center text-base font-medium truncate"
        style={{ color: textColor }}
      >
        {text}
      </span>
    </div>
  </div>
);

async function Page({ params: { locale } }: PageProps) {
  const { t } = await initTranslations(locale, ["contactUs"]);

  const topCards: CardData[] = [
    {
      iconUrl:
        "https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-27/icbGesEW92.png",
      text: "استشارة عن بعد",
      containerBgColor: "#62a0f6",
      textColor: "#fff",
    },
    {
      iconUrl:
        "https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-27/OE8rjiJjKF.png",
      text: "زيارة منزلية",
    },
  ];

  const middleCards: CardData[] = [
    {
      iconUrl:
        "https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-27/8m6KqOOY6s.png",
      text: "تأهيل مابعد العمليات الجراحية",
    },
    {
      iconUrl:
        "https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-27/kBsfEcwrnd.png",
      text: "تأهيل قلبي رئوي",
    },
    {
      iconUrl:
        "https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-27/QZQgapUTX4.png",
      text: "مشاكل صحة المرأة",
    },
    {
      iconUrl:
        "https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-27/VT54xZfZ0p.png",
      text: "اصابات الجهاز العصبي",
    },
  ];

  const bottomCards: CardData[] = [
    {
      iconUrl:
        "https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-27/9oZ4Zeb37y.png",
      text: "الاصابات العضلية المختلفة",
    },
    {
      iconUrl:
        "https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-27/onwNYksNDA.png",
      text: "علاج طبيعي عام",
    },
    {
      iconUrl:
        "https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-27/1KE8R6crpZ.png",
      text: "الاصابات العضلية المختلفة",
    },
    {
      iconUrl:
        "https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-27/CmWVaKpAZZ.png",
      text: "التحاليل الطبية",
    },
  ];

  const lastRowCards: CardData[] = [
    {
      iconUrl:
        "https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-27/niO58yKWMU.png",
      text: "آلام العضلات والمفاصل",
    },
    {
      iconUrl:
        "https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-27/mq835BL7DB.png",
      text: "تأهيل الأطفال",
    },
  ];

  return (
    <div className="mx-auto p-4 relative">
      {/* Title Section */}
      <section className="text-center mb-12 mt-12">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-white inline-block whitespace-nowrap">
          اختر{" "}
          <span className="text-[#62a0f6]">التخصص</span> الذي يناسبك
        </h1>

        <p className="mt-4 text-white text-lg max-w-xl mx-auto">
          مجموعة متنوعة من التخصصات المختلفة في جميع المجالات
        </p>
      </section>

      {/* Top Cards */}
      <section className="bg-white rounded-3xl flex flex-wrap justify-center gap-8 py-10 px-6 max-w-[1280px] mx-auto">
        {topCards.map(({ iconUrl, text, containerBgColor, textColor }, i) => (
          <Card
            key={i}
            iconUrl={iconUrl}
            text={text}
            containerBgColor={containerBgColor}
            textColor={textColor}
            className="w-full max-w-xs sm:w-[280px] shadow-md flex justify-center items-center"
          />
        ))}
      </section>

      <div
        className="absolute inset-0 top-0 h-[335px] -z-10 bg-[url('https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-27/DKXWA5Re4n.png')] bg-cover bg-center"
        aria-hidden="true"
      />

      {/* Middle Section Cards */}
      <section className="max-w-[1257px] mx-auto mt-14 px-4">
        <div className="flex flex-wrap justify-center gap-8 mb-10">
          {middleCards.map(({ iconUrl, text }, i) => (
            <Card
              key={i}
              iconUrl={iconUrl}
              text={text}
              className="w-full max-w-xs sm:w-[280px] shadow-md flex justify-center items-center"
            />
          ))}
        </div>
        <div className="flex flex-wrap justify-center gap-8 mb-10">
          {bottomCards.map(({ iconUrl, text }, i) => (
            <Card
              key={i}
              iconUrl={iconUrl}
              text={text}
              className="w-full max-w-xs sm:w-[280px] shadow-md flex justify-center items-center"
            />
          ))}
        </div>
        <div className="flex flex-wrap justify-center gap-8 items-center">
          {lastRowCards.map(({ iconUrl, text }, i) => (
            <Card
              key={i}
              iconUrl={iconUrl}
              text={text}
              className="w-full max-w-xs sm:w-[280px] shadow-md flex justify-center items-center"
            />
          ))}
          <div
            className="w-full max-w-xs shadow-md sm:w-[280px] h-[174px] rounded-3xl bg-[url('https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-27/wiFJDWAMzA.png')] bg-cover bg-center"
          />
        </div>
      </section>
    </div>
  );
}

export default Page;
