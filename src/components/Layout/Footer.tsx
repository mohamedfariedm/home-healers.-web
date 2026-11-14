"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Twitter,
  Facebook,
  Instagram,
  Linkedin,
  Youtube,
  X,
  Ghost,
} from "lucide-react";
import {
  buildWhatsAppUrl,
  formatWhatsAppNumber,
} from "@/constants/whatsapp";

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
      categories: "تخصصاتنا",
      offers: "العروض",
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
    partnersGosiIntro: "نحن فخورون بالتعاون مع",
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
      categories: "Our Specialties",
      offers: "Offers",
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
    partnersGosiIntro: "We are proud to cooperate with",
  },
};

const fireCelebration = async () => {
  const { default: confetti } = await import("canvas-confetti");
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
  const pathname = usePathname() || "";
  // Booking lab CLS (~1.67) is the MEA block shifting below a short page.
  // Keep the awards section on marketing pages; skip it on booking flows.
  const hideAwards =
    /\/booking(\/|$)/.test(pathname) || /\/offers\/[^/]+\/book(\/|$)/.test(pathname);
  const t =
    translations[locale as keyof typeof translations] || translations.ar;
  const isRTL = locale === "ar";
  // Extract dynamic content from settings
  const settingsData = settings?.data?.[0]?.setting;
  const socialMedia = settingsData?.social || {};
  const iosLink = settingsData?.ios_link;
  const androidLink = settingsData?.android_link;
  const businessInfo = settingsData?.business_info || {};

  // Get business info with fallbacks
  const whatsappPhone =
    businessInfo.whatsapp || businessInfo.contact || "0118289771";
  const contactPhone = businessInfo.contact || "0118289771";
  const whatsappUrl = buildWhatsAppUrl(whatsappPhone);
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

  const celebrationRef = React.useRef<HTMLDivElement | null>(null);

  // Confetti only after a real pointer/key interaction — Lighthouse scrolls
  // the footer into view and was burning main-thread TBT on every lab run.
  React.useEffect(() => {
    if (!celebrationRef.current) return;
    if (sessionStorage.getItem("hasSeenCertificationAnimation")) return;

    let observer: IntersectionObserver | null = null;
    let armed = false;

    const arm = () => {
      if (armed) return;
      armed = true;
      if (!celebrationRef.current) return;
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (
              entry.isIntersecting &&
              !sessionStorage.getItem("hasSeenCertificationAnimation")
            ) {
              fireCelebration();
              sessionStorage.setItem("hasSeenCertificationAnimation", "true");
              observer?.disconnect();
            }
          });
        },
        { threshold: 0.6 },
      );
      observer.observe(celebrationRef.current);
    };

    const events: Array<keyof WindowEventMap> = [
      "pointerdown",
      "keydown",
      "touchstart",
    ];
    events.forEach((evt) =>
      window.addEventListener(evt, arm, { once: true, passive: true }),
    );

    return () => {
      events.forEach((evt) => window.removeEventListener(evt, arm));
      observer?.disconnect();
    };
  }, []);

  return (
    <>
      <footer className="mt-12 w-full sm:mt-16 lg:mt-20">
        {/* Certification/Award Celebration Section */}
        {!hideAwards ? (
        <section
          ref={celebrationRef}
          className="mb-12 w-full px-4 sm:mb-16 sm:px-5 lg:mb-20"
          style={{ minHeight: 420 }}
        >
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col items-center gap-8 md:flex-row">
              {/* Celebration Message */}
              <div className="min-h-[140px] space-y-4 text-center md:min-h-[180px] md:flex-1">
                <div className="inline-block">
                  <h2 className="mb-4 text-2xl font-bold leading-tight text-[#143087] sm:text-3xl lg:text-4xl">
                    {locale === "ar" ? (
                      <>
                        بفضل ثقتكم نفتخر بحصولنا علي جائزة
                        <span className="text-[#8bc34a]">
                          MEA Business Awards 2025
                        </span>
                      </>
                    ) : (
                      <>
                        We Are The Winners Of{" "}
                        <span className="text-[#8bc34a]">
                          MEA Business Awards 2025
                        </span>
                      </>
                    )}
                  </h2>
                </div>

                <p className="mx-auto max-w-3xl text-lg font-medium text-[#1e1e1e] sm:text-xl">
                  {locale === "ar"
                    ? "نفخر بحصولنا على جائزة أفضل مقدم رعاية صحية منزلية 2025 وجائزة التميز في العلاج الطبيعي 2025"
                    : "We are proud to have won the Best Home Healthcare Provider 2025 and Excellence Award in Physical Therapy 2025"}
                </p>
              </div>

              {/* Certificate — reserved square box prevents footer CLS (~1.67) */}
              <div className="relative aspect-square w-full max-w-[360px] shrink-0 sm:max-w-[420px] md:max-w-[480px]">
                <div className="absolute inset-0 overflow-hidden rounded-2xl bg-white shadow-2xl">
                  <Image
                    src="/assets/images/certification.webp"
                    alt={
                      locale === "ar"
                        ? "شهادة MEA Business Awards 2025"
                        : "MEA Business Awards 2025 Certificate"
                    }
                    fill
                    sizes="(max-width: 768px) 90vw, 480px"
                    className="object-contain p-2 sm:p-3"
                    quality={80}
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-[#8bc34a]/10" />
                </div>
                <div className="absolute -top-4 -left-4 h-12 w-12 rounded-full bg-[#8bc34a] opacity-20 blur-xl" />
                <div className="absolute -bottom-4 -right-4 h-12 w-12 rounded-full bg-[#62a0f6] opacity-20 blur-xl" />
              </div>
            </div>
          </div>
        </section>
        ) : null}

        {/* Contact Section */}
        <section className="w-full py-6 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-20 xl:py-[75px] bg-[#ebfdf2]">
          <div className="flex flex-col lg:flex-row w-full gap-4 sm:gap-6 lg:gap-12 justify-between items-center max-w-7xl mx-auto">
            {/* Text and Icon Section */}
            <div className="flex w-full max-w-[736px] flex-col gap-3 items-end">
              <div className="flex w-full gap-4 sm:gap-6 justify-center items-center">
                {/* Icon */}
                <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-[url(/assets/images/layout/footer-contact-icon.svg)] bg-cover bg-no-repeat flex-shrink-0" />

                {/* Text Content */}
                <div className="flex flex-col w-full gap-3">
                  <h2 className="text-lg sm:text-xl font-semibold leading-7 sm:leading-8 text-[#1e1e1e] text-start">
                    {contactTitle?.includes("استفسار") ? (
                      <>
                        اذا كان لديك أي{" "}
                        <span className="text-[#1e1e1e]">استفسار</span> فلا
                        تردد!
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
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-gtm-event="whatsapp_click"
              data-gtm-location="footer"
              className="flex w-full sm:w-auto min-w-[200px] h-14 px-4 py-2 gap-2 justify-center items-center bg-[#12b669] rounded-xl text-white hover:bg-[#0ea55c] transition-colors"
              aria-label={
                locale === "ar"
                  ? "تواصل معنا عبر الواتساب"
                  : "Contact us via WhatsApp"
              }
            >
              <div className="w-6 h-6 relative overflow-hidden">
                <div className="w-5 h-5 bg-[url(/assets/images/layout/footer-whatsapp-icon.svg)] bg-cover bg-no-repeat mt-0.5 ml-0.5" />
              </div>
              <span className="text-base sm:text-lg font-medium leading-7 whitespace-nowrap">
                {t.whatsappButton}
              </span>
            </a>
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
                    <div className="w-[63px] h-[60px] bg-[url(/assets/images/layout/footer-logo-part1.svg)] bg-cover bg-no-repeat" />
                    <div className="w-[57px] h-[72px] bg-[url(/assets/images/layout/footer-logo-part2.svg)] bg-cover bg-no-repeat" />
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
                      <a
                        key={social.name}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        data-gtm-event="social_click"
                        data-gtm-location="footer"
                        data-gtm-label={social.name}
                        className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#62a0f6] text-white shadow-sm transition-colors hover:bg-[#4f8ae8]"
                        aria-label={
                          social.ariaLabel[
                            locale as keyof typeof social.ariaLabel
                          ]
                        }
                      >
                        <social.icon size={20} strokeWidth={1.5} />
                      </a>
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
                  <div className="w-10 h-1.5 bg-[url(/assets/images/layout/footer-underline-quick-links.svg)] bg-cover bg-no-repeat" />
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
                      href: `${locale === "ar" ? "" : "/en"}/categories`,
                      text: t.navigation.categories,
                    },
                    {
                      href: `${locale === "ar" ? "" : "/en"}/offers`,
                      text: t.navigation.offers,
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
                      <Link
                        href={link.href}
                        data-gtm-event="nav_click"
                        data-gtm-location="footer"
                        data-gtm-label={link.text}
                      >
                        <span
                          className="text-base font-normal leading-6 text-[#1e1e1e] hover:text-[#62a0f6] transition-colors cursor-pointer"
                        >
                          {link.text}
                        </span>
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
                  <div className="w-10 h-1.5 bg-[url(/assets/images/layout/footer-underline-download.svg)] bg-cover bg-no-repeat" />
                </div>

                <div className="flex flex-col gap-3 items-start">
                  {/* Google Play Button */}
                  <a
                    href={
                      androidLink ||
                      "https://play.google.com/store/apps/details?id=com.homehealers.app"
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    data-gtm-event="download_app_click"
                    data-gtm-location="footer"
                    data-gtm-label="Google Play"
                    className="flex w-full sm:w-[172px] px-5 py-4 gap-4 justify-center items-center bg-[#143087] rounded-xl hover:bg-[#0f2666] transition-colors"
                    aria-label={`${t.appDownload.text} ${t.appDownload.googlePlay}`}
                  >
                    <div className="w-8 h-8 bg-[url(/assets/images/layout/footer-google-play.svg)] bg-cover bg-no-repeat" />
                    <div className="flex flex-col gap-1 items-start">
                      <span className="text-xs font-normal leading-4 text-white">
                        {t.appDownload.text}
                      </span>
                      <span className="text-sm font-semibold leading-5 text-white">
                        {t.appDownload.googlePlay}
                      </span>
                    </div>
                  </a>

                  {/* App Store Button */}
                  <a
                    href={
                      iosLink ||
                      "https://apps.apple.com/sa/app/home-healers/id123456789"
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    data-gtm-event="download_app_click"
                    data-gtm-location="footer"
                    data-gtm-label="App Store"
                    className="flex w-full sm:w-[172px] px-5 py-4 gap-4 justify-center items-center bg-[#143087] rounded-xl hover:bg-[#0f2666] transition-colors"
                    aria-label={`${t.appDownload.text} ${t.appDownload.appStore}`}
                  >
                    <div className="w-8 h-8 bg-[url(/assets/images/layout/footer-app-store.svg)] bg-cover bg-no-repeat" />
                    <div className="flex flex-col gap-1 items-start">
                      <span className="text-xs font-normal leading-4 text-white">
                        {t.appDownload.text}
                      </span>
                      <span className="text-sm font-semibold leading-5 text-white">
                        {t.appDownload.appStore}
                      </span>
                    </div>
                  </a>
                </div>
              </div>

              {/* Contact Info */}
              <div className="flex flex-col gap-8 items-start">
                <div className="flex flex-col gap-2 items-start">
                  <h3 className="text-xl font-semibold leading-[30px] text-[#143087]">
                    {t.contactUs}
                  </h3>
                  <div className="w-10 h-1.5 bg-[url(/assets/images/layout/footer-underline-contact.svg)] bg-cover bg-no-repeat" />
                </div>

                <address className="flex flex-col gap-6 items-start not-italic">
                  {/* Address */}
                  <a
                    href={`https://www.google.com/maps/search/${encodeURIComponent(
                      businessAddress
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex gap-3 justify-start items-start hover:text-[#62a0f6] transition-colors"
                    aria-label={
                      locale === "ar"
                        ? "موقعنا على الخريطة"
                        : "Our location on map"
                    }
                  >
                    <div className="w-6 h-6 flex-shrink-0 mt-0.5">
                      <div className="w-4 h-5 bg-[url(/assets/images/layout/footer-address-icon.svg)] bg-cover bg-no-repeat ml-1" />
                    </div>
                    <span className="text-sm font-normal leading-5 text-[#1e1e1e] max-w-[180px]">
                      {businessAddress}
                    </span>
                  </a>

                  {/* Email */}
                  <a
                    href={`mailto:${businessEmail}`}
                    className="flex gap-3 justify-start items-center hover:text-[#62a0f6] transition-colors"
                    aria-label={
                      locale === "ar"
                        ? `راسلنا عبر البريد الإلكتروني ${businessEmail}`
                        : `Email ${businessEmail}`
                    }
                  >
                    <div className="w-6 h-6 flex-shrink-0">
                      <div className="w-5 h-4 bg-[url(/assets/images/layout/footer-email-icon.svg)] bg-cover bg-no-repeat mt-1 ml-0.5" />
                    </div>
                    <span className="text-sm font-normal leading-5 text-[#1e1e1e]">
                      {businessEmail}
                    </span>
                  </a>

                  {/* Phone */}
                  <a
                    href={`tel:+${formatWhatsAppNumber(contactPhone)}`}
                    className="flex gap-3 justify-start items-center hover:text-[#62a0f6] transition-colors"
                    aria-label={
                      locale === "ar"
                        ? `اتصل بنا ${contactPhone}`
                        : `Call ${contactPhone}`
                    }
                  >
                    <div className="w-6 h-6 flex-shrink-0">
                      <div className="w-5 h-5 bg-[url(/assets/images/layout/footer-phone-icon.svg)] bg-cover bg-no-repeat mt-0.5 ml-0.5" />
                    </div>
                    <span className="text-sm font-normal leading-5 text-[#1e1e1e]">
                      {contactPhone}
                    </span>
                  </a>
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
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 bg-[#62a0f6] rounded-xl hover:bg-[#4f8ae8] transition-colors text-white"
                aria-label={`تابعنا على ${social.name}`}
              >
                <social.icon size={20} strokeWidth={1.5} />
              </a>
            ))}
          </div>
        </div> */}

          {/* Copyright and Legal Links */}
          <div className="w-full  py-4">
            <div className="flex flex-col lg:flex-row justify-between items-center gap-4 max-w-7xl mx-auto px-4">
              <nav className="flex flex-col sm:flex-row gap-4 items-center">
                <Link
                  href={`${locale === "ar" ? "" : "/en"}/terms`}
                  data-gtm-event="nav_click"
                  data-gtm-location="footer"
                  data-gtm-label="terms"
                >
                  <span
                    className="text-base font-medium leading-6 text-[#1e1e1e] cursor-pointer hover:text-[#62a0f6] transition-colors"
                  >
                    {t.legal.terms}
                  </span>
                </Link>
                <Link
                  href={`${locale === "ar" ? "" : "/en"}/privacy`}
                  data-gtm-event="nav_click"
                  data-gtm-location="footer"
                  data-gtm-label="privacy"
                >
                  <span
                    className="text-base font-medium leading-6 text-[#1e1e1e] cursor-pointer hover:text-[#62a0f6] transition-colors"
                  >
                    {t.legal.privacy}
                  </span>
                </Link>
              </nav>
              <p className="text-base font-medium leading-6 text-[#1e1e1e] text-center">
                {copyrightText}
              </p>
            </div>
          </div>
          <section
          className="w-full flex justify-center items-center py-1.5 px-2"
          aria-label={
            locale === "ar" ? "شركاء: التأمينات الاجتماعية" : "Partners: GOSI"
          }
        >
          <div
            className="inline-flex flex-nowrap items-center justify-center gap-2 sm:gap-2.5 min-w-0 max-w-full"
            dir={isRTL ? "rtl" : "ltr"}
          >
            <p className="text-xs sm:text-sm text-[#1e1e1e] font-medium leading-tight shrink min-w-0">
              {t.partnersGosiIntro}
            </p>
            <div className="relative shrink-0 w-[92px] h-[32px] sm:w-[120px] sm:h-[42px]">
              <Image
                src="/assets/images/gosi.webp"
                alt={
                  locale === "ar"
                    ? "شعار المؤسسة العامة للتأمينات الاجتماعية — برنامج تقدير"
                    : "General Organization for Social Insurance (GOSI) — Taqdeer program logo"
                }
                fill
                className="object-contain object-center"
                sizes="(max-width: 640px) 92px, 120px"
              />
            </div>
          </div>
        </section>
        </section>

      </footer>
    </>
  );
}

export default Footer;
