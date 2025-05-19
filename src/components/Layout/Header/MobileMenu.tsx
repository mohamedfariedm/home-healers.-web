"use client";

import { useState, useEffect, useRef } from "react";
import { IoMenu, IoClose } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";
import LanguageChanger from "../LanguageChanger";
import MenuItemsDesktop from "./MenuItemsDesktop";

function MobileMenu({ locale }: { locale: string }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener("mousedown", handler);
    }
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <>
      <div className="flex justify-center items-center gap-[16px]">
        {/* Action buttons and language changer */}
        <div className="flex xl:w-[387px] gap-[16px] items-center shrink-0 flex-wrap relative">
          <div className="flex xl:w-[315px] gap-[16px] items-center shrink-0 flex-wrap relative">
            <div className="flex w-[41px] gap-[20px] items-center shrink-0 flex-wrap relative z-[17]">
              <div className="w-[41px] h-[43px] shrink-0 relative z-[18]">
                <div className="flex w-[20px] h-[20px] pt-[2px] pr-[5px] pb-[2px] pl-[5px] flex-col gap-[10px] justify-center items-center flex-wrap bg-[#62a0f6] rounded-[10px] relative z-[21]">
                  <span className="h-[16px] shrink-0  text-[12px] font-semibold leading-[16px] text-[#fff]">
                    0
                  </span>
                </div>
                <div className="w-[32px] h-[32px] relative overflow-hidden z-[19] mt-[-9px] ml-[9px]">
                  <div className="w-[25.333px] h-[26.667px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-08/nXNCPQRYqQ.png)] bg-[length:100%_100%] bg-no-repeat relative z-20 mt-[2.667px] ml-[3.333px]" />
                </div>
              </div>
            </div>
            <div className="hidden xl:flex w-[258px] gap-[12px] items-center shrink-0 flex-wrap relative z-[8]">
              <div className="flex w-[126px] h-[40px] px-[8px] py-[9px] gap-[10px] justify-center items-center bg-[#62a0f6] rounded-[8px] z-[13]">
                <span className="text-white text-[14px] font-medium leading-[20px] ">
                  احجز استشارة
                </span>
                <div className="w-[16px] h-[16px] relative z-[14]">
                  <div className="w-[4px] h-[8px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-08/HWSfSuULfT.png)] bg-contain bg-no-repeat relative z-[15] mt-[4px] ml-[6px]" />
                </div>
              </div>
              <div className="flex w-[120px] h-[40px] px-[8px] py-[9px] gap-[10px] justify-center items-center bg-[#143087] rounded-[8px] z-[9]">
                <span className="text-white text-[14px] font-medium leading-[20px] ">
                  احجز جلستك
                </span>
                <div className="w-[16px] h-[16px] relative z-10">
                  <div className="w-[4px] h-[8px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-08/TAFiOHwPN2.png)] bg-cover bg-no-repeat relative z-[11] mt-[4px] ml-[6px]" />
                </div>
              </div>
            </div>
          </div>
          <LanguageChanger />
        </div>

        {/* Burger Button */}
        <div className="md:hidden flex justify-center items-center z-50">
          <button
            className="text-3xl text-[#143087]"
            onClick={() => setOpen((prev) => !prev)}
          >
            {open ? <IoClose /> : <IoMenu />}
          </button>
        </div>
      </div>

      {/* Animated Mobile Menu */}
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
                onLinkClick={() => setOpen(false)}
                className="flex-col items-end"
              />
              {/* <LanguageChanger /> */}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default MobileMenu;
