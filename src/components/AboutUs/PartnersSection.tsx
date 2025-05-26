"use client";

import React from 'react';

interface PartnerLogoProps {
  image: string;
}

const PartnerLogo: React.FC<PartnerLogoProps> = ({ image }) => {
  return (
    <div
      className="w-[180px] h-[180px] sm:w-[200px] sm:h-[200px] lg:w-[230px] lg:h-[230px] bg-cover bg-no-repeat transition-transform duration-300 hover:scale-105"
      style={{ backgroundImage: `url(${image})` }}
    />
  );
};

interface NavigationArrowProps {
  icon: string;
  direction: 'next' | 'prev';
  onClick: () => void;
}

const NavigationArrow: React.FC<NavigationArrowProps> = ({ icon, direction, onClick }) => {
  return (
    <div
      className="w-14 h-14 bg-cover bg-no-repeat cursor-pointer transition-transform duration-300 hover:scale-110"
      style={{ backgroundImage: `url(${icon})` }}
      onClick={onClick}
      aria-label={direction === 'next' ? 'Next' : 'Previous'}
    />
  );
};

const PartnersSection: React.FC = () => {
  const partnerLogos = [
    "https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-18/KCcDpoQzXv.png",
    "https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-18/LkbvfH3ryJ.png",
  ];

  const navigationIcons = [
    "https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-18/GoViyKzQCs.png",
    "https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-18/qBKs1Atn9m.png",
  ];

  const handlePrev = () => {
    console.log('Previous partners');
  };

  const handleNext = () => {
    console.log('Next partners');
  };

  return (
    <div className="w-full max-w-screen-xl mx-auto mt-24 px-4 flex flex-col gap-14 items-center">
      {/* Heading */}
      <div className="flex flex-col items-center text-center gap-3">
        <span className="text-[#62a0f6] text-base font-medium leading-6">
          مع من نعمل ؟
        </span>
        <h2 className="text-[28px] sm:text-[30px] font-semibold leading-10 text-[#1e1e1e]">
          شركاؤنا في رحلة النجاح
        </h2>
      </div>

      {/* Partner Logos Grid */}
      <div className="flex flex-wrap justify-center gap-8 w-full">
        {partnerLogos.map((logo, i) => (
          <PartnerLogo key={i} image={logo} />
        ))}
      </div>

      {/* Navigation Arrows */}
      <div className="flex gap-10 mt-6">
        <NavigationArrow
          icon={navigationIcons[0]}
          direction="prev"
          onClick={handlePrev}
        />
        <NavigationArrow
          icon={navigationIcons[1]}
          direction="next"
          onClick={handleNext}
        />
      </div>
    </div>
  );
};

export default PartnersSection;