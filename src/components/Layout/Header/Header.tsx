import initTranslations from "@/app/i18n";
import MenuItemsDesktop from "./MenuItemsDesktop";
import MobileMenu from "./MobileMenu";
import Link from "next/link";

async function Header({ locale }: { locale: string }) {
  await initTranslations(locale, ["common"]);

  return (
    <header className="sticky top-0 z-[1000] mx-auto w-full">
      <div className="rounded-2xl border border-gray-200/60 bg-white/95 px-3  shadow-[0_8px_32px_rgba(16,24,40,0.1)] backdrop-blur-md sm:px-5 sm:py-3 md:px-6">
        <div className="relative z-[100] mx-auto flex w-full max-w-[1280.191px] flex-wrap items-center justify-between xl:justify-center xl:gap-[50px]">
          <Link
            href={`/${locale === "ar" ? "" : "en"}`}
            className="relative z-[38] flex shrink-0 flex-wrap items-center gap-[14.075px] xl:w-[134.191px]"
          >
            <div className="relative z-40 h-[71.814px] w-[40px] shrink-0 bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-08/HmiEst2KoS.png)] bg-[length:100%_100%] bg-no-repeat sm:w-[57.058px]" />
            <div className="relative z-[39] h-[60.301px] w-[45px] shrink-0 bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-08/QdoKKytofo.png)] bg-[length:100%_100%] bg-no-repeat" />
          </Link>
          <div className="hidden md:flex">
            <MenuItemsDesktop locale={locale} />
          </div>
          <MobileMenu locale={locale} />
        </div>
      </div>
    </header>
  );
}

export default Header;
