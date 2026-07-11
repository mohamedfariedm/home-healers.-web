export const WHATSAPP_DEFAULT_MESSAGE =
  "اضغط ارسال الان لتتمتع بعروضنا - website";

export const formatWhatsAppNumber = (phone: string): string => {
  if (!phone) return "";
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("966")) return digits;
  const cleaned = digits.replace(/^0+/, "");
  return `966${cleaned}`;
};

export const buildWhatsAppUrl = (
  phone: string,
  message: string = WHATSAPP_DEFAULT_MESSAGE
): string => {
  const formattedPhone = formatWhatsAppNumber(phone);
  if (!formattedPhone) return "https://api.whatsapp.com/send";

  const url = new URL("https://api.whatsapp.com/send");
  url.searchParams.set("phone", formattedPhone);
  if (message) {
    url.searchParams.set("text", message);
  }
  return url.toString();
};