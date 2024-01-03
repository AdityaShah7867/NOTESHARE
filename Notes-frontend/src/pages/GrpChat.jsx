import React from 'react';
import ChatLay from '../components/Layout/ChatLay';

const GrpChat = () => {
  return (
    <ChatLay>
     <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold leading-tight text-gray-900">Group Name</h1>
          <p className="mt-1 text-lg text-gray-600">Admin Name</p>
        </div>
      </div>

      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col space-y-4">
          {/* Received message */}
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <img
                className="h-10 w-10 rounded-full"
                src="https://via.placeholder.com/150"
                alt="User avatar"
              />
            </div>
            <div className="ml-4">
              <div className="bg-white rounded-lg px-4 py-2 shadow">
                <p className="text-sm text-gray-500">John Doe</p>
                <p className="text-lg">Hello, how are you?</p>
              </div>
            </div>
          </div>

          {/* Sent message */}
          <div className="flex items-end justify-end">
            <div className="mr-4">
              <div className="bg-indigo-600 rounded-lg px-4 py-2 shadow text-white">
                <p className="text-lg">I'm doing great, thanks for asking!</p>
              </div>
            </div>
            <div className="flex-shrink-0">
              <img
                className="h-10 w-10 rounded-full"
                src="https://via.placeholder.com/150"
                alt="User avatar"
              />
            </div>
          </div>

          {/* TODO: Render more chat messages here */}
        </div>
      </div>

      {/* Message input */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <form className="flex space-x-3">
            <div className="flex-1">
              <label htmlFor="message" className="sr-only">
                Message
              </label>
              <input
                type="text"
                name="message"
                id="message"
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                placeholder="Type your message here"
              />
            </div>
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
    </ChatLay>
  );
};

export default GrpChat;