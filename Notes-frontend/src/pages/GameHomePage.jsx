import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSocket } from '../context/communityCntxt';
import { useDispatch, useSelector } from "react-redux";

const GameHomePage = () => {

    const user = useSelector((state) => state?.user?.user)

    useEffect(() => {
        console.log(user)
    }, [user])


    const [username, setUserName] = useState(user.username);
    const [roomCode, setRoomCode] = useState('');
    const { socket } = useSocket();


    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();

        socket.emit('game:join', { username, roomCode });

        await socket.on('game:full', (msg) => {
            alert(msg);
            return;
        })

        await socket.on('game:joined', (msg) => {
            console.log('game joined')
            if (username && roomCode) {
                navigate(`/room/${username}/${roomCode}`, { username, roomCode });
            }
        }
        )
    }


    return (
        <div className="min-h-screen flex items-center justify-center bg-cover bg-center -mt-10" style={{ backgroundImage: "url('https://w0.peakpx.com/wallpaper/132/903/HD-wallpaper-pixel-game-art-background-2d-pixel-art.jpg')" }}>
            <div className="max-w-md w-full bg-white p-8 rounded-md shadow-md">
                <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-6">Enter Details To Start</h2>

                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>

                        <label htmlFor="username" className="block text-gray-600 text-sm font-medium mb-2">Username</label>
                        <div id="username" name="username" className="w-full focus:outline-none focus:border-blue-500 rounded-md">
                            {user.username}
                        </div>
                    </div>
                    <div>
                        <label htmlFor="username" className="block text-gray-600 text-sm font-medium mb-2">Room Code</label>
                        <label htmlFor="password" className="sr-only">
                            Room Code
                        </label>
                        <div className="relative">
                            <input type="text" id="roomCode" name="roomCode" className="w-full px-3 py-2 border focus:outline-none focus:border-blue-500 rounded-md"
                                onChange={(e) => {
                                    setRoomCode(e.target.value);
                                }}
                            />

                        </div>
                    </div>



                    <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600">Join</button>
                </form>
            </div>
        </div>
    )
}

export default GameHomePage
