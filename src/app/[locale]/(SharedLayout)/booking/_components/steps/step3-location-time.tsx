"use client";
import { useState } from "react";
import { MapPin, Calendar, Clock, Plus, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import type { BookingData, Location } from "@/types/booking";

interface Step3Props {
  bookingData: BookingData;
  updateBookingData: (updates: Partial<BookingData>) => void;
  savedLocations: Location[];
  onNext: () => void;
  onPrev: () => void;
  onOpenLocationPicker: () => void;
}

export default function Step3LocationTime({
  bookingData,
  updateBookingData,
  savedLocations,
  onNext,
  onPrev,
  onOpenLocationPicker,
}: Step3Props) {
  const { t } = useTranslation("booking");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  const timeSlots = [
    { time: "09:00", period: "morning", label: `9:00 ${t("step3.morning")}` },
    { time: "10:00", period: "morning", label: `10:00 ${t("step3.morning")}` },
    { time: "11:00", period: "morning", label: `11:00 ${t("step3.morning")}` },
    { time: "14:00", period: "afternoon", label: `2:00 ${t("step3.afternoon")}` },
    { time: "15:00", period: "afternoon", label: `3:00 ${t("step3.afternoon")}` },
    { time: "16:00", period: "afternoon", label: `4:00 ${t("step3.afternoon")}` },
    { time: "19:00", period: "evening", label: `7:00 ${t("step3.evening")}` },
    { time: "20:00", period: "evening", label: `8:00 ${t("step3.evening")}` },
  ];

  // Determine sessions count from package or user selection
  const sessionsCount = bookingData.selectedPackage?.sessions_count ?? bookingData.sessionsCount;

  const handleLocationSelect = (location: Location) => {
    updateBookingData({ selectedLocation: location });
    toast.success(t("step3.locationSelected"));
  };

  const handleAddDateTime = () => {
    if (!selectedDate || !selectedTime) {
      toast.error(t("step3.selectDateAndTime"));
      return;
    }

    // Check if date is already selected
    if (bookingData.selectedDates.some((d) => d.date === selectedDate)) {
      toast.error(t("step3.dateAlreadySelected"));
      return;
    }

    const timeSlot = timeSlots.find((slot) => slot.time === selectedTime);
    if (timeSlot) {
      const newDate = {
        date: selectedDate,
        time: selectedTime,
        start_time: `${selectedDate} ${selectedTime}:00`,
        end_time: `${selectedDate} ${Number.parseInt(selectedTime.split(":")[0]) + 1}:00:00`,
        time_period: timeSlot.period as "morning" | "afternoon" | "evening",
      };

      updateBookingData({
        selectedDates: [...bookingData.selectedDates, newDate],
      });

      setSelectedDate("");
      setSelectedTime("");
      toast.success(t("step3.appointmentAdded"));
    }
  };

  const handleRemoveDateTime = (index: number) => {
    const newDates = bookingData.selectedDates.filter((_, i) => i !== index);
    updateBookingData({ selectedDates: newDates });
    toast.info(t("step3.appointmentRemoved"));
  };

  const handleSessionsCountChange = (count: number) => {
    if (!bookingData.selectedPackage) {
      updateBookingData({ sessionsCount: count });
      toast.info(`${t("step3.sessionsCountSet")}: ${count}`);
    }
  };

  const handleNext = () => {
    if (!bookingData.selectedLocation) {
      toast.error(t("step3.selectLocationFirst"));
      return;
    }
    if (bookingData.selectedDates.length < 1) {
  toast.error(t("step3.selectAtLeastOneAppointment"));
  return;
}
    onNext();
  };

  return (
    <div className="space-y-6">
      {/* Location Selection */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <MapPin className="w-6 h-6 text-[#62a0f6]" />
          {t("step3.selectLocation")}
        </h2>

        {/* Current Selected Location */}
        {bookingData.selectedLocation ? (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <h3 className="font-semibold text-green-800 mb-1">{t("step3.selectedLocation")}:</h3>
            <p className="text-green-700">{bookingData.selectedLocation.title}</p>
            <p className="text-sm text-green-600">{bookingData.selectedLocation.address}</p>
            <p className="text-sm text-green-600">{bookingData.selectedLocation.city}, {bookingData.selectedLocation.country}</p>
          </div>
        ) : (
          <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <p className="text-gray-600">{t("step3.noLocationSelected")}</p>
            <p className="text-sm text-gray-500">{t("step3.addLocation")}</p>
          </div>
        )}

        {/* Saved Locations */}
        <div className="mb-6">
          <h3 className="font-semibold mb-4">{t("step3.selectLocation")}</h3>
          {savedLocations.length === 0 ? (
            <p className="text-gray-600">{t("step3.noLocationSelected")}</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {savedLocations.map((location) => (
                <button
                  key={location.id}
                  onClick={() => handleLocationSelect(location)}
                  className={`p-4 rounded-lg border-2 text-right transition-all ${
                    bookingData.selectedLocation?.id === location.id
                      ? "border-[#62a0f6] bg-[#eff6fe]"
                      : "border-gray-200 hover:border-[#62a0f6]"
                  }`}
                >
                  <h4 className="font-semibold mb-1">{location.title}</h4>
                  <p className="text-sm text-gray-600">{location.address}</p>
                  <p className="text-sm text-gray-600">{location.city}, {location.country}</p>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Add New Location */}
        <button
          onClick={onOpenLocationPicker}
          className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#62a0f6] transition-colors flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          {t("step3.addLocation")}
        </button>
      </div>

      {/* Date and Time Selection */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <Calendar className="w-6 h-6 text-[#62a0f6]" />
          اختيار المواعيد
        </h2>

        {/* Sessions Count */}
        <div className="mb-6">
          <label className="block font-semibold mb-3">{t("step3.sessionsCount")}</label>
          {bookingData.selectedPackage ? (
            <p className="text-sm text-gray-600">
              {t("step3.sessionsCount")}: {sessionsCount}
            </p>
          ) : (
            <div className="flex gap-3">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((count) => (
                <button
                  key={count}
                  onClick={() => handleSessionsCountChange(count)}
                  className={`w-12 h-12 rounded-lg border-2 font-semibold transition-all ${
                    bookingData.sessionsCount === count
                      ? "border-[#62a0f6] bg-[#eff6fe] text-[#62a0f6]"
                      : "border-gray-300 hover:border-[#62a0f6]"
                  }`}
                >
                  {count}
                </button>
              ))}
            </div>
          )}
          {bookingData.selectedDates.length < 1 && (
  <div className="mt-3 flex items-center gap-2 text-blue-600">
    <AlertCircle className="w-5 h-5" />
    <p className="text-sm">{t("step3.selectAtLeastOneAppointment")}</p>
  </div>
)}
        </div>

        {/* Date Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block font-semibold mb-3">{t("step3.selectDate")}</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#62a0f6]"
            />
          </div>

          <div>
            <label className="block font-semibold mb-3">{t("step3.selectTime")}</label>
            <select
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#62a0f6]"
            >
              <option value="">{t("step3.selectTime")}</option>
              {timeSlots.map((slot) => (
                <option key={slot.time} value={slot.time}>
                  {slot.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Add Date/Time Button */}
        <button
          onClick={handleAddDateTime}
          disabled={!selectedDate || !selectedTime || bookingData.selectedDates.length >= sessionsCount}
          className="w-full p-3 bg-[#62a0f6] text-white rounded-lg hover:bg-[#5090e6] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          {t("step3.addDateTime")}
        </button>

        {/* Selected Dates */}
        {bookingData.selectedDates.length > 0 && (
          <div className="mt-6">
            <h3 className="font-semibold mb-4">{t("step3.appointments")}</h3>
            <div className="space-y-3">
              {bookingData.selectedDates.map((dateTime, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-600" />
                    <span>{dateTime.date}</span>
                    <Clock className="w-4 h-4 text-gray-600 mr-4" />
                    <span>
                      {timeSlots.find((slot) => slot.time === dateTime.time)?.label}
                    </span>
                  </div>
                  <button
                    onClick={() => handleRemoveDateTime(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    {t("step3.remove")}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={onPrev}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
        >
          {t("step2.previous")}
        </button>
        <button
          onClick={handleNext}
          disabled={!bookingData.selectedLocation || bookingData.selectedDates.length < 1}
          className="px-6 py-3 bg-[#143087] text-white rounded-lg hover:bg-[#0f2470] disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {t("step2.next")}
        </button>
      </div>
    </div>
  );
}