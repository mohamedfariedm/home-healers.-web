import React from "react";

const APP_STORE_URL =
  "https://apps.apple.com/sa/app/home-healers/id123456789";
const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=com.homehealers.app";

const DownloadButtons = ({ locale }: { locale: string }) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-center justify-start w-full mt-6">
      <DownloadButton
        locale={locale}
        store="App Store"
        icon="/assets/images/homepage/download-app-store.svg"
        href={APP_STORE_URL}
      />
      <DownloadButton
        locale={locale}
        store="Google Play"
        icon="/assets/images/homepage/download-google-play.svg"
        href={PLAY_STORE_URL}
      />
    </div>
  );
};

type DownloadButtonProps = {
  store: string;
  icon: string;
  locale: string;
  href: string;
};

const DownloadButton: React.FC<DownloadButtonProps> = ({
  store,
  icon,
  locale,
  href,
}) => {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      data-gtm-event="download_app_click"
      data-gtm-location="homepage_download_app"
      data-gtm-label={store}
      className="flex w-full sm:w-[200px] py-4 px-5 gap-4 justify-center items-center bg-[#143087] rounded-2xl border border-[#1e1e1e] transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#62a0f6]"
    >
      <div className="flex gap-4 items-center">
        <div className="flex flex-col gap-1 items-start">
          <span className="text-xs text-white whitespace-nowrap">
            {locale === "ar" ? "حمل التطبيق" : "Download the App"}
          </span>
          <span className="text-sm font-semibold text-white whitespace-nowrap">
            {store}
          </span>
        </div>
        <img src={icon} alt={store} className="w-8 h-8" />
      </div>
    </a>
  );
};

export default DownloadButtons;
