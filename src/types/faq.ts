export interface FaqItem {
  id?: number;
  title_question: {
    ar: string;
    en: string;
  } | string;
  answer: {
    ar: string;
    en: string;
  } | string;
  category?: string;
  priority?: number;
  active?: boolean;
}

export interface FaqSectionData {
  title?: string;
  Posts?: Array<{
    title: string;
    description?: string;
  }>;
}

export interface ContactInfo {
  phone: string;
  whatsappMessage: {
    ar: string;
    en: string;
  };
  image?: string;
}
