import React from 'react';
import ChatLay from '../components/Layout/ChatLay';

const GrpChat = () => {
  return (
    <View>
    <div className="min-h-screen pt-4 -mt-2 bg-gray-100 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold leading-tight text-gray-900">Group Name</h1>
          <p className="mt-1 text-lg text-gray-600">Admin Name</p>
        </div>
      </div>

      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* TODO: Render chat messages here */}
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
    </View>
  );
};

export default GrpChat;