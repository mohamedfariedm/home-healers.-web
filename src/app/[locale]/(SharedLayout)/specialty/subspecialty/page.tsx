"use client";

import AddPatientModal from "@/components/add-patient-modal";
import AppointmentDatePickerModal from "@/components/appointment-date-picker-modal";
import LocationPickerModal from "@/components/location-picker-modal";
import SessionSelectorModal from "@/components/session-selector-modal";
import SymptomsSearchModal from "@/components/symptoms-search-modal";
import { Check, CheckCircle, ChevronDown, ChevronLeft, Clock, CreditCard, FileText, Gift, Mic, Paperclip, Plus, Receipt, Star, Tag, User, Video } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

type PageProps = {
  params: { locale: string };
};

 function Page({ params: { locale } }: PageProps) {
  const { t } = useTranslation("contactUs");
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isModalOpenDate, setIsModalOpenDate] = useState(false)
  const [isDetailedProfileOpen, setIsDetailedProfileOpen] = useState(false)

    const [isLocationsOpen, setIsLocationsOpen] = useState(false)
  const [isLocationPickerOpen, setIsLocationPickerOpen] = useState(false)
    const [isSymptomsSearchOpen, setIsSymptomsSearchOpen] = useState(false)

      const [isSessionSelectorOpen, setIsSessionSelectorOpen] = useState(false)

        const [isAddPatientOpen, setIsAddPatientOpen] = useState(false)
  const conditions = [
    "التهاب الشعب الهوائية و الجيوب الأنفية",
    "التهابات الأذن الداخلية و الخارجية",
    "اضطرابات التبول و الافرازات",
    "اضطرابات التبول و الافرازات",
    "اضطرابات التبول و الافرازات",
    "اضطرابات التبول و الافرازات",
    "اضطرابات التبول و الافرازات",
    "التهاب الشعب الهوائية و الجيوب الأنفية",
  ]

    const [selectedLocation, setSelectedLocation] = useState<number>(1)


  const locations: Location[] = [
    {
      id: 1,
      title: "الرياض - السعودية",
      address: "السعودية - الرياض - شارع الامير محمد بن سلمان",
      iconUrl: "https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-29/OimPRcCr7m.png",
      isSelected: true,
    },
    {
      id: 2,
      title: "الرياض - السعودية",
      address: "السعودية - الرياض - شارع الامير محمد بن سلمان",
      iconUrl: "https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-29/Td0CfY2fe4.png",
    },
    {
      id: 3,
      title: "الرياض - السعودية",
      address: "السعودية - الرياض - شارع الامير محمد بن سلمان",
      iconUrl: "https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-29/052UH1ExXW.png",
    },
    {
      id: 4,
      title: "الرياض - السعودية",
      address: "السعودية - الرياض - شارع الامير محمد بن سلمان",
      iconUrl: "https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-29/tmY8LHABbL.png",
    },
  ]



  return (
<>
      <div className="main-container w-full  mx-auto flex flex-col items-center relative my-0 px-4 sm:px-6 lg:px-8">
      <div className="w-full h-[247px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-27/dw6xSVLu5N.png)] bg-[length:100%_100%] bg-no-repeat absolute top-0 left-0 -z-10" />
        {/* Breadcrumbs */}
        <div className="w-full flex flex-wrap gap-1 justify-start items-center relative z-10 mt-8 px-2 sm:px-0">
          <span className="text-sm font-normal leading-5 text-white whitespace-nowrap">
            اختيار الدكتور
          </span>
          <div
            className="w-4 h-4 bg-[url('https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-27/VdrOBac2PR.png')] bg-cover bg-no-repeat"
            aria-hidden="true"
          />
          <span className="text-sm font-normal leading-5 text-white whitespace-nowrap">
            التخصصات الطبية
          </span>
          <div
            className="w-4 h-4 bg-[url('https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-27/8CE4QNSbXz.png')] bg-cover bg-no-repeat"
            aria-hidden="true"
          />
          <span className="text-sm font-normal leading-5 text-white whitespace-nowrap">
            الرئيسية
          </span>
        </div>

        {/* Steps Section */}
        <div className="relative w-full max-w-[600px] mt-8">
          <div className="flex flex-wrap justify-center gap-6">
            {/* Step item */}
            {[
              {
                step: "الخطوة الأولي",
                desc: "(اختيار التخصص)",
                color: "bg-[#12b669]",
                textColor: "text-[#12b669]",
                barColor: "bg-[#12b669]",
                iconUrl:
                  "https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-27/7u7JoCvVJN.png",
              },
              {
                step: "الخطوة الثانية",
                desc: "(اختيار الطبيب)",
                color: "bg-white",
                textColor: "text-white",
                barColor: "bg-white",
                iconUrl:
                  "https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-27/Zf0NYybddq.png",
              },
              {
                step: "الخطوة الثالثة",
                desc: "(بيانات المريض)",
                color: "bg-white",
                textColor: "text-white",
                barColor: "bg-white",
                iconUrl:
                  "https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-27/YMhmXMOqwu.png",
              },
              {
                step: "الخطوة الرابعة",
                desc: "(الدفع)",
                color: "bg-white",
                textColor: "text-white",
                barColor: "bg-white",
                iconUrl:
                  "",
              },
            ].map(({ step, desc, color, textColor, barColor, iconUrl }, i) => (
              <div
                key={i}
                className="flex items-center justify-center gap-2 w-24 shrink-0"
              >
                <div className="flex flex-col items-center gap-2 w-24 shrink-0">
                <span
                  className={`text-sm font-semibold leading-5 whitespace-nowrap text-center ${textColor}`}
                >
                  {step}
                </span>
                <span
                  className={`text-xs font-normal leading-4 whitespace-nowrap text-center ${textColor}`}
                >
                  {desc}
                </span>
                <div
                  className={`h-1 w-full rounded-full ${barColor} mb-2`}
                />

                </div>

                <div
                  className={`w-4 h-4 shrink-0 bg-cover bg-no-repeat`}
                  style={{ backgroundImage: `url(${iconUrl})` }}
                  aria-hidden="true"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Search Container */}
        <div className="w-full bg-white rounded-2xl shadow-md mt-10 p-6 flex flex-col gap-6 max-w-[1280px]">
          {/* Top Row */}
          <div className="flex flex-wrap gap-4 items-center justify-between">
            
              <button className="flex justify-between items-center gap-2 w-48 h-12 bg-[#fff] rounded-lg border border-gray-300 px-3">
                <span className="text-sm text-[#1e1e1e]">اختر الحي</span>
                <div
                  className="w-4 h-4 bg-[url('https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-27/08wBGQac9C.png')] bg-cover bg-no-repeat"
                  aria-hidden="true"
                />
              </button>

              <button className="flex items-center justify-between gap-2 w-48 h-12 bg-[#fff] rounded-lg border border-gray-300 px-3">
                <span className="text-sm text-[#1e1e1e]">اختر المدينة</span>
                <div
                  className="w-4 h-4 bg-[url('https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-27/LDCBBi20RB.png')] bg-cover bg-no-repeat"
                  aria-hidden="true"
                />
              </button>
            <input
              type="text"
              placeholder="او اكتب اسم المنطقة هنا...."
              className="flex-grow bg-white min-w-[200px] h-12 border border-gray-300 rounded-lg px-3 py-2 text-gray-700 placeholder-gray-400"
            />
            <div className="bg-blue-100 text-blue-500 rounded-lg px-2 py-2 text-sm font-medium whitespace-nowrap">
              عنوان ســـابـــق
            </div>
            </div>

          {/* Bottom Row */}
          <div className="flex flex-wrap gap-4 items-center justify-between">
            

              <button className="flex items-center justify-between gap-2 w-48 h-12 bg-white rounded-lg border border-gray-300 px-3">
                <span className="text-sm text-[#1e1e1e]">اختر التخصص</span>
                <div
                  className="w-4 h-4 bg-[url('https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-27/C7wy25OYBB.png')] bg-cover bg-no-repeat"
                  aria-hidden="true"
                />
              </button>
              <input
                type="text"
                placeholder="ابحث عن طبيب او مستشفي هنا"
                className="flex-grow bg-white min-w-[250px]  h-12 border border-gray-300 rounded-lg px-3 py-2 text-gray-700 placeholder-gray-400"
              />
            <button className="flex items-center gap-1 w-[117px] h-12 bg-[#143087] rounded-lg px-2 text-white">
              ابحث الان
              <div
                className="w-6 h-6 bg-[url('https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-27/7VU326WoYM.png')] bg-cover bg-no-repeat"
                aria-hidden="true"
              />
            </button>
              
          </div>
        </div>
        {/* Consultation Section */}
        <div className="w-full max-w-[1280px] relative z-20 mt-10 px-4 sm:px-6 lg:px-0 mx-auto">
  {/* Container */}
  <div className="flex flex-col gap-6 items-start">
    {/* First text section */}
    <div className="flex flex-col items-start gap-4">
      <h2 className="text-center sm:text-start text-lg sm:text-xl font-bold leading-7 text-[#1e1e1e] whitespace-normal">
        هل ترغب في الحصول على المساعدة لاختيار العيادة المناسبة؟
      </h2>
      <p className="mt-2 text-base leading-6 text-[#1e1e1e] text-right max-w-full">
        قم بإدخال الاعراض وسنوجهك إلى العيادة والطبيب المناسبين يتم البحث عن أطباء حسب الأعراض
      </p>
      <button className="mt-4 px-6 py-3 bg-[#62a0f6] rounded-lg text-white font-normal text-base flex items-center gap-2">
        ابحث عن طبيب حسب الاعراض
        <div
          className="w-6 h-6 bg-[url('https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-27/PGJRK1y8BJ.png')] bg-cover bg-no-repeat"
          aria-hidden="true"
        />
      </button>
    </div>

    {/* Divider */}
    <div className="w-full h-px bg-[url('https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-27/2BTt8vP1mK.png')] bg-cover bg-no-repeat" />

    {/* Second text section */}
    <div className="max-w-xl">
      <h2 className="text-center sm:text-start text-lg sm:text-xl font-bold leading-7 text-[#1e1e1e] whitespace-normal">
        من فضلك ساعدنا باختيار نوع الاستشارة ومن ثم أكمل الخطوات
      </h2>
    </div>

    {/* Consultation cards section */}
    <section className="w-full flex flex-wrap gap-6 justify-center">
      {[
        {
          title: t("استشارة فورية"),
          icon: "yvpSVLkvXh",
          bgColor: "bg-white border border-[#f2f4f7]",
          textColor: "text-[#1e1e1e]",
        },
        {
          title: t("استشارة فورية"),
          icon: "yvpSVLkvXh",
          bgColor: "bg-white border border-[#f2f4f7]",
          textColor: "text-[#1e1e1e]",
        },
        {
          title: t("استشارة فورية"),
          icon: "yvpSVLkvXh",
          bgColor: "bg-white border border-[#f2f4f7]",
          textColor: "text-[#1e1e1e]",
        },
        {
          title: t("طب الأسرة"),
          icon: "94VmCEPAbF",
          bgColor: "bg-[#62a0f6]",
          textColor: "text-white",
        },
        {
          title: t("استشارة فورية"),
          icon: "QEdToK4EUj",
          bgColor: "bg-white border border-[#f2f4f7]",
          textColor: "text-[#1e1e1e]",
        },
        {
          title: t("استشارة فورية"),
          subtitle: t("استشارة فورية خلال ٥ دقائق"),
          icon: "82NaGR4d0s",
          bgColor: "bg-white",
          textColor: "text-[#1e1e1e]",
        },
      ].map(({ title, subtitle, icon, bgColor, textColor }, i) => (
        <div
          key={i}
          className={`${bgColor} rounded-3xl shadow-md w-full max-w-[295px] h-[96px] p-6 flex flex-col justify-center items-start`}
        >
          <div className="flex w-full max-w-[191px] h-[72px] gap-3 justify-center items-center">
            <div className="flex justify-center items-center w-18 h-18 p-4 rounded-full bg-[#eff6fe]">
              <div
                className="w-[36.572px] h-12 bg-no-repeat bg-contain"
                style={{
                  backgroundImage: `url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-27/${icon}.png)`,
                  marginLeft: "5.7px",
                }}
              />
            </div>
            <div className="flex flex-col items-start gap-3 w-[106px]">
              <span
                className={`${textColor} text-base font-medium leading-6 text-center whitespace-nowrap`}
              >
                {title}
              </span>
              {subtitle && (
                <span className="text-xs font-normal leading-4 text-[#736b7a] text-center whitespace-nowrap">
                  {subtitle}
                </span>
              )}
            </div>
            
          </div>
        </div>
      ))}
    </section>
  </div>
      </div>







    {/* Search Results Section */}
<div className="w-full max-w-[1280px] relative z-20 mt-10  sm:px-6 lg:px-0 mx-auto">
     

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Filter Sidebar */}
        <div className="w-full lg:w-1/4 bg-[rgba(239,246,254,0.5)] rounded-xl p-6 order-2 lg:order-1">
          <div className="flex flex-col gap-6">
            {/* Filter by Rating */}
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-[#1e1e1e]">بواسطة التقييم</h3>
                <div className="w-6 h-6">
                  <ChevronDown className="w-6 h-6 text-black" />
                </div>
              </div>
              <div className="border-t border-gray-200 my-4"></div>
              <div className="flex flex-col gap-5">
                <div className="flex justify-start items-center gap-2">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                  <div className="w-5 h-5 rounded border border-[#98a2b3]"></div>
                </div>
                <div className="flex justify-start items-center gap-2">
                  <div className="flex">
                    {[1, 2, 3, 4].map((star) => (
                      <Star key={star} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                    ))}
                    <Star className="w-5 h-5 text-gray-300" />
                  </div>
                  <div className="w-5 h-5 rounded bg-[#143087]">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div className="flex justify-start items-center gap-2">
                  <div className="flex">
                    {[1, 2, 3].map((star) => (
                      <Star key={star} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                    ))}
                    {[1, 2].map((star) => (
                      <Star key={star} className="w-5 h-5 text-gray-300" />
                    ))}
                  </div>
                  <div className="w-5 h-5 rounded border border-[#98a2b3]"></div>
                </div>
                <div className="flex justify-start items-center gap-2">
                  <div className="flex">
                    {[1, 2].map((star) => (
                      <Star key={star} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                    ))}
                    {[1, 2, 3].map((star) => (
                      <Star key={star} className="w-5 h-5 text-gray-300" />
                    ))}
                  </div>
                  <div className="w-5 h-5 rounded border border-[#98a2b3]"></div>
                </div>
              </div>
            </div>

            {/* Filter by Experience */}
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-[#1e1e1e]">سنوات الخبرة</h3>
                <div className="w-6 h-6">
                  <Clock className="w-6 h-6 text-black" />
                </div>
              </div>
              <div className="border-t border-gray-200 my-4"></div>
              <div className="flex flex-col gap-5">
                <div className="flex justify-start items-center gap-2">
                  <span className="text-xs text-[#1e1e1e]">أكثر من سنتين +2</span>
                  <div className="w-5 h-5 rounded border border-[#98a2b3]"></div>
                </div>
                <div className="flex justify-start items-center gap-2">
                  <span className="text-xs text-[#1e1e1e]">أكثر من 3 سنوات +3</span>
                  <div className="w-5 h-5 rounded bg-[#143087]">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div className="flex justify-start items-center gap-2">
                  <span className="text-xs text-[#1e1e1e]">أكثر من 3 سنوات +3</span>
                  <div className="w-5 h-5 rounded border border-[#98a2b3]"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search Results Content */}
        <div className="w-full lg:w-3/4 flex flex-col gap-6 order-1 lg:order-2">
         {/* Search Results Header */}
      <div className="flex justify-start mb-6">
        <div className="text-center">
          <span className="text-lg font-bold text-[#1e1e1e]">نتيجة البحث </span>
          <span className="text-sm font-normal text-[#736b7a]">(10 نتيجة)</span>
        </div>
      </div>
          {/* Doctor Card 1 */}
          <div className="bg-white rounded-2xl border border-[#d0d5dd] p-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:order-2">
                
              </div>

              <div className="flex flex-col md:flex-row gap-6 flex-1 md:order-1">
                <div className="w-full md:w-[216px] h-[160px] rounded-lg overflow-hidden">
                  <Image
                    src="https://placehold.co/600x400/png"
                    alt="Doctor"
                    width={216}
                    height={160}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-col gap-3 items-start">
                  <h2 className="text-xl font-semibold text-[#1e1e1e]">د / أحمد عاطف</h2>
                  <p className="text-sm text-[#1e1e1e]">أخصائي أول</p>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                  <p className="text-sm text-[#736b7a]">وصف بسيط جدا هنا</p>
                </div>

                <div className="hidden md:block w-px h-32 bg-gray-200 mx-4"></div>

                <div className="flex flex-col gap-4 items-start">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full border border-[#d0d5dd] flex items-center justify-center">
                      <Clock className="w-5 h-5 text-[#1e1e1e]" />
                    </div>
                    <div className="text-sm">
                      <span className="text-[#b5b5b5]">الخبرة : </span>
                      <span className="text-[#1e1e1e]">4 سنوات</span>
                    </div>
                    
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full border border-[#d0d5dd] flex items-center justify-center">
                      <Video className="w-5 h-5 text-[#1e1e1e]" />
                    </div>
                    <div className="text-sm">
                      <span className="text-[#b5b5b5]">استشارة طبية فيديو : </span>
                      <span className="text-[#1e1e1e]">15 دقيقة</span>
                    </div>
                    
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full border border-[#d0d5dd] flex items-center justify-center">
                      <User className="w-5 h-5 text-[#1e1e1e]" />
                    </div>
                    <div className="text-sm">
                      <span className="text-[#b5b5b5]">التخصص العام : </span>
                      <span className="text-[#1e1e1e]">طب أسرة</span>
                    </div>
                    
                  </div>
                </div>
              </div>
            </div>

            {/* Promotion Banner */}
            <div className="mt-6 bg-[rgba(0,181,180,0.15)] rounded-xl py-1 px-4 relative flex justify-between items-center">
              <div className=" text-sm text-black">🎁 عرض خاص: خصم 20% على باقة 5 جلسات علاج طبيعي حتى نهاية الشهر!</div>
              <div className=" bg-[#00b5b4] text-white px-3 py-2 rounded-lg text-sm">
                الاستمتاع بالعرض
              </div>
            </div>

            <div className="border-t border-gray-200 my-4"></div>

            {/* Price and Actions */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-right">
                <span className="text-sm text-[#1e1e1e]">السعر : </span>
                <span className="text-lg font-bold text-[#62a0f6]">300 ريال</span>
              </div>
              <div className="flex gap-4">
                <button className="bg-[#143087] text-white rounded-xl px-4 py-3 text-sm font-semibold">
                  احجز ميعاد الان
                </button>
                <button className="bg-[#eff6fe] text-[#62a0f6] rounded-xl px-4 py-3 text-sm font-semibold">
                  رؤية الملف الشخصي
                </button>
              </div>
              
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-[#d0d5dd] p-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:order-2">
                
              </div>

              <div className="flex flex-col md:flex-row gap-6 flex-1 md:order-1">
                <div className="w-full md:w-[216px] h-[160px] rounded-lg overflow-hidden">
                  <Image
                    src="https://placehold.co/600x400/png"
                    alt="Doctor"
                    width={216}
                    height={160}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-col gap-3 items-start">
                  <h2 className="text-xl font-semibold text-[#1e1e1e]">د / أحمد عاطف</h2>
                  <p className="text-sm text-[#1e1e1e]">أخصائي أول</p>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                  <p className="text-sm text-[#736b7a]">وصف بسيط جدا هنا</p>
                </div>

                <div className="hidden md:block w-px h-32 bg-gray-200 mx-4"></div>

                <div className="flex flex-col gap-4 items-start">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full border border-[#d0d5dd] flex items-center justify-center">
                      <Clock className="w-5 h-5 text-[#1e1e1e]" />
                    </div>
                    <div className="text-sm">
                      <span className="text-[#b5b5b5]">الخبرة : </span>
                      <span className="text-[#1e1e1e]">4 سنوات</span>
                    </div>
                    
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full border border-[#d0d5dd] flex items-center justify-center">
                      <Video className="w-5 h-5 text-[#1e1e1e]" />
                    </div>
                    <div className="text-sm">
                      <span className="text-[#b5b5b5]">استشارة طبية فيديو : </span>
                      <span className="text-[#1e1e1e]">15 دقيقة</span>
                    </div>
                    
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full border border-[#d0d5dd] flex items-center justify-center">
                      <User className="w-5 h-5 text-[#1e1e1e]" />
                    </div>
                    <div className="text-sm">
                      <span className="text-[#b5b5b5]">التخصص العام : </span>
                      <span className="text-[#1e1e1e]">طب أسرة</span>
                    </div>
                    
                  </div>
                </div>
              </div>
            </div>

            {/* Promotion Banner */}
            <div className="mt-6 bg-[rgba(0,181,180,0.15)] rounded-xl py-1 px-4 relative flex justify-between items-center">
              <div className=" text-sm text-black">🎁 عرض خاص: خصم 20% على باقة 5 جلسات علاج طبيعي حتى نهاية الشهر!</div>
              <div className=" bg-[#00b5b4] text-white px-3 py-2 rounded-lg text-sm">
                الاستمتاع بالعرض
              </div>
            </div>

            <div className="border-t border-gray-200 my-4"></div>

            {/* Price and Actions */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-right">
                <span className="text-sm text-[#1e1e1e]">السعر : </span>
                <span className="text-lg font-bold text-[#62a0f6]">300 ريال</span>
              </div>
              <div className="flex gap-4">
                <button className="bg-[#143087] text-white rounded-xl px-4 py-3 text-sm font-semibold">
                  احجز ميعاد الان
                </button>
                <button className="bg-[#eff6fe] text-[#62a0f6] rounded-xl px-4 py-3 text-sm font-semibold">
                  رؤية الملف الشخصي
                </button>
              </div>
              
            </div>
          </div>

        </div>
      </div>
    </div>


{/* third Section */}
    <div className="container mx-auto px-4 py-8 max-w-6xl" >
      <div className="flex flex-col gap-10">
        {/* Doctor Information Section */}
        <div className="flex flex-col gap-4">
          <div className="flex justify-start">
            <h2 className="text-xl font-bold text-[#1e1e1e] text-center">بيانات الدكتور</h2>
          </div>

          <div className="bg-white rounded-2xl border border-[#d0d5dd] p-5">
            <div className="flex flex-col lg:flex-row gap-6 items-center">
              {/* Doctor Photo and Info */}
              <div className="flex flex-col md:flex-row gap-6 items-center lg:order-1">
                <div className="w-[216px] h-[160px] rounded-lg overflow-hidden flex-shrink-0">
                  <Image
                    src="https://placehold.co/600x400/png"
                    alt="Doctor"
                    width={216}
                    height={160}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex flex-col gap-3 items-start text-right">
                  <h3 className="text-xl font-semibold text-[#1e1e1e]">د / أحمد عاطف</h3>
                  <p className="text-sm text-[#1e1e1e]">أخصائي أول</p>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                  <p className="text-sm text-[#736b7a]">وصف بسيط جدا هنا</p>
                </div>
              </div>
              
              {/* Doctor Details */}
              <div className="flex flex-col items-center gap-6 lg:order-2 w-full lg:flex-1">
                <div className="flex flex-col md:flex-row gap-4 justify-center  items-start">
                  <div className="flex flex-col gap-4 items-start">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full border border-[#d0d5dd] flex items-center justify-center bg-white">
                      <Video className="w-5 h-5 text-[#1e1e1e]" />
                    </div>
                    <div className="text-sm">
                      <span className="text-[#b5b5b5]">استشارة طبية فيديو : </span>
                      <span className="text-[#1e1e1e]">15 دقيقة</span>
                    </div>
                    
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full border border-[#d0d5dd] flex items-center justify-center bg-white">
                      <User className="w-5 h-5 text-[#1e1e1e]" />
                    </div>
                    <div className="text-sm">
                      <span className="text-[#b5b5b5]">التخصص العام : </span>
                      <span className="text-[#1e1e1e]">طب أسرة</span>
                    </div>
                    
                  </div>

                  </div>
                <div className="flex items-center gap-2 justify-center md:justify-start">
                  <div className="w-8 h-8 rounded-full border border-[#d0d5dd] flex items-center justify-center bg-white">
                    <Clock className="w-5 h-5 text-[#1e1e1e]" />
                  </div>
                  <div className="text-sm">
                    <span className="text-[#b5b5b5]">الخبرة : </span>
                    <span className="text-[#1e1e1e]">4 سنوات</span>
                  </div>
                  
                </div>
                </div>

              </div>
              
              

              
            </div>
          </div>
        </div>

        {/* Patient Information Section */}
        <div className="flex flex-col gap-4">
          <div className="flex justify-start">
            <h2 className="text-xl font-bold text-[#1e1e1e] text-center">بيانات المريض</h2>
          </div>

          <div className="flex flex-col gap-4">
            {/* Add Patient Section */}
            <div className="bg-white rounded-2xl border border-[#d0d5dd] p-5">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <button className="flex items-center gap-2 bg-[#62a0f6] text-white rounded-lg px-3 py-3 text-sm font-medium order-2 md:order-2">
                  <Plus className="w-6 h-6" />
                  <span>اضافة المزيد من المرضي</span>
                </button>

                <div className="flex flex-col gap-3 items-start text-right order-1 md:order-1">
                  <h3 className="text-lg font-semibold text-[#62a0f6]">اسم المريض</h3>
                  <p className="text-sm text-[#1e1e1e]">يمكنك اضافة مزيد من المرضي</p>
                </div>
              </div>

              <div className="flex items-center justify-start gap-4 mt-8">
                <div className="w-12 h-12 bg-[#eff6fe] rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-[#62a0f6]" />
                </div>
                <span className="text-sm font-bold text-[#1e1e1e]">احمد عاطف</span>
              </div>
            </div>

            {/* Health Problem Description */}
            <div className="bg-white rounded-2xl border border-[#d0d5dd] p-5">
              <div className="flex flex-col gap-8">
                <div className="flex flex-col gap-3 items-start text-right">
                  <h3 className="text-lg font-semibold text-[#62a0f6] text-center">
                    اشرح المشكلة الصحية التي تعاني منها
                  </h3>
                  <p className="text-sm text-[#1e1e1e] text-center">
                    الرجاء إخبار الطبيب اذا كنت تعاني من أي مرض مزمن أو حساسية أو إذا كنت تتناول أي أدوية
                  </p>
                </div>

                <div className="flex flex-col gap-4">
                  {/* Text Note */}
                  <div className="flex items-center justify-between bg-white border border-[#d0d5dd] rounded-2xl p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-9 h-9 bg-[#eff6fe] rounded-full flex items-center justify-center">
                        <FileText className="w-6 h-6 text-[#62a0f6]" />
                      </div>
                      <div className="text-sm text-right">
                        <span className="text-[#1e1e1e]">ملاحظة نصية </span>
                        <span className="text-[#736b7a]">( اختياري )</span>
                      </div>
                      
                    </div>
                    <button className="bg-[#62a0f6] text-white rounded-lg px-3 py-2 text-sm font-medium">اضافة</button>
                  </div>

                  {/* Voice Note */}
                  <div className="flex items-center justify-between bg-white border border-[#d0d5dd] rounded-2xl p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-9 h-9 bg-[#eff6fe] rounded-full flex items-center justify-center">
                        <Mic className="w-6 h-6 text-[#62a0f6]" />
                      </div>
                      <div className="text-sm text-right">
                        <span className="text-[#1e1e1e]">ملاحظة صوتية </span>
                        <span className="text-[#736b7a]">( اختياري )</span>
                      </div>
                      
                    </div>
                    <button className="bg-[#62a0f6] text-white rounded-lg px-3 py-2 text-sm font-medium">اضافة</button>
                  </div>

                  {/* Attachments */}
                  <div className="flex items-center justify-between bg-white border border-[#d0d5dd] rounded-2xl p-6">
                    <div className="flex items-center gap-4">
                       <div className="w-9 h-9 bg-[#eff6fe] rounded-full flex items-center justify-center">
                        <Paperclip className="w-6 h-6 text-[#62a0f6]" />
                      </div>
                      <div className="text-sm text-right">
                        <span className="text-[#1e1e1e]">المرفقات </span>
                        <span className="text-[#736b7a]">( اختياري )</span>
                      </div>
                     
                    </div>
                    <button className="bg-[#62a0f6] text-white rounded-lg px-3 py-2 text-sm font-medium">اضافة</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Continue Booking Button */}
        <div className="flex justify-center">
          <button className="bg-[#143087] text-white rounded-xl px-6 py-4 text-sm font-semibold">
            متابعة الحجز الان
          </button>
        </div>
      </div>
    </div>




{/* fourth Section */}
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Right Column - Booking Details & Payment Methods */}
        <div className="flex flex-col gap-8 order-2 lg:order-1">
          {/* Booking Details Section */}
          <div className="bg-white rounded-2xl border border-[#d0d5dd] p-5">
            <div className="flex justify-between items-center mb-6">
              <div className="w-8 h-8 bg-[#62a0f6] rounded-2xl flex items-center justify-center">
                <Receipt className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-[#1e1e1e]">تفاصيل الحجز</h2>
            </div>

            <div className="bg-[#eff6fe] rounded-xl p-4">
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-[#1e1e1e]">احمد</span>
                  <span className="text-sm text-[#1e1e1e]">اسم المريض</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-[#1e1e1e]">مشاكل في العضلات</span>
                  <span className="text-sm text-[#1e1e1e]">المشكلة الصحية</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-[#1e1e1e]">Ahmed@gmail.com</span>
                  <span className="text-sm text-[#1e1e1e]">ايميل التواصل</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-[#1e1e1e]">+201155591759</span>
                  <span className="text-sm text-[#1e1e1e]">رقم الهاتف</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Methods Section */}
          <div className="bg-white rounded-2xl border border-[#d0d5dd] p-5">
            <div className="flex justify-between items-center mb-6">
              <div className="w-8 h-8 bg-[#62a0f6] rounded-2xl flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-[#1e1e1e]">طريقة الدفع</h2>
            </div>

            <div className="flex flex-col gap-4">
              {/* Apple Pay - Selected */}
              <div className="bg-[#eff6fe] rounded-xl p-4">
                <div className="flex items-center gap-4">
                  <Check className="w-6 h-6 text-[#62a0f6]" />
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-8 bg-black rounded flex items-center justify-center">
                      <span className="text-white text-xs font-bold">Pay</span>
                    </div>
                    <span className="text-sm font-semibold text-[#1e1e1e]">Apple Pay</span>
                  </div>
                </div>
              </div>

              {/* Master Card */}
              <div className="bg-white border border-[#d0d5dd] rounded-xl p-4">
                <div className="flex items-center gap-4">
                  <div className="w-6 h-6 border border-gray-300 rounded"></div>
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-8 bg-gradient-to-r from-red-500 to-yellow-500 rounded flex items-center justify-center">
                      <span className="text-white text-xs font-bold">MC</span>
                    </div>
                    <span className="text-sm font-semibold text-[#1e1e1e]">Master card</span>
                  </div>
                </div>
              </div>

              {/* Visa */}
              <div className="bg-white border border-[#d0d5dd] rounded-xl p-4">
                <div className="flex items-center gap-4">
                  <div className="w-6 h-6 border border-gray-300 rounded"></div>
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-8 bg-blue-600 rounded flex items-center justify-center">
                      <span className="text-white text-xs font-bold">VISA</span>
                    </div>
                    <span className="text-sm font-semibold text-[#1e1e1e]">Visa</span>
                  </div>
                </div>
              </div>

              {/* STC Pay */}
              <div className="bg-white border border-[#d0d5dd] rounded-xl p-4">
                <div className="flex items-center gap-4">
                  <div className="w-6 h-6 border border-gray-300 rounded"></div>
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-8 bg-purple-600 rounded flex items-center justify-center">
                      <span className="text-white text-xs font-bold">STC</span>
                    </div>
                    <span className="text-sm font-semibold text-[#1e1e1e]">Stc Pay</span>
                  </div>
                </div>
              </div>

              {/* PayPal */}
              <div className="bg-white border border-[#d0d5dd] rounded-xl p-4">
                <div className="flex items-center gap-4">
                  <div className="w-6 h-6 border border-gray-300 rounded"></div>
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-8 bg-blue-500 rounded flex items-center justify-center">
                      <span className="text-white text-xs font-bold">PP</span>
                    </div>
                    <span className="text-sm font-semibold text-[#1e1e1e]">PayPal</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Points Usage Section */}
          <div className="bg-white rounded-2xl border border-[#d0d5dd] p-5">
            <div className="flex justify-between items-center mb-6">
              <div className="w-8 h-8 bg-[#62a0f6] rounded-2xl flex items-center justify-center">
                <Gift className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-[#1e1e1e]">استخدام نقاط</h2>
            </div>

            <div className="flex justify-center mb-6">
              <div className="w-[138px] h-[78px] bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">نقاط المكافآت</span>
              </div>
            </div>

            <div className="bg-[#eff6fe] rounded-xl p-4">
              <div className="flex flex-col gap-3">
                <span className="text-sm text-[#1e1e1e] text-right">رقم الهاتف</span>
                <div className="flex">
                  <div className="flex items-center bg-[rgba(232,234,243,0.5)] rounded-r-lg px-2 py-3 border border-[#d0d5dd]">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-[#1e1e1e]">+966</span>
                      <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                        <span className="text-white text-xs">🇸🇦</span>
                      </div>
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </div>
                  <input
                    type="text"
                    className="flex-1 px-3 py-3 border border-[#d0d5dd] rounded-l-lg focus:outline-none focus:ring-2 focus:ring-[#62a0f6]"
                    placeholder="أدخل رقم الهاتف"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        
        {/* Left Column - Discount & Payment Summary */}
        <div className="flex flex-col gap-12 order-1 lg:order-2">
          {/* Discount Coupon Section */}
          <div className="bg-white rounded-2xl border border-[#d0d5dd] p-5">
            <div className="flex justify-center mb-6">
              <h2 className="text-xl font-bold text-[#1e1e1e]">كوبون الخصم</h2>
            </div>

            <div className="bg-[#eff6fe] rounded-xl p-4">
              <div className="flex justify-between items-center gap-4">
                <button className="bg-[#62a0f6] text-white rounded-lg px-3 py-2 text-sm font-medium">استخدام</button>
                <div className="flex items-center gap-2 flex-1">
                  <span className="text-sm text-[#b5b5b5] text-right">أضف كوبون الخصم هنا</span>
                  <Tag className="w-6 h-6 text-[#62a0f6]" />
                </div>
              </div>
            </div>
          </div>

          {/* Payment Summary Section */}
          <div className="bg-white rounded-2xl border border-[#d0d5dd] p-5">
            <div className="flex justify-center mb-6">
              <h2 className="text-xl font-bold text-[#1e1e1e]">ملخص الدفع</h2>
            </div>

            <div className="bg-[#eff6fe] rounded-xl p-4">
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-[#1e1e1e]">احمد</span>
                  <span className="text-sm text-[#1e1e1e]">الاجمالي الفرعي ( 1 عنصر )</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-[#1e1e1e]">100 ريال</span>
                  <span className="text-sm text-[#1e1e1e]">رسوم الزيارة المنزلية</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-[#1e1e1e]">20 ريال</span>
                  <div className="text-sm text-right">
                    <span className="text-[#1e1e1e]">قمية الضريبة المضافة </span>
                    <span className="text-[#f04437]">( + )</span>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-[#12b669]">-15 ريال</span>
                  <span className="text-sm text-[#12b669]">قيمة الخصم</span>
                </div>

                <div className="border-t border-gray-200 my-2"></div>

                <div className="flex justify-between items-center">
                  <span className="text-base font-bold text-[#62a0f6]">120 ريال</span>
                  <span className="text-sm font-semibold text-[#1e1e1e]">المبلغ الاجمالي</span>
                </div>
              </div>
            </div>
          </div>

          {/* Continue Payment Button */}
          <button className="bg-[#143087] text-white rounded-xl px-4 py-4 text-lg font-medium flex items-center justify-center gap-2 w-full">
            <span>متابعة الدفع</span>
            <ChevronDown className="w-6 h-6 rotate-90" />
          </button>
        </div>

        
      </div>
    </div>

{/* fifth Section - Booking Confirmation */}


    <div className="container mx-auto px-4 py-8 max-w-2xl" dir="rtl">
      <div className="flex flex-col gap-16 items-center">
        {/* Success Section */}
        <div className="flex flex-col gap-14 items-center w-full max-w-lg">
          {/* Success Illustration */}
          <div className="flex flex-col gap-1 items-center w-full">
            <div
            style={{ backgroundImage: 'url(/assets/images/homehellers/order_confirmed.svg)' }}
            className="relative w-full max-w-[500px] h-[300px] md:h-[400px] lg:h-[500px] overflow-hidden"/>

            {/* Thank You Message */}
            <div className="flex flex-col gap-4 items-center w-full max-w-md text-center">
              <div className="text-2xl md:text-3xl font-bold leading-10">
                <span className="text-[#1e1e1e]">شكرا ليك لاستخدام </span>
                <span className="text-[#62a0f6]">هومهيليرز</span>
              </div>
              <p className="text-base text-[#1e1e1e] leading-6 max-w-sm">
                تم تأكيد الحجز بنجاح وسنتابع معك اخر التطورات
              </p>
            </div>
          </div>

          {/* Return to Homepage Button */}
          <button className="flex items-center justify-center gap-2 bg-[#143087] text-white rounded-xl px-10 py-4 text-lg font-medium w-full max-w-sm">
            <ChevronLeft className="w-6 h-6" />
            <span>عودة الي الصفحة الرئيسية</span>
          </button>
        </div>

        {/* Booking Details Section */}
        <div className="bg-white rounded-2xl border border-[#d0d5dd] p-5 w-full">
          <div className="flex justify-center mb-6">
            <h2 className="text-xl font-bold text-[#1e1e1e]">تفاصيل الحجز</h2>
          </div>

          <div className="bg-[#eff6fe] rounded-xl p-4">
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-[#1e1e1e]">احمد</span>
                <span className="text-sm text-[#1e1e1e]">اسم المريض</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-[#1e1e1e]">مشاكل في العضلات</span>
                <span className="text-sm text-[#1e1e1e]">المشكلة الصحية</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-[#1e1e1e]">Ahmed@gmail.com</span>
                <span className="text-sm text-[#1e1e1e]">ايميل التواصل</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-[#1e1e1e]">+201155591759</span>
                <span className="text-sm text-[#1e1e1e]">رقم الهاتف</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>


{/* sixth Section - Doctor model */}
<>
    <div className="container mx-auto p-8 text-center">
      <h1 className="text-2xl font-bold mb-8">صفحة الأطباء</h1>

      <button onClick={() => setIsModalOpen(true)} className="bg-[#62a0f6] text-white px-6 py-3 rounded-lg">
        عرض بيانات الطبيب
      </button>

    </div>
{isModalOpen && (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto" >
      <div
        className="relative bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 z-10">
          <div className="w-6 h-6 relative overflow-hidden">
            <div className="w-5 h-5 bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-29/5gTYmbz5b5.png)] bg-[length:100%_100%] bg-no-repeat relative mt-0.5 ml-0.5" />
          </div>
        </button>

        <div className="flex flex-col gap-4 p-6">
          {/* Doctor Title */}
          <div className="flex justify-center mb-2">
            <span className="text-xl font-bold text-[#1e1e1e]">بيانات الطبيب</span>
          </div>

          <div className="flex flex-col gap-8">
            {/* Doctor Info Card */}
            <div className="relative bg-white rounded-2xl border border-[#d0d5dd] p-4">
              <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                {/* Doctor Actions */}
                <div className="hidden md:flex flex-col gap-4 order-1">
                  <div className="w-8 h-8 rounded-full border border-[#d0d5dd] flex items-center justify-center">
                    <div className="w-5 h-5 bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-29/ABGV2fbDRx.png)] bg-cover bg-no-repeat" />
                  </div>
                  <div className="w-8 h-8 rounded-full border border-[#d0d5dd] flex items-center justify-center">
                    <div className="w-5 h-5 relative">
                      <div className="w-[16.666px] h-[14.346px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-29/Q5QTBkDLUi.png)] bg-[length:100%_100%] bg-no-repeat relative mt-[2.738px] ml-[1.667px]" />
                    </div>
                  </div>
                </div>

                {/* Doctor Details */}
                <div className="flex flex-col md:flex-row gap-6 flex-1 order-2">
                  <div className="flex flex-col gap-4 items-end">
                    <div className="flex items-center gap-2">
                      <div className="text-sm">
                        <span className="text-[#b5b5b5]">الخبرة : </span>
                        <span className="text-[#1e1e1e]">4 سنوات</span>
                      </div>
                      <div className="w-8 h-8 rounded-full border border-[#d0d5dd] flex items-center justify-center">
                        <div className="w-[21px] h-[21px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-29/YUVCYKqdZb.png)] bg-cover bg-no-repeat" />
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="text-sm">
                        <span className="text-[#b5b5b5]">استشارة طبية فيديو : </span>
                        <span className="text-[#1e1e1e]">15 دقيقة</span>
                      </div>
                      <div className="w-8 h-8 rounded-full border border-[#d0d5dd] flex items-center justify-center">
                        <div className="w-[21px] h-[21px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-29/0pcK0K5vXj.png)] bg-cover bg-no-repeat" />
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="text-sm">
                        <span className="text-[#b5b5b5]">التخصص العام : </span>
                        <span className="text-[#1e1e1e]">طب أسرة</span>
                      </div>
                      <div className="w-8 h-8 rounded-full border border-[#d0d5dd] flex items-center justify-center">
                        <div className="w-6 h-6 bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-29/c9QXto3KVY.png)] bg-cover bg-no-repeat" />
                      </div>
                    </div>
                  </div>

                  <div className="hidden md:block w-px h-32 bg-gray-200 mx-2"></div>

                  <div className="flex flex-col gap-3 items-end">
                    <h3 className="text-xl font-semibold text-[#1e1e1e]">د / أحمد عاطف</h3>
                    <p className="text-sm text-[#1e1e1e]">أخصائي أول</p>
                    <div className="w-[100px] h-5 bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-29/9hYbtA0zcp.png)] bg-cover bg-no-repeat"></div>
                    <p className="text-sm text-[#736b7a]">وصف بسيط جدا هنا</p>
                  </div>
                </div>

                {/* Doctor Image */}
                <div className="order-3">
                  <div className="w-[216px] h-[160px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-29/SuMccRmvwS.png)] bg-cover bg-no-repeat rounded-lg"></div>
                </div>
              </div>

              <div className="border-t border-gray-200 my-3"></div>

              <div className="flex justify-center">
                <div className="text-right">
                  <span className="text-sm text-[#1e1e1e]">السعر : </span>
                  <span className="text-lg font-bold text-[#62a0f6]">300 ريال</span>
                </div>
              </div>
            </div>

            {/* Doctor Details Sections */}
            <div className="flex flex-col gap-8">
              {/* About Doctor */}
              <div className="flex flex-col">
                <div className="bg-[#eff6fe] rounded-t-xl inline-block self-end px-3 py-3 w-28">
                  <span className="text-base font-bold text-[#62a0f6]">عن الطبيب</span>
                </div>
                <div className="bg-[#eff6fe] rounded-xl rounded-tr-none p-3">
                  <span className="text-base text-[#1e1e1e] text-right block">
                    استشاري طب اسرة البورد العربي لطب الاسرة ٢٠٢١ البورد السعودي لطب الاسرة ٢٠١٩
                  </span>
                </div>
              </div>

              {/* Medical Certificates */}
              <div className="flex flex-col">
                <div className="bg-[#eff6fe] rounded-t-xl inline-block self-end px-3 py-3 w-40">
                  <span className="text-base font-bold text-[#62a0f6]">الشهادات الطبية</span>
                </div>
                <div className="bg-[#eff6fe] rounded-xl rounded-tr-none p-3">
                  <div className="flex flex-wrap gap-3 justify-end">
                    <div className="w-[192px] h-[132px] bg-[rgba(255,255,255,0.2)] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-29/zyRKYP9mgn.png)] bg-cover bg-no-repeat rounded-2xl"></div>
                    <div className="w-[192px] h-[132px] bg-[rgba(255,255,255,0.2)] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-29/5FcqzNCevq.png)] bg-cover bg-no-repeat rounded-2xl"></div>
                    <div className="w-[192px] h-[132px] bg-[rgba(255,255,255,0.2)] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-29/eUcsV26KAf.png)] bg-cover bg-no-repeat rounded-2xl"></div>
                  </div>
                </div>
              </div>

              {/* Expertise */}
              <div className="flex flex-col">
                <div className="bg-[#eff6fe] rounded-t-xl inline-block self-end px-3 py-3 w-48">
                  <span className="text-base font-bold text-[#62a0f6]">خبرة في الحالات الاتية</span>
                </div>
                <div className="bg-[#eff6fe] rounded-xl rounded-tr-none p-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Repeating expertise items - 12 items */}
                    {Array(12)
                      .fill(0)
                      .map((_, index) => (
                        <div key={index} className="flex items-center gap-3 justify-end">
                          <span className="text-sm font-medium text-[#1e1e1e]">
                            التهاب الشعب الهوائية و الجيوب الأنفية
                          </span>
                          <div className="w-5 h-5 bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-29/fEqObnp50m.png)] bg-[length:100%_100%] bg-no-repeat"></div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Book Appointment Button */}
            <div className="flex justify-center">
              <button className="bg-[#143087] text-white rounded-xl px-3 py-3 text-sm font-semibold">
                احجز ميعاد الان
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>)}

</>


<>
    <div className="container mx-auto p-8 text-center" >
      <h1 className="text-2xl font-bold mb-8">حجز موعد</h1>

      <button onClick={() => setIsModalOpenDate(true)} className="bg-[#62a0f6] text-white px-6 py-3 rounded-lg">
        حدد ميعاد الجلسة
      </button>

      <AppointmentDatePickerModal isOpen={isModalOpenDate} onClose={() => setIsModalOpenDate(false)} />
    </div>

</>

<>

        <button onClick={() => setIsDetailedProfileOpen(true)} className="bg-[#00b5b4] text-white px-6 py-3 rounded-lg">
          عرض الملف التفصيلي
        </button>
{isDetailedProfileOpen && (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto" dir="rtl">
      <div className="relative bg-white rounded-3xl w-full max-w-4xl max-h-[95vh] overflow-y-auto">
        {/* Close Button */}
        <button onClick={()=>setIsDetailedProfileOpen(false)} className="absolute top-4 right-4 z-10">
          <div className="w-6 h-6 relative overflow-hidden">
            <div className="w-5 h-5 bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-29/3vJ7zVER4C.png)] bg-[length:100%_100%] bg-no-repeat relative mt-0.5 ml-0.5" />
          </div>
        </button>

        <div className="flex flex-col gap-4 p-6 pt-10">
          {/* Title */}
          <div className="flex justify-center mb-4">
            <h2 className="text-xl font-bold text-[#1e1e1e]">بيانات الطبيب</h2>
          </div>

          <div className="flex flex-col gap-6">
            {/* Doctor Info Card with Overlay */}
            <div className="relative bg-white rounded-2xl border border-[#d0d5dd] p-4 md:p-6">
              {/* Semi-transparent overlay */}
              <div className="absolute inset-0 bg-white/50 rounded-2xl border border-[#d0d5dd] z-10"></div>

              {/* Promotional Banner */}
              <div className="absolute top-4 left-4 bg-[#00b5b4] text-white px-3 py-2 rounded-lg text-sm font-medium z-20">
                الاستمتاع بالعرض
              </div>

              <div className="relative z-0 flex flex-col lg:flex-row gap-6 items-center lg:items-start">
                {/* Doctor Actions */}
                <div className="flex lg:flex-col gap-4 order-1 lg:order-1">
                  <button className="w-8 h-8 rounded-full border border-[#d0d5dd] flex items-center justify-center bg-white hover:bg-gray-50">
                    <div className="w-5 h-5 bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-29/XSYLSSWUYG.png)] bg-cover bg-no-repeat" />
                  </button>
                  <button className="w-8 h-8 rounded-full border border-[#d0d5dd] flex items-center justify-center bg-white hover:bg-gray-50">
                    <div className="w-5 h-5 relative overflow-hidden">
                      <div className="w-[16.666px] h-[14.346px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-29/LaguzwPHk1.png)] bg-[length:100%_100%] bg-no-repeat relative mt-[2.738px] mr-0 mb-0 ml-[1.667px]" />
                    </div>
                  </button>
                </div>

                {/* Doctor Details */}
                <div className="flex flex-col md:flex-row gap-6 flex-1 order-3 lg:order-2">
                  <div className="flex flex-col gap-4 items-end">
                    <div className="flex items-center gap-2">
                      <div className="text-sm">
                        <span className="text-[#b5b5b5]">الخبرة : </span>
                        <span className="text-[#1e1e1e]">4 سنوات</span>
                      </div>
                      <div className="w-8 h-8 rounded-full border border-[#d0d5dd] flex items-center justify-center">
                        <div className="w-[21px] h-[21px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-29/ryC4gFiiSE.png)] bg-cover bg-no-repeat" />
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="text-sm">
                        <span className="text-[#b5b5b5]">استشارة طبية فيديو : </span>
                        <span className="text-[#1e1e1e]">15 دقيقة</span>
                      </div>
                      <div className="w-8 h-8 rounded-full border border-[#d0d5dd] flex items-center justify-center">
                        <div className="w-[21px] h-[21px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-29/5OA7TMwvZH.png)] bg-cover bg-no-repeat" />
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="text-sm">
                        <span className="text-[#b5b5b5]">التخصص العام : </span>
                        <span className="text-[#1e1e1e]">طب أسرة</span>
                      </div>
                      <div className="w-8 h-8 rounded-full border border-[#d0d5dd] flex items-center justify-center">
                        <div className="w-6 h-6 bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-29/uUnLQ1m79V.png)] bg-cover bg-no-repeat" />
                      </div>
                    </div>
                  </div>

                  <div className="hidden md:block w-px h-32 bg-gray-200 mx-2"></div>

                  <div className="flex flex-col gap-3 items-end">
                    <h3 className="text-xl font-semibold text-[#1e1e1e]">د / أحمد عاطف</h3>
                    <p className="text-sm text-[#1e1e1e]">أخصائي أول</p>
                    <div className="w-[100px] h-5 bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-29/3mf473Zvk8.png)] bg-cover bg-no-repeat"></div>
                    <p className="text-sm text-[#736b7a]">وصف بسيط جدا هنا</p>
                  </div>
                </div>

                {/* Doctor Image */}
                <div className="order-2 lg:order-3">
                  <div className="w-[216px] h-[160px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-29/dpfnxi8gTR.png)] bg-cover bg-no-repeat rounded-lg"></div>
                </div>
              </div>

              <div className="relative z-0 border-t border-gray-200 my-4"></div>

              <div className="relative z-0 flex justify-center">
                <div className="text-right">
                  <span className="text-sm text-[#1e1e1e]">السعر : </span>
                  <span className="text-lg font-bold text-[#62a0f6]">300 ريال</span>
                </div>
              </div>
            </div>

            {/* Promotional Section */}
            <div className="bg-[rgba(0,181,180,0.15)] rounded-xl p-6">
              <div className="w-full h-6 bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-29/staugh6kku.png)] bg-cover bg-no-repeat"></div>
            </div>

            {/* Doctor Details Sections */}
            <div className="flex flex-col gap-8">
              {/* About Doctor */}
              <div className="flex flex-col">
                <div className="bg-[#eff6fe] rounded-t-xl inline-block self-end px-3 py-3 w-28">
                  <span className="text-base font-bold text-[#62a0f6]">عن الطبيب</span>
                </div>
                <div className="bg-[#eff6fe] rounded-xl rounded-tr-none p-4">
                  <span className="text-base text-[#1e1e1e] text-right block">
                    استشاري طب اسرة البورد العربي لطب الاسرة ٢٠٢١ البورد السعودي لطب الاسرة ٢٠١٩
                  </span>
                </div>
              </div>

              {/* Medical License */}
              <div className="flex flex-col">
                <div className="bg-[#eff6fe] rounded-t-xl inline-block self-end px-3 py-3 w-44">
                  <span className="text-base font-bold text-[#62a0f6]">رقم الرخصة الطبية</span>
                </div>
                <div className="bg-[#eff6fe] rounded-xl rounded-tr-none p-4">
                  <span className="text-base text-[#1e1e1e] text-right block">17RM0024457</span>
                </div>
              </div>

              {/* Expertise */}
              <div className="flex flex-col">
                <div className="bg-[#eff6fe] rounded-t-xl inline-block self-end px-3 py-3 w-48">
                  <span className="text-base font-bold text-[#62a0f6]">خبرة في الحالات الاتية</span>
                </div>
                <div className="bg-[#eff6fe] rounded-xl rounded-tr-none p-4">
                  <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1 gap-3">
                    {conditions.map((condition, index) => (
                      <div key={index} className="text-base text-[#1e1e1e] text-right">
                        {condition}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Book Appointment Button */}
            <div className="flex justify-center">
              <button className="bg-[#143087] text-white rounded-xl px-6 py-3 text-sm font-semibold">
                احجز ميعاد الان
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    
  )
  
}
</>



<>
        <button onClick={() => setIsLocationsOpen(true)} className="bg-[#e8eaf3] text-[#143087] px-6 py-3 rounded-lg">
          المواقع المحفوظة
        </button>

{isLocationsOpen && (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto" dir="rtl">
      <div className="relative bg-white rounded-3xl w-full max-w-4xl max-h-[95vh] overflow-y-auto">
        {/* Close Button */}
        <button onClick={()=>setIsLocationsOpen(false)} className="absolute top-5 right-5 z-10">
          <div className="w-6 h-6 relative overflow-hidden">
            <div className="w-5 h-5 bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-29/M9HL9fObLh.png)] bg-[length:100%_100%] bg-no-repeat relative mt-0.5 ml-0.5" />
          </div>
        </button>

        <div className="flex flex-col gap-6 p-6 pt-16">
          {/* Title */}
          <div className="flex justify-center">
            <h2 className="text-xl font-bold text-[#1e1e1e]">المواقع المحفوظة</h2>
          </div>

          {/* Locations List */}
          <div className="flex flex-col gap-6">
            {locations.map((location) => (
              <div
                key={location.id}
                className={`flex flex-col sm:flex-row justify-between items-center p-4 rounded-2xl transition-all ${
                  selectedLocation === location.id ? "bg-[#eff6fe]" : "border border-[#d0d5dd] hover:border-[#62a0f6]"
                }`}
              >
                {/* Location Info */}
                <div className="flex items-center gap-5 flex-1 order-2 sm:order-1">
                  <div className="flex flex-col gap-4 items-end flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-base font-semibold text-[#1e1e1e] text-right">{location.title}</span>
                      <div
                        className="w-4 h-4 bg-cover bg-no-repeat"
                        style={{ backgroundImage: `url(${location.iconUrl})` }}
                      />
                    </div>
                    <span className="text-base text-[#1e1e1e] text-right">{location.address}</span>
                  </div>
                </div>

                {/* Select Button */}
                <div className="order-1 sm:order-2 mb-4 sm:mb-0">
                  <button
                    onClick={() => setSelectedLocation(location.id)}
                    className="bg-[#62a0f6] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#5090e6] transition-colors"
                  >
                    اختيار الموقع
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <button className="flex-1 bg-[#143087] text-white py-3 px-4 rounded-xl text-sm font-semibold hover:bg-[#0f2470] transition-colors">
              مشاهدة المواقع المحفوظة
            </button>
            <button className="flex-1 bg-[#e8eaf3] text-[#143087] py-3 px-4 rounded-xl text-sm font-semibold hover:bg-[#d5d9e8] transition-colors">
              تأكيد الموقع
            </button>
          </div>
        </div>
      </div>
    </div>
)
}

</>



<>
 <button onClick={() => setIsLocationPickerOpen(true)} className="bg-[#62a0f6] text-white px-6 py-3 rounded-lg">
          اختيار الموقع على الخريطة
        </button>

        <LocationPickerModal isOpen={isLocationPickerOpen} onClose={() => setIsLocationPickerOpen(false)} />


</>



<>
        <button onClick={() => setIsSymptomsSearchOpen(true)} className="bg-[#143087] text-white px-6 py-3 rounded-lg">
          بحث حسب الأعراض
        </button>
              <SymptomsSearchModal isOpen={isSymptomsSearchOpen} onClose={() => setIsSymptomsSearchOpen(false)} />

</>



<>
        <button onClick={() => setIsSessionSelectorOpen(true)} className="bg-[#62a0f6] text-white px-6 py-3 rounded-lg">
          اختيار عدد الجلسات
        </button>

      <SessionSelectorModal isOpen={isSessionSelectorOpen} onClose={() => setIsSessionSelectorOpen(false)} />
</>


<>

        <button onClick={() => setIsAddPatientOpen(true)} className="bg-[#143087] text-white px-6 py-3 rounded-lg">
          اضافة مريض جديد
        </button>
              <AddPatientModal isOpen={isAddPatientOpen} onClose={() => setIsAddPatientOpen(false)} />
</>

      </div>

</>



  );
}

export default Page;