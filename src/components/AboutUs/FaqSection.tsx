"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, X } from "lucide-react";

interface FaqItemProps {
  question: string;
  answer?: string;
  isOpen: boolean;
  onToggle: () => void;
}

const FaqItem: React.FC<FaqItemProps> = ({
  question,
  answer,
  isOpen,
  onToggle,
}) => {
  return (
    <motion.div
      className="relative bg-[#e8eaf3] bg-opacity-50 rounded-[24px] p-6 cursor-pointer"
      onClick={onToggle}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.5 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-start gap-4">
        <div className="flex-1">
          <h4 className="text-lg font-medium text-[#1e1e1e] mb-2">{question}</h4>
          <AnimatePresence>
            {isOpen && answer && (
              <motion.p
                className="text-sm text-[#1e1e1e] leading-7 mt-2"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                style={{ overflow: "hidden" }}
              >
                {answer}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
        <div className="relative w-8 h-8 shrink-0">
          
          <motion.div
  className="absolute top-2 left-2 w-[26px] h-[26px] rounded-full bg-[#143087] flex items-center justify-center cursor-pointer"
  animate={{ rotate: isOpen ? 45 : 0 }}
  transition={{ duration: 0.3 }}
>
  <X className="text-white w-4 h-4" />
</motion.div>
        </div>
        
      </div>
    </motion.div>
  );
};

const ContactCard: React.FC = () => {
  return (
<motion.div
      className="relative w-full lg:w-1/2 max-w-md mx-auto bg-[#e8eaf3] bg-opacity-50 rounded-[24px] p-6 pt-24 z-0"
      animate={{
        scale: [1, 1.05, 1, 1.05, 1], // pulse scale sequence
      }}
      transition={{
        duration: 4,          // duration of one beat cycle
        repeat: Infinity,     // infinite loop
        ease: "easeInOut",    // smooth easing
      }}
    >
      <div className="flex flex-col items-center gap-6 z-10 relative">
        <div className="w-40 h-40">
          <div className="w-[114.738px] h-[127.025px] mx-auto bg-[url('https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-18/S1rR4aJeNK.png')] bg-cover bg-no-repeat" />
        </div>
        <div className="text-center">
          <h3 className="text-xl font-semibold text-[#1e1e1e]">لديك استفسار ؟</h3>
          <p className="text-lg leading-8 text-[#1e1e1e] mt-4">
            لاتتردد في التواصل مع خدمة عملاء هومهيليرز
            <br />
            وسنرد عليك في أسرع وقت
          </p>
        </div>
        <button className="bg-[#143087] text-white flex items-center justify-center gap-2 rounded-lg px-6 py-3 mt-4 hover:bg-opacity-90 transition-all duration-300">
          <span className="text-lg font-medium">تواصل معنا الان</span>
          <ArrowLeft className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
};

const FaqSection: React.FC = () => {
  const faqItems = [
    {
      question: "كيف يمكنني الحجز بسهولة في هوم هيليرز ؟",
      answer:
        "يمكنك الحجز بسهولة من خلال الضغط على زر احجز جلستك الان، ثم إكمال جميع خطوات التسجيل واختيار التخصص والطبيب المناسب.",
    },
    { question: "ما هي تكلفة الجلسة العلاجية؟" },
    { question: "هل يمكنني اختيار طبيب معين؟" },
    { question: "ما هي مدة الجلسة العلاجية؟" },
    { question: "هل تقدمون خدمات للأطفال؟" },
  ];

  const [openIndex, setOpenIndex] = useState(0);

  const handleToggle = (index: number) => {
    setOpenIndex(index === openIndex ? -1 : index);
  };

  return (
    <div className="w-full max-w-screen-xl mx-auto mt-24 px-4 flex flex-col gap-14 items-center">
      {/* Heading */}
      <div className="text-center">
        <h2 className="text-[28px] sm:text-[30px] font-semibold leading-10 text-[#1e1e1e]">
          <span>استكشف أبرز </span>
          <span className="text-[#62a0f6]">الأسئلة</span>
          <span> الشائعة</span>
        </h2>
      </div>

      {/* Content */}
      <div className="flex flex-col lg:flex-row gap-12 w-full items-start">
               {/* FAQs */}
        <div className="w-full lg:w-1/2 flex flex-col gap-6">
          {faqItems.map((item, index) => (
            <FaqItem
              key={index}
              question={item.question}
              answer={item.answer}
              isOpen={index === openIndex}
              onToggle={() => handleToggle(index)}
            />
          ))}
        </div>
       
        {/* Contact Card */}
        <ContactCard />


      </div>
    </div>
  );
};

export default FaqSection;
