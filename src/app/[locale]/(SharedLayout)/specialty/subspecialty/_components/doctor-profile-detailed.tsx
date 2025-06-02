"use client";

interface DoctorProfileDetailedProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DoctorProfileDetailed({
  isOpen,
  onClose,
}: DoctorProfileDetailedProps) {
  if (!isOpen) return null;

  const conditions = [
    "التهاب الشعب الهوائية و الجيوب الأنفية",
    "التهابات الأذن الداخلية و الخارجية",
    "اضطرابات التبول و الافرازات",
    "اضطرابات التبول و الافرازات",
    "اضطرابات التبول و الافرازات",
    "اضطرابات التبول و الافرازات",
    "اضطرابات التبول و الافرازات",
    "التهاب الشعب الهوائية و الجيوب الأنفية",
  ];

  return (
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/50 p-4 overflow-y-auto"
      dir="rtl"
    >
      <div className="relative bg-white rounded-3xl w-full max-w-4xl max-h-[95vh] overflow-y-auto">
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-4 right-4 z-10">
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

              {/* Promotional Banner */}

              <div className="relative z-0 flex flex-col lg:flex-row gap-6 items-center lg:items-start">
                {/* Doctor Image */}
                <div className="">
                  <div className="w-[216px] h-[160px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-29/dpfnxi8gTR.png)] bg-cover bg-no-repeat rounded-lg"></div>
                </div>

                {/* Doctor Details */}
                <div className="flex flex-col md:flex-row gap-6 flex-1 ">
                  <div className="flex flex-col gap-3 items-start">
                    <h3 className="text-xl font-semibold text-[#1e1e1e]">
                      د / أحمد عاطف
                    </h3>
                    <p className="text-sm text-[#1e1e1e]">أخصائي أول</p>
                    <div className="w-[100px] h-5 bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-29/3mf473Zvk8.png)] bg-cover bg-no-repeat"></div>
                    <p className="text-sm text-[#736b7a]">وصف بسيط جدا هنا</p>
                  </div>

                  <div className="hidden md:block w-px h-32 bg-gray-200 mx-2"></div>
                  <div className="flex flex-col gap-4 items-start">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full border border-[#d0d5dd] flex items-center justify-center">
                        <div className="w-[21px] h-[21px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-29/ryC4gFiiSE.png)] bg-cover bg-no-repeat" />
                      </div>
                      <div className="text-sm">
                        <span className="text-[#b5b5b5]">الخبرة : </span>
                        <span className="text-[#1e1e1e]">4 سنوات</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full border border-[#d0d5dd] flex items-center justify-center">
                        <div className="w-[21px] h-[21px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-29/5OA7TMwvZH.png)] bg-cover bg-no-repeat" />
                      </div>
                      <div className="text-sm">
                        <span className="text-[#b5b5b5]">
                          استشارة طبية فيديو :{" "}
                        </span>
                        <span className="text-[#1e1e1e]">15 دقيقة</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full border border-[#d0d5dd] flex items-center justify-center">
                        <div className="w-6 h-6 bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-29/uUnLQ1m79V.png)] bg-cover bg-no-repeat" />
                      </div>
                      <div className="text-sm">
                        <span className="text-[#b5b5b5]">التخصص العام : </span>
                        <span className="text-[#1e1e1e]">طب أسرة</span>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Doctor Actions */}
                <div className="flex lg:flex-col gap-4 ">
                  <button className="w-8 h-8 rounded-full border border-[#d0d5dd] flex items-center justify-center bg-white hover:bg-gray-50">
                    <div className="w-5 h-5 bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-29/XSYLSSWUYG.png)] bg-cover bg-no-repeat" />
                  </button>
                  <button className="w-8 h-8 rounded-full border border-[#d0d5dd] flex items-center justify-center bg-white hover:bg-gray-50">
                    <div className="w-5 h-5 relative overflow-hidden">
                      <div className="w-[16.666px] h-[14.346px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-29/LaguzwPHk1.png)] bg-[length:100%_100%] bg-no-repeat relative mt-[2.738px] mr-0 mb-0 ml-[1.667px]" />
                    </div>
                  </button>
                </div>
              </div>

              <div className="relative z-0 border-t border-gray-200 my-4"></div>

              <div className="relative z-0 flex justify-center">
                <div className="text-right">
                  <span className="text-sm text-[#1e1e1e]">السعر : </span>
                  <span className="text-lg font-bold text-[#62a0f6]">
                    300 ريال
                  </span>
                </div>
              </div>
            </div>

            {/* Promotional Section */}
            <div className="mt-6 bg-[rgba(0,181,180,0.15)] rounded-xl py-1 px-4 relative flex justify-between items-center">
              <div className="text-sm text-black">
                🎁 عرض خاص: خصم 20% على باقة 5 جلسات علاج طبيعي حتى نهاية الشهر!
              </div>
              <div className="bg-[#00b5b4] text-white px-3 py-2 rounded-lg text-sm">
                الاستمتاع بالعرض
              </div>
            </div>

            {/* Doctor Details Sections */}
            <div className="flex flex-col gap-8">
              {/* About Doctor */}
              <div className="flex flex-col">
                <div className="bg-[#eff6fe] rounded-t-xl inline-block self-start px-3 py-3 ">
                  <span className="text-base font-bold text-[#62a0f6]">
                    عن الطبيب
                  </span>
                </div>
                <div className="bg-[#eff6fe] rounded-xl rounded-tr-none p-4">
                  <span className="text-base text-[#1e1e1e] text-right block">
                    استشاري طب اسرة البورد العربي لطب الاسرة ٢٠٢١ البورد السعودي
                    لطب الاسرة ٢٠١٩
                  </span>
                </div>
              </div>

              {/* Medical License */}
              <div className="flex flex-col">
                <div className="bg-[#eff6fe] rounded-t-xl inline-block self-start px-3 py-3">
                  <span className="text-base font-bold text-[#62a0f6]">
                    رقم الرخصة الطبية
                  </span>
                </div>
                <div className="bg-[#eff6fe] rounded-xl rounded-tr-none p-4">
                  <span className="text-base text-[#1e1e1e] text-right block">
                    17RM0024457
                  </span>
                </div>
              </div>

              {/* Expertise */}
              <div className="flex flex-col">
                <div className="bg-[#eff6fe] rounded-t-xl inline-block self-start px-3 py-3 ">
                  <span className="text-base font-bold text-[#62a0f6]">
                    خبرة في الحالات الاتية
                  </span>
                </div>
                <div className="bg-[#eff6fe] rounded-xl rounded-tr-none p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-3">
                    {conditions.map((condition, index) => (
                      <div
                        key={index}
                        className="text-base text-[#1e1e1e] text-right"
                      >
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
  );
}
