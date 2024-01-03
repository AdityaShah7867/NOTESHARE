import React, { useState } from 'react'

const Header = () => {

  const [searchText, setSearchText] = useState("");

  return (
    <div>
      <div>
        <div className="mx-auto bg-gray-200 rounded-md p-2 mt-10">
          <h1 className="font-semibold text-3xl text-center ">Communities</h1>
        </div>
        <div className="pt-2 relative mx-auto mt-2 text-gray-600">
          <input
            className="border-2 border-gray-300 w-full bg-white h-10 px-5 pr-16 rounded-lg text-sm focus:outline-none"
            type="search"
            name="search"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search Communities"
          />
          <button type="submit" className="absolute right-0 top-0 mt-5 mr-4">
            {/* Your SVG icon */}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Header