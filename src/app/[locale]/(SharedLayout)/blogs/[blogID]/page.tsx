import initTranslations from "@/app/i18n";
import Features from "@/components/Animations/features";

async function page({
  params: { locale, blogID },
}: {
  params: { locale: string; blogID: string };
}) {


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

  <div className="flex flex-col lg:flex-row my-[106px] gap-10 max-w-screen-xl mx-auto ">
        <div className="w-full lg:w-[348px] flex flex-col gap-5">
      <div className="flex flex-col gap-5 items-start">
        <h3 className="text-right text-[30px] font-medium text-[#1e1e1e]">
          مواضيع <span className="text-[#62a0f6]">متعلقة</span>
        </h3>

        {[1, 2, 3].map((_, index) => (
          <div key={index} className="flex gap-4 items-center border-b border-[#d0d5dd] pb-5">
                        <div className="w-[104px] h-[104px] rounded-md bg-cover bg-no-repeat"
              style={{ backgroundImage: `url('https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-18/DcZcfg1h8D.png')` }} />
            <div className="flex flex-col items-start gap-1">
              <p className="text-right text-lg text-[#1e1e1e] leading-[30px]">تأهيل مابعد العمليات الجراحية</p>
              <span className="text-xs text-[#62a0f6]">3 ديسمبر 2025</span>
            </div>

          </div>
        ))}
      </div>

      <div className="flex flex-col gap-5 items-start">
        <h3 className="text-right text-[30px] font-medium text-[#1e1e1e]">هاشتجات</h3>

        <div className="flex flex-wrap justify-start gap-4">
          {["معلومات طبية", "صحة وطب", "معلومات ثقافة طبية"].map((tag, i) => (
            <div key={i} className="border border-[#d0d5dd] rounded-md px-2 py-1">
              <span className="text-[#736b7a] text-lg">{tag}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
    <div className="flex-1 flex flex-col gap-6">
      <div className="rounded-[24px] bg-cover bg-no-repeat h-[300px] md:h-[456px] w-full"
        style={{ backgroundImage: "url('https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-18/DcZcfg1h8D.png')" }} />

      <div className="flex flex-col gap-2 items-start">
        <span className="text-[#62a0f6] text-sm font-medium">3 ديسمبر 2025</span>

        <div className="flex flex-col gap-6 items-start">
          <h2 className="text-2xl md:text-[30px] font-medium text-right text-[#1e1e1e]">تأهيل مابعد العمليات الجراحية</h2>
          <p className="text-right text-[#475467] text-base md:text-xl leading-loose">
            إعادة التأهيل بعد الجراحة هي مرحلة حاسمة في رحلة التعافي، فهي لا تقل أهمية عن العملية الجراحية نفسها...<br />
            الأسباب الرئيسية التي تجعل إعادة التأهيل بعد الجراحة ضرورية... تقوية العضلات الضعيفة
          </p>
        </div>
      </div>

<div className="flex justify-end">

      <div className="flex items-center gap-2 border border-[#143087] rounded-md px-2 py-2 w-fit">
        <span className="text-sm font-medium text-[#143087]">مشاركة المقال</span>
        <div className="w-6 h-6 bg-cover bg-no-repeat"
          style={{ backgroundImage: "url('https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-18/ZPsHKGyuOB.png')" }} />
      </div>
</div>
    </div>


  </div>
</div>
  );
}

export default page;
