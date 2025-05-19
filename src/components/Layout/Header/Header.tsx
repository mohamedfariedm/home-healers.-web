import initTranslations from "@/app/i18n";
import Container from "../Container";
import LanguageChanger from "../LanguageChanger";
import MenuItemsDesktop from "./MenuItemsDesktop";
import { Logo } from "@/components/Main";
import MobileMenu from "./MobileMenu";
import Link from "next/link";

async function Header({ locale }: { locale: string }) {
  const { t } = await initTranslations(locale, ["common"]);

  return (
    <>
      <div className=" w-full xl:max-w-[1440px]  relative mx-auto my-0 px-4">
        <div className="w-full  bg-[#fff] absolute top-px left-0 shadow-[0_1px_2px_0_rgba(16,24,40,0.06)]" />
        <div className="flex w-full xl:max-w-[1280.191px]  xl:gap-[50px] justify-between xl:justify-center items-center flex-wrap relative mx-auto mt-[13px] z-[100]">
          <div className="flex xl:w-[134.191px] gap-[14.075px] items-center shrink-0 flex-wrap relative z-[38]">
            <div className="w-[40px] sm:w-[57.058px] h-[71.814px] shrink-0 bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-08/HmiEst2KoS.png)] bg-[length:100%_100%] bg-no-repeat relative z-40" />
            <div className="w-[45px] h-[60.301px] shrink-0 bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-08/QdoKKytofo.png)] bg-[length:100%_100%] bg-no-repeat relative z-[39]" />
          </div>
          <div className="hidden md:flex">
            <MenuItemsDesktop locale={locale} />
          </div>
          <MobileMenu locale={locale} />
        </div>
      </div>
    </>
  );
}

export default Header;
