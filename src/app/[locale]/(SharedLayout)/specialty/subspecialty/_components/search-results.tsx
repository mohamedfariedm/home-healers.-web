import { Check, Clock, Star, User, Video } from "lucide-react"
import Image from "next/image"

export default function SearchResults() {
  return (
    <div className="container mx-auto px-4 py-6 font-sans" dir="rtl">
      {/* Search Results Header */}
      <div className="flex justify-end mb-6">
        <div className="text-center">
          <span className="text-lg font-bold text-[#1e1e1e]">نتيجة البحث </span>
          <span className="text-sm font-normal text-[#736b7a]">(10 نتيجة)</span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Filter Sidebar */}
        <div className="w-full lg:w-1/4 bg-[rgba(239,246,254,0.5)] rounded-xl p-6 order-2 lg:order-1">
          <div className="flex flex-col gap-6">
            {/* Filter by Rating */}
            <div>
              <div className="flex justify-between items-center mb-6">
                <div className="w-6 h-6">
                  <Star className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-[#1e1e1e]">بواسطة التقييم</h3>
              </div>
              <div className="border-t border-gray-200 my-4"></div>
              <div className="flex flex-col gap-5">
                <div className="flex justify-end items-center gap-2">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                  <div className="w-5 h-5 rounded border border-[#98a2b3]"></div>
                </div>
                <div className="flex justify-end items-center gap-2">
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
                <div className="flex justify-end items-center gap-2">
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
                <div className="flex justify-end items-center gap-2">
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
                <div className="w-6 h-6">
                  <Clock className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-[#1e1e1e]">سنوات الخبرة</h3>
              </div>
              <div className="border-t border-gray-200 my-4"></div>
              <div className="flex flex-col gap-5">
                <div className="flex justify-end items-center gap-2">
                  <span className="text-xs text-[#1e1e1e]">أكثر من سنتين +2</span>
                  <div className="w-5 h-5 rounded border border-[#98a2b3]"></div>
                </div>
                <div className="flex justify-end items-center gap-2">
                  <span className="text-xs text-[#1e1e1e]">أكثر من 3 سنوات +3</span>
                  <div className="w-5 h-5 rounded bg-[#143087]">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div className="flex justify-end items-center gap-2">
                  <span className="text-xs text-[#1e1e1e]">أكثر من 3 سنوات +3</span>
                  <div className="w-5 h-5 rounded border border-[#98a2b3]"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search Results Content */}
        <div className="w-full lg:w-3/4 flex flex-col gap-6 order-1 lg:order-2">
          {/* Doctor Card 1 */}
          <div className="bg-white rounded-2xl border border-[#d0d5dd] p-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:order-2">
                <div className="w-full md:w-[216px] h-[160px] rounded-lg overflow-hidden">
                  <Image
                    src="/placeholder.svg?height=160&width=216"
                    alt="Doctor"
                    width={216}
                    height={160}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-6 flex-1 md:order-1">
                <div className="flex flex-col gap-3 items-end">
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

                <div className="flex flex-col gap-4 items-end">
                  <div className="flex items-center gap-2">
                    <div className="text-sm">
                      <span className="text-[#b5b5b5]">الخبرة : </span>
                      <span className="text-[#1e1e1e]">4 سنوات</span>
                    </div>
                    <div className="w-8 h-8 rounded-full border border-[#d0d5dd] flex items-center justify-center">
                      <Clock className="w-5 h-5" />
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="text-sm">
                      <span className="text-[#b5b5b5]">استشارة طبية فيديو : </span>
                      <span className="text-[#1e1e1e]">15 دقيقة</span>
                    </div>
                    <div className="w-8 h-8 rounded-full border border-[#d0d5dd] flex items-center justify-center">
                      <Video className="w-5 h-5" />
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="text-sm">
                      <span className="text-[#b5b5b5]">التخصص العام : </span>
                      <span className="text-[#1e1e1e]">طب أسرة</span>
                    </div>
                    <div className="w-8 h-8 rounded-full border border-[#d0d5dd] flex items-center justify-center">
                      <User className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Promotion Banner */}
            <div className="mt-6 bg-[rgba(0,181,180,0.15)] rounded-xl p-4 relative">
              <div className="absolute -top-4 right-12 bg-[#00b5b4] text-white px-3 py-2 rounded-lg text-sm">
                الاستمتاع بالعرض
              </div>
              <div className="h-4"></div>
            </div>

            <div className="border-t border-gray-200 my-4"></div>

            {/* Price and Actions */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex gap-4">
                <button className="bg-[#143087] text-white rounded-xl px-4 py-3 text-sm font-semibold">
                  احجز ميعاد الان
                </button>
                <button className="bg-[#eff6fe] text-[#62a0f6] rounded-xl px-4 py-3 text-sm font-semibold">
                  رؤية الملف الشخصي
                </button>
              </div>
              <div className="text-right">
                <span className="text-sm text-[#1e1e1e]">السعر : </span>
                <span className="text-lg font-bold text-[#62a0f6]">300 ريال</span>
              </div>
            </div>
          </div>

          {/* Doctor Card 2 - Duplicate of Card 1 */}
          <div className="bg-white rounded-2xl border border-[#d0d5dd] p-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:order-2">
                <div className="w-full md:w-[216px] h-[160px] rounded-lg overflow-hidden">
                  <Image
                    src="/placeholder.svg?height=160&width=216"
                    alt="Doctor"
                    width={216}
                    height={160}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-6 flex-1 md:order-1">
                <div className="flex flex-col gap-3 items-end">
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

                <div className="flex flex-col gap-4 items-end">
                  <div className="flex items-center gap-2">
                    <div className="text-sm">
                      <span className="text-[#b5b5b5]">الخبرة : </span>
                      <span className="text-[#1e1e1e]">4 سنوات</span>
                    </div>
                    <div className="w-8 h-8 rounded-full border border-[#d0d5dd] flex items-center justify-center">
                      <Clock className="w-5 h-5" />
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="text-sm">
                      <span className="text-[#b5b5b5]">استشارة طبية فيديو : </span>
                      <span className="text-[#1e1e1e]">15 دقيقة</span>
                    </div>
                    <div className="w-8 h-8 rounded-full border border-[#d0d5dd] flex items-center justify-center">
                      <Video className="w-5 h-5" />
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="text-sm">
                      <span className="text-[#b5b5b5]">التخصص العام : </span>
                      <span className="text-[#1e1e1e]">طب أسرة</span>
                    </div>
                    <div className="w-8 h-8 rounded-full border border-[#d0d5dd] flex items-center justify-center">
                      <User className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 my-4"></div>

            {/* Price and Actions */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex gap-4">
                <button className="bg-[#143087] text-white rounded-xl px-4 py-3 text-sm font-semibold">
                  احجز ميعاد الان
                </button>
                <button className="bg-[#eff6fe] text-[#62a0f6] rounded-xl px-4 py-3 text-sm font-semibold">
                  رؤية الملف الشخصي
                </button>
              </div>
              <div className="text-right">
                <span className="text-sm text-[#1e1e1e]">السعر : </span>
                <span className="text-lg font-bold text-[#62a0f6]">300 ريال</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
