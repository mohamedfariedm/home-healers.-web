import { TFunction } from "i18next";

const LeftPart = ({ t }: { t: TFunction }) => {
  return (
    <div className="main-container flex flex-col justify-center items-center xl:flex-row xl:w-[600px] xl:h-[159px] mb-10 gap-5 relative mx-auto my-0">
      {/* Phone Contact */}
      <div className="flex xl:w-[288px] xl:h-[159px] flex-col gap-[16px] justify-center items-center flex-nowrap">
        <div className="w-[48px] h-[48px] flex justify-center items-center shrink-0 bg-[#f8992f] rounded-full relative overflow-hidden z-[8]">
          <div
            className="w-[24px] h-[24px] relative z-[9] bg-cover bg-no-repeat"
            style={{ backgroundImage: `url(/assets/images/contact/call.svg)` }}
          />
        </div>
        <div className="flex w-[288px] flex-col gap-[8px] items-start shrink-0 flex-nowrap relative z-[11]">
          <span className="h-[29px] self-stretch shrink-0 basis-auto text-[16px] font-semibold leading-[29px] text-[#fff] tracking-[0.32px] relative text-center whitespace-nowrap z-[12]">
            {t("contact.phone")}
          </span>
          <span className="flex w-[288px] h-[58px] justify-center items-start shrink-0 text-[16px] font-normal leading-[29.12px] text-[#dbdbdb] tracking-[0.32px] relative text-center z-[13]">
            {t("contact.working_hours")}
          </span>
        </div>
      </div>

      {/* Email Contact */}
      <div className="flex xl:w-[288px] xl:h-[159px] flex-col gap-[16px] justify-center items-center flex-nowrap">
        <div className="w-[48px] flex justify-center items-center h-[48px] shrink-0 bg-[#f8992f] rounded-full relative overflow-hidden z-[1]">
          <div
            className="w-[24px] h-[24px] relative z-[2] bg-cover bg-no-repeat"
            style={{ backgroundImage: `url(/assets/images/contact/mail.svg)` }}
          />
        </div>
        <div className="flex w-[288px] flex-col gap-[8px] items-start shrink-0 flex-nowrap relative z-[4]">
          <span className="h-[29px] self-stretch shrink-0 basis-auto text-[16px] font-semibold leading-[29px] text-[#fff] tracking-[0.32px] relative text-center whitespace-nowrap z-[5]">
            {t("contact.email")}
          </span>
          <div className="w-[288px] shrink-0 text-[16px] font-normal leading-[29.12px] tracking-[0.32px] relative text-center z-[6]">
            <span className="text-[16px] font-normal leading-[29.12px] text-[#dbdbdb] tracking-[0.32px] relative text-center">
              {t("contact.response_time")}
            </span>
            <span className="text-[16px] font-normal leading-[29.12px] text-[#dbdbdb] tracking-[0.32px] relative text-center">
              {t("contact.support_message")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeftPart;
