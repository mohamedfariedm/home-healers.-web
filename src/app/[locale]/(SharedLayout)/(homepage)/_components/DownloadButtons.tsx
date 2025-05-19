import React from "react";

const DownloadButtons: React.FC = () => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-center justify-start w-full mt-6">
      <DownloadButton
        store="App Store"
        icon="https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-12/oJwqjVBUsX.png"
      />

      <DownloadButton
        store="Google Play"
        icon="https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-12/XbpF97k1LW.png"
      />
    </div>
  );
};

type DownloadButtonProps = {
  store: string;
  icon: string;
};

const DownloadButton: React.FC<DownloadButtonProps> = ({ store, icon }) => {
  return (
    <button className="flex w-full sm:w-[200px] py-4 px-5 gap-4 justify-center items-center bg-[#143087] rounded-lg border border-[#1e1e1e] transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#62a0f6]">
      <div className="flex gap-4 items-center">
        <div className="flex flex-col gap-1 items-start">
          <span className="  text-xs text-white whitespace-nowrap">
            حمل التطبيق
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
