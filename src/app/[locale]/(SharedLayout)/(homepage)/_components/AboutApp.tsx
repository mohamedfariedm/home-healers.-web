import { TFunction } from "i18next";
import Link from "next/link";

function AboutApp({ t,homeData }: { t: TFunction,homeData:any }) {
  console.log("homeData",homeData)
  return (
    <div className="flex w-full xl:w-[1280px] flex-col gap-[100px] items-start flex-nowrap relative z-[487] mt-[91px] mx-auto">

<div className="flex flex-col items-center gap-8 w-full relative">
  {/* Header */}
  <div className="flex flex-col items-center gap-12 w-full max-w-3xl text-center">
    <span className="text-primary text-base font-medium">خدمات العلاج الطبيعي والتأهيل</span>
    <h2 className="text-2xl sm:text-3xl font-semibold leading-10 text-gray-900">
      مجموعة من <span className="text-primary">الخدمات</span> الطبية المتنوعة
    </h2>
  </div>

  {/* Service Card Section */}
  <div className="w-full max-w-[1280px] flex flex-wrap justify-center gap-7">
    {/* Card */}
    <div className="relative bg-[#0077b7] rounded-3xl w-[299px] h-[352px] px-2 py-10">
      {/* Icon */}
      <div className="absolute top-6 left-2 flex flex-col items-start gap-4 px-2">
        <div className="bg-white rounded-full w-24 h-24 flex items-center justify-center">
          <div className="w-16 h-16 bg-[url('https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-11/8mBYVkntic.png')] bg-contain bg-no-repeat" />
        </div>

        <div className="text-white">
          <h3 className="text-lg font-semibold leading-7">تأهيل مابعد العمليات<br />الجراحية</h3>
          <p className="text-sm font-light leading-8 mt-1">
            دعم المرضى في فترة التعافي بعد العمليات الجراحية.
          </p>
        </div>
      </div>

      {/* Show More Button */}
      <div className="absolute bottom-4 left-4 flex items-center gap-2 text-white text-xs">
        <div className="relative w-14 h-14">
          <div className="absolute inset-0 bg-[#143087] border border-white rounded-full z-0" />
          <div className="absolute left-[7px] top-[7px] w-[42px] h-[42px] bg-[url('https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-11/JzmKYVBjKY.png')] bg-cover bg-no-repeat z-10" />
        </div>
        {/* <span>عرض المزيد</span> */}
      </div>
    </div>
  </div>

  {/* CTA Button */}
  <div className="mt-6">
    <button className="flex items-center gap-2 px-4 py-2 bg-[#143087] text-white rounded-md text-lg font-medium border border-[#143087]">
      <div className="w-6 h-6 bg-[url('https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-11/Y44LziMbcj.png')] bg-contain bg-no-repeat" />
      جميع الخدمات
    </button>
  </div>

  {/* Slider Dots */}
  <div className="flex gap-6 mt-6">
    <div className="w-2.5 h-2.5 bg-[#cee2fc] rounded-full" />
    <div className="w-2.5 h-2.5 bg-[#cee2fc] rounded-full" />
    <div className="w-2.5 h-2.5 bg-[url('https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-11/RLrCWzKCGD.png')] bg-cover bg-no-repeat rounded-full" />
  </div>
</div>
<div   className="flex rtl:ltr ltr:rtl flex-col xl:flex-row gap-6 items-center justify-between w-full px-4 xl:px-0">
   {/* Left visual block */}
   <div className="relative w-full xl:w-[597px] h-[531px]">
    {/* Background Image */}
    <div className="absolute top-0 left-0 w-[355px] h-full rounded-xl overflow-hidden">
      <img
        src="https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-05/e6d91e5a-6c54-4664-bd53-934945363f42.png"
        alt="main"
        className="w-full h-full object-cover"
      />
    </div>

    {/* Experience and secondary image */}
    <div className="absolute top-1 left-[208px] flex flex-col gap-4 items-end">
      {/* Experience Card */}
      <div className="relative w-[230px] h-[225px] bg-[#eff6fe] rounded-xl p-4">
        <div className="flex flex-col items-center gap-3 mt-6">
          <div className="w-20 h-20 bg-[#62a0f6] rounded-full flex items-center justify-center">
            <img
              src="https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-05/7b4763a4-46a6-4c35-81c1-109296c2e869.png"
              alt="icon"
              className="w-8 h-8"
            />
          </div>
          <div className="text-center">
            <h3 className="text-2xl font-semibold text-[#1e1e1e]">+20</h3>
            <p className="text-base text-[#1e1e1e]">سنوات خبرة</p>
          </div>
        </div>
      </div>

      {/* Overlay image */}
      <div className="w-full h-[280px] rounded-xl overflow-hidden">
        <img
          src="https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-05/cf6888a0-4781-4ca4-af91-4bc0bcdb45e4.png"
          alt="overlay"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  </div>
    {/* Right content block */}
  <div className="w-full xl:w-[660px] flex flex-col items-end gap-8">
    {/* Heading and Description */}
    <div className="flex flex-col items-end gap-4 text-end">
      <span className="text-[#62a0f6] text-base font-medium">عن هوم هيليرز</span>
      <h2 className="text-2xl xl:text-[30px] font-semibold text-[#1e1e1e]">
        خدمات العلاج الطبيعي والتأهيل الطبي المنزلي
      </h2>
      <p className="text-lg leading-8 text-[#1e1e1e]">
        منصة سعودية متخصصة في توفير خدمة العلاج الطبيعي والتأهيل الطبي المنزلي للعملاء في منازلهم بواسطة اختصاصيين
        مصنفين ومتميزين بكفاءة عالية طوال أيام الأسبوع وعلي مدار ٢٤ ساعة
      </p>
    </div>

    {/* Features List */}
    <div className="flex flex-col items-end gap-4 text-end">
      {[
        {
          text: 'خدمة طوال الـ 24 شاعة',
          icon: 'P1ZWy1x0G3.png',
        },
        {
          text: 'تقدم منصة هوميلرز الطبية أكثر من 60 خدمة طبية',
          icon: 'LcWdqUNGpH.png',
        },
        {
          text: 'أكثر من 100 أخصائي علاج طبيعي',
          icon: 'aycJ0EtGUG.png',
        },
      ].map((item, index) => (
        <div key={index} className="flex items-center gap-3">
          <span className="text-base xl:text-lg font-light text-[#1e1e1e] ">{item.text}</span>
          <img
            src={`https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-05/${item.icon}`}
            alt="icon"
            className="w-8 h-8"
          />
        </div>
      ))}
    </div>

    {/* CTA Button */}
    <div className="flex items-center gap-6 mt-4">
      <div className="w-14 h-14 bg-[#62a0f6] rounded-full flex items-center justify-center rotate-180">
        <img
          src="https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-05/XOZJ8mBrWT.png"
          alt="arrow"
          className="w-8 h-8"
        />
      </div>
      <button className="flex items-center gap-3 px-4 py-2 bg-[#143087] text-white rounded-md text-lg font-medium">
        <img
          src="https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-05/vqXVXwcZuR.png"
          alt="arrow"
          className="w-[6px] h-[12px] ml-2"
        />
        اكــــتشف المزيد
      </button>
    </div>
  </div>
  



</div>
</div>
  );
}

export default AboutApp;
