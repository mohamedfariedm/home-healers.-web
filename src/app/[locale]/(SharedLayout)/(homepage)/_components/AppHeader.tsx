import React from "react";

const AppHeader: React.FC = () => {
  return (
    <div className="flex flex-col gap-4 items-start w-full">
      <div className="flex justify-center items-center">
        <span className="  text-base font-medium text-[#1e1e1e] whitespace-nowrap">
          حمل التطبيق
        </span>
      </div>

      <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold text-right   leading-tight">
        <span className="text-[#1e1e1e]">تطبيق </span>
        <span className="text-[#62a0f6]">هوم هيليرز</span>
        <span className="text-[#1e1e1e]"> متاح الان علي المتجر</span>
      </h1>
    </div>
  );
};

export default AppHeader;
