import initTranslations from "@/app/i18n";
import MenuItemsDesktop from "./MenuItemsDesktop";
import MobileMenu from "./MobileMenu";
import Link from "next/link";

async function Header({ locale }: { locale: string }) {
  await initTranslations(locale, ["common"]);

  return (
    <header className="sticky top-0 z-[1000] w-full">
      <div className="w-full border-b border-gray-200/60 bg-white/95 px-3 py-2 shadow-[0_8px_32px_rgba(16,24,40,0.1)] backdrop-blur-md sm:px-5 sm:py-2.5 md:px-6 lg:px-8">
        <div className="relative z-[100] flex w-full items-center justify-between gap-3 lg:gap-4 xl:gap-6">
          <Link
            href={`/${locale === "ar" ? "" : "en"}`}
            className="relative z-[38] flex shrink-0 items-center gap-2 sm:gap-3"
          >
            <div className="relative z-40 h-10 w-[22px] shrink-0 bg-[url(/assets/images/layout/header-logo-symbol.svg)] bg-[length:100%_100%] bg-no-repeat sm:h-[52px] sm:w-[36px] lg:h-[64px] lg:w-[48px] xl:h-[72px] xl:w-[57px]" />
            <div className="relative z-[39] h-8 w-[32px] shrink-0 bg-[url(/assets/images/layout/header-logo-text.svg)] bg-[length:100%_100%] bg-no-repeat sm:h-[44px] sm:w-[40px] lg:h-[54px] lg:w-[48px] xl:h-[60px] xl:w-[52px]" />
          </Link>

          <div className="hidden min-w-0 flex-1 items-center justify-center lg:flex">
            <MenuItemsDesktop locale={locale} />
          </div>

          <MobileMenu locale={locale} />
        </div>
      </div>
    </header>
  );
}

export default Header;
