import React from 'react';

interface HeroBannerProps {
  title: string;
  breadcrumbItems: { label: string; isActive?: boolean }[];
}

const HeroBanner: React.FC<HeroBannerProps> = ({ title, breadcrumbItems }) => {
  return (
    <div 
      className="w-full h-[250px] relative bg-no-repeat bg-cover bg-center" 
      style={{ backgroundImage: 'url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-18/DFhQezQ5hS.png)' }}
    >
      <div 
        className="absolute inset-0 w-full h-full bg-no-repeat bg-cover" 
        style={{ backgroundImage: 'url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-18/0owx2TM42T.png)' }}
      >
        {/* Top Right Decorative Icons */}
        <div className="absolute top-[19.2%] left-[70.76%] w-[2.01%] h-[56.4%]">
          <div 
            className="w-[29px] h-[29px] bg-no-repeat bg-cover" 
            style={{ backgroundImage: 'url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-18/4QUzxCKOhU.png)' }} 
          />
          <div 
            className="w-[29px] h-[29px] mt-[83px] bg-no-repeat bg-cover" 
            style={{ backgroundImage: 'url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-18/803XMdkNFA.png)' }} 
          />
        </div>

        {/* Center Content */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
          <div className="text-white text-[24px] font-semibold leading-[32px]">
            {title}
          </div>
          <div className="mt-2 flex justify-center items-center gap-2">
            {breadcrumbItems.map((item, index) => (
              <React.Fragment key={index}>
                {index > 0 && (
                  <div 
                    className="w-4 h-4 bg-no-repeat bg-cover" 
                    style={{ backgroundImage: 'url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-18/5HzeZiBmtr.png)' }} 
                  />
                )}
                <span className={`text-sm font-semibold ${item.isActive ? 'text-[#62a0f6]' : 'text-white'}`}>
                  {item.label}
                </span>
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Decorative Elements */}
        <div 
          className="absolute top-[34%] left-[14.44%] w-[2.01%] h-[11.6%] bg-no-repeat bg-cover" 
          style={{ backgroundImage: 'url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-18/e0Abrtvom6.png)' }} 
        />
        <div 
          className="absolute top-[41.6%] left-[93.13%] w-[2.01%] h-[11.6%] bg-no-repeat bg-cover" 
          style={{ backgroundImage: 'url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-18/1XdOKqGhLn.png)' }} 
        />
        <div 
          className="absolute top-[62.8%] left-[6.88%] w-[1.67%] h-[9.6%] bg-no-repeat bg-cover" 
          style={{ backgroundImage: 'url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-18/3yY0wTn197.png)' }} 
        />
      </div>
    </div>
  );
};

export default HeroBanner;