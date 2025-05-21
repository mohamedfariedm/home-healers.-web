"use client";
import { motion } from "framer-motion"
import { Star } from "lucide-react";
import React from "react";

const AppRating: React.FC = () => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-center justify-start w-full">
      <div className="flex items-center">
        <img
          src="/assets/images/homehellers/rating.svg"
          alt="User avatars"
          className="w-full max-w-[216px] h-auto"
        />
      </div>
      <div className="flex flex-col gap-2 items-start">
      <div className="flex gap-2 items-center">
          <span className="  text-sm text-[#1e1e1e] text-right whitespace-nowrap">
            4.5/5.0
          </span>
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
    <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
  </motion.div>
))}
</motion.div>  
        </div>
        <span className="  text-sm font-bold text-[#1e1e1e] text-right whitespace-nowrap">
          اكتر من 5000+ مستخدم
        </span>
      </div>      
    </div>
  );
};

export default AppRating;
