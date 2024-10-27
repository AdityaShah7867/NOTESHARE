import React, { FC } from 'react'
import { FaBook, FaShare, FaUsers, FaCode } from 'react-icons/fa'

const Index: FC = () => {
  return (
    <div className="p-6">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-blue-600">Welcome to NoteShare</h1>
        <p className="text-gray-600 mt-2">Your collaborative learning platform</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 border rounded-lg bg-blue-50">
          <FaBook className="text-blue-500 text-xl mb-2" />
          <h2 className="font-semibold">Study Resources</h2>
          <p className="text-sm text-gray-600">Access and share study notes, books, and materials</p>
        </div>

        <div className="p-4 border rounded-lg bg-green-50">
          <FaShare className="text-green-500 text-xl mb-2" />
          <h2 className="font-semibold">Easy Sharing</h2>
          <p className="text-sm text-gray-600">Share notes instantly with your peers</p>
        </div>

        <div className="p-4 border rounded-lg bg-purple-50">
          <FaUsers className="text-purple-500 text-xl mb-2" />
          <h2 className="font-semibold">Communities</h2>
          <p className="text-sm text-gray-600">Join study groups and collaborate</p>
        </div>

        <div className="p-4 border rounded-lg bg-orange-50">
          <FaCode className="text-orange-500 text-xl mb-2" />
          <h2 className="font-semibold">Practice</h2>
          <p className="text-sm text-gray-600">Access LeetCode practice and coding resources</p>
        </div>
      </div>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500">Use this extension to quickly save and organize your study materials</p>
      </div>
    </div>
  )
}

export default Index
