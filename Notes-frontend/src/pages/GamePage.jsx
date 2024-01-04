import React, { useEffect, useState } from "react";
import { useSocket } from '../context/communityCntxt';
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const GamePage = () => {
    const { username, roomCode } = useParams();
    const { socket } = useSocket();

    const [user, setUser] = useState("");
    const [sentence, setSentence] = useState("");
    const [typedSentence, setTypedSentence] = useState("");
    const [waiting, setWaitingTrue] = useState(true);
    const [submitted, setSubmitted] = useState(false);
    const [winner, setWinner] = useState(false);
    const navigate = useNavigate()

    const handleSubmit = () => {
        if (sentence.trim().toLowerCase() === typedSentence.trim().toLowerCase()) {
            const currentTime = new Date().toLocaleTimeString();
            toast.success(`Correct! Submission time: ${currentTime}`);
            socket.emit("game:submit", { username, currentTime });
            setSubmitted(true);
        } else {
            toast.warning("Incorrect, please retry");
        }
    };



    useEffect(() => {
        socket.on("game:joined", (data) => {
            console.log(data);
        });

        socket.on("game:start", (data) => {
            setWaitingTrue(false);
            console.log("game:start", data);
            setSentence(data);
        });

        socket.on("game:winner", (winner) => {
            setWinner(true);
            toast.success(`Winner is ${winner}`);
            setTimeout(() => {
                navigate('/game')
            }, 5000)
        });
    }, [socket]);

    return (
        <div className="p-10 ">
            <div className="p-10">
                <div className="font-bold flex justify-center items-center text-6xl  text-black ">
                    Welcome, {username}
                </div>

                {waiting ? (
                    <div className="flex justify-center items-center text-6xl bg-white text-black">
                        Gathering fellow challengers. Hold tight!
                    </div>
                ) : (
                    <div
                        className=" justify-center text-6xl bg-white text-black"
                        style={{ color: "#2563eb", fontWeight: "800" }}
                    >
                        <h1 class="text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-blue-600 font-extrabold text-3xl md:text-4xl lg:text-6xl">
                            Type Rivals: Keyboard Showdown!
                        </h1>
                        <h2 class="font-medium text-lg text-center text-gray-500 mt-2">
                            How fast can you type?
                        </h2>
                    </div>
                )}

                {sentence && !submitted ? (
                    <div className=" justify-center mt-24">
                        {winner ? (
                            <div className="text-xl text-black font-bold">{winner}</div>
                        ) : (
                            <center>
                                <div class="max-h-32 overflow-hidden rounded-lg bg-white border-blue-300 border-dashed border-2 p-3 lg:p-4 leading-10 md:leading-11">
                                    <span
                                        class="font-medium text-2xl md:text-3xl lg:text-4xl  rounded-md text-gray-900 px-1"
                                        style={{ userSelect: "none", fontFamily: "Arial" }}
                                    >
                                        {sentence}
                                    </span>
                                </div>

                                <div class="flex mt-12">

                                    <textarea
                                        onChange={(e) => setTypedSentence(e.target.value)}
                                        value={typedSentence}
                                        name="typedSentence"
                                        className=" border-4 rounded-lg px-4 py-2 w-full  h-20 "
                                        type="text"
                                        placeholder="Write something here..."
                                    />
                                </div>

                                <div className=" items-center mt-8 ">
                                    {/* <textarea
                    type="text"
                    name="typedSentence"
                    onChange={(e) => setTypedSentence(e.target.value)}
                    value={typedSentence}
                    className="border-2 border-red-500 mt-4 bg-gray-100 text-green-500 rounded-md p-2 m-2 focus:outline-none w-full"
                    rows={6}
                  /> */}
                                    <br />
                                    <button
                                        className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-bold py-3 px-6 rounded-full shadow-lg transform transition-all duration-500 ease-in-out hover:scale-110 hover:brightness-110 hover:animate-pulse active:animate-bounce"
                                        onClick={handleSubmit}
                                    >
                                        Submit
                                    </button>
                                </div>
                            </center>
                        )}
                    </div>
                ) : null}
                <div>
                </div>

            </div>
        </div>
    );
};

export default GamePage;