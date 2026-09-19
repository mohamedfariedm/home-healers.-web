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
  const isRTL = i18n.dir() === "rtl";

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  // Close drawer when resizing to desktop
  useEffect(() => {
    const onResize = () => {
      if (window.matchMedia("(min-width: 1024px)").matches) setOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const handleLinkClick = () => setOpen(false);

  return (
    <>
      <div className="flex shrink-0 items-center justify-center gap-2 sm:gap-3">
        <div className="relative flex shrink-0 items-center gap-2 sm:gap-3 lg:gap-2 xl:gap-3">
          {/* Desktop CTAs */}
          <div className="hidden items-center gap-2 lg:flex xl:gap-2.5">
            <Link
              className="transition-transform duration-300 hover:scale-[1.03]"
              href={`${locale === "ar" ? "" : "/en"}/booking`}
              onClick={handleLinkClick}
            >
              <div className="flex h-10 items-center justify-center gap-1.5 rounded-xl bg-[#62a0f6] px-3 py-2 shadow-[0_8px_18px_rgba(98,160,246,0.28)] xl:h-11 xl:gap-2 xl:px-4">
                <span className="whitespace-nowrap text-xs font-semibold leading-5 text-white xl:text-sm">
                  {t("cta.book_consultation")}
                </span>
                <ArrowLeft
                  className={clsx(
                    "h-3.5 w-3.5 shrink-0 text-white xl:h-4 xl:w-4",
                    !isRTL && "rotate-180"
                  )}
                />
              </div>
            </Link>

            <Link
              className="transition-transform duration-300 hover:scale-[1.03]"
              href={`${locale === "ar" ? "" : "/en"}/doctors-apply`}
              onClick={handleLinkClick}
            >
              <div className="flex h-10 items-center justify-center gap-1.5 rounded-xl bg-[#143087] px-3 py-2 shadow-[0_8px_18px_rgba(20,48,135,0.22)] xl:h-11 xl:gap-2 xl:px-4">
                <span className="whitespace-nowrap text-xs font-semibold leading-5 text-white xl:text-sm">
                  {t("cta.doctor_registration")}
                </span>
                <ArrowLeft
                  className={clsx(
                    "h-3.5 w-3.5 shrink-0 text-white xl:h-4 xl:w-4",
                    !isRTL && "rotate-180"
                  )}
                />
              </div>
            </Link>
          </div>

          <LanguageChanger />
        </div>

        {/* Burger — phones & tablets */}
        <div className="relative z-50 flex items-center justify-center lg:hidden">
          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#d7e4f8] bg-white text-2xl text-[#143087] shadow-sm"
            onClick={() => setOpen((prev) => !prev)}
            aria-expanded={open}
            aria-label={open ? t("a11y.close_menu") : t("a11y.open_menu")}
          >
            {open ? <IoClose /> : <IoMenu />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={menuRef}
            initial={{ x: isRTL ? "-100%" : "100%" }}
            animate={{ x: 0 }}
            exit={{ x: isRTL ? "-100%" : "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className={clsx(
              "fixed inset-y-0 z-40 h-dvh w-full max-w-md overflow-y-auto bg-white/95 p-6 pt-24 shadow-2xl backdrop-blur-xl sm:max-w-sm",
              isRTL ? "left-0" : "right-0"
            )}
          >
            <div className="flex flex-col items-stretch gap-6">
              <MenuItemsDesktop
                locale={locale}
                onLinkClick={handleLinkClick}
                className="!flex-col !items-stretch gap-1 [&_a]:h-12 [&_a]:justify-start [&_a]:rounded-2xl [&_a]:px-4 [&_span]:text-base"
              />

              <div className="mt-2 flex w-full flex-col gap-3">
                <Link
                  className="w-full transition-transform duration-300 hover:scale-[1.02]"
                  href={`${locale === "ar" ? "" : "/en"}/booking`}
                  onClick={handleLinkClick}
                >
                  <div className="flex h-12 w-full items-center justify-between gap-3 rounded-2xl bg-[#62a0f6] px-4 py-2 shadow-[0_10px_24px_rgba(98,160,246,0.28)]">
                    <span className="text-sm font-semibold leading-5 text-white">
                      {t("cta.book_consultation")}
                    </span>
                    <ArrowLeft
                      className={clsx(
                        "h-4 w-4 shrink-0 text-white",
                        !isRTL && "rotate-180"
                      )}
                    />
                  </div>
                </Link>

                <Link
                  className="w-full transition-transform duration-300 hover:scale-[1.02]"
                  href={`${locale === "ar" ? "" : "/en"}/doctors-apply`}
                  onClick={handleLinkClick}
                >
                  <div className="flex h-12 w-full items-center justify-between gap-3 rounded-2xl bg-[#143087] px-4 py-2 shadow-[0_10px_24px_rgba(20,48,135,0.22)]">
                    <span className="text-sm font-semibold leading-5 text-white">
                      {t("cta.doctor_registration")}
                    </span>
                    <ArrowLeft
                      className={clsx(
                        "h-4 w-4 shrink-0 text-white",
                        !isRTL && "rotate-180"
                      )}
                    />
                  </div>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.button
            type="button"
            aria-label={t("a11y.close_menu")}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-30 bg-[#0b1638]/40 backdrop-blur-sm lg:hidden"
            onClick={() => setOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

export default MobileMenu;
