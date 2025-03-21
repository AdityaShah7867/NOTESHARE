import React, { useState, useEffect } from "react";
import * as GoogleGenerativeAI from "@google/generative-ai";
import { FaRobot, FaTimes, FaPaperPlane } from 'react-icons/fa';

const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

 

  return (
    // <>
    //   <button 
    //     className="fixed bottom-8 right-8 bg-gradient-to-r from-blue-600 to-blue-500 text-white p-4 rounded-full 
    //       shadow-lg hover:shadow-xl hover:scale-110 transform transition-all duration-300
    //       flex items-center justify-center z-50 animate-bounce" 
    //     onClick={toggleChat}
    //     style={{ width: '65px', height: '65px' }}
    //   >
    //     <FaRobot className="text-2xl" />
    //   </button>

    //   {isOpen && (
    //     <div className="fixed bottom-28 right-8 w-[400px] bg-white rounded-2xl 
    //       shadow-2xl overflow-hidden z-50 border border-gray-100 animate-slideUp">
    //       <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white p-5 flex justify-between items-center">
    //         <div className="flex items-center gap-3">
    //           <FaRobot className="text-2xl" />
    //           <h3 className="font-bold text-xl">Study Assistant</h3>
    //         </div>
    //         <button 
    //           onClick={toggleChat}
    //           className="p-2 hover:bg-white/20 rounded-full transition-colors duration-300"
    //         >
    //           <FaTimes className="text-xl" />
    //         </button>
    //       </div>

    //       <div className="h-[550px] overflow-y-auto p-6 bg-gradient-to-b from-gray-50 to-white">
    //         {messages.map(renderMessage)}
    //         {loading && (
    //           <div className="flex items-center gap-2 text-blue-500 ml-2">
    //             <div className="w-2 h-2 rounded-full animate-bounce bg-blue-500"></div>
    //             <div className="w-2 h-2 rounded-full animate-bounce bg-blue-500 delay-100"></div>
    //             <div className="w-2 h-2 rounded-full animate-bounce bg-blue-500 delay-200"></div>
    //           </div>
    //         )}
    //       </div>

    //       <div className="border-t border-gray-100 bg-white p-4 flex gap-3">
    //         <input
    //           type="text"
    //           placeholder="Ask about study resources..."
    //           value={userInput}
    //           onChange={(e) => setUserInput(e.target.value)}
    //           onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
    //           className="flex-grow p-3 border border-gray-200 rounded-xl focus:outline-none 
    //             focus:ring-2 focus:ring-blue-500 bg-gray-50 placeholder-gray-400
    //             transition-all duration-300"
    //         />
    //         <button 
    //           onClick={sendMessage} 
    //           disabled={loading || !userInput.trim()}
    //           className={`p-3 rounded-xl flex items-center justify-center w-14
    //             transition-all duration-300 transform hover:scale-105
    //             ${loading || !userInput.trim() 
    //               ? 'bg-gray-200 cursor-not-allowed' 
    //               : 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-md'}`}
    //         >
    //           <FaPaperPlane className={`${loading ? 'animate-pulse' : ''} transform -rotate-45`} />
    //         </button>
    //       </div>
    //     </div>
    //   )}
    // </>
    <>
    </>
  );
};

export default ChatBot;
