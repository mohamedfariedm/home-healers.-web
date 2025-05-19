import initTranslations from "@/app/i18n";
import { BreadCrumbComponent } from "@/components/Animations/breadCrumb";

type props = {
  params: { locale: string };
};

async function page({ params: { locale } }: props) {
  const { t } = await initTranslations(locale, ["aboutUs"]);

  return (
    <>
      <div className="main-container w-full bg-[#fff] relative overflow-hidden mx-auto my-0">

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
        عن هوم هيليرز
      </div>
      <div className="mt-2 flex justify-center items-center gap-2">
        <span className="text-[#62a0f6] text-sm font-semibold">عن هوم هيليرز</span>
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

<div className="flex flex-col items-center gap-14 mt-24 w-full   mx-auto">
<div   className="flex max-w-screen-xl rtl:ltr ltr:rtl flex-col xl:flex-row gap-6 items-center justify-between w-full px-4 xl:px-0">
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


      
<div className="flex flex-col items-center gap-14 mt-24 w-full   mx-auto">
  {/* Section Heading */}
  <div className="flex flex-col items-center gap-3 text-center">
    <span className="text-[#62a0f6] text-base font-medium">
      لماذا هــومهيليرز ؟
    </span>
    <h2 className="text-[28px] sm:text-[30px] font-semibold leading-[1.4] text-[#1e1e1e]">
      <span>مزايا تجعل </span>
      <span className="text-[#62a0f6]">هوم هيليرز</span>
      <span> الخيار الأول في الوطن العربي</span>
    </h2>
  </div>

  {/* Features Grid */}
  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-[43px] w-full bg-[linear-gradient(135deg,_#143087_0%,_#111F4C_100%)]  p-[56px]">
        {/* Card 3 */}
    <div className="flex items-center gap-6">
      <div className="w-[96px] h-[120px] px-[20px] py-[32px] flex items-center justify-center bg-[#62A0F6] rounded-[5px]">
        <div className="w-[52.5px] h-[52.5px] bg-[url('https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-18/a0EeWAUs0T.png')] bg-contain bg-no-repeat" />
      </div>
      <div className="flex flex-col items-start text-start">
        <span className="text-white text-lg font-semibold">
          تعالج وانت في منزلك
        </span>
        <span className="text-white text-base font-light leading-7">
          يمكنك حجز جلسات حيث يأتي لك الطبيب في منزلك أينما توجد
        </span>
      </div>
      
    </div>
    


    {/* Card 2 */}
    <div className="flex items-center gap-6">
       <div className="w-[96px] h-[120px] px-[20px] py-[32px] flex items-center justify-center bg-[#62A0F6] rounded-[5px]">
        <div className="w-[52.5px] h-[52.5px] bg-[url('https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-18/j71hUz4G23.png')] bg-contain bg-no-repeat" />
      </div>
      <div className="flex flex-col items-start text-start">
        <span className="text-white text-lg font-semibold">
          أكثر من 15K حالة علاجية
        </span>
        <span className="text-white text-base font-light leading-7">
          عملاؤنا يشعرون بالسعادة والايجابية خلال رحلتهم العلاجية عبر هوم هيليرز
        </span>
      </div>
     
    </div>

    {/* Card 1 */}
    <div className="flex items-center gap-6">
            <div className="w-[96px] h-[120px] px-[20px] py-[32px] flex items-center justify-center bg-[#62A0F6] rounded-[5px]">
        <div className="w-[52.5px] h-[52.5px] bg-[url('https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-18/Mdh41mJVz1.png')] bg-contain bg-no-repeat" />
      </div>
      <div className="flex flex-col items-start text-start">
        <span className="text-white text-lg font-semibold">
          خطط علاجية مخصصة لك
        </span>
        <span className="text-white text-base font-light leading-7">
          أكثر من 60 خدمة طبية متنوعة وأكثر من 120 دكتور علاج طبيعي.
        </span>
      </div>

    </div>

  </div>
</div>

      <div className="w-full max-w-screen-xl mx-auto mt-24 px-4 flex flex-col gap-14 items-center">
  {/* Title Section */}
  <div className="flex flex-col items-center text-center gap-3">
    <span className="text-[#62a0f6] text-base font-medium leading-6">
      أفضل أطباء علاج طبيعي
    </span>
    <h2 className="text-[28px] sm:text-[30px] font-semibold leading-10 text-[#1e1e1e]">
      <span>نخبة من أمهر </span>
      <span className="text-[#62a0f6]">أطباء</span>
      <span> العلاج الطبيعي بالمملكة</span>
    </h2>
  </div>

  {/* Doctors Grid */}
  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-10 w-full">
    {[
      {
        image: "tbNA23TLR6.png",
        rating: "dwgAM3Od4N.png",
      },
      {
        image: "RvxhzCn35G.png",
        rating: "q1oETFEkV4.png",
      },
      {
        image: "21r9mRJf4z.png",
        rating: "WzpLXiVCY9.png",
      },
    ].map((doctor, index) => (
      <div key={index} className="relative w-full h-[500px] max-w-sm mx-auto">
        <div
          className={`absolute top-0 left-1/2 transform -translate-x-1/2 w-[85%] h-[430px] bg-cover bg-no-repeat z-10`}
          style={{
            backgroundImage: `url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-18/${doctor.image})`,
          }}
        />
        <div className="absolute top-[21%] w-full h-[73%] bg-[#eff6fe] rounded-2xl z-0" />
        <div className="absolute bottom-0 w-full bg-[#62a0f6] rounded-b-2xl pt-3 pb-3 px-6 flex flex-col gap-2 justify-center items-center z-20">
          <span className="text-white text-lg font-semibold leading-7 whitespace-nowrap">
            دكتور/ أحمد عاطف
          </span>
          <span className="text-white text-base font-light leading-8 whitespace-nowrap">
            أخصائي علاج طبيعي
          </span>
          <div
            className="w-[100px] h-[20px] bg-cover bg-no-repeat"
            style={{
              backgroundImage: `url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-18/${doctor.rating})`,
            }}
          />
        </div>
      </div>
    ))}
  </div>

  {/* Pagination Dots */}
  <div className="flex gap-4 mt-4">
    {[0, 1, 2, 3, 4].map((_, i) => (
      <div
        key={i}
        className={`w-2.5 h-2.5 rounded-full ${
          i === 2
            ? "bg-[url('https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-18/Mpx5xpAzU0.png')] bg-cover bg-no-repeat"
            : "bg-[#cee2fc]"
        }`}
      />
    ))}
  </div>
</div>

      <div className="w-full max-w-screen-xl mx-auto mt-24 px-4 flex flex-col gap-14 items-center">
  {/* Heading */}
  <div className="text-center">
    <h2 className="text-[28px] sm:text-[30px] font-semibold leading-10 text-[#1e1e1e]">
      <span>استكشف أبرز </span>
      <span className="text-[#62a0f6]">الأسئلة</span>
      <span> الشائعة</span>
    </h2>
  </div>

  {/* Content */}
  <div className="flex flex-col lg:flex-row gap-12 w-full items-start">
    {/* Contact Card */}
    <div className="relative w-full lg:w-1/2 max-w-md mx-auto bg-[#e8eaf3] bg-opacity-50 rounded-[24px] p-6 pt-24 z-0">
      <div className="flex flex-col items-center gap-6 z-10 relative">
        <div className="w-40 h-40">
          <div className="w-[114.738px] h-[127.025px] mx-auto bg-[url('https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-18/S1rR4aJeNK.png')] bg-cover bg-no-repeat" />
        </div>
        <div className="text-center">
          <h3 className="text-xl font-semibold text-[#1e1e1e]">لديك استفسار ؟</h3>
          <p className="text-lg leading-8 text-[#1e1e1e] mt-4">
            لاتتردد في التواصل مع خدمة عملاء هومهيليرز
            <br /> وسنرد عليك في أسرع وقت
          </p>
        </div>
        <button className="bg-[#143087] text-white flex items-center justify-center gap-2 rounded-lg px-6 py-3 mt-4">
          <span className="text-lg font-medium">تواصل معنا الان</span>
          <div className="w-4 h-4 bg-[url('https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-18/ReY9GDtgDV.png')] bg-cover bg-no-repeat" />
        </button>
      </div>
    </div>

    {/* FAQs */}
    <div className="w-full lg:w-1/2 flex flex-col gap-6">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="relative bg-[#e8eaf3] bg-opacity-50 rounded-[24px] p-6">
          <div className="flex items-start gap-4">
            <div className="relative w-8 h-8 shrink-0">
              <div
                className="absolute w-full h-full bg-cover bg-no-repeat"
                style={{
                  backgroundImage: `url('https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-18/B6KcNxy5Jy.png')`,
                }}
              />
              <div
                className="absolute top-2 left-2 w-5 h-5 bg-cover bg-no-repeat"
                style={{
                  backgroundImage: `url('https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-18/bP2oGS7zJE.png')`,
                }}
              />
            </div>
            <div className="flex-1">
              <h4 className="text-lg font-medium text-[#1e1e1e] mb-2">
                كيف يمكنني الحجز بسهولة في هوم هيليرز ؟
              </h4>
              {i === 0 && (
                <p className="text-sm text-[#1e1e1e] leading-7">
                  يمكنك الحجز بسهولة من خلال الضغط على زر "احجز جلستك الان"، ثم إكمال جميع خطوات التسجيل واختيار التخصص والطبيب المناسب.
                </p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
</div>

      <div className="w-full max-w-screen-xl mx-auto mt-24 px-4 flex flex-col gap-14 items-center">
  {/* Heading */}
  <div className="flex flex-col items-center text-center gap-3">
    <span className="text-[#62a0f6] text-base font-medium leading-6">
      مع من نعمل ؟
    </span>
    <h2 className="text-[28px] sm:text-[30px] font-semibold leading-10 text-[#1e1e1e]">
      شركاؤنا في رحلة النجاح
    </h2>
  </div>

  {/* Partner Logos Grid */}
  <div className="flex flex-wrap justify-center gap-8 w-full">
    {[
      "KCcDpoQzXv.png",
      "LkbvfH3ryJ.png",
    ].map((img, i) => (
      <div
        key={i}
        className="w-[180px] h-[180px] sm:w-[200px] sm:h-[200px] lg:w-[230px] lg:h-[230px] bg-cover bg-no-repeat"
        style={{
          backgroundImage: `url('https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-18/${img}')`,
        }}
      />
    ))}
  </div>

  {/* Navigation Arrows */}
  <div className="flex gap-10 mt-6">
    {[
      "GoViyKzQCs.png",
      "qBKs1Atn9m.png",
    ].map((icon, i) => (
      <div
        key={i}
        className="w-14 h-14 bg-cover bg-no-repeat"
        style={{
          backgroundImage: `url('https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-18/${icon}')`,
        }}
      />
    ))}
  </div>
</div>

    </div>
    </>
  );
}

export default page;
