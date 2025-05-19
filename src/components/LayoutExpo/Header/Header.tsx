import initTranslations from "@/app/i18n";
import LanguageChanger from "../LanguageChanger";
import MenuItemsDesktop from "./MenuItemsDesktop";
import MobileMenu from "./MobileMenu";

async function Header({ locale }: { locale: string }) {
  const { t } = await initTranslations(locale, ["expo"]);

  return (
    <>
    <div className="flex justify-center items-start w-full" >
      <div className="main-container backdrop-filter backdrop-blur-[2px] fixed top-0 z-50 hidden md:flex w-full max-w-[1440px] pt-4 md:pt-[16px] pr-4 md:pr-[100px] pb-4 md:pb-[16px] pl-4 md:pl-[100px] justify-between items-center  mx-auto">
        <div className="w-[242.479px] h-[64px] shrink-0 bg-[url(/assets/images/expologo.svg)] bg-cover bg-no-repeat relative z-[11]" />
        <div className="flex-1 flex items-center  justify-end">
          {/* Desktop Navigation */}
          <div className="flex  me-[40px]">
            <MenuItemsDesktop locale={locale} />
          </div>

          <div className="flex gap-6 items-center">
            <LanguageChanger />
            <a href="#register" className="flex hover:bg-white transition-all duration-500 cursor-pointer rtl:w-[170px] pt-2 pr-6 pb-2 pl-6 flex-col gap-2 justify-center items-center rounded-[41px] border border-solid border-[#f8992f] relative z-[2] pointer">
              <span className="text-[16px] font-medium leading-[29px] text-[#f8992f]">
                {t("header.register")}
              </span>
            </a>
          </div>
        </div>
      </div>

    </div>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        <MobileMenu locale={locale} />
      </div>
    </>
  );
}

export default Header;
