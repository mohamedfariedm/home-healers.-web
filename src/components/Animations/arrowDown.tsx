"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const ArrowDown: React.FC<{
  className?: string;
}> = ({ className}) => {


  return (
    <div className=" flex justify-center items-center">
    <svg
               xmlns="http://www.w3.org/2000/svg"
               className="arrow-down top-arrow absolute transition-all duration-300"
               viewBox="0 0 20 20"
               fill="white"
               aria-hidden="true"
             >
               <path
                 fillRule="evenodd"
                 d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                 clipRule="evenodd"
               />
   
             </svg>
   
             <svg
               xmlns="http://www.w3.org/2000/svg"
               className="arrow-down bottom-arrow absolute transition-all duration-300"
               viewBox="0 0 20 20"
               fill="white"
               aria-hidden="true"
             >
               <path
                 fillRule="evenodd"
                 d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                 clipRule="evenodd"
               />
             </svg>
   
    </div>
  );
};

export const Arrow = React.memo(ArrowDown);
