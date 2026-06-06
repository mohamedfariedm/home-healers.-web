"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import Link from "next/link";
import Image from "next/image";
import ClientAPI from "@/app/api/api";
import { ArrowLeft } from "lucide-react";
import { parseCmsHtml } from "@/lib/parse-cms-html";

interface LandingSliderProps {
  section: any;
  locale: string;
}

export default function LandingSlider({
  section,
  locale,
}: LandingSliderProps) {
  const ref = useRef(null);
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [processingPackage, setProcessingPackage] = useState<number | null>(null);
  
  // Check if payment_link is enabled for this section
  const usePaymentLink = section.payment_link === true;

  const title = section.title?.[locale] || "";
  const content = section.content?.[locale] || "";
  const slideType = section.slide_type;
  const selectedIds = section.selected_services ||
    section.selected_doctors ||
    section.selected_blogs ||
    section.selected_packages ||
    section.selected_faqs ||
    section.selected_offers ||
    [];
  const buttons = section.buttons || [];
  const isRTL = locale === "ar";

  // Handle package/offer booking with payment link
  const handlePackageBooking = async (packageId: number) => {
    if (processingPackage === packageId) return; // Prevent double clicks
    
    setProcessingPackage(packageId);
    
    try {
      // Call the booking-with-packages API
      const response = await ClientAPI.createReservationWithPackage(
        {
          package_id: packageId,
          payment_method: "web",
        },
        locale
      );

      // Check if payment redirect URL is available
      if (response?.payment?.redirect_url) {
        // Open payment page in new tab
        window.open(response.payment.redirect_url, "_blank", "noopener,noreferrer");
      } else if (response?.payment?.error) {
        // Payment link creation failed, show error and redirect to booking page
        console.error("Payment link creation failed:", response.payment.error);
        alert(
          locale === "ar"
            ? "تم إنشاء الحجز بنجاح، لكن فشل إنشاء رابط الدفع. سيتم توجيهك إلى صفحة الحجز."
            : "Booking created successfully, but payment link creation failed. Redirecting to booking page."
        );
        window.location.href = `/${locale}/booking?packageId=${packageId}`;
      } else if (response?.data?.[0]?.id) {
        // Booking created but no payment needed (total_amount = 0)
        alert(
          locale === "ar"
            ? "تم إنشاء الحجز بنجاح!"
            : "Booking created successfully!"
        );
        // Optionally redirect to booking details or stay on page
      } else {
        // Fallback to booking page
        window.location.href = `/${locale}/booking?packageId=${packageId}`;
      }
    } catch (error: any) {
      console.error("Booking error:", error);
      alert(
        locale === "ar"
          ? "حدث خطأ أثناء إنشاء الحجز. يرجى المحاولة مرة أخرى."
          : "An error occurred while creating the booking. Please try again."
      );
      // Fallback to booking page
      window.location.href = `/${locale}/booking?packageId=${packageId}`;
    } finally {
      setProcessingPackage(null);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        let fetchedData: any[] = [];

        switch (slideType) {
          case "services":
            const servicesData = await ClientAPI.getAllServices(locale);
            fetchedData = servicesData?.data || [];
            if (selectedIds.length > 0) {
              fetchedData = fetchedData.filter((item: any) =>
                selectedIds.includes(item.id)
              );
            }
            break;

          case "doctors":
            const doctorsData = await ClientAPI.getDoctors(locale);
            fetchedData = doctorsData?.data || [];
            if (selectedIds.length > 0) {
              fetchedData = fetchedData.filter((item: any) =>
                selectedIds.includes(item.id)
              );
            }
            break;

          case "blogs":
            const blogsData = await ClientAPI.getAllBlogs(locale);
            fetchedData = blogsData?.data || [];
            if (selectedIds.length > 0) {
              fetchedData = fetchedData.filter((item: any) =>
                selectedIds.includes(item.id)
              );
            }
            break;

          case "packages":
            const packagesData = await ClientAPI.getPackages(locale);
            fetchedData = packagesData?.data || [];
            if (selectedIds.length > 0) {
              fetchedData = fetchedData.filter((item: any) =>
                selectedIds.includes(item.id)
              );
            }
            break;

          case "faqs":
            const faqsData = await ClientAPI.getFAQs(locale);
            fetchedData = faqsData?.data || [];
            if (selectedIds.length > 0) {
              fetchedData = fetchedData.filter((item: any) =>
                selectedIds.includes(item.id)
              );
            }
            break;

          case "offers":
            // Offers might be part of packages or a separate endpoint
            const offersData = await ClientAPI.getPackages(locale);
            fetchedData = (offersData?.data || []).filter(
              (item: any) => item.type === "offer"
            );
            if (selectedIds.length > 0) {
              fetchedData = fetchedData.filter((item: any) =>
                selectedIds.includes(item.id)
              );
            }
            break;

          default:
            console.warn(`Unknown slide type: ${slideType}`);
        }

        setData(fetchedData);
      } catch (error) {
        console.error("Error fetching slider data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slideType, selectedIds, locale]);

  const renderSlide = (item: any, index: number) => {
    switch (slideType) {
      case "services":
        // Handle slug as object with locale keys or plain string
        const serviceSlug = typeof item.slug === "object"
          ? (item.slug?.[locale] || item.slug?.en || item.slug?.ar || "")
          : (item.slug || "");
        
        return (
          <SwiperSlide key={item.id || index}>
            <Link
              href={`${locale === "ar" ? "" : "/en"}/our-services/${serviceSlug}`}
              className="relative bg-[#0077b7] rounded-3xl w-full h-[352px] px-2 py-10 hover:shadow-2xl hover:scale-105 transition-all duration-300 block mx-auto"
            >
              <div className="absolute top-6 start-2 flex flex-col items-start w-full gap-4 px-2">
                <div
                  style={{
                    backgroundImage: `url(${
                      item.image?.[0]?.original ||
                      "/assets/images/homehellers/Injury.svg"
                    })`,
                  }}
                  className="bg-cover bg-center bg-no-repeat rounded-full w-24 h-24 flex items-center justify-center"
                />
                <div className="text-white">
                  <h3 className="text-lg font-semibold leading-7">
                    {item.name}
                  </h3>
                  <div className="text-sm font-light leading-8 mt-1 max-h-[96px] overflow-hidden text-ellipsis">
                    {typeof item.description === "string"
                      ? parseCmsHtml(item.description)
                      : item.description}
                  </div>
                </div>
              </div>
            </Link>
          </SwiperSlide>
        );

      case "doctors":
        return (
          <SwiperSlide key={item.id || index} className="!h-auto">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="relative w-full h-64 bg-gray-100">
                {item.image && (
                  <Image
                    src={item.image?.original || item.image}
                    alt={item.name || "Doctor"}
                    fill
                    className="object-cover"
                  />
                )}
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-[#1e1e1e] mb-2">
                  {item.name}
                </h3>
                {item.specialty && (
                  <p className="text-sm text-[#62a0f6] mb-2">
                    {item.specialty}
                  </p>
                )}
                {item.description && (
                  <p className="text-sm text-gray-600 line-clamp-3">
                    {item.description}
                  </p>
                )}
              </div>
            </div>
          </SwiperSlide>
        );

      case "blogs":
        // Handle slug as object with locale keys or plain string
        const blogSlug = typeof item.slug === "object" 
          ? (item.slug?.[locale] || item.slug?.en || item.slug?.ar || "")
          : (item.slug || item.id || "");
        
        // Get blog title (could be name or title)
        const blogTitle = item.name || item.title || "";
        
        // Get and clean description (strip HTML tags for preview)
        const getCleanDescription = (desc: any): string => {
          if (!desc) return "";
          if (typeof desc === "string") {
            // Strip HTML tags using regex (works on both client and server)
            let text = desc
              .replace(/<[^>]*>/g, "") // Remove HTML tags
              .replace(/&lt;/g, "<") // Decode &lt;
              .replace(/&gt;/g, ">") // Decode &gt;
              .replace(/&amp;/g, "&") // Decode &amp;
              .replace(/&quot;/g, '"') // Decode &quot;
              .replace(/&#39;/g, "'") // Decode &#39;
              .replace(/&nbsp;/g, " ") // Decode &nbsp;
              .replace(/\s+/g, " ") // Remove extra whitespace
              .trim();
            return text;
          }
          return String(desc);
        };
        
        const blogDescription = getCleanDescription(item.description || item.short_desc);
        
        // Handle image as array, object, or string
        let imageUrl = null;
        if (Array.isArray(item.image)) {
          imageUrl = item.image[0]?.original || item.image[0];
        } else if (typeof item.image === "object" && item.image !== null) {
          imageUrl = item.image.original || item.image.url || item.image[0]?.original;
        } else if (typeof item.image === "string") {
          imageUrl = item.image;
        }
        
        return (
          <SwiperSlide key={item.id || index}>
            <Link
              href={`${locale === "ar" ? "" : "/en"}/blog/${blogSlug}`}
              className="group flex flex-col bg-gradient-to-br from-white via-gray-50/50 to-white rounded-2xl shadow-lg hover:shadow-2xl overflow-hidden transition-all duration-500 h-full"
            >
              {/* Image Container with Overlay */}
              <div className="relative w-full h-56 bg-gradient-to-br from-gray-200 to-gray-300 overflow-hidden">
                {imageUrl ? (
                  <>
                    <Image
                      src={imageUrl}
                      alt={blogTitle || "Blog"}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      unoptimized={true}
                      sizes="(max-width: 768px) 100vw, 357px"
                    />
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    {/* Shine Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  </>
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto mb-2 bg-gray-300 rounded-lg flex items-center justify-center">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <span className="text-gray-400 text-xs">No Image</span>
                    </div>
                  </div>
                )}
                
                {/* Decorative Corner Element */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-[#143087]/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>

              {/* Content Section */}
              <div className="p-5 lg:p-6 flex flex-col flex-1 relative">
                {/* Background Decorative Element */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#143087]/5 to-transparent rounded-full blur-2xl -z-0" />
                
                {blogTitle && (
                  <h3 className="text-lg lg:text-xl font-bold text-[#1e1e1e] mb-3 line-clamp-2 min-h-[56px] group-hover:text-[#143087] transition-colors duration-300 relative z-10">
                    {blogTitle}
                  </h3>
                )}
                
                {blogDescription && (
                  <p className="text-sm lg:text-base text-gray-600 line-clamp-3 leading-relaxed mb-4 flex-1 relative z-10">
                    {blogDescription}
                  </p>
                )}

                {/* Read More Indicator */}
                <div className="flex items-center gap-2 text-[#143087] font-semibold text-sm mt-auto relative z-10 group-hover:gap-3 transition-all duration-300">
                  <span>{locale === "ar" ? "اقرأ المزيد" : "Read More"}</span>
                  <ArrowLeft className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* Hover Border Effect */}
              <div className="absolute inset-0 border-2 border-[#143087]/0 group-hover:border-[#143087]/20 rounded-2xl pointer-events-none transition-all duration-500" />
            </Link>
          </SwiperSlide>
        );

      case "packages":
      case "offers":
        const isProcessing = processingPackage === item.id;
        return (
          <SwiperSlide key={item.id || index}>
            <div
              onClick={() => {
                if (typeof window !== "undefined" && !isProcessing) {
                  if (usePaymentLink) {
                    // Use API booking with payment link
                    handlePackageBooking(item.id);
                  } else {
                    // Use regular booking page
                    window.location.href = `/${locale}/booking?packageId=${item.id}`;
                  }
                }
              }}
              className={`relative bg-white shadow-lg rounded-3xl overflow-hidden w-full h-[420px] flex flex-col mx-auto border border-gray-100 ${
                isProcessing ? "cursor-wait opacity-75" : "cursor-pointer hover:shadow-xl"
              } transition-all`}
            >
              <div className="relative w-full h-[180px] bg-gray-100">
                {item.image?.[0]?.original && (
                  <Image
                    src={item.image[0].original}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                )}
                <div
                  className={`absolute top-4 right-4 text-sm px-3 py-1 rounded-full ${
                    item.type === "offer"
                      ? "bg-green-600 text-white"
                      : "bg-[#143087] text-white"
                  }`}
                >
                  {locale === "ar"
                    ? item.type === "offer"
                      ? "عرض"
                      : "باقة"
                    : item.type === "offer"
                    ? "Offer"
                    : "Package"}
                </div>
              </div>
              <div className="p-5 flex flex-col justify-between flex-1 relative">
                {/* Loading Overlay */}
                {isProcessing && (
                  <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-3xl flex items-center justify-center z-10">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-8 h-8 border-4 border-[#143087] border-t-transparent rounded-full animate-spin" />
                      <p className="text-sm text-[#143087] font-medium">
                        {locale === "ar" ? "جاري المعالجة..." : "Processing..."}
                      </p>
                    </div>
                  </div>
                )}
                
                <div>
                  <h3 className="text-xl font-semibold text-[#1e1e1e] mb-2">
                    {item.name}
                  </h3>
                  {item.description && (
                    <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                      {item.description}
                    </p>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    {item.price && (
                      <p className="text-2xl font-bold text-[#143087]">
                        {item.price} {locale === "ar" ? "ريال" : "SAR"}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        );

      case "faqs":
        const faqQuestion = item.question || item.title || "";
        const faqAnswer = item.answer || item.description || "";
        
        // Parse HTML content if it's a string
        const renderAnswer = () => {
          if (!faqAnswer) return null;
          if (typeof faqAnswer === "string") {
            // Check if it contains HTML tags
            if (faqAnswer.includes("<") && faqAnswer.includes(">")) {
              return parseCmsHtml(faqAnswer);
            }
            return faqAnswer;
          }
          return String(faqAnswer);
        };
        
        return (
          <SwiperSlide key={item.id || index}>
            <div className="group h-full bg-gradient-to-br from-white via-blue-50/30 to-white rounded-2xl p-6 lg:p-8 border-2 border-gray-200/50 hover:border-[#143087]/30 shadow-lg hover:shadow-2xl transition-all duration-500 relative overflow-hidden">
              {/* Decorative Background Elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#143087]/5 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-[#62a0f6]/5 to-transparent rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Question Icon */}
              <div className="flex items-start gap-4 mb-4 relative z-10">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[#143087] to-[#0f245f] rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg lg:text-xl font-bold text-[#1e1e1e] mb-2 group-hover:text-[#143087] transition-colors duration-300 leading-tight">
                    {faqQuestion}
                  </h3>
                </div>
              </div>
              
              {/* Answer Section */}
              <div className="relative z-10">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-1 h-full min-h-[60px] bg-gradient-to-b from-[#143087] to-[#62a0f6] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="flex-1">
                    <div className="text-sm lg:text-base text-gray-700 leading-relaxed line-clamp-4 group-hover:text-gray-800 transition-colors duration-300">
                      {renderAnswer()}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Hover Border Effect */}
              <div className="absolute inset-0 border-2 border-[#143087]/0 group-hover:border-[#143087]/20 rounded-2xl pointer-events-none transition-all duration-500" />
            </div>
          </SwiperSlide>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <section className="w-full max-w-7xl mx-auto py-16 px-4 lg:px-0">
        <div className="text-center">
          <p className="text-gray-600">
            {locale === "ar" ? "جاري التحميل..." : "Loading..."}
          </p>
        </div>
      </section>
    );
  }

  if (data.length === 0) {
    return null;
  }

  return (
    <section
      ref={ref}
      className="w-full max-w-7xl mx-auto py-16 px-4 lg:px-0"
    >
      <motion.div
        className="flex flex-col gap-6"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.8 }}
      >
        {(title || content) && (
          <div className="text-center">
            {title && (
              <h2 className="text-3xl sm:text-4xl font-semibold text-[#1e1e1e] mb-4">
                {title}
              </h2>
            )}
            {content && (
              <p className="text-lg text-[#1e1e1e] max-w-3xl mx-auto leading-relaxed">
                {content}
              </p>
            )}
          </div>
        )}

        <Swiper
          modules={[Pagination, Autoplay, Navigation]}
          spaceBetween={20}
          slidesPerView={1}
          autoplay={{ delay: 4000 }}
          loop={data.length > 3}
          dir={isRTL ? "rtl" : "ltr"}
          onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
          breakpoints={{
            640: { slidesPerView: 1, spaceBetween: 20 },
            768: { slidesPerView: 2, spaceBetween: 25 },
            1024: { slidesPerView: 3, spaceBetween: 30 },
            1280: { slidesPerView: slideType === "packages" || slideType === "offers" ? 4 : 3, spaceBetween: 30 },
          }}
          className="w-full !pb-16"
        >
          {data.map((item, index) => renderSlide(item, index))}
        </Swiper>

        {buttons.length > 0 && (
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center mt-4">
            {buttons.map((button: any, idx: number) => {
              const buttonText = button.text?.[locale] || "";
              let buttonLink = button.link || "#";
              // Handle relative links with locale prefix
              if (buttonLink.startsWith("/") && !buttonLink.startsWith("/en") && !buttonLink.startsWith("/ar")) {
                buttonLink = locale === "ar" ? buttonLink : `/en${buttonLink}`;
              }
              const isPrimary = button.style === "primary";
              const openInNewTab = button.open_in_new_tab || false;

              return (
                <Link
                  key={idx}
                  href={buttonLink}
                  target={openInNewTab ? "_blank" : "_self"}
                  rel={openInNewTab ? "noopener noreferrer" : undefined}
                  className="rounded-md"
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex items-center gap-3 px-5 py-3 rounded-2xl w-fit transition ${
                      isPrimary
                        ? "bg-[#143087] hover:bg-[#0f245f] text-white"
                        : "bg-transparent border-2 border-[#143087] text-[#143087] hover:bg-[#143087] hover:text-white"
                    }`}
                  >
                    <span className="text-base sm:text-lg font-medium">
                      {buttonText}
                    </span>
                    <ArrowLeft className="w-6 h-6" />
                  </motion.div>
                </Link>
              );
            })}
          </div>
        )}
      </motion.div>
    </section>
  );
}
