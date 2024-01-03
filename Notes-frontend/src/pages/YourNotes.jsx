import React, { useState } from 'react'
import axios from 'axios'
import BookCard from '../components/BookCard'

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
            console.log(error)
        }
    }

    useState(() => {
        fetchUserNotes()
    }, [])



    return (
        <div>
            <div className='flex flex-wrap justify-center'>
                {
                    UserNotes?.length === 0 ? <h1 className='text-black text-2xl'>No Notes To Display</h1> : (
                        UserNotes?.map((note, index) => (
                            <BookCard key={index} note={note} />
                        ))
                    )
                }
            </div>

        </div>
    )
}

export default YourNotes
