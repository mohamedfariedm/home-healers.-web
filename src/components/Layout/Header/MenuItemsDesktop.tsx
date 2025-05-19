"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

export default function MenuItemsDesktop({
  locale = "en",
  className,
  onLinkClick,
}: {
  locale?: string;
  className?: string;
  onLinkClick?: () => void;
}) {
  const pathname = usePathname();
  const { t } = useTranslation("common");
  console.log(pathname);

  const menuItems = [
    { label: t("home"), href: "/", width: "w-[70px]" },
    { label: t("about"), href: "/about", width: "w-[118px]" },
    { label: t("services"), href: "/services", width: "w-[64px]" },
    { label: t("products"), href: "/products", width: "w-[121px]" },
    { label: t("blogs"), href: "/blogs", width: "w-[67px]" },
    { label: t("contact"), href: "/contact", width: "w-[99px]" },
  ];

  return (
    <div
      className={cn(
        "flex w-full md:w-[659px] flex-col gap-[8px] items-end shrink-0 ltr:flex-nowrap rtl:flex-wrap relative z-[23]",
        className
      )}
    >
      <div className="flex  flex-col md:flex-row  gap-[24px] items-center self-stretch shrink-0 ltr:flex-nowrap rtl:flex-wrap relative z-[24]">
        {menuItems.map((item, index) => {
          const isActive =
            pathname.replace(/^\/(ar|en)/, "/") == `${item.href}`;

          return (
            <Link
              key={index}
              href={`/${locale}${item.href}`}
              onClick={onLinkClick}
              className={cn(
                "flex h-[48px] pt-[8px] pr-[4px] pb-[8px] pl-[4px] gap-[10px] justify-center items-center shrink-0 ltr:flex-nowrap rtl:flex-wrap relative",
                locale == "ar" ? item.width : "",
                `z-[${35 - index}]`
              )}
            >
              <span
                className={cn(
                  "h-[24px] shrink-0 basis-auto ltr:text-[14px]  rtl:text-[16px] font-semibold leading-[24px] relative text-left whitespace-nowrap",
                  isActive ? "text-[#62a0f6]" : "text-[#1e1e1e]",
                  `z-[${36 - index}]`
                )}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
