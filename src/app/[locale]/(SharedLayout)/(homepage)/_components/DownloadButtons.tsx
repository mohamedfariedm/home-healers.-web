import React from "react";

const DownloadButtons= ({locale}:{locale:string}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-center justify-start w-full mt-6">
      <DownloadButton
      locale={locale}
        store="App Store"
        icon="/assets/images/homepage/download-app-store.svg"
      />

      <DownloadButton
            locale={locale}
        store="Google Play"
        icon="/assets/images/homepage/download-google-play.svg"
      />
    </div>
  );
};

type DownloadButtonProps = {
  store: string;
  icon: string;
  locale: string;
};

const DownloadButton: React.FC<DownloadButtonProps> = ({ store, icon,locale }) => {
  return (
    <button className="flex w-full sm:w-[200px] py-4 px-5 gap-4 justify-center items-center bg-[#143087] rounded-2xl border border-[#1e1e1e] transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#62a0f6]">
      <div className="flex gap-4 items-center">
        <div className="flex flex-col gap-1 items-start">
          <span className="  text-xs text-white whitespace-nowrap">
            {locale === "ar" ? "حمل التطبيق" : "Download the App"}
          </span>
          <span className="  text-sm font-semibold text-white whitespace-nowrap">
            {store}
          </span>
        </div>
        <img src={icon} alt={store} className="w-8 h-8" />
      </div>
    </button>
  );
};

export default DownloadButtons;
