import React from 'react'
import { useSelector } from 'react-redux'
import { joinCommunity, leaveCommunity } from '../../helpers/commFn'
import { useUpdate } from '../../context/communityCntxt'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const Card = ({ comm, ind, hello }) => {
  const user = useSelector((state) => state?.user?.user)
  const {triggerUpdate,cuurentCommunity, setCurrentCommunity} = useUpdate()
  const handleSubmit = async (id) => {
    const res = await joinCommunity(id)
    if (res.status === 200) {
      toast.success(res.message)
      triggerUpdate()
    } else {
      toast.warning('Something went wrong')
    }
  }
  const handleLeave = async (id) => {
    const res = await leaveCommunity(id)
    if (res.status === 200) {
      toast.success(res.message)
      
      triggerUpdate()
    } else {
      toast.warning('Something went wrong')
    }
  }
  const navigate = useNavigate();
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
                <div className='flex justify-between'>
                <p className="text-sm">Members: {comm.members.length}</p>
                {comm.members.includes(user._id) ?(<>
                  <button onClick={() => handleLeave(comm._id)} className="bg-red-500 hover:bg-black text-white font-bold py-2 px-4 rounded"> Leave </button>
                  <button onClick={() => {
                    navigate(`/grp/${comm.name}/${comm.creator.username}/${comm._id}`);
                    setCurrentCommunity(comm);

                  }} className="bg-green-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"> Chat </button>
                </>)
                : <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => handleSubmit(comm._id)}> Join </button> }
                
                  
                </div>
              </div>
            </div>
          </div>
        </div>
    </div>
  )
}

export default Card