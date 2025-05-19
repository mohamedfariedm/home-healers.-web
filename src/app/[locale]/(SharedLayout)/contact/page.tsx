import initTranslations from "@/app/i18n";
import React from "react";
import { BreadCrumbComponent } from "@/components/Animations/breadCrumb";
import ContactForm from "./_components/ContactForm";
import LeftPart from "./_components/LeftPart";

async function page({ params: { locale } }: { params: { locale: string } }) {
  const { t } = await initTranslations(locale, ["contactUs"]);

  return (
<>
<div className="main-container w-full bg-white relative overflow-hidden mx-auto">
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
        تواصل معنا
      </div>
      <div className="mt-2 flex justify-center items-center gap-2">
        <span className="text-[#62a0f6] text-sm font-semibold">تواصل معنا</span>
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
  <div className="flex flex-col lg:flex-row gap-14 items-start w-full max-w-[1280px] mx-auto mt-20 px-4 xl:px-0 ">
       <div className="flex flex-col items-center gap-10 bg-white rounded-xl border border-[#d0d5dd] p-6 md:p-12 w-full">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-[#1e1e1e] mb-2">اتصل بنا</h2>
        <p className="text-sm text-[#736b7a]">من فضلك ادخل البيانات التالية لتتمكن من ارسال طلبك</p>
      </div>

      <form className="w-full max-w-[590px] space-y-6">
        <div className="space-y-2">
          <label className="block text-start text-sm font-medium text-[#1e1e1e]">الاسم</label>
          <input className="bg-white w-full border border-[#d0d5dd] rounded-md px-4 py-3 text-sm text-start" placeholder="ادخل الاسم كاملا" />
        </div>

        <div className="space-y-2">
          <label className="block text-start text-sm font-medium text-[#1e1e1e]">البريد الالكتروني</label>
          <input className="bg-white w-full border border-[#d0d5dd] rounded-md px-4 py-3 text-sm text-start" placeholder="ادخل البريد الالكتروني" />
        </div>

        <div className="space-y-2">
          <label className="block text-start text-sm font-medium text-[#1e1e1e]">رقم الهاتف</label>
          <div className="flex items-center border border-[#d0d5dd] rounded-md overflow-hidden">
            <div className="bg-[#e8eaf3]/50 px-3 py-2 flex items-center gap-2">
              <img src="https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-18/SUr7AzvBDd.png" className="w-6 h-6" alt="flag" />
              <span className="text-sm font-medium">+966</span>
            </div>
            <input className="bg-white flex-1 px-4 py-3 text-sm text-start" placeholder="رقم الهاتف" />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-start text-sm font-medium text-[#1e1e1e]">الرسالة</label>
          <textarea className="w-full bg-white border border-[#d0d5dd] rounded-md px-4 py-3 text-sm text-start h-40" placeholder="الرسالة"></textarea>
        </div>

        <button className="w-full bg-[#143087] text-white py-3 rounded-md flex justify-center items-center gap-2">
          <img src="https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-18/XEW1LZHYfx.png" className="w-3 h-6" alt="arrow icon" />
          <span className="text-lg font-medium">ارسال رسالتك</span>
        </button>
      </form>
    </div>
   
    <div className="flex flex-col gap-8 w-full lg:max-w-[538px]">
      <div className="flex flex-col gap-2 bg-[#143087] rounded-xl p-8 text-white">
        <div className="flex gap-4 items-center">
          <div className="w-14 h-14 bg-[#62a0f6] rounded-md flex items-center justify-center">
            <img src="https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-18/fxFV5KXUD4.png" className="w-4 h-5" alt="location icon" />
          </div>
          <div className="flex flex-col items-start text-start gap-2">
            <span className="text-lg lg:text-2xl font-semibold">قم بزيارتنا</span>
            <span className="text-sm lg:text-base">الرياض - شارع الامير عبدالعزيز بن مساعد بن جلوي</span>
          </div>
          
        </div>
      </div>

      <div className="flex flex-col gap-2 bg-[#143087] rounded-xl p-8 text-white">
        <div className="flex gap-4 items-center">
          <div className="w-14 h-14 bg-[#62a0f6] rounded-md flex items-center justify-center">
            <img src="https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-18/RKCBiHeaWM.png" className="w-5 h-4" alt="email icon" />
          </div>
          <div className="flex flex-col items-start text-start gap-2">
            <span className="text-lg lg:text-2xl font-semibold">أرسلنا عبر الايميل</span>
            <span className="text-sm lg:text-base">customer.service@home-healers.com</span>
          </div>
          
        </div>
      </div>

      <div className="flex flex-col gap-2 bg-[#143087] rounded-xl p-8 text-white">
        <div className="flex gap-4 items-center">
          <div className="w-14 h-14 bg-[#62a0f6] rounded-md flex items-center justify-center">
            <img src="https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-18/pyxgUkH7d4.png" className="w-5 h-5" alt="phone icon" />
          </div>
          <div className="flex flex-col items-start text-start gap-2">
            <span className="text-lg lg:text-2xl font-semibold">قم بالاتصال بنا</span>
            <span className="text-sm lg:text-base">0551172232</span>
          </div>
          
        </div>
      </div>
    </div>


  </div>

  <div className="max-w-[1280px] w-full h-[300px] md:h-[400px] lg:h-[570px] bg-[url('https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-18/8Zc18AXwXM.png')] bg-contain bg-no-repeat rounded-[16px] mx-auto mt-24 px-4 xl:px-0" />
</div>
</>

  );
}

export default page;
