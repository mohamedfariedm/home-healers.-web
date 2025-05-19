"use client";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function MenuItemsDesktop({
  className,
  locale = "ar",
  closeMenu, // ✅ Added closeMenu function to close on click
}: {
  className?: string;
  locale?: string;
  closeMenu?: () => void;
}) {
  const { t } = useTranslation("expo");

  const menuItems = [
    { label: t("menu.home"), href: "/" },
    { label: t("menu.about"), href: "#about" },
    { label: t("menu.products"), href: "#products" },
    { label: t("menu.events"), href: "#events" },
    { label: t("menu.partners"), href: "#partners" },
  ];

  const [activeSection, setActiveSection] = useState<string>("");

  useEffect(() => {
    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(`#${entry.target.id}`);
        }
      });
    };

    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.5,
    };

    const observer = new IntersectionObserver(handleIntersect, observerOptions);

    menuItems.forEach((item) => {
      const id = item.href.replace("#", "");
      const section = document.getElementById(id);
      if (section) {
        observer.observe(section);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [menuItems]);

  const handleClick = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    const id = href.replace("#", "");
    const section = document.getElementById(id);
    if (section) {
      const sectionTop = section.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: sectionTop - 100, behavior: "smooth" });
    }
    closeMenu?.(); // ✅ Close menu after clicking
  };

  return (
    <div className={`flex flex-col md:flex-row ltr:gap-[10px] rtl:gap-[32px] items-center shrink-0 flex-nowrap relative z-[6] ${className}`}>
      {menuItems.map((item, index) => (
        item.href.includes("#") ? (
          <a
            key={index}
            href={item.href}
            onClick={(e) => handleClick(e, item.href)}
            className="h-[29px] basis-auto text-[16px] font-medium leading-[29px] relative text-left whitespace-nowrap"
          >
            {item.label}
          </a>
        ) : (
          <a
            key={index}
            href={item.href}
            className="h-[29px] basis-auto text-[16px] font-medium leading-[29px] relative text-left whitespace-nowrap"
            onClick={closeMenu} // ✅ Close menu when clicking a link
          >
            {item.label}
          </a>
        )
      ))}
    </div>
  );
}
