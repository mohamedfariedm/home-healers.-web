import { TFunction } from "i18next";

function Testimonials({ t,homeData,ClientReview }: { t: TFunction,homeData:any,ClientReview:any }) {
  return (
    <div className="main-container flex w-full xl:w-[1440px] flex-col gap-[48px] items-center flex-nowrap relative mx-auto my-0">
      <div className="flex w-full xl:w-[712px] flex-col gap-[16px] justify-center items-center shrink-0 flex-nowrap relative">
        <span className="flex w-full xl:w-[98px] xl:h-[36px] justify-center items-start shrink-0 basis-auto text-[20px] font-bold leading-[36px] text-[#f8992f] relative text-start whitespace-nowrap z-[1]">
          {homeData?.data?.sections[4]?.Posts[0].title}
        </span>
        <span className="flex w-full xl:w-[712px] xl:h-[58px] justify-center items-start shrink-0 text-[16px] font-medium leading-[29.12px] text-[#dbdbdb] relative text-center z-[2]">
          {homeData?.data?.sections[4]?.Posts[0].description}
        </span>
      </div>
      <div className="flex w-full xl:w-[1114px] gap-[32px] items-center justify-center shrink-0 flex-wrap xl:flex-nowrap relative z-[3]">
        {ClientReview?.data.map((review:any, index:any) => (
          <div
            key={index}
            className="flex w-full md:w-[350px] flex-col gap-[16px] items-center shrink-0 flex-nowrap relative z-[4]"
          >
            <div className="h-[208px] self-stretch shrink-0 relative z-[5] group">
              <div className="w-full h-full bg-[url(/assets/images/testemonials/union.svg)] group-hover:bg-[url(/assets/images/testemonials/unionHover.svg)] transition-all duration-500 ease-in-out bg-contain xs:bg-cover bg-no-repeat absolute top-0 left-0 z-[6]" />
              <div className="flex w-full scale-[.8] xs:scale-100 xs:h-[96.15%] flex-col gap-[24px] justify-center items-center flex-nowrap rounded-[16px] absolute top-0 left-0 z-[7]">
                <div
                  style={{
                    backgroundImage: `url(/assets/images/testemonials/Frame.svg)`,
                  }}
                  className="w-[24.577px] h-[19.935px] shrink-0 bg-cover bg-no-repeat relative overflow-hidden z-[8]"
                />
                <span className="flex w-full rtl:sm:w-[280px] rtl:h-[75px] justify-center items-start shrink-0 text-[14px] font-medium leading-[25.48px] text-[#dbdbdb] relative text-center z-[9]">
                  {review.text}
                </span>
              </div>
            </div>
            <div className="flex w-[84px] flex-col gap-[8px] items-center shrink-0 flex-nowrap relative z-10">
              <div
                style={{ backgroundImage: `url(${review.image[0]?.original})` }}
                className="w-[56px] h-[56px] shrink-0 bg-cover bg-no-repeat rounded-[50%] relative z-[11]"
              />
              <span className="flex w-[101px] h-[25px] justify-center items-start shrink-0 basis-auto text-[14px] font-medium leading-[25px] text-[#fff] relative text-center whitespace-nowrap z-[12]">
                {review.name}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Testimonials;
