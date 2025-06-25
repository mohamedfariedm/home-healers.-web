"use client";

import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import SwiperCore from "swiper";
import "swiper/css";

interface DoctorCardProps {
  image: string;
  rating: string;
  name: string;
  specialty: string;
}

const DoctorCard: React.FC<DoctorCardProps> = ({
  image,
  rating,
  name,
  specialty,
}) => {
  return (
    <motion.div
      className="relative w-full h-[500px] max-w-sm mx-auto cursor-pointer"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.5 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <div
        className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[85%] h-[430px] bg-cover bg-no-repeat z-10"
        style={{ backgroundImage: `url(${image})` }}
      />
      <div className="absolute top-[21%] w-full h-[73%] bg-[#eff6fe] rounded-2xl z-0" />
      <div className="absolute bottom-0 w-full bg-[#62a0f6] rounded-b-2xl pt-3 pb-3 px-6 flex flex-col gap-2 justify-center items-center z-20">
        <span className="text-white text-lg font-semibold leading-7 whitespace-nowrap">
          {name}
        </span>
        <span className="text-white text-base font-light leading-8 whitespace-nowrap">
          {specialty}
        </span>
        <div
          className="w-[100px] h-[20px] bg-cover bg-no-repeat"
          style={{ backgroundImage: `url(${rating})` }}
        />
      </div>
    </motion.div>
  );
};

const DoctorsSection: React.FC = () => {
  const doctors = [
    {
      image:
        "https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-18/tbNA23TLR6.png",
      rating:
        "https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-18/dwgAM3Od4N.png",
      name: "دكتور/ أحمد عاطف",
      specialty: "أخصائي علاج طبيعي",
    },
    {
      image:
        "https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-18/RvxhzCn35G.png",
      rating:
        "https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-18/q1oETFEkV4.png",
      name: "دكتور/ أحمد عاطف",
      specialty: "أخصائي علاج طبيعي",
    },
    {
      image:
        "https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-18/RvxhzCn35G.png",
      rating:
        "https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-18/q1oETFEkV4.png",
      name: "دكتور/ أحمد عاطف",
      specialty: "أخصائي علاج طبيعي",
    },
    {
      image:
        "https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-18/21r9mRJf4z.png",
      rating:
        "https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-18/WzpLXiVCY9.png",
      name: "دكتور/ أحمد عاطف",
      specialty: "أخصائي علاج طبيعي",
    },
    {
      image:
        "https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-18/21r9mRJf4z.png",
      rating:
        "https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-18/WzpLXiVCY9.png",
      name: "دكتور/ أحمد عاطف",
      specialty: "أخصائي علاج طبيعي",
    },
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const swiperRef = useRef<SwiperCore>();

  const handleDotClick = (index: number) => {
    swiperRef.current?.slideTo(index);
  };

  return (
    <div className="w-full max-w-screen-xl mx-auto mt-24 px-4 flex flex-col gap-14 items-center">
      {/* Title Section */}
      <div className="flex flex-col items-center text-center gap-3">
        <span className="text-[#62a0f6] text-base font-medium leading-6">
          أفضل أطباء علاج طبيعي
        </span>
        <h2 className="text-[28px] sm:text-[30px] font-semibold leading-10 text-[#1e1e1e]">
          <span>نخبة من أمهر </span>
          <span className="text-[#62a0f6]">أطباء</span>
          <span> العلاج الطبيعي بالمملكة</span>
        </h2>
      </div>

      {/* Swiper Slider */}
      <Swiper
        modules={[Autoplay]}
        spaceBetween={30}
        slidesPerView={1}
        autoplay={{ delay: 2000 }}
        loop
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
        onBeforeInit={(swiper) => {
          swiperRef.current = swiper;
        }}
        breakpoints={{
          640: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1280: { slidesPerView: 3 },
        }}
        className="w-full"
      >
        {doctors.map((doctor, index) => (
          <SwiperSlide key={index}>
            <DoctorCard
              image={doctor.image}
              rating={doctor.rating}
              name={doctor.name}
              specialty={doctor.specialty}
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Pagination Dots */}
      <div className="flex gap-3 mt-1">
        {Array.from({ length: 5 }).map((_, index) => (
          <button
            key={index}
            onClick={() => handleDotClick(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              activeIndex === index ? "bg-[#62a0f6]" : "bg-[#cee2fc]"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default DoctorsSection;
