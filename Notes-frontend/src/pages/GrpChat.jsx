import React, { useEffect, useState } from 'react';
import ChatLay from '../components/Layout/ChatLay';
import { useParams } from 'react-router-dom';
import { fetchCommMessages, sendMessage } from '../helpers/commFn';
import { useSelector } from 'react-redux';
import { useUpdate } from '../context/communityCntxt';
import { toast } from 'react-toastify';
import Loader from '../components/Loader';
import GroupDiscussionLayout from '../components/Layout/Nviewer';
import MessagesLoader from '../components/MessagesLoader';

const GrpChat = () => {
  const [messages, setMessages] = useState([]);
  const { name, admin, id } = useParams();
  const { triggerUpdate, update, socket } = useUpdate();
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


  return (
    <ChatLay>
      <div className="min-h-screen bg-gray-100 flex flex-col  relative">
        {/* Header */}
        <div className="bg-white shadow">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold leading-tight text-gray-900">{name}</h1>
            <p className="mt-1 text-lg text-gray-600">Created by: {admin}</p>
          </div>
          <div className="absolute top-3 right-2">
            <button
              onClick={openSettingmodal}
            >
              <p className="text-xl hover:text-black text-gray-500"><i className="fa-solid fa-gear"></i></p>
            </button>
          </div>
          {/* {
                  user._id === group.groupAdminId ?
                    (
                      <div className="absolute top-3 right-2">
                        <button 
                        // onClick={openSettingmodal}
                        >
                          <p className="text-xl hover:text-black text-gray-500"><i className="fa-solid fa-gear"></i></p>
                        </button>
                      </div>
                    )
                    :
                    (
                      null
                    )
                } */}
        </div>
        {SettingmodalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg flex gap-2">
              <button onClick={closeSettingmodal} className='border border-black rounded-lg p-1'>
              <i class="bi bi-sticky mr-1"></i>
                Save</button>
              <button onClick={closeSettingmodal} className='border border-black rounded-lg p-1'>
              <i class="bi bi-x-lg mr-1"></i>
                Close</button>
              <button onClick={closeSettingmodal} className='border bg-red-500 border-black rounded-lg p-1'>
              <i class="bi bi-trash mr-1"></i>Delete</button>
              {/* <Groupsetting group={group}  setSettingmodalOpen={setSettingmodalOpen}/> */}
            </div>
          </div>
        )}
      </div>

      {/* Chat messages */}

        <div className='mb-16 pb-16 lg:pb-0 lg:mb-0 overflow-scroll max-h-[80%]'>
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
                              src={msg.sender.profile}
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
                            src={msg.sender.profile}
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

      {/* Message input */}
      <div className="bg-white shadow  absolute bottom-0 w-full mb-16 xl:mb-0mb-16 xl:mb-0">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
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
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <i class="bi bi-send mr-1"></i>
              Send
            </button>
          </form>
        </div>
      </div>
    {/* </div > */}
    {/* // </div > */}
    </ChatLay >
  );
};

export default GrpChat;