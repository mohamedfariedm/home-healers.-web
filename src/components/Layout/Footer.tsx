"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";

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
}

// Translation object
const translations = {
  ar: {
    contactTitle: "اذا كان لديك أي استفسار فلا تردد !",
    contactDescription: "قم بالتواصل معنا وسنرد عليك في أسرع وقت ممكن",
    whatsappButton: "التواصل عبر الواتساب",
    whatsappMessage: "مرحبا، لدي استفسار",
    brandRegistration: "العلامة التجارية Home Healers مسجل بمعروف برقم 217470",
    description: "تطبيق وموقع إلكتروني متخصص في تقديم خدمات العلاج الطبيعي والتأهيل الطبي للعملاء في منازلهم",
    quickLinks: "روابط سريعة",
    downloadApp: "حمل التطبيق",
    contactUs: "تواصل معنا",
    copyright: "© 2025 جميع الحقوق محفوظة | Home Healers",
    navigation: {
      home: "الرئيسية",
      about: "عن هوم هيليرز",
      services: "خدماتنا",
      blog: "المدونة",
      contact: "تواصل معنا"
    },
    contact: {
      address: "الرياض - شارع الامير عبدالعزيز بن مساعد بن جلوي",
      email: "customer.service@home-healers.com",
      phone: "0551172232"
    },
    legal: {
      terms: "الشروط والاحكام",
      privacy: "السياسة الخصوصية"
    },
    appDownload: {
      text: "حمل التطبيق",
      googlePlay: "Google Play",
      appStore: "App Store"
    }
  },
  en: {
    contactTitle: "If you have any questions, don't hesitate!",
    contactDescription: "Contact us and we will respond to you as soon as possible",
    whatsappButton: "Contact via WhatsApp",
    whatsappMessage: "Hello, I have a question",
    brandRegistration: "Home Healers brand is registered with Maroof number 217470",
    description: "An application and website specialized in providing physiotherapy and medical rehabilitation services to clients in their homes",
    quickLinks: "Quick Links",
    downloadApp: "Download App",
    contactUs: "Contact Us",
    copyright: "© 2025 All Rights Reserved | Home Healers",
    navigation: {
      home: "Home",
      about: "About Home Healers",
      services: "Our Services",
      blog: "Blog",
      contact: "Contact Us"
    },
    contact: {
      address: "Riyadh - Prince Abdulaziz bin Musaed bin Jalawi Street",
      email: "customer.service@home-healers.com",
      phone: "0551172232"
    },
    legal: {
      terms: "Terms & Conditions",
      privacy: "Privacy Policy"
    },
    appDownload: {
      text: "Download App",
      googlePlay: "Google Play",
      appStore: "App Store"
    }
  }
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

// Social media links
const socialLinks = [
  {
    name: "Twitter",
    url: "https://twitter.com/homehealers_sa",
    icon: "https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-12/xbofKUrvfM.png",
    ariaLabel: { ar: "تابعنا على تويتر", en: "Follow us on Twitter" }
  },
  {
    name: "Facebook", 
    url: "https://facebook.com/homehealers.sa",
    icon: "https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-12/ejCSBuhAsH.png",
    ariaLabel: { ar: "تابعنا على فيسبوك", en: "Follow us on Facebook" }
  },
  {
    name: "Instagram",
    url: "https://instagram.com/homehealers.sa", 
    icon: "https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-12/Mok2MoGDLG.png",
    ariaLabel: { ar: "تابعنا على انستغرام", en: "Follow us on Instagram" }
  }
];

function Footer({ locale = "ar", section }: FooterProps) {
  const t = translations[locale as keyof typeof translations] || translations.ar;
  const isRTL = locale === "ar";

  // Extract dynamic content from section data
  const contactTitle = section?.title || t.contactTitle;
  const contactDescription = section?.Posts?.[0]?.title || t.contactDescription;

  return (
    <footer className="w-full mt-20">
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
                  {contactTitle.includes("استفسار") ? (
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
            href={`https://wa.me/966551172232?text=${encodeURIComponent(t.whatsappMessage)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full sm:w-auto min-w-[200px] h-14 px-4 py-2 gap-2 justify-center items-center bg-[#12b669] rounded-xl text-white hover:bg-[#0ea55c] transition-colors"
            variants={animationVariants.button}
            whileHover="hover"
            whileTap="tap"
            aria-label={locale === "ar" ? "تواصل معنا عبر الواتساب" : "Contact us via WhatsApp"}
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
                <p className="text-xs font-light leading-4 text-[#1e1e1e] text-center max-w-[321px]">
                  {t.brandRegistration}
                </p>
              </div>

              {/* Description and Social Links */}
              <div className="flex flex-col gap-8 items-center">
                <p className="text-xs font-medium leading-6 text-[#1e1e1e] text-center max-w-[380px]">
                  {t.description}
                </p>
                
                {/* Social Media Icons */}
                <div className="flex gap-7 items-center">
                  {socialLinks.map((social) => (
                    <motion.a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex w-10 h-10 p-2 items-center justify-center bg-[#62a0f6] rounded-xl hover:bg-[#4f8ae8] transition-colors"
                      variants={animationVariants.button}
                      whileHover="hover"
                      whileTap="tap"
                      aria-label={social.ariaLabel[locale as keyof typeof social.ariaLabel]}
                    >
                      <div className="w-6 h-6 flex justify-center items-center">
                        <div 
                          className="bg-cover bg-no-repeat"
                          style={{
                            backgroundImage: `url(${social.icon})`,
                            width: social.name === "Instagram" ? "14px" : "20px",
                            height: "20px"
                          }}
                        />
                      </div>
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
                  { href: `/${locale}`, text: t.navigation.home },
                  { href: `/${locale}/about`, text: t.navigation.about },
                  { href: `/${locale}/our-services/all`, text: t.navigation.services },
                  { href: `/${locale}/blogs`, text: t.navigation.blog },
                  { href: `/${locale}/contact`, text: t.navigation.contact }
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
                  href="https://play.google.com/store/apps/details?id=com.homehealers.app"
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
                  href="https://apps.apple.com/sa/app/home-healers/id123456789"
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
                  href="https://www.google.com/maps/search/الرياض+شارع+الامير+عبدالعزيز+بن+مساعد+بن+جلوي"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex gap-3 justify-start items-start hover:text-[#62a0f6] transition-colors"
                  variants={animationVariants.link}
                  whileHover="hover"
                  aria-label="موقعنا على الخريطة"
                >
                  <div className="w-6 h-6 flex-shrink-0 mt-0.5">
                    <div className="w-4 h-5 bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-12/KZx9WMQ2oO.png)] bg-cover bg-no-repeat ml-1" />
                  </div>
                  <span className="text-sm font-normal leading-5 text-[#1e1e1e] max-w-[180px]">
                    {t.contact.address}
                  </span>
                </motion.a>

                {/* Email */}
                <motion.a
                  href={`mailto:${t.contact.email}`}
                  className="flex gap-3 justify-start items-center hover:text-[#62a0f6] transition-colors"
                  variants={animationVariants.link}
                  whileHover="hover"
                  aria-label="راسلنا عبر البريد الإلكتروني"
                >
                  <div className="w-6 h-6 flex-shrink-0">
                    <div className="w-5 h-4 bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-12/YMvEXnJGd2.png)] bg-cover bg-no-repeat mt-1 ml-0.5" />
                  </div>
                  <span className="text-sm font-normal leading-5 text-[#1e1e1e]">
                    {t.contact.email}
                  </span>
                </motion.a>

                {/* Phone */}
                <motion.a
                  href={`tel:+966${t.contact.phone}`}
                  className="flex gap-3 justify-start items-center hover:text-[#62a0f6] transition-colors"
                  variants={animationVariants.link}
                  whileHover="hover"
                  aria-label="اتصل بنا"
                >
                  <div className="w-6 h-6 flex-shrink-0">
                    <div className="w-5 h-5 bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-12/c4wQnrL1nf.png)] bg-cover bg-no-repeat mt-0.5 ml-0.5" />
                  </div>
                  <span className="text-sm font-normal leading-5 text-[#1e1e1e]">
                    {t.contact.phone}
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
        <div className="w-full py-4 ">
          <div className="flex flex-wrap justify-center items-center gap-6 max-w-[1200px] mx-auto px-4">
            {[
              {image: "https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-12/EGBeNfjh4v.png", width: "56px", height: "17px", label: "Twitter" },
              {image: "https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-12/ZcLPTdQTEC.png", width: "44px", height: "44px", label: "Facebook" },
              {image: "https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-12/2uanR5T9Rg.png", width: "30px", height: "36px", label: "Instagram" },
              {image: "https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-12/Lqu4Zva9bZ.png", width: "72px", height: "32px", label: "LinkedIn" },
              {image: "https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-12/jNgEQAgqyw.png", width: "40px", height: "24px", label: "YouTube" }
            ].map((social) => (
              <motion.span
                key={social.label}
                rel="noopener noreferrer"
                className="hover:opacity-80 transition-opacity"
                style={{
                  width: social.width,
                  height: social.height,
                  backgroundImage: `url(${social.image})`,
                  backgroundSize: "cover",
                  backgroundRepeat: "no-repeat"
                }}
                variants={animationVariants.button}
                whileHover="hover"
                whileTap="tap"
                aria-label={`تابعنا على ${social.label}`}
              />
            ))}
          </div>
        </div>

        {/* Copyright and Legal Links */}
        <div className="w-full border-t border-b border-[#1a191a] py-4">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-4 max-w-7xl mx-auto px-4">
            <nav className="flex flex-col sm:flex-row gap-4 items-center">
              <Link href={`/${locale}/terms`}>
                <motion.span
                  className="text-base font-medium leading-6 text-[#1e1e1e] cursor-pointer hover:text-[#62a0f6] transition-colors"
                  variants={animationVariants.link}
                  whileHover="hover"
                >
                  {t.legal.terms}
                </motion.span>
              </Link>
              <Link href={`/${locale}/privacy`}>
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
              {t.copyright}
            </p>
          </div>
        </div>
      </section>
    </footer>
  );
}

export default Footer;
