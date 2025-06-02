"use client";

import { useState } from "react";

interface SavedLocationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Location {
  id: number;
  title: string;
  address: string;
  iconUrl: string;
  isSelected?: boolean;
}

export default function SavedLocationsModal({
  isOpen,
  onClose,
}: SavedLocationsModalProps) {
  const [selectedLocation, setSelectedLocation] = useState<number>(1);

  if (!isOpen) return null;

  const locations: Location[] = [
    {
      id: 1,
      title: "الرياض - السعودية",
      address: "السعودية - الرياض - شارع الامير محمد بن سلمان",
      iconUrl:
        "https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-29/OimPRcCr7m.png",
      isSelected: true,
    },
    {
      id: 2,
      title: "الرياض - السعودية",
      address: "السعودية - الرياض - شارع الامير محمد بن سلمان",
      iconUrl:
        "https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-29/Td0CfY2fe4.png",
    },
  ];

  return (
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/50 p-4 overflow-y-auto"
      dir="rtl"
    >
      <div className="relative bg-white rounded-3xl w-full max-w-4xl max-h-[95vh] overflow-y-auto">
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-5 right-5 z-10">
          <div className="w-6 h-6 relative overflow-hidden">
            <div className="w-5 h-5 bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-29/M9HL9fObLh.png)] bg-[length:100%_100%] bg-no-repeat relative mt-0.5 ml-0.5" />
          </div>
        </button>

        <div className="flex flex-col gap-6 p-6 pt-16">
          {/* Title */}
          <div className="flex justify-center">
            <h2 className="text-xl font-bold text-[#1e1e1e]">
              المواقع المحفوظة
            </h2>
          </div>

          {/* Locations List */}
          <div className="flex flex-col gap-6">
            {locations.map((location) => (
              <div
                key={location.id}
                className={`flex flex-col sm:flex-row justify-between items-center p-4 rounded-2xl transition-all ${
                  selectedLocation === location.id
                    ? "bg-[#eff6fe]"
                    : "border border-[#d0d5dd] hover:border-[#62a0f6]"
                }`}
              >
                {/* Location Info */}
                <div className="flex items-center gap-5 flex-1 order-2 sm:order-1">
                  <div className="flex flex-col gap-4 items-end flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-base font-semibold text-[#1e1e1e] text-right">
                        {location.title}
                      </span>
                      <div
                        className="w-4 h-4 bg-cover bg-no-repeat"
                        style={{ backgroundImage: `url(${location.iconUrl})` }}
                      />
                    </div>
                    <span className="text-base text-[#1e1e1e] text-right">
                      {location.address}
                    </span>
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
  );
}
