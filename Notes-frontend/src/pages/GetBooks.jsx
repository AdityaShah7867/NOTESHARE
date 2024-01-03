// Import necessary dependencies
import React, { useState } from 'react';
import ChatLay from '../components/Layout/ChatLay';

// Sample data for books
const booksData = [
  {
    id: 1,
    title: 'Book 1',
    author: 'Author 1',
    image: 'book1.jpg', // Replace with actual image URL or import the image
  },
  {
    id: 2,
    title: 'Book 2',
    author: 'Author 2',
    image: 'book2.jpg', // Replace with actual image URL or import the image
  },
  // Add more books as needed
];

// Functional component for the GetBooks page
const GetBooks = () => {
  // State to manage search query
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter books based on search query
  const filteredBooks = booksData.filter(book =>
    book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ChatLay>
      {/* Search bar */}
      <center>
      <div className="mb-4 mt-8">
        <input
          type="text"
          placeholder="Search books..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="p-2 border border-gray-300 rounded-md justify-center w-8/12"
        />
      </div>
      </center>

      {/* Display cards for each book */}
      <div className="grid grid-cols-1 mt-12 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredBooks.map((book) => (
          <div key={book.id} className="border p-4 rounded-md shadow-md">
            <img
              src={book.image}
              alt={book.title}
              className="w-full h-40 object-cover mb-2 rounded-md"
            />
            <h3 className="text-lg font-semibold mb-1">{book.title}</h3>
            <p className="text-gray-600">{book.author}</p>
          </div>
        ))}
      </div>
    </ChatLay>
  );
};

export default GetBooks;
