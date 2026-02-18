"use client";

import React from "react";

// ── BRAND COLORS ─────────────────────────────────────────────────────────────
const COLORS = {
  primary: "#62a0f6", // Brand Blue
  dark: "#3b82f6",    // Slightly darker for outline/depth
  light: "#93c5fd",   // Lighter for fills
  gold: "#fbbf24",    // Subtle gold accent for the flame/star center (optional)
};

// ── Ornate Lantern (Detailed Fanoos) ─────────────────────────────────────────
function LanternIcon({ size = 32, delay = "0s" }: { size?: number, delay?: string }) {
  return (
    <div style={{ animation: `ramadan-sway 4s ease-in-out infinite ${delay}` }}>
      <svg
        width={size}
        height={size * 2.2}
        viewBox="0 0 40 88"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        style={{ overflow: "visible" }}
      >
        {/* String hanging from top */}
        <line x1="20" y1="-20" x2="20" y2="10" stroke={COLORS.primary} strokeWidth="1.5" />
        
        {/* Top Ring */}
        <circle cx="20" cy="10" r="3" stroke={COLORS.dark} strokeWidth="1.5" fill="none" />

        {/* Dome Cap */}
        <path d="M12 18 C12 14 28 14 28 18 L30 24 H10 L12 18 Z" fill={COLORS.primary} />
        
        {/* Main Body (Hexagonal Prism) */}
        <path d="M10 24 L30 24 L34 40 L28 64 H12 L6 40 L10 24 Z" fill={`${COLORS.primary}20`} stroke={COLORS.primary} strokeWidth="1.5" />
        
        {/* Inner Detail Lines */}
        <line x1="20" y1="24" x2="20" y2="64" stroke={COLORS.primary} strokeWidth="1" opacity="0.5" />
        <line x1="10" y1="24" x2="12" y2="64" stroke={COLORS.primary} strokeWidth="0.5" opacity="0.3" />
        <line x1="30" y1="24" x2="28" y2="64" stroke={COLORS.primary} strokeWidth="0.5" opacity="0.3" />

        {/* Geometric Center Star/Cutout */}
        <path d="M20 38 L22 42 H26 L23 45 L24 49 L20 46 L16 49 L17 45 L14 42 H18 L20 38 Z" fill={COLORS.primary} />

        {/* Bottom Base */}
        <path d="M12 64 L14 70 H26 L28 64 Z" fill={COLORS.primary} />
        
        {/* Tassel */}
        <line x1="20" y1="70" x2="20" y2="82" stroke={COLORS.dark} strokeWidth="1.5" />
        <circle cx="20" cy="84" r="2" fill={COLORS.dark} />
      </svg>
    </div>
  );
}

// ── Crescent Moon with Islamic Pattern ───────────────────────────────────────
function CrescentIcon({ size = 32 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 50 50"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <filter id="moon-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      {/* Outer Glow (Subtle) */}
      <path
        d="M38 9.5 C34 5.5 28.5 4 23 5 C13 7 6 16 8 26 C10 36 19 43 29 41 C34.5 40 39 36 41.5 31.5 C40 33 38 34 36 34.5 C26 36 17 28 18.5 18 C19 14.5 20.5 11.5 23 9 C23 9 38 9.5 38 9.5 Z"
        fill={COLORS.primary}
        opacity="0.1"
        filter="url(#moon-glow)"
      />
      {/* Main Crescent Shape */}
      <path
        d="M36 7.5 C32 3.5 26.5 2 21 3 C11 5 4 14 6 24 C8 34 17 41 27 39 C32.5 38 37 34 39.5 29.5 C38 31 36 32 34 32.5 C24 34 15 26 16.5 16 C17 12.5 18.5 9.5 21 7 C21 7 36 7.5 36 7.5 Z"
        stroke={COLORS.primary}
        strokeWidth="2"
        fill="none"
      />
      {/* Inner Decorative Dots */}
      <circle cx="15" cy="18" r="1" fill={COLORS.primary} opacity="0.6" />
      <circle cx="14" cy="24" r="1.2" fill={COLORS.primary} opacity="0.8" />
      <circle cx="17" cy="30" r="1" fill={COLORS.primary} opacity="0.6" />
      <circle cx="22" cy="34" r="0.8" fill={COLORS.primary} opacity="0.5" />
      
      {/* Accompaniment Star (Rub el Hizb style simplified) */}
      <rect x="34" y="10" width="8" height="8" transform="rotate(45 38 14)" fill={COLORS.primary} opacity="0.8" />
      <rect x="34" y="10" width="8" height="8" fill={COLORS.primary} opacity="0.8" />
      <circle cx="38" cy="14" r="1.5" fill="white" />
    </svg>
  );
}

// ── 8-Pointed Star (Islamic Octagram / Rub el Hizb) ──────────────────────────
function StarIcon({ size = 16, delay = "0s" }: { size?: number, delay?: string }) {
  return (
    <div style={{ animation: `ramadan-twinkle 3s ease-in-out infinite ${delay}` }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M12 2L14.5 9.5H22L16 14.5L18.5 22L12 17L5.5 22L8 14.5L2 9.5H9.5L12 2Z"
          fill={COLORS.primary}
          opacity="0.8"
        />
        <circle cx="12" cy="12" r="2" fill="white" />
      </svg>
    </div>
  );
}

// ── Main Banner Component ────────────────────────────────────────────────────
interface RamadanBannerProps {
  position: "top" | "bottom";
}

export default function RamadanBanner({ position }: RamadanBannerProps) {
  // Styles based on position
  const isTop = position === "top";
  
  // Reduced container height and adjusted positioning to be more subtle
  const containerStyle: React.CSSProperties = {
    width: "100%",
    height: "70px", // Significant reduction from 100px
    position: "relative",
    display: "flex",
    justifyContent: "space-between",
    alignItems: isTop ? "flex-start" : "flex-end",
    pointerEvents: "none",
    overflow: "visible", // Allow hanging bits and glow to extend slightly
    zIndex: 50,
    marginTop: isTop ? "-14px" : "0", 
    marginBottom: isTop ? "0" : "-14px",
    paddingLeft: "1rem",   // Safety padding
    paddingRight: "1rem",
  };

  return (
    <div className="ramadan-banner-container" style={containerStyle}>
      {/* Left Decoration Group */}
      <div className="flex items-start gap-3 opacity-90">
        <LanternIcon size={18} delay="0s" />
        <div className="mt-2">
            <StarIcon size={10} delay="1s" />
        </div>
        <LanternIcon size={25} delay="0.5s" />
        <div className="mt-4">
            <StarIcon size={7} delay="2s" />
        </div>
        <LanternIcon size={16} delay="1.2s" />
      </div>

      {/* Center - kept clear for content visibility */}
       <div className="hidden md:flex items-center justify-center opacity-60 mt-2">
      </div>

      {/* Right Decoration Group */}
      <div className="flex items-start gap-3 opacity-90 flex-row-reverse">
        <LanternIcon size={18} delay="0.2s" />
        <div className="mt-2">
            <StarIcon size={11} delay="1.5s" />
        </div>
        <LanternIcon size={24} delay="0.7s" />
        <div className="mt-3">
             <StarIcon size={8} delay="2.5s" />
        </div>
        <LanternIcon size={16} delay="1s" />
         <div className="mt-1">
            <CrescentIcon size={22} />
        </div>
      </div>
    </div>
  );
}

// ── Horizontal Background Layer (Floating Watermark) ──────────────────────────
export function RamadanBackgroundDecorations() {
  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none overflow-hidden z-[1]">
      {/* Row 1: Top drifting right */}
      <div className="absolute top-[15%] left-0 w-[200%] flex gap-32 opacity-[0.15] animate-[drift_60s_linear_infinite]">
        <LanternIcon size={50} />
        <StarIcon size={20} />
        <CrescentIcon size={60} />
        <StarIcon size={15} />
        <LanternIcon size={40} />
        <StarIcon size={25} />
        <CrescentIcon size={50} />
        {/* Repeat for seamless loop */}
        <LanternIcon size={50} />
        <StarIcon size={20} />
        <CrescentIcon size={60} />
        <LanternIcon size={50} />
        <StarIcon size={20} />
        <CrescentIcon size={60} />
        <StarIcon size={15} />
      </div>

      {/* Row 2: Middle drifting left */}
      <div className="absolute top-[45%] left-0 w-[200%] flex gap-40 opacity-[0.15] animate-[drift_70s_linear_infinite_reverse]">
        <StarIcon size={30} />
        <LanternIcon size={60} />
        <StarIcon size={15} />
        <CrescentIcon size={40} />
        <StarIcon size={25} />
        <LanternIcon size={55} />
        {/* Repeat */}
        <StarIcon size={30} />
        <LanternIcon size={60} />
        <StarIcon size={30} />
 
      </div>

      {/* Row 3: Bottom drifting right */}
      <div className="absolute top-[75%] left-0 w-[200%] flex gap-36 opacity-[0.15] animate-[drift_65s_linear_infinite]">
        <CrescentIcon size={55} />
        <StarIcon size={20} />
        <LanternIcon size={45} />
        <StarIcon size={18} />
        <CrescentIcon size={50} />
        <StarIcon size={22} />
        {/* Repeat */}
        <CrescentIcon size={55} />
        <StarIcon size={20} />
        <CrescentIcon size={55} />
        <StarIcon size={20} />
      </div>
    </div>
  );
}
