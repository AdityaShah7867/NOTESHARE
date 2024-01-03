import React, { useState } from "react";
import Alternates from "../components/Layout/Setting";
import Header from "../components/Community/Header";
import Filter from "../components/Community/Filter";
import Card from "../components/Community/card";

const Communitychat = () => {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("ALLGROUPS");
  const [searchText, setSearchText] = useState("");

  const openForm = () => {
    setIsFormVisible(true);
  };

  const closeForm = () => {
    setIsFormVisible(false);
  };

  const handleCancel = () => {
    closeForm();
  };

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };

  return (
    <Alternates>
      <div className="m-5">
        <Header />
        <Filter />  
        <Card />

        <div className="fixed bottom-32 right-8  z-80">
          <button
            title="Add New"
            onClick={openForm}
            className="group cursor-pointer text-4xl bg-green-500 rounded-sm hover:rotate-90 active:scale-100 duration-200"
          >
            {/* Your SVG icon */}
            +
          </button>
        </div>
        {isFormVisible && (
          <div className="fixed inset-0 flex items-center justify-center w-full bg-black bg-opacity-50 z-50">
            <div className="mx-auto p-4 bg-white shadow-md rounded-md w-4/5">
              <h2 className="text-lg font-semibold mb-4">Create Community</h2>

              <form>
                <div className="mb-6">
                  <input
                    type="text"
                    name="groupName"
                    id="GrpName"
                    className="block w-full text-sm text-black border-b-2 border-gray-300 focus:outline-none"
                    placeholder=" "
                    required
                  />
                  <label
                    htmlFor="GrpName"
                    className="block text-sm text-gray-500 dark:text-gray-400 transform -translate-y-3 duration-300"
                  >
                    GROUP NAME
                  </label>
                </div>
                <div className="mb-6">
                  <input
                    type="text"
                    name="bio"
                    id="floating_text"
                    className="block w-full text-sm text-black border-b-2 border-gray-300 focus:outline-none"
                    placeholder=" "
                    required
                  />
                  <label
                    htmlFor="floating_text"
                    className="block text-sm text-gray-500 dark:text-gray-400 transform -translate-y-3 duration-300"
                  >
                    BIO
                  </label>
                </div>

                <div className="flex space-x-2">
                  <button
                    type="submit"
                    className="bg-blue-500 text-white rounded-md py-2 px-4 hover:bg-blue-600"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    className="bg-red-500 text-white rounded-md py-2 px-4 hover:bg-red-600"
                    onClick={handleCancel}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Alternates>
  );
};

export default Communitychat;
