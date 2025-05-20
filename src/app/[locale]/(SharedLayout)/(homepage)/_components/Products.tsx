"use client";

import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { ArrowLeft, Star } from "lucide-react";

const CategoryTag = ({
  name,
  active = false,
}: {
  name: string;
  active?: boolean;
}) => (
  <motion.span
    className={`px-6 py-2 rounded-full text-lg whitespace-nowrap border ${
      active
        ? "text-blue-500 border-blue-500"
        : "text-gray-800 border-transparent hover:border-gray-300"
    }`}
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: false, amount: 0.5 }}
    transition={{ duration: 0.5 }}
  >
    {name}
  </motion.span>
);

const ProductCard = ({
  image,
  discountImage,
  wishlistImage,
  oldPrice,
  newPrice,
  title,
  ratingImage,
}: {
  image: string;
  discountImage: string;
  wishlistImage: string;
  oldPrice: string;
  newPrice: string;
  title: string;
  ratingImage: string;
}) => (
  <motion.div
    className="relative w-full max-w-xs bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg hover:scale-105 transition-all duration-300"
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: false, amount: 0.5 }}
    transition={{ duration: 0.5 }}
  >
    {/* Top Image with Offer + Wishlist */}
    <div className="relative bg-gray-100 rounded-t-xl h-64 flex items-center justify-center">
      <img
        src={image}
        alt={title}
        className="w-[226px] h-[196px] object-cover"
      />
      <motion.span
  className="absolute top-3 left-3 text-sm bg-blue-500 text-white px-3 py-1 rounded"
  animate={{ y: [0, -8, 0] }}      // Move up by 8px then back down
  transition={{
    duration: 2,
    repeat: Infinity,
    repeatType: "loop",
    ease: "easeInOut",
  }}
>
  خصم 30%
</motion.span>
      <img
        src={wishlistImage}
        alt="wishlist"
        className="absolute top-3 start-3 w-8 h-8"
      />
    </div>

    {/* Price + Title */}
    <div className="p-4">
      <div className="flex justify-between items-center text-sm text-gray-500 mb-2">
        <span className="line-through">{oldPrice}</span>
        <span className="text-blue-500 font-bold text-lg">{newPrice}</span>
      </div>
      <h3 className="text-center text-gray-900 font-semibold text-base">
        {title}
      </h3>

      {/* Rating */}
      <div className="flex items-center justify-center mt-2 gap-2 text-xs text-gray-600">
        <span>(22)</span>
<motion.div
  className="flex gap-1 items-center"
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ delay: 0.6, duration: 0.6 }}
>
{[...Array(5)].map((_, i) => (
  <motion.div
    key={i}
    animate={{ scale: [1, 1.25, 1] }}
    transition={{
      duration: 2,
      repeat: Infinity,
      repeatType: "loop",
      delay: i * 0.2, // stagger start for each star
      ease: "easeInOut",
    }}
  >
    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
  </motion.div>
))}
</motion.div>       </div>
    </div>
  </motion.div>
);

function Products() {
  const { t } = useTranslation("homepage");

  return (
    <div className="w-full px-4 max-w-screen-xl mx-auto py-16">
      {/* Header */}
      <motion.div
        className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.5 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-start">
          <p className="text-[#62a0f6] text-sm font-medium mb-1">
            المنتجات الطبية
          </p>
          <h2 className="text-2xl font-semibold text-gray-900">
            تسوق الان من أحدث <span className="text-[#62a0f6]">منتجاتنا</span>{" "}
            الطبية
          </h2>
        </div>
        <motion.button
         whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="flex items-center gap-2 text-[#143087] border border-[#143087] px-4 py-2 rounded">
                    جميع المنتجات
          <ArrowLeft className="w-6 h-6 text-[#143087]" />
          
        </motion.button>
      </motion.div>

      {/* Categories */}
      <motion.div
        className="flex flex-wrap gap-4 mb-10 overflow-x-auto"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.3 }}
        transition={{ staggerChildren: 0.15 }}
        variants={{
          hidden: {},
          visible: {},
        }}
      >
        {[
          "أحذية طبية",
          "أقمشة جراحية",
          "سراير طبية",
          "اكسسورات طبي",
        ].map((cat, idx) => (
          <CategoryTag key={idx} name={cat} active={idx === 0} />
        ))}
      </motion.div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {[1, 2].map((_, i) => (
          <ProductCard
            key={i}
            image="/assets/images/homehellers/modern-white-office-chair-with-chrome-accents1.svg"
            discountImage=""
            wishlistImage="/assets/images/homehellers/solar_heart-line-duotone.svg"
            oldPrice="2250 ر.س"
            newPrice="150 ر.س"
            title="كرسي طبي لاصابات عضلية"
            ratingImage="https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-05/b20e670d-e7c4-4683-8a9e-3ffbf3eda321.png"
          />
        ))}
      </div>

      {/* Pagination Dots */}
      <motion.div
        className="flex gap-3 mt-12 justify-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.5 }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-2.5 h-2.5 bg-[#cee2fc] rounded-full" />
        <div className="w-2.5 h-2.5 bg-[#cee2fc] rounded-full" />
        <div
          className="w-2.5 h-2.5 rounded-full bg-[url('https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-05/axec0AGszx.png')] bg-cover bg-no-repeat"
          aria-hidden="true"
        />
      </motion.div>
    </div>
  );
}

export default Products;
