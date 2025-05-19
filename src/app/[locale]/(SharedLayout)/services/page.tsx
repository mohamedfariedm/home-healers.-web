import initTranslations from "@/app/i18n";
import { BreadCrumbComponent } from "@/components/Animations/breadCrumb";

type props = {
  params: { locale: string };
};

async function page({ params: { locale } }: props) {
  const { t } = await initTranslations(locale, ["aboutUs"]);

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
        خدماتنا
      </div>
      <div className="mt-2 flex justify-center items-center gap-2">
        <span className="text-[#62a0f6] text-sm font-semibold">خدماتنا</span>
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

         <div className="max-w-screen-xl mx-auto px-4 mt-12 flex flex-col lg:flex-row gap-8">
        {/* Side Services */}
    <div className="w-full lg:w-[380px] flex flex-col gap-4">
      {[
        { text: "تأهيل مابعد العمليات الجراحية", icon: "RAxcwBhKqg.png", active: true },
        { text: "تأهيل الأطفال بمختلف الأعمار", icon: "zDOkTCzaEX.png" },
        { text: "علاج آلام العضلات والمفاصل", icon: "MQC2zoUZQM.png" },
        { text: "علاج الإصابات العضلية المختلفة", icon: "WG9Qhmvk1g.png" },
        { text: "تأهيل قلبي رئوي", icon: "1OTWy7DGWu.png" },
        { text: "مشاكل صحة المرأة", icon: "Xm3qJH6fOY.png" },
        { text: "اصابات الجهاز العصبي", icon: "Lrmqrcp4zr.png" },
        { text: "علاج طبيعي عام", icon: "MRi59rHcwQ.png" },
      ].map(({ text, icon, active }, idx) => (
        <div
          key={idx}
          className={`flex items-center gap-[10px] p-3 border rounded-md ${active ? 'bg-[#EFF6FE] border-[#62A0F6]' : 'border-[#62A0F6]'}`}
        >
          <div className={`w-10 h-10 flex items-center justify-center rounded-full ${active ? 'bg-[#62A0F6]' : ''}`}>
            <img
              src={`https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-05/${icon}`}
              className="w-5 h-5"
              alt=""
            />
          </div>
          <span className="text-[#62A0F6] text-base font-medium text-right">{text}</span>
        </div>
      ))}
    </div>
    {/* Main Service */}
    <div className="flex-1 flex flex-col gap-8">
      <div
        className="h-72 lg:h-[456px] bg-cover bg-no-repeat rounded-2xl"
        style={{ backgroundImage: "url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-05/Owgiscuwbo.png)" }}
      />
      <div className="text-right flex flex-col gap-6">
        <h3 className="text-2xl font-medium text-[#1e1e1e]">
          تأهيل مابعد العمليات الجراحية
        </h3>
        <p className="text-lg leading-8 text-[#475467]">
         إعادة التأهيل بعد الجراحة هي مرحلة حاسمة في رحلة التعافي، فهي لا تقل أهمية عن العملية الجراحية نفسها. سواء كنت قد خضعت لجراحة عظمية، عصبية، قلبية، أو أي نوع آخر من العمليات، فإن برنامج إعادة التأهيل المصمم خصيصًا لك سيساعدك على استعادة قوتك، حركتك، واستقلاليتك بأمان وفعالية.
الأسباب الرئيسية التي تجعل إعادة التأهيل بعد الجراحة ضرورية1. استعادة القوة العضلية المفقودةبعد الجراحة، وخاصة إذا تطلبت فترة راحة طويلة، تفقد العضلات قوتها وكفاءتها.
تساعد تمارين إعادة التأهيل على:
تقوية العضلات الضعيفة
        </p>
        <button className="bg-[#143087] text-white flex items-center justify-center gap-2 px-6 py-3 rounded-md w-fit self-end">
          <img src="https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-05/ZUv8SW4gFe.png" className="w-4 h-4" />
          احجز جلستك العلاجية الان
        </button>
      </div>
    </div>


  </div>


      </div>
    </>
  );
}

export default page;
