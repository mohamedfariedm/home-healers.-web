"use client";

import React, { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

export default function LanguageChanger() {
  const { i18n } = useTranslation();
  const currentLocale = i18n.language;
  const router = useRouter();
  const currentPathname = usePathname();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const languages = [
    { code: "en", label: "English" },
    { code: "ar", label: "العربية" },
  ];

  // Function to change language
  const handleChange = (newLocale: string) => {
    if (newLocale === currentLocale) return;

    // Save the preferred locale in a cookie
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=${30 * 24 * 60 * 60}`;

    // Adjust the path to include the new locale
    let newPath = currentPathname;
    if (currentPathname.startsWith(`/${currentLocale}`)) {
      newPath = currentPathname.replace(`/${currentLocale}`, `/${newLocale}`);
    } else {
      newPath = `/${newLocale}${currentPathname}`;
    }

    // Change language and navigate to the new path
    i18n.changeLanguage(newLocale);
    router.push(newPath);
  };

  return (
    <div className="relative z-10">
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex w-[75px] pt-[8px] pr-[13px] pb-[8px] pl-[13px] gap-[8px] items-center bg-[rgba(231,240,241,0.2)] rounded-[8px] border-none z-[4] pointer"
      >
        <span className="flex w-[49px] h-[22px] justify-center items-center text-[14px] font-normal leading-[22px] text-[#fff] whitespace-nowrap">
          {currentLocale === "en" ? "English" : "العربية"}
        </span>
      </button>
      {dropdownOpen && (
        <div className="absolute mt-2 bg-white rounded shadow-md z-10">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                handleChange(lang.code);
                setDropdownOpen(false);
              }}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
            >
              {lang.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
