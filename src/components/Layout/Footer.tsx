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
  section: Section;
}

function Footer({ locale, section }: FooterProps) {
  // Animation variants for buttons and links
  console.log("Footer Section Data:", section);
  
  const buttonVariants = {
    hover: {
      scale: 1.05,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10,
      },
    },
    tap: { scale: 0.95 },
  };

  const linkVariants = {
    hover: {
      color: "#62a0f6",
      x: -5, // Slight shift for RTL
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 15,
      },
    },
  };

  // Extract dynamic content from section data
  const contactTitle = section.title || "اذا كان لديك أي استفسار فلا تردد !";
  const contactDescription = section.Posts[0]?.title || "قم بالتواصل معنا وسنرد عليك في أسرع وقت ممكن";

  return (
    <div className="main-container flex w-full flex-col gap-px items-start flex-nowrap relative mx-auto mt-[80px]">
      {/* Contact Section */}
      <div className="main-container flex flex-col w-full py-6 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-20 xl:py-[75px] gap-4 justify-center items-center bg-[#ebfdf2] border-b border-[#736b7a] mx-auto my-0">
        <div className="flex flex-col lg:flex-row w-full gap-4 sm:gap-6 lg:gap-12 justify-between items-center">
          {/* Text and Icon Section */}
          <div className="flex w-full max-w-[736px] flex-col gap-3 items-end">
            <div className="flex w-full max-w-[688px] gap-4 sm:gap-6 justify-center items-center">
              {/* Icon */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-06-25/jrXCqZ0F4w.png)] bg-cover bg-no-repeat relative overflow-hidden" />
              {/* Text Content */}
              <div className="flex flex-col w-full max-w-[564px] gap-3">
                <div className="flex justify-start items-start w-full">
                  <span className="text-lg sm:text-xl font-semibold leading-7 sm:leading-8 text-[#1e1e1e] text-right">
                    {contactTitle.includes('استفسار') ? (
                      <>
                        اذا كان لديك أي <span className="text-[#1e1e1e]">استفسار</span> فلا تردد !
                      </>
                    ) : (
                      contactTitle
                    )}
                  </span>
                </div>
                <span className="text-sm sm:text-base font-normal leading-6 text-[#1e1e1e] text-right">
                  {contactDescription}
                </span>
              </div>
            </div>
          </div>
          {/* WhatsApp Button */}
          <motion.a
            href="https://wa.me/966551172232?text=مرحبا، لدي استفسار"
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full sm:w-auto min-w-[200px] h-14 px-4 py-2 gap-2 justify-center items-center bg-[#12b669] rounded-lg"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            aria-label="تواصل معنا عبر الواتساب"
          >
            <div className="w-6 h-6 relative overflow-hidden">
              <div className="w-5 h-5 bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-06-25/nc3zMu9Qh4.png)] bg-cover bg-no-repeat mt-0.5 ml-0.5" />
            </div>
            <span className="text-white text-base sm:text-lg font-medium leading-7 text-right whitespace-nowrap">
              التواصل عبر الواتساب
            </span>
          </motion.a>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="w-full bg-[#eff6fe] relative overflow-hidden px-4 md:px-8 lg:px-[60px] py-10">
        <div className="max-w-[1440px] mx-auto flex flex-col lg:flex-row justify-center items-center gap-10 lg:gap-20">
          {/* Logo and Description */}
          <div className="w-full max-w-[438px]">
            <div className="flex w-full max-w-[380px] flex-col gap-[32px] items-center relative z-[78] mt-[70px] mx-auto">
              <div className="flex w-full max-w-[321.191px] flex-col gap-[24px] items-center relative z-[79]">
                <div className="flex gap-[14.075px] items-center relative z-[80]">
                  <div className="w-[63.058px] h-[60.301px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-12/SKp7H4bUnm.png)] bg-cover bg-no-repeat relative z-[81]" />
                  <div className="w-[57.058px] h-[71.814px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-12/PWe640v7e4.png)] bg-cover bg-no-repeat relative z-[82]" />
                </div>
                <div className="flex justify-center items-center w-full relative z-[83]">
                  <span className="text-[12px] font-light leading-[16px] text-[#1e1e1e] text-center z-[84]">
                    العلامة التجارية Home Healers مسجل بمعروف برقم 217470
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-[32px] items-center w-full relative z-[85]">
                <div className="flex justify-center items-center w-full relative z-[86]">
                  <span className="text-[12px] font-medium leading-[24px] text-[#1e1e1e] text-center z-[87]">
                    تطبيق وموقع إلكتروني متخصص في تقديم خدمات العلاج
                    <br /> الطبيعي والتأهيل الطبي للعملاء في منازلهم
                  </span>
                </div>
                <div className="flex gap-[28px] items-center relative z-[88]">
                  <motion.a
                    href="https://twitter.com/homehealers_sa"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-[40px] h-[40px] p-2 items-center bg-[#62a0f6] rounded-[8px] relative z-[95]"
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                    aria-label="تابعنا على تويتر"
                  >
                    <div className="w-[24px] h-[24px] flex justify-center items-center relative overflow-hidden z-[96]">
                      <div className="w-[20px] h-[20px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-12/xbofKUrvfM.png)] bg-cover bg-no-repeat relative" />
                    </div>
                  </motion.a>
                  <motion.a
                    href="https://facebook.com/homehealers.sa"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-[40px] h-[40px] p-2 items-center bg-[#62a0f6] rounded-[8px] relative z-[92]"
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                    aria-label="تابعنا على فيسبوك"
                  >
                    <div className="w-[24px] h-[24px] flex justify-center items-center relative overflow-hidden z-[93]">
                      <div className="w-[20px] h-[20px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-12/ejCSBuhAsH.png)] bg-cover bg-no-repeat relative" />
                    </div>
                  </motion.a>
                  <motion.a
                    href="https://instagram.com/homehealers.sa"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-[40px] h-[40px] p-2 items-center bg-[#62a0f6] rounded-[8px] relative z-[89]"
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                    aria-label="تابعنا على انستغرام"
                  >
                    <div className="w-[24px] h-[24px] flex justify-center items-center relative overflow-hidden z-[90]">
                      <div className="w-[14px] h-[20px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-12/Mok2MoGDLG.png)] bg-cover bg-no-repeat relative" />
                    </div>
                  </motion.a>
                </div>
              </div>
            </div>
          </div>

          {/* Links and Contact Section */}
          <div className="flex items-start w-full justify-between flex-wrap gap-10 lg:gap-20 max-w-[832px]">
            {/* Quick Links */}
            <div className="flex w-full sm:w-auto flex-col gap-[32px] items-start flex-nowrap relative z-[58]">
              <div className="flex w-[117px] flex-col gap-[9px] items-start flex-nowrap relative z-[59]">
                <div className="flex gap-[10px] justify-center items-center self-stretch flex-nowrap relative z-[60]">
                  <span className="h-[30px] basis-auto text-[20px] font-semibold leading-[30px] text-[#143087] relative text-start z-[61]">
                    روابط سريعة
                  </span>
                </div>
                <div className="w-[40px] h-[6px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-12/1tXT90JNoT.png)] bg-cover bg-no-repeat relative z-[62]" />
              </div>
              <div className="flex flex-col gap-[16px] items-start self-stretch flex-nowrap relative z-[63]">
                <Link href={`/${locale}`}>
                  <motion.div
                    className="flex w-[81px] gap-[10px] justify-center items-center flex-nowrap relative z-[64]"
                    variants={linkVariants}
                    whileHover="hover"
                  >
                    <span className="h-[24px] basis-auto text-[16px] font-normal leading-[24px] text-[#1e1e1e] relative text-start z-[65]">
                      الرئيسية
                    </span>
                  </motion.div>
                </Link>
                <Link href={`/${locale}/about`}>
                  <motion.div
                    className="flex w-[129px] gap-[10px] justify-center items-center flex-nowrap relative z-[66]"
                    variants={linkVariants}
                    whileHover="hover"
                  >
                    <span className="h-[24px] basis-auto text-[16px] font-normal leading-[24px] text-[#1e1e1e] relative text-start z-[67]">
                      عن هوم هيليرز
                    </span>
                  </motion.div>
                </Link>
                <Link href={`/${locale}/our-services/all`}>
                  <motion.div
                    className="flex w-[76px] gap-[10px] justify-center items-center flex-nowrap relative z-[68]"
                    variants={linkVariants}
                    whileHover="hover"
                  >
                    <span className="h-[24px] basis-auto text-[16px] font-normal leading-[24px] text-[#1e1e1e] relative text-start z-[69]">
                      خدماتنا
                    </span>
                  </motion.div>
                </Link>
                <Link href={`/${locale}/products`}>
                  <motion.div
                    className="flex w-[139px] gap-[10px] justify-center items-center flex-nowrap relative z-[70]"
                    variants={linkVariants}
                    whileHover="hover"
                  >
                    <span className="h-[24px] basis-auto text-[16px] font-normal leading-[24px] text-[#1e1e1e] relative text-start z-[71]">
                      المنتجات الطبية
                    </span>
                  </motion.div>
                </Link>
                <Link href={`/${locale}/blogs`}>
                  <motion.div
                    className="flex w-[80px] gap-[10px] justify-center items-center flex-nowrap relative z-[72]"
                    variants={linkVariants}
                    whileHover="hover"
                  >
                    <span className="h-[24px] basis-auto text-[16px] font-normal leading-[24px] text-[#1e1e1e] relative text-start z-[73]">
                      المدونة
                    </span>
                  </motion.div>
                </Link>
                <Link href={`/${locale}/contact`}>
                  <motion.div
                    className="flex w-[110px] gap-[10px] justify-center items-center flex-nowrap relative z-[74]"
                    variants={linkVariants}
                    whileHover="hover"
                  >
                    <span className="h-[24px] basis-auto text-[16px] font-normal leading-[24px] text-[#1e1e1e] relative text-start z-[75]">
                      تواصل معنا
                    </span>
                  </motion.div>
                </Link>
              </div>
            </div>

            {/* App Download */}
            <div className="flex w-full sm:w-auto flex-col gap-[24px] items-start flex-nowrap relative z-40">
              <div className="flex w-[129px] flex-col gap-[9px] items-start flex-nowrap relative z-[41]">
                <div className="flex gap-[10px] justify-center items-center self-stretch flex-nowrap relative z-[42]">
                  <span className="h-[30px] basis-auto text-[20px] font-semibold leading-[30px] text-[#143087] relative text-start z-[43]">
                    حمل التطبيق
                  </span>
                </div>
                <div className="w-[40px] h-[6px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-12/Q6CctxZby4.png)] bg-cover bg-no-repeat relative z-[44]" />
              </div>
              <div className="flex flex-col gap-[12px] items-start self-stretch flex-nowrap relative z-[45]">
                <motion.a
                  href="https://play.google.com/store/apps/details?id=com.homehealers.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full sm:w-[172px] pt-[16px] pr-[20px] pb-[16px] pl-[20px] gap-[16px] justify-center items-center flex-nowrap bg-[#143087] rounded-[8px] relative z-[46]"
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  aria-label="حمل التطبيق من جوجل بلاي"
                >
                  <div className="flex w-[132px] gap-[16px] items-center flex-nowrap relative z-[47]">
                    <div className="w-[32px] h-[32px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-12/f3GhWRCGPf.png)] bg-cover bg-no-repeat relative overflow-hidden z-[51]" />
                    <div className="flex w-[84px] flex-col gap-[4px] items-start flex-nowrap relative z-[48]">
                      <span className="h-[16px] basis-auto text-[12px] font-normal leading-[16px] text-[#fff] relative text-start z-[49]">
                        حمل التطبيق
                      </span>
                      <span className="h-[20px] basis-auto text-[14px] font-semibold leading-[20px] text-[#fff] relative text-start z-50">
                        Google Play
                      </span>
                    </div>
                  </div>
                </motion.a>
                <motion.a
                  href="https://apps.apple.com/sa/app/home-healers/id123456789"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full sm:w-[172px] pt-[16px] pr-[20px] pb-[16px] pl-[20px] gap-[16px] justify-center items-center flex-nowrap bg-[#143087] rounded-[8px] relative z-[52]"
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  aria-label="حمل التطبيق من آب ستور"
                >
                  <div className="flex w-[121px] gap-[16px] items-center flex-nowrap relative z-[53]">
                    <div className="w-[32px] h-[32px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-12/GrVtXLn6Og.png)] bg-cover bg-no-repeat relative overflow-hidden z-[57]" />
                    <div className="flex w-[73px] flex-col gap-[4px] items-start flex-nowrap relative z-[54]">
                      <span className="h-[16px] basis-auto text-[12px] font-normal leading-[16px] text-[#fff] relative text-start z-[55]">
                        حمل التطبيق
                      </span>
                      <span className="h-[20px] basis-auto text-[14px] font-semibold leading-[20px] text-[#fff] relative text-start z-[56]">
                        App Store
                      </span>
                    </div>
                  </div>
                </motion.a>
              </div>
            </div>

            {/* Contact Info */}
            <div className="flex w-full sm:w-auto flex-col gap-[32px] items-start flex-nowrap relative z-[18]">
              <div className="flex w-[135px] flex-col gap-[32px] items-start flex-nowrap relative z-[19]">
                <div className="flex w-[114px] flex-col gap-[9px] items-start flex-nowrap relative z-20">
                  <div className="flex gap-[10px] justify-center items-center self-stretch flex-nowrap relative z-[21]">
                    <span className="h-[30px] basis-auto text-[20px] font-semibold leading-[30px] text-[#143087] relative text-start z-[22]">
                      تواصل معنا
                    </span>
                  </div>
                  <div className="w-[40px] h-[6px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-12/JsXDV3xffp.png)] bg-cover bg-no-repeat relative z-[23]" />
                </div>
              </div>
              <div className="flex flex-col gap-[24px] items-start self-stretch flex-nowrap relative z-[24]">
                <motion.a
                  href="https://www.google.com/maps/search/الرياض+شارع+الامير+عبدالعزيز+بن+مساعد+بن+جلوي"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex gap-[12px] justify-start items-start self-stretch flex-nowrap relative z-[25]"
                  variants={linkVariants}
                  whileHover="hover"
                  aria-label="موقعنا على الخريطة"
                >
                  <div className="w-[24px] h-[24px] relative overflow-hidden z-[28]">
                    <div className="w-[16px] h-[20px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-12/KZx9WMQ2oO.png)] bg-[length:100%_100%] bg-no-repeat relative z-[29] mt-[2px] mr-0 mb-0 ml-[4px]" />
                  </div>
                  <div className="flex w-[180px] gap-[10px] justify-center items-center flex-nowrap relative z-[26]">
                    <div className="w-[180px] text-[14px] font-normal leading-[20px] relative text-start z-[27]">
                      <span className="text-[14px] font-normal leading-[20px] text-[#1e1e1e] relative text-start">
                        الرياض - شارع الامير عبدالعزيز
                        <br /> بن مساعد بن جلوي
                      </span>
                    </div>
                  </div>
                </motion.a>
                <motion.a
                  href="mailto:customer.service@home-healers.com"
                  className="flex w-[298px] gap-[12px] justify-center items-center flex-nowrap relative z-30"
                  variants={linkVariants}
                  whileHover="hover"
                  aria-label="راسلنا عبر البريد الإلكتروني"
                >
                  <div className="w-[24px] h-[24px] relative overflow-hidden z-[33]">
                    <div className="w-[20px] h-[17px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-12/YMvEXnJGd2.png)] bg-[length:100%_100%] bg-no-repeat relative z-[34] mt-[3.5px] mr-0 mb-0 ml-[2px]" />
                  </div>
                  <div className="flex w-[262px] gap-[10px] justify-center items-center flex-nowrap relative z-[31]">
                    <div className="w-[262px] text-[14px] font-normal leading-[20px] relative text-start z-[32]">
                      <span className="text-[14px] font-normal leading-[20px] text-[#1e1e1e] relative text-start">
                        customer.service@home-healers.com
                      </span>
                    </div>
                  </div>
                </motion.a>
                <motion.a
                  href="tel:+966551172232"
                  className="flex w-[115px] gap-[12px] justify-center items-center flex-nowrap relative z-[35]"
                  variants={linkVariants}
                  whileHover="hover"
                  aria-label="اتصل بنا"
                >
                  <div className="w-[24px] h-[24px] relative overflow-hidden z-[38]">
                    <div className="w-[20px] h-[20px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-12/c4wQnrL1nf.png)] bg-[length:100%_100%] bg-no-repeat relative z-[39] mt-[2px] mr-0 mb-0 ml-[2px]" />
                  </div>
                  <div className="flex w-[79px] gap-[10px] justify-center items-center flex-nowrap relative z-[36]">
                    <div className="w-[79px] text-[14px] font-normal leading-[20px] relative text-start z-[37]">
                      <span className="text-[14px] font-normal leading-[20px] text-[#1e1e1e] relative text-start">
                        0551172232
                      </span>
                    </div>
                  </div>
                </motion.a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Social Media and Terms */}
      <div className="flex w-full flex-col items-start">
        <div className="w-full bg-[#eff6fe] py-4">
          <div className="flex flex-wrap justify-center items-center gap-6 max-w-[1200px] mx-auto px-4">
            <motion.a
              href="https://twitter.com/homehealers_sa"
              target="_blank"
              rel="noopener noreferrer"
              className="w-[56px] h-[17px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-12/EGBeNfjh4v.png)] bg-cover bg-no-repeat relative overflow-hidden z-[102]"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              aria-label="تابعنا على تويتر"
            />
            <motion.a
              href="https://facebook.com/homehealers.sa"
              target="_blank"
              rel="noopener noreferrer"
              className="w-[44px] h-[44px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-12/ZcLPTdQTEC.png)] bg-cover bg-no-repeat relative overflow-hidden z-[103]"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              aria-label="تابعنا على فيسبوك"
            />
            <motion.a
              href="https://instagram.com/homehealers.sa"
              target="_blank"
              rel="noopener noreferrer"
              className="w-[30px] h-[36px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-12/2uanR5T9Rg.png)] bg-cover bg-no-repeat relative overflow-hidden z-[104]"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              aria-label="تابعنا على انستغرام"
            />
            <motion.a
              href="https://linkedin.com/company/home-healers"
              target="_blank"
              rel="noopener noreferrer"
              className="w-[72.423px] h-[32.001px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-12/Lqu4Zva9bZ.png)] bg-[length:100%_100%] bg-no-repeat relative z-[105]"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              aria-label="تابعنا على لينكد إن"
            />
            <motion.a
              href="https://youtube.com/@homehealers"
              target="_blank"
              rel="noopener noreferrer"
              className="w-[39.944px] h-[24.386px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-12/jNgEQAgqyw.png)] bg-[length:100%_100%] bg-no-repeat relative z-[107]"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              aria-label="تابعنا على يوتيوب"
            />
          </div>
        </div>

        <div className="w-full bg-[#eff6fe] border-t border-b border-[#1a191a] py-4">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-4 max-w-[1280px] mx-auto px-4">
            <div className="flex flex-col sm:flex-row gap-4 items-center z-[111]">
              <Link href={`/${locale}/terms`}>
                <motion.span
                  className="text-[16px] font-medium leading-[24px] text-[#1e1e1e] z-[112] cursor-pointer"
                  variants={linkVariants}
                  whileHover="hover"
                >
                  الشروط والاحكام
                </motion.span>
              </Link>
              <Link href={`/${locale}/privacy`}>
                <motion.span
                  className="text-[16px] font-medium leading-[24px] text-[#1e1e1e] z-[113] cursor-pointer"
                  variants={linkVariants}
                  whileHover="hover"
                >
                  السياسة الخصوصية
                </motion.span>
              </Link>
            </div>
            <span className="text-[16px] font-medium leading-[24px] text-[#1e1e1e] text-center z-[110]">
              © 2025 جميع الحقوق محفوظة | Home Healers
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Footer;