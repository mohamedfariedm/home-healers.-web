"use client";
// @ts-ignore
import confetti from "canvas-confetti";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import ClientAPI from "@/app/api/api";
import {
  Twitter,
  Facebook,
  Instagram,
  Linkedin,
  Youtube,
  X,
  Ghost,
} from "lucide-react";

// Custom Icons for TikTok and Snapchat since they might not be in all Lucide versions or for specific styling
const TiktokIcon = ({
  size = 20,
  strokeWidth = 1.5,
  color = "currentColor",
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

interface Post {
  id: number;
  title: string;
  description?: string;
  section_id: number;
  active: number;
  created_at: string;
  updated_at: string;
}

interface Section {
  id: number;
  title: string;
  slug: string | null;
  page_id: number;
  Posts: Post[];
  active: number;
  priority: number;
  created_at: string;
  updated_at: string;
}

interface FooterProps {
  locale: string;
  section?: Section;
  settings?: any;
}

// Translation object
const translations = {
  ar: {
    contactTitle: "اذا كان لديك أي استفسار فلا تردد !",
    contactDescription: "قم بالتواصل معنا وسنرد عليك في أسرع وقت ممكن",
    whatsappButton: "التواصل عبر الواتساب",
    whatsappMessage: "مرحبا، لدي استفسار",
    brandRegistration: "العلامة التجارية Home Healers مسجل بمعروف برقم 217470",
    description:
      "تطبيق وموقع إلكتروني متخصص في تقديم خدمات العلاج الطبيعي والتأهيل الطبي للعملاء في منازلهم",
    quickLinks: "روابط سريعة",
    downloadApp: "حمل التطبيق",
    contactUs: "تواصل معنا",
    copyright: "© 2025 جميع الحقوق محفوظة | Home Healers",
    navigation: {
      home: "الرئيسية",
      about: "عن هوم هيليرز",
      services: "خدماتنا",
      blog: "المدونة",
      contact: "تواصل معنا",
    },
    contact: {
      address: "الرياض - شارع الامير عبدالعزيز بن مساعد بن جلوي",
      email: "customer.service@home-healers.com",
      phone: "0551172232",
    },
    legal: {
      terms: "الشروط والاحكام",
      privacy: "السياسة الخصوصية",
    },
    appDownload: {
      text: "حمل التطبيق",
      googlePlay: "Google Play",
      appStore: "App Store",
    },
  },
  en: {
    contactTitle: "If you have any questions, don't hesitate!",
    contactDescription:
      "Contact us and we will respond to you as soon as possible",
    whatsappButton: "Contact via WhatsApp",
    whatsappMessage: "Hello, I have a question",
    brandRegistration:
      "Home Healers brand is registered with Maroof number 217470",
    description:
      "An application and website specialized in providing physiotherapy and medical rehabilitation services to clients in their homes",
    quickLinks: "Quick Links",
    downloadApp: "Download App",
    contactUs: "Contact Us",
    copyright: "© 2025 All Rights Reserved | Home Healers",
    navigation: {
      home: "Home",
      about: "About Home Healers",
      services: "Our Services",
      blog: "Blog",
      contact: "Contact Us",
    },
    contact: {
      address: "Riyadh - Prince Abdulaziz bin Musaed bin Jalawi Street",
      email: "customer.service@home-healers.com",
      phone: "0551172232",
    },
    legal: {
      terms: "Terms & Conditions",
      privacy: "Privacy Policy",
    },
    appDownload: {
      text: "Download App",
      googlePlay: "Google Play",
      appStore: "App Store",
    },
  },
};

// Animation variants
const animationVariants = {
  button: {
    hover: {
      scale: 1.05,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10,
      },
    },
    tap: { scale: 0.95 },
  },
  link: {
    hover: {
      color: "#62a0f6",
      x: -5,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 15,
      },
    },
  },
};


const fireCelebration = () => {
  const duration = 1500;
  const end = Date.now() + duration;

  const frame = () => {
    confetti({
      particleCount: 5,
      angle: 60,
      spread: 70,
      origin: { x: 0 },
    });
    confetti({
      particleCount: 5,
      angle: 120,
      spread: 70,
      origin: { x: 1 },
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  };

  frame();
};

function Footer({ locale = "ar", section, settings }: FooterProps) {
  const t =
    translations[locale as keyof typeof translations] || translations.ar;
  const isRTL = locale === "ar";

  // Extract dynamic content from settings
  const settingsData = settings?.data?.[0]?.setting;
  const socialMedia = settingsData?.social || {};
  const iosLink = settingsData?.ios_link;
  const androidLink = settingsData?.android_link;
  const businessInfo = settingsData?.business_info || {};

  // Helper function to format phone number for WhatsApp (remove leading 0 and add country code)
  const formatWhatsAppNumber = (phone: string) => {
    if (!phone) return "";
    const cleaned = phone.replace(/^0+/, ""); // Remove leading zeros
    return `966${cleaned}`; // Add Saudi Arabia country code
  };

  // Get business info with fallbacks
  const whatsappNumber = businessInfo.whatsapp || "0118289771";
  const contactPhone = businessInfo.contact || "0118289771";
  const businessEmail = businessInfo.email || t.contact.email;
  const businessAddress = businessInfo.address || t.contact.address;
  const knownNumber = businessInfo.known_number || "217470";
  const brandName = businessInfo.brand || "Home Healers";
  const commercialRegistration = businessInfo.commercial_registration || "";
  const healthLicense = businessInfo.health_license || "";

  // Format brand registration text dynamically - returns array for multi-line display
  const brandRegistrationText = (() => {
    if (locale === "ar") {
      return [
        `العلامة التجارية ${brandName} مسجل بمعروف برقم ${knownNumber}`,
        commercialRegistration && `سجل تجاري رقم: ${commercialRegistration}`,
        healthLicense && `ترخيص وزارة الصحة رقم: ${healthLicense}`,
      ].filter(Boolean) as string[];
    } else {
      return [
        `${brandName} brand is registered with Maroof number ${knownNumber}`,
        commercialRegistration &&
          `Commercial Registration: ${commercialRegistration}`,
        healthLicense && `Health Ministry License: ${healthLicense}`,
      ].filter(Boolean) as string[];
    }
  })();

  // Format copyright text dynamically
  const copyrightText =
    locale === "ar"
      ? `© 2025 جميع الحقوق محفوظة | ${brandName}`
      : `© 2025 All Rights Reserved | ${brandName}`;
  // Helper to get URL from social object or string
  const getSocialUrl = (social: any) => {
    if (typeof social === "string") return social;
    if (typeof social === "object" && social?.url) return social.url;
    return "";
  };

  // Helper to check if social should be shown
  const shouldShowSocial = (social: any) => {
    if (typeof social === "string") return true;
    if (typeof social === "object" && social?.show === false) return false;
    return true;
  };

  // Create dynamic social links from settings
  const dynamicSocialLinks = [
    {
      name: "X",
      key: "x",
      url: getSocialUrl(socialMedia.x),
      show: shouldShowSocial(socialMedia.x),
      icon: X, // Using X icon for X platform
      ariaLabel: { ar: "تابعنا على إكس", en: "Follow us on X" },
    },
    {
      name: "Facebook",
      key: "facebook",
      url: getSocialUrl(socialMedia.facebook),
      show: shouldShowSocial(socialMedia.facebook),
      icon: Facebook,
      ariaLabel: { ar: "تابعنا على فيسبوك", en: "Follow us on Facebook" },
    },
    {
      name: "Instagram",
      key: "instgram",
      url: getSocialUrl(socialMedia.instgram),
      show: shouldShowSocial(socialMedia.instgram),
      icon: Instagram,
      ariaLabel: { ar: "تابعنا على انستغرام", en: "Follow us on Instagram" },
    },
    {
      name: "LinkedIn",
      key: "linked_in",
      url: getSocialUrl(socialMedia.linked_in),
      show: shouldShowSocial(socialMedia.linked_in),
      icon: Linkedin,
      ariaLabel: { ar: "تابعنا على لينكد إن", en: "Follow us on LinkedIn" },
    },
    {
      name: "YouTube",
      key: "youtube",
      url: getSocialUrl(socialMedia.youtube),
      show: shouldShowSocial(socialMedia.youtube),
      icon: Youtube,
      ariaLabel: { ar: "تابعنا على يوتيوب", en: "Follow us on YouTube" },
    },
    {
      name: "TikTok",
      key: "tiktok",
      url: getSocialUrl(socialMedia.tiktok),
      show: shouldShowSocial(socialMedia.tiktok),
      icon: TiktokIcon,
      ariaLabel: { ar: "تابعنا على تيك توك", en: "Follow us on TikTok" },
    },
    {
      name: "Snapchat",
      key: "snapchat",
      url: getSocialUrl(socialMedia.snapchat),
      show: shouldShowSocial(socialMedia.snapchat),
      icon: Ghost,
      ariaLabel: { ar: "تابعنا على سناب شات", en: "Follow us on Snapchat" },
    },
  ].filter((item) => item.url && item.show);

  // Extract dynamic content from section data
  const contactTitle = section?.title || t.contactTitle;
  const contactDescription = section?.Posts?.[0]?.title || t.contactDescription;

  // Modal state management
  const [showModal, setShowModal] = useState(false);
  const celebrationRef = React.useRef<HTMLDivElement | null>(null);

  // Show modal on mount (only once per session)
  useEffect(() => {
    const hasSeenModal = sessionStorage.getItem('hasSeenCertificationModal');
    if (!hasSeenModal) {
      setShowModal(true);
      sessionStorage.setItem('hasSeenCertificationModal', 'true');
      
      // Auto close after 10 seconds
      const timer = setTimeout(() => {
        setShowModal(false);
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, []);

  // Close modal when clicking outside
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      setShowModal(false);
    }
  };

  // Confetti animation when modal is shown
  useEffect(() => {
    if (showModal) {
      fireCelebration();
    }
  }, [showModal]);

  // Original intersection observer for footer section
  React.useEffect(() => {
    if (!celebrationRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            fireCelebration(); // Trigger animation
          }
        });
      },
      { threshold: 1 }
    );

    observer.observe(celebrationRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* Certification Modal Popup */}
      {showModal&&
      <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex  items-center justify-center p-4"
            onClick={handleBackdropClick}
          >
            {/* Backdrop with transparent background */}
            <div className="absolute inset-0 flex  items-center justify-center bg-black/10 backdrop-blur-sm" />
            
            {/* Modal Content */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="relative z-10 w-full max-w-[70%] sm:max-w-[70%] bg-white rounded-2xl shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 z-20 w-10 h-10 flex items-center justify-center bg-white/90 hover:bg-white rounded-full shadow-lg transition-colors"
                aria-label={locale === "ar" ? "إغلاق" : "Close"}
              >
                <X className="w-5 h-5 text-[#143087]" />
              </button>

              {/* Modal Content */}
              <div className="p-6 flex flex-col md:flex-row  items-center justify-center sm:p-8">
                {/* Celebration Message */}
                <div className="text-center mb-6">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#143087] mb-3">
                    {locale === "ar" ? (
                      <>
                        نحن الفائزون بجائزة{" "}
                        <span className="text-[#8bc34a]">MEA Business Awards 2025</span>
                      </>
                    ) : (
                      <>
                        We Are The Winners Of{" "}
                        <span className="text-[#8bc34a]">MEA Business Awards 2025</span>
                      </>
                    )}
                  </h2>
                  
                  <p className="text-base sm:text-lg text-[#1e1e1e] font-medium">
                    {locale === "ar"
                      ? "نفخر بحصولنا على جائزة أفضل مقدم رعاية صحية منزلية 2025 وجائزة التميز في العلاج الطبيعي 2025"
                      : "We are proud to have won the Best Home Healthcare Provider 2025 and Excellence Award in Physical Therapy 2025"}
                  </p>
                </div>

                {/* Certificate Image */}
                <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden ">
                  <Image
                    src="/assets/images/certification.png"
                    alt={
                      locale === "ar"
                        ? "شهادة MEA Business Awards 2025"
                        : "MEA Business Awards 2025 Certificate"
                    }
                    fill
                    className="object-contain p-4"
                    priority
                    quality={95}
                  />
                </div>

              </div>
            </motion.div>
          </motion.div>
      
      </AnimatePresence>
      }

      <footer className="w-full mt-20">
        {/* Certification/Award Celebration Section */}
      <section ref={celebrationRef} className="w-full mb-20 ">
        <div className="max-w-7xl mx-auto ">
          <motion.div
            className="flex md:flex-row flex-col  items-center gap-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Celebration Message */}
            <div className="text-center space-y-4">
              <motion.div
                initial={{ scale: 0.8 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, type: "spring" }}
                className="inline-block"
              >
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#143087] mb-4">
                  {locale === "ar" ? (
                    <>
                      نحن الفائزون بجائزة{" "}
                      <span className="text-[#8bc34a]">MEA Business Awards 2025</span>
                    </>
                  ) : (
                    <>
                      We Are The Winners Of{" "}
                      <span className="text-[#8bc34a]">MEA Business Awards 2025</span>
                    </>
                  )}
                </h2>
              </motion.div>
              
              <motion.p
                className="text-lg sm:text-xl text-[#1e1e1e] font-medium max-w-3xl mx-auto"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                {locale === "ar"
                  ? "نفخر بحصولنا على جائزة أفضل مقدم رعاية صحية منزلية 2025 وجائزة التميز في العلاج الطبيعي 2025"
                  : "We are proud to have won the Best Home Healthcare Provider 2025 and Excellence Award in Physical Therapy 2025"}
              </motion.p>
            </div>

            {/* Certificate Image */}
            <motion.div
              className="relative w-full max-w-[500px] sm:max-w-[600px] md:max-w-[700px]"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.6, type: "spring" }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl   bg-white">
                <Image
                  src="/assets/images/certification.png"
                  alt={
                    locale === "ar"
                      ? "شهادة MEA Business Awards 2025"
                      : "MEA Business Awards 2025 Certificate"
                  }
                  fill
                  className="object-contain p-4"
                  priority
                  quality={95}
                />
                
                {/* Decorative Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-[#8bc34a]/10 pointer-events-none"></div>
              </div>

              {/* Decorative Corner Elements */}
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-[#8bc34a] rounded-full opacity-20 blur-xl"></div>
              <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-[#62a0f6] rounded-full opacity-20 blur-xl"></div>
            </motion.div>

          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="w-full py-6 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-20 xl:py-[75px] bg-[#ebfdf2]">
        <div className="flex flex-col lg:flex-row w-full gap-4 sm:gap-6 lg:gap-12 justify-between items-center max-w-7xl mx-auto">
          {/* Text and Icon Section */}
          <div className="flex w-full max-w-[736px] flex-col gap-3 items-end">
            <div className="flex w-full gap-4 sm:gap-6 justify-center items-center">
              {/* Icon */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-06-25/jrXCqZ0F4w.png)] bg-cover bg-no-repeat flex-shrink-0" />

              {/* Text Content */}
              <div className="flex flex-col w-full gap-3">
                <h2 className="text-lg sm:text-xl font-semibold leading-7 sm:leading-8 text-[#1e1e1e] text-start">
                  {contactTitle?.includes("استفسار") ? (
                    <>
                      اذا كان لديك أي{" "}
                      <span className="text-[#1e1e1e]">استفسار</span> فلا تردد!
                    </>
                  ) : (
                    contactTitle
                  )}
                </h2>
                <p className="text-sm sm:text-base font-normal leading-6 text-[#1e1e1e] text-start">
                  {contactDescription}
                </p>
              </div>
            </div>
          </div>

          {/* WhatsApp Button */}
          <motion.a
            href={`https://wa.me/${formatWhatsAppNumber(
              whatsappNumber
            )}?text=${encodeURIComponent(t.whatsappMessage)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full sm:w-auto min-w-[200px] h-14 px-4 py-2 gap-2 justify-center items-center bg-[#12b669] rounded-xl text-white hover:bg-[#0ea55c] transition-colors"
            variants={animationVariants.button}
            whileHover="hover"
            whileTap="tap"
            aria-label={
              locale === "ar"
                ? "تواصل معنا عبر الواتساب"
                : "Contact us via WhatsApp"
            }
          >
            <div className="w-6 h-6 relative overflow-hidden">
              <div className="w-5 h-5 bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-06-25/nc3zMu9Qh4.png)] bg-cover bg-no-repeat mt-0.5 ml-0.5" />
            </div>
            <span className="text-base sm:text-lg font-medium leading-7 whitespace-nowrap">
              {t.whatsappButton}
            </span>
          </motion.a>
        </div>
      </section>

      {/* Main Footer Content */}
      <section className="w-full bg-[#eff6fe] px-4 md:px-8 lg:px-[60px] py-10">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-center items-start gap-10 lg:gap-20">
          {/* Logo and Description */}
          <div className="w-full max-w-[438px] flex flex-col items-center">
            <div className="flex flex-col gap-8 items-center ">
              {/* Logo */}
              <div className="flex flex-col gap-6 items-center">
                <div className="flex gap-[14px] items-center">
                  <div className="w-[63px] h-[60px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-12/SKp7H4bUnm.png)] bg-cover bg-no-repeat" />
                  <div className="w-[57px] h-[72px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-12/PWe640v7e4.png)] bg-cover bg-no-repeat" />
                </div>
                <div className="flex flex-col gap-1 items-center text-xs font-light leading-4 text-[#1e1e1e] text-center max-w-[321px]">
                  {brandRegistrationText.map((text, index) => (
                    <p key={index} className="text-center">
                      {text}
                    </p>
                  ))}
                </div>
              </div>

              {/* Description and Social Links */}
              <div className="flex flex-col gap-8 items-center">
                <p className="text-xs font-medium leading-6 text-[#1e1e1e] text-center max-w-[380px]">
                  {t.description}
                </p>

                {/* Social Media Icons */}
                <div className="flex gap-4 items-center flex-wrap justify-center">
                  {dynamicSocialLinks.map((social) => (
                    <motion.a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex w-10 h-10 items-center justify-center bg-[#62a0f6] rounded-xl hover:bg-[#4f8ae8] transition-colors text-white"
                      variants={animationVariants.button}
                      whileHover="hover"
                      whileTap="tap"
                      aria-label={
                        social.ariaLabel[
                          locale as keyof typeof social.ariaLabel
                        ]
                      }
                    >
                      <social.icon size={20} strokeWidth={1.5} />
                    </motion.a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Links and Contact Section */}
          <div className="flex items-start w-full justify-between flex-wrap gap-10 lg:gap-20 max-w-[832px]">
            {/* Quick Links */}
            <nav className="flex flex-col gap-8 items-start">
              <div className="flex flex-col gap-2 items-start">
                <h3 className="text-xl font-semibold leading-[30px] text-[#143087]">
                  {t.quickLinks}
                </h3>
                <div className="w-10 h-1.5 bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-12/1tXT90JNoT.png)] bg-cover bg-no-repeat" />
              </div>

              <ul className="flex flex-col gap-4 items-start">
                {[
                  {
                    href: `${locale === "ar" ? "" : "/en"}`,
                    text: t.navigation.home,
                  },
                  {
                    href: `${locale === "ar" ? "" : "/en"}/about`,
                    text: t.navigation.about,
                  },
                  {
                    href: `${locale === "ar" ? "" : "/en"}/our-services`,
                    text: t.navigation.services,
                  },
                  {
                    href: `${locale === "ar" ? "" : "/en"}/blog`,
                    text: t.navigation.blog,
                  },
                  {
                    href: `${locale === "ar" ? "" : "/en"}/contact`,
                    text: t.navigation.contact,
                  },
                ].map((link) => (
                  <li key={link.href}>
                    <Link href={link.href}>
                      <motion.span
                        className="text-base font-normal leading-6 text-[#1e1e1e] hover:text-[#62a0f6] transition-colors cursor-pointer"
                        variants={animationVariants.link}
                        whileHover="hover"
                      >
                        {link.text}
                      </motion.span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* App Download */}
            <div className="flex flex-col gap-6 items-start">
              <div className="flex flex-col gap-2 items-start">
                <h3 className="text-xl font-semibold leading-[30px] text-[#143087]">
                  {t.downloadApp}
                </h3>
                <div className="w-10 h-1.5 bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-12/Q6CctxZby4.png)] bg-cover bg-no-repeat" />
              </div>

              <div className="flex flex-col gap-3 items-start">
                {/* Google Play Button */}
                <motion.a
                  href={
                    androidLink ||
                    "https://play.google.com/store/apps/details?id=com.homehealers.app"
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full sm:w-[172px] px-5 py-4 gap-4 justify-center items-center bg-[#143087] rounded-xl hover:bg-[#0f2666] transition-colors"
                  variants={animationVariants.button}
                  whileHover="hover"
                  whileTap="tap"
                  aria-label={`${t.appDownload.text} ${t.appDownload.googlePlay}`}
                >
                  <div className="w-8 h-8 bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-12/f3GhWRCGPf.png)] bg-cover bg-no-repeat" />
                  <div className="flex flex-col gap-1 items-start">
                    <span className="text-xs font-normal leading-4 text-white">
                      {t.appDownload.text}
                    </span>
                    <span className="text-sm font-semibold leading-5 text-white">
                      {t.appDownload.googlePlay}
                    </span>
                  </div>
                </motion.a>

                {/* App Store Button */}
                <motion.a
                  href={
                    iosLink ||
                    "https://apps.apple.com/sa/app/home-healers/id123456789"
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full sm:w-[172px] px-5 py-4 gap-4 justify-center items-center bg-[#143087] rounded-xl hover:bg-[#0f2666] transition-colors"
                  variants={animationVariants.button}
                  whileHover="hover"
                  whileTap="tap"
                  aria-label={`${t.appDownload.text} ${t.appDownload.appStore}`}
                >
                  <div className="w-8 h-8 bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-12/GrVtXLn6Og.png)] bg-cover bg-no-repeat" />
                  <div className="flex flex-col gap-1 items-start">
                    <span className="text-xs font-normal leading-4 text-white">
                      {t.appDownload.text}
                    </span>
                    <span className="text-sm font-semibold leading-5 text-white">
                      {t.appDownload.appStore}
                    </span>
                  </div>
                </motion.a>
              </div>
            </div>

            {/* Contact Info */}
            <div className="flex flex-col gap-8 items-start">
              <div className="flex flex-col gap-2 items-start">
                <h3 className="text-xl font-semibold leading-[30px] text-[#143087]">
                  {t.contactUs}
                </h3>
                <div className="w-10 h-1.5 bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-12/JsXDV3xffp.png)] bg-cover bg-no-repeat" />
              </div>

              <address className="flex flex-col gap-6 items-start not-italic">
                {/* Address */}
                <motion.a
                  href={`https://www.google.com/maps/search/${encodeURIComponent(
                    businessAddress
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex gap-3 justify-start items-start hover:text-[#62a0f6] transition-colors"
                  variants={animationVariants.link}
                  whileHover="hover"
                  aria-label={
                    locale === "ar"
                      ? "موقعنا على الخريطة"
                      : "Our location on map"
                  }
                >
                  <div className="w-6 h-6 flex-shrink-0 mt-0.5">
                    <div className="w-4 h-5 bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-12/KZx9WMQ2oO.png)] bg-cover bg-no-repeat ml-1" />
                  </div>
                  <span className="text-sm font-normal leading-5 text-[#1e1e1e] max-w-[180px]">
                    {businessAddress}
                  </span>
                </motion.a>

                {/* Email */}
                <motion.a
                  href={`mailto:${businessEmail}`}
                  className="flex gap-3 justify-start items-center hover:text-[#62a0f6] transition-colors"
                  variants={animationVariants.link}
                  whileHover="hover"
                  aria-label={
                    locale === "ar"
                      ? "راسلنا عبر البريد الإلكتروني"
                      : "Send us an email"
                  }
                >
                  <div className="w-6 h-6 flex-shrink-0">
                    <div className="w-5 h-4 bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-12/YMvEXnJGd2.png)] bg-cover bg-no-repeat mt-1 ml-0.5" />
                  </div>
                  <span className="text-sm font-normal leading-5 text-[#1e1e1e]">
                    {businessEmail}
                  </span>
                </motion.a>

                {/* Phone */}
                <motion.a
                  href={`tel:+${formatWhatsAppNumber(contactPhone)}`}
                  className="flex gap-3 justify-start items-center hover:text-[#62a0f6] transition-colors"
                  variants={animationVariants.link}
                  whileHover="hover"
                  aria-label={locale === "ar" ? "اتصل بنا" : "Call us"}
                >
                  <div className="w-6 h-6 flex-shrink-0">
                    <div className="w-5 h-5 bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-12/c4wQnrL1nf.png)] bg-cover bg-no-repeat mt-0.5 ml-0.5" />
                  </div>
                  <span className="text-sm font-normal leading-5 text-[#1e1e1e]">
                    {contactPhone}
                  </span>
                </motion.a>
              </address>
            </div>
          </div>
        </div>
      </section>



      {/* Bottom Section */}
      <section className="w-full bg-[#eff6fe]">
        {/* Social Media Links */}
        {/* <div className="w-full py-4 ">
          <div className="flex flex-wrap justify-center items-center gap-6 max-w-[1200px] mx-auto px-4">
            {dynamicSocialLinks.map((social) => (
              <motion.a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 bg-[#62a0f6] rounded-xl hover:bg-[#4f8ae8] transition-colors text-white"
                variants={animationVariants.button}
                whileHover="hover"
                whileTap="tap"
                aria-label={`تابعنا على ${social.name}`}
              >
                <social.icon size={20} strokeWidth={1.5} />
              </motion.a>
            ))}
          </div>
        </div> */}

        {/* Copyright and Legal Links */}
        <div className="w-full border-t border-b border-[#1a191a] py-4">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-4 max-w-7xl mx-auto px-4">
            <nav className="flex flex-col sm:flex-row gap-4 items-center">
              <Link href={`${locale === "ar" ? "" : "/en"}/terms`}>
                <motion.span
                  className="text-base font-medium leading-6 text-[#1e1e1e] cursor-pointer hover:text-[#62a0f6] transition-colors"
                  variants={animationVariants.link}
                  whileHover="hover"
                >
                  {t.legal.terms}
                </motion.span>
              </Link>
              <Link href={`${locale === "ar" ? "" : "/en"}/privacy`}>
                <motion.span
                  className="text-base font-medium leading-6 text-[#1e1e1e] cursor-pointer hover:text-[#62a0f6] transition-colors"
                  variants={animationVariants.link}
                  whileHover="hover"
                >
                  {t.legal.privacy}
                </motion.span>
              </Link>
            </nav>
            <p className="text-base font-medium leading-6 text-[#1e1e1e] text-center">
              {copyrightText}
            </p>
          </div>
        </div>
      </section>
      </footer>
    </>
  );
}

export default Footer;
