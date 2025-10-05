"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, HelpCircle } from 'lucide-react';
import type { FaqTranslations } from "@/translations/faq";

interface FaqItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
  translations: FaqTranslations;
  index: number;
}

const FaqItem: React.FC<FaqItemProps> = ({
  question,
  answer,
  isOpen,
  onToggle,
  translations,
  index,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const shouldTruncate = answer.length > 200;
  const displayAnswer = shouldTruncate && !isExpanded 
    ? answer.substring(0, 200) + "..." 
    : answer;

  return (
    <motion.div
      className="relative bg-gradient-to-r from-[#f8faff] to-[#e8eaf3] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ scale: 1.01 }}
    >
      <button
        className="w-full p-6 text-left focus:outline-none focus:ring-2 focus:ring-[#62a0f6] focus:ring-inset"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={`faq-answer-${index}`}
        aria-label={isOpen ? translations.collapseAnswer : translations.expandAnswer}
      >
        <div className="flex items-start gap-4">
          {/* Question Icon */}
          <div className="flex-shrink-0 mt-1">
            <div className="w-8 h-8 bg-[#62a0f6] rounded-full flex items-center justify-center">
              <HelpCircle className="w-4 h-4 text-white" />
            </div>
          </div>

          {/* Question Content */}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-[#1e1e1e] mb-1 pr-8">
              {question}
            </h3>
            
            {/* Answer */}
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  id={`faq-answer-${index}`}
                  className="mt-4"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  style={{ overflow: "hidden" }}
                >
                  <div className="text-[#4a5568] leading-relaxed">
                    <div 
                      dangerouslySetInnerHTML={{ __html: displayAnswer }}
                      className="editor-content"
                    />
                    
                    {/* Read More/Less Button */}
                    {shouldTruncate && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsExpanded(!isExpanded);
                        }}
                        className="mt-3 text-[#62a0f6] hover:text-[#4f8ae8] font-medium text-sm transition-colors duration-200"
                      >
                        {isExpanded ? translations.readLess : translations.readMore}
                      </button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Toggle Icon */}
          <div className="flex-shrink-0">
            <motion.div
              className="w-8 h-8 bg-[#143087] rounded-full flex items-center justify-center"
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              {isOpen ? (
                <Minus className="w-4 h-4 text-white" />
              ) : (
                <Plus className="w-4 h-4 text-white" />
              )}
            </motion.div>
          </div>
        </div>
      </button>
    </motion.div>
  );
};

export default FaqItem;
