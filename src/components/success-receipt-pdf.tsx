import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  pdf,
} from "@react-pdf/renderer";
import type { BookingData } from "@/types/booking";

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
  },
  row: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  label: {
    fontSize: 12,
    color: "#6b7280",
  },
  value: {
    fontSize: 12,
    color: "#111827",
    textAlign: "right",
  },
  divider: {
    borderBottom: "1pt solid #e5e7eb",
    marginVertical: 10,
  },
});

function ReceiptDocument({
  bookingData,
  reservationId,
}: {
  bookingData: BookingData;
  reservationId: number | null;
}) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.header}>إيصال الحجز - هوم هيلرز</Text>
        <View style={styles.section}>
          <View style={styles.row}>
            <Text style={styles.value}>HH-{reservationId || Date.now()}</Text>
            <Text style={styles.label}>رقم الحجز:</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.value}>
              {new Date().toLocaleDateString("ar-SA")}
            </Text>
            <Text style={styles.label}>التاريخ:</Text>
          </View>
        </View>
        <Text style={styles.subHeader}>ملخص الدفع</Text>
        <View style={styles.section}>
          <View style={styles.row}>
            <Text style={styles.value}>
              {bookingData.pricing?.subTotal ?? 0} ريال
            </Text>
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
}

export async function downloadBookingReceipt(
  bookingData: BookingData,
  reservationId: number | null,
) {
  const blob = await pdf(
    <ReceiptDocument bookingData={bookingData} reservationId={reservationId} />,
  ).toBlob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `HomeHealers_Receipt_HH-${reservationId || Date.now()}.pdf`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
