
import React from "react";


const GroupDiscussionLayout = ({ children }) => {
  return (
    <div className="flex justify-center bg-black p-2 ">
      <div className="md:w-2/3  lg:w-10/12 " >
        {children}
      </div>
    </div>
  );
};

export default GroupDiscussionLayout;