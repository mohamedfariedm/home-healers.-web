"use client";

interface DoctorProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DoctorProfileModal({
  isOpen,
  onClose,
}: DoctorProfileModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/50 p-4 overflow-y-auto"
      dir="rtl"
    >
      <div
        className="relative bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-4 right-4 z-10">
          <div className="w-6 h-6 relative overflow-hidden">
            <div className="w-5 h-5 bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-29/5gTYmbz5b5.png)] bg-[length:100%_100%] bg-no-repeat relative mt-0.5 ml-0.5" />
          </div>
        </button>

        <div className="flex flex-col gap-4 p-6">
          {/* Doctor Title */}
          <div className="flex justify-center mb-2">
            <span className="text-xl font-bold text-[#1e1e1e]">
              بيانات الطبيب
            </span>
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
                        <span className="text-[#b5b5b5]">
                          استشارة طبية فيديو :{" "}
                        </span>
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
                    <h3 className="text-xl font-semibold text-[#1e1e1e]">
                      د / أحمد عاطف
                    </h3>
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
                  <span className="text-lg font-bold text-[#62a0f6]">
                    300 ريال
                  </span>
                </div>
              </div>
            </div>

            {/* Doctor Details Sections */}
            <div className="flex flex-col gap-8">
              {/* About Doctor */}
              <div className="flex flex-col">
                <div className="bg-[#eff6fe] rounded-t-xl inline-block self-end px-3 py-3 w-28">
                  <span className="text-base font-bold text-[#62a0f6]">
                    عن الطبيب
                  </span>
                </div>
                <div className="bg-[#eff6fe] rounded-xl rounded-tr-none p-3">
                  <span className="text-base text-[#1e1e1e] text-right block">
                    استشاري طب اسرة البورد العربي لطب الاسرة ٢٠٢١ البورد السعودي
                    لطب الاسرة ٢٠١٩
                  </span>
                </div>
              </div>

              {/* Medical Certificates */}
              <div className="flex flex-col">
                <div className="bg-[#eff6fe] rounded-t-xl inline-block self-end px-3 py-3 w-40">
                  <span className="text-base font-bold text-[#62a0f6]">
                    الشهادات الطبية
                  </span>
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
                  <span className="text-base font-bold text-[#62a0f6]">
                    خبرة في الحالات الاتية
                  </span>
                </div>
                <div className="bg-[#eff6fe] rounded-xl rounded-tr-none p-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Repeating expertise items - 12 items */}
                    {Array(12)
                      .fill(0)
                      .map((_, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 justify-end"
                        >
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
    </div>
  );
}
