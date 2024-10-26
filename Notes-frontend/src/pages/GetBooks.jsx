import React, { useEffect, useState } from 'react';
import ChatLay from '../components/Layout/ChatLay';
import axios from 'axios';

const host = process.env.REACT_APP_API_HOST;

const GetBooks = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [booksData, setBooksData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const filteredBooks = booksData?.filter(book =>
    book?.title?.toLowerCase().includes(searchQuery?.toLowerCase()) ||
    book?.author?.toLowerCase().includes(searchQuery?.toLowerCase())
  );

  const fetchBooksByScarping = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(`${process.env.REACT_APP_API_HOST}/scrape`);

      if (res.status === 200) {
        setBooksData(res.data.data);
      }
    } catch (error) {
      console.error("Error fetching books:", error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchBooksByScarping();
  }, []);

  return (
    <ChatLay>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-8">
          Digital Library
        </h1>
        
        <div className="relative max-w-xl mx-auto mb-12">
          <input
            type="text"
            placeholder="Search books by title or author..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-4 pl-12 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
          />
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
            <i className="bi bi-search text-gray-400"></i>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredBooks?.map((book) => (
              <div 
                key={book.id} 
                className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden"
                onClick={() => window.open(book.href, "_blank")}
              >
                <div className="aspect-w-3 aspect-h-4 overflow-hidden">
                  <img
                    src={book.imageSrc}
                    alt={book.title}
                    loading="lazy"
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600">
                    {book.title}
                  </h3>
                  <p className="text-xs text-gray-600 line-clamp-3">
                    {book.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {!isLoading && filteredBooks.length === 0 && (
          <div className="text-center py-12">
            <i className="bi bi-book text-4xl text-gray-400 mb-4"></i>
            <h3 className="text-xl font-medium text-gray-900">No books found</h3>
            <p className="text-gray-600">Try adjusting your search terms</p>
          </div>
        )}
      </div>
    </ChatLay>
  );
};

export default GetBooks;
