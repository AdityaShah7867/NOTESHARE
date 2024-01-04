import React from 'react';
import ChatLay from '../components/Layout/ChatLay';
import { NavLink } from 'react-router-dom';

const GameList = () => {
  // Mock data for game details
  const games = [
    { id: 1, title: 'Game 1', genre: 'Action', rating: 4.5, imageUrl: 'https://plays.org/categories/typing-games.png' },
    // { id: 2, title: 'Game 2', genre: 'Adventure', rating: 4.2, imageUrl: 'https://example.com/game2.jpg' },
    // { id: 3, title: 'Game 3', genre: 'Strategy', rating: 4.8, imageUrl: 'https://example.com/game3.jpg' },
    // Add more game details as needed
  ];

  return (
    <ChatLay>
        <NavLink to='/game'>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 mt-16 lg:grid-cols-4 gap-4">
        {games.map((game) => (
          <div key={game.id} className="bg-gray-50 p-4 rounded-md shadow-md">
            <img src={game.imageUrl} alt={game.title} className="w-full h-32 object-cover mb-4 rounded-md" />
            <h3 className="text-lg font-semibold">{game.title}</h3>
            <p className="text-gray-600">Genre: {game.genre}</p>
            <p className="text-gray-600">Rating: {game.rating}</p>
          </div>
        ))}
      </div>
      </NavLink>
    </ChatLay>
  );
};

export default GameList;
