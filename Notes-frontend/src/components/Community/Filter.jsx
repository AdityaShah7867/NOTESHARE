import React, { useState } from 'react'


const Filter = () => {
    const [activeTab, setActiveTab] = useState("ALLGROUPS");
    const handleTabClick = (tabName) => {
        setActiveTab(tabName);
      };
  return (
    <div><div className="flex justify-between items-center mt-4 gap-4 mx-auto">
    <p
      className={`border border-gray-300 w-full text-center rounded-lg p-2 hover:cursor-pointer ${
        activeTab === "ALLGROUPS" ? "text-white bg-blue-600" : ""
      }`}
      onClick={() => handleTabClick("ALLGROUPS")}
    >
      All Communities
    </p>
    <p
      className={`border border-gray-300 text-black w-full text-center rounded-lg p-2 hover:cursor-pointer ${
        activeTab === "JOINED" ? "text-white bg-blue-600" : ""
      }`}
      onClick={() => handleTabClick("JOINED")}
    >
      Joined
    </p>
  </div></div>
  )
}

export default Filter