import React from 'react';

const MainLayout = ({ children }) => {
  return (
    <div className="flex justify-center  -mt-16 pb-32">
      <div className="w-full  md:w-2/3 lg:w-2/4">
        {children}
      </div>
    </div>
  );
};
export default MainLayout;
