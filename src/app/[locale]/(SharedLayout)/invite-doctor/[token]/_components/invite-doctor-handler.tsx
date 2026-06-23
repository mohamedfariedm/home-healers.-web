"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { CheckCircle2, XCircle, Loader2, Calendar, User } from "lucide-react";
import ClientAPI from "@/app/api/api";

interface InviteDoctorHandlerProps {
  token: string;
  locale: string;
}

export default function InviteDoctorHandler({
  token,
  locale,
}: InviteDoctorHandlerProps) {
  const { t } = useTranslation("invite-doctor");
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDeclined, setIsDeclined] = useState(false);
  const [isReservationTaken, setIsReservationTaken] = useState(false);

  const handleAccept = async () => {
    setIsProcessing(true);
    try {
            
      const response = await ClientAPI.acceptReservationInvite(token, locale);
      
      if (response?.success || response?.status === true) {
        toast.success(t("messages.acceptSuccess"));
        setTimeout(() => {
          router.push(`/${locale}`);
        }, 2000);
      } else if (response?.error_code === "RESERVATION_TAKEN") {
        setIsReservationTaken(true);
        toast.error(t("messages.reservationTaken"));
      } else {
        toast.error(response?.message || t("messages.acceptError"));
      }
    } catch (error: any) {
      console.error("Error accepting reservation:", error);
      toast.error(t("messages.acceptErrorGeneric"));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDecline = () => {
    setIsDeclined(true);
    toast.success(t("messages.declineSuccess"));
    setTimeout(() => {
      router.push(`/${locale}`);
    }, 2000);
  };

  if (isReservationTaken) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-10 text-center">
        <div className="flex flex-col items-center justify-center">
          <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mb-6 shadow-lg">
            <XCircle className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3">
            {t("reservationTakenTitle")}
          </h2>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            {t("reservationTakenMessage")}
          </p>
          <button
             onClick={() => router.push(`/${locale}`)}
             className="px-8 py-3 bg-[#62a0f6] text-white rounded-xl font-bold hover:bg-[#5090e6] transition-all"
          >
            {locale === "ar" ? "العودة للرئيسية" : "Back to Home"}
          </button>
        </div>
      </div>
    );
  }

  if (isDeclined) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-10 text-center">
        <div className="flex flex-col items-center justify-center">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full flex items-center justify-center mb-6 shadow-lg">
            <CheckCircle2 className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3">
            {t("thankYou")}
          </h2>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            {t("declinedMessage")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 p-6 sm:p-8 text-center text-white relative overflow-hidden">
        <div className="relative">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">
            {t("title")}
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 sm:p-8">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100 mb-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
              <User className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <p className={`text-gray-800 text-base sm:text-lg leading-relaxed ${locale === "ar" ? "text-right" : "text-left"}`} dir={locale === "ar" ? "rtl" : "ltr"}>
                {t("message")}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-6">
          <button
            onClick={handleAccept}
            disabled={isProcessing}
            className="flex-1 h-14 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl font-bold text-lg hover:from-emerald-600 hover:to-green-700 disabled:opacity-60 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                {t("processing")}
              </>
            ) : (
              <>
                <CheckCircle2 className="w-6 h-6" />
                {t("accept")}
              </>
            )}
          </button>

          <button
            onClick={handleDecline}
            disabled={isProcessing}
            className="flex-1 h-14 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-bold text-lg hover:from-red-600 hover:to-red-700 disabled:opacity-60 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
          >
            <XCircle className="w-6 h-6" />
            {t("decline")}
          </button>
        </div>
      </div>
    </div>
  );
}
