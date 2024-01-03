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
    <div>
      <div class="max-w-md mx-auto rounded-lg overflow-hidden md:max-w-xl ">
        <div class="md:flex">
          <div class="w-full p-3">
            <div class="relative">
              <i class="absolute fa fa-search text-gray-400 top-5 left-4"></i>
              <input
                type=""
                id="default-search"
                placeholder="Search Notes.."
                autoComplete="off"
                onChange={(e) => setSearch(e.target.value)}
                class="bg-white h-14 w-full px-12 rounded-lg focus:outline-none border-2 border-gray-400 hover:border-blue-500 hover:border-4 hover:cursor-pointer"
                name="search"
                value={search}
              />

              {/* <button class="absolute top-4 right-16 border-l pl-4"
                type="submit">
                <i class="fa fa-paper-plane text-gray-500 hover:text-green-500 hover:cursor-pointer"></i>
              </button> */}

              <span className="absolute top-4 right-5 border-l pl-4">
                <i
                  className="fa fa-filter text-gray-500 hover:text-green-500 hover:cursor-pointer"
                  onClick={openFilterModal}
                ></i>
              </span>

            </div>
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
