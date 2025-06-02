"use client";

import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { arSA } from "date-fns/locale";

interface AppointmentDatePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDateSelect: (dateString: string) => void;
}

export default function AppointmentDatePickerModal({
  isOpen,
  onClose,
  onDateSelect, // ← newly added
}: AppointmentDatePickerModalProps) {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>("12:30 PM");

  if (!isOpen) return null;

  const timeSlots = [
    "9:00 AM",
    "9:30 AM",
    "10:00 AM",
    "10:30 AM",
    "11:00 AM",
    "11:30 AM",
    "12:00 PM",
    "12:30 PM",
    "1:00 PM",
    "1:30 PM",
    "2:00 PM",
    "2:30 PM",
    "3:00 PM",
    "3:30 PM",
    "4:00 PM",
    "4:30 PM",
    "5:00 PM",
    "5:30 PM",
    "6:00 PM",
    "6:30 PM",
  ];

  return (
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/50 p-4 overflow-y-auto"
      dir="rtl"
    >
      <div className="relative bg-white rounded-3xl w-full max-w-5xl max-h-[95vh] overflow-y-auto mx-4">
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-4 right-4 z-10">
          <div className="w-6 h-6 relative overflow-hidden">
            <div className="w-5 h-5 bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-29/bgEAGQxsKt.png)] bg-[length:100%_100%] bg-no-repeat relative mt-0.5 ml-0.5" />
          </div>
        </button>

        <div className="flex flex-col gap-8 p-6 pt-10">
          {/* Title */}
          <div className="flex justify-center">
            <h2 className="text-xl font-bold text-[#1e1e1e]">
              حدد ميعاد الجلسة الأولي
            </h2>
          </div>

          <div className="flex flex-col xl:flex-row gap-6 bg-white rounded-2xl border border-[#d0d5dd] p-4 md:p-6">
            {/* Calendar */}
            <div className="flex-1 min-w-0">
              <div className="bg-white rounded-xl border border-[#d0d5dd] p-3 md:p-4">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  locale={arSA}
                  className="w-full"
                  dir="ltr"
                />
              </div>
            </div>

            {/* Time Slots */}
            <div className="flex-1 min-w-0">
              <div className="bg-white rounded-xl border border-[#d0d5dd] p-3 md:p-4">
                <h3 className="text-lg font-semibold text-[#1e1e1e] mb-4 text-center">
                  اختر الوقت
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-3 2xl:grid-cols-4 gap-2 md:gap-3">
                  {timeSlots.map((time) => (
                    <button
                      key={time}
                      className={`py-2 px-2 md:px-3 rounded-lg text-xs md:text-sm font-medium text-center transition-colors ${
                        selectedTime === time
                          ? "bg-[#62a0f6] text-white shadow-sm"
                          : "bg-[#eff6fe] text-[#1e1e1e] hover:bg-[#d7e2ff]"
                      }`}
                      onClick={() => setSelectedTime(time)}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Continue Button */}
          <button
            onClick={() => {
              if (!selectedTime) return;
              onDateSelect(selectedTime);
            }}
            className="bg-[#143087] text-white rounded-xl py-3 px-4 text-sm font-semibold w-full"
          >
            استمرار
          </button>
        </div>
      </div>
    </div>
  );
}
