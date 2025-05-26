"use client";

import React from "react";
import { motion } from "framer-motion";

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

interface PaginationDotsProps {
  count: number;
  active: number;
}

const PaginationDots: React.FC<PaginationDotsProps> = ({ count, active }) => {
  return (
    <div className="flex gap-4 mt-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`w-2.5 h-2.5 rounded-full ${
            i === active
              ? "bg-[url('https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-18/Mpx5xpAzU0.png')] bg-cover bg-no-repeat"
              : "bg-[#cee2fc]"
          }`}
        />
      ))}
    </div>
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
        "https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-18/21r9mRJf4z.png",
      rating:
        "https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-18/WzpLXiVCY9.png",
      name: "دكتور/ أحمد عاطف",
      specialty: "أخصائي علاج طبيعي",
    },
  ];

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

      {/* Doctors Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-10 w-full">
        {doctors.map((doctor, index) => (
          <DoctorCard
            key={index}
            image={doctor.image}
            rating={doctor.rating}
            name={doctor.name}
            specialty={doctor.specialty}
          />
        ))}
      </div>

      {/* Pagination Dots */}
      <PaginationDots count={5} active={2} />
    </div>
  );
};

export default DoctorsSection;
