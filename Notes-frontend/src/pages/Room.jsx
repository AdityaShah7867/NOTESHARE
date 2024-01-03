import React from 'react'
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt'
import { useParams } from 'react-router-dom'
import MainLayout from '../components/Layout/Boost'
import { useSelector } from 'react-redux'

const Room = () => {
    const user = useSelector((state) => state?.auth?.user)
    const { roomId } = useParams();

    const Mymeeting = async (element) => {
        const appID = 1792340178;

        const serverSecret = "11e25d072a125632cf37fa93ed2ec990";

        const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(appID, serverSecret, roomId, Date.now().toString(), user?.username || 'username');
        const zp = ZegoUIKitPrebuilt.create(kitToken);
        zp.joinRoom({
            container: element,

            scenario: {
                mode: ZegoUIKitPrebuilt.VideoConference,
            },
        });
    };


    return (
        <MainLayout>
            <center>
                <div className='container -ml-16 flex justify-center items-center align-middle h-screen ' >
                    <div className='w-screen p-3 pt-3 mt-3'>
                        <div ref={Mymeeting} />
                    </div>
                </div>
            </center>
        </MainLayout>

    )
}

export default Room;