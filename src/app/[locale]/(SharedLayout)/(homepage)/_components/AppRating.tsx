import React from "react";

const AppRating: React.FC = () => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-center justify-start w-full">
      <div className="flex items-center">
        <img
          src="https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-12/XDnmFqBpFm.png"
          alt="User avatars"
          className="w-full max-w-[216px] h-auto"
        />
      </div>
      <div className="flex flex-col gap-2 items-start">
      <div className="flex gap-2 items-center">
          <span className="  text-sm text-[#1e1e1e] text-right whitespace-nowrap">
            4.5/5.0
          </span>
          <img
            src="https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-12/SETY1NLKxs.png"
            alt="Star rating"
            className="w-6 h-6"
          />
        </div>
        <span className="  text-sm font-bold text-[#1e1e1e] text-right whitespace-nowrap">
          اكتر من 5000+ مستخدم
        </span>

        
      </div>

      
    </div>
  );
};

export default AppRating;
