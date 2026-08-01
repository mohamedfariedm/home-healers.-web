"use client";

import { useEffect, useState } from "react";
import {
  CheckCircle,
  Calendar,
  User,
  MapPin,
  CreditCard,
  Download,
  Home,
  Loader2,
} from "lucide-react";
import type { BookingData } from "@/types/booking";
import { Document, Page, Text, View, StyleSheet, Font, pdf } from "@react-pdf/renderer";
import { toast } from "sonner";
import { useLocalStorage } from "@/Hooks/use-local-storage";
import { useRouter } from "next/navigation";
import ClientAPI from "@/app/api/api";
import {
  clearCheckoutStorage,
  getPersistedReservationId,
} from "@/lib/checkout-storage";
import { parseReservationRecord } from "@/lib/payment-api";
import { useTranslation } from "react-i18next";

Font.register({
  family: "Amiri",
  fonts: [
    {
      src: "https://cdn.jsdelivr.net/gh/google/fonts@main/ofl/amiri/Amiri-Regular.ttf",
      fontWeight: 400,
    },
    {
      src: "https://cdn.jsdelivr.net/gh/google/fonts@main/ofl/amiri/Amiri-Bold.ttf",
      fontWeight: 700,
    },
  ],
});

Font.registerHyphenationCallback((word) => [word]);

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    padding: 20,
    fontFamily: "Amiri",
    textAlign: "right",
    backgroundColor: "#f9fafb",
  },
  header: {
    fontSize: 24,
    fontWeight: 700,
    marginBottom: 15,
    textAlign: "center",
    color: "#143087",
    borderBottom: "1pt solid #e5e7eb",
    paddingBottom: 10,
  },
  subHeader: {
    fontSize: 16,
    fontWeight: 700,
    marginTop: 15,
    marginBottom: 10,
    color: "#1e40af",
  },
  text: {
    fontSize: 12,
    marginBottom: 6,
    color: "#374151",
  },
  bold: {
    fontWeight: 700,
  },
  section: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    border: "1pt solid #e5e7eb",
    textAlign: "right",
  },
  row: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    marginBottom: 8,
    paddingHorizontal: 10,
  },
  label: {
    fontSize: 12,
    color: "#6b7280",
    width: "40%",
    textAlign: "right",
  },
  value: {
    fontSize: 12,
    fontWeight: 400,
    color: "#111827",
    width: "60%",
    textAlign: "right",
  },
  divider: {
    borderBottom: "1pt solid #e5e7eb",
    marginVertical: 10,
  },
  footer: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    fontSize: 10,
    textAlign: "center",
    color: "#6b7280",
    borderTop: "1pt solid #e5e7eb",
    paddingTop: 10,
  },
});

const ReceiptDocument = ({
  bookingData,
  reservationId,
}: {
  bookingData: BookingData;
  reservationId: number | null;
}) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.header}>إيصال الحجز - هوم هيلرز</Text>
      <View style={styles.section}>
        <View style={styles.row}>
          <Text style={styles.value}>HH-{reservationId || Date.now()}</Text>
          <Text style={styles.label}>رقم الحجز:</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.value}>{new Date().toLocaleDateString("ar-SA")}</Text>
          <Text style={styles.label}>التاريخ:</Text>
        </View>
      </View>
      <Text style={styles.subHeader}>ملخص الدفع</Text>
      <View style={styles.section}>
        <View style={styles.row}>
          <Text style={styles.value}>{bookingData.pricing?.subTotal ?? 0} ريال</Text>
          <Text style={styles.label}>المبلغ الأساسي:</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.row}>
          <Text style={[styles.value, styles.bold, { color: "#143087" }]}>
            {bookingData.pricing?.total ?? 0} ريال
          </Text>
          <Text style={[styles.label, styles.bold]}>المبلغ الإجمالي:</Text>
        </View>
      </View>
    </Page>
  </Document>
);

type PaymentSuccessProps = {
  orderRef?: string;
};

export default function PaymentSuccess({ orderRef }: PaymentSuccessProps) {
  const router = useRouter();
  const { t, i18n } = useTranslation("booking");
  const locale = i18n.language?.startsWith("en") ? "en" : "ar";
  const [bookingData] = useLocalStorage<BookingData>("bookingData", {} as BookingData);
  const [reservationId, setReservationId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [paymentVerified, setPaymentVerified] = useState(false);

  useEffect(() => {
    const verifyPayment = async () => {
      const persistedId = getPersistedReservationId();
      if (!persistedId) {
        toast.error(t("messages.reservationIdMissing"));
        router.push("/");
        return;
      }

      setReservationId(persistedId);

      try {
        const response = await ClientAPI.getReservation(persistedId, locale);
        const reservation = parseReservationRecord(response);
        const paymentStatus = reservation?.payment_status;

        if (paymentStatus === "paid") {
          setPaymentVerified(true);
          clearCheckoutStorage();
        } else {
          toast.error(t("paymentReturn.notPaidYet"));
          router.push(`/${locale}/failed/${orderRef ?? "unknown"}`);
          return;
        }
      } catch (error) {
        console.error("Failed to verify payment:", error);
        toast.error(t("paymentReturn.verifyFailed"));
      } finally {
        setIsLoading(false);
      }
    };

    verifyPayment();
  }, [locale, orderRef, router, t]);

  const handleDownloadReceipt = async () => {
    if (!bookingData?.pricing) return;
    try {
      const blob = await pdf(
        <ReceiptDocument bookingData={bookingData} reservationId={reservationId} />
      ).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `HomeHealers_Receipt_HH-${reservationId || Date.now()}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error(t("step6.pdfError"));
    }
  };

  const handleGoHome = () => {
    clearCheckoutStorage();
    router.push("/");
  };

  const hasBookingDetails =
    bookingData &&
    Object.keys(bookingData).length > 0 &&
    bookingData.selectedPatients?.length;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-10 w-10 animate-spin text-[#143087]" />
      </div>
    );
  }

  if (!paymentVerified) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-12" dir="rtl">
      <div className="text-center py-12">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-green-800 mb-4">
          {t("paymentReturn.successTitle")}
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          {t("paymentReturn.successMessage")}
        </p>
        <div className="inline-flex items-center gap-2 px-6 py-3 bg-green-50 border border-green-200 rounded-lg">
          <span className="text-green-800 font-medium">{t("step6.reservationNumber")}:</span>
          <span className="text-green-600 font-bold">HH-{reservationId}</span>
        </div>
        {orderRef && (
          <p className="text-sm text-gray-500 mt-3">
            {t("paymentReturn.orderRef")}: {orderRef}
          </p>
        )}
      </div>

      {hasBookingDetails && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <User className="w-6 h-6 text-[#62a0f6]" />
              {t("step6.bookingDetails")}
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">
                  {bookingData.selectedPatients?.map((p) => p.name).join(", ")}
                </span>
                <span className="text-gray-600">{t("step5.patientName")}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">
                  {bookingData.selectedDoctor?.name || t("step5.notSpecified")}
                </span>
                <span className="text-gray-600">{t("step6.treatingDoctor")}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <MapPin className="w-6 h-6 text-[#62a0f6]" />
              {t("step6.locationAndSchedule")}
            </h2>
            <div className="space-y-4">
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="font-medium">
                  {bookingData.selectedLocation?.title || t("step5.notSpecified")}
                </p>
              </div>
              <div className="space-y-2">
                {bookingData.selectedDates?.map((dateTime, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span>{dateTime.date}</span>
                    <span>-</span>
                    <span>{dateTime.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6 lg:col-span-2">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <CreditCard className="w-6 h-6 text-[#62a0f6]" />
              {t("step6.paymentSummary")}
            </h2>
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800 text-sm">
                ✅ {t("step6.paymentSuccess")} {t("step6.via")} {t("step5.telrPayment")}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        {hasBookingDetails && (
          <button
            onClick={handleDownloadReceipt}
            className="flex items-center justify-center gap-2 px-8 py-3 border border-[#62a0f6] text-[#62a0f6] rounded-lg hover:bg-[#eff6fe] transition-colors"
          >
            <Download className="w-5 h-5" />
            {t("step6.downloadReceipt")}
          </button>
        )}
        <button
          onClick={handleGoHome}
          className="flex items-center justify-center gap-2 px-8 py-3 bg-[#143087] text-white rounded-lg hover:bg-[#0f2470] transition-colors"
        >
          <Home className="w-5 h-5" />
          {t("step6.goHome")}
        </button>
      </div>
    </div>
  );
}
