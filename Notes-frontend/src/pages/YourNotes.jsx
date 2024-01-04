import React, { useState } from 'react'
import axios from 'axios'
import NewCard from '../components/YourNotes/NewCard'
import ChatLay from '../components/Layout/ChatLay';

const YourNotes = () => {

    const [UserNotes, setUserNotes] = useState([])


    const fetchUserNotes = async () => {
        try {
            const res = await axios.get(`http://localhost:4000/api/v1/notes/getUserUploadedNotes`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('authtoken')}`
                },
            })


            setUserNotes(res.data.data)

        } catch (error) {
        }
    }

    useState(() => {
        fetchUserNotes()
    }, [])



    return (
        <ChatLay>
            <div>
                <center >
                    <h1 className='text-4xl justify-center mt-8 '>YOUR UPLOADED NOTES</h1>
                </center>
                <div className='flex flex-wrap justify-center mt-12 '>

                    {
                        UserNotes?.length === 0 ? <h1 className='text-black text-2xl'>No Notes To Display</h1> : (
                            UserNotes?.map((note, index) => (
                                <NewCard key={index} note={note} />
                            ))
                        )
                    }
                </div>

            </div>
        </ChatLay>
    )
}

export default YourNotes
