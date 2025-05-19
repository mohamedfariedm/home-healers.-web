"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useTranslation } from "react-i18next";

const CategoryTag = ({ name, active = false }: { name: string; active?: boolean }) => (
  <span
    className={`px-6 py-2 rounded-full text-lg whitespace-nowrap border ${
      active
        ? 'text-blue-500 border-blue-500'
        : 'text-gray-800 border-transparent hover:border-gray-300'
    }`}
  >
    {name}
  </span>
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
  <div className="relative w-full max-w-xs bg-white rounded-xl shadow-md overflow-hidden">
    {/* Top Image with Offer + Wishlist */}
    <div className="relative bg-gray-100 rounded-t-xl h-64 flex items-center justify-center">
      <img src={image} alt={title} className="w-[226px] h-[196px] object-cover" />
      <span className="absolute top-3 left-3 text-sm bg-blue-500 text-white px-3 py-1 rounded">خصم 30%</span>
      <img src={wishlistImage} alt="wishlist" className="absolute top-3 start-3 w-8 h-8" />
    </div>

    {/* Price + Title */}
    <div className="p-4">
      <div className="flex justify-between items-center text-sm text-gray-500 mb-2">
        <span className="line-through">{oldPrice}</span>
        <span className="text-blue-500 font-bold text-lg">{newPrice}</span>
      </div>
      <h3 className="text-center text-gray-900 font-semibold text-base">{title}</h3>

      {/* Rating */}
      <div className="flex items-center justify-center mt-2 gap-2 text-xs text-gray-600">
        <span>(22)</span>
        <img src={ratingImage} alt="rating" className="w-24" />
      </div>
    </div>

    {/* Actions */}
    {/* <div className="flex justify-between p-3 border-t border-gray-200">
      <button className="flex items-center gap-2 text-white bg-blue-500 px-4 py-2 rounded">
        <img src="https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-05/fac053e1-11f5-46d7-a82a-b318665e57bd.png" className="w-5 h-5" />
        اشتري الآن
      </button>
      <button className="flex items-center gap-2 text-white bg-[#143087] px-4 py-2 rounded">
        <img src="https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-05/eb25ae75-4768-4ebe-9f08-1dd79a928d7d.png" className="w-5 h-5" />
        أضف للسلة
      </button>
    </div> */}
  </div>
);

function Products({homeData}:any) {
  const { t } = useTranslation("homepage");
  console.log("homeData",homeData)
  const products = [
    {
      title: t("products.items.0.title"),
      description: t("products.items.0.description"),
      image: "/assets/images/products/product.svg",
    },
    {
      title: t("products.items.1.title"),
      description: t("products.items.1.description"),
      image: "/assets/images/products/product.svg",
    },
    {
      title: t("products.items.2.title"),
      description: t("products.items.2.description"),
      image: "/assets/images/products/product.svg",
    },
    {
      title: t("products.items.3.title"),
      description: t("products.items.3.description"),
      image: "/assets/images/products/product.svg",
    },
  ];

  return (
<div  className="w-full px-4 max-w-screen-xl mx-auto py-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10">
      <div className="text-start">
          <p className="text-[#62a0f6] text-sm font-medium mb-1">المنتجات الطبية</p>
          <h2 className="text-2xl font-semibold text-gray-900">
            تسوق الان من أحدث <span className="text-[#62a0f6]">منتجاتنا</span> الطبية
          </h2>
        </div>
        <button className="flex items-center gap-2 text-[#143087] border border-[#143087] px-4 py-2 rounded">
          <img src="https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-05/5RwzHS55QU.png" className="w-4 h-6" />
          جميع المنتجات
        </button>
        
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-4 mb-10 overflow-x-auto">
        {[
          'أحذية طبية',
          'أقمشة جراحية',
          'سراير طبية',
          'اكسسورات طبي',
        ].map((cat, idx) => (
          <CategoryTag key={idx} name={cat} active={idx === 0} />
        ))}
      </div>

      {/* Products */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {[1, 2].map((_, i) => (
          <ProductCard
            key={i}
            image="https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-05/O95vKqQBcq.png"
            discountImage=""
            wishlistImage="https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-05/9e30f7eb-cff8-459c-b5f2-19b72b2bd91f.png"
            oldPrice="2250 ر.س"
            newPrice="150 ر.س"
            title="كرسي طبي لاصابات عضلية"
            ratingImage="https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-05/b20e670d-e7c4-4683-8a9e-3ffbf3eda321.png"
          />
        ))}
      </div>

      {/* Pagination Dots */}
      <div className="flex gap-3 mt-12 justify-center">
        <div className="w-2.5 h-2.5 bg-[#cee2fc] rounded-full" />
        <div className="w-2.5 h-2.5 bg-[#cee2fc] rounded-full" />
        <div
          className="w-2.5 h-2.5 rounded-full bg-[url('https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-05/axec0AGszx.png')] bg-cover bg-no-repeat"
        />
      </div>
    </div>
  );
}

export default Products;
