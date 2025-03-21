import React from "react";
import "./Filter.css"

const QuickFilter = ({ filter, setFilter }) => {
  return (
    <div className="w-full">
      <div className="flex space-x-3">
        <button
          onClick={() => setFilter('ALL')}
          className={`px-4 py-2.5 rounded-lg transition-all duration-200 flex-1 text-center font-medium ${
            filter === 'ALL'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <i className="bi bi-journal-text"></i>
            <span>All Notes</span>
          </div>
        </button>
        
        <button
          onClick={() => setFilter('BookMarked')}
          className={`px-4 py-2.5 rounded-lg transition-all duration-200 flex-1 text-center font-medium ${
            filter === 'BookMarked'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <i className="bi bi-bookmark"></i>
            <span>Bookmarked</span>
          </div>
        </button>
      </div>
    </div>
  );
};

export default QuickFilter;
