"use client";

import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { AlertCircle, Search, Filter } from 'lucide-react';
import type { FaqItem as FaqItemType, FaqSectionData, ContactInfo } from "@/types/faq";
import { faqTranslations, type FaqTranslations } from "@/translations/faq";
import { formatFaqData, parseSubtitle } from "@/utils/faq-helpers";
import FaqItem from "./faq-item";
import ContactCard from "./contact-card";

interface FaqSectionProps {
  data?: FaqSectionData;
  locale: string;
  faqsData: FaqItemType[];
  contactInfo?: ContactInfo;
  showSearch?: boolean;
  maxItems?: number;
}

const FaqSection: React.FC<FaqSectionProps> = ({
  data,
  locale = "ar",
  faqsData = [],
  contactInfo,
  showSearch = false,
  maxItems,
}) => {
  const [openIndex, setOpenIndex] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const translations: FaqTranslations = faqTranslations[locale as keyof typeof faqTranslations] || faqTranslations.ar;
  const isRTL = locale === "ar";

  // Format FAQ data
  const formattedFaqs = useMemo(() => {
    const formatted = formatFaqData(faqsData, locale);
    
    // Filter by search term
    let filtered = formatted;
    if (searchTerm.trim()) {
      filtered = formatted.filter(
        (faq) =>
          faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
          faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Limit items if specified
    if (maxItems && maxItems > 0) {
      filtered = filtered.slice(0, maxItems);
    }

    return filtered;
  }, [faqsData, locale, searchTerm, maxItems]);

  // Parse subtitle for highlighting
  const subtitle = data?.Posts?.[0]?.title || translations.defaultSubtitle;
  const subtitleParts = parseSubtitle(subtitle);

  const handleToggle = (index: number) => {
    setOpenIndex(index === openIndex ? -1 : index);
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setOpenIndex(-1); // Close all items when searching
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="w-full max-w-screen-xl mx-auto mt-24 px-4 py-16 text-center">
        <div className="text-[#62a0f6] text-lg">{translations.loading}</div>
      </div>
    );
  }

  // Error state
  if (!Array.isArray(faqsData)) {
    return (
      <div className="w-full max-w-screen-xl mx-auto mt-24 px-4 py-16 text-center">
        <div className="flex items-center justify-center gap-2 text-red-500">
          <AlertCircle className="w-5 h-5" />
          <span>{translations.error}</span>
        </div>
      </div>
    );
  }

  return (
    <section className="w-full max-w-screen-xl mx-auto mt-24 px-4 py-8">
      <div className="flex flex-col gap-16 items-center">
        {/* Header Section */}
        <motion.div
          className="text-center max-w-4xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Section Badge */}
          <motion.div
            className="inline-block bg-[#62a0f6] bg-opacity-10 text-[#62a0f6] px-4 py-2 rounded-full text-sm font-semibold mb-4"
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {data?.title || translations.sectionTitle}
          </motion.div>

          {/* Main Title */}
          <h2 className="text-3xl font-bold leading-tight text-[#1e1e1e] mb-6">
            {subtitleParts.before && <span>{subtitleParts.before} </span>}
            {subtitleParts.highlight && (
              <span className="text-[#62a0f6] relative">
                {subtitleParts.highlight}
                <motion.div
                  className="absolute -bottom-2 left-0 right-0 h-1 bg-[#62a0f6] opacity-30"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                />
              </span>
            )}
            {subtitleParts.after && <span> {subtitleParts.after}</span>}
          </h2>

          {/* Description */}
          {data?.Posts?.[0]?.description && (
            <p className="text-lg text-[#4a5568] leading-relaxed">
              {data.Posts[0].description}
            </p>
          )}
        </motion.div>

        {/* Search Bar */}
        {showSearch && (
          <motion.div
            className="w-full max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#62a0f6] w-5 h-5" />
              <input
                type="text"
                placeholder={`${translations.sectionTitle}...`}
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border-2 border-[#e8eaf3] rounded-2xl focus:border-[#62a0f6] focus:outline-none transition-colors duration-300 text-lg"
                dir={isRTL ? "rtl" : "ltr"}
              />
            </div>
          </motion.div>
        )}

        {/* Main Content */}
        <div className="flex flex-col xl:flex-row gap-12 w-full items-start">
                    {/* Contact Card */}
          <div className="w-full xl:w-1/3">
            <div className="sticky top-8">
              <ContactCard
                translations={translations}
                locale={locale}
                contactInfo={contactInfo}
              />
            </div>
          </div>
          
          {/* FAQ Items */}
          <div className="w-full xl:w-2/3">
            {formattedFaqs.length === 0 ? (
              <motion.div
                className="text-center py-16"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="text-[#4a5568] text-lg mb-4">
                  {searchTerm ? `No results found for "${searchTerm}"` : translations.noQuestions}
                </div>
                {searchTerm && (
                  <button
                    onClick={() => handleSearch("")}
                    className="text-[#62a0f6] hover:text-[#4f8ae8] font-medium transition-colors duration-200"
                  >
                    Clear search
                  </button>
                )}
              </motion.div>
            ) : (
              <div className="flex flex-col gap-4">
                {formattedFaqs.map((item, index) => (
                  <FaqItem
                    key={item.id || index}
                    question={item.question}
                    answer={item.answer}
                    isOpen={index === openIndex}
                    onToggle={() => handleToggle(index)}
                    translations={translations}
                    index={index}
                  />
                ))}
              </div>
            )}
          </div>


        </div>
      </div>
    </section>
  );
};

export default FaqSection;
