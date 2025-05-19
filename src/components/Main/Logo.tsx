"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

export default function Logo() {
  const pathname = usePathname();

  return (
    <Link href={pathname.startsWith("/en") ? "/en" : "/ar"}>
      <div
        className={`w-[129px] h-[55px] bg-cover bg-no-repeat absolute top-0 rtl:start-0 ltr:end-0 overflow-hidden z-[7] ${
          pathname === "/ar" || pathname === "/en"
            ? "bg-[url('/assets/images/logo.svg')]"
            : "bg-[url('/assets/images/logo2.svg')]"
        }`}
      />
    </Link>
  );
}
