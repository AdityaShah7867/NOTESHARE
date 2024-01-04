import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../components/Layout/Video'
import IMG from "../components/Land/cde.png"


const Video = () => {
    const navigate = useNavigate();
    const [roomCode, setRoomCode] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        navigate(`/room/${roomCode}`);
    };

    return (
        <MainLayout>
            <form onSubmit={handleSubmit}>
                <div className='align-middle justify-center pt-36  '>
                    <div className="container mx-auto flex justify-center items-center align-middle min-h-screen">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 p-6 -mt-16  bg-white shadow-xl border-2 rounded-lg mx-5  ">
                            <div className="md:rounded-lg md:flex md:justify-center md:items-center md:flex-col">
                                {/* You can insert an image here if needed */}
                                <img src={IMG} alt="" className='' style={{ width: '50%' }} />
                            </div>
                            <div className="md:mt-0 flex flex-col justify-center md:ml-9">
                                <div className="mb-4">
                                    <h3 className="text-xl font-semibold">Enter the room code here:</h3>
                                </div>
                                <div className="flex items-center mb-3">
                                    <input
                                        value={roomCode}
                                        onChange={(e) => setRoomCode(e.target.value)}
                                        type="text"
                                        className="border border-gray-300 rounded-lg p-2 w-full"
                                        placeholder="Enter the room code"
                                        required
                                    />
                                </div>
                                <div className="flex justify-center">
                                    <button
                                        className="bg-blue-500 text-white hover:bg-blue-700 font-semibold py-2 px-4 rounded-lg w-full"
                                        type="submit"
                                    >
                                        Enter the room
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </MainLayout>
    );
};

export default Video;