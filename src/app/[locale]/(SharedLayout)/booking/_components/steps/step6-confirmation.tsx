"use client";
import {
  CheckCircle,
  Calendar,
  User,
  MapPin,
  CreditCard,
  Download,
  Home,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import type { BookingData } from "@/types/booking";
import { Document, Page, Text, View, StyleSheet, Font, pdf } from "@react-pdf/renderer";
import { toast } from "sonner";

// Register Amiri font
Font.register({
  family: "Amiri",
  src: "https://fonts.gstatic.com/s/amiri/v27/J7aRnpd8CGxBHqUp.ttf", // Amiri font URL
});

// Styles for the PDF
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    padding: 20,
    fontFamily: "Amiri",
    textAlign: "right",
    direction: "rtl",
    backgroundColor: "#f9fafb",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
    color: "#143087",
    borderBottom: "1pt solid #e5e7eb",
    paddingBottom: 10,
  },
  subHeader: {
    fontSize: 16,
    fontWeight: "bold",
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
    fontWeight: "bold",
  },
  section: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    border: "1pt solid #e5e7eb",
    boxShadow: "0 2pt 4pt rgba(0,0,0,0.1)",
        textAlign: "right",
    direction: "rtl",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
    paddingHorizontal: 10,
        textAlign: "right",
    direction: "rtl",
  },
  label: {
    fontSize: 12,
    color: "#6b7280",
    width: "40%",
    textAlign: "right",
    direction: "rtl",
  },
  value: {
    fontSize: 12,
    fontWeight: "medium",
    color: "#111827",
    width: "60%",
        textAlign: "right",
    direction: "rtl",
  },
  divider: {
    borderBottom: "1pt solid #e5e7eb",
    marginVertical: 10,
        flexDirection: "row",
    justifyContent: "space-between",
            textAlign: "right",
    direction: "rtl",
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

interface Step6Props {
  bookingData: BookingData;
  reservationId?: number | null;
}

// PDF Document Component
const ReceiptDocument = ({ bookingData, reservationId }: Step6Props) => (
  <Document>
    <Page size="A4"  style={styles.page}>
      {/* Header */}
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

      {/* Patient Info */}
      <Text style={styles.subHeader}>تفاصيل الحجز</Text>
      <View style={styles.section}>
        <View style={styles.row}>
          <Text style={styles.value}>
            {bookingData.selectedPatients?.map((p) => p.name).join(", ") || "غير محدد"}
          </Text>
          <Text style={styles.label}>اسم المريض:</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.value}>{bookingData.selectedDoctor?.name || "غير محدد"}</Text>
          <Text style={styles.label}>الطبيب المعالج:</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.value}>{bookingData.selectedDoctor?.specialist || "غير محدد"}</Text>
          <Text style={styles.label}>التخصص:</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.value}>{bookingData.healthInfo.painLocation || "غير محدد"}</Text>
          <Text style={styles.label}>المشكلة الصحية:</Text>
        </View>
        {bookingData.selectedPackage && (
          <View style={styles.row}>
            <Text style={styles.value}>{bookingData.selectedPackage.name || "غير محدد"}</Text>
            <Text style={styles.label}>الباقة المختارة:</Text>
          </View>
        )}
      </View>

      {/* Location & Schedule */}
      <Text style={styles.subHeader}>الموقع والمواعيد</Text>
      <View style={styles.section}>
        <View style={styles.row}>
          <Text style={styles.value}>{bookingData.selectedLocation?.title || "غير محدد"}</Text>
          <Text style={styles.label}>موقع الزيارة:</Text>
        </View>
        <Text style={[styles.text, { paddingHorizontal: 10 }]}>
          {bookingData.selectedLocation?.address || "غير محدد"}
        </Text>
        <View style={styles.divider} />
        <Text style={[styles.text, { paddingHorizontal: 10 }]}>المواعيد المحجوزة:</Text>
        {bookingData.selectedDates.map((dateTime, index) => (
          <Text key={index} style={[styles.text, { paddingHorizontal: 10 }]}>
            {dateTime.date} - {dateTime.time}
          </Text>
        ))}
      </View>

      {/* Payment Summary */}
      <Text style={styles.subHeader}>ملخص الدفع</Text>
      <View style={styles.section}>
        <View style={styles.row}>
          <Text style={styles.value}>{bookingData.pricing.subTotal} ريال</Text>
          <Text style={styles.label}>المبلغ الأساسي:</Text>
        </View>
        {bookingData.pricing.tax > 0 && (
          <View style={styles.row}>
            <Text style={styles.value}>{bookingData.pricing.tax} ريال</Text>
            <Text style={styles.label}>رسوم الجنسية (15%):</Text>
          </View>
        )}
        {bookingData.pricing.fees > 0 && (
          <View style={styles.row}>
            <Text style={styles.value}>{bookingData.pricing.fees} ريال</Text>
            <Text style={styles.label}>رسوم مزود الدفع:</Text>
          </View>
        )}
        {(bookingData.pricing.couponDiscount ?? 0) > 0 && (
          <View style={styles.row}>
            <Text style={[styles.value, { color: "#16a34a" }]}>
              -{bookingData.pricing.couponDiscount} ريال
            </Text>
            <Text style={styles.label}>خصم الكوبون:</Text>
          </View>
        )}
        {bookingData.pricing.discount > 0 && (
          <View style={styles.row}>
            <Text style={[styles.value, { color: "#16a34a" }]}>-{bookingData.pricing.discount} ريال</Text>
            <Text style={styles.label}>الخصم:</Text>
          </View>
        )}
        <View style={styles.divider} />
        <View style={styles.row}>
          <Text style={[styles.value, styles.bold, { color: "#143087" }]}>
            {bookingData.pricing.total} ريال
          </Text>
          <Text style={[styles.label, styles.bold]}>المبلغ الإجمالي:</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.value}>
            {bookingData.paymentMethod === "cash"
              ? "نقداً"
              : bookingData.paymentMethod === "telr"
              ? "Telr Payment"
              : bookingData.paymentMethod === "wallet"
              ? "المحفظة"
              : "غير محدد"}
          </Text>
          <Text style={styles.label}>طريقة الدفع:</Text>
        </View>
      </View>

      {/* Footer */}
      <Text style={styles.footer}>
        فريق هوم هيلرز - support@homehealers.com | للتواصل: +966 50 000 0000
      </Text>
    </Page>
  </Document>
);

export default function Step6Confirmation({ bookingData, reservationId }: Step6Props) {
  const { t } = useTranslation("booking");
  const isCashPending =
    bookingData.paymentStatus === "cash_pending" ||
    (bookingData.paymentMethod === "cash" && bookingData.paymentStatus !== "paid");

  const paymentMethodLabel =
    bookingData.paymentMethod === "cash"
      ? t("step5.cash")
      : bookingData.paymentMethod === "telr"
      ? t("step5.telrPayment")
      : bookingData.paymentMethod === "wallet"
      ? t("step5.wallet")
      : t("step5.notSpecified");
  const handleDownloadReceipt = async () => {
    try {
      const blob = await pdf(<ReceiptDocument bookingData={bookingData} reservationId={reservationId} />).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `HomeHealers_Receipt_HH-${reservationId || Date.now()}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error: any) {
      console.error("Error generating PDF:", error);
      toast.error(t("step6.pdfError") || "فشل في إنشاء إيصال الحجز. حاول مرة أخرى.");
    }
  };

  const handleGoHome = () => {
    localStorage.removeItem("bookingData");
    window.location.href = "/";
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8" data-tour="tour-confirmation">
      {/* Success Header */}
      <div className="text-center py-12">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-green-800 mb-4">
          {t("step6.successTitle")}
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          {t("step6.successMessage")}
        </p>
        <div className="inline-flex items-center gap-2 px-6 py-3 bg-green-50 border border-green-200 rounded-lg">
          <span className="text-green-800 font-medium">{t("step6.reservationNumber")}:</span>
          <span className="text-green-600 font-bold">HH-{reservationId || Date.now()}</span>
        </div>
      </div>

      {/* Booking Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Patient & Doctor Info */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <User className="w-6 h-6 text-[#62a0f6]" />
            {t("step6.bookingDetails")}
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="font-medium">
                {bookingData.selectedPatients?.map((p) => p.name).join(", ") || t("step5.notSpecified")}
              </span>
              <span className="text-gray-600">{t("step5.patientName")}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="font-medium">
                {bookingData.selectedDoctor?.name || t("step5.notSpecified")}
              </span>
              <span className="text-gray-600">{t("step6.treatingDoctor")}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="font-medium">
                {bookingData.selectedDoctor?.specialist || t("step5.notSpecified")}
              </span>
              <span className="text-gray-600">{t("step6.specialty")}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="font-medium">
                {bookingData.healthInfo.painLocation || t("step5.notSpecified")}
              </span>
              <span className="text-gray-600">{t("step5.healthIssue")}</span>
            </div>
            {bookingData.selectedPackage && (
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <span className="font-medium text-blue-800">
                  {bookingData.selectedPackage.name || t("step5.notSpecified")}
                </span>
                <span className="text-blue-600">{t("step5.selectedPackage")}</span>
              </div>
            )}
          </div>
        </div>

        {/* Location & Schedule */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <MapPin className="w-6 h-6 text-[#62a0f6]" />
            {t("step6.locationAndSchedule")}
          </h2>
          <div className="space-y-4">
            <div className="p-3 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-600 mb-1">{t("step5.visitLocation")}</h3>
              <p className="font-medium">
                {bookingData.selectedLocation?.title || t("step5.notSpecified")}
              </p>
              <p className="text-sm text-gray-600">
                {bookingData.selectedLocation?.address || t("step5.notSpecified")}
              </p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-600 mb-2">
                {t("step6.bookedAppointments")}
              </h3>
              <div className="space-y-2">
                {bookingData.selectedDates.map((dateTime, index) => (
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
        </div>

        {/* Payment Summary */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-[#62a0f6]" />
            {t("step6.paymentSummary")}
          </h2>
          <div className="space-y-3 p-4 bg-[#eff6fe] rounded-lg">
            <div className="flex justify-between">
              <span className="font-medium">
                {bookingData.pricing.subTotal} {t("step5.currency")}
              </span>
              <span className="text-gray-600">{t("step5.baseAmount")}</span>
            </div>
            {bookingData.pricing.tax > 0 && (
              <div className="flex justify-between">
                <span className="font-medium">
                  {bookingData.pricing.tax} {t("step5.currency")}
                </span>
                <span className="text-gray-600">{t("step5.nationalityTax")}</span>
              </div>
            )}
            {bookingData.pricing.fees > 0 && (
              <div className="flex justify-between">
                <span className="font-medium">
                  {bookingData.pricing.fees} {t("step5.currency")}
                </span>
                <span className="text-gray-600">{t("step5.providerFees")}</span>
              </div>
            )}
            {(bookingData.pricing.couponDiscount ?? 0) > 0 && (
              <div className="flex justify-between text-green-600">
                <span className="font-medium">
                  -{bookingData.pricing.couponDiscount} {t("step5.currency")}
                </span>
                <span>{t("step5.couponDiscount")}</span>
              </div>
            )}
            {bookingData.pricing.discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span className="font-medium">
                  -{bookingData.pricing.discount} {t("step5.currency")}
                </span>
                <span>{t("step5.discount")}</span>
              </div>
            )}
            <div className="border-t border-gray-300 pt-3">
              <div className="flex justify-between text-lg font-bold">
                <span className="text-[#62a0f6]">
                  {bookingData.pricing.total} {t("step5.currency")}
                </span>
                <span>{t("step5.totalAmount")}</span>
              </div>
            </div>
          </div>
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800 text-sm">
              {isCashPending ? (
                <>💵 {t("step6.cashPendingMessage")}</>
              ) : (
                <>
                  ✅ {t("step6.paymentSuccess")} {t("step6.via")}{" "}
                  {paymentMethodLabel}
                </>
              )}
            </p>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-xl font-bold mb-6">{t("step6.nextSteps")}</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
              <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                1
              </div>
              <div>
                <h3 className="font-medium">{t("step6.confirmAppointment")}</h3>
                <p className="text-sm text-gray-600">
                  {t("step6.confirmAppointmentDesc")}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
              <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                2
              </div>
              <div>
                <h3 className="font-medium">{t("step6.prepareVisit")}</h3>
                <p className="text-sm text-gray-600">
                  {t("step6.prepareVisitDesc")}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
              <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                3
              </div>
              <div>
                <h3 className="font-medium">{t("step6.visitDay")}</h3>
                <p className="text-sm text-gray-600">
                  {t("step6.visitDayDesc")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={handleDownloadReceipt}
          className="flex items-center justify-center gap-2 px-8 py-3 border border-[#62a0f6] text-[#62a0f6] rounded-lg hover:bg-[#eff6fe] transition-colors"
        >
          <Download className="w-5 h-5" />
          {t("step6.downloadReceipt")}
        </button>
        <button
          onClick={handleGoHome}
          className="flex items-center justify-center gap-2 px-8 py-3 bg-[#143087] text-white rounded-lg hover:bg-[#0f2470] transition-colors"
        >
          <Home className="w-5 h-5" />
          {t("step6.goHome")}
        </button>
      </div>

      {/* Contact Info */}
      <div className="text-center p-6 bg-gray-50 rounded-lg">
        <h3 className="font-bold mb-2">{t("step6.needHelp")}</h3>
        <p className="text-gray-600 mb-4">
          {t("step6.customerService")}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="tel:+966500000000"
            className="text-[#62a0f6] hover:underline"
          >
            📞 +966 50 000 0000
          </a>
          <a
            href="mailto:support@homehealers.com"
            className="text-[#62a0f6] hover:underline"
          >
            ✉️ support@homehealers.com
          </a>
        </div>
      </div>
    </div>
  );
}
