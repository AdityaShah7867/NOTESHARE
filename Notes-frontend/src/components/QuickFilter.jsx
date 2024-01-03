import React from "react";
import "./Filter.css"

const QuickFilter = ({ filter, setFilter }) => {
  return (
    <div>

      <div className="flex my-4 p-2">
        <div className="flex justify-around gap-4 mb-2 w-full">
          {/* <p
            className={`border w-full text-center rounded-lg py-2 px-4 ${filter === 'Liked' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-black'}`}
            onClick={() => setFilter('Liked')}
          >
            Liked
          </p> */}
          <p
            className={`border w-full text-center rounded-lg py-2 px-4 ${filter === 'ALL' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-black'}`}
            onClick={() => setFilter('ALL')}
          >
            All Notes
          </p>
          <p
            className={`border w-full text-center rounded-lg py-2 px-4 ${filter === 'BookMarked' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-black'}`}
            onClick={() => setFilter('BookMarked')}
          >
            BookMarked
          </p>
        </div>
      </div>
    </div>
  );
};

export default QuickFilter;
