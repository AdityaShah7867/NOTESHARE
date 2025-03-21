import React, { useState } from "react";
import FilterForm from "./FilterForm";

const Search = ({ search, setSearch }) => {
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const openFilterModal = () => {
    setIsFilterModalOpen(true);
  };

  const closeFilterModal = () => {
    setIsFilterModalOpen(false);
  };

  return (
    <div className="w-full">
      <div className="relative max-w-3xl mx-auto">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <i className="fa fa-search text-gray-400"></i>
          </div>
          <input
            type="text"
            placeholder="Search for notes, subjects, modules..."
            autoComplete="off"
            onChange={(e) => setSearch(e.target.value)}
            value={search}
            className="bg-gray-800 w-full pl-12 pr-16 py-3.5 rounded-xl border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none placeholder-gray-500 text-gray-200 shadow-lg transition-all duration-200"
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-4">
            <button 
              onClick={openFilterModal}
              className="text-gray-400 hover:text-blue-400 transition-colors p-1.5 rounded-lg hover:bg-gray-700/50"
            >
              <i className="fa fa-filter text-xl"></i>
            </button>
          </div>
        </div>
      </div>

      {isFilterModalOpen && (
        <FilterForm
          isFilterModalOpen={isFilterModalOpen}
          closeFilterModal={closeFilterModal}
        />
      )}
    </div>
  );
};

export default Search;
