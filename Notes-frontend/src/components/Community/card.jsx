import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux'
import { joinCommunity, leaveCommunity } from '../../helpers/commFn'
import { useUpdate } from '../../context/communityCntxt'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const Card = ({ comm, ind, hello }) => {
  const user = useSelector((state) => state?.user?.user)
  const { triggerUpdate, setCurrentCommunity } = useUpdate()
  const [joinmodalOpen, setjoinmodalOpen] = useState(false);
  const [leavemodalOpen, setLeavemodalOpen] = useState(false);

  const openleavemodal = () => {
    setLeavemodalOpen(true);
  }

  const closeleavemodal = () => {
    setLeavemodalOpen(false);
  }


  const [password, setPassword] = useState('')
  const handleInputChange = (e) => {
    setPassword(e.target.value)
  }

  const openjoinmodal = () => {
    setjoinmodalOpen(true);
  }

  const closejoinmodal = () => {
    setjoinmodalOpen(false);
  }

  const handleSubmit = async (id) => {
    const res = await joinCommunity(id, password)
    if (res.status === 200) {
      toast.success(res.message)
      triggerUpdate()
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
    <div className='pb-0 items-center'>

      <div key={ind} className="flex flex-col gap-4 mt-4 mx-auto rounded-2xl bg-white">
        <div className="flex justify-between items-center bg-white shadow-md rounded-xl p-2 ">
          <div className="flex flex-col lg:flex-row gap-4 items-left w-full lg:w-fit">
            <img
              src={comm?.image ? comm.image : "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg"}
              alt="community"
              className="xl:flex-1/3 flex-1 max-h-36 rounded-2xl "
            />
            <div className="">
              <h1 className="font-semibold text-lg">Community Name: {comm.name}</h1>
              <p className="text-sm"><span className='text-black  font-semibold'>Admin</span>: {comm.creator.username}</p>
              <p className="text-sm"><span className='text-black  font-semibold'>Description</span>: {comm.description}</p>
              <div className='flex justify-between'>
                <p className="text-sm"><span className='text-black  font-semibold'>Members</span>: {comm.members.length}</p>
              </div>
              <div className='gap-4 mt-2'>
                {comm.members.includes(user._id) ? (<>
                  <button onClick={openleavemodal} className="bg-red-500 hover:bg-red-400 text-white font-bold py-2 px-4 rounded">
                    <i class="bi bi-box-arrow-left mr-1"></i>
                    Leave </button>
                  <button onClick={() => {
                    setCurrentCommunity(comm);

                    navigate(`/community-chat`);

                  }} className="bg-green-500 hover:bg-blue- ml-2 hover:bg-green-400 text-white font-bold py-2 px-4 rounded">
                    <i class="bi bi-broadcast-pin mr-1"></i>
                    Chat </button>
                </>)
                  : <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    onClick={openjoinmodal}
                  >
                    {comm?.password ? (<><i class="bi bi-lock mr-1 "></i> Join</>) : (<><i class="bi bi-unlock mr-1"></i>Join</>)}


                  </button>}

                {joinmodalOpen && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">

                    <div className="bg-white p-6 rounded-lg shadow-lg flex-row gap-2">
                      {comm?.password ? (<>
                        <div className='mb-4 w-[250px] xl:w-[400px]'>
                          <label
                            htmlFor="floating_text"
                            className="block text-gray-700 dark:text-gray-700 transform duration-300 font-bold text-xl"
                          >
                            PASSWORD
                          </label>
                          <input
                            type="text"
                            name="password"
                            id="floating_text"
                            className="block w-full text-sm text-black border-b-2 border-gray-300 focus:outline-none"
                            placeholder=" "
                            required
                            onChange={handleInputChange}
                          />
                        </div>
                      </>) : (<><h3 className='my-4 text-xl'>Are you sure you want to join {comm.name}?</h3></>)}
                      <div className='flex gap-3'>
                        <button onClick={() => handleSubmit(comm._id)} className='border border-black rounded-lg bg-green-500 hover:bg-blue- ml-2 hover:bg-green-400 text-white font-bold py-2 px-4'>
                          <i class="bi bi-box-arrow-in-right mr-1"></i>
                          Join</button>
                        <button onClick={closejoinmodal} className='border border-black rounded-lg bg-red-500 hover:bg-red-400 text-white font-bold py-2 px-4'>
                          <i class="bi bi-x-lg mr-1"></i>
                          Close</button>
                        {/* <button onClick={closejoinmodal} className='border bg-red-500 border-black rounded-lg p-1'>
                        <i class="bi bi-trash mr-1"></i>Delete</button> */}
                        {/* <Groupsetting group={group}  setjoinmodalOpen={setjoinmodalOpen}/> */}
                      </div>
                    </div>
                  </div>
                )}

                {leavemodalOpen && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">

                    <div className="bg-white p-6 rounded-lg shadow-lg flex-col gap-2  w-[250px] xl:w-[400px] items-center flex ">
                      <p className='text-2xl text-center mb-4 font-bold'>Are You Sure!!!</p>
                      <div className='flex gap-3'>
                        <button onClick={() => handleLeave(comm._id)} className='border border-black rounded-lg bg-red-500 hover:bg-red-400 text-white font-bold py-2 px-4 rounded"'>
                          <i class="bi bi-box-arrow-left mr-1"></i>
                          Leave</button>
                        <button onClick={closeleavemodal} className='border border-black rounded-lg bg-green-500 hover:bg-blue- ml-2 hover:bg-green-400 text-white font-bold py-2 px-4'>
                          <i class="bi bi-x-lg mr-1"></i>
                          Close</button>
                        {/* <button onClick={closejoinmodal} className='border bg-red-500 border-black rounded-lg p-1'>
                        <i class="bi bi-trash mr-1"></i>Delete</button> */}
                        {/* <Groupsetting group={group}  setjoinmodalOpen={setjoinmodalOpen}/> */}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Card