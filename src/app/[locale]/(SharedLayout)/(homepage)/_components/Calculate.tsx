"use client";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

function Calculate() {
  const { t } = useTranslation("homepage");
  const [loanAmount, setLoanAmount] = useState<number>(1000);
  const [duration, setDuration] = useState<number>(6);
  const interestRate = 0.05; // 5% Interest Rate

  // Calculations
  const monthlyInstallment = ((loanAmount + loanAmount * interestRate) / duration).toFixed(2);
  const totalAmount = (parseFloat(monthlyInstallment) * duration).toFixed(2);
  const totalProfit = (parseFloat(totalAmount) - loanAmount).toFixed(2);

  return (
    <div className="main-container flex w-full flex-col xl:flex-row xl:w-[1152px] gap-[24px] items-center flex-nowrap relative mx-auto  my-0">

      {/* Left Section - Hero Image and Description */}
      <div className="flex w-full xl:w-[564px] h-[674px] flex-col gap-[32px] items-start shrink-0 flex-nowrap relative z-[52]">
        <div className="self-stretch grow shrink-0 bg-[url(/assets/images/calculate/hero.svg)] bg-cover bg-no-repeat rounded-[24px] relative z-[53]" />
        <div className="flex w-full xl:w-[516px] xl:h-[120px] flex-col gap-[24px] absolute bottom-[64px] left-1/2 translate-x-[-50%] z-[54]">
          <span className="xl:h-[36px] text-[24px] font-semibold leading-[36px] text-[#fff] relative xl:whitespace-nowrap z-[55]">
            {t("calculate.title")}
          </span>
          <span className="flex w-full xl:w-[516px] xl:h-[60px] text-[16px] font-medium leading-[30.4px] text-[#f8fbfc] relative z-[56]">
            {t("calculate.description")}
          </span>
        </div>
      </div>

      {/* Right Section - Calculator */}
      <div className="flex w-full flex-col xl:w-[564px] gap-[21px] shrink-0 flex-wrap bg-[#f8fbfc] rounded-[24px] relative py-2">
        
        {/* Information Section */}
        <div className="flex pt-[32px] pr-[24px] pb-[8px] pl-[8px] gap-[8px] xl:grow basis-0 relative z-[1]">
          <span className="flex w-full rtl:xl:w-[366px] xl:h-[21px] justify-start xl:justify-center items-start text-[14px] font-normal leading-[21px] text-[#667680] relative text-center rtl:xl:whitespace-nowrap z-[2]">
            <div className="w-[20px] h-[20px] shrink-0 bg-[url(/assets/images/calculate/information-circle.svg)] bg-cover bg-no-repeat relative z-[3]" />
            {t("calculate.info")}
          </span>
        </div>

        {/* Loan Input */}
        <div className="flex w-full xl:w-[564px] pt-[24px] pr-[24px]  pl-[24px] flex-col gap-[12px] items-start rounded-[16px] relative z-[4]">
          <div className="main-container flex w-full xl:w-[516px] flex-col gap-[14px] relative mx-auto my-0">
            <span className="text-[14px] font-medium leading-[21px] text-[#667680] text-start whitespace-nowrap">
              {t("calculate.loanAmount")}
            </span>
            <div className="flex h-[64px] items-center rounded-[16px] border border-[#f8fbfc] relative overflow-hidden">
              <input
                type="number"
                value={loanAmount}
                onChange={(e) => setLoanAmount(Number(e.target.value))}
                placeholder={t("calculate.placeholder")}
                className="w-full h-[64px] bg-transparent border-none px-6 text-[#667680]"
              />
            </div>
            <div className="flex h-[32px] flex-col gap-[8px] items-end self-stretch bg-[#eaefef] rounded-[12px] relative z-[9]">
          <div
            className="flex h-[32px] pt-[8px] pr-[8px] pb-[8px] pl-[8px] gap-[8px] items-center bg-[#5d9d9f] rounded-[12px] relative z-10"
            style={{ width: `${(duration / 60) * 100}%` }} // Dynamic width based on duration
          >
            <div className="w-[16px] h-[16px] bg-[url(/assets/images/calculate/drag-drop-vertical.svg)] bg-cover bg-no-repeat relative z-[11]" />
          </div>
        </div>
          </div>
        </div>

        {/* Duration Selection */}
        <div className="flex w-full xl:w-[564px] pt-[24px] xl:pr-[24px] pb-[24px] xl:pl-[24px] flex-col gap-[12px] justify-center rounded-[16px] relative z-[12]">
          <span className="text-[14px] font-medium leading-[21px] text-[#667680] whitespace-nowrap">
            {t("calculate.duration")}
          </span>
          <div className="flex gap-[16px] flex-wrap justify-center xl:justify-start">
            {[6, 12, 18, 24, 30, 36, 42, 48, 54, 60].map((month) => (
              <button
                key={month}
                className={`flex w-[90px] h-[44px] items-center justify-center rounded-[32px] border-none relative pointer ${
                  duration === month ? "bg-[#5d9d9f] text-white" : "bg-[#eaefef] text-[#5d9d9f]"
                }`}
                onClick={() => setDuration(month)}
              >
                <span className="text-[16px] font-medium leading-[24px]">{month}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Result Display */}
        <div className="flex w-full xl:w-[564px] pt-[24px] pr-[24px] pb-[24px] pl-[24px] flex-col gap-[24px] justify-center items-start relative z-[37]">
          <button className="flex pt-[16px] pr-[72px] pb-[16px] pl-[72px] gap-[8px] justify-center items-center self-stretch bg-[#5d9d9f] rounded-[16px] border-none relative z-[38] pointer">
            <span className="text-[16px] font-medium leading-[24px] text-[#fff]">
              {t("calculate.calculate")}
            </span>
          </button>
          <div className="flex justify-between self-stretch flex-wrap gap-2 xl:flex-nowrap relative z-40">
            {[
              { label: t("calculate.monthlyInstallment"), value: `${monthlyInstallment} ${t("calculate.currency")}` },
              { label: t("calculate.totalAmount"), value: `${totalAmount} ${t("calculate.currency")}` },
              { label: t("calculate.totalProfit"), value: `${totalProfit} ${t("calculate.currency")}` }
            ].map((item, index) => (
              <div key={index} className="flex flex-col gap-[8px] items-center">
                <span className="text-[14px] font-medium bukra-semi-bold leading-[21px] text-[#5d9d9f]">{item.label}</span>
                <span className="text-[16px] font-bold bukra-semi-bold leading-[24px] text-[#667680]">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

export default Calculate;





// "use client";
// import React, { useState } from "react";
// import { useTranslation } from "react-i18next";

// function Calculate() {
//   const { t } = useTranslation("homepage");
//   const [loanAmount, setLoanAmount] = useState<number>(1000);
//   const [duration, setDuration] = useState<number>(6);
//   const interestRate = 0.05; // 5% Interest Rate

//   // Calculations
//   const monthlyInstallment = ((loanAmount + loanAmount * interestRate) / duration).toFixed(2);
//   const totalAmount = (parseFloat(monthlyInstallment) * duration).toFixed(2);
//   const totalProfit = (parseFloat(totalAmount) - loanAmount).toFixed(2);

//   // Handle Loan Amount Change
//   const handleLoanChange = (value: number) => {
//     if (value < 1000) value = 1000;
//     if (value > 50000) value = 50000;
//     setLoanAmount(value);
//   };

//   return (
//     <div className="main-container flex w-full flex-col xl:flex-row xl:w-[1152px] gap-[24px] items-center flex-nowrap relative mx-auto my-0">

//       {/* Left Section - Hero Image and Description */}
//       <div className="flex w-full xl:w-[564px] h-[674px] flex-col gap-[32px] items-start shrink-0 flex-nowrap relative z-[52]">
//         <div className="self-stretch grow shrink-0 bg-[url(/assets/images/calculate/hero.svg)] bg-cover bg-no-repeat rounded-[24px] relative z-[53]" />
//         <div className="flex w-full xl:w-[516px] xl:h-[120px] flex-col gap-[24px] absolute bottom-[64px] left-1/2 translate-x-[-50%] z-[54]">
//           <span className="xl:h-[36px] text-[24px] font-semibold leading-[36px] text-[#fff] relative xl:whitespace-nowrap z-[55]">
//             {t("calculate.title")}
//           </span>
//           <span className="flex w-full xl:w-[516px] xl:h-[60px] text-[16px] font-medium leading-[30.4px] text-[#f8fbfc] relative z-[56]">
//             {t("calculate.description")}
//           </span>
//         </div>
//       </div>

//       {/* Right Section - Calculator */}
//       <div className="flex w-full flex-col xl:w-[564px] gap-[21px] shrink-0 flex-wrap bg-[#f8fbfc] rounded-[24px] relative">
        
//         {/* Information Section */}
//         <div className="flex pt-[32px] pr-[24px] pb-[8px] pl-[8px] gap-[8px] xl:grow basis-0 relative z-[1]">
//           <span className="flex w-full rtl:xl:w-[366px] xl:h-[21px] justify-start xl:justify-center items-start text-[14px] font-normal leading-[21px] text-[#667680] relative text-center rtl:xl:whitespace-nowrap z-[2]">
//             <div className="w-[20px] h-[20px] shrink-0 bg-[url(/assets/images/calculate/information-circle.svg)] bg-cover bg-no-repeat relative z-[3]" />
//             {t("calculate.info")}
//           </span>
//         </div>

//         {/* Loan Input & Progress Bar */}
//         <div className="flex w-full xl:w-[564px] pt-[24px] pr-[24px] pl-[24px] flex-col gap-[12px] items-start rounded-[16px] relative z-[4]">
//           <div className="main-container flex w-full xl:w-[516px] flex-col gap-[14px] relative mx-auto my-0">
//             <span className="text-[14px] font-medium leading-[21px] text-[#667680] text-start whitespace-nowrap">
//               {t("calculate.loanAmount")}
//             </span>
            
//             {/* Input Field */}
//             <div className="flex h-[64px] items-center rounded-[16px] border border-[#f8fbfc] relative overflow-hidden">
//               <input
//                 type="number"
//                 value={loanAmount}
//                 onChange={(e) => handleLoanChange(Number(e.target.value))}
//                 placeholder={t("calculate.placeholder")}
//                 className="w-full h-[64px] bg-transparent border-none px-6 text-[#667680] text-center"
//               />
//             </div>

//             {/* Progress Bar (Draggable) */}
//             <div className="flex h-[32px] flex-col items-start w-full bg-[#eaefef] rounded-[12px] relative z-[5]">
//               <input
//                 type="range"
//                 min="1000"
//                 max="50000"
//                 step="500"
//                 value={loanAmount}
//                 onChange={(e) => handleLoanChange(Number(e.target.value))}
//                 className="w-full h-[32px] bg-[#5d9d9f] rounded-[12px] appearance-none cursor-pointer"
//               />
//             </div>
//           </div>
//         </div>

//         {/* Duration Selection */}
//         <div className="flex w-full xl:w-[564px] pt-[24px] xl:pr-[24px] pb-[24px] xl:pl-[24px] flex-col gap-[12px] justify-center rounded-[16px] relative z-[12]">
//           <span className="text-[14px] font-medium leading-[21px] text-[#667680] whitespace-nowrap">
//             {t("calculate.duration")}
//           </span>
//           <div className="flex gap-[16px] flex-wrap justify-center xl:justify-start">
//             {[6, 12, 18, 24, 30, 36, 42, 48, 54, 60].map((month) => (
//               <button
//                 key={month}
//                 className={`flex w-[90px] h-[44px] items-center justify-center rounded-[32px] border-none relative pointer ${
//                   duration === month ? "bg-[#5d9d9f] text-white" : "bg-[#eaefef] text-[#5d9d9f]"
//                 }`}
//                 onClick={() => setDuration(month)}
//               >
//                 <span className="text-[16px] font-medium leading-[24px]">{month}</span>
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Result Display */}
//         <div className="flex w-full xl:w-[564px] pt-[24px] pr-[24px] pb-[24px] pl-[24px] flex-col gap-[24px] justify-center items-start relative z-[37]">
//           <button className="flex pt-[16px] pr-[72px] pb-[16px] pl-[72px] gap-[8px] justify-center items-center self-stretch bg-[#5d9d9f] rounded-[16px] border-none relative z-[38] pointer">
//             <span className="text-[16px] font-medium leading-[24px] text-[#fff]">
//               {t("calculate.calculate")}
//             </span>
//           </button>
//           <div className="flex justify-between self-stretch flex-wrap gap-2 xl:flex-nowrap relative z-40">
//             {[
//               { label: t("calculate.monthlyInstallment"), value: `${monthlyInstallment} ${t("calculate.currency")}` },
//               { label: t("calculate.totalAmount"), value: `${totalAmount} ${t("calculate.currency")}` },
//               { label: t("calculate.totalProfit"), value: `${totalProfit} ${t("calculate.currency")}` }
//             ].map((item, index) => (
//               <div key={index} className="flex flex-col gap-[8px] items-center">
//                 <span className="text-[14px] font-medium bukra-semi-bold leading-[21px] text-[#5d9d9f]">{item.label}</span>
//                 <span className="text-[16px] font-bold bukra-semi-bold leading-[24px] text-[#667680]">{item.value}</span>
//               </div>
//             ))}
//           </div>
//         </div>

//       </div>
//     </div>
//   );
// }

// export default Calculate;
