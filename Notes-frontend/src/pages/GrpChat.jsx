import React, { useEffect, useState } from 'react';
import ChatLay from '../components/Layout/ChatLay';
import { useNavigate, useParams } from 'react-router-dom';
import { deleteCommunity, fetchCommMessages, sendMessage, updateCommunityData } from '../helpers/commFn';
import { useSelector } from 'react-redux';
import { useUpdate } from '../context/communityCntxt';
import { toast } from 'react-toastify';
import Loader from '../components/Loader';
import GroupDiscussionLayout from '../components/Layout/Nviewer';
import MessagesLoader from '../components/MessagesLoader';

const GrpChat = () => {
  const [messages, setMessages] = useState([]);
 
  const { socket, cuurentCommunity } = useUpdate();
  const id = cuurentCommunity?._id;
  const name = cuurentCommunity?.name;
  const admin = cuurentCommunity?.creator?.username;
  const user = useSelector((state) => state?.user?.user);
  const [message, setMessage] = useState('');
  const [messagesLoading, setMessagesLoading] = useState(false);
  useEffect(() => {
    const fetchMessages = async () => {
      setMessagesLoading(true);
      const res = await fetchCommMessages(id);
      if (res.status === 200) {
        setMessages(res.messages);
        setMessagesLoading(false);
      }
    }
    fetchMessages();
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (message === '') {
      toast.warning('Please fill all the fields');
      return;
    }
    if (message.length > 500) {
      toast.warning('Message should be less than 100 characters');
      return;
    }
    setMessages(prevMessages => [
      ...prevMessages,
      { content: message, sender: { _id: user?._id, username: user?.username, profile: user?.profile } }
    ]);
    socket.emit('send-message', { message, id, username: user?.username, profile: user?.profile, _id: user?._id });
    const res = await sendMessage(message, id);

    if (res.status === 200) {
      setMessage('');
    }
  }

  useEffect(() => {
    socket.emit('join', { id, username: user?.username });
    socket.on('new-user', (data) => {

      toast.info(`${data.message}`);

    });
    socket.on('user-disconnected', (data) => {
      toast.info(`${data.message}`);
    });
    socket.on('new-message', (data) => {
      toast.info(`${data.message.sender._id === user._id ? 'You' : data.message.sender.username} sent a message in ${name}`);
      setMessages(prevMessages => [
        ...prevMessages,
        { content: data.message.content, sender: { _id: data.message.sender._id, username: data.message.sender.username, profile: data.message.sender.profile } }
      ]);
    })
    return () => {
      socket.emit('leave', id);
      socket.off();
    }
  }, [socket]);

  const [SettingmodalOpen, setSettingmodalOpen] = useState(false);

  const openSettingmodal = () => {
    setSettingmodalOpen(true);
  }

  const closeSettingmodal = () => {
    setSettingmodalOpen(false);
  }

  const [cmDeatils, setCmDetails] = useState({
    name: '',
    password: '',
    description: '',
    image: '',
  });

  const handleInputChange = (e) => {
    setCmDetails({
      ...cmDeatils,
      [e.target.name]: e.target.value
    })
  }
  const handlePictureChange = (e) => {
    const selectedFile = e.target.files[0];
    setCmDetails({ ...cmDeatils, image: selectedFile });
  };

  const navigate = useNavigate();



const [loading, setLoading] = useState(false);

const updateTheCommunity = async () => {
  setLoading(true);
 

  const res = await updateCommunityData(cuurentCommunity._id, cmDeatils).finally(() => {
    setLoading(false);
  });
  if (res.status === 200) {
    toast.success(res.message);
    closeSettingmodal();
    navigate('/communities');
  } else {
    toast.error(res.message);
  }
}

const deleteTheCommunity = async () => {
  setLoading(true);
  const res = await deleteCommunity(cuurentCommunity._id).finally(() => {
    setLoading(false);
  })

  if (res.status === 200) {
    toast.success(res.message);
    closeSettingmodal();
    navigate('/communities');
    
  } else {
    toast.error(res.message);
  }
}

  return (
    <ChatLay>
      <div className="min-h-screen bg-gray-100 flex flex-col border-2 m-5">
        {/* Header */}
        <div className="bg-white shadow">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold leading-tight text-gray-900">{name}</h1>
            <p className="mt-1 text-lg text-gray-600">Created by: {admin}</p>

          </div>
          {cuurentCommunity?.creator?._id === user?._id && (<>
            <div className="absolute top-8 right-10">
            <button
              onClick={openSettingmodal}
            >
              <p className="text-xl hover:text-black text-gray-500"><i className="fa-solid fa-gear"></i></p>
            </button>
          </div>
          </>)}
          {SettingmodalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col gap-2">
                <p className='text-center font-bold text-xl'>Community Settings</p>
                <div>
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Name
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="name"
                        id="name"
                        value={cmDeatils.name}
                        onChange={handleInputChange}
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md mb-2"
                        placeholder="Community Name"
                      />
                    </div>
                    {cuurentCommunity?.password && (
                    <>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Password
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="password"
                        id="name"
                        value={cmDeatils.password}
                        onChange={handleInputChange}
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md mb-2"
                        placeholder="Community Password"
                      />
                    </div>
                    </>)}
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Bio
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="description"
                        value={cmDeatils.description}
                        onChange={handleInputChange}
                        id="name"
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md mb-2"
                        placeholder="Community Bio"
                      />
                    </div>
                    <div className='mt-1 mb-3'>
                      <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">Group Icon</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePictureChange}
                      />
                    </div>
                  </div>
                </div>
                <div className='flex gap-3'>
                  <button disabled={loading} onClick={() => updateTheCommunity()} className='border border-black rounded-lg p-1 font-semibold'>
                    <i class="bi bi-sticky mr-1"></i>
                    Save</button>
                  <button onClick={closeSettingmodal} className='border border-black rounded-lg p-1 font-semibold'>
                    <i class="bi bi-x-lg mr-1"></i>
                    Close</button>
                  <button disabled={loading} onClick={() => deleteTheCommunity()} className='border bg-red-500 border-black rounded-lg p-1 font-semibold'>
                    <i class="bi bi-trash mr-1"></i>Delete community</button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Chat messages */}

        <div className='mb-24  pb-28  lg:mb-0 overflow-scroll max-h-[80%]'>
          {
            messagesLoading ? (
              <MessagesLoader />
            ) : <div>
              {messages.map((msg, id) => (
                <div className="flex-1  px-4 py-6 sm:px-6 lg:px-8  ">
                  {msg.sender._id === user._id ? (
                    <>
                      <div className="flex flex-col space-y-2">
                        <div div className="flex items-end justify-end" >
                          <div className="mr-4">
                            <div className="bg-indigo-600 rounded-lg px-4 py-2 shadow text-white">
                              <p className="text-lg">{msg.content}</p>
                            </div>
                          </div>
                          <div className="flex-shrink-0">
                            <img
                              className="h-10 w-10 rounded-full"
                              src={process.env.REACT_APP_API_HOST+'/'+msg?.sender?.profile}
                              alt="User avatar"
                            />
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (<>
                    <div className="flex flex-col space-y-2  ">
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <img
                            className="h-10 w-10 rounded-full"
                            src={process.env.REACT_APP_API_HOST+'/'+msg?.sender?.profile}
                            alt="User avatar"
                          />
                        </div>
                        <div className="ml-4">
                          <div className="bg-white rounded-lg px-4 py-2 shadow">
                            <p className="text-sm text-gray-500">{msg.sender.username}</p>
                            <p className="text-lg">{msg.content}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                  </>)}

                </div >

              ))}
            </div>
          }


        </div>

        <div className="bg-white shadow   bottom-0 w-full mb-16 xl:mb-0 fixed mt-2">
          <div className="max-w-7xl  py-4 px-4 sm:px-6 lg:px-8">
            <form onSubmit={handleSubmit} className="flex space-x-3">
              <div className="flex-1">
                <label htmlFor="message" className="sr-only">
                  Message
                </label>
                <input
                  type="text"
                  name="message"
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="Type your message here"
                />
              </div>
              <button
                type="submit"
                disabled={message.length === 0}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Send
              </button>
            </form>
          </div>
        </div>
      </div >
    </ChatLay >
  );
};

export default GrpChat;