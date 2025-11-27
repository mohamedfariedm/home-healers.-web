"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import ClientAPI from "@/app/api/api";
import { Twitter, Facebook, Instagram, Linkedin, Youtube, X,Ghost } from "lucide-react";

// Custom Icons for TikTok and Snapchat since they might not be in all Lucide versions or for specific styling
const TiktokIcon = ({ size = 20, strokeWidth = 1.5, color = "currentColor" }) => (
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

const SnapchatIcon = ({ size = 20, strokeWidth = 1.5, color = "currentColor" }) => (
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
    <path d="M10.65 21.32a8 8 0 0 1 2.7-20.51 4 4 0 0 0-6.4 6.4 8.88 8.88 0 0 1 3.7 14.11z" />
    {/* This is a simplified representation, Snapchat logo is complex for simple stroke. 
        Let's use a more accurate path or a bell/ghost shape if possible, 
        but for now a generic path or the lucide 'Ghost' if available would be better. 
        Actually, let's use a standard SVG path for Snapchat. */}
    <path d="M16.88 20c.84-.24 1.6.5 2.12 1.15a.55.55 0 0 0 .78.09c.3-.23.68-.32 1.05-.24 1.12.24 1.17 1.95 1.17 2.25 0 .4-.32.75-.72.75h-18.56c-.4 0-.72-.35-.72-.75 0-.3.05-2.01 1.17-2.25.37-.08.75.01 1.05.24.24.18.57.15.78-.09.52-.65 1.28-1.39 2.12-1.15 1.17.33 1.91 1.65 2.7 2.65.16.21.48.23.67.05.6-.58 1.48-1.05 2.5-1.05s1.9.47 2.5 1.05c.19.18.51.16.67-.05.79-1 1.53-2.32 2.7-2.65z" />
    <path d="M12 2a5 5 0 0 0-5 5v2a3 3 0 0 0-3 3v1a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-1a3 3 0 0 0-3-3V7a5 5 0 0 0-5-5z" />
  </svg>
);

// Better Snapchat Path (Ghost)
const SnapchatGhostIcon = ({ size = 20, strokeWidth = 1.5, color = "currentColor" }) => (
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
    <path d="M12 2.5c-2.5 0-4.5 1.8-4.5 4.5v1.5c0 1.1-.9 2-2 2h-1c-1.1 0-2 .9-2 2v1c0 1.1.9 2 2 2h1c.6 0 1.1.2 1.5.6.4.4.6.9.6 1.5v.5c0 1.1.9 2 2 2h1.5c.8 0 1.5.7 1.5 1.5v.5c0 .3.2.5.5.5s.5-.2.5-.5v-.5c0-.8.7-1.5 1.5-1.5h1.5c1.1 0 2-.9 2-2v-.5c0-.6.2-1.1.6-1.5.4-.4.9-.6 1.5-.6h1c1.1 0 2-.9 2-2v-1c0-1.1-.9-2-2-2h-1c-1.1 0-2-.9-2-2V7c0-2.7-2-4.5-4.5-4.5z" />
  </svg>
);
// Actually, let's just use the Lucide 'Ghost' icon if we want a ghost, but standard Snapchat logo is specific.
// I will use a simplified path for Snapchat that looks decent or just rely on text if icon is too hard, but user wants icons.
// Let's use a simple path for Snapchat.
const SimpleSnapchatIcon = ({ size = 20, strokeWidth = 1.5, color = "currentColor" }) => (
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
      <path d="M12 2.5c-2.8 0-5 2.2-5 5v1.5a2.5 2.5 0 0 0-2.5 2.5v1a2.5 2.5 0 0 0 2.5 2.5h.5c.3 0 .5.2.5.5v.5c0 .3.2.5.5.5h7c.3 0 .5-.2.5-.5v-.5c0-.3.2-.5.5-.5h.5a2.5 2.5 0 0 0 2.5-2.5v-1a2.5 2.5 0 0 0-2.5-2.5v-1.5c0-2.8-2.2-5-5-5z" />
    </svg>
);
// Wait, I should just use the standard icons if possible. I'll stick to the ones I can find or just use a generic one if I can't find a perfect match.
// Actually, Lucide doesn't have Snapchat. I will use a custom SVG for it.


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


function Footer({ locale = "ar", section, settings }: FooterProps) {
  const t =
    translations[locale as keyof typeof translations] || translations.ar;
  const isRTL = locale === "ar";

  // Extract dynamic content from settings
  const settingsData = settings?.data?.[0]?.setting;
  const socialMedia = settingsData?.social || {};
  const iosLink = settingsData?.ios_link;
  const androidLink = settingsData?.android_link;

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
  ].filter(item => item.url && item.show);

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
            href={`https://wa.me/966551172232?text=${encodeURIComponent(
              t.whatsappMessage
            )}`}
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
                  href={androidLink || "https://play.google.com/store/apps/details?id=com.homehealers.app"}
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
                  href={iosLink || "https://apps.apple.com/sa/app/home-healers/id123456789"}
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
              {t.copyright}
            </p>
          </div>
        </div>
      </section>
    </footer>
  );
}

export default Footer;
