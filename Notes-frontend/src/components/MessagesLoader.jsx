import React from 'react'

const MessagesLoader = () => {
    return (
        <div>
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-black"></div>
                <p className="text-black text-2xl ml-4">Chat Loading...</p>
            </div>
        </div>
    )
}

export default MessagesLoader