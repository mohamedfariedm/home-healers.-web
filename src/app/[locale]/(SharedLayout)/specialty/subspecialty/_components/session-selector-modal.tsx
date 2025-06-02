"use client";

import { useState } from "react";

interface SessionSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SessionOption {
  id: number;
  count: number;
  label: string;
  iconUrl: string;
  price: number;
}

export default function SessionSelectorModal({
  isOpen,
  onClose,
}: SessionSelectorModalProps) {
  const [selectedSession, setSelectedSession] = useState<number>(1);

  if (!isOpen) return null;

  const sessionOptions: SessionOption[] = [
    {
      id: 1,
      count: 1,
      label: "1 جلسة علاج",
      iconUrl:
        "https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-29/328N24MOey.png",
      price: 300,
    },
    {
      id: 2,
      count: 2,
      label: "2 جلسة علاج",
      iconUrl:
        "https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-29/eXFJC24p7f.png",
      price: 550,
    },
    {
      id: 3,
      count: 3,
      label: "3 جلسة علاج",
      iconUrl:
        "https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-29/j3EMf4CUjv.png",
      price: 800,
    },
  ];

  const selectedOption =
    sessionOptions.find((option) => option.id === selectedSession) ||
    sessionOptions[0];

  const handleContinue = () => {
    console.log("Selected session:", selectedOption);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/50 p-4 overflow-y-auto"
      dir="rtl"
    >
      <div className="relative bg-white rounded-3xl w-full max-w-2xl max-h-[95vh] overflow-y-auto">
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-4 right-4 z-10">
          <div className="w-6 h-6 relative overflow-hidden">
            <div className="w-5 h-5 bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-29/DiBXp883Fr.png)] bg-[length:100%_100%] bg-no-repeat relative mt-0.5 ml-0.5" />
          </div>
        </button>

        <div className="flex flex-col gap-8 p-6 pt-16">
          {/* Title */}
          <div className="flex justify-center">
            <h2 className="text-xl font-bold text-[#1e1e1e]">
              اختيار عدد الجلسات
            </h2>
          </div>

          {/* Session Options */}
          <div className="bg-white rounded-2xl border border-[#d0d5dd] p-6">
            <div className="flex flex-col gap-4">
              {sessionOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setSelectedSession(option.id)}
                  className={`flex justify-end items-center p-4 rounded-xl border transition-all ${
                    selectedSession === option.id
                      ? "bg-[#eff6fe] border-[#62a0f6]"
                      : "bg-white border-[#d0d5dd] hover:border-[#62a0f6]"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-semibold text-[#1e1e1e]">
                      {option.label}
                    </span>
                    <div
                      className="w-6 h-6 bg-cover bg-no-repeat"
                      style={{ backgroundImage: `url(${option.iconUrl})` }}
                    />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Price and Continue */}
          <div className="flex flex-col gap-4 items-center">
            <div className="bg-white rounded-xl p-3">
              <span className="text-lg font-bold text-[#62a0f6]">
                {selectedOption.price} ريال
              </span>
            </div>
            <button
              onClick={handleContinue}
              className="bg-[#143087] text-white py-4 px-6 rounded-xl text-sm font-semibold hover:bg-[#0f2470] transition-colors w-full"
            >
              استمرار
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
