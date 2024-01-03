import React, { useState } from 'react'
import HomeLay from '../components/Layout/HomeLay'

const Ai = () => {
    const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  return (
    <HomeLay>
    <div>
    <div className="max-w-md mx-auto mt-9 border-2 border-gray-500 p-4 bg-white rounded-xl overflow-hidden md:max-w-2xl">
    <div className="md:flex">
        <div className="md:flex-shrink-0">
          <img
            className="h-48 w-full object-cover md:w-48"
            src="https://telemedixx.vercel.app/static/media/bot.9f697a4e315213b2f78e.png"
            alt="Card Image"
          />
        </div>
        <div className="p-8">
          <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">
            Question
          </div>
          <input
            type="text"
            className="mt-2 w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Enter your question"
          />
          <div className="mt-4">
            <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">
              Answer
            </div>
            <input
              type="text"
              className="mt-2 w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Answer by Bot "
            />
          </div>
        </div>
      </div>
    </div>
    </div>
    </HomeLay>
  )
}

export default Ai