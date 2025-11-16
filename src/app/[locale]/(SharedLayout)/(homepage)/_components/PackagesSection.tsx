"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import parse from "html-react-parser";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface PackageItem {
  id: number;
  name: string;
  description: string;
  image: { original: string }[];
  price: string;
  discount: string;
  sessions_count: number;
  type: "offer" | "package";
}

interface PackagesSectionProps {
  locale: string;
  data: PackageItem[];
}

export default function PackagesSection({ locale, data }: PackagesSectionProps) {
  const [activeDot, setActiveDot] = useState(0);
  const packages = data || [];
  const router = useRouter();

  const handlePackageClick = (pkg: PackageItem) => {
    router.push(`/${locale}/booking?packageId=${pkg.id}`);
  };

  return (
    <section className="w-full xl:w-[1280px] mx-auto mt-16 flex flex-col items-center relative z-[5]">
      {/* Header */}
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        <h2 className="text-3xl font-semibold text-gray-900">
          {locale === "ar" ? (
            <>
              عروض <span className="text-primary">مميزة</span> وباقات متنوعة
            </>
          ) : (
            <>
              Exclusive <span className="text-primary">Offers</span> & Packages
            </>
          )}
        </h2>
        <p className="text-gray-500 mt-3 text-base max-w-xl mx-auto">
          {locale === "ar"
            ? "اختر من بين العروض والباقات التي تناسب احتياجاتك الصحية"
            : "Choose from offers and packages tailored to your health needs."}
        </p>
      </motion.div>

      {/* Swiper */}
      <Swiper
        modules={[Pagination, Autoplay]}
        spaceBetween={20}
        slidesPerView={1}
        autoplay={{ delay: 4000 }}
        pagination={{
          clickable: true,
          el: ".packages-dots",
        }}
        loop
        onSlideChange={(swiper) => setActiveDot(swiper.realIndex)}
        breakpoints={{
          640: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
          1280: { slidesPerView: 4 },
        }}
        className="w-full h-[60vh]"
      >
        {packages.map((pkg, i) => (
          <SwiperSlide key={pkg.id}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
              onClick={() => handlePackageClick(pkg)}
              className={`relative bg-white shadow-lg rounded-3xl overflow-hidden w-[300px] h-[420px] flex flex-col mx-auto border border-gray-100 cursor-pointer hover:shadow-xl transition-shadow`}
            >
              {/* Image */}
              <div className="relative w-full h-[180px] bg-gray-100">
                <Image
                  src={
                    pkg.image?.[0]?.original ||
                    "/assets/images/homehellers/default-package.jpg"
                  }
                  alt={pkg.name}
                  fill
                  className="object-cover"
                />
                <div
                  className={`absolute top-4 right-4 text-sm px-3 py-1 rounded-full ${
                    pkg.type === "offer"
                      ? "bg-green-600 text-white"
                      : "bg-primary text-white"
                  }`}
                >
                  {locale === "ar"
                    ? pkg.type === "offer"
                      ? "عرض"
                      : "باقة"
                    : pkg.type === "offer"
                    ? "Offer"
                    : "Package"}
                </div>
              </div>

              {/* Content */}
              <div className="p-5 flex flex-col justify-between flex-1">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                    {pkg.name}
                  </h3>
                  <div className="text-sm text-gray-600 mt-2 h-[60px] overflow-hidden">
                    {parse(pkg.description || "")}
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-4 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-primary font-bold text-xl">
                      {pkg.price && pkg.price !== "0.00" ? (
                        <>
                          {pkg.price}{" "}
                          <span className="text-sm text-gray-400 line-through ms-1">
                            {pkg.discount}
                          </span>
                        </>
                      ) : (
                        pkg.discount
                      )}{" "}
                      <span className="text-sm text-gray-500">
                        {locale === "ar" ? "ر.س" : "SAR"}
                      </span>
                    </span>
                    <span className="text-gray-600 text-sm">
                      {locale === "ar"
                        ? `${pkg.sessions_count} جلسات`
                        : `${pkg.sessions_count} sessions`}
                    </span>
                  </div>

                  {/* <button className="w-full mt-2 py-2 bg-primary text-white rounded-xl font-medium hover:bg-[#1a46a3] transition">
                    {locale === "ar" ? "احجز الآن" : "Book Now"}
                  </button> */}
                </div>
              </div>
            </motion.div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Pagination Dots */}
      <div className="flex gap-3 mt-6 packages-dots justify-center">
        {packages.map((_, i) => (
          <div
            key={i}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              i === activeDot ? "bg-primary" : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
