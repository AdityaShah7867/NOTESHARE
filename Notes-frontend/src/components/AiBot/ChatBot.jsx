import React, { useState, useEffect } from "react";
import * as GoogleGenerativeAI from "@google/generative-ai";
import { FaRobot, FaTimes, FaPaperPlane } from 'react-icons/fa';

const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const API_KEY = "AIzaSyDe3-CAtfRMnruIvg0whO7TvliZkYn4MP0";

  useEffect(() => {
    const startChat = async () => {
      const genAI = new GoogleGenerativeAI.GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const initialPrompt = `You are an AI chatbot assistant for a student notes sharing and learning platform. Your role is to help users with questions about sharing notes, accessing study materials, and navigating the platform. Please provide helpful, concise, and accurate information. If you're unsure about something, it's okay to say so.

Available Features:
# Main Navigation
- Landing page ("/")
- Home dashboard ("/home") 
- Your Notes ("/YourNotes")
- Add Notes ("/addnotes")

# Study Resources
- Note Viewer ("/nviewer/:noteId")
- Books ("/books")
- LeetCode Practice ("/leetcode")

# Community Features  
- Communities ("/Communities")
- Community Chat ("/community-chat") 
- Video Room ("/video")

# User Features
- Profile ("/profile/:username")
- Settings ("/setting")
- Resume Review ("/resumeReview")
- Notifications ("/notification")
- Games List ("/gameslist")

When responding:
1. Use markdown-style formatting
2. Structure responses with clear sections using #, ##, etc.
3. Use bullet points for lists
4. Bold important terms with **
5. Start with: "Hello! I'm your study assistant. How can I help you today?"`;

      const result = await model.generateContent(initialPrompt);
      const response = result.response;
      const text = response.text();
      setMessages([{ text, user: false }]);
    };
    startChat();
  }, []);

  const sendMessage = async () => {
    if (!userInput.trim()) return;
    
    setLoading(true);
    const userMessage = { text: userInput, user: true };
    setMessages([...messages, userMessage]);

    const genAI = new GoogleGenerativeAI.GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const contextPrompt = `You are an AI assistant for a student notes sharing and learning platform. 

User Query: "${userInput}"

Guidelines for Response:
1. Structure your response in a clear, readable format
2. Use markdown headings (#) for main sections
3. Use bullet points for lists
4. Bold key terms with **
5. Keep responses focused on:
   - Student collaboration
   - Note sharing
   - Learning resources
   - Platform navigation
6. If query is off-topic, politely redirect to relevant features`;

    const result = await model.generateContent(contextPrompt);
    const response = result.response;
    const text = response.text();
    setMessages([...messages, userMessage, { text, user: false }]);
    setLoading(false);
    setUserInput("");
  };

  const toggleChat = () => setIsOpen(!isOpen);

  const renderMessage = (item, index) => (
    <div key={index} 
      className={`mb-4 ${item.user ? 'ml-auto max-w-[80%]' : 'mr-auto max-w-[80%]'}`}>
      <div className={`p-4 rounded-2xl shadow-md backdrop-blur-sm
        ${item.user 
          ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-br-none' 
          : 'bg-gradient-to-r from-gray-100 to-gray-50 text-gray-800 rounded-bl-none'}`}>
        <div className="prose prose-sm max-w-none">
          {item.text.split('\n').map((line, i) => {
            const formattedLine = line
              .replace(/^# (.*$)/gm, '<h1 class="text-xl font-bold mt-3 mb-2">$1</h1>')
              .replace(/^## (.*$)/gm, '<h2 class="text-lg font-semibold mt-2 mb-1">$1</h2>')
              .replace(/\*\*(.*?)\*\*/g, '<strong class="font-medium">$1</strong>')
              .replace(/^\- (.*$)/gm, '<li class="ml-4 my-1">$1</li>');
            
            return <div key={i} dangerouslySetInnerHTML={{__html: formattedLine}} />;
          })}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <button 
        className="fixed bottom-8 right-8 bg-gradient-to-r from-blue-600 to-blue-500 text-white p-4 rounded-full 
          shadow-lg hover:shadow-xl hover:scale-110 transform transition-all duration-300
          flex items-center justify-center z-50 animate-bounce" 
        onClick={toggleChat}
        style={{ width: '65px', height: '65px' }}
      >
        <FaRobot className="text-2xl" />
      </button>

      {isOpen && (
        <div className="fixed bottom-28 right-8 w-[400px] bg-white rounded-2xl 
          shadow-2xl overflow-hidden z-50 border border-gray-100 animate-slideUp">
          <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white p-5 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <FaRobot className="text-2xl" />
              <h3 className="font-bold text-xl">Study Assistant</h3>
            </div>
            <button 
              onClick={toggleChat}
              className="p-2 hover:bg-white/20 rounded-full transition-colors duration-300"
            >
              <FaTimes className="text-xl" />
            </button>
          </div>

          <div className="h-[550px] overflow-y-auto p-6 bg-gradient-to-b from-gray-50 to-white">
            {messages.map(renderMessage)}
            {loading && (
              <div className="flex items-center gap-2 text-blue-500 ml-2">
                <div className="w-2 h-2 rounded-full animate-bounce bg-blue-500"></div>
                <div className="w-2 h-2 rounded-full animate-bounce bg-blue-500 delay-100"></div>
                <div className="w-2 h-2 rounded-full animate-bounce bg-blue-500 delay-200"></div>
              </div>
            )}
          </div>

          <div className="border-t border-gray-100 bg-white p-4 flex gap-3">
            <input
              type="text"
              placeholder="Ask about study resources..."
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
              className="flex-grow p-3 border border-gray-200 rounded-xl focus:outline-none 
                focus:ring-2 focus:ring-blue-500 bg-gray-50 placeholder-gray-400
                transition-all duration-300"
            />
            <button 
              onClick={sendMessage} 
              disabled={loading || !userInput.trim()}
              className={`p-3 rounded-xl flex items-center justify-center w-14
                transition-all duration-300 transform hover:scale-105
                ${loading || !userInput.trim() 
                  ? 'bg-gray-200 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-md'}`}
            >
              <FaPaperPlane className={`${loading ? 'animate-pulse' : ''} transform -rotate-45`} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;
