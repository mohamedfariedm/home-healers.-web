import initTranslations from "@/app/i18n";
import { BreadCrumbComponent } from "@/components/Animations/breadCrumb";

type props = {
  params: { locale: string };
  searchParams: {
    page: string | undefined;
    tag: string | undefined;
    sort: string | undefined;
  };
};

async function page({ params: { locale } }: props) {
  const { t } = await initTranslations(locale, ["products"]);

  return (
    <>
<div className="main-container flex w-full max-w-[1280px] justify-between items-start  relative mx-auto my-0">
    
      <aside className="hidden lg:flex w-[247px] flex-shrink-0 bg-[rgba(239,246,254,0.5)] rounded-[12px] p-4  flex-col gap-6">
          {/* You can replace this with a dynamic component later */}
          <div className="flex w-[199px] flex-col gap-[24px] items-end shrink-0 flex-nowrap relative z-[356]">
          <div className="flex w-[199px] justify-between items-start shrink-0 flex-nowrap relative z-[357]">
            <div className="w-[24px] h-[24px] shrink-0 bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-19/V5GYsWwF7O.png)] bg-cover bg-no-repeat relative overflow-hidden z-[358]" />
            <span className="flex w-[68px] h-[28px] justify-end items-start shrink-0 basis-auto  text-[18px] font-semibold leading-[28px] text-[#1e1e1e] relative text-right whitespace-nowrap z-[359]">
              الاقسام
            </span>
          </div>
          <div className="flex w-[199px] flex-col gap-[20px] items-end shrink-0 flex-nowrap relative z-[360]">
            <div className="flex w-[199px] justify-between items-center shrink-0 flex-nowrap relative z-[361]">
              <div className="w-[18px] h-[18px] shrink-0 bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-19/kL2seJvhqs.png)] bg-cover bg-no-repeat relative overflow-hidden z-[362]" />
              <div className="flex w-[95px] gap-[8px] justify-end items-center shrink-0 flex-nowrap relative z-[363]">
                <span className="flex w-[95px] h-[20px] justify-end items-start shrink-0 basis-auto  text-[14px] font-medium leading-[20px] text-[#62a0f6] relative text-right whitespace-nowrap z-[364]">
                  الكراسي الطبية
                </span>
              </div>
            </div>
            <div className="flex w-[199px] flex-col gap-[16px] items-end shrink-0 flex-nowrap relative z-[365]">
              <div className="flex w-[199px] justify-between items-center shrink-0 flex-nowrap relative z-[366]">
                <div className="w-[18px] h-[18px] shrink-0 bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-19/OLHdrVBJrL.png)] bg-cover bg-no-repeat relative overflow-hidden z-[367]" />
                <div className="flex w-[154px] gap-[8px] items-center shrink-0 flex-nowrap relative z-[368]">
                  <div className="flex w-[130px] gap-[8px] items-center shrink-0 flex-nowrap relative z-[369]">
                    <span className="flex w-[102px] h-[16px] justify-end items-start shrink-0 basis-auto  text-[12px] font-normal leading-[16px] text-[#736b7a] relative text-right whitespace-nowrap z-[370]">
                      كراسي طبي ايطالي
                    </span>
                    <div className="w-[20px] h-[20px] shrink-0 bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-19/LZc5hoLywd.png)] bg-cover bg-no-repeat relative z-[371]" />
                  </div>
                  <div className="w-[16px] h-[16px] shrink-0 bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-19/JJqM3e1HJN.png)] bg-cover bg-no-repeat relative overflow-hidden z-[372]" />
                </div>
              </div>
              <div className="flex w-[199px] justify-between items-center shrink-0 flex-nowrap relative z-[373]">
                <div className="w-[18px] h-[18px] shrink-0 bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-19/MCDtcXCjw0.png)] bg-cover bg-no-repeat relative overflow-hidden z-[374]" />
                <div className="flex w-[154px] gap-[8px] items-center shrink-0 flex-nowrap relative z-[375]">
                  <span className="flex w-[102px] h-[16px] justify-end items-start shrink-0 basis-auto  text-[12px] font-normal leading-[16px] text-[#736b7a] relative text-right whitespace-nowrap z-[376]">
                    كراسي طبي اسباني
                  </span>
                  <div className="w-[20px] h-[20px] shrink-0 bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-19/Kf0m50PxPp.png)] bg-cover bg-no-repeat relative z-[377]" />
                  <div className="w-[16px] h-[16px] shrink-0 bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-19/5CRG7erZoz.png)] bg-cover bg-no-repeat relative overflow-hidden z-[378]" />
                </div>
              </div>
              <div className="flex w-[199px] justify-between items-center shrink-0 flex-nowrap relative z-[379]">
                <div className="w-[18px] h-[18px] shrink-0 bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-19/ZYEjG8u4w4.png)] bg-cover bg-no-repeat relative overflow-hidden z-[380]" />
                <div className="flex w-[158px] gap-[8px] items-center shrink-0 flex-nowrap relative z-[381]">
                  <span className="flex w-[106px] h-[16px] justify-end items-start shrink-0 basis-auto  text-[12px] font-normal leading-[16px] text-[#736b7a] relative text-right whitespace-nowrap z-[382]">
                    كراسي محلية الصنع
                  </span>
                  <div className="w-[20px] h-[20px] shrink-0 bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-19/WPf4wYXchq.png)] bg-[length:100%_100%] bg-no-repeat relative z-[383]" />
                  <div className="w-[16px] h-[16px] shrink-0 bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-19/kSxQ9COhvL.png)] bg-cover bg-no-repeat relative overflow-hidden z-[384]" />
                </div>
              </div>
            </div>
            <div className="flex w-[199px] justify-between items-center shrink-0 flex-nowrap relative z-[385]">
              <div className="w-[18px] h-[18px] shrink-0 bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-19/Ww1sh7JBVd.png)] bg-cover bg-no-repeat relative overflow-hidden z-[386]" />
              <div className="flex w-[105px] gap-[8px] justify-end items-center shrink-0 flex-nowrap relative z-[387]">
                <span className="flex w-[105px] h-[20px] justify-end items-start shrink-0 basis-auto  text-[14px] font-medium leading-[20px] text-[#1e1e1e] relative text-right whitespace-nowrap z-[388]">
                  اكسسورات طبية
                </span>
              </div>
            </div>
            <div className="flex w-[199px] justify-between items-center shrink-0 flex-nowrap relative z-[389]">
              <div className="w-[18px] h-[18px] shrink-0 bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-19/v3MhQOkvQp.png)] bg-cover bg-no-repeat relative overflow-hidden z-[390]" />
              <div className="flex w-[118px] gap-[8px] justify-end items-center shrink-0 flex-nowrap relative z-[391]">
                <span className="flex w-[118px] h-[20px] justify-end items-start shrink-0 basis-auto  text-[14px] font-medium leading-[20px] text-[#1e1e1e] relative text-right whitespace-nowrap z-[392]">
                  سراير طبي مستورد
                </span>
              </div>
            </div>
            <div className="flex w-[199px] justify-between items-center shrink-0 flex-nowrap relative z-[393]">
              <div className="w-[18px] h-[18px] shrink-0 bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-19/i5mTGTGEZt.png)] bg-cover bg-no-repeat relative overflow-hidden z-[394]" />
              <div className="flex w-[119px] gap-[8px] justify-end items-center shrink-0 flex-nowrap relative z-[395]">
                <span className="flex w-[119px] h-[20px] justify-end items-start shrink-0 basis-auto  text-[14px] font-medium leading-[20px] text-[#1e1e1e] relative text-right whitespace-nowrap z-[396]">
                  أحذية طبية رياضية
                </span>
              </div>
            </div>
            <div className="flex w-[199px] justify-between items-center shrink-0 flex-nowrap relative z-[397]">
              <div className="w-[18px] h-[18px] shrink-0 bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-19/cfrAnfJNEA.png)] bg-cover bg-no-repeat relative overflow-hidden z-[398]" />
              <div className="flex w-[128px] gap-[8px] justify-end items-center shrink-0 flex-nowrap relative z-[399]">
                <span className="flex w-[128px] h-[20px] justify-end items-start shrink-0 basis-auto  text-[14px] font-medium leading-[20px] text-[#1e1e1e] relative text-right whitespace-nowrap z-[400]">
                  ملابس طبية رياضية
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="w-[199px] h-[0.5px] shrink-0 bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-19/jRxLfnaXjz.png)] bg-cover bg-no-repeat relative z-[401]" />
        <div className="flex w-[199px] flex-col gap-[24px] items-end shrink-0 flex-nowrap relative z-[402]">
          <div className="flex w-[199px] justify-between items-start shrink-0 flex-nowrap relative z-[403]">
            <div className="w-[24px] h-[24px] shrink-0 bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-19/avDeATxbVg.png)] bg-cover bg-no-repeat relative overflow-hidden z-[404]" />
            <span className="flex w-[60px] h-[28px] justify-end items-start shrink-0 basis-auto  text-[18px] font-semibold leading-[28px] text-[#1e1e1e] relative text-right whitespace-nowrap z-[405]">
              الماركة
            </span>
          </div>
          <div className="flex w-[121px] flex-col gap-[20px] items-end shrink-0 flex-nowrap relative z-[406]">
            <div className="flex w-[121px] gap-[8px] items-center shrink-0 flex-nowrap relative z-[407]">
              <span className="flex w-[93px] h-[16px] justify-end items-start shrink-0 basis-auto  text-[12px] font-normal leading-[16px] text-[#736b7a] relative text-right whitespace-nowrap z-[408]">
                ماركة طبية ( 40 )
              </span>
              <div className="w-[20px] h-[20px] shrink-0 bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-19/LX40BtfswZ.png)] bg-[length:100%_100%] bg-no-repeat relative z-[409]" />
            </div>
            <div className="flex w-[121px] gap-[8px] items-center shrink-0 flex-nowrap relative z-[410]">
              <span className="flex w-[93px] h-[16px] justify-end items-start shrink-0 basis-auto  text-[12px] font-normal leading-[16px] text-[#736b7a] relative text-right whitespace-nowrap z-[411]">
                ماركة طبية ( 40 )
              </span>
              <div className="w-[20px] h-[20px] shrink-0 rounded-[4px] border-solid border border-[#98a2b3] relative z-[412]" />
            </div>
            <div className="flex w-[121px] gap-[8px] items-center shrink-0 flex-nowrap relative z-[413]">
              <span className="flex w-[93px] h-[16px] justify-end items-start shrink-0 basis-auto  text-[12px] font-normal leading-[16px] text-[#736b7a] relative text-right whitespace-nowrap z-[414]">
                ماركة طبية ( 40 )
              </span>
              <div className="w-[20px] h-[20px] shrink-0 rounded-[4px] border-solid border border-[#98a2b3] relative z-[415]" />
            </div>
            <div className="flex w-[121px] gap-[8px] items-center shrink-0 flex-nowrap relative z-[416]">
              <span className="flex w-[93px] h-[16px] justify-end items-start shrink-0 basis-auto  text-[12px] font-normal leading-[16px] text-[#736b7a] relative text-right whitespace-nowrap z-[417]">
                ماركة طبية ( 40 )
              </span>
              <div className="w-[20px] h-[20px] shrink-0 rounded-[4px] border-solid border border-[#98a2b3] relative z-[418]" />
            </div>
          </div>
        </div>
        <div className="w-[199px] h-[0.5px] shrink-0 bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-19/Lqytirqng0.png)] bg-cover bg-no-repeat relative z-[419]" />
        <div className="flex w-[199px] flex-col gap-[24px] items-end shrink-0 flex-nowrap relative z-[420]">
          <div className="flex w-[199px] justify-between items-start shrink-0 flex-nowrap relative z-[421]">
            <span className="flex w-[34px] h-[22px] justify-end items-start shrink-0 basis-auto font-['Almarai'] text-[12px] font-bold leading-[22px] text-[#62a0f6] relative text-right whitespace-nowrap z-[422]">
              تطبيق
            </span>
            <span className="flex w-[50px] h-[28px] justify-end items-start shrink-0 basis-auto  text-[18px] font-semibold leading-[28px] text-[#1e1e1e] relative text-right whitespace-nowrap z-[423]">
              السعر
            </span>
          </div>
          <div className="flex w-[199px] flex-col gap-[20px] items-end shrink-0 flex-nowrap relative z-[424]">
            <div className="w-[199px] h-[3px] shrink-0 bg-[#143087] rounded-[7px] relative z-[425]" />
            <div className="flex w-[199px] gap-[7px] justify-center items-center shrink-0 flex-nowrap relative z-[426]">
              <div className="flex h-[40px] pt-[13px] pr-[12px] pb-[13px] pl-[12px] gap-[10px] justify-end items-start grow shrink-0 basis-0 flex-nowrap rounded-[2px] border-solid border-[0.5px] border-[#d0d5dd] relative z-[427]">
                <span className="flex w-[32px] h-[16px] justify-end items-start shrink-0 basis-auto  text-[12px] font-normal leading-[16px] text-[#1e1e1e] relative text-right whitespace-nowrap z-[428]">
                  2500{" "}
                </span>
              </div>
              <div className="w-[24px] h-[24px] shrink-0 bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-19/V2az3b0rxr.png)] bg-cover bg-no-repeat relative overflow-hidden z-[429]" />
              <div className="flex h-[40px] pt-[13px] pr-[12px] pb-[13px] pl-[12px] gap-[10px] justify-end items-start grow shrink-0 basis-0 flex-nowrap rounded-[2px] border-solid border-[0.5px] border-[#d0d5dd] relative z-[430]">
                <span className="flex w-[9px] h-[16px] justify-end items-start shrink-0 basis-auto  text-[12px] font-normal leading-[16px] text-[#1e1e1e] relative text-right whitespace-nowrap z-[431]">
                  0
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="w-[199px] h-[0.5px] shrink-0 bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-19/42ObP1YGCr.png)] bg-cover bg-no-repeat relative z-[432]" />
        <div className="flex w-[199px] flex-col gap-[24px] items-end shrink-0 flex-nowrap relative z-[433]">
          <div className="flex w-[199px] justify-between items-start shrink-0 flex-nowrap relative z-[434]">
            <div className="w-[24px] h-[24px] shrink-0 bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-19/DXNyEgjgzL.png)] bg-cover bg-no-repeat relative overflow-hidden z-[435]" />
            <span className="flex w-[56px] h-[28px] justify-end items-start shrink-0 basis-auto  text-[18px] font-semibold leading-[28px] text-[#1e1e1e] relative text-right whitespace-nowrap z-[436]">
              الألوان
            </span>
          </div>
          <div className="flex w-[176px] flex-col gap-[20px] items-end shrink-0 flex-nowrap relative z-[437]">
            <div className="flex w-[176px] flex-col gap-[14px] items-end shrink-0 flex-nowrap relative z-[438]">
              <div className="flex w-[176px] gap-[14px] justify-end items-start shrink-0 flex-nowrap relative z-[439]">
                <div className="w-[24px] h-[24px] shrink-0 bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-19/1vL1JhkqU5.png)] bg-cover bg-no-repeat rounded-[50%] relative z-[440]" />
                <div className="w-[24px] h-[24px] shrink-0 bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-19/9G96GCUeZk.png)] bg-cover bg-no-repeat rounded-[50%] relative z-[441]" />
                <div className="flex w-[24px] h-[24px] gap-[10px] items-start shrink-0 flex-nowrap bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-19/WJuJxhPfwy.png)] bg-cover bg-no-repeat relative z-[442]" />
                <div className="w-[24px] h-[24px] shrink-0 bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-19/oHKUj7HQ28.png)] bg-cover bg-no-repeat rounded-[50%] relative z-[443]" />
                <div className="w-[24px] h-[24px] shrink-0 bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-19/u4WmfsAaHC.png)] bg-cover bg-no-repeat rounded-[50%] relative z-[444]" />
              </div>
              <div className="flex w-[138px] gap-[14px] justify-end items-start shrink-0 flex-nowrap relative z-[445]">
                <div className="w-[24px] h-[24px] shrink-0 bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-19/C42koKtQ57.png)] bg-cover bg-no-repeat rounded-[50%] relative z-[446]" />
                <div className="w-[24px] h-[24px] shrink-0 bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-19/F1mHPU38u7.png)] bg-cover bg-no-repeat rounded-[50%] relative z-[447]" />
                <div className="w-[24px] h-[24px] shrink-0 bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-19/R1oTiuaKy6.png)] bg-cover bg-no-repeat rounded-[50%] relative z-[448]" />
                <div className="w-[24px] h-[24px] shrink-0 bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-19/UeOsezisGz.png)] bg-cover bg-no-repeat rounded-[50%] relative z-[449]" />
              </div>
            </div>
          </div>
        </div>
        <div className="w-[199px] h-[0.5px] shrink-0 bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-19/By3FSWSyev.png)] bg-cover bg-no-repeat relative z-[450]" />
        <div className="flex w-[199px] flex-col gap-[24px] items-end shrink-0 flex-nowrap relative z-[451]">
          <div className="flex w-[199px] justify-between items-start shrink-0 flex-nowrap relative z-[452]">
            <div className="w-[24px] h-[24px] shrink-0 bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-19/q1ZE7MSDGg.png)] bg-cover bg-no-repeat relative overflow-hidden z-[453]" />
            <span className="flex w-[44px] h-[26px] justify-end items-start shrink-0 basis-auto font-['Almarai'] text-[18px] font-bold leading-[26px] text-[#1e1e1e] relative text-right whitespace-nowrap z-[454]">
              الحجم
            </span>
          </div>
          <div className="flex w-[153px] flex-col gap-[20px] items-end shrink-0 flex-nowrap relative z-[455]">
            <div className="flex w-[153px] gap-[24px] justify-end items-start shrink-0 flex-nowrap relative z-[456]">
              <div className="flex w-[52px] flex-col gap-[20px] items-end shrink-0 flex-nowrap relative z-[457]">
                <div className="flex w-[35px] gap-[8px] justify-end items-center shrink-0 flex-nowrap relative z-[458]">
                  <span className="flex w-[7px] h-[16px] justify-end items-start shrink-0 basis-auto  text-[12px] font-normal leading-[16px] text-[#736b7a] relative text-right whitespace-nowrap z-[459]">
                    L
                  </span>
                  <div className="w-[20px] h-[20px] shrink-0 rounded-[4px] border-solid border border-[#98a2b3] relative z-[460]" />
                </div>
                <div className="flex w-[43px] gap-[8px] justify-end items-center shrink-0 flex-nowrap relative z-[461]">
                  <span className="flex w-[15px] h-[16px] justify-end items-start shrink-0 basis-auto  text-[12px] font-normal leading-[16px] text-[#736b7a] relative text-right whitespace-nowrap z-[462]">
                    XL
                  </span>
                  <div className="w-[20px] h-[20px] shrink-0 rounded-[4px] border-solid border border-[#98a2b3] relative z-[463]" />
                </div>
                <div className="flex w-[52px] gap-[8px] justify-end items-center shrink-0 flex-nowrap relative z-[464]">
                  <span className="flex w-[24px] h-[16px] justify-end items-start shrink-0 basis-auto  text-[12px] font-normal leading-[16px] text-[#736b7a] relative text-right whitespace-nowrap z-[465]">
                    XXL
                  </span>
                  <div className="w-[20px] h-[20px] shrink-0 rounded-[4px] border-solid border border-[#98a2b3] relative z-[466]" />
                </div>
              </div>
              <div className="flex w-[77px] flex-col gap-[20px] items-end shrink-0 flex-nowrap relative z-[467]">
                <div className="flex w-[77px] gap-[8px] justify-end items-center shrink-0 flex-nowrap relative z-[468]">
                  <div className="w-[49px] shrink-0  text-[12px] font-normal leading-[16px] relative text-right whitespace-nowrap z-[469]">
                    <span className=" text-[12px] font-normal leading-[16px] text-[#736b7a] relative text-right">
                      o
                    </span>
                    <span className=" text-[12px] font-normal leading-[16px] text-[#736b7a] relative text-right">
                      ne size
                    </span>
                  </div>
                  <div className="w-[20px] h-[20px] shrink-0 rounded-[4px] border-solid border border-[#98a2b3] relative z-[470]" />
                </div>
                <div className="flex w-[37px] gap-[8px] justify-end items-center shrink-0 flex-nowrap relative z-[471]">
                  <span className="flex w-[9px] h-[20px] justify-end items-start shrink-0 basis-auto  text-[14px] font-normal leading-[20px] text-[#736b7a] relative text-right whitespace-nowrap z-[472]">
                    S
                  </span>
                  <div className="w-[20px] h-[20px] shrink-0 bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-19/N0duLY0vWG.png)] bg-[length:100%_100%] bg-no-repeat relative z-[473]" />
                </div>
                <div className="flex w-[44px] gap-[8px] justify-end items-center shrink-0 flex-nowrap relative z-[474]">
                  <span className="flex w-[16px] h-[16px] justify-end items-start shrink-0 basis-auto  text-[12px] font-normal leading-[16px] text-[#736b7a] relative text-right whitespace-nowrap z-[475]">
                    XS
                  </span>
                  <div className="w-[20px] h-[20px] shrink-0 rounded-[4px] border-solid border border-[#98a2b3] relative z-[476]" />
                </div>
                <div className="flex w-[40px] gap-[8px] justify-end items-center shrink-0 flex-nowrap relative z-[477]">
                  <span className="flex w-[12px] h-[16px] justify-end items-start shrink-0 basis-auto  text-[12px] font-normal leading-[16px] text-[#736b7a] relative text-right whitespace-nowrap z-[478]">
                    M
                  </span>
                  <div className="w-[20px] h-[20px] shrink-0 rounded-[4px] border-solid border border-[#98a2b3] relative z-[479]" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="w-[199px] h-[0.5px] shrink-0 bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-19/uRsguPG1Qn.png)] bg-cover bg-no-repeat relative z-[480]" />
        <div className="flex w-[199px] flex-col gap-[24px] items-end shrink-0 flex-nowrap relative z-[481]">
          <div className="flex w-[199px] justify-between items-start shrink-0 flex-nowrap relative z-[482]">
            <div className="w-[24px] h-[24px] shrink-0 bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-19/Zg3ph1awPE.png)] bg-cover bg-no-repeat relative overflow-hidden z-[483]" />
            <span className="flex w-[100px] h-[26px] justify-end items-start shrink-0 basis-auto font-['Almarai'] text-[18px] font-bold leading-[26px] text-[#1e1e1e] relative text-right whitespace-nowrap z-[484]">
              تقييم العملاء
            </span>
          </div>
          <div className="flex w-[128px] flex-col gap-[20px] items-end shrink-0 flex-nowrap relative z-[485]">
            <div className="flex w-[128px] gap-[8px] justify-end items-center shrink-0 flex-nowrap relative z-[486]">
              <div className="flex w-[100px] h-[20px] items-center shrink-0 flex-nowrap bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-19/32b6UBvbsm.png)] bg-cover bg-no-repeat relative z-[487]" />
              <div className="w-[20px] h-[20px] shrink-0 rounded-[4px] border-solid border border-[#98a2b3] relative z-[488]" />
            </div>
            <div className="flex w-[128px] gap-[8px] items-center shrink-0 flex-nowrap relative z-[489]">
              <div className="flex w-[128px] gap-[8px] justify-end items-center shrink-0 flex-nowrap relative z-[490]">
                <div className="flex w-[100px] h-[20px] items-center shrink-0 flex-nowrap bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-19/0donp0MuxS.png)] bg-cover bg-no-repeat relative z-[491]" />
                <div className="w-[20px] h-[20px] shrink-0 rounded-[4px] border-solid border border-[#98a2b3] relative z-[492]" />
              </div>
            </div>
            <div className="flex w-[128px] gap-[8px] items-center shrink-0 flex-nowrap relative z-[493]">
              <div className="flex w-[128px] gap-[8px] justify-end items-center shrink-0 flex-nowrap relative z-[494]">
                <div className="flex w-[100px] h-[20px] items-center shrink-0 flex-nowrap bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-19/YgcqxmJuTi.png)] bg-cover bg-no-repeat relative z-[495]" />
                <div className="w-[20px] h-[20px] shrink-0 rounded-[4px] border-solid border border-[#98a2b3] relative z-[496]" />
              </div>
            </div>
            <div className="flex w-[128px] gap-[8px] items-center shrink-0 flex-nowrap relative z-[497]">
              <div className="flex w-[128px] gap-[8px] justify-end items-center shrink-0 flex-nowrap relative z-[498]">
                <div className="flex w-[100px] h-[20px] items-center shrink-0 flex-nowrap bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-19/Q8MV5pGkLp.png)] bg-cover bg-no-repeat relative z-[499]" />
                <div className="w-[20px] h-[20px] shrink-0 rounded-[4px] border-solid border border-[#98a2b3] relative z-[500]" />
              </div>
            </div>
          </div>
        </div>
        </aside>

       <div className="flex flex-col gap-6 items-start w-full max-w-[993px] mx-auto px-4">
  <div className="flex flex-col sm:flex-row gap-4 w-full max-w-[498px] z-[1]">
    <div className="flex flex-1 items-center gap-4 px-4 py-3 rounded-lg border border-[#d0d5dd]">
      <img src="https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-19/r9NEDJ3NsC.png" className="w-5 h-5" />
      <div className="flex justify-between items-center w-full">
        <span className="text-sm font-medium text-right text-[#1e1e1e] whitespace-nowrap">50 فى صفحة</span>
        <span className="text-xs text-right text-[#736b7a] whitespace-nowrap">عرض</span>
      </div>
    </div>
    <div className="flex flex-1 items-center gap-4 px-4 py-3 rounded-lg border border-[#d0d5dd]">
      <img src="https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-19/TDEJs9rd63.png" className="w-5 h-5" />
      <div className="flex justify-between items-center w-full">
        <span className="text-sm font-medium text-right text-[#1e1e1e] whitespace-nowrap">الأفضل تقييما</span>
        <span className="text-xs text-right text-[#736b7a] whitespace-nowrap">ترتيب حسب</span>
      </div>
    </div>
  </div>

  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 w-full z-[14]">
    {/* <!-- Repeat for each product --> */}
    <div className="relative w-full max-w-sm h-[384px] overflow-hidden z-10">
      <div className="flex flex-col items-center gap-4 w-full px-3 py-4 bg-white border border-[#d0d5dd] rounded-b-lg shadow-sm mt-[248px] z-20">
        <div className="flex flex-col gap-2 w-full items-center">
          <div className="flex justify-between w-full">
            <span className="text-xl font-semibold text-[#62a0f6] text-right">150 ر.س</span>
          </div>
          <span className="text-xl font-semibold text-[#1e1e1e] text-center whitespace-nowrap">كرسي طبي لاصابات عضلية</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs text-[#1e1e1e]">(22)</span>
          <img src="https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-19/NZdCBNc2gO.png" alt="rating" className="w-24 h-5" />
        </div>
      </div>
      <div className="absolute top-0 left-0 w-full h-[64.58%] bg-[#f2f4f7] rounded-t-lg flex justify-center items-center px-4">
        <img src="https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-19/esFCvoy5ox.png" alt="product" className="w-[226px] h-[196px] object-cover" />
        <button className="absolute top-[208px] right-0 bg-[#143087] text-white text-sm font-medium py-2 px-4 rounded-l-lg border border-[#143087] flex items-center gap-2">
          <img src="https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-19/FJU9sWjTbq.png" className="w-5 h-5" />
          أضف للسلة
        </button>
        <button className="absolute top-[208px] left-0 bg-[#62a0f6] text-white text-sm font-medium py-2 px-4 rounded-r-lg flex items-center gap-2">
          <img src="https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-19/cKTwpELgj3.png" className="w-5 h-5" />
          اشتري الان
        </button>
      </div>
      <div className="absolute top-3 right-3 bg-white rounded-full p-2">
        <img src="https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-19/iCSVZSd6ZV.png" className="w-6 h-6" />
      </div>
    </div>
    <div className="relative w-full max-w-sm h-[384px] overflow-hidden z-10">
      <div className="flex flex-col items-center gap-4 w-full px-3 py-4 bg-white border border-[#d0d5dd] rounded-b-lg shadow-sm mt-[248px] z-20">
        <div className="flex flex-col gap-2 w-full items-center">
          <div className="flex justify-between w-full">
            <span className="text-xl font-semibold text-[#62a0f6] text-right">150 ر.س</span>
          </div>
          <span className="text-xl font-semibold text-[#1e1e1e] text-center whitespace-nowrap">كرسي طبي لاصابات عضلية</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs text-[#1e1e1e]">(22)</span>
          <img src="https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-19/NZdCBNc2gO.png" alt="rating" className="w-24 h-5" />
        </div>
      </div>
      <div className="absolute top-0 left-0 w-full h-[64.58%] bg-[#f2f4f7] rounded-t-lg flex justify-center items-center px-4">
        <img src="https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-19/esFCvoy5ox.png" alt="product" className="w-[226px] h-[196px] object-cover" />
        <button className="absolute top-[208px] right-0 bg-[#143087] text-white text-sm font-medium py-2 px-4 rounded-l-lg border border-[#143087] flex items-center gap-2">
          <img src="https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-19/FJU9sWjTbq.png" className="w-5 h-5" />
          أضف للسلة
        </button>
        <button className="absolute top-[208px] left-0 bg-[#62a0f6] text-white text-sm font-medium py-2 px-4 rounded-r-lg flex items-center gap-2">
          <img src="https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-19/cKTwpELgj3.png" className="w-5 h-5" />
          اشتري الان
        </button>
      </div>
      <div className="absolute top-3 right-3 bg-white rounded-full p-2">
        <img src="https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-19/iCSVZSd6ZV.png" className="w-6 h-6" />
      </div>
    </div>
    <div className="relative w-full max-w-sm h-[384px] overflow-hidden z-10">
      <div className="flex flex-col items-center gap-4 w-full px-3 py-4 bg-white border border-[#d0d5dd] rounded-b-lg shadow-sm mt-[248px] z-20">
        <div className="flex flex-col gap-2 w-full items-center">
          <div className="flex justify-between w-full">
            <span className="text-xl font-semibold text-[#62a0f6] text-right">150 ر.س</span>
          </div>
          <span className="text-xl font-semibold text-[#1e1e1e] text-center whitespace-nowrap">كرسي طبي لاصابات عضلية</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs text-[#1e1e1e]">(22)</span>
          <img src="https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-19/NZdCBNc2gO.png" alt="rating" className="w-24 h-5" />
        </div>
      </div>
      <div className="absolute top-0 left-0 w-full h-[64.58%] bg-[#f2f4f7] rounded-t-lg flex justify-center items-center px-4">
        <img src="https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-19/esFCvoy5ox.png" alt="product" className="w-[226px] h-[196px] object-cover" />
        <button className="absolute top-[208px] right-0 bg-[#143087] text-white text-sm font-medium py-2 px-4 rounded-l-lg border border-[#143087] flex items-center gap-2">
          <img src="https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-19/FJU9sWjTbq.png" className="w-5 h-5" />
          أضف للسلة
        </button>
        <button className="absolute top-[208px] left-0 bg-[#62a0f6] text-white text-sm font-medium py-2 px-4 rounded-r-lg flex items-center gap-2">
          <img src="https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-19/cKTwpELgj3.png" className="w-5 h-5" />
          اشتري الان
        </button>
      </div>
      <div className="absolute top-3 right-3 bg-white rounded-full p-2">
        <img src="https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-19/iCSVZSd6ZV.png" className="w-6 h-6" />
      </div>
    </div>
    <div className="relative w-full max-w-sm h-[384px] overflow-hidden z-10">
      <div className="flex flex-col items-center gap-4 w-full px-3 py-4 bg-white border border-[#d0d5dd] rounded-b-lg shadow-sm mt-[248px] z-20">
        <div className="flex flex-col gap-2 w-full items-center">
          <div className="flex justify-between w-full">
            <span className="text-xl font-semibold text-[#62a0f6] text-right">150 ر.س</span>
          </div>
          <span className="text-xl font-semibold text-[#1e1e1e] text-center whitespace-nowrap">كرسي طبي لاصابات عضلية</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs text-[#1e1e1e]">(22)</span>
          <img src="https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-19/NZdCBNc2gO.png" alt="rating" className="w-24 h-5" />
        </div>
      </div>
      <div className="absolute top-0 left-0 w-full h-[64.58%] bg-[#f2f4f7] rounded-t-lg flex justify-center items-center px-4">
        <img src="https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-19/esFCvoy5ox.png" alt="product" className="w-[226px] h-[196px] object-cover" />
        <button className="absolute top-[208px] right-0 bg-[#143087] text-white text-sm font-medium py-2 px-4 rounded-l-lg border border-[#143087] flex items-center gap-2">
          <img src="https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-19/FJU9sWjTbq.png" className="w-5 h-5" />
          أضف للسلة
        </button>
        <button className="absolute top-[208px] left-0 bg-[#62a0f6] text-white text-sm font-medium py-2 px-4 rounded-r-lg flex items-center gap-2">
          <img src="https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-19/cKTwpELgj3.png" className="w-5 h-5" />
          اشتري الان
        </button>
      </div>
      <div className="absolute top-3 right-3 bg-white rounded-full p-2">
        <img src="https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-19/iCSVZSd6ZV.png" className="w-6 h-6" />
      </div>
    </div>
    {/* <!-- End of repeat --> */}
  </div>

  {/* <!-- Pagination --> */}
  <div className="flex justify-center items-center gap-4 w-full py-8">
    <img src="https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-19/KCw3HbqW1i.png" className="w-12 h-12" />
    <div className="flex gap-4 items-center">
      <span className="text-sm font-medium text-[#1e1e1e]">1</span>
      <div className="w-12 h-12 border border-[#62a0f6] text-[#62a0f6] rounded-full flex items-center justify-center text-sm font-medium">2</div>
      <span className="text-sm font-medium text-[#1e1e1e]">3</span>
      <span className="text-sm font-medium text-[#1e1e1e]">...</span>
      <span className="text-sm font-medium text-[#1e1e1e]">20</span>
    </div>
    <img src="https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-19/KZmc0MiHjz.png" className="w-12 h-12" />
  </div>
</div>
    </div>
    </>
  );
}

export default page;
