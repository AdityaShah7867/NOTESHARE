import React from 'react';

const MainLayout = ({ children }) => {
  return (
    <div className="flex justify-center -mt-16 bg-gray-200 h-grow -mb-[5rem]  lg:h-screen sm:h-full md:h-full ">
      <div className="w-full  md:w-2/3 mt-14 lg:w-2/4  ">
        {children}
      </div>
    </div>
  );
};
export default MainLayout;
