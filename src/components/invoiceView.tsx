"use client";
import React, { useMemo, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import QRCode from 'react-qr-code';

type ApiDetail = {
  id: number;
  invoice_id: number;
  client_id: number | null;
  customer_name: string;
  national_id: string | null;
  service_name: string;
  service_code: string | null;
  service_id?: number;
  doctor_id: number;
  session_price: string | number; // backend sends strings
  session_count: string | number; // backend sends strings
  tax_percentage?: string;        // <-- added (e.g. "15%")
};

type ApiInvoice = {
  id: number;
  invoice_number: string;
  invoice_date: string;

  discount: string;            // "20.00"
  total_before_tax: string;    // "2000.00"
  tax_total: string;           // "300.00"
  tax_percentage: string;      // can be "0", "15%", "20%", "معافاه"
  national_id?: string | null; // sometimes null at header
  grand_total: string;         // "2280.00"
  balance_due: string;         // "2280.00"
  status: string;
  notes?: string | null;       // <-- renamed in your JSON as "notes"
  zatca_status?: string | null;
  zatca_qr?: string | null;
  creator?: {
    id: number;
    name: { en: string; ar: string };
    email: string;
  };
  details: ApiDetail[];
};

interface InvoiceViewProps {
  invoiceData: ApiInvoice;
}

const parseNum = (v: unknown) => {
  const n = typeof v === 'string' ? parseFloat(v) : Number(v);
  return Number.isFinite(n) ? n : 0;
};

const fmt = (v: unknown) => parseNum(v).toFixed(2);

const normalizeTaxLabel = (tp?: string) => {
  if (!tp) return '0%';
  if (tp === 'معافاه') return 'معافاه';
  if (tp.endsWith('%')) return tp;
  const n = Number(tp);
  return Number.isFinite(n) ? `${n}%` : tp;
};

const taxRateFrom = (tp?: string) => {
  if (!tp || tp === 'معافاه') return 0;
  if (tp.endsWith('%')) return parseNum(tp) / 100;
  const n = Number(tp);
  return Number.isFinite(n) ? n / 100 : 0;
};

const serviceLabel = (name?: string | null, code?: string | null) => {
  const n = (name ?? '').trim() || '—';
  const c = code != null ? String(code).trim() : '';
  return c ? `${n} (${c})` : n;
};

/** Format API ISO date (e.g. 2026-10-28T00:00:00.000000Z) as DD/MM/YYYY without timezone shift. */
const formatInvoiceDate = (value?: string | null) => {
  if (!value) return '—';
  const m = String(value).match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (m) return `${m[3]}/${m[2]}/${m[1]}`;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  return `${dd}/${mm}/${d.getFullYear()}`;
};

export default function InvoiceView({ invoiceData }: InvoiceViewProps) {
  const invoiceRef = useRef<HTMLDivElement>(null);

  // Header tax (used only as fallback if a detail doesn't include its own)
  const headerTaxRate = useMemo(() => taxRateFrom(invoiceData.tax_percentage), [invoiceData.tax_percentage]);
  const headerTaxLabel = useMemo(() => normalizeTaxLabel(invoiceData.tax_percentage), [invoiceData.tax_percentage]);

  const zatcaQr =
    typeof invoiceData.zatca_qr === 'string' && invoiceData.zatca_qr.trim() !== ''
      ? invoiceData.zatca_qr.trim()
      : null;

// Unique services (header display)
  const uniqueServices = useMemo(() => {
    const set = new Set<string>();
    for (const d of invoiceData.details || []) set.add(serviceLabel(d.service_name, d.service_code));
    return Array.from(set.values());
  }, [invoiceData.details]);

  // ---------- CALC FROM DETAILS ONLY ----------
  const {
    rows,
    subtotal,
    taxTotal,
    discountTotal,
    grandTotal,
    balanceDue,
    headerTaxLabelToShow,
  } = useMemo(() => {
    const details = invoiceData.details || [];

    // 1) بناء قيم البنود بدون خصم
    const baseRows = details.map((d, idx) => {
      const price = parseNum(d.session_price);
      const qty = parseNum(d.session_count);
      const lineBeforeTax = price * qty;

      const rate = taxRateFrom(d.tax_percentage);             // استخدم نسبة البند فقط
      const rateLabel = normalizeTaxLabel(d.tax_percentage);  // (قد تكون "15%" أو "معافاه" أو "0%")
      const lineTax = lineBeforeTax * rate;

      return {
        i: idx + 1,
        serviceLabel: serviceLabel(d.service_name, d.service_code),
        customerName: d.customer_name,
        qty,
        price,
        lineBeforeTax,
        lineTax,
        taxLabel: rateLabel,
      };
    });

    // 2) الإجمالي قبل الضريبة من التفاصيل فقط
    const subtotal = baseRows.reduce((s, r) => s + r.lineBeforeTax, 0);

    // 3) خصم الفاتورة من الهيدر (لو موجود) ويتم توزيعه نسبيًا
    const discountTotal = parseNum(invoiceData.discount);

    // 4) توزيع الخصم على البنود
    const rowsWithDiscount = baseRows.map(r => {
      const lineDiscount = subtotal > 0 && discountTotal > 0
        ? (r.lineBeforeTax / subtotal) * discountTotal
        : 0;
      const lineTotal = r.lineBeforeTax - lineDiscount + r.lineTax;
      return { ...r, lineDiscount, lineTotal };
    });

    // 5) مجموع الضريبة من التفاصيل فقط
    const taxTotal = rowsWithDiscount.reduce((s, r) => s + r.lineTax, 0);

    // 6) الإجمالي والرصيد محسوبين محليًا
    const grandTotal = subtotal - discountTotal + taxTotal;
    const balanceDue = grandTotal; // لو عندك مدفوعات/سداد لاحق، اطرحها هنا

    // 7) تسمية الضريبة في الهيدر (تُعرض فقط لو نسبة واحدة غير صفر/غير "معافاه")
    const taxedLabels = new Set(
      rowsWithDiscount
        .filter(r => r.lineTax > 0)
        .map(r => r.taxLabel)
        .filter(lbl => lbl !== '0%' && lbl !== '0' && lbl !== 'معافاه')
    );
    const headerTaxLabelToShow = taxedLabels.size === 1 ? Array.from(taxedLabels)[0] : '';

    return {
      rows: rowsWithDiscount,
      subtotal,
      taxTotal,
      discountTotal,
      grandTotal,
      balanceDue,
      headerTaxLabelToShow,
    };
  }, [invoiceData.details, invoiceData.discount]);

  const handleDownloadPDF = async () => {
    if (!invoiceRef.current) return;
    const canvas = await html2canvas(invoiceRef.current, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
      onclone: (clonedDoc) => {
        const clonedElement = clonedDoc.querySelector('[data-invoice-ref]') || clonedDoc.body;
        if (clonedElement && clonedElement instanceof HTMLElement) {
          clonedElement.setAttribute('dir', 'rtl');
          clonedElement.style.direction = 'rtl';
          clonedElement.style.textAlign = 'right';
          clonedElement.style.fontFamily = 'Arial, sans-serif';
          clonedElement.style.boxSizing = 'border-box';
          clonedElement.style.overflow = 'visible';
          // Avoid double left border in PDF (Card border/shadow + page frame)
          clonedElement.style.boxShadow = 'none';
          clonedElement.style.border = 'none';
          clonedElement.style.outline = 'none';
        }
        clonedDoc.querySelectorAll('[dir], .text-right, ul, ol, li, p, h1, h2, h3, h4').forEach((node) => {
          if (node instanceof HTMLElement) {
            node.style.direction = 'rtl';
          }
        });
        clonedDoc.querySelectorAll('[data-pdf-hide]').forEach((node) => {
          if (node instanceof HTMLElement) node.style.display = 'none';
        });
        clonedDoc.querySelectorAll('table, th, td').forEach((node) => {
          if (node instanceof HTMLElement) {
            node.style.borderCollapse = 'collapse';
            node.style.boxSizing = 'border-box';
          }
        });
      },
    });

    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const margin = 14;
    const contentWidth = pdfWidth - margin * 2;
    const contentHeight = pdfHeight - margin * 2 - 8;
    const pageSlicePx = Math.floor((contentHeight * canvas.width) / contentWidth);

    const isRowMostlyWhite = (y: number) => {
      const probe = document.createElement('canvas');
      probe.width = canvas.width;
      probe.height = 1;
      const probeCtx = probe.getContext('2d', { willReadFrequently: true });
      if (!probeCtx) return false;
      probeCtx.drawImage(canvas, 0, y, canvas.width, 1, 0, 0, canvas.width, 1);
      const row = probeCtx.getImageData(0, 0, canvas.width, 1).data;
      let darkPixels = 0;
      for (let x = 0; x < canvas.width; x += 6) {
        const i = x * 4;
        if (row[i] < 245 || row[i + 1] < 245 || row[i + 2] < 245) darkPixels += 1;
      }
      return darkPixels < Math.max(4, canvas.width / 200);
    };

    // Drop trailing whitespace so it does not create an empty second page
    let contentBottom = canvas.height - 1;
    while (contentBottom > 0 && isRowMostlyWhite(contentBottom)) {
      contentBottom -= 1;
    }
    contentBottom = Math.min(canvas.height, contentBottom + 8);

    const findSafeBreakY = (idealY: number, searchRange: number) => {
      const clampedIdeal = Math.min(Math.max(idealY, 1), contentBottom - 1);
      const minY = Math.max(1, clampedIdeal - searchRange);
      for (let y = clampedIdeal; y >= minY; y -= 2) {
        if (isRowMostlyWhite(y)) return y;
      }
      return clampedIdeal;
    };

    const pageBreaks: number[] = [0];
    if (contentBottom <= pageSlicePx) {
      pageBreaks.push(contentBottom);
    } else {
      let cursor = 0;
      while (cursor < contentBottom - 2) {
        const remaining = contentBottom - cursor;
        if (remaining <= pageSlicePx) {
          pageBreaks.push(contentBottom);
          break;
        }
        const idealEnd = cursor + pageSlicePx;
        const safeEnd = findSafeBreakY(idealEnd, Math.floor(pageSlicePx * 0.22));
        const nextY = Math.max(cursor + Math.floor(pageSlicePx * 0.55), safeEnd);
        pageBreaks.push(Math.min(nextY, contentBottom));
        cursor = pageBreaks[pageBreaks.length - 1];
      }
    }

    while (pageBreaks.length > 2) {
      const start = pageBreaks[pageBreaks.length - 2];
      const end = pageBreaks[pageBreaks.length - 1];
      if (end - start < 24) {
        pageBreaks.pop();
        continue;
      }
      let hasContent = false;
      for (let y = start; y < end; y += 8) {
        if (!isRowMostlyWhite(y)) {
          hasContent = true;
          break;
        }
      }
      if (!hasContent) {
        pageBreaks.pop();
        continue;
      }
      break;
    }

    const totalPages = Math.max(1, pageBreaks.length - 1);

    for (let pageIndex = 0; pageIndex < totalPages; pageIndex++) {
      if (pageIndex > 0) pdf.addPage();

      const sourceY = pageBreaks[pageIndex];
      const sourceHeight = Math.max(1, pageBreaks[pageIndex + 1] - sourceY);
      const pageCanvas = document.createElement('canvas');
      pageCanvas.width = canvas.width;
      pageCanvas.height = sourceHeight;
      const pageCtx = pageCanvas.getContext('2d');
      if (!pageCtx) continue;

      pageCtx.fillStyle = '#ffffff';
      pageCtx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
      pageCtx.drawImage(
        canvas,
        0,
        sourceY,
        canvas.width,
        sourceHeight,
        0,
        0,
        canvas.width,
        sourceHeight
      );

      const pageImgData = pageCanvas.toDataURL('image/png');
      const pageImgHeight = (sourceHeight * contentWidth) / canvas.width;
      pdf.addImage(pageImgData, 'PNG', margin, margin, contentWidth, pageImgHeight);

      pdf.setFontSize(9);
      pdf.setTextColor(120);
      pdf.text(
        `Page ${pageIndex + 1} of ${totalPages}  |  Invoice #${invoiceData.invoice_number}`,
        pdfWidth / 2,
        pdfHeight - 8,
        { align: 'center' }
      );
    }

    pdf.save(`invoice_${invoiceData.invoice_number}.pdf`);
  };

  return (
    <div className="mx-auto max-w-4xl overflow-x-auto bg-white p-4 sm:p-6" dir="rtl">
      <div className="flex justify-center items-center mb-4">
        <Button
          onClick={handleDownloadPDF}
          data-gtm-event="invoice_download"
          data-gtm-location="invoice_page"
          className="mb-4 bg-blue-600 text-white hover:bg-blue-700"
        >
          تحميل الفاتورة كـ PDF
        </Button>
      </div>

        <Card ref={invoiceRef} data-invoice-ref className="p-4 shadow-lg sm:p-8" dir="rtl">
        {/* Header: full-width title + logo, then seller info + invoice meta */}
        <div className="flex items-center justify-between gap-3 mb-3 w-full">
          <h1 className="text-2xl font-bold">فاتورة ضريبية مبسطة</h1>
          <img
            src="data:image/png;base64,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"
            alt="Company Logo"
            className="h-14 w-auto shrink-0"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6 items-start">
          <div className="text-right">
            <div className="text-sm text-muted-foreground leading-snug space-y-0.5">
              <p>مؤسسة هوم هيلرز</p>
              <p>الرقم الضريبي (310796025900003)</p>
              <p>السجل التجاري رقم (4031281879)</p>
              <p>العنوان المختصر : R L D A  4 4 4 1</p>
              <p>رقم المبنى : 4441</p>
              <p>الشارع : البقاع</p>
              <p>الرقم الفرعي : 7020</p>
              <p>الحي : حى الشفا</p>
              <p>الرمز البريدي : 14712</p>
              <p>المدينة : الرياض</p>
            </div>
          </div>

          <div className="space-y-2 mt-5">
            <div className="flex justify-between gap-4">
              <span className="font-medium">الحالة:</span>
              <span>{invoiceData.status}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="font-medium">رقم الفاتورة:</span>
              <span>{invoiceData.invoice_number}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="font-medium">تاريخ الفاتورة:</span>
              <span>{formatInvoiceDate(invoiceData.invoice_date)}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="font-medium">الخدمات:</span>
              <span>
                {uniqueServices.length <= 1 ? uniqueServices[0] ?? '—' : `${uniqueServices.length} خدمات`}
              </span>
            </div>
            <div className="flex justify-between gap-4 bg-gray-100 px-3 py-2 rounded">
              <span className="font-medium">الرصيد:</span>
              <span className="font-bold">{fmt(balanceDue)} ر.س</span>
            </div>
          </div>
        </div>

        {invoiceData.notes && (
          <div className="mb-6 text-right">
            <h4 className="font-semibold mb-1">الملاحظات</h4>
            <p className="text-sm whitespace-normal">{invoiceData.notes}</p>
          </div>
        )}

           <div className="mb-8 overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-3 text-right font-medium">#</th>
              <th className="border border-gray-300 p-3 text-right font-medium">الخدمة</th>
              <th className="border border-gray-300 p-3 text-right font-medium">اسم العميل</th>
              <th className="border border-gray-300 p-3 text-right font-medium">الكمية</th>
              <th className="border border-gray-300 p-3 text-right font-medium">سعر الوحدة</th>
              <th className="border border-gray-300 p-3 text-right font-medium">الخصم</th>
              <th className="border border-gray-300 p-3 text-right font-medium">الإجمالي قبل الضريبة</th>
              <th className="border border-gray-300 p-3 text-right font-medium">الضريبة</th>
              <th className="border border-gray-300 p-3 text-right font-medium">الإجمالي</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td className="border border-gray-300 p-3 text-center" colSpan={9}>
                  لا توجد عناصر
                </td>
              </tr>
            ) : (
              rows.map((r) => (
                <tr key={r.i}>
                  <td className="border border-gray-300 p-3 text-center">{r.i}</td>
                  <td className="border border-gray-300 p-3 text-right">{r.serviceLabel}</td>
                  <td className="border border-gray-300 p-3 text-right">{r.customerName}</td>
                  <td className="border border-gray-300 p-3 text-center">{r.qty}</td>
                  <td className="border border-gray-300 p-3 text-center">{fmt(r.price)} ر.س</td>
                  <td className="border border-gray-300 p-3 text-center">
                    {r.lineDiscount > 0 ? `${fmt(r.lineDiscount)} ر.س` : '—'}
                  </td>
                  <td className="border border-gray-300 p-3 text-center">{fmt(r.lineBeforeTax)} ر.س</td>
                  <td className="border border-gray-300 p-3 text-center">
                    {r.lineTax > 0 ? `${fmt(r.lineTax)} ر.س (${r.taxLabel})` : r.taxLabel === 'معافاه' ? 'معافاه' : '—'}
                  </td>
                  <td className="border border-gray-300 p-3 text-center">{fmt(r.lineTotal)} ر.س</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* الإجماليات + QR */}
      <div className="grid grid-cols-2 gap-8 mb-8">
        <div className="flex flex-col items-center justify-center gap-2">
            {zatcaQr ? (
              <div
                className="bg-white"
                style={{ width: 300, height: 300, boxSizing: 'border-box', padding: 20 }}
              >
                <QRCode value={zatcaQr} size={260} bgColor="#ffffff" fgColor="#000000" level="M" style={{ width: '100%', height: '100%' }} />
              </div>
            ) : (
              <p className="max-w-[12rem] text-center text-sm text-gray-600">
                {/* لم يتم إرسال الفاتورة إلى هيئة الزكاة بعد */}
              </p>
            )}
          </div>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>الإجمالي قبل الضريبة:</span>
            <span className="font-bold">{fmt(subtotal)} ر.س</span> {/* NEW */}
          </div>
          <div className="flex justify-between">
            <span>
              إجمالي الضريبة{headerTaxLabelToShow ? ` (${headerTaxLabelToShow})` : ''}:
            </span>
            <span className="font-bold">{fmt(taxTotal)} ر.س</span> {/* NEW */}
          </div>
          {discountTotal > 0 && (
            <div className="flex justify-between">
              <span>الخصم:</span>
              <span className="font-bold">-{fmt(discountTotal)} ر.س</span> {/* NEW */}
            </div>
          )}
          <div className="flex justify-between">
            <span>المجموع:</span>
            <span className="font-bold">{fmt(grandTotal)} ر.س</span> {/* NEW */}
          </div>
          <div className="flex justify-between border-t pt-2">
            <span className="font-bold">المبلغ المستحق:</span>
            <span className="font-bold text-lg">{fmt(balanceDue)} ر.س</span> {/* NEW */}
          </div>
        </div>
      </div>

        {/* Footer */}
        <div className="border-t pt-6">
          <div className="text-right text-xs leading-snug text-muted-foreground mb-4" dir="rtl">
            <h4 className="font-bold text-foreground text-sm mb-2">سياسة الإلغاء والاسترداد</h4>

            <div className="grid grid-cols-2 gap-x-6 gap-y-3">
              <div>
                <p className="font-semibold text-foreground">الإلغاء المبكر (قبل الموعد بـ 12 ساعة أو أكثر):</p>
                <div className="mt-0.5 space-y-0">
                  <p>• يحق للعميل استرجاع المبلغ كاملاً.</p>
                  <p>• تتم عملية الاسترداد خلال 30 يوم عمل.</p>
                </div>
              </div>

              <div>
                <p className="font-semibold text-foreground">الإلغاء المتأخر أو عدم الحضور (أقل من 12 ساعة / تعذر الجلسة بسبب العميل):</p>
                <div className="mt-0.5 space-y-0">
                  <p>• يُخصم كامل المبلغ ولا يحق للعميل المطالبة بالاسترجاع.</p>
                </div>
              </div>

              <div>
                <p className="font-semibold text-foreground">سياسة باقات الجلسات:</p>
                <div className="mt-0.5 space-y-0">
                  <p>• مبالغ الباقات غير مستردة نهائياً بعد بدء الجلسات.</p>
                  <p>• مدة صلاحية استخدام الباقة هي 6 أشهر من تاريخ الشراء.</p>
                </div>
              </div>

              <div>
                <p className="font-semibold text-foreground">اعتذار المركز أو الأخصائي:</p>
                <div className="mt-0.5 space-y-0">
                  <p>• يلتزم المركز بتوفير موعد بديل مجاني بالكامل في حال اعتذار الأخصائي عن الحضور.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center border-t pt-4">
            <h4 className="font-bold mb-1 text-sm">التوقيع</h4>
            <div className="text-center text-sm">الإلكترونية سجدة</div>
          </div>
        </div>

        {/* Screen-only page label (hidden in PDF capture) */}
        <div data-pdf-hide className="mt-8 text-center text-sm text-muted-foreground">
          Invoice #{invoiceData.invoice_number}
        </div>
      </Card>
    </div>
  );
}
