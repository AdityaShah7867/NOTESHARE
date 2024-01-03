
import React, { useEffect, useState } from 'react';
import ChatLay from '../components/Layout/ChatLay';
import axios from 'axios';


const host = process.env.REACT_APP_API_HOST;

const GetBooks = () => {

  const [searchQuery, setSearchQuery] = useState('');
  const [booksData, setBooksData] = useState([])

  const filteredBooks = booksData.filter(book =>
    book?.title?.toLowerCase().includes(searchQuery?.toLowerCase()) ||
    book?.author?.toLowerCase().includes(searchQuery?.toLowerCase())
  );

  const fetchBooksByScarping = async () => {
    try {
      const res = await axios.get(`${host}/books`);

      if (res.status === 200) {
        setBooksData(res.data.books);
      }

    } catch (error) {
      console.log(error);
    }
  }


  useEffect(() => {
    fetchBooksByScarping();
  }, [])

  return (
    <ChatLay>
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

      <div className="grid grid-cols-1 mt-12 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {filteredBooks.map((book) => (
          <div key={book.id} className="border p-4 rounded-md shadow-md" onClick={() => {
            window.open(book.bookhref, "_blank");
          }}>
            <img
              src={book.imgSrc}
              alt={book.title}
              loading="lazy" // Add lazy loading attribute
              className="w-full max-w-54 max-h-80 object-cover mb-2 rounded-md"
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
