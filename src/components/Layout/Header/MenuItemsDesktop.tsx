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

  const menuItems = [
    { label: t("home"), href: "/" },
    { label: t("about"), href: "/about" },
    { label: t("specialties"), href: "/categories" },
    { label: t("offers"), href: "/offers" },
    { label: t("blogs"), href: "/blog" },
    { label: t("contact"), href: "/contact" },
  ];

  return (
    <nav
      className={cn(
        "relative z-[23] flex w-full flex-col items-end gap-2 lg:w-auto lg:flex-row lg:flex-nowrap lg:items-center lg:justify-center lg:gap-0.5 xl:gap-2 2xl:gap-4",
        className
      )}
    >
      {menuItems.map((item, index) => {
        const normalized = pathname.replace(/^\/(ar|en)/, "/") || "/";
        const isActive =
          item.href === "/"
            ? normalized === "/"
            : normalized === item.href ||
              normalized.startsWith(`${item.href}/`);

        return (
          <Link
            key={index}
            href={`${locale === "ar" ? "" : "/en"}${item.href}`}
            onClick={onLinkClick}
            className={cn(
              "relative flex h-10 shrink-0 items-center justify-center rounded-full px-2 py-2 transition-colors duration-200 hover:bg-[#eff6fe] lg:h-10 xl:h-11 xl:px-3",
              isActive && "bg-[#eff6fe]"
            )}
          >
            <span
              className={cn(
                "whitespace-nowrap text-sm font-semibold leading-6 lg:text-[13px] xl:text-sm rtl:lg:text-[14px] rtl:xl:text-base",
                isActive ? "text-[#62a0f6]" : "text-[#1e1e1e]"
              )}
            >
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
