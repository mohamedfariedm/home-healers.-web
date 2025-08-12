"use client";

import { useState, useEffect, useRef } from "react";
import { IoMenu, IoClose } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import LanguageChanger from "../LanguageChanger";
import MenuItemsDesktop from "./MenuItemsDesktop";
import { ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";
import clsx from "clsx";

function MobileMenu({ locale }: { locale: string }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { t, i18n } = useTranslation("common");

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const handleLinkClick = () => setOpen(false);
  const isRTL = i18n.dir() === "rtl";

  return (
    <>
      <div className="flex justify-center items-center gap-[16px]">
        {/* Actions + language */}
        <div className="flex xl:w-[387px] gap-[16px] items-center shrink-0 flex-wrap relative">
          <div className="flex xl:w-[315px] gap-[16px] items-center justify-end shrink-0 flex-wrap relative">
            {/* Desktop Buttons */}
            <div className="hidden xl:flex gap-[12px] items-center shrink-0 flex-wrap relative z-[8]">
              {/* Booking CTA */}
              <Link
                className="hover:scale-105 transition-all duration-300"
                href={`/${locale}/booking`}
                onClick={handleLinkClick}
              >
                <div className="flex  h-[40px] px-[8px] py-[9px] gap-[10px] justify-center items-center bg-[#62a0f6] rounded-[8px] z-[13]">
                  <span className="text-white whitespace-nowrap text-[14px] font-medium leading-[20px]">
                    {t("cta.book_consultation")}
                  </span>
                  <ArrowLeft className={clsx("w-[16px] h-[16px] text-white", !isRTL && "rotate-180")} />
                </div>
              </Link>

              {/* Doctor Registration CTA */}
              <Link
                className="hover:scale-105 transition-all duration-300"
                href={`/${locale}/doctors-apply`}
                onClick={handleLinkClick}
              >
                <div className="flex  h-[40px] px-[8px] py-[9px] gap-[10px] justify-center items-center bg-[#143087] rounded-[8px] z-[9]">
                  <span className="text-white whitespace-nowrap text-[14px] font-medium leading-[20px]">
                    {t("cta.doctor_registration")}
                  </span>
                  <ArrowLeft className={clsx("w-[16px] h-[16px] text-white", !isRTL && "rotate-180")} />
                </div>
              </Link>
            </div>
          </div>
          <LanguageChanger />
        </div>

        {/* Burger */}
        <div className="md:hidden flex justify-center items-center z-50">
          <button
            className="text-3xl text-[#143087]"
            onClick={() => setOpen((prev) => !prev)}
            aria-label={open ? t("a11y.close_menu") : t("a11y.open_menu")}
          >
            {open ? <IoClose /> : <IoMenu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            ref={menuRef}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed top-0 right-0 w-full h-screen bg-white z-40 p-6 overflow-y-auto"
          >
            <div className="flex flex-col items-end gap-6">
              <MenuItemsDesktop
                locale={locale}
                onLinkClick={handleLinkClick}
                className="flex-col items-end"
              />

              {/* Mobile Buttons */}
              <div className="flex flex-col w-full gap-[12px] items-center shrink-0 flex-wrap relative z-[8] mt-4">
                {/* Booking */}
                <Link
                  className="hover:scale-105 transition-all duration-300 w-full"
                  href={`/${locale}/booking`}
                  onClick={handleLinkClick}
                >
                  <div className="flex  h-[40px] px-[8px] py-[9px] gap-[80px] justify-center items-center bg-[#62a0f6] rounded-[8px] z-[13]">
                    <span className="text-white text-[14px] whitespace-nowrap font-medium leading-[20px]">
                      {t("cta.book_consultation")}
                    </span>
                    <ArrowLeft className={clsx("w-[16px] h-[16px] text-white", !isRTL && "rotate-180")} />
                  </div>
                </Link>

                {/* Doctor Registration */}
                <Link
                  className="hover:scale-105 transition-all duration-300 w-full"
                  href={`/${locale}/doctors-apply`}
                  onClick={handleLinkClick}
                >
                  <div className="flex w-full h-[40px] px-[8px] py-[9px] gap-[80px] justify-center items-center bg-[#143087] rounded-[8px] z-[9]">
                    <span className="text-white whitespace-nowrap text-[14px] font-medium leading-[20px]">
                      {t("cta.doctor_registration")}
                    </span>
                    <ArrowLeft className={clsx("w-[16px] h-[16px] text-white", !isRTL && "rotate-180")} />
                  </div>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default MobileMenu;
