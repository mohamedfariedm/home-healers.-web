"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Home, ArrowLeft } from "lucide-react";
import { useParams } from "next/navigation";

export default function NotFound() {
  const params = useParams();
  const locale = params?.locale as string || "ar";
  const isRTL = locale === "ar";

  const content = {
    en: {
      title: "Page Not Found",
      description: "Oops! The page you're looking for doesn't exist or has been moved.",
      backHome: "Back to Home",
      goBack: "Go Back",
    },
    ar: {
      title: "الصفحة غير موجودة",
      description: "عذراً! الصفحة التي تبحث عنها غير موجودة أو تم نقلها.",
      backHome: "العودة للرئيسية",
      goBack: "الرجوع",
    },
  };

  const t = content[locale as keyof typeof content] || content.ar;

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-20 bg-white">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-50">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#62a0f6] rounded-full blur-[120px] opacity-10" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#62a0f6] rounded-full blur-[120px] opacity-10" />
      </div>

      <div className="relative z-10 text-center max-w-2xl">
        {/* Animated 404 Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative inline-block"
        >
          <span className="text-[120px] md:text-[180px] font-bold text-[#62a0f6] opacity-10 select-none">
            404
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
             <motion.div 
               animate={{ y: [0, -10, 0] }}
               transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
               className="w-32 h-32 md:w-48 md:h-48 bg-no-repeat bg-contain bg-center opacity-90"
               style={{ backgroundImage: 'url(/assets/images/404-img.png)' }}
             />
          </div>
        </motion.div>

        {/* Text Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-8"
        >
          <h1 className="text-3xl md:text-5xl font-bold text-[#1e1e1e] mb-4">
            {t.title}
          </h1>
          <p className="text-lg text-[#4a5568] max-w-md mx-auto leading-relaxed">
            {t.description}
          </p>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href={`/${locale}`}
            className="group flex items-center gap-2 bg-[#62a0f6] text-white px-8 py-4 rounded-full font-semibold transition-all duration-300 hover:bg-[#4f8ae8] hover:shadow-lg hover:shadow-[#62a0f6]/20 active:scale-95 w-full sm:w-auto text-center justify-center"
          >
            <Home size={18} />
            <span>{t.backHome}</span>
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-[#4a5568] px-8 py-4 rounded-full font-semibold bg-gray-50 border border-gray-100 transition-all duration-300 hover:bg-gray-100 active:scale-95 w-full sm:w-auto text-center justify-center"
          >
            <ArrowLeft size={18} className={isRTL ? "rotate-180" : ""} />
            <span>{t.goBack}</span>
          </button>
        </motion.div>
      </div>

      {/* Decorative Icons (similar to HeroBanner) */}
      <div className="hidden lg:block absolute top-1/4 left-20 opacity-20 animate-pulse">
        <div className="w-8 h-8 bg-no-repeat bg-contain" style={{ backgroundImage: 'url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-18/4QUzxCKOhU.png)' }} />
      </div>
      <div className="hidden lg:block absolute bottom-1/4 right-20 opacity-20 animate-bounce">
        <div className="w-10 h-10 bg-no-repeat bg-contain" style={{ backgroundImage: 'url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-18/1XdOKqGhLn.png)' }} />
      </div>
    </div>
  );
}
