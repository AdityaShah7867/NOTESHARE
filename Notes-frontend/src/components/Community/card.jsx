import React from 'react'

const card = ({ comm, ind, hello }) => {
  return (
    <div>
     
        <div key={ind} className="flex flex-col gap-4 mt-4 mx-auto rounded-2xl bg-white">
          <div className="flex justify-between items-center bg-white shadow-md rounded-md p-2">
            <div className="flex gap-4 items-center">
              <img
                src="https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg"
                alt="community"
                className="w-10 h-10 rounded-full"
              />
              <div className="">
                <h1 className="font-semibold text-lg">Community Name: {comm.name}</h1>
                <p className="text-sm">Admin: {comm.creator.username}</p>
                <p className="text-sm">Description: {comm.description}</p>
              </div>
            </div>
          </div>
        </div>
    </div>
  )
}

export default card