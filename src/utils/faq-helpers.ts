import type { FaqItem } from "@/types/faq";
import { normalizeCmsHtml } from "@/lib/parse-cms-html";

export const getFaqText = (
  text: { ar: string; en: string } | string,
  locale: string
): string => {
  if (typeof text === "string") {
    return text;
  }
  
  return locale === "ar" ? text.ar : text.en;
};

export const formatFaqData = (faqsData: any[], locale: string): Array<{
  question: string;
  answer: string;
  id?: number;
}> => {
  if (!Array.isArray(faqsData)) {
    return [];
  }

  return faqsData
    .filter(item => item && (item.title_question || item.question))
    .map((item, index) => ({
      id: item.id || index,
      question: getFaqText(
        item.title_question || item.question || "No question",
        locale
      ),
      answer: normalizeCmsHtml(
        getFaqText(item.answer || "No answer provided", locale)
      ),
    }));
};

export const parseSubtitle = (subtitle: string) => {
  const words = subtitle.split(" ");
  return {
    before: words.slice(0, 2).join(" "),
    highlight: words[2] || "",
    after: words.slice(3).join(" "),
  };
};

export const truncateText = (text: string, maxLength: number = 200): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};
