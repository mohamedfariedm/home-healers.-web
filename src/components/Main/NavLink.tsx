"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface NavLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  style?: any;
  onClick?: () => void;
}

export default function NavLink({ href, children, className, style, onClick }: NavLinkProps) {
  const pathname = usePathname();

  // Normalize path by removing "/ar" or "/en" for comparison
  const normalizedHref = href.replace(/^\/(ar|en)/, "") || "/"; // ✅ Ensure home is always "/"
  const normalizedPathname = pathname.replace(/^\/(ar|en)/, "") || "/";

  // ✅ Fix active state for home page
  const isActive = normalizedHref === normalizedPathname || (normalizedHref === "/" && normalizedPathname === "");


  return (
    <Link
      onClick={onClick}
      href={href}
      className={cn(
        "relative",
        isActive ? "font-semibold text-[#f8992f] bukra-semi-bold" : "text-white",
        className
      )}
      style={style}
    >
      {children}
    </Link>
  );
}
