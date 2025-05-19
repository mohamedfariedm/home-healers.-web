import React from 'react';
import AppHeader from './AppHeader';
import AppRating from './AppRating';
import DownloadButtons from './DownloadButtons';

const AppDownloadSection: React.FC = () => {
  return (
    <div className="w-full max-w-7xl mx-auto my-8 relative overflow-hidden bg-[#eff6fe] rounded-lg shadow-lg">
      <div className="flex flex-col lg:flex-row">
        {/* Left side with app image - becomes top on mobile */}
        <div className="w-full lg:w-1/2 relative">
          <div className="absolute top-0 left-0 w-full h-full z-10 lg:block hidden">
            <img 
              src="https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-12/scH5Bj0Loc.png" 
              alt="Background shape" 
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="relative z-20 mx-auto lg:mx-0 px-4 py-6 lg:p-0">
            <img 
              src="https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-12/NmXxV1AJjt.png" 
              alt="App screenshot" 
              className="w-full max-w-xs lg:max-w-md mx-auto lg:mx-8 h-auto object-contain"
            />
          </div>
        </div>

        {/* Right side with content - becomes bottom on mobile */}
        <div className="w-full lg:w-1/2 p-6 lg:p-10 flex flex-col justify-center relative">
          <div className="absolute top-0 right-0 w-3/4 h-3/4 z-0 opacity-50 lg:opacity-100">
            <img 
              src="https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-05-12/ngWJPKbbO8.png" 
              alt="Decorative element" 
              className="w-full h-full object-contain"
            />
          </div>
          
          <div className="flex flex-col gap-8 items-end relative z-10">
            <AppHeader />
            <AppRating />
            <DownloadButtons />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppDownloadSection;