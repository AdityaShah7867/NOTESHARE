import React from 'react'

const ChatLay = ({ children }) => {
    return (
        <div className="flex-grow bg-white">
            <div className="flex justify-center">
                <div className="w-full md:w-2/3 lg:w-full lg:ml-96 sm:p-2 " >

                    {children}
                </div>
            </div>
        </div>

    )
}

export default ChatLay